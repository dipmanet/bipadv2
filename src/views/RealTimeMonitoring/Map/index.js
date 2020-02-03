import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';
import FormattedDate from '#rscv/FormattedDate';

import TextOutput from '#components/TextOutput';
import CommonMap from '#components/CommonMap';

import {
    mapStyles,
    getMapPaddings,
} from '#constants';
import {
    earthquakeToGeojson,
    riverToGeojson,
    rainToGeojson,
    fireToGeojson,
    pollutionToGeojson,
    getRasterTile,
} from '#utils/domain';

import RiverDetails from './RiverDetails';
import RainDetails from './RainDetails';
import styles from './styles.scss';

const RealTimeTooltip = ({ renderer: Renderer, params }) => (
    <Renderer {...params} />
);

RealTimeTooltip.propTypes = {
    renderer: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default class RealTimeMap extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            rainTitle: undefined,
            riverTitle: undefined,
            showRiverModal: false,
            showRainModal: false,
        };
    }

    getEarthquakeFeatureCollection = memoize(earthquakeToGeojson)

    getRiverFeatureCollection = memoize(riverToGeojson)

    getRainFeatureCollection = memoize(rainToGeojson);

    getFireFeatureCollection = memoize(fireToGeojson);

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

    handleRainClick = (feature) => {
        const { properties: { title } } = feature;
        this.setState({
            riverTitle: undefined,
            showRiverModal: false,

            rainTitle: title,
            showRainModal: true,
        });
        return true;
    }

    handleRiverClick = (feature) => {
        const { properties: { title } } = feature;

        this.setState({
            riverTitle: title,
            showRiverModal: true,

            rainTitle: undefined,
            showRainModal: false,
        });
        return true;
    }

    handleEarthquakeClick = (feature, lngLat) => {
        const {
            properties: {
                address,
                description,
                eventOn,
                magnitude,
            },
        } = feature;

        this.setState({
            tooltipRenderer: this.earthquakeTooltipRenderer,
            tooltipParams: {
                address,
                description,
                eventOn,
                magnitude,
            },
            coordinates: lngLat,
        });

        return true;
    }

    handleFireClick = (feature, lngLat) => {
        const {
            properties: {
                brightness,
                confidence,
                eventOn,
                landCover,
            },
        } = feature;

        this.setState({
            tooltipRenderer: this.fireTooltipRenderer,
            tooltipParams: {
                brightness,
                confidence,
                eventOn,
                landCover,
            },
            coordinates: lngLat,
        });

        return true;
    }

    handlePollutionClick = (feature, lngLat) => {
        const {
            properties: {
                modifiedOn,
                title,
                aqi,
                aqiColor,
                observation,
                tags,
                description,
            },
        } = feature;

        this.setState({
            tooltipRenderer: this.pollutionTooltipRenderer,
            tooltipParams: {
                modifiedOn,
                title,
                aqi,
                aqiColor,
                observation: JSON.parse(observation),
                tags: JSON.parse(tags),
                description,
            },
            coordinates: lngLat,
        });

        return true;
    }

    handleTooltipClose = () => {
        this.setState({
            tooltipRenderer: null,
            coordinates: undefined,
            tooltipParams: null,
        });
    }

    handleModalClose = () => {
        this.setState({
            riverTitle: undefined,
            showRiverModal: false,

            rainTitle: undefined,
            showRainModal: false,
        });
    }

    earthquakeTooltipRenderer = ({ address, description, eventOn, magnitude }) => (
        <div>
            <h3>
                {address}
            </h3>
            <TextOutput
                label="Description"
                value={description}
            />
            <TextOutput
                label="Event On"
                value={(
                    <FormattedDate
                        value={eventOn}
                        mode="yyyy-MM-dd hh:mm"
                    />
                )}
            />
            <TextOutput
                label="Magnitude"
                value={magnitude}
                isNumericValue
                precision={1}
            />
        </div>
    )

    fireTooltipRenderer = ({ brightness, confidence, eventOn, landCover }) => (
        <div>
            <TextOutput
                label="Brightness"
                value={brightness}
                isNumericValue
                precision={2}
            />
            <TextOutput
                label="Confidence"
                value={confidence}
                isNumericValue
                precision={2}
            />
            <TextOutput
                label="Event On"
                value={(
                    <FormattedDate
                        value={eventOn}
                        mode="yyyy-MM-dd hh:mm"
                    />
                )}
            />
            <TextOutput
                label="Land Cover"
                value={landCover}
            />
        </div>
    )

    pollutionTooltipRenderer = (props) => {
        const {
            modifiedOn,
            title,
            aqi,
            aqiColor,
            observation,
            tags,
            description,
        } = props;

        return (
            <div>
                <h3>
                    {title}
                </h3>
                <div className={styles.aqi}>
                    <div>Air Quality Index </div>
                    <div style={{ backgroundColor: `${aqiColor}` }}>{aqi}</div>
                </div>
                <TextOutput
                    label="Description"
                    value={description}
                />
                <TextOutput
                    label="Measured On"
                    value={(
                        <FormattedDate
                            value={modifiedOn}
                            mode="yyyy-MM-dd hh:mm"
                        />
                    )}
                />
            </div>
        );
    }

    render() {
        const {
            realTimeRainList,
            realTimeRiverList,
            realTimeEarthquakeList,
            realTimeFireList,
            realTimePollutionList,
            selectedRealTime,
            showRain,
            showRiver,
            showEarthquake,
            showFire,
            showPollution,
            showStreamFlow,
            rightPaneExpanded,
            leftPaneExpanded,
        } = this.props;

        const rainFeatureCollection = this.getRainFeatureCollection(realTimeRainList);
        const riverFeatureCollection = this.getRiverFeatureCollection(realTimeRiverList);
        const earthquakeFeatureCollection = this.getEarthquakeFeatureCollection(
            realTimeEarthquakeList,
        );

        const fireFeatureCollection = this.getFireFeatureCollection(realTimeFireList);

        const pollutionFeatureCollection = this.getPollutionFeatureCollection(
            realTimePollutionList,
        );

        // TODO this is hard coded for now.get stream flow layer from api later
        const streamFlowLayer = { layername: 'Streamflow' };
        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);

        const {
            tooltipRenderer,
            tooltipParams,
            coordinates,
            showRiverModal,
            showRainModal,
            riverTitle,
            rainTitle,
        } = this.state;

        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 8,
        };

        return (
            <React.Fragment>
                <CommonMap
                    sourceKey="realtime"
                    boundsPadding={boundsPadding}
                />
                { showStreamFlow && (
                    <MapSource
                        sourceKey="real-time-streamflow"
                        sourceOptions={{
                            type: 'raster',
                            tiles: [getRasterTile(streamFlowLayer)],
                            tileSize: 256,
                        }}
                    >
                        <MapLayer
                            layerKey="raster-layer"
                            layerOptions={{
                                type: 'raster',
                                paint: {
                                    'raster-opacity': 0.5,
                                },
                            }}
                        />
                    </MapSource>
                )}
                { coordinates && (
                    <MapTooltip
                        coordinates={coordinates}
                        tooltipOptions={tooltipOptions}
                        onHide={this.handleTooltipClose}
                    >
                        <RealTimeTooltip
                            renderer={tooltipRenderer}
                            params={tooltipParams}
                        />
                    </MapTooltip>
                )}
                <MapSource
                    sourceKey="real-time-rain-points"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={rainFeatureCollection}
                    supportHover
                >
                    { showRain && (
                        <MapLayer
                            layerKey="real-time-rain-symbol"
                            onClick={this.handleRainClick}
                            layerOptions={{
                                type: 'symbol',
                                layout: mapStyles.rainPoint.layout,
                                paint: mapStyles.rainPoint.paint,
                                enableHover: true,
                            }}
                        />
                    )}
                </MapSource>
                <MapSource
                    sourceKey="real-time-river-points"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={riverFeatureCollection}
                    supportHover
                >
                    { showRiver && (
                        <MapLayer
                            layerKey="real-time-river-symbol"
                            onClick={this.handleRiverClick}
                            layerOptions={{
                                type: 'symbol',
                                layout: mapStyles.riverPoint.layout,
                                paint: mapStyles.riverPoint.paint,
                                enableHover: true,
                            }}
                        />
                    )}
                </MapSource>
                <MapSource
                    sourceKey="real-time-eartquake-points"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={earthquakeFeatureCollection}
                    supportHover
                >
                    { showEarthquake && (
                        <React.Fragment>
                            <MapLayer
                                layerKey="real-time-earthquake-points-fill"
                                onClick={this.handleEarthquakeClick}
                                layerOptions={{
                                    type: 'circle',
                                    property: 'earthquakeId',
                                    paint: mapStyles.earthquakePoint.fill,
                                    enableHover: true,
                                }}
                            />
                            <MapLayer
                                layerKey="real-time-earthquake-text"
                                layerOptions={{
                                    type: 'symbol',
                                    property: 'earthquakeId',
                                    layout: mapStyles.earthquakeText.layout,
                                    paint: mapStyles.earthquakeText.paint,
                                }}
                            />
                        </React.Fragment>
                    )}
                </MapSource>
                <MapSource
                    sourceKey="real-time-fire-points"
                    geoJson={fireFeatureCollection}
                    sourceOptions={{ type: 'geojson' }}
                    supportHover
                >
                    { showFire && (
                        <MapLayer
                            layerKey="real-time-fire-points-fill"
                            onClick={this.handleFireClick}
                            layerOptions={{
                                type: 'symbol',
                                property: 'fireId',
                                layout: mapStyles.firePoint.layout,
                                paint: mapStyles.firePoint.paint,
                                enableHover: true,
                            }}
                        />
                    )}
                </MapSource>
                <MapSource
                    sourceKey="real-time-pollution-points"
                    geoJson={pollutionFeatureCollection}
                    sourceOptions={{ type: 'geojson' }}
                    supportHover
                >
                    { showPollution && (
                        <React.Fragment>
                            <MapLayer
                                layerKey="real-time-pollution-points-fill"
                                onClick={this.handlePollutionClick}
                                layerOptions={{
                                    type: 'circle',
                                    property: 'pollutionId',
                                    paint: mapStyles.pollutionPoint.fill,
                                    enableHover: true,
                                }}
                            />
                            <MapLayer
                                layerKey="real-time-pollution-text"
                                layerOptions={{
                                    type: 'symbol',
                                    property: 'pollutionId',
                                    layout: mapStyles.pollutionText.layout,
                                    paint: mapStyles.pollutionText.paint,
                                }}
                            />
                        </React.Fragment>
                    )}
                </MapSource>
                {showRiverModal && (
                    <RiverDetails
                        title={riverTitle}
                        handleModalClose={this.handleModalClose}
                    />
                )}
                {showRainModal && (
                    <RainDetails
                        title={rainTitle}
                        handleModalClose={this.handleModalClose}
                    />
                )}
            </React.Fragment>
        );
    }
}
