import { getPdfCoords, safeGetRangeAt, type TCoordPair } from "./coordUtils";

export const getPdfCoordPairsOfHighlightedText = (p: {
  pdfPageRect: DOMRect;
  scale: number;
}) => {
  const selection = window.getSelection();
  if (!selection) return [];

  const rangeResponse = safeGetRangeAt({ selection });
  if (!rangeResponse.success) return [];

  const range = rangeResponse.data;
  const rects = range.getClientRects();
  const coordPairs = [...rects].map((rect) => {
    if (rect.width < 3 || rect.height < 3) return;

    const coord1 = getPdfCoords({
      screenX: rect.left,
      screenY: rect.bottom,
      scale: p.scale,
      pdfPageRect: p.pdfPageRect,
    });
    const coord2 = getPdfCoords({
      screenX: rect.right,
      screenY: rect.top,
      scale: p.scale,
      pdfPageRect: p.pdfPageRect,
    });

    if (!coord1 || !coord2) return;

    const newRedaction: TCoordPair = {
      x1: coord1.x,
      y1: coord1.y,
      x2: coord2.x,
      y2: coord2.y,
    };
    return newRedaction;
  });

  return coordPairs.filter((x) => !!x);
};
