import React, { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type TCoord = { x: number; y: number };
type TCoordPair = { x1: number; y1: number; x2: number; y2: number };
type TRedaction = TCoordPair & { id: string; pageNumber: number };

type TTriggerData = [] | undefined;
const useTrigger = () => {
  const [data, setData] = useState<[]>();

  const fire = () => {
    setData(() => []);
  };

  return { data, fire };
};

const useTriggerListener = (p: {
  triggerData: TTriggerData;
  fn: () => void;
}) => {
  useEffect(() => {
    if (!p.triggerData) return;
    p.fn();
  }, [p.triggerData]);
};

const convertCoordPairToXywh = (p: TCoordPair) => {
  const xLeft = Math.min(p.x1, p.x2);
  const xRight = Math.max(p.x1, p.x2);
  const yBottom = Math.min(p.y1, p.y2);
  const yTop = Math.max(p.y1, p.y2);

  const width = xRight - xLeft;
  const height = yTop - yBottom;

  return { xLeft, yBottom, width, height };
};

type TMode = "textRedact" | "geometryRedact";

const modeStyleMap: { [k in TMode]: string } = {
  geometryRedact: `
    .react-pdf__Page__annotations a, 
    .react-pdf__Page__textContent span {
      pointer-events: none !important;
    }
    .react-pdf__Page__annotations, 
    .react-pdf__Page__textContent {
      cursor: crosshair;
    }
    `,
  textRedact: ``,
};

const ModeStyleTag = (p: { mode: TMode }) => (
  <style>{modeStyleMap[p.mode]}</style>
);

const getPdfCoords = (p: {
  screenX: number;
  screenY: number;
  scale: number;
  pdfPageRect: DOMRect;
}) => {
  const targetLeft = p.pdfPageRect.left;
  const targetTop = p.pdfPageRect.top;
  const targetBottom = p.pdfPageRect.bottom;
  const targetHeight = targetBottom - targetTop;

  const targetX = p.screenX - targetLeft;
  const targetY = p.screenY - targetTop;

  const x = targetX / p.scale;
  const y = (targetHeight - targetY) / p.scale; // required for bottom-left origin

  const pdfPageHeight = p.pdfPageRect.height / p.scale;
  const pdfPageWidth = p.pdfPageRect.width / p.scale;

  if (y > pdfPageHeight || x > pdfPageWidth || y < 0 || x < 0) return null;

  return { x, y };
};

const safeGetRangeAt = (p: { selection: Selection }) => {
  try {
    const range = p.selection.getRangeAt(0);
    return { success: true, data: range } as const;
  } catch (error) {
    return { success: false } as const;
  }
};
const getPdfCoordPairsOfHighlightedText = (p: {
  pdfPageRect: DOMRect;
  scale: number;
}) => {
  const selection = window.getSelection();
  if (!selection) return;

  const rangeResponse = safeGetRangeAt({ selection });
  if (!rangeResponse.success) return;

  const range = rangeResponse.data;
  const rects = range.getClientRects();
  const coordPairs = [...rects].map((rect) => {
    if (rect.width < 3) return;

    const coord1 = getPdfCoords({
      screenX: rect.left,
      screenY: rect.bottom,
      scale: p.scale,
      pdfPageRect: p.pdfPageRect,
    });
    const coord2 = getPdfCoords({
      screenX: rect.right,
      screenY: rect.top,
      scale: p.scale,
      pdfPageRect: p.pdfPageRect,
    });

    if (!coord1 || !coord2) return;

    const newRedaction: TCoordPair = {
      x1: coord1.x,
      y1: coord1.y,
      x2: coord2.x,
      y2: coord2.y,
    };
    return newRedaction;
  });

  return coordPairs.filter((x) => !!x);
};
const CustomPdfPage = (p: {
  onMouseMove: (p: { x: number; y: number } | null) => void;
  pageNumber: number;
  scale: number;
  mode: TMode;
  onRedactionsChange: (p: TRedaction[]) => void;
  redactHighlightedTextTriggerData: TTriggerData;
}) => {
  useTriggerListener({
    triggerData: p.redactHighlightedTextTriggerData,
    fn: () => redactHighlightedText(),
  });
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );
  useEffect(() => p.onMouseMove(mousePos), [mousePos]);

  const [firstCorner, setFirstCorner] = useState<TCoord | null>(null);
  const [redactions, setRedactions] = useState<TRedaction[]>([]);
  useEffect(() => p.onRedactionsChange(redactions), [redactions]);

  const pdfPageWrapperElmRef = useRef<HTMLDivElement | null>(null);

  const redactHighlightedText = () => {
    const pdfPageRect = pdfPageWrapperElmRef.current?.getBoundingClientRect();
    if (!pdfPageRect) return;
    const coordPairs = getPdfCoordPairsOfHighlightedText({
      pdfPageRect,
      scale: p.scale,
    });
    if (!coordPairs) return;
    if (coordPairs.length === 0) return;

    setRedactions((redactions) => [
      ...redactions,
      ...coordPairs.map((coordPair) => ({
        ...coordPair,
        id: crypto.randomUUID(),
        pageNumber: p.pageNumber,
      })),
    ]);
  };

  const requestAnimationFrameRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (requestAnimationFrameRef.current) return;

    const target = e.target as HTMLDivElement;
    if (!target.className.includes("react-pdf__Page__textContent")) {
      return;
    }
    requestAnimationFrameRef.current = requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();

      const screenX = e.clientX;
      const screenY = e.clientY;

      const coord = getPdfCoords({
        screenX,
        screenY,
        scale: p.scale,
        pdfPageRect: rect,
      });
      setMousePos(coord);

      requestAnimationFrameRef.current = null;
    });
  };

  useEffect(() => {
    return () => {
      if (requestAnimationFrameRef.current)
        cancelAnimationFrame(requestAnimationFrameRef.current);
    };
  }, []);

  return (
    <div>
      <br />
      {/* <div style={{ display: "flex", justifyContent: "center" }}> */}
      <div style={{}}>
        <div ref={pdfPageWrapperElmRef} style={{ position: "relative" }}>
          <Page
            pageNumber={p.pageNumber}
            onClick={() => {
              if (p.mode === "textRedact") return;
              if (firstCorner && mousePos) {
                const newRect = {
                  id: crypto.randomUUID(),
                  x1: firstCorner.x,
                  y1: firstCorner.y,
                  x2: mousePos.x,
                  y2: mousePos.y,
                  pageNumber: p.pageNumber,
                };
                setRedactions((redactions) => [...redactions, newRect]);
              }
              setFirstCorner(firstCorner ? null : mousePos);
            }}
            scale={p.scale}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos(null)}
          />
          {firstCorner &&
            mousePos &&
            (() => {
              const { xLeft, yBottom, width, height } = convertCoordPairToXywh({
                x1: firstCorner.x,
                y1: firstCorner.y,
                x2: mousePos.x,
                y2: mousePos.y,
              });

              return (
                <div
                  style={{
                    position: "absolute",
                    left: `${xLeft * p.scale}px`,
                    bottom: `${yBottom * p.scale}px`,
                    width: `${width * p.scale}px`,
                    height: `${height * p.scale}px`,
                    background: "rgba(0, 0, 255, 0.2)",
                    border: "2px dashed blue",
                    pointerEvents: "none",
                  }}
                />
              );
            })()}

          {redactions.map((box, i) => {
            const { xLeft, yBottom, width, height } =
              convertCoordPairToXywh(box);

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${xLeft * p.scale}px`,
                  bottom: `${yBottom * p.scale}px`,
                  width: `${width * p.scale}px`,
                  height: `${height * p.scale}px`,
                  background: "rgba(255, 0, 0, 0.3)",
                  border: "2px solid red",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    cursor: "pointer",
                    background: "white",
                    border: "1px solid black",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    color: "black",
                    zIndex: 10,
                  }}
                  onClick={() => {
                    setRedactions((prev) =>
                      prev.filter((x) => x.id !== box.id)
                    );
                  }}
                >
                  ×
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const CustomPageComponentWithRedaction = () => {
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState<number>(1);

  const redactHighlightedTextTrigger = useTrigger();

  const [mode, setMode] = useState<TMode>("geometryRedact");
  const [redactionsOnPageNumber, setRedactionsOnPageNumber] = useState<{
    [k: number]: TRedaction[];
  }>({});

  const flattenedRedactions = useMemo(() => {
    const temp: (TRedaction & { pageNumber: number })[] = [];
    Object.entries(redactionsOnPageNumber).forEach(
      ([pageNumber, redactions]) => {
        redactions.forEach((redaction) => {
          temp.push({ ...redaction, pageNumber: Number(pageNumber) });
        });
      }
    );
    return temp;
  }, [redactionsOnPageNumber]);

  return (
    <div>
      <button
        onClick={() =>
          setMode((prev) =>
            prev === "geometryRedact" ? "textRedact" : "geometryRedact"
          )
        }
      >
        Redaction mode
      </button>
      ({mode})
      <br />
      <button onClick={() => setScale((scale) => (scale += 0.25))}>++++</button>
      <button onClick={() => setScale((scale) => (scale -= 0.25))}>----</button>
      <button onClick={() => setScale(1)}>Reset</button>
      <button
        onClick={() => {
          redactHighlightedTextTrigger.fire();
          setTimeout(() => {
            const selection = window.getSelection();
            if (selection) selection?.removeAllRanges();
          }, 250);
        }}
      >
        do something
      </button>
      Scale: {scale}
      <br />
      <style>{`
      .react-pdf__Page {
        background-color: gray !important;
        display: flex;
      }
`}</style>
      <ModeStyleTag mode={mode} />
      <div
        style={{
          position: "relative",
          height: "500px",
          width: "100%",
          overflowX: "scroll",
          overflowY: "scroll",
        }}
      >
        <Document
          file="http://localhost:5173/may-plus-images.pdf"
          // file="http://localhost:5173/final.pdf"
          onLoadSuccess={(x) => setNumPages(x.numPages)}
        >
          {[...Array(numPages)].map((_, j) => (
            <CustomPdfPage
              key={j}
              pageNumber={j + 1}
              scale={scale}
              onMouseMove={() => {}}
              redactHighlightedTextTriggerData={
                redactHighlightedTextTrigger.data
              }
              mode={mode}
              onRedactionsChange={(x) => {
                setRedactionsOnPageNumber((prev) => ({ ...prev, [j]: x }));
              }}
            />
          ))}
        </Document>
      </div>
      <br />
      {flattenedRedactions.length > 0 && (
        <div
          style={{
            background: "white",
            color: "black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <span>There are {flattenedRedactions.length} redactions</span>
          <button onClick={() => setRedactionsOnPageNumber({})}>
            Clear all redactions
          </button>
        </div>
      )}
    </div>
  );
};
