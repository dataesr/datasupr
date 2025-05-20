import { GeoDataType } from "../../../types";

export const formatDataForIndicatorsCard = (
  geoData: GeoDataType,
  selectedYear: string
) => {
  if (Array.isArray(geoData)) {
    const yearData = geoData.find(
      (item) => String(item.annee_universitaire) === selectedYear
    );

    if (!yearData) return [];

    return [
      {
        man_count: yearData.totalHeadcountMan || 0,
        woman_count: yearData.totalHeadcountWoman || 0,
        unknow_count: yearData.totalHeadcountUnknown || 0,
        total_headcount:
          yearData.totalHeadcountMan +
          yearData.totalHeadcountWoman +
          (yearData.totalHeadcountUnknown || 0),
        maleCount: yearData.totalHeadcountMan || 0,
        femaleCount: yearData.totalHeadcountWoman || 0,
        totalCount:
          yearData.totalHeadcountMan +
          yearData.totalHeadcountWoman +
          (yearData.totalHeadcountUnknown || 0),
      },
    ];
  }

  if (geoData?.data) {
    const yearData = geoData.data.find(
      (item) => String(item.annee_universitaire) === selectedYear
    );

    if (!yearData) return [];

    return [
      {
        man_count: yearData.totalHeadcountMan || 0,
        woman_count: yearData.totalHeadcountWoman || 0,
        unknow_count: yearData.totalHeadcountUnknown || 0,
        total_headcount:
          yearData.totalHeadcountMan +
          yearData.totalHeadcountWoman +
          (yearData.totalHeadcountUnknown || 0),
        maleCount: yearData.totalHeadcountMan || 0,
        femaleCount: yearData.totalHeadcountWoman || 0,
        totalCount:
          yearData.totalHeadcountMan +
          yearData.totalHeadcountWoman +
          (yearData.totalHeadcountUnknown || 0),
      },
    ];
  }

  return [];
};
