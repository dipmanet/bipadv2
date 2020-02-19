import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';
import FormattedDate from '#rscv/FormattedDate';

import TextOutput from '#components/TextOutput';
import CommonMap from '#components/CommonMap';
import SVGMapIcon from '#components/SVGMapIcon';

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
} from '#utils/domain';

import RainIcon from '#resources/icons/Rain.svg';
import RiverIcon from '#resources/icons/Wave.svg';
import EarthquakeIcon from '#resources/icons/Earthquake.svg';
import PollutionIcon from '#resources/icons/AirQuality.svg';
import FireIcon from '#resources/icons/Forest-fire.svg';

import RiverDetails from './RiverDetails';
import RainDetails from './RainDetails';
import StreamflowDetails from './StreamflowDetails';
import styles from './styles.scss';

const noop = () => {};

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
            streamflowId: undefined,
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
            rainTitle: title,
            riverTitle: undefined,
            streamflowId: undefined,
        });
        return true;
    }

    handleRiverClick = (feature) => {
        const { properties: { title } } = feature;
        this.setState({
            riverTitle: title,
            streamflowId: undefined,
            rainTitle: undefined,
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
            rainTitle: undefined,
            riverTitle: undefined,
            streamflowId: undefined,
        });
    }

    earthquakeTooltipRenderer = ({ address, description, eventOn, magnitude }) => (
        <div className={styles.tooltip}>
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
        <div className={styles.tooltip}>
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

    pollutionTooltipRenderer = ({ modifiedOn, title, aqi, aqiColor, description }) => (
        <div className={styles.tooltip}>
            <h3>
                {title}
            </h3>
            <div className={styles.aqi}>
                <div>
                    Air Quality Index
                </div>
                <div style={{ backgroundColor: `${aqiColor}` }}>
                    {aqi}
                </div>
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
    )

    handleStreamflowClick = (feature) => {
        const { properties: { comid } } = feature;
        console.warn('feature', feature);
        this.setState({
            streamflowId: comid,
        });
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
            showStreamflow,
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
        const streamflowUrl = 'https://geoserver.naxa.com.np/geoserver/Bipad/wms?'
            + 'service=WMS&version=1.1.0&request=GetMap&layers=Bipad:Streamflow&'
            + 'bbox=80.05708333368067,25.566250000386177,88.19124999979978,30.357083333706303'
            + '&width=768&height=452&srs=EPSG:4326&format=application/json;type=geojson';

        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);

        const {
            tooltipRenderer,
            tooltipParams,
            coordinates,
            riverTitle,
            rainTitle,
            streamflowId,
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
                <SVGMapIcon
                    src={RainIcon}
                    name="rain"
                />
                <SVGMapIcon
                    src={RiverIcon}
                    name="river"
                />
                <SVGMapIcon
                    src={EarthquakeIcon}
                    name="earthquake"
                />
                <SVGMapIcon
                    src={PollutionIcon}
                    name="pollution"
                />
                <SVGMapIcon
                    fillColor="#ffffff"
                    src={FireIcon}
                    name="forest-fire"
                />
                { showStreamflow && (
                    <MapSource
                        sourceKey="streamflow-source"
                        sourceOptions={{
                            type: 'geojson',
                        }}
                        geoJson={streamflowUrl}
                    >
                        <MapLayer
                            layerKey="streamflow-layer"
                            onClick={this.handleStreamflowClick}
                            // NOTE: to set this layer as hoverable
                            onMouseEnter={noop}
                            layerOptions={{
                                type: 'line',
                                paint: {
                                    'line-color': '#7cb5ec',
                                    'line-width': 5,
                                    'line-opacity': [
                                        'case',
                                        ['==', ['feature-state', 'hovered'], true],
                                        1,
                                        0.5,
                                    ],
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
                        <>
                            <MapLayer
                                layerKey="real-time-rain-circle"
                                onClick={this.handleRainClick}
                                layerOptions={{
                                    type: 'circle',
                                    paint: mapStyles.rainPoint.paint,
                                    enableHover: true,
                                }}
                            />
                            <MapLayer
                                layerKey="real-time-rain-symbol"
                                layerOptions={{
                                    type: 'symbol',
                                    layout: {
                                        'icon-image': 'rain',
                                        'icon-size': 0.2,
                                    },
                                    enableHover: true,
                                }}
                            />
                        </>
                    )}
                </MapSource>
                <MapSource
                    sourceKey="real-time-river-points"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={riverFeatureCollection}
                    supportHover
                >
                    { showRiver && (
                        <>
                            <MapLayer
                                layerKey="real-time-river-circle"
                                onClick={this.handleRiverClick}
                                layerOptions={{
                                    type: 'circle',
                                    paint: mapStyles.riverPoint.paint,
                                    enableHover: true,
                                }}
                            />
                            <MapLayer
                                layerKey="real-time-river-symbol"
                                layerOptions={{
                                    type: 'symbol',
                                    layout: {
                                        'icon-image': 'river',
                                        'icon-size': 0.2,
                                    },
                                    enableHover: true,
                                }}
                            />
                        </>
                    )}
                </MapSource>
                <MapSource
                    sourceKey="real-time-earthquake-points"
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
                            <MapLayer
                                layerKey="real-time-earthquake-symbol"
                                layerOptions={{
                                    type: 'symbol',
                                    layout: {
                                        'icon-image': 'earthquake',
                                        'icon-size': 0.2,
                                    },
                                    enableHover: true,
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
                        <>
                            <MapLayer
                                layerKey="real-time-fire-points-cirle"
                                onClick={this.handleFireClick}
                                layerOptions={{
                                    type: 'circle',
                                    paint: mapStyles.firePoint.paint,
                                    enableHover: true,
                                }}
                            />
                            <MapLayer
                                layerKey="real-time-fire-points-symbol"
                                onClick={this.handleFireClick}
                                layerOptions={{
                                    type: 'symbol',
                                    layout: {
                                        'icon-image': 'forest-fire',
                                        'icon-size': 0.2,
                                    },
                                }}
                            />
                        </>
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
                            <MapLayer
                                layerKey="real-time-pollution-symbol"
                                layerOptions={{
                                    type: 'symbol',
                                    layout: {
                                        'icon-image': 'pollution',
                                        'icon-size': 0.2,
                                    },
                                }}
                            />
                        </React.Fragment>
                    )}
                </MapSource>
                {riverTitle && (
                    <RiverDetails
                        title={riverTitle}
                        handleModalClose={this.handleModalClose}
                    />
                )}
                {rainTitle && (
                    <RainDetails
                        title={rainTitle}
                        handleModalClose={this.handleModalClose}
                    />
                )}
                { streamflowId && (
                    <StreamflowDetails
                        id={streamflowId}
                        handleModalClose={this.handleModalClose}
                    />
                )}
            </React.Fragment>
        );
    }
}
