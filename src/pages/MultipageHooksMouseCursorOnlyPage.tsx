import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import type { PageCallback } from "react-pdf/dist/shared/types.js";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const usePdfPageDimensions = (p: { initScale: number }) => {
  const [scale, setScale] = useState<number>(p.initScale);
  const [unscaledPageHeight, setUnscaledPageHeight] = useState<number>(0);

  const setPageHeightFromPage = (p: { page: PageCallback }) => {
    const viewport = p.page.getViewport({ scale: 1 });
    setUnscaledPageHeight(viewport.height);
  };

  return {
    scale,
    setScale,
    unscaledPageHeight,
    setUnscaledPageHeight,
    setPageHeightFromPage,
  };
};

const usePdfMousePosition = () => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );

  const requestAnimationFrameRef = useRef<number | null>(null);

  const handleMouseMove = (p: {
    e: React.MouseEvent<HTMLDivElement, MouseEvent>;
    scale: number;
    unscaledPageHeight: number;
    pagesFromBottom: number;
  }) => {
    if (requestAnimationFrameRef.current) return;

    requestAnimationFrameRef.current = requestAnimationFrame(() => {
      const target = p.e.target as HTMLDivElement;
      const rect = target.getBoundingClientRect();
      const x = (p.e.clientX - rect.left) / p.scale;
      const screenY = (p.e.clientY - rect.top) / p.scale;
      const y =
        p.unscaledPageHeight -
        screenY +
        p.pagesFromBottom * p.unscaledPageHeight;
      setMousePos({ x, y });
      requestAnimationFrameRef.current = null;
    });
  };

  return { mousePos, setMousePos, handleMouseMove };
};

export const MultipageHooksMouseCursorOnlyPage = () => {
  const [numPages, setNumPages] = useState<number>();
  const { scale, setScale, unscaledPageHeight, setPageHeightFromPage } =
    usePdfPageDimensions({ initScale: 1 });

  const { mousePos, setMousePos, handleMouseMove } = usePdfMousePosition();

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
            <Page
              key={j}
              pageNumber={j + 1}
              scale={scale}
              onMouseMove={(e) => {
                handleMouseMove({
                  e,
                  scale,
                  unscaledPageHeight,
                  pagesFromBottom: (numPages ?? 0) - 1 - j,
                });
              }}
              onMouseLeave={() => setMousePos(null)}
              onLoadSuccess={(page) => {
                setPageHeightFromPage({ page });
              }}
            />
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
