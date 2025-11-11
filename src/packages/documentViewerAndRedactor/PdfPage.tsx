import React, { use, useEffect, useRef, useState } from "react";
import { Page } from "react-pdf";
import {
  convertCoordPairToXywh,
  getPdfCoords,
  type TCoord,
  type TRedaction,
} from "./utils/coordUtils";
import { useTriggerListener, type TTriggerData } from "./utils/useTriggger";
import type { TMode } from "./utils/modeUtils";
import { getPdfCoordPairsOfHighlightedText } from "./utils/highlightedTextUtils";
import { createId } from "./utils/generalUtils";

export const PdfPage = (p: {
  onMouseMove: (p: { x: number; y: number } | null) => void;
  pageNumber: number;
  scale: number;
  mode: TMode;
  onRedactionsChange: (p: TRedaction[]) => void;
  redactHighlightedTextTriggerData: TTriggerData;
  redactionsFromParent: TRedaction[] | undefined;
}) => {
  const { pageNumber, scale } = p;

  const [firstCorner, setFirstCorner] = useState<TCoord | null>(null);
  const [redactions, setRedactions] = useState<TRedaction[]>([]);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );
  useEffect(() => p.onMouseMove(mousePos), [mousePos]);
  useEffect(() => p.onRedactionsChange(redactions), [redactions]);

  useEffect(() => {
    if (
      p.redactionsFromParent === undefined ||
      (p.redactionsFromParent.length === 0 && redactions.length !== 0)
    )
      setRedactions([]);
  }, [p.redactionsFromParent]);

  useTriggerListener({
    triggerData: p.redactHighlightedTextTriggerData,
    fn: () => {
      const pdfPageRect = pdfPageWrapperElmRef.current?.getBoundingClientRect();
      if (!pdfPageRect) return;

      const coordPairs = getPdfCoordPairsOfHighlightedText({
        pdfPageRect,
        scale,
      });

      setRedactions((redactions) => [
        ...redactions,
        ...coordPairs.map((coordPair) => {
          return { ...coordPair, id: createId(), pageNumber };
        }),
      ]);
    },
  });

  const pdfPageWrapperElmRef = useRef<HTMLDivElement | null>(null);
  const requestAnimationFrameRef = useRef<number | null>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (requestAnimationFrameRef.current) return;

    const target = e.target as HTMLDivElement;
    if (!target.className.includes("react-pdf__Page__textContent")) return;

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
