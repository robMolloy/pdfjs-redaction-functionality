import { useEffect, useRef, useState, type ReactNode } from "react";

export const useWindowMouseListener = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.pageX, y: e.pageY };
    };

    const updateMousePosition = () => {
      setMousePos({ ...mousePosRef.current });
      rafIdRef.current = requestAnimationFrame(updateMousePosition);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafIdRef.current = requestAnimationFrame(updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return mousePos;
};

export const FloatingPopup = (p: {
  coordX: number;
  coordY: number;
  children: ReactNode;
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: p.coordX, y: p.coordY });

  useEffect(() => {
    if (!popupRef.current) return;

    const popup = popupRef.current;
    const rect = popup.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Determine horizontal position
    const isRightHalf = p.coordX > screenWidth / 2;
    const x = isRightHalf ? p.coordX - rect.width : p.coordX;

    // Determine vertical position
    const isBottomHalf = p.coordY > screenHeight / 2;
    const y = isBottomHalf ? p.coordY - rect.height : p.coordY;

    setPosition({ x, y });
  }, [p.coordX, p.coordY]);

  return (
    <div
      ref={popupRef}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundColor: "white",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      {p.children}
    </div>
  );
};

const colors = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Orange",
  "Pink",
  "Black",
  "White",
  "Gray",
];

export const RedactionDetailsForm = (p: {
  redactionIds: string[];
  documentId: string;
  urn: string;
  caseId: string;
  onCancelClick: () => void;
  onSaveSuccess: () => void;
}) => {
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    console.log(`RedactionDetailsForm.tsx:${/*LL*/ 1}`, { p });
  }, []);
  return (
    <div>
      <h1>Redaction Details</h1>
      <div>
        <select
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        >
          <option value="">Choose a color...</option>
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>
      <button onClick={p.onCancelClick}>Cancel</button>
      <button onClick={p.onSaveSuccess}>Save</button>
      <pre>{JSON.stringify(p, undefined, 2)}</pre>
    </div>
  );
};
