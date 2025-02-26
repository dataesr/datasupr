export function getColorByPillierName(name) {
  if (name === "Excellence scientifique") {
    return "#21AB8E";
  } else if (
    name === "Problématiques mondiales et compétitivité industrielle européenne"
  ) {
    return "#223F3A";
  } else if (name === "Europe plus innovante") {
    return "#A558A0";
  } else {
    return "#E4794A";
  }
}

export function getDefaultParams(searchParams) {
  const params = [...searchParams]
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return params + "&stage=successful";
}
