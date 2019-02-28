import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { Redirect } from 'react-router-dom';
import turf from 'turf';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import { reverseRoute } from '@togglecorp/fujs';
import store from '#store';
import { routes } from '#constants';

import Tooltip from '#components/Tooltip';

import nepalGeoJson from '#resources/districts.json';


import {
    boundsFill,
    boundsOutline,
    pointPaint,
    hoverPaint,
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

        this.state = {
            redirectTo: undefined,
        };

        this.hoverInfo = {
            paint: hoverPaint,
            showTooltip: true,
            tooltipModifier: toolTipWrapper,
        };
    }

    getFeatureCollection = memoize((incidentList) => {
        const geojson = {
            type: 'FeatureCollection',
            features: incidentList
                .filter(incident => incident.point || incident.polygon)
                .map(incident => ({
                    type: 'Feature',
                    geometry: multiPolyToPoly(incident.point || incident.polygon),
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
        const redirectTo = reverseRoute(routes.response.path, { incidentId });
        this.setState({ redirectTo });
    }

    render() {
        const {
            incidentList,
        } = this.props;

        const { redirectTo } = this.state;

        if (redirectTo) {
            return (
                <Redirect
                    to={redirectTo}
                    push
                />
            );
        }

        const featureCollection = this.getFeatureCollection(incidentList);

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="incident-bounds"
                    geoJson={nepalGeoJson}
                    bounds={turf.bbox(nepalGeoJson)}
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
                    geoJson={featureCollection}
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
            </React.Fragment>
        );
    }
}
