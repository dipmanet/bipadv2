import React from 'react';
import memoize from 'memoize-one';
import bbox from '@turf/bbox';


import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import nepalGeoJson from '#resources/districts.json';

import {
    boundsFill,
    boundsOutline,
    pointPaint,

} from './mapStyles';

import styles from './styles.scss';

export default class RealTimeMap extends React.PureComponent {
    getPointFeatureCollection = memoize((realTimeRainList) => {
        const geojson = {
            type: 'FeatureCollection',
            features: realTimeRainList
                .filter(rain => rain.point)
                .map(rain => ({
                    type: 'Feature',
                    geometry: {
                        ...rain.point,
                    },
                    properties: {
                        rain,
                        rainId: rain.id,
                    },
                })),
        };

        return geojson;
    });

    render() {
        const {
            realTimeRainList,
        } = this.props;

        const pointFeatureCollection = this.getPointFeatureCollection(realTimeRainList);

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="real-time-rain-bounds"
                    geoJson={nepalGeoJson}
                    bounds={bbox(nepalGeoJson)}
                >
                    <MapLayer
                        layerKey="real-time-rain-bounds-fill"
                        type="fill"
                        paint={boundsFill}
                    />
                    <MapLayer
                        layerKey="real-time-bounds-outline"
                        type="line"
                        paint={boundsOutline}
                    />
                </MapSource>
                <MapSource
                    sourceKey="real-time-rain-points"
                    geoJson={pointFeatureCollection}
                    supportHover
                >
                    <MapLayer
                        layerKey="real-time-rain-points-fill"
                        type="circle"
                        property="rainId"
                        paint={pointPaint}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}
