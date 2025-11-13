import { useState } from "react";
import { PdfViewer } from "../packages/pdfViewer/PdfViewer";
import { createId } from "../packages/pdfViewer/utils/generalUtils";

export const OfficialPdfViewer = () => {
  const [redactionDetails, setRedactionDetails] = useState<
    { redactionId: string; randomId: string }[]
  >([]);

  return (
    <div>
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
    </div>
  );
};
