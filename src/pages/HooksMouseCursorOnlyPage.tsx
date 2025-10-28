import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const UninteractiveElementsStyleTag = () => (
  <style>
    {`
          .react-pdf__Page__textContent {
            pointer-events: none !important;
          }
          a {
            pointer-events: none !important;
          }
          section {
            pointer-events: none !important;
          }
        `}
  </style>
);

export const HooksMouseCursorOnlyPage = () => {
  const [scale, setScale] = useState<number>(1);
  const [unscaledPageHeight, setUnscaledPageHeight] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );

  const [interactiveMode, setInteractiveMode] = useState(true);

  const requestAnimationFrameRef = useRef<number | null>(null);

  return (
    <div>
      {!interactiveMode && <UninteractiveElementsStyleTag />}
      <button onClick={() => setInteractiveMode((x) => !x)}>
        Current mode: {interactiveMode ? "Interactive" : "Uninteractive"}
      </button>
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
        <Document file="http://localhost:5173/url_test_3.pdf">
          <Page
            pageNumber={1}
            scale={scale}
            onMouseMove={(e) => {
              if (requestAnimationFrameRef.current) return;

              requestAnimationFrameRef.current = requestAnimationFrame(() => {
                const rect = e.target.getBoundingClientRect();
                const x = (e.clientX - rect.left) / scale;
                const screenY = (e.clientY - rect.top) / scale;
                const y = unscaledPageHeight - screenY;
                setMousePos({ x, y });
                requestAnimationFrameRef.current = null;
              });
            }}
            onMouseLeave={() => setMousePos(null)}
            onLoadSuccess={(page) => {
              const viewport = page.getViewport({ scale: 1 });
              setUnscaledPageHeight(viewport.height);
            }}
          />
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
