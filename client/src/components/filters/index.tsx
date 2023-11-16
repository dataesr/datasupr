
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function FiltersFromUrl() {
    const [searchParams] = useSearchParams();
    const facets = [
        { REG_ID: ["R11", "R93"] },
        { DISCIPLI: ["DSA", "DSB", "DSC"] },
    ];

    useEffect(() => {
        facets.forEach(facet => {
            const [key, value] = Object.entries(facet)[0];
            const param = searchParams.get(key);
            if (param) {
                const values = param.split(',');
                if (values.length > 1) {
                    values.forEach(value => {
                        searchParams.append(key, value);
                    })
                }
            }
        }
        );
    }, [facets, searchParams]);

    // console.log('FiltersFromUrl', [...searchParams]); // ▶ [['sort', 'name'], ['order', 'ascending']]
    return (
        <div>
            FiltersFromUrl
        </div>
    )
}

