import { ArchiveRain } from './types';

export const rainToGeojson = (rainList: ArchiveRain[]) => {
    const geojson = {
        type: 'FeatureCollection',
        features: rainList
            .filter(rain => rain.point)
            .map(rain => ({
                id: rain.id,
                type: 'Feature',
                geometry: {
                    ...rain.point,
                },
                properties: {
                    ...rain,
                    rainId: rain.id,
                    title: rain.title,
                    description: rain.description,
                    basin: rain.basin,
                    status: rain.status,
                },
            })),
    };
    return geojson;
};

export const dummy = {};
