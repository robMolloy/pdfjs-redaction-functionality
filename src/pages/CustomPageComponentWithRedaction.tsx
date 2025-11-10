import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type TCoord = { x: number; y: number };
type TCoordPair = { x1: number; y1: number; x2: number; y2: number };

const convertCoordPairToXywh = (p: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) => {
  const xLeft = Math.min(p.x1, p.x2);
  const xRight = Math.max(p.x1, p.x2);
  const yBottom = Math.min(p.y1, p.y2);
  const yTop = Math.max(p.y1, p.y2);

  const width = xRight - xLeft;
  const height = yTop - yBottom;

  return { xLeft, yBottom, width, height };
};

type TMode = "textRedact" | "geometryRedact";

const UninteractiveElementsStyleTag = () => (
  <style>
    {`
        .react-pdf__Page__annotations *, .react-pdf__Page__textContent * {
          pointer-events: none !important;
        }
      `}
  </style>
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

  return { x, y };
};

const CustomPdfPage = (p: {
  onMouseMove: (p: { x: number; y: number } | null) => void;
  pageNumber: number;
  scale: number;
  mode: TMode;
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );
  useEffect(() => p.onMouseMove(mousePos), [mousePos]);

  const [firstCorner, setFirstCorner] = useState<TCoord | null>(null);
  const [redactions, setRedactions] = useState<TCoordPair[]>([]);

  const pdfPageWrapperElmRef = useRef<HTMLDivElement | null>(null);

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
      {p.mode === "geometryRedact" && <UninteractiveElementsStyleTag />}
      <button
        onClick={() => {
          const selection = window.getSelection();
          if (!selection) return;
          const range = selection.getRangeAt(0);
          const rects = range.getClientRects();
          [...rects].forEach((r) => {
            if (r.width < 3) return;
            if (!pdfPageWrapperElmRef.current) return;
            const pdfPageRect =
              pdfPageWrapperElmRef.current.getBoundingClientRect();

            const coord1 = getPdfCoords({
              screenX: r.left,
              screenY: r.bottom,
              scale: p.scale,
              pdfPageRect,
            });
            const coord2 = getPdfCoords({
              screenX: r.right,
              screenY: r.top,
              scale: p.scale,
              pdfPageRect,
            });

            const newRedaction = {
              x1: coord1.x,
              y1: coord1.y,
              x2: coord2.x,
              y2: coord2.y,
            };
            setRedactions((redactions) => [...redactions, newRedaction]);
          });
        }}
      >
        Redact selected text
      </button>
      <pre>{JSON.stringify({ redactions })}</pre>
      <br />
      <pre>{JSON.stringify({ firstCorner })}</pre>
      <br />
      {mousePos
        ? `x: ${mousePos.x.toFixed(2)}, y: ${mousePos.y.toFixed(2)}`
        : "N/A"}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div ref={pdfPageWrapperElmRef} style={{ position: "relative" }}>
          <Page
            pageNumber={p.pageNumber}
            onClick={() => {
              if (p.mode === "textRedact") return;
              if (firstCorner && mousePos) {
                const newRect: TCoordPair = {
                  x1: firstCorner.x,
                  y1: firstCorner.y,
                  x2: mousePos.x,
                  y2: mousePos.y,
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
                  pointerEvents: "none",
                }}
              />
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
  const [mousePos, setMousePos] = useState<{
    pageIndex: number;
    x: number;
    y: number;
  } | null>(null);

  const [mode, setMode] = useState<TMode>("textRedact");

  return (
    <div>
      <button
        onClick={() =>
          setMode((x) =>
            x === "geometryRedact" ? "textRedact" : "geometryRedact"
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
      Scale: {scale}
      <br />
      mousePos: {JSON.stringify({ mousePos })}
      <br />
      <Document
        file="http://localhost:5173/may-plus-images.pdf"
        onLoadSuccess={(x) => setNumPages(x.numPages)}
      >
        {[...Array(numPages)].map((_, j) => (
          <CustomPdfPage
            key={j}
            pageNumber={j + 1}
            scale={scale}
            onMouseMove={(coords) => {
              setMousePos(coords ? { pageIndex: j + 1, ...coords } : null);
            }}
            mode={mode}
          />
        ))}
      </Document>
    </div>
  );
};
