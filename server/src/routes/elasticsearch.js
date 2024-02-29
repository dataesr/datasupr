import express from 'express';

const router = new express.Router();

router.route('/elasticsearch')
  .post(async (req, res) => {
    const query = req?.body?.query ?? {};
    const ES_URL = 'https://cluster-production.elasticsearch.dataesr.ovh';
    const headers = new Headers({ 'Authorization': `Basic ${process.env.ES_TEDS_TOKEN}`, 'content-type': 'application/json' });
    const response = await fetch(
      `${ES_URL}/${req?.query?.index}/_search`,
      { method: 'POST', headers, body: JSON.stringify({ query }) },
    );
    const data = await response.json();
    res.json(data);
  });

export default router;
