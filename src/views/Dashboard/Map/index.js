import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';
import { unique } from '@togglecorp/fujs';

import List from '#rscv/List';
import MapSource from '#re-map/MapSource';
import MapImage from '#re-map/MapImage';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapState from '#re-map/MapSource/MapState';
import MapTooltip from '#re-map/MapTooltip';

import FormattedDate from '#rscv/FormattedDate';

// import SVGMapIcon from '#components/SVGMapIcon';
import CommonMap from '#components/CommonMap';
import TextOutput from '#components/TextOutput';

import { mapStyles } from '#constants';

import {
    alertToConvexPolygonGeojson,
    alertToPolygonGeojson,
    alertToPointGeojson,

    eventToConvexPolygonGeojson,
    eventToPolygonGeojson,
    eventToPointGeojson,
} from '#utils/domain';
import { getYesterday, framize, getImage } from '#utils/common';

import { hazardTypesSelector } from '#selectors';

import RainTooltip from './Tooltips/Alerts/Rain';
import RiverTooltip from './Tooltips/Alerts/River';
import EarthquakeTooltip from './Tooltips/Alerts/Earthquake';
import FireTooltip from './Tooltips/Alerts/Fire';
import PollutionTooltip from './Tooltips/Alerts/Pollution';

import styles from './styles.scss';

// const AlertTooltip = ({ title, description }) => (
// <div className={styles.alertTooltip}>
//     <h3 className={styles.heading}>
//         {title}
//     </h3>
//     <div className={styles.description}>
//         { description }
//     </div>
// </div>
// );

const AlertTooltip = ({ title, description, referenceType, referenceData, createdDate }) => {
    if (referenceType && referenceType === 'rain') {
        return RainTooltip(title, description, createdDate, referenceData);
    }
    if (referenceType && referenceType === 'river') {
        return RiverTooltip(title, description, createdDate, referenceData);
    }
    if (title.toUpperCase().includes('EARTH') && referenceData) {
        return EarthquakeTooltip(title, description, createdDate, referenceData);
    }
    if (referenceType && referenceType === 'fire') {
        return FireTooltip(title, description, createdDate, referenceData);
    }
    if (referenceType && referenceType === 'pollution') {
        return PollutionTooltip(title, description, createdDate, referenceData);
    }
    if (title) {
        return (
            <div className={styles.alertTooltip}>
                <h3 className={styles.heading}>
                    {title}
                </h3>
                <div className={styles.description}>
                    { description }
                </div>
            </div>
        );
    } return null;
};

AlertTooltip.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

const EventTooltip = ({ title, description, severity, createdOn }) => (
    <div className={styles.eventTooltip}>
        <h3 className={styles.heading}>
            {title}
        </h3>
        <div className={styles.content}>
            <TextOutput
                className={styles.createdOn}
                labelClassName={styles.label}
                valueClassName={styles.value}
                label="Created On"
                value={(
                    <FormattedDate
                        value={createdOn}
                        mode="yyyy-MM-dd hh:mm"
                    />
                )}
            />
            <TextOutput
                className={styles.severity}
                labelClassName={styles.label}
                valueClassName={styles.value}
                label="Severity"
                value={severity}
            />
            <TextOutput
                className={styles.description}
                labelClassName={styles.label}
                valueClassName={styles.value}
                label="Description"
                value={description}
            />
        </div>
    </div>
);

EventTooltip.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    severity: PropTypes.string.isRequired,
    createdOn: PropTypes.string.isRequired,
};

EventTooltip.defaultProps = {
    description: undefined,
};

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    alertList: PropTypes.array,
    // eslint-disable-next-line react/forbid-prop-types
    eventList: PropTypes.array,
    // eslint-disable-next-line react/forbid-prop-types
    hazards: PropTypes.object,
    onAlertHover: PropTypes.func.isRequired,
    onEventHover: PropTypes.func.isRequired,
};

