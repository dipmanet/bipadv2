import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import bbox from '@turf/bbox';
import { navigate } from '@reach/router';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import { reverseRoute } from '@togglecorp/fujs';
import store from '#store';

import { hazardTypesSelector } from '#selectors';

import Tooltip from '#components/Tooltip';

import nepalGeoJson from '#resources/districts.json';

import {
    calculateScaledSeverity,
    getHazardColor,
} from '../utils';


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

// severityScaleFactor is to show severity as radius of circle in map, which is logarithmic
// and for small values, all severities look same for which we need to scale
const severityScaleFactor = 20000;

const mapStateToProps = state => ({
    hazards: hazardTypesSelector(state),
});

// NOTE: store needs to be passed bacause somehow this goes out of context in MapLayer
const toolTipWrapper = props => <Tooltip store={store} {...props} />;


class IncidentMap extends React.PureComponent {
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
        const { hazards } = this.props;
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
                        incidentId: incident.id,
                        // Calculate severity from loss
                        severity: calculateScaledSeverity(severityScaleFactor, incident.loss),
                        hazardColor: getHazardColor(hazards[incident.hazard]),
                    },
                })),
        };

        return geojson;
    });

    getPolygonFeatureCollection = memoize((incidentList) => {
        const { hazards } = this.props;
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
                        incidentId: incident.id,
                        severity: calculateScaledSeverity(severityScaleFactor, incident.loss),
                        hazardColor: getHazardColor(hazards[incident.hazard]),
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
                        property="incidentId"
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
                        property="incidentId"
                        paint={polygonBoundsFill}
                        onClick={this.handlePointClick}
                        hoverInfo={this.polygonHoverInfo}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

export default compose(connect(mapStateToProps))(IncidentMap);
