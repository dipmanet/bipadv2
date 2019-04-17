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
import { getYesterday } from '#utils/common';

import { hazardTypesSelector } from '#selectors';

import styles from './styles.scss';

// FIXME: move somewhere else
const framize = (fn, duration = 2000) => {
    let prevTimestamp;
    return (timestamp) => {
        if (!prevTimestamp) {
            prevTimestamp = timestamp;
        }
        const diff = timestamp - prevTimestamp;
        if (diff > duration) {
            prevTimestamp = timestamp;
        }
        const percent = (timestamp - prevTimestamp) / duration;
        return fn(percent, timestamp);
    };
};

const AlertTooltip = ({ title, description }) => (
    <div className={styles.tooltip}>
        <h3 className={styles.heading}>
            {title}
        </h3>
        <TextOutput
            label="Description"
            value={description}
        />
    </div>
);

const EventTooltip = ({ title, description, severity, createdOn }) => (
    <div className={styles.tooltip}>
        <h3 className={styles.heading}>
            {title}
        </h3>
        <TextOutput
            label="Description"
            value={description}
        />
        <TextOutput
            label="Severity"
            value={severity}
        />
        <TextOutput
            label="Created On"
            value={
                <FormattedDate
                    date={createdOn}
                    mode="dd-MM-yyyy hh:mm"
                />
            }
        />
    </div>
);

AlertTooltip.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

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

    getBoundsPadding = memoize((leftPaneExpanded, rightPaneExpanded) => {
        const mapPaddings = getMapPaddings();

        if (leftPaneExpanded && rightPaneExpanded) {
            return mapPaddings.bothPaneExpanded;
        } else if (leftPaneExpanded) {
            return mapPaddings.leftPaneExpanded;
        } else if (rightPaneExpanded) {
            return mapPaddings.rightPaneExpanded;
        }
        return mapPaddings.noPaneExpanded;
    });

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

    render() {
        const {
            alertList,
            eventList,
            hazards,
            leftPaneExpanded,
            rightPaneExpanded,
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

        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);


        const recentTimestamp = getYesterday(recentDay);
        const filter = this.getFilter(recentTimestamp);

        return (
            <React.Fragment>
                <CommonMap
                    boundsPadding={boundsPadding}
                />

                <MapSource
                    sourceKey="alerts-convex-polygon"
                    geoJson={featureConvexCollection}
                >
                    <MapLayer
                        layerKey="alerts-convex-outline"
                        type="line"
                        paint={mapStyles.alertConvex.outline}
                    />
                </MapSource>
                <MapSource
                    sourceKey="alerts-polygon"
                    geoJson={featurePolygonCollection}
                >
                    <MapLayer
                        layerKey="alerts-polygon-fill"
                        type="fill"
                        paint={mapStyles.alertPolygon.fill}
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
                    />
                </MapSource>

                <MapSource
                    sourceKey="events-convex-polygon"
                    geoJson={eventsConvexFeatureCollection}
                >
                    <MapLayer
                        layerKey="events-convex-outline"
                        type="line"
                        paint={mapStyles.eventConvex.outline}
                    />
                </MapSource>
                <MapSource
                    sourceKey="events-polygon"
                    geoJson={eventsPolygonFeatureCollection}
                >
                    <MapLayer
                        layerKey="events-polygon-fill"
                        type="fill"
                        paint={mapStyles.eventPolygon.fill}
                    />
                    <MapLayer
                        layerKey="events-polygon-outline"
                        type="line"
                        paint={mapStyles.eventPolygon.outline}
                    />
                </MapSource>
                <MapSource
                    sourceKey="events-point"
                    geoJson={eventsPointFeatureCollection}
                >
                    <MapLayer
                        layerKey="events-point"
                        type="circle"
                        enableHover
                        paint={mapStyles.eventPoint.circle}
                        tooltipRenderer={EventTooltip}
                        tooltipRendererParams={this.eventTooltipRendererParams}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(AlertEventMap);
