export const isRce = (item: any): boolean => item.is_rce === true;
export const isDevimmo = (item: any): boolean => item.is_devimmo === true;

export const matchRce = (selected: string) => (item: any) => {
  if (selected === "rce") return isRce(item);
  if (selected === "non-rce") return !isRce(item);
  return true;
};

export const matchDevimmo = (selected: string) => (item: any) => {
  if (selected === "devimmo") return isDevimmo(item);
  if (selected === "non-devimmo") return !isDevimmo(item);
  return true;
};
