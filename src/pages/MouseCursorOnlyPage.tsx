import type { TextItem } from "pdfjs-dist/types/src/display/api";
import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type TRedactionOverlay = {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
type TLinkOverlay = { str: string; linkUrl: string } & TRedactionOverlay;

const createSimpleId = () => `${Math.floor(Math.random() * Math.pow(10, 10))}`;

export const MouseCursorOnlyPage = () => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [linkOverlays, setLinkOverlays] = useState<TLinkOverlay[]>([]);
  const [scale, setScale] = useState<number>(1);
  const [redactionOverlays, setRedactionOverlays] = useState<
    TRedactionOverlay[]
  >([]);
  const [unscaledPageHeight, setUnscaledPageHeight] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [firstCorner, setFirstCorner] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const requestAnimationFrameRef = useRef<number | null>(null);

  return (
    <div>
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
      First Corner:{" "}
      {firstCorner
        ? `x: ${firstCorner.x.toFixed(2)}, y: ${firstCorner.y.toFixed(2)}`
        : "N/A"}
      <br />
      <br />
      <div style={{ position: "relative" }}>
        <Document
          file="http://localhost:5173/url_test_3.pdf"
          onLoadSuccess={(x) => setNumPages(x.numPages)}
        >
          <Page
            pageNumber={1}
            scale={scale}
            onMouseMove={(e) => {
              if (!e.target.className.includes("react-pdf__Page__textContent"))
                return;

              if (requestAnimationFrameRef.current) return;

              requestAnimationFrameRef.current = requestAnimationFrame(() => {
                const rect = e.target.getBoundingClientRect();
                const x = (e.clientX - rect.left) / scale;
                const screenY = (e.clientY - rect.top) / scale;
                const y = unscaledPageHeight - screenY; // Convert to bottom-left origin
                setMousePos({ x, y });
                requestAnimationFrameRef.current = null;
              });
            }}
            onMouseLeave={() => setMousePos(null)}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) / scale;
              const screenY = (e.clientY - rect.top) / scale;
              const y = unscaledPageHeight - screenY;

              const clickPos = { x, y };

              if (!firstCorner) return setFirstCorner(clickPos);

              setRedactionOverlays([
                ...redactionOverlays,
                {
                  key: createSimpleId(),
                  x1: firstCorner.x,
                  y1: firstCorner.y,
                  x2: clickPos.x,
                  y2: clickPos.y,
                },
              ]);
              setFirstCorner(null);
            }}
            renderAnnotationLayer={true}
            renderTextLayer={true}
            onGetAnnotationsSuccess={(annotations) =>
              console.log({ annotations })
            }
            onLoadSuccess={(page) => {
              const viewport = page.getViewport({ scale: 1 });

              setUnscaledPageHeight(viewport.height);

              page
                .getAnnotations()
                .then((annotations) => console.log(annotations));

              page.getTextContent().then((textContent) => {
                const items = textContent.items as TextItem[];
                let charactersSoFar = 0;

                const newItems = items.map((item) => {
                  const str = `${item.str}${item.hasEOL ? "/n" : ""}`;

                  const x = item.transform[4];
                  const y = item.transform[5];
                  const width = item.width;
                  const height = item.height;

                  const newItem: TLinkOverlay = {
                    key: createSimpleId(),
                    linkUrl: "https://google.com",
                    str,
                    x1: x,
                    y1: y,
                    x2: x + width,
                    y2: y + height,
                  };

                  charactersSoFar += str.length;

                  return newItem;
                });

                setLinkOverlays(newItems);

                const textArray = newItems.map((x) => x.str);
                // @ts-expect-error
                const fullText = textArray.join("");

                // Search for "google"
                // const searchTerm = "google";
                // const index = fullText.toLowerCase().indexOf(searchTerm);
              });
            }}
          />
        </Document>

        {linkOverlays.map((itm, index) => {
          const xMin = Math.min(itm.x1, itm.x2);
          const xMax = Math.max(itm.x1, itm.x2);
          const yMin = Math.min(itm.y1, itm.y2);
          const yMax = Math.max(itm.y1, itm.y2);
          const width = xMax - xMin;
          const height = yMax - yMin;

          return (
            <a
              key={index}
              href={itm.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: "absolute",
                left: `${xMin * scale}px`,
                top: `${(unscaledPageHeight - yMin - height) * scale}px`,
                width: `${width * scale}px`,
                height: `${height * scale}px`,
                background: "rgba(0, 100, 255, 0.2)",
                border: "1px solid blue",
                pointerEvents: "none",
              }}
              title="Click to visit Google"
            />
          );
        })}

        {/* Redactions */}
        {redactionOverlays.map((box, i) => {
          const xMin = Math.min(box.x1, box.x2);
          const xMax = Math.max(box.x1, box.x2);
          const yMin = Math.min(box.y1, box.y2);
          const yMax = Math.max(box.y1, box.y2);
          const width = xMax - xMin;
          const height = yMax - yMin;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${xMin * scale}px`,
                bottom: `${yMin * scale}px`,
                width: `${width * scale}px`,
                height: `${height * scale}px`,
                background: "rgba(255, 0, 0, 0.3)",
                border: "2px solid red",
                pointerEvents: "none",
              }}
            />
          );
        })}

        {/* Preview rectangle while selecting */}
        {firstCorner &&
          mousePos &&
          (() => {
            const xMin = Math.min(firstCorner.x, mousePos.x);
            const xMax = Math.max(firstCorner.x, mousePos.x);
            const yMin = Math.min(firstCorner.y, mousePos.y);
            const yMax = Math.max(firstCorner.y, mousePos.y);
            const width = xMax - xMin;
            const height = yMax - yMin;

            return (
              <div
                style={{
                  position: "absolute",
                  left: `${xMin * scale}px`,
                  bottom: `${yMin * scale}px`,
                  width: `${width * scale}px`,
                  height: `${height * scale}px`,
                  background: "rgba(0, 0, 255, 0.2)",
                  border: "2px dashed blue",
                  pointerEvents: "none",
                  zIndex: 99,
                }}
              />
            );
          })()}

        {/* Mouse cursor indicator */}
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
      <p>
        Page {pageNumber} of {numPages} (Page Height: {unscaledPageHeight}px)
      </p>
      <div onClick={() => setPageNumber((x) => x + 1)}>inc</div>
      <pre>{JSON.stringify(linkOverlays, null, 2)}</pre>
    </div>
  );
};
