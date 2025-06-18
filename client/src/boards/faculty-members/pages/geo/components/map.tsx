import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import mapDataIE from "../../../../../assets/regions.json";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useGeoMapData } from "../api/use-map";
import { createMapOptions } from "./options";

highchartsMap(Highcharts);

export default function FacultyMap() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";

  const {
    data: mapData,
    isLoading,
    error,
  } = useGeoMapData({
    annee_universitaire: selectedYear,
  });

  const [mapOptions, setMapOptions] = useState<Highcharts.Options | null>(null);

  const handleRegionClick = useCallback(
    (geoId: string) => {
      const currentParams = new URLSearchParams(searchParams);
      currentParams.set("geo_id", geoId);
      const queryString = currentParams.toString();
      const url = `/personnel-enseignant/geo/vue-d'ensemble?${queryString}`;
      navigate(url);
    },
    [navigate, searchParams]
  );

  useEffect(() => {
    if (!mapData?.regions) return;

    const regionMapping: Record<string, string> = {};
    mapDataIE.objects?.default?.geometries?.forEach((g) => {
      const regId = g.properties?.reg_id;
      if (regId) {
        regionMapping[regId] = g.properties["hc-key"];
      }
    });

    const chartData = mapData.regions
      .filter((region) => regionMapping[region.geo_id])
      .map((region) => ({
        "hc-key": regionMapping[region.geo_id],
        name: region.geo_nom,
        geo_id: region.geo_id,
        value: region.total_count,
        total_count: region.total_count,
        male_count: region.male_count,
        female_count: region.female_count,
        male_percent: region.male_percent,
        female_percent: region.female_percent,
      }));

    const options = createMapOptions({
      chartData,
      stats: mapData.statistics,
      annee_universitaire: mapData.annee_universitaire,
      onRegionClick: handleRegionClick,
    });

    setMapOptions(options);
  }, [mapData, handleRegionClick]);

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-6w">
        <div className="fr-mb-3w">
          <span
            className="fr-icon-refresh-line fr-icon--lg fr-icon--spin"
            aria-hidden="true"
          ></span>
        </div>
        <div>Chargement de la carte des régions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fr-alert fr-alert--error fr-my-3w">
        <p>Erreur lors du chargement des données de la carte</p>
        <p className="fr-text--sm">{error.message}</p>
      </div>
    );
  }

  if (!mapOptions) {
    return (
      <div className="fr-text--center fr-py-3w">
        <div>Préparation de la carte...</div>
      </div>
    );
  }

  return (
    <div className="france-map-container">
      <HighchartsReact
        constructorType={"mapChart"}
        highcharts={Highcharts}
        options={mapOptions}
      />
    </div>
  );
}
