import React from 'react';
import memoize from 'memoize-one';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import TextOutput from '#components/TextOutput';

import { mapSources } from '#constants';

import {
    boundsFill,
    boundsOutline,
    rainPointPaint,
    riverPointPaint,
    earthquakePointPaint,

} from './mapStyles';

import styles from './styles.scss';

export default class RealTimeMap extends React.PureComponent {
    getEarthquakeFeatureCollection = memoize((realTimeEarthquakeList) => {
        const geojson = {
            type: 'FeatureCollection',
            features: realTimeEarthquakeList
                .filter(earthquake => earthquake.point)
                .map(earthquake => ({
                    id: earthquake.id,
                    type: 'Feature',
                    geometry: {
                        ...earthquake.point,
                    },
                    properties: {
                        earthquakeId: earthquake.id,
                        address: earthquake.address,
                        description: earthquake.description,
                        eventOn: earthquake.eventOn,
                        magnitude: earthquake.magnitude,
                    },
                })),
        };

        return geojson;
    })

    getRiverFeatureCollection = memoize((realTimeRiverList) => {
        const geojson = {
            type: 'FeatureCollection',
            features: realTimeRiverList
                .filter(river => river.point)
                .map(river => ({
                    id: river.id,
                    type: 'Feature',
                    geometry: {
                        ...river.point,
                    },
                    properties: {
                        riverId: river.id,
                        title: river.title,
                        description: river.description,
                        basin: river.basin,
                        status: river.status,
                    },
                })),
        };

        return geojson;
    })

    getRainFeatureCollection = memoize((realTimeRainList) => {
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

    earthquakeTooltipRendererParams = (id, { address, description, eventOn, magnitude }) => ({
        address,
        description,
        eventOn,
        magnitude,
    })

    earthquakeTooltipRenderer = ({ address, description, eventOn, magnitude }) => (
        <div>
            <TextOutput
                label="Address"
                value={address}
            />
            <TextOutput
                label="Description"
                value={description}
            />
            <TextOutput
                label="Event On"
                value={eventOn}
            />
            <TextOutput
                label="Magnitude"
                value={magnitude}
            />
        </div>
    )

    render() {
        const {
            realTimeRainList,
            realTimeRiverList,
            realTimeEarthquakeList,
        } = this.props;

        const rainFeatureCollection = this.getRainFeatureCollection(realTimeRainList);
        const riverFeatureCollection = this.getRiverFeatureCollection(realTimeRiverList);
        const earthquakeFeatureCollection =
            this.getEarthquakeFeatureCollection(realTimeEarthquakeList);

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="real-time-bounds"
                    url={mapSources.nepal.url}
                >
                    <MapLayer
                        layerKey="real-time-bounds-fill"
                        type="fill"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={boundsFill}
                    />
                    <MapLayer
                        layerKey="real-time-bounds-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={boundsOutline}
                    />
                </MapSource>
                <MapSource
                    sourceKey="real-time-rain-points"
                    geoJson={rainFeatureCollection}
                    supportHover
                >
                    <MapLayer
                        layerKey="real-time-rain-points-fill"
                        type="circle"
                        property="rainId"
                        paint={rainPointPaint}
                        enableHover
                        tooltipRenderer={this.tooltipRenderer}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                </MapSource>
                <MapSource
                    sourceKey="real-time-river-points"
                    geoJson={riverFeatureCollection}
                    supportHover
                >
                    <MapLayer
                        layerKey="real-time-river-points-fill"
                        type="circle"
                        property="riverId"
                        paint={riverPointPaint}
                        enableHover
                        tooltipRenderer={this.tooltipRenderer}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                </MapSource>
                <MapSource
                    sourceKey="real-time-eartquake-points"
                    geoJson={earthquakeFeatureCollection}
                    supportHover
                >
                    <MapLayer
                        layerKey="real-time-earthquake-points-fill"
                        type="circle"
                        property="earthquakeId"
                        paint={earthquakePointPaint}
                        enableHover
                        tooltipRenderer={this.earthquakeTooltipRenderer}
                        tooltipRendererParams={this.earthquakeTooltipRendererParams}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}
