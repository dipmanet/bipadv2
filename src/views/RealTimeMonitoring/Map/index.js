import React from 'react';
import memoize from 'memoize-one';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import TextOutput from '#components/TextOutput';

import { mapSources } from '#constants';

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
                    id: rain.id,
                    type: 'Feature',
                    geometry: {
                        ...rain.point,
                    },
                    properties: {
                        rainId: rain.id,
                        title: rain.title,
                        description: rain.description,
                        basin: rain.basin,
                        status: rain.status,
                    },
                })),
        };

        return geojson;
    });

    tooltipRendererParams = (id, { title, description, basin, status }) => ({
        title,
        description,
        basin,
        status,
    })

    tooltipRenderer = ({ title, description, basin, status }) => (
        <div>
            <h3>
                {title}
            </h3>
            <TextOutput
                label="Description"
                value={description}
            />
            <TextOutput
                label="Basin"
                value={basin}
            />
            <TextOutput
                label="Status"
                value={status}
            />
        </div>
    )

    render() {
        const { realTimeRainList } = this.props;

        const pointFeatureCollection = this.getPointFeatureCollection(realTimeRainList);

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="real-time-rain-bounds"
                    url={mapSources.district.url}
                >
                    <MapLayer
                        layerKey="real-time-rain-bounds-fill"
                        type="fill"
                        sourceLayer={mapSources.district.sourceLayer}
                        paint={boundsFill}
                    />
                    <MapLayer
                        layerKey="real-time-bounds-outline"
                        type="line"
                        sourceLayer={mapSources.district.sourceLayer}
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
                        enableHover
                        tooltipRenderer={this.tooltipRenderer}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}
