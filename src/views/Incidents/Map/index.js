import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapState from '#re-map/MapSource/MapState';
import MapTooltip from '#re-map/MapTooltip';

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
    mapHoverAttributes: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    wardsMap: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    provincesMap: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    districtsMap: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    municipalitiesMap: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
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

        this.state = {};
    }

    getPointFeatureCollection = memoize(incidentPointToGeojson)

    getPolygonFeatureCollection = memoize(incidentPolygonToGeojson);

    getFilter = memoize(timestamp => (
        ['>', ['get', 'incidentOn'], timestamp]
    ))

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

    handleIncidentClick = (feature, lngLat) => {
        const { id } = feature;
        const { incidentList } = this.props;
        const incident = incidentList.find(item => item.id === id);
        this.setState({
            incident,
            incidentLngLat: lngLat,
        });
    }

    handleIncidentClose = () => {
        this.setState({
            incident: undefined,
            incidentLngLat: undefined,
        });
    }

    render() {
        const {
            incidentList,
            hazards,
            recentDay,
            mapHoverAttributes,
            wardsMap,
            provincesMap,
            districtsMap,
            municipalitiesMap,
        } = this.props;

        const pointFeatureCollection = this.getPointFeatureCollection(incidentList, hazards);
        const polygonFeatureCollection = this.getPolygonFeatureCollection(incidentList, hazards);

        const recentTimestamp = getYesterday(recentDay);
        const filter = this.getFilter(recentTimestamp);
        const {
            incident,
            incidentLngLat,
        } = this.state;

        const tooltipOptions = {
            closeOnClick: true,
            closeButton: true,
            offset: 8,
        };

        return (
            <React.Fragment>
                <CommonMap sourceKey="incidents" />
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
                        }}
                        onAnimationFrame={this.handleAnimationKeyframe}
                    />
                    <MapLayer
                        layerKey="incident-points-fill"
                        layerOptions={{
                            type: 'circle',
                            paint: mapStyles.incidentPoint.fill,
                            enableHover: true,
                        }}
                        onClick={this.handleIncidentClick}
                        onMouseEnter={this.handleIncidentMouseEnter}
                        onMouseLeave={this.handleIncidentMouseLeave}
                    />
                    { incidentLngLat && (
                        <MapTooltip
                            coordinates={incidentLngLat}
                            tooltipOptions={tooltipOptions}
                            onHide={this.handleIncidentClose}
                        >
                            <IncidentInfo
                                incident={incident}
                                wardsMap={wardsMap}
                                provincesMap={provincesMap}
                                districtsMap={districtsMap}
                                municipalitiesMap={municipalitiesMap}
                                className={styles.incidentInfo}
                            />
                        </MapTooltip>
                    )}
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
