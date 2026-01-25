import express from "express";

const es_url = "https://cluster-production.elasticsearch.dataesr.ovh";
const router = new express.Router();
const routesPrefix = "/elasticsearch";

const getHeaders = ({ es_index }) => {
  let auth_token = false;
  if (es_index.startsWith("teds-"))
    auth_token = `Basic ${process.env.ES_TOKEN_TEDS}`;
  if (es_index.startsWith("scanr-"))
    auth_token = `Basic ${process.env.ES_TOKEN_SCANR}`;
  const headersTmp = { "content-type": "application/json" };
  if (auth_token) headersTmp["Authorization"] = auth_token;
  return new Headers(headersTmp);
};

router.route(routesPrefix).post(async (req, res) => {
  const es_index = req?.query?.index;
  const query = req?.body ?? {};
  const headers = getHeaders({ es_index });
  const response = await fetch(`${es_url}/${es_index}/_search`, {
    method: "POST",
    headers,
    body: JSON.stringify(query),
  });
  const data = await response.json();
  res.json(data);
});

router
  .route(routesPrefix + "/get-index-name-by-alias")
  .get(async (req, res) => {
    const es_index = req?.query?.index;
    const headers = getHeaders({ es_index });
    const response = await fetch(`${es_url}/_cat/aliases/${es_index}?h=i`, {
      method: "GET",
      headers,
    });
    const index = await response.text();
    res.json({ index });
  });

export default router;
