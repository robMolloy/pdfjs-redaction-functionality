import { useMemo, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useTrigger } from "./utils/useTriggger";
import { ModeStyleTag, type TMode } from "./utils/modeUtils";
import type { TRedaction } from "./utils/coordUtils";
import { DocumentViewerAndRedactorPage } from "./DocumentViewerAndRedactorPage";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export const DocumentViewerAndRedactor = (p: { fileUrl: string }) => {
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState<number>(1);

  const redactHighlightedTextTrigger = useTrigger();

  const [mode, setMode] = useState<TMode>("geometryRedact");
  const [redactionsOnPageNumber, setRedactionsOnPageNumber] = useState<{
    [k: number]: TRedaction[];
  }>({});

  const flattenedRedactions = useMemo(() => {
    const temp: (TRedaction & { pageNumber: number })[] = [];
    Object.entries(redactionsOnPageNumber).forEach(
      ([pageNumber, redactions]) => {
        redactions.forEach((redaction) => {
          temp.push({ ...redaction, pageNumber: Number(pageNumber) });
        });
      }
    );
    return temp;
  }, [redactionsOnPageNumber]);

  return (
    <div>
      <button
        onClick={() =>
          setMode((prev) =>
            prev === "geometryRedact" ? "textRedact" : "geometryRedact"
          )
        }
      >
        Redaction mode
      </button>
      ({mode})
      <br />
      <button onClick={() => setScale((scale) => (scale += 0.25))}>++++</button>
      <button onClick={() => setScale((scale) => (scale -= 0.25))}>----</button>
      <button onClick={() => setScale(1)}>Reset</button>
      <button
        onClick={() => {
          redactHighlightedTextTrigger.fire();
          setTimeout(() => {
            const selection = window.getSelection();
            if (selection) selection?.removeAllRanges();
          }, 250);
        }}
      >
        do something
      </button>
      Scale: {scale}
      <br />
      <style>{`
      .react-pdf__Page {
        background-color: gray !important;
        display: flex;
      }
`}</style>
      <ModeStyleTag mode={mode} />
      <div
        style={{
          position: "relative",
          height: "500px",
          width: "100%",
          overflowX: "scroll",
          overflowY: "scroll",
        }}
      >
        <Document
          file={p.fileUrl}
          onLoadSuccess={(x) => setNumPages(x.numPages)}
        >
          {[...Array(numPages)].map((_, j) => (
            <DocumentViewerAndRedactorPage
              key={j}
              pageNumber={j + 1}
              scale={scale}
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
        </Document>
      </div>
      <br />
      {flattenedRedactions.length > 0 && (
        <div
          style={{
            background: "white",
            color: "black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <span>There are {flattenedRedactions.length} redactions</span>
          <button onClick={() => setRedactionsOnPageNumber({})}>
            Clear all redactions
          </button>
        </div>
      )}
    </div>
  );
};
