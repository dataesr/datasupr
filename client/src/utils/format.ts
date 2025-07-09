export const formatToMillions = (amount: number, precision=1): string => {
  const millions = amount / 1_000_000;
  return `${millions.toFixed(precision)} M€`;
};

export const formatToThousands = (amount: number): string => {
  const thousands = amount / 1_000;
  return `${thousands.toFixed(1)} K€`;
};

export const formatToPercent = (amount: number): string => {
  return `${(amount).toFixed(1)} %`;
}

export const formatToEuro = (amount: number): string => {
  return `${amount.toFixed(0)} €`;
};

export const formatToRates = (value: number): string => {
  return `${(value * 100).toFixed(1)} %`;
}
