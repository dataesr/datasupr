const bool = {
  should: [
    { term: { "ipcc.wg.keyword": "wg1" } },
    { term: { "ipcc.wg.keyword": "wg2" } },
    { term: { "ipcc.wg.keyword": "wg2_cross" } },
    { term: { "ipcc.wg.keyword": "wg3" } },
  ],
  minimum_should_match: 1,
};

export default bool;