const defaultProps = {
    alertList: [],
    eventList: [],
    hazards: {},
};

const mapStateToProps = state => ({
    hazards: hazardTypesSelector(state),
});

const hazardKeySelector = hazard => hazard.id;

const visibleLayout = {
    visibility: 'visible',
};
const noneLayout = {
    visibility: 'none',
};

class AlertEventMap extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {};
    }

    static propTypes = propTypes;

    static defaultProps = defaultProps;

    getConvexAlertsFeatureCollection = memoize(alertToConvexPolygonGeojson);

    getPolygonAlertsFeatureCollection = memoize(alertToPolygonGeojson);

    getPointAlertsFeatureCollection = memoize(alertToPointGeojson);

    getConvexEventsFeatureCollection = memoize(eventToConvexPolygonGeojson);

    getPolygonEventsFeatureCollection = memoize(eventToPolygonGeojson);

    getPointEventsFeatureCollection = memoize(eventToPointGeojson);

    getFilter = memoize(timestamp => (
        ['>', ['get', 'createdOn'], timestamp]
    ))

    alertTooltipRendererParams = (id, { title, description }) => ({
        title,
        description,
        closeOnClick: true,
    })

    eventTooltipRendererParams = (id, { title, description, severity, createdOn }) => ({
        title,
        description,
        severity,
        createdOn,
    })

    handleAnimationKeyframe = framize((percent) => {
        const p = percent ** 3;
        const radius = p * 20;
        const opacity = (1 - p);
        return {
            'circle-radius': radius,
            // 'circle-radius': ['+', mapStyles.incidentPoint.fill['circle-radius'], radius],
            'circle-opacity': opacity,
        };
    })

    handleAlertClick = (feature, lngLat) => {
        console.log('lat lng', lngLat);
        const { properties:
            { title,
                description,
                referenceType,
                referenceData,
                startedOn,
                createdDate } } = feature;
        const data = referenceData ? JSON.parse(referenceData) : undefined;

        this.setState({
            alertTitle: title,
            alertDescription: description,
            alertClickLngLat: lngLat,
            alertReferenceType: referenceType,
            alertReferenceData: data,
            alertCreatedDate: startedOn,
        });
    }

    handleEventClick = (feature, lngLat) => {
        const { properties: { title, severity, createdOn, description } } = feature;
        this.setState({
            eventTitle: title,
            eventSeverity: severity,
            eventCreatedOn: createdOn,
            eventDescription: description,
            eventClickLngLat: lngLat,
        });
    }

    handleEventClose = () => {
        this.setState({
            eventClickLngLat: undefined,
        });
    }

    handleAlertClose = () => {
        this.setState({
            alertClickLngLat: undefined,
        });
    }

    handleAlertEnter = (feature) => {
        const { id } = feature;
        const { onAlertHover } = this.props;
        onAlertHover(id);
    }

    handleAlertLeave = () => {
        const { onAlertHover } = this.props;
        onAlertHover();
    }

    handleEventEnter = (feature) => {
        const { id } = feature;
        const { onEventHover } = this.props;
        onEventHover(id);
    }

    handleEventLeave = () => {
        const { onEventHover } = this.props;
        onEventHover();
    }

    getHazardList = (alertList = [], eventList = []) => {
        const { hazards } = this.props;
        const alertHazardIdList = alertList.map(v => v.hazard)
            .filter(v => v);
        const eventHazardIdList = eventList.map(v => v.hazard)
            .filter(v => v);

        const uniqueIds = [...new Set([...alertHazardIdList, ...eventHazardIdList])];

        return uniqueIds.map(id => hazards[id]);
    }

    mapImageRendererParams = (_, hazard) => {
        const image = getImage(hazard.icon)
            .setAttribute('crossOrigin', '');

        return ({ name: hazard.title, image });
    }

    render() {
        const {
            alertList,
            eventList,
            hazards,
            recentDay,
            alertHoverAttributes,
            eventHoverAttributes,
            isEventHovered,
            isAlertHovered,
        } = this.props;

        const featureConvexCollection = this.getConvexAlertsFeatureCollection(alertList, hazards);
        const featurePolygonCollection = this.getPolygonAlertsFeatureCollection(alertList, hazards);
        const featurePointCollection = this.getPointAlertsFeatureCollection(alertList, hazards);

        let hazardList = this.getHazardList(alertList);
        hazardList = hazardList.filter(item => item);

        const eventsConvexFeatureCollection = this.getConvexEventsFeatureCollection(
            eventList,
            hazards,
        );
        const eventsPolygonFeatureCollection = this.getPolygonEventsFeatureCollection(
            eventList,
            hazards,
        );
        const eventsPointFeatureCollection = this.getPointEventsFeatureCollection(
            eventList,
            hazards,
        );

        const recentTimestamp = getYesterday(recentDay);
        const filter = this.getFilter(recentTimestamp);

        const {
            eventTitle,
            eventSeverity,
            eventCreatedOn,
            eventDescription,
            eventClickLngLat,
            alertTitle,
            alertDescription,
            alertClickLngLat,
            alertReferenceType,
            alertReferenceData,
            alertCreatedDate,
        } = this.state;

        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 8,
        };

        const icons = unique(
            [
                ...alertList
                    .filter(alert => alert.hazardInfo && alert.hazardInfo.icon)
                    .map(alert => alert.hazardInfo.icon),
                ...eventList
                    .filter(event => event.hazardInfo && event.hazardInfo.icon)
                    .map(event => event.hazardInfo.icon),
            ],
            icon => icon,
        );
        // { alertClickLngLat && (
        //     <MapTooltip
        //         coordinates={alertClickLngLat}
        //         tooltipOptions={tooltipOptions}
        //         onHide={this.handleAlertClose}
        //     >
        //         <AlertTooltip
        //             title={alertTitle}
        //             description={alertDescription}
        //             referenceType={alertReferenceType}
        //             referenceData={alertReferenceData}
        //             createdDate={alertCreatedDate}
        //         />
        //     </MapTooltip>
        // ); }
        console.log('alert', alertClickLngLat);
        return (
            <React.Fragment>
                <CommonMap sourceKey="dashboard" />
                {/* icons.map(icon => (
                    <SVGMapIcon
                        key={icon}
                        src={icon}
                        name={icon}
                        fillColor="#222222"
                    />
                )) */}
                <List
                    keySelector={hazardKeySelector}
                    data={hazardList}
                    renderer={MapImage}
                    rendererParams={this.mapImageRendererParams}
                    emptyComponent={null}
                />
                <MapSource
                    sourceKey="alerts-convex-polygon"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={featureConvexCollection}
                >
                    <MapLayer
                        layerKey="alerts-convex-outline"
                        layerOptions={{
                            type: 'line',
                            paint: mapStyles.alertConvex.outline,
                        }}
                    />
                </MapSource>
                <MapSource
                    sourceKey="alerts-polygon"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={featurePolygonCollection}
                >
                    <MapLayer
                        layerKey="alerts-polygon-fill"
                        layerOptions={{
                            type: 'fill',
                            paint: mapStyles.alertPolygon.fill,
                        }}
                    />
                    <MapLayer
                        layerKey="alerts-polygon-outline"
                        layerOptions={{
                            type: 'line',
                            paint: mapStyles.alertPolygon.outline,
                        }}
                    />
                </MapSource>
                <MapSource
                    sourceKey="alerts-point"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={featurePointCollection}
                >
                    <MapLayer
                        layerKey="alerts-point-animated"
                        layerOptions={{
                            type: 'circle',
                            filter,
                            paint: mapStyles.alertPoint.animatedCircle,
                            layout: isAlertHovered || isEventHovered
                                ? noneLayout
                                : visibleLayout,
                        }}
                        onAnimationFrame={this.handleAnimationKeyframe}
                    />
                    <MapLayer
                        layerKey="alerts-point"
                        layerOptions={{
                            type: 'circle',
                            paint: isAlertHovered || isEventHovered
                                ? mapStyles.alertPoint.circleDim
                                : mapStyles.alertPoint.circle,
                        }}
                        onMouseEnter={this.handleAlertEnter}
                        onMouseLeave={this.handleAlertLeave}
                        onClick={this.handleAlertClick}
                    />
                    {/*
                    <MapLayer
                        layerKey="alerts-point-icon"
                        layerOptions={{
                            type: 'symbol',
                            layout: {
                                'icon-image': ['get', 'hazardIcon'],
                                'icon-size': 0.2,
                            },
                            paint: isAlertHovered || isEventHovered
                                ? { 'icon-opacity': 0.1 }
                                : { 'icon-opacity': 0.9 },
                        }}
                    />
                    */}
                    {alertClickLngLat && (
                        <MapTooltip
                            coordinates={alertClickLngLat}
                            tooltipOptions={tooltipOptions}
                            onHide={this.handleAlertClose}
                        >
                            <AlertTooltip
                                title={alertTitle}
                                description={alertDescription}
                                referenceType={alertReferenceType}
                                referenceData={alertReferenceData}
                                createdDate={alertCreatedDate}
                            />
                        </MapTooltip>
                    )}
                    <MapState
                        attributes={alertHoverAttributes}
                        attributeKey="hover"
                    />
                </MapSource>
                <MapSource
                    sourceKey="events-convex-polygon"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={eventsConvexFeatureCollection}
                >
                    <MapLayer
                        layerKey="events-convex-outline"
                        layerOptions={{
                            type: 'line',
                            paint: mapStyles.eventConvex.outline,
                        }}
                    />
                </MapSource>
                <MapSource
                    sourceKey="events-polygon"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={eventsPolygonFeatureCollection}
                >
                    <MapLayer
                        layerKey="events-polygon-fill"
                        layerOptions={{
                            type: 'fill',
                            paint: mapStyles.eventPolygon.fill,
                        }}
                    />
                    <MapLayer
                        layerKey="events-polygon-outline"
                        layerOptions={{
                            type: 'line',
                            paint: mapStyles.eventPolygon.outline,
                        }}
                    />
                </MapSource>
                <MapSource
                    sourceKey="events-symbol"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={eventsPointFeatureCollection}
                >
                    <MapLayer
                        layerKey="events-point"
                        layerOptions={{
                            type: 'symbol',
                            layout: mapStyles.eventSymbol.layout,
                            paint: isEventHovered || isAlertHovered
                                ? mapStyles.eventSymbol.paintDim
                                : mapStyles.eventSymbol.paint,
                        }}
                        onClick={this.handleEventClick}
                        onMouseEnter={this.handleEventEnter}
                        onMouseLeave={this.handleEventLeave}
                    />
                    <MapLayer
                        layerKey="events-point-icon"
                        layerOptions={{
                            type: 'symbol',
                            layout: {
                                'icon-image': ['get', 'hazardIcon'],
                                'icon-size': 0.2,
                            },
                            paint: isAlertHovered || isEventHovered
                                ? { 'icon-opacity': 0.1 }
                                : { 'icon-opacity': 0.9 },
                        }}
                    />
                    {eventClickLngLat && (
                        <MapTooltip
                            coordinates={eventClickLngLat}
                            tooltipOptions={tooltipOptions}
                            onHide={this.handleEventClose}
                        >
                            <EventTooltip
                                title={eventTitle}
                                severity={eventSeverity}
                                createdOn={eventCreatedOn}
                                description={eventDescription}
                            />
                        </MapTooltip>
                    )}
                    <MapState
                        attributes={eventHoverAttributes}
                        attributeKey="hover"
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(AlertEventMap);
