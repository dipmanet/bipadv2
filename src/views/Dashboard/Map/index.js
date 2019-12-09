import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';
import FormattedDate from '#rscv/FormattedDate';

import CommonMap from '#components/CommonMap';
import TextOutput from '#components/TextOutput';

import {
    mapStyles,
    getMapPaddings,
} from '#constants';

import {
    alertToConvexPolygonGeojson,
    alertToPolygonGeojson,
    alertToPointGeojson,

    eventToConvexPolygonGeojson,
    eventToPolygonGeojson,
    eventToPointGeojson,
} from '#utils/domain';
import { getYesterday, framize } from '#utils/common';

import { hazardTypesSelector } from '#selectors';

import styles from './styles.scss';

const AlertTooltip = ({ title, description }) => (
    <div className={styles.alertTooltip}>
        <h3 className={styles.heading}>
            {title}
        </h3>
        <div className={styles.description}>
            { description }
        </div>
    </div>
);

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
    description: PropTypes.string.isRequired,
    severity: PropTypes.string.isRequired,
    createdOn: PropTypes.string.isRequired,
};


const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    alertList: PropTypes.array,
    // eslint-disable-next-line react/forbid-prop-types
    eventList: PropTypes.array,
    // eslint-disable-next-line react/forbid-prop-types
    hazards: PropTypes.object,
    onHoverChange: PropTypes.func.isRequired,
};

const defaultProps = {
    alertList: [],
    eventList: [],
    hazards: {},
};

const mapStateToProps = state => ({
    hazards: hazardTypesSelector(state),
});

class AlertEventMap extends React.PureComponent {
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
        closeOnClick: true,
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

    handleAlertHover = (alertId) => {
        this.props.onHoverChange('alert', alertId);
    }

    handleEventHover = (eventId) => {
        this.props.onHoverChange('event', eventId);
    }

    render() {
        const {
            alertList,
            eventList,
            hazards,
            recentDay,
        } = this.props;

        const featureConvexCollection = this.getConvexAlertsFeatureCollection(alertList, hazards);
        const featurePolygonCollection = this.getPolygonAlertsFeatureCollection(alertList, hazards);
        const featurePointCollection = this.getPointAlertsFeatureCollection(alertList, hazards);

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

        return (
            <React.Fragment>
                <CommonMap />

                <MapSource
                    sourceKey="alerts-convex-polygon"
                    geoJson={featureConvexCollection}
                >
                    <MapLayer
                        layerKey="alerts-convex-outline"
                        type="line"
                        enableHover
                        paint={mapStyles.alertConvex.outline}
                        onHoverChange={this.handleAlertHover}
                    />
                </MapSource>
                <MapSource
                    sourceKey="alerts-polygon"
                    geoJson={featurePolygonCollection}
                >
                    <MapLayer
                        layerKey="alerts-polygon-fill"
                        type="fill"
                        enableHover
                        paint={mapStyles.alertPolygon.fill}
                        onHoverChange={this.handleAlertHover}
                    />
                    <MapLayer
                        layerKey="alerts-polygon-outline"
                        type="line"
                        paint={mapStyles.alertPolygon.outline}
                    />
                </MapSource>
                <MapSource
                    sourceKey="alerts-point"
                    geoJson={featurePointCollection}
                >
                    <MapLayer
                        layerKey="alerts-point-animated"
                        type="circle"
                        filter={filter}
                        paint={mapStyles.alertPoint.animatedCircle}
                        onAnimationKeyframe={this.handleAnimationKeyframe}
                    />
                    <MapLayer
                        layerKey="alerts-point"
                        type="circle"
                        paint={mapStyles.alertPoint.circle}
                        enableHover
                        tooltipRenderer={AlertTooltip}
                        tooltipRendererParams={this.alertTooltipRendererParams}
                        onHoverChange={this.handleAlertHover}
                    />
                </MapSource>

                <MapSource
                    sourceKey="events-convex-polygon"
                    geoJson={eventsConvexFeatureCollection}
                >
                    <MapLayer
                        layerKey="events-convex-outline"
                        type="line"
                        enableHover
                        paint={mapStyles.eventConvex.outline}
                        onHoverChange={this.handleEventHover}
                    />
                </MapSource>
                <MapSource
                    sourceKey="events-polygon"
                    geoJson={eventsPolygonFeatureCollection}
                >
                    <MapLayer
                        layerKey="events-polygon-fill"
                        type="fill"
                        enableHover
                        paint={mapStyles.eventPolygon.fill}
                        onHoverChange={this.handleEventHover}
                    />
                    <MapLayer
                        layerKey="events-polygon-outline"
                        type="line"
                        paint={mapStyles.eventPolygon.outline}
                    />
                </MapSource>
                <MapSource
                    sourceKey="events-symbol"
                    geoJson={eventsPointFeatureCollection}
                >
                    <MapLayer
                        layerKey="events-symbol"
                        type="symbol"
                        enableHover
                        layout={mapStyles.eventSymbol.layout}
                        paint={mapStyles.eventSymbol.paint}
                        tooltipRenderer={EventTooltip}
                        tooltipRendererParams={this.eventTooltipRendererParams}
                        onHoverChange={this.handleEventHover}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(AlertEventMap);
