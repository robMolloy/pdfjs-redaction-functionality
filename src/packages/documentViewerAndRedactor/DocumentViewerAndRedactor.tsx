import { useMemo, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { DocumentViewerAndRedactorPage } from "./DocumentViewerAndRedactorPage";
import type { TRedaction } from "./utils/coordUtils";
import { ModeStyleTag, type TMode } from "./utils/modeUtils";
import { useTrigger } from "./utils/useTriggger";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const useScaleHelper = (p?: { initScale?: number }) => {
  const [scale, setScale] = useState(p?.initScale ?? 1);

  const increaseScale = () => setScale((prev) => (prev += 0.25));
  const decreaseScale = () =>
    setScale((prev) => {
      const newScale = prev - 0.25;
      return newScale <= 0 ? prev : newScale;
    });
  const resetScale = () => setScale(1);

  return { scale, increaseScale, decreaseScale, resetScale };
};

const flattenRedactionsOnPageNumber = (redactionsOnPageNumber: {
  [k: string]: TRedaction[];
}) => {
  const temp: TRedaction[] = [];
  Object.entries(redactionsOnPageNumber).forEach(([pageNumber, redactions]) => {
    redactions.forEach((redaction) => {
      temp.push({ ...redaction, pageNumber: Number(pageNumber) });
    });
  });
  return temp;
};

export const DocumentViewerAndRedactor = (p: { fileUrl: string }) => {
  const [numPages, setNumPages] = useState<number>();
  const scaleHelper = useScaleHelper();

  const redactHighlightedTextTrigger = useTrigger();

  const [mode, setMode] = useState<TMode>("areaRedact");
  const [redactionsOnPageNumber, setRedactionsOnPageNumber] = useState<{
    [k: number]: TRedaction[];
  }>({});

  const flattenedRedactions = useMemo(() => {
    return flattenRedactionsOnPageNumber(redactionsOnPageNumber);
  }, [redactionsOnPageNumber]);

  return (
    <div>
      <ModeStyleTag mode={mode} />
      <div
        style={{
          border: "1px solid black",
          background: "white",
          color: "black",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <span>
            <button
              style={
                mode === "areaRedact"
                  ? { background: "blue", color: "white" }
                  : {}
              }
              onClick={() => setMode("areaRedact")}
            >
              A
            </button>
            <button
              style={
                mode === "textRedact"
                  ? { background: "blue", color: "white" }
                  : {}
              }
              onClick={() => setMode("textRedact")}
            >
              T
            </button>
          </span>
          {mode === "textRedact" && (
            <button
              style={{ background: "red" }}
              onClick={() => {
                redactHighlightedTextTrigger.fire();

                setTimeout(() => window.getSelection()?.removeAllRanges(), 250);
              }}
            >
              T
            </button>
          )}
        </span>
        <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <span>x{scaleHelper.scale.toFixed(2)}</span>
          <button onClick={() => scaleHelper.increaseScale()}>+</button>
          <button onClick={() => scaleHelper.decreaseScale()}>-</button>
          <button onClick={() => scaleHelper.resetScale()}>Reset</button>
        </span>
      </div>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "relative",
            height: "500px",
            width: "100%",
            overflowX: "scroll",
            overflowY: "scroll",
            backgroundColor: "gray",
          }}
        >
          <Document
            file={p.fileUrl}
            onLoadSuccess={(x) => {
              setRedactionsOnPageNumber(() => ({}));
              setNumPages(x.numPages);
            }}
          >
            {[...Array(numPages)].map((_, j) => (
              <DocumentViewerAndRedactorPage
                key={j}
                pageNumber={j + 1}
                scale={scaleHelper.scale}
                onMouseMove={() => {}}
                redactHighlightedTextTriggerData={
                  redactHighlightedTextTrigger.data
                }
                mode={mode}
                setRedactions={(x) => {
                  setRedactionsOnPageNumber((prev) => ({ ...prev, [j]: x }));
                }}
                redactions={redactionsOnPageNumber[j]}
              />
            ))}
            <br />
            <br />
            <br />
          </Document>
        </div>
        {flattenedRedactions.length > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: "25px",
              left: 0,
              right: 0,
              zIndex: 10,
            }}
          >
            <div
              style={{
                border: "1px solid black",
                background: "white",
                color: "black",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <span>
                {flattenedRedactions.length === 1 && <>There is 1 redaction</>}
                {flattenedRedactions.length > 1 && (
                  <>There are {flattenedRedactions.length} redactions</>
                )}
              </span>
              <button onClick={() => setRedactionsOnPageNumber({})}>
                Clear all redactions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
