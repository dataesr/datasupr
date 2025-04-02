export const formatToMillions = (amount: number): string => {
  const millions = amount / 1_000_000;
  return `${millions.toFixed(1)} M€`;
};