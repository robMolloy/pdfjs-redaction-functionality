import { DocumentViewerAndRedactor } from "../packages/documentViewerAndRedactor/DocumentViewerAndRedactor";

export const OfficialPage = () => {
  return (
    <div>
      <DocumentViewerAndRedactor
        // fileUrl="http://localhost:5173/may-plus-images.pdf"
        fileUrl="http://localhost:5173/final.pdf"
      />
    </div>
  );
};
