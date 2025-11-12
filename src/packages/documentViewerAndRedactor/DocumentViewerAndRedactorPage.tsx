import React, { useEffect, useRef, useState } from "react";
import { Page } from "react-pdf";
import {
  PositionPdfOverlayBox,
  RedactionBox,
} from "./DocumentViewerComponents";
import {
  convertCoordPairToXywh,
  getPdfCoords,
  type TCoord,
  type TRedaction,
} from "./utils/coordUtils";
import { createId } from "./utils/generalUtils";
import { getPdfCoordPairsOfHighlightedText } from "./utils/highlightedTextUtils";
import type { TMode } from "./utils/modeUtils";
import { useTriggerListener, type TTriggerData } from "./utils/useTriggger";

export const DocumentViewerAndRedactorPage = (p: {
  onMouseMove: (p: { x: number; y: number } | null) => void;
  pageNumber: number;
  scale: number;
  mode: TMode;
  redactHighlightedTextTriggerData: TTriggerData;
  setRedactions: (p: TRedaction[]) => void;
  redactions: TRedaction[] | undefined;
}) => {
  const { pageNumber, scale, redactions, setRedactions } = p;

  const [firstCorner, setFirstCorner] = useState<TCoord | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );
  useEffect(() => setFirstCorner(null), [p.mode]);
  useEffect(() => p.onMouseMove(mousePos), [mousePos]);

  useTriggerListener({
    triggerData: p.redactHighlightedTextTriggerData,
    fn: () => {
      const pdfPageRect = pdfPageWrapperElmRef.current?.getBoundingClientRect();
      if (!pdfPageRect) return;

      const coordPairs = getPdfCoordPairsOfHighlightedText({
        pdfPageRect,
        scale,
      });

      setRedactions([
        ...(redactions ? redactions : []),
        ...coordPairs.map((coordPair) => {
          return { ...coordPair, id: createId(), pageNumber };
        }),
      ]);
    },
  });

  const pdfPageWrapperElmRef = useRef<HTMLDivElement | null>(null);
  const requestAnimationFrameRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (requestAnimationFrameRef.current)
        cancelAnimationFrame(requestAnimationFrameRef.current);
    };
  }, []);

  return (
    <div>
      <span
        style={{
          display: "block",
          margin: "auto",
          width: "fit-content",
          padding: "10px 10px 0px 10px",
        }}
      >
        <span style={{ display: "inline-flex" }}>
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
                  setRedactions([...(redactions ? redactions : []), newRect]);
                }
                setFirstCorner(firstCorner ? null : mousePos);
              }}
              scale={p.scale}
              onMouseMove={(
                e: React.MouseEvent<HTMLDivElement, MouseEvent>
              ) => {
                if (requestAnimationFrameRef.current) return;

                const target = e.target as HTMLDivElement;
                if (!target.className.includes("react-pdf__Page__textContent"))
                  return;

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
              }}
              onMouseLeave={() => setMousePos(null)}
            />
            {firstCorner &&
              mousePos &&
              (() => {
                const { xLeft, yBottom, width, height } =
                  convertCoordPairToXywh({
                    x1: firstCorner.x,
                    y1: firstCorner.y,
                    x2: mousePos.x,
                    y2: mousePos.y,
                  });

                return (
                  <PositionPdfOverlayBox
                    xLeft={xLeft}
                    yBottom={yBottom}
                    width={width}
                    height={height}
                    scale={p.scale}
                  >
                    <RedactionBox
                      background="rgba(0, 0, 255, 0.2)"
                      border="2px dashed blue"
                    />
                  </PositionPdfOverlayBox>
                );
              })()}

            {redactions?.map((box, i) => {
              const { xLeft, yBottom, width, height } =
                convertCoordPairToXywh(box);

              return (
                <PositionPdfOverlayBox
                  key={i}
                  xLeft={xLeft}
                  yBottom={yBottom}
                  width={width}
                  height={height}
                  scale={p.scale}
                >
                  <RedactionBox
                    background="rgba(255, 0, 0, 0.3)"
                    border="2px solid red"
                    onCloseClick={() =>
                      setRedactions(redactions?.filter((x) => x.id !== box.id))
                    }
                  />
                </PositionPdfOverlayBox>
              );
            })}
          </div>
        </span>
      </span>
    </div>
  );
};
