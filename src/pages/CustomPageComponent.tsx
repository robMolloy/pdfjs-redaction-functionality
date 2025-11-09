import React, { use, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const CustomPdfPage = (p: {
  onMouseMove: (p: { x: number; y: number } | null) => void;
  pageNumber: number;
  scale: number;
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => p.onMouseMove(mousePos), [mousePos]);
  const requestAnimationFrameRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (requestAnimationFrameRef.current) return;

    const target = e.target as HTMLDivElement;
    if (!target.className.includes("react-pdf__Page__textContent"))
      return setMousePos(null);

    requestAnimationFrameRef.current = requestAnimationFrame(() => {
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
      const y = (targetHeight - targetY) / p.scale; // required for bottom-left origin

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
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Page
          pageNumber={p.pageNumber}
          scale={p.scale}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePos(null)}
        />
      </div>
    </div>
  );
};

export const CustomPageComponent = () => {
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState<number>(1);
  const [mousePos, setMousePos] = useState<{
    pageIndex: number;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div>
      <button onClick={() => setScale((scale) => (scale += 0.25))}>++++</button>
      <button onClick={() => setScale((scale) => (scale -= 0.25))}>----</button>
      <button onClick={() => setScale(1)}>Reset</button>
      Scale: {scale}
      <br />
      mousePos: {JSON.stringify({ mousePos })}
      <br />
      <Document
        file="http://localhost:5173/different-orientations-and-sizes.pdf"
        onLoadSuccess={(x) => setNumPages(x.numPages)}
      >
        {[...Array(numPages)].map((_, j) => (
          <CustomPdfPage
            key={j}
            pageNumber={j + 1}
            scale={scale}
            onMouseMove={(coords) =>
              setMousePos(coords ? { pageIndex: j + 1, ...coords } : null)
            }
          />
        ))}
      </Document>
    </div>
  );
};
