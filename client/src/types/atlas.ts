export type DataByYear = {
  [key: string]: string | number,
} & {
  effectif_total: number,
  effectif_pr: number,
  effectif_pu: number,
  effectif_masculin: number,
  effectif_feminin: number,
  effectif_form_ens?: number,
  effectif_dut?: number,
  effectif_ing?: number,
}

export type SimilarData = {
  geo_id: string,
  annee_universitaire: string,
  niveau_geo: string,
  geo_nom: string,
  effectifPR: number,
  effectifPU: number,
  pctPR: number,
  pctPU: number,
  effectifF: number,
  effectifM: number,
  pctF: number,
  pctM: number,
  distance: number,
}

export type MapBubbleDataProps = {
  z: number,
  name: string,
  lat: number,
  lon: number
}[];

export type PolygonsDataProps = {
  type: string,
  coordinates: [number, number] | [number, number][]
}[];