import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const CustomPdfPage = (p: { pageNumber: number; scale: number }) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [unscaledPageHeight, setUnscaledPageHeight] = useState(0);
  const requestAnimationFrameRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (requestAnimationFrameRef.current) return;

    requestAnimationFrameRef.current = requestAnimationFrame(() => {
      const target = e.target as HTMLDivElement;
      const rect = target.getBoundingClientRect();

      const screenX = e.clientX;
      const screenY = e.clientY;

      const targetLeft = rect.left;
      const targetTop = rect.top;
      const targetBottom = rect.bottom;
      const targetHeight = targetBottom - targetTop;

      const targetX = screenX - targetLeft;
      const targetY = screenY - targetTop;

      const x = targetX / p.scale;
      const y = (targetHeight - targetY) / p.scale;

      requestAnimationFrameRef.current = null;
      setMousePos({ x, y });
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
      {mousePos
        ? `x: ${mousePos.x.toFixed(2)}, y: ${mousePos.y.toFixed(2)}`
        : "N/A"}
      <Page
        pageNumber={p.pageNumber}
        scale={p.scale}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos(null)}
        onLoadSuccess={(page) => {
          const viewport = page.getViewport({ scale: 1 });
          setUnscaledPageHeight(viewport.height);
        }}
      />
    </div>
  );
};

export const CustomPageComponent = () => {
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState<number>(1);

  return (
    <div>
      <button onClick={() => setScale((scale) => (scale += 0.25))}>++++</button>
      <button onClick={() => setScale((scale) => (scale -= 0.25))}>----</button>
      <button onClick={() => setScale(1)}>Reset</button>
      Scale: {scale}
      <br />
      <Document
        file="http://localhost:5173/lots-of-pages-of-links.pdf"
        onLoadSuccess={(x) => setNumPages(x.numPages)}
      >
        {[...Array(numPages)].map((_, j) => (
          <CustomPdfPage key={j} pageNumber={j + 1} scale={scale} />
        ))}
      </Document>
    </div>
  );
};
