import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapState from '#re-map/MapSource/MapState';

import CommonMap from '#components/CommonMap';
import {
    hazardTypesSelector,
    provincesMapSelector,
    districtsMapSelector,
    municipalitiesMapSelector,
    wardsMapSelector,
} from '#selectors';
import { mapStyles } from '#constants';
import IncidentInfo from '#components/IncidentInfo';

import {
    getYesterday,
    framize,
} from '#utils/common';

import {
    incidentPointToGeojson,
    incidentPolygonToGeojson,
} from '#utils/domain';

import styles from './styles.scss';

const propTypes = {
    incidentList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    hazards: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    recentDay: PropTypes.number.isRequired, // eslint-disable-line react/forbid-prop-types
    onIncidentHover: PropTypes.func.isRequired,
};

const defaultProps = {
};

const mapStateToProps = state => ({
    hazards: hazardTypesSelector(state),
    provincesMap: provincesMapSelector(state),
    districtsMap: districtsMapSelector(state),
    municipalitiesMap: municipalitiesMapSelector(state),
    wardsMap: wardsMapSelector(state),
});

class IncidentMap extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    constructor(props) {
        super(props);
        this.prevTimestamp = undefined;
    }

    getPointFeatureCollection = memoize(incidentPointToGeojson)

    getPolygonFeatureCollection = memoize(incidentPolygonToGeojson);

    getFilter = memoize(timestamp => (
        ['>', ['get', 'incidentOn'], timestamp]
    ))

    tooltipRendererParams = (id) => {
        const {
            incidentList,
            wardsMap,
            provincesMap,
            districtsMap,
            municipalitiesMap,
        } = this.props;

        const incident = incidentList.find(i => i.id === id);

        return {
            incident,
            wardsMap,
            provincesMap,
            districtsMap,
            municipalitiesMap,
            maxWidth: '320px',
            closeButton: false,
            closeOnClick: true,
            className: styles.incidentInfo,
        };
    }

    handleAnimationKeyframe = framize((percent) => {
        const p = percent;
        const radius = p * 20;
        const opacity = (1 - p);
        return {
            'circle-radius': radius,
            // 'circle-radius': ['+', mapStyles.incidentPoint.fill['circle-radius'], radius],
            'circle-opacity': opacity,
        };
    })

    handleIncidentMouseEnter = (feature) => {
        this.props.onIncidentHover(feature.id);
    }

    handleIncidentMouseLeave = () => {
        this.props.onIncidentHover(undefined);
    }

    render() {
        const {
            incidentList,
            hazards,
            recentDay,
            onIncidentHover,
            mapHoverAttributes,
        } = this.props;

        const pointFeatureCollection = this.getPointFeatureCollection(incidentList, hazards);
        const polygonFeatureCollection = this.getPolygonFeatureCollection(incidentList, hazards);

        const recentTimestamp = getYesterday(recentDay);
        const filter = this.getFilter(recentTimestamp);

        return (
            <React.Fragment>
                <CommonMap />
                <MapSource
                    sourceKey="incident-polygons"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={polygonFeatureCollection}
                >
                    <MapLayer
                        layerKey="incident-polygon-fill"
                        layerOptions={{
                            type: 'fill',
                            paint: mapStyles.incidentPolygon.fill,
                            enableHover: true,
                            tooltipRenderer: IncidentInfo,
                            tooltipRendererParams: this.tooltipRendererParams,
                        }}
                    />
                </MapSource>
                <MapSource
                    sourceKey="incident-points"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={pointFeatureCollection}
                >
                    <MapLayer
                        layerKey="incident-points-animate"
                        layerOptions={{
                            type: 'circle',
                            filter,
                            paint: mapStyles.incidentPoint.animatedFill,
                            onAnimationKeyframe: this.handleAnimationKeyframe,
                        }}
                    />
                    <MapLayer
                        layerKey="incident-points-fill"
                        layerOptions={{
                            type: 'circle',
                            paint: mapStyles.incidentPoint.fill,
                            // enableHover: true,
                            // tooltipRenderer: IncidentInfo,
                            // tooltipRendererParams: this.tooltipRendererParams,
                            // onHoverChange: onIncidentHover,
                        }}
                        onMouseEnter={this.handleIncidentMouseEnter}
                        onMouseLeave={this.handleIncidentMouseLeave}
                    />
                    <MapState
                        attributes={mapHoverAttributes}
                        attributeKey="hover"
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(IncidentMap);
