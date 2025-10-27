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

function App() {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [redactions, setRedactions] = useState<TRedactionOverlay[]>([]);

  const [itemsWithPosition, setItemsWithPosition] = useState<TLinkOverlay[]>(
    []
  );
  const [pageHeight, setPageHeight] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);

  const [coord1, setCoord1] = useState<{ x: number; y: number } | null>(null);
  const [coord2, setCoord2] = useState<{ x: number; y: number } | null>(null);

  const requestAnimationFrameRef = useRef<number | null>(null);

  return (
    <div>
      <button onClick={() => setScale((scale) => (scale += 0.25))}>++++</button>
      <button onClick={() => setScale((scale) => (scale -= 0.25))}>----</button>
      <button onClick={() => setScale(1)}>Reset</button>
      <br />
      scale: {scale}
      <br />
      redactLength: {redactions.length}
      <br />
      {JSON.stringify({ coord1 })}
      <br />
      <br />
      <div style={{ position: "relative" }}>
        <Document
          file="http://localhost:5173/url_test_3.pdf"
          onLoadSuccess={(x) => setNumPages(x.numPages)}
        >
          <Page
            onMouseMove={(e) => {
              if (requestAnimationFrameRef.current) return; // Skip if already scheduled

              requestAnimationFrameRef.current = requestAnimationFrame(() => {
                console.log(e);
                const rect = e.target.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = pageHeight - (e.clientY - rect.top);
                if (coord1) setCoord2({ x, y });

                requestAnimationFrameRef.current = null;
              });
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = pageHeight - (e.clientY - rect.top);

              const currentCoord1 = coord1;

              if (!currentCoord1) return setCoord1({ x, y });

              setRedactions((curr) => [
                ...curr,
                {
                  key: createSimpleId(),
                  x1: currentCoord1.x,
                  y1: currentCoord1.y,
                  x2: x,
                  y2: y,
                },
              ]);

              setCoord1(null);
              setCoord2(null);
            }}
            scale={scale}
            pageNumber={pageNumber}
            renderAnnotationLayer={true}
            renderTextLayer={true}
            onGetAnnotationsSuccess={(annotations) =>
              console.log({ annotations })
            }
            onLoadSuccess={(page): void => {
              const viewport = page.getViewport({ scale });
              setPageHeight(viewport.height);

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

                setItemsWithPosition(newItems);

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
        {itemsWithPosition.map((itm, index) => {
          const xMin = itm.x1 < itm.x2 ? itm.x1 : itm.x2;
          const xMax = itm.x1 > itm.x2 ? itm.x1 : itm.x2;
          const yMin = itm.y1 < itm.y2 ? itm.y1 : itm.y2;
          const yMax = itm.y1 > itm.y2 ? itm.y1 : itm.y2;
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
                top: `${pageHeight - (yMin + height) * scale}px`,
                width: `${width * scale}px`,
                height: `${height * scale}px`,
                background: "rgba(0, 100, 255, 0.2)",
                border: "1px solid blue",
                zIndex: 99,
              }}
              title="Click to visit Google"
            />
          );
        })}
        {coord1 &&
          coord2 &&
          (() => {
            const x1 = coord1.x;
            const x2 = coord2.x;
            const y1 = coord1.y;
            const y2 = coord2.y;
            const xMin = x1 < x2 ? x1 : x2;
            const xMax = x1 > x2 ? x1 : x2;
            const yMin = y1 < y2 ? y1 : y2;
            const yMax = y1 > y2 ? y1 : y2;
            const width = xMax - xMin;
            const height = yMax - yMin;

            return (
              <span
                style={{
                  position: "absolute",
                  left: `${xMin * scale}px`,
                  top: `${pageHeight - (yMin + height) * scale}px`,
                  width: `${width * scale}px`,
                  height: `${height * scale}px`,
                  background: "black",
                  border: "1px solid red",
                  pointerEvents: "none",
                  zIndex: 99,
                }}
              />
            );
          })()}
        {redactions.map((itm) => {
          const xMin = itm.x1 < itm.x2 ? itm.x1 : itm.x2;
          const xMax = itm.x1 > itm.x2 ? itm.x1 : itm.x2;
          const yMin = itm.y1 < itm.y2 ? itm.y1 : itm.y2;
          const yMax = itm.y1 > itm.y2 ? itm.y1 : itm.y2;
          const width = xMax - xMin;
          const height = yMax - yMin;

          return (
            <span
              key={itm.key}
              style={{
                position: "absolute",
                left: `${xMin * scale}px`,
                top: `${pageHeight - (yMin + height) * scale}px`,
                width: `${width * scale}px`,
                height: `${height * scale}px`,
                background: "black",
                border: "1px solid red",
                zIndex: 99,
              }}
            />
          );
        })}
      </div>
      <p>
        Page {pageNumber} of {numPages} (Page Height: {pageHeight}px)
      </p>
      <div onClick={() => setPageNumber((x) => x + 1)}>inc</div>
      <pre>{JSON.stringify(itemsWithPosition, null, 2)}</pre>
    </div>
  );
}

export default App;
