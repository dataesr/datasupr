export function checkQuery(query, mandatories = [], res) {
  const filters = {};
  mandatories.forEach((mandatory) => {
    if (!query[mandatory]) {
      res.status(400).send(`${mandatory} is required`);
      return;
    }
    filters[mandatory] = query[mandatory];
  });

  if (filters.extra_joint_organization === "null") {
    filters.extra_joint_organization = null;
  }
  return filters;
}
