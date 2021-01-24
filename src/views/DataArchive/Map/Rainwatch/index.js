import React from 'react';
import { connect } from 'react-redux';

import memoize from 'memoize-one';
import CommonMap from '#components/CommonMap';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';
import { MapChildContext } from '#re-map/context';

import RainModal from '../../Modals/Rainwatch';
import {
    mapStyles,
    getMapPaddings,
} from '#constants';
import { pollutionFiltersSelector } from '#selectors';
import styles from './styles.scss';

const mapStateToProps = state => ({
    pollutionFilters: pollutionFiltersSelector(state),
});

const RainToolTip = ({ renderer: Renderer, params }) => (
    <Renderer {...params} />
);

const rainToGeojson = (rainList) => {
    const geojson = {
        type: 'FeatureCollection',
        features: rainList
            .filter(rain => rain.point)
            .map(rain => ({
                id: rain.id,
                type: 'Feature',
                geometry: {
                    ...rain.point,
                },
                properties: {
                    ...rain,
                    rainId: rain.id,
                    title: rain.title,
                    description: rain.description,
                    basin: rain.basin,
                    status: rain.status,
                },
            })),
    };
    return geojson;
};

class RainMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tooltipRenderer: null,
            coordinates: undefined,
            tooltipParams: null,
            showModal: false,
        };
    }

    getRainFeatureCollection = memoize(rainToGeojson);

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

    handleRainClick = (feature, lngLat) => {
        const {
            properties: {
                title,
                description,
                basin,
                status,
                station: stationId,
            },
            geometry,
        } = feature;
        this.setState({
            tooltipRenderer: this.rainTooltipRenderer,
            tooltipParams: {
                title,
                description,
                basin,
                status,
                stationId,
                geometry,
            },
            coordinates: lngLat,
        });
        return true;
    }

    rainTooltipRenderer = ({ title, basin }) => (
        <div className={styles.mainWrapper}>
            <div className={styles.tooltip}>
                <div className={styles.header}>
                    <h3>{`Heavy Rainfall at ${title || 'N/A'}`}</h3>
                </div>

                <div className={styles.description}>
                    <div className={styles.key}>BASIN:</div>
                    <div className={styles.value}>{basin || 'N/A'}</div>
                </div>

                <div className={styles.description}>
                    <div className={styles.key}>STATION NAME:</div>
                    <div className={styles.value}>{title || 'N/A'}</div>
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

        const rainFeatureCollection = this.getRainFeatureCollection(
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
            <div className={styles.dataArchiveRainMap}>
                <CommonMap
                    sourceKey="dataArchiveRain"
                    boundsPadding={boundsPadding}
                    region={municipality ? region : undefined}
                />
                {coordinates && (
                    <MapTooltip
                        coordinates={coordinates}
                        tooltipOptions={tooltipOptions}
                        onHide={this.handleTooltipClose}
                    >
                        <RainToolTip
                            renderer={tooltipRenderer}
                            params={tooltipParams}
                        />
                    </MapTooltip>
                )}
                <MapSource
                    sourceKey="real-time-rain-points"
                    geoJson={rainFeatureCollection}
                    sourceOptions={{ type: 'geojson' }}
                    supportHover
                >
                    <React.Fragment>
                        <MapLayer
                            layerKey="real-time-rain-circle"
                            onClick={this.handleRainClick}
                            layerOptions={{
                                type: 'circle',
                                // paint: mapStyles.rainPoint.paint,
                                paint: mapStyles.rainPoint.circle,
                            }}
                        />
                    </React.Fragment>
                </MapSource>
                {showModal
                && (
                    <RainModal
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

RainMap.contextType = MapChildContext;
export default connect(mapStateToProps, [])(RainMap);
