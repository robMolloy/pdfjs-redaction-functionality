import type { TXywhPair } from "./utils/coordUtils";

export const PositionPdfOverlayBox = (
  p: TXywhPair & { scale: number; children: React.ReactNode }
) => {
  return (
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
};

export const CloseIcon = (p: { onCloseClick: () => void }) => {
  return (
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
      onClick={() => p.onCloseClick()}
    >
      X
    </div>
  );
};

export const RedactionBox = (p: {
  onCloseClick?: () => void;
  background: string;
  border: string;
}) => {
  return (
    <div
      style={{
        background: p.background ?? "rgba(255, 0, 0, 0.3)",
        border: p.border ?? "2px solid red",
        height: "100%",
        width: "100%",
      }}
    >
      {p.onCloseClick && (
        <div
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            zIndex: 10,
          }}
        >
          <CloseIcon onCloseClick={p.onCloseClick} />
        </div>
      )}
    </div>
  );
};
