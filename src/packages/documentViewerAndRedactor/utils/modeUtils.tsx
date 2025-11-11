export type TMode = "textRedact" | "geometryRedact";

const modeStyleMap: { [k in TMode]: string } = {
  geometryRedact: `
    .react-pdf__Page__annotations a, 
    .react-pdf__Page__textContent span {
      pointer-events: none !important;
    }
    .react-pdf__Page__annotations, 
    .react-pdf__Page__textContent {
      cursor: crosshair;
    }
    `,
  textRedact: ``,
};

export const ModeStyleTag = (p: { mode: TMode }) => (
  <style>{modeStyleMap[p.mode]}</style>
);
