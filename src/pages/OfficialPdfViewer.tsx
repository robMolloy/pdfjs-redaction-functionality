import { useState, type ComponentProps } from "react";
import { PdfViewer } from "../packages/pdfViewer/PdfViewer";
import { createId } from "../packages/pdfViewer/utils/generalUtils";
import {
  FloatingPopup,
  RedactionDetailsForm,
  useWindowMouseListener,
} from "../packages/floatingPopup/FloatingPopup";
import type { TCoord } from "../packages/documentViewerAndRedactor/utils/coordUtils";

export const OfficialPdfViewer = () => {
  const [redactionDetails, setRedactionDetails] = useState<
    { redactionId: string; randomId: string }[]
  >([]);

  const [popupProps, setPopupProps] = useState<Omit<
    ComponentProps<typeof RedactionDetailsForm> & TCoord,
    "onSaveSuccess" | "onCancelClick"
  > | null>(null);

  const mousePos = useWindowMouseListener();

  return (
    <div>
      <pre>{JSON.stringify(mousePos, undefined, 2)}</pre>
      {popupProps && (
        <FloatingPopup
          coordX={popupProps.x}
          coordY={popupProps.y}
          children={
            <RedactionDetailsForm
              redactionIds={popupProps.redactionIds}
              documentId={popupProps.documentId}
              urn={popupProps.urn}
              caseId={popupProps.caseId}
              onCancelClick={function (): void {
                setPopupProps(null);
              }}
              onSaveSuccess={function (): void {
                setPopupProps(null);
              }}
            />
          }
        />
      )}
      {JSON.stringify({ redactionDetails })}
      <div style={{ maxWidth: "500px" }}>
        <PdfViewer
          // fileUrl="http://localhost:5173/may-plus-images.pdf"
          // fileUrl="http://localhost:5173/final.pdf"
          fileUrl="http://localhost:5173/final-with-https.pdf"
          onRedactionsChange={(change) => {
            console.log(`OfficialPdfViewer.tsx:${/*LL*/ 16}`, { change });
          }}
          onAddRedactions={(add) => {
            const newRedactions = add.map((x) => ({
              redactionId: x.id,
              randomId: `This redaction does ${createId()}`,
            }));
            setRedactionDetails((prev) => [...prev, ...newRedactions]);
            const coord = { x: window.screenX, y: window.screenY };
            console.log(`OfficialPdfViewer.tsx:${/*LL*/ 43}`, { coord });
            setPopupProps(() => ({
              x: mousePos.x,
              y: mousePos.y,
              redactionIds: add.map((x) => x.id),
              documentId: "This document does not exist",
              urn: "This URN does not exist",
              caseId: "This case does not exist",
            }));
          }}
          onRemoveRedactions={(remove) => {
            setRedactionDetails((prev) =>
              prev.filter((x) => !remove.includes(x.redactionId))
            );
            console.log(`OfficialPdfViewer.tsx:${/*LL*/ 18}`, { remove });
          }}
          onSaveRedactions={(redactions) => {
            const redactionsWithDetails = redactions
              .map((x) => {
                const thisDetails = redactionDetails.find(
                  (y) => y.redactionId === x.id
                );
                if (!thisDetails) return undefined;
                return { ...x, ...thisDetails };
              })
              .filter((x) => !!x);
            console.log(`OfficialPdfViewer.tsx:${/*LL*/ 44}`, {
              redactionsWithDetails,
            });
          }}
        />
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};
