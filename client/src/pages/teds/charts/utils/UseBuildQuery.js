function buildQuery(body, s) {
    const query = {
        size: 0,
        query: {
            bool: body,
        },
        aggs: {
            by_countries: {
                terms: {
                    field: 'countries.keyword',
                    size: s,
                },
            },
        },
        track_total_hits: true,
    };

    return query;
};

export default buildQuery;
