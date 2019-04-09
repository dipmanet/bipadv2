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
    alertToGeojson,
    eventToGeojson,
} from '#utils/domain';

import { hazardTypesSelector } from '#selectors';

import styles from './styles.scss';

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

    getAlertsFeatureCollection = memoize(alertToGeojson);
    getEventsFeatureCollection = memoize(eventToGeojson);

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

    render() {
        const {
            alertList,
            eventList,
            hazards,
            leftPaneExpanded,
            rightPaneExpanded,
        } = this.props;

        const featureCollection = this.getAlertsFeatureCollection(alertList, hazards);
        const eventsFeatureCollection = this.getEventsFeatureCollection(eventList, hazards);
        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);

        return (
            <React.Fragment>
                <CommonMap
                    boundsPadding={boundsPadding}
                />
                <MapSource
                    sourceKey="alerts"
                    geoJson={featureCollection}
                >
                    <MapLayer
                        layerKey="alerts-fill"
                        type="fill"
                        enableHover
                        paint={mapStyles.alertPolygon.fill}
                        tooltipRenderer={AlertTooltip}
                        tooltipRendererParams={this.alertTooltipRendererParams}
                    />
                </MapSource>
                <MapSource
                    sourceKey="events"
                    geoJson={eventsFeatureCollection}
                >
                    <MapLayer
                        layerKey="events-fill"
                        type="fill"
                        enableHover
                        paint={mapStyles.eventPolygon.fill}
                        tooltipRenderer={EventTooltip}
                        tooltipRendererParams={this.eventTooltipRendererParams}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(AlertEventMap);
