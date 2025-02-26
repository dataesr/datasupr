const bool = {
  should: [
    { term: { "ipcc.wg.keyword": "1" } },
    { term: { "ipcc.wg.keyword": "2" } },
    { term: { "ipcc.wg.keyword": "2_cross" } },
    { term: { "ipcc.wg.keyword": "3" } },
  ],
  minimum_should_match: 1,
};

export default bool;
