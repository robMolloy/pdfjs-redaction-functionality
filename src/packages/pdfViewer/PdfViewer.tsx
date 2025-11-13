import { useEffect, useMemo, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { AreaIcon } from "./icons/AreaIcon";
import { EditIcon } from "./icons/EditIcon";
import { TickCircleIcon } from "./icons/TickCircleIcon";
import { PdfViewerPage } from "./PdfViewerPage";
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

export const PdfViewer = (p: {
  fileUrl: string;
  onRedactionsChange: (redactions: TRedaction[]) => void;
  onAddRedactions: (redactions: TRedaction[]) => void;
  onRemoveRedactions: (redactionIds: string[]) => void;
  onSaveRedactions: (redactions: TRedaction[]) => void;
}) => {
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

  useEffect(() => {
    p.onRedactionsChange(flattenedRedactions);
  }, [flattenedRedactions]);

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
              className={`govuk-button ${
                mode === "areaRedact" ? "" : "govuk-button--secondary"
              }`}
              onClick={() => setMode("areaRedact")}
            >
              <AreaIcon width={20} height={20} />
            </button>
            <button
              className={`govuk-button ${
                mode === "textRedact" ? "" : "govuk-button--secondary"
              }`}
              onClick={() => setMode("textRedact")}
            >
              <EditIcon width={20} height={20} />
            </button>
          </span>
          {mode === "textRedact" && (
            <button
              className="govuk-button govuk-button--secondary"
              onClick={() => {
                redactHighlightedTextTrigger.fire();
                setTimeout(() => window.getSelection()?.removeAllRanges(), 250);
              }}
            >
              <TickCircleIcon width={20} height={20} />
            </button>
          )}
        </span>

        <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <span>x{scaleHelper.scale.toFixed(2)}</span>
          <button
            className="govuk-button govuk-button--secondary"
            onClick={() => scaleHelper.decreaseScale()}
          >
            -
          </button>
          <button
            className="govuk-button govuk-button--secondary"
            onClick={() => scaleHelper.increaseScale()}
          >
            +
          </button>
          <button
            className="govuk-button govuk-button--secondary"
            onClick={() => scaleHelper.resetScale()}
          >
            x 1.00
          </button>
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
              <PdfViewerPage
                key={j}
                pageNumber={j + 1}
                scale={scaleHelper.scale}
                onMouseMove={() => {}}
                redactHighlightedTextTriggerData={
                  redactHighlightedTextTrigger.data
                }
                mode={mode}
                onRedactionsChange={(x) => {
                  setRedactionsOnPageNumber((prev) => ({ ...prev, [j]: x }));
                }}
                onAddRedactions={(x) => {
                  p.onAddRedactions(x);
                }}
                onRemoveRedactions={(x) => p.onRemoveRedactions(x)}
                redactions={redactionsOnPageNumber[j] ?? []}
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
              <button
                className="govuk-button govuk-button--inverse"
                onClick={() => {
                  p.onRemoveRedactions(flattenedRedactions.map((x) => x.id));
                  setRedactionsOnPageNumber({});
                }}
              >
                Remove all redactions
              </button>
              <span
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <span>
                  {flattenedRedactions.length === 1 && (
                    <>There is 1 redaction</>
                  )}
                  {flattenedRedactions.length > 1 && (
                    <>There are {flattenedRedactions.length} redactions</>
                  )}
                </span>
                <button
                  className="govuk-button"
                  onClick={() => p.onSaveRedactions(flattenedRedactions)}
                >
                  Save all redactions
                </button>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
