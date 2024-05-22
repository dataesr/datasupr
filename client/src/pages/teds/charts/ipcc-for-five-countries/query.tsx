import { getLabel } from "../utils";

export default function useQuery(currentLang) {
  const list_wg = ["1", "2", "2_cross", "3"];

  const filter_ipcc = {
    body: {
      should: [
        { term: { "ipcc.wg.keyword": list_wg[0] } },
        { term: { "ipcc.wg.keyword": list_wg[1] } },
        { term: { "ipcc.wg.keyword": list_wg[2] } },
        { term: { "ipcc.wg.keyword": list_wg[3] } },
      ],
      minimum_should_match: 1,
    },
    name: "all",
  };

  const filter_wg1 = {
    body: {
      must: [{ match: { "ipcc.wg.keyword": list_wg[0] } }],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[1] } },
        { match: { "ipcc.wg.keyword": list_wg[2] } },
        { match: { "ipcc.wg.keyword": list_wg[3] } },
      ],
    },
    name: getLabel("ipcc_five_countries", "wg1", currentLang),
  };
  const filter_wg2 = {
    body: {
      must: [{ match: { "ipcc.wg.keyword": list_wg[1] } }],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[0] } },
        { match: { "ipcc.wg.keyword": list_wg[2] } },
        { match: { "ipcc.wg.keyword": list_wg[3] } },
      ],
    },
    name: getLabel("ipcc_five_countries", "wg2", currentLang),
  };
  const filter_wg2cross = {
    body: {
      must: [{ match: { "ipcc.wg.keyword": list_wg[2] } }],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[0] } },
        { match: { "ipcc.wg.keyword": list_wg[1] } },
        { match: { "ipcc.wg.keyword": list_wg[3] } },
      ],
    },
    name: getLabel("ipcc_five_countries", "wg2cross", currentLang),
  };
  const filter_wg3 = {
    body: {
      must: [{ match: { "ipcc.wg.keyword": list_wg[3] } }],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[0] } },
        { match: { "ipcc.wg.keyword": list_wg[1] } },
        { match: { "ipcc.wg.keyword": list_wg[2] } },
      ],
    },
    name: getLabel("ipcc_five_countries", "wg3", currentLang),
  };
  const filter_wg1_and_wg2 = {
    body: {
      must: [
        { match: { "ipcc.wg.keyword": list_wg[0] } },
        { match: { "ipcc.wg.keyword": list_wg[1] } },
      ],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[2] } },
        { match: { "ipcc.wg.keyword": list_wg[3] } },
      ],
    },
    name: getLabel("ipcc_five_countries", "wg1_wg2", currentLang),
  };

  const filter_wg2_and_wg2cross = {
    body: {
      must: [
        { match: { "ipcc.wg.keyword": list_wg[1] } },
        { match: { "ipcc.wg.keyword": list_wg[2] } },
      ],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[0] } },
        { match: { "ipcc.wg.keyword": list_wg[3] } },
      ],
    },
    name: getLabel("ipcc_five_countries", "wg2_wg2cross", currentLang),
  };
  const filter_wg2_and_wg3 = {
    body: {
      must: [
        { match: { "ipcc.wg.keyword": list_wg[1] } },
        { match: { "ipcc.wg.keyword": list_wg[3] } },
      ],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[0] } },
        { match: { "ipcc.wg.keyword": list_wg[2] } },
      ],
    },
    name: getLabel("ipcc_five_countries", "wg2_wg3", currentLang),
  };

  const filters = [
    filter_wg1,
    filter_wg2,
    filter_wg2cross,
    filter_wg3,
    filter_wg1_and_wg2,
    filter_wg2_and_wg2cross,
    filter_wg2_and_wg3,
  ];
  return { filter_ipcc, filters };
}
