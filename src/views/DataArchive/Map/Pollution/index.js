import React from 'react';
import { connect } from 'react-redux';

import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';
import CommonMap from '#components/CommonMap';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';
import FormattedDate from '#rscv/FormattedDate';
import { MapChildContext } from '#re-map/context';

import PollutionModal from '../../Modals/Pollution';
import {
    mapStyles,
    getMapPaddings,
} from '#constants';
import { pollutionFiltersSelector } from '#selectors';
import styles from './styles.scss';

const mapStateToProps = state => ({
    pollutionFilters: pollutionFiltersSelector(state),
});

const PollutionToolTip = ({ renderer: Renderer, params }) => (
    <Renderer {...params} />
);

const pollutionToGeojson = (pollutionList) => {
    const geojson = {
        type: 'FeatureCollection',
        features: pollutionList
            .filter(pollution => pollution.point)
            .map(pollution => ({
                id: pollution.id,
                type: 'Feature',
                geometry: {
                    ...pollution.point,
                },
                properties: {
                    ...pollution,
                    aqi: Math.round(pollution.aqi),
                    date: Date.parse(pollution.createdOn) || 1,
                },
            })),
    };
    return geojson;
};

const nepalBounds = [
    80.05858661752784, 26.347836996368667,
    88.20166918432409, 30.44702867091792,
];

class PollutionMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tooltipRenderer: null,
            coordinates: undefined,
            tooltipParams: null,
            showModal: false,
        };
    }

    getPollutionFeatureCollection = memoize(pollutionToGeojson);

    getBoundsPadding = memoize((leftPaneExpanded, rightPaneExpanded) => {
        const mapPaddings = getMapPaddings();

        if (leftPaneExpanded && rightPaneExpanded) {
            return mapPaddings.bothPaneExpanded;
        }

        if (leftPaneExpanded) {
            return mapPaddings.leftPaneExpanded;
        }

        if (rightPaneExpanded) {
            return mapPaddings.rightPaneExpanded;
        }

        return mapPaddings.noPaneExpanded;
    });

    handleModalClose = () => {
        this.setState({ tooltipRenderer: null,
            coordinates: undefined,
            tooltipParams: null,
            showModal: false });
    }

    handlePollutionClick = (feature, lngLat) => {
        const {
            properties: {
                title,
                aqi,
                description,
                createdOn: measuredOn,
                station: stationId,
            },
        } = feature;
        this.setState({
            tooltipRenderer: this.pollutionTooltipRenderer,
            tooltipParams: {
                title,
                description,
                aqi,
                measuredOn,
                stationId,
            },
            coordinates: lngLat,
        });
        return true;
    }

    aqiClassSelector = (aqi) => {
        if (aqi <= 50) {
            return styles.good;
        }
        if (aqi <= 100) {
            return styles.moderate;
        }
        if (aqi <= 150) {
            return styles.unhealthyForSensitive;
        }
        if (aqi <= 200) {
            return styles.unhealthy;
        }
        if (aqi <= 300) {
            return styles.veryUnhealthy;
        }
        if (aqi > 300) {
            return styles.hazardous;
        }
        return styles.good;
    }

    getAqiRemark = (aqi) => {
        if (aqi <= 50) {
            return 'Good';
        }
        if (aqi <= 100) {
            return 'Moderate';
        }
        if (aqi <= 150) {
            return 'Unhealthy for Sensitive Group';
        }
        if (aqi <= 200) {
            return 'Unhealthy';
        }
        if (aqi <= 300) {
            return 'Very Unhealthy';
        }
        if (aqi > 300) {
            return 'Hazardous';
        }
        return 'Good';
    }

    pollutionTooltipRenderer = ({ title, description, aqi, measuredOn }) => (
        <div className={styles.mainWrapper}>
            <div className={styles.tooltip}>
                <div className={_cs(this.aqiClassSelector(aqi), styles.header)}>
                    <h3>{title}</h3>
                    <span>
                        AQI
                        {' '}
                        {aqi}
                    </span>
                </div>

                <div className={styles.description}>
                    <div className={styles.key}>PH 2.5:</div>
                    <div className={styles.value}>{aqi}</div>
                </div>

                <div className={styles.eventOn}>
                    <div className={styles.key}>MEASURED ON:</div>
                    <div className={styles.value}>
                        <FormattedDate
                            value={measuredOn}
                            mode="yyyy-MM-dd hh:mm"
                        />
                    </div>
                </div>

                <div className={styles.remark}>
                    <div className={styles.key}>REMARK:</div>
                    <div className={styles.value}>{this.getAqiRemark(aqi)}</div>
                </div>
            </div>
            <div className={styles.line} />
            <div
                className={styles.getDetails}
            >
                <span
                    onClick={() => this.setState({ showModal: true })}
                    role="presentation"
                >
                    Get Details
                </span>
            </div>
        </div>
    )

    handleTooltipClose = () => {
        this.setState({
            tooltipRenderer: null,
            coordinates: undefined,
            tooltipParams: null,
        });
    }

    render() {
        const { data,
            pollutionFilters,
            rightPaneExpanded,
            leftPaneExpanded } = this.props;
        const {
            tooltipRenderer,
            tooltipParams,
            coordinates,
        } = this.state;
        const pollutionFeatureCollection = this.getPollutionFeatureCollection(
            data,
        );
        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);
        const { station: { point } } = pollutionFilters;
        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 8,
        };

        const { showModal } = this.state;
        const { map } = this.context;
        if (point && map) {
            const { coordinates: stationCords } = point;
            map.flyTo({
                center: stationCords,
                zoom: 10,
            });
        } else {
            map.fitBounds(nepalBounds);
        }
        const { title: stationName, stationId } = tooltipParams || {};
        return (
            <div className={styles.dataArchivePollutionMap}>
                <CommonMap
                    sourceKey="dataArchivePollution"
                    boundsPadding={boundsPadding}
                />
                {coordinates && (
                    <MapTooltip
                        coordinates={coordinates}
                        tooltipOptions={tooltipOptions}
                        onHide={this.handleTooltipClose}
                    >
                        <PollutionToolTip
                            renderer={tooltipRenderer}
                            params={tooltipParams}
                        />
                    </MapTooltip>
                )}
                <MapSource
                    sourceKey="real-time-pollution-points"
                    geoJson={pollutionFeatureCollection}
                    sourceOptions={{ type: 'geojson' }}
                    supportHover
                >
                    <React.Fragment>
                        <MapLayer
                            layerKey="real-time-pollution-points-fill"
                            onClick={this.handlePollutionClick}
                            layerOptions={{
                                type: 'circle',
                                property: 'pollutionId',
                                paint: mapStyles.pollutionPoint.fill,
                            }}
                        />
                        <MapLayer
                            layerKey="real-time-pollution-text"
                            layerOptions={{
                                type: 'symbol',
                                property: 'pollutionId',
                                layout: mapStyles.archivePollutionText.layout,
                                paint: mapStyles.archivePollutionText.paint,
                            }}
                        />
                    </React.Fragment>
                </MapSource>
                {showModal
                && (
                    <PollutionModal
                        handleModalClose={this.handleModalClose}
                        stationName={stationName}
                        stationId={stationId}
                    />
                )
                }
            </div>
        );
    }
}

PollutionMap.contextType = MapChildContext;
export default connect(mapStateToProps, [])(PollutionMap);
