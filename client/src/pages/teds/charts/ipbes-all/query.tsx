const bool = {
  should: [
    { term: { "ipbes.chapter.keyword": "1" } },
    { term: { "ipbes.chapter.keyword": "2.1_drivers" } },
    { term: { "ipbes.chapter.keyword": "2.2_nature" } },
    { term: { "ipbes.chapter.keyword": "2.3_ncp" } },
    { term: { "ipbes.chapter.keyword": "3" } },
    { term: { "ipbes.chapter.keyword": "4" } },
    { term: { "ipbes.chapter.keyword": "5" } },
    { term: { "ipbes.chapter.keyword": "6" } },
    { term: { "ipbes.chapter.keyword": "ipbes-global_glossary" } },
  ],
  minimum_should_match: 1,
};

export default bool;
