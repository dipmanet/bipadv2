import React from 'react';
import memoize from 'memoize-one';
import bbox from '@turf/bbox';
import { navigate } from '@reach/router';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import { reverseRoute } from '@togglecorp/fujs';
import store from '#store';

import Tooltip from '#components/Tooltip';

import nepalGeoJson from '#resources/districts.json';


import {
    boundsFill,
    boundsOutline,
    pointPaint,
    polygonBoundsFill,
    hoverPaint,
    polygonHoverPaint,
} from './mapStyles';

const propTypes = {
};

const defaultProps = {
};

// NOTE: store needs to be passed bacause somehow this goes out of context in MapLayer
const toolTipWrapper = props => <Tooltip store={store} {...props} />;

const multiPolyToPoly = (multi) => {
    const { type, coordinates, ...other } = multi;
    const newCoords = type === 'MultiPolygon' ? coordinates[0] : coordinates;
    const newType = type === 'MultiPolygon' ? 'Polygon' : type;
    return {
        ...other,
        type: newType,
        coordinates: newCoords,
    };
};

export default class IncidentMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.hoverInfo = {
            paint: hoverPaint,
            showTooltip: true,
            tooltipModifier: toolTipWrapper,
        };

        this.polygonHoverInfo = {
            paint: polygonHoverPaint,
            showTooltip: true,
            tooltipModifier: toolTipWrapper,
        };
    }

    getPointFeatureCollection = memoize((incidentList) => {
        const geojson = {
            type: 'FeatureCollection',
            features: incidentList
                .filter(incident => incident.point)
                .map(incident => ({
                    type: 'Feature',
                    geometry: {
                        ...incident.point,
                    },
                    properties: {
                        incident,
                        severity: incident.severity,
                    },
                })),
        };

        return geojson;
    });

    getPolygonFeatureCollection = memoize((incidentList) => {
        const geojson = {
            type: 'FeatureCollection',
            features: incidentList
                .filter(incident => incident.polygon)
                .map(incident => ({
                    type: 'Feature',
                    geometry: {
                        ...incident.polygon,
                    },
                    properties: {
                        incident,
                        severity: incident.severity,
                    },
                })),
        };

        return geojson;
    });

    handlePointClick = (propertiesString) => {
        const properties = JSON.parse(propertiesString);
        const { id: incidentId } = properties;
        const redirectTo = reverseRoute(':incidentId/response/', { incidentId });
        navigate(redirectTo);
    }

    render() {
        const {
            incidentList,
        } = this.props;

        const pointFeatureCollection = this.getPointFeatureCollection(incidentList);
        const polygonFeatureCollection = this.getPolygonFeatureCollection(incidentList);

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="incident-bounds"
                    geoJson={nepalGeoJson}
                    bounds={bbox(nepalGeoJson)}
                >
                    <MapLayer
                        layerKey="incident-bounds-fill"
                        type="fill"
                        paint={boundsFill}
                    />
                    <MapLayer
                        layerKey="incident-bounds-outline"
                        type="line"
                        paint={boundsOutline}
                    />
                </MapSource>
                <MapSource
                    sourceKey="incident-points"
                    geoJson={pointFeatureCollection}
                    supportHover
                >
                    <MapLayer
                        layerKey="incident-points-fill"
                        type="circle"
                        property="incident"
                        paint={pointPaint}
                        onClick={this.handlePointClick}
                        hoverInfo={this.hoverInfo}
                    />
                </MapSource>
                <MapSource
                    sourceKey="incident-polygons"
                    geoJson={polygonFeatureCollection}
                    supportHover
                >
                    <MapLayer
                        layerKey="incident-polygon-fill"
                        type="fill"
                        property="incident"
                        paint={polygonBoundsFill}
                        onClick={this.handlePointClick}
                        hoverInfo={this.polygonHoverInfo}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}
