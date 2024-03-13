export function getColorByPillierName(name) {
  if (name === "Excellence scientifique") {
    return "#CECECE";
  } else if (name === "Problématiques mondiales et compétitivité industrielle européenne") {
    return "#4B5D67";
  } else if (name === "Europe plus innovante") {
    return "#FFCA00";
  } else {
    return "#9EF9BE";
  }
}

export function getDefaultParams(searchParams) {
  const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join('&');

  return params + '&stage=successful';
}