export const formatNumber = (num: number | null) => {
  if (num === null) return "N/A";
  return num.toLocaleString();
};
