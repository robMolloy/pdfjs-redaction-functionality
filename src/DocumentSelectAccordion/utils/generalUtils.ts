export const safeJsonParse = (x: unknown) => {
  try {
    return { success: true, data: JSON.parse(x as string) } as const;
  } catch (error) {
    return { success: false, error: {} } as const;
  }
};

export const areSetsEqual = (set1: Set<unknown>, set2: Set<unknown>) => {
  if (set1.size !== set2.size) return false;
  return [...set1].every((item) => set2.has(item));
};
