import { DocumentViewerAndRedactor } from "../packages/documentViewerAndRedactor/DocumentViewerAndRedactor";

export const OfficialPage = () => {
  return (
    <div>
      <div style={{ maxWidth: "500px" }}>
        <DocumentViewerAndRedactor
          // fileUrl="http://localhost:5173/may-plus-images.pdf"
          // fileUrl="http://localhost:5173/final.pdf"
          fileUrl="http://localhost:5173/final-with-https.pdf"
        />
      </div>
    </div>
  );
};
