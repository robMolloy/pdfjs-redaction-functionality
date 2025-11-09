import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const usePdfPageDimensions = (p: { initScale: number }) => {
  const [scale, setScale] = useState<number>(p.initScale);
  const [unscaledPageHeight, setUnscaledPageHeight] = useState<number>(0);

  return {
    scale,
    setScale,
    unscaledPageHeight,
    setUnscaledPageHeight,
  };
};

const CustomPdfPage = (p: {
  pageNumber: number;
  scale: number;
  unscaledPageHeight: number;
  pagesFromBottom: number;
  onMousePositionChange: (p: { x: number; y: number } | null) => void;
}) => {
  const requestAnimationFrameRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (requestAnimationFrameRef.current) return;

    requestAnimationFrameRef.current = requestAnimationFrame(() => {
      const target = e.target as EventTarget & HTMLDivElement;
      const rect = target.getBoundingClientRect();

      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      const x = screenX / p.scale;
      const y = p.unscaledPageHeight - screenY / p.scale;

      const adjustedY = y + p.pagesFromBottom * p.unscaledPageHeight;

      p.onMousePositionChange({ x, y: adjustedY });
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
      <Page
        pageNumber={p.pageNumber}
        scale={p.scale}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => p.onMousePositionChange(null)}
        // onLoadSuccess={(page) => {}}
      />
    </div>
  );
};

export const CustomPageComponent = () => {
  const [numPages, setNumPages] = useState<number>();
  const { scale, setScale, unscaledPageHeight } = usePdfPageDimensions({
    initScale: 1,
  });

  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );

  return (
    <div>
      <br />
      <br />
      <button onClick={() => setScale((scale) => (scale += 0.25))}>++++</button>
      <button onClick={() => setScale((scale) => (scale -= 0.25))}>----</button>
      <button onClick={() => setScale(1)}>Reset</button>
      <br />
      Scale: {scale}
      <br />
      Mouse:{" "}
      {mousePos
        ? `x: ${mousePos.x.toFixed(2)}, y: ${mousePos.y.toFixed(2)}`
        : "N/A"}
      <br />
      <br />
      <div style={{ position: "relative" }}>
        <Document
          file="http://localhost:5173/lots-of-pages-of-links.pdf"
          onLoadSuccess={(x) => setNumPages(x.numPages)}
        >
          {[...Array(numPages)].map((_, j) => (
            <React.Fragment key={j}>
              <CustomPdfPage
                pageNumber={j + 1}
                scale={scale}
                unscaledPageHeight={unscaledPageHeight}
                pagesFromBottom={(numPages ?? 0) - 1 - j}
                onMousePositionChange={(coords) => setMousePos(coords)}
              />
              <br />
            </React.Fragment>
          ))}
        </Document>

        {mousePos && (
          <div
            style={{
              position: "absolute",
              left: `${mousePos.x * scale}px`,
              bottom: `${mousePos.y * scale}px`,
              width: "10px",
              height: "10px",
              background: "blue",
              borderRadius: "50%",
              pointerEvents: "none",
              transform: "translate(-50%, 50%)",
              opacity: 0.5,
            }}
          />
        )}
      </div>
    </div>
  );
};
