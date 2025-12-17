import express from 'express';

const router = new express.Router();

router.route('/elasticsearch')
  .post(async (req, res) => {
    const es_index = req?.query?.index;
    const es_url = 'https://cluster-production.elasticsearch.dataesr.ovh';
    const query = req?.body ?? {};
    let auth_token = false;
    if (es_index.startsWith("teds-")) auth_token = `Basic ${process.env.ES_TOKEN_TEDS}`;
    if (es_index.startsWith("scanr-")) auth_token = `Basic ${process.env.ES_TOKEN_SCANR}`;
    const headersTmp = { 'content-type': 'application/json' };
    if (auth_token) headersTmp['Authorization'] = auth_token;
    const headers = new Headers(headersTmp);
    const response = await fetch(
      `${es_url}/${es_index}/_search`,
      { method: 'POST', headers, body: JSON.stringify(query) },
    );
    const data = await response.json();
    res.json(data);
  });

export default router;
