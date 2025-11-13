import type { TXywhPair } from "./utils/coordUtils";

export const PositionPdfOverlayBox = (
  p: TXywhPair & { scale: number; children: React.ReactNode }
) => (
  <div
    style={{
      position: "absolute",
      left: `${p.xLeft * p.scale}px`,
      bottom: `${p.yBottom * p.scale}px`,
      width: `${p.width * p.scale}px`,
      height: `${p.height * p.scale}px`,
    }}
  >
    {p.children}
  </div>
);

export const CloseIcon = (p: { onClick: () => void }) => (
  <div
    style={{
      cursor: "pointer",
      background: "white",
      border: "1px solid black",
      borderRadius: "50%",
      width: "20px",
      height: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      color: "black",
    }}
    onClick={() => {
      p.onClick();
    }}
  >
    ×
  </div>
);

export const RedactionBox = (p: { background: string; border: string }) => (
  <div
    style={{
      background: p.background,
      border: p.border,
      height: "100%",
      width: "100%",
    }}
  ></div>
);
