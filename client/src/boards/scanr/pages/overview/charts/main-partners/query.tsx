const bool = {
  filter: [
    {
      range: {
        year: {
          gte: 2022,
          lte: 2024
        }
      }
    },
    {
      term: {
        "participants.structure.isFrench": true
      }
    }
  ]
};

export default bool;
