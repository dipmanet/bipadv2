import React from 'react';
import { connect } from 'react-redux';

import memoize from 'memoize-one';
import CommonMap from '#components/CommonMap';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';
import { MapChildContext } from '#re-map/context';

import RiverModal from '../../Modals/Riverwatch';
import {
    mapStyles,
    getMapPaddings,
} from '#constants';
import { pollutionFiltersSelector } from '#selectors';
import { getDate, getTime } from '#views/DataArchive/utils';

import styles from './styles.scss';

const mapStateToProps = state => ({
    pollutionFilters: pollutionFiltersSelector(state),
});

const RiverToolTip = ({ renderer: Renderer, params }) => (
    <Renderer {...params} />
);

const riverToGeojson = (riverList) => {
    const geojson = {
        type: 'FeatureCollection',
        features: riverList
            .filter(river => river.point)
            .map(river => ({
                id: river.id,
                type: 'Feature',
                geometry: {
                    ...river.point,
                },
                properties: {
                    ...river,
                    riverId: river.id,
                    title: river.title,
                    description: river.description,
                    basin: river.basin,
                    status: river.status,
                    steady: river.steady,
                },
            })),
    };
    return geojson;
};

class RiverMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tooltipRenderer: null,
            coordinates: undefined,
            tooltipParams: null,
            showModal: false,
        };
    }

    getRiverFeatureCollection = memoize(riverToGeojson);

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

    handleRiverClick = (feature, lngLat) => {
        const {
            properties: {
                title,
                description,
                basin,
                status,
                createdOn: measuredOn,
                waterLevel,
                station: stationId,
            },
            geometry,
        } = feature;
        this.setState({
            tooltipRenderer: this.riverTooltipRenderer,
            tooltipParams: {
                title,
                description,
                basin,
                status,
                measuredOn,
                waterLevel,
                stationId,
                geometry,
            },
            coordinates: lngLat,
        });
        return true;
    }

    riverTooltipRenderer = ({ title, basin, measuredOn, waterLevel }) => (
        <div className={styles.mainWrapper}>
            <div className={styles.tooltip}>
                <div className={styles.header}>
                    <h3>{`${title} at ${basin}`}</h3>
                </div>

                <div className={styles.description}>
                    <div className={styles.key}>BASIN:</div>
                    <div className={styles.value}>{basin}</div>
                </div>

                <div className={styles.description}>
                    <div className={styles.key}>MEASURED ON:</div>
                    <div className={styles.value}>{`${getDate(measuredOn)} ${getTime(measuredOn)}`}</div>
                </div>
                <div className={styles.description}>
                    <div className={styles.key}>WATER LEVEL:</div>
                    <div className={styles.value}>{waterLevel.toFixed(2)}</div>
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

        const riverFeatureCollection = this.getRiverFeatureCollection(
            data,
        );
        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);
        const { station: { point, municipality } } = pollutionFilters;
        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 8,
        };

        const { showModal } = this.state;

        const { title: stationName, stationId, geometry } = tooltipParams || {};
        const region = { adminLevel: 3, geoarea: municipality || undefined };
        return (
            <div className={styles.dataArchiveRiverMap}>
                <CommonMap
                    sourceKey="dataArchiveRiver"
                    boundsPadding={boundsPadding}
                    region={municipality ? region : undefined}
                />
                {coordinates && (
                    <MapTooltip
                        coordinates={coordinates}
                        tooltipOptions={tooltipOptions}
                        onHide={this.handleTooltipClose}
                    >
                        <RiverToolTip
                            renderer={tooltipRenderer}
                            params={tooltipParams}
                        />
                    </MapTooltip>
                )}
                <MapSource
                    sourceKey="real-time-river-points"
                    geoJson={riverFeatureCollection}
                    sourceOptions={{ type: 'geojson' }}
                    supportHover
                >
                    <React.Fragment>
                        <MapLayer
                            layerKey="real-time-river-custom"
                            onClick={this.handleRiverClick}
                            layerOptions={{
                                type: 'symbol',
                                layout: mapStyles.riverPoint.layout,
                                // paint: mapStyles.riverPoint.paint,
                                paint: mapStyles.riverPoint.text,
                            }}
                        />
                    </React.Fragment>
                </MapSource>
                {showModal
                && (
                    <RiverModal
                        handleModalClose={this.handleModalClose}
                        stationName={stationName}
                        stationId={stationId}
                        geometry={geometry}
                    />
                )
                }
            </div>
        );
    }
}

RiverMap.contextType = MapChildContext;
export default connect(mapStateToProps, [])(RiverMap);
