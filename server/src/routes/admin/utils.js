export function checkQuery(query, mandatories = [], res) {
  const filters = {};
  mandatories.forEach((mandatory) => {
    if (!query[mandatory]) {
      res.status(400).send(`${mandatory} is required`);
      return;
    }
    filters[mandatory] = query[mandatory];
  });

  return filters;
}
