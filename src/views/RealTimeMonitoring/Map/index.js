import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';
import MapState from '#re-map/MapSource/MapState';

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
} from '#utils/domain';

import { httpGet } from '#utils/common';

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

const GIS_URL = [
    `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/ows?`,
    'service=WFS',
    '&version=1.0.0',
    '&request=GetFeature',
    '&typeName=Bipad:watershed-area',
    '&outputFormat=application/json',
].join('');

export default class RealTimeMap extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            rainTitle: undefined,
            riverTitle: undefined,
            streamflowId: undefined,
            gis: undefined,
        };
    }

    componentDidMount() {
        let result = '';
        try {
            result = JSON.parse(httpGet(GIS_URL));
            this.setState({ gis: result });
        } catch (error) {
            this.setState({ gis: undefined });
        }
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
                dateTime,
                title,
                aqi,
                aqiColor,
                observation,
                tags,
                description,
            },
        } = feature;
        console.log(feature);
        this.setState({
            tooltipRenderer: this.pollutionTooltipRenderer,
            tooltipParams: {
                dateTime,
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

    pollutionTooltipRenderer = ({ dateTime, title, aqi, aqiColor, description }) => (
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
                        value={dateTime}
                        mode="yyyy-MM-dd hh:mm"
                    />
                )}
            />
        </div>
    )

    handleStreamflowClick = (feature) => {
        const { properties: { comid } } = feature;
        // console.warn('feature', feature);
        this.setState({
            streamflowId: comid,
        });
    }

    handleHazardEnter = (feature) => {
        const { id } = feature;
        const { onHazardHover } = this.props;
        onHazardHover(id);
    }

    handleHazardLeave = () => {
        const { onHazardHover } = this.props;
        onHazardHover();
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
            onHazardHover,
            hazardHoveredAttribute,
            isHovered,
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

        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);

        const {
            tooltipRenderer,
            tooltipParams,
            coordinates,
            riverTitle,
            rainTitle,
            streamflowId,
            gis,
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
                {/*
                <SVGMapIcon
                    src={RainIcon}
                    name="rain"
                    fillColor="#222222"
                />
                <SVGMapIcon
                    src={RiverIcon}
                    name="river"
                    fillColor="#222222"
                />
                <SVGMapIcon
                    src={EarthquakeIcon}
                    name="earthquake"
                    fillColor="#222222"
                />
                <SVGMapIcon
                    src={PollutionIcon}
                    name="pollution"
                    fillColor="#222222"
                />
                <SVGMapIcon
                    fillColor="#222222"
                    src={FireIcon}
                    name="forest-fire"
                />
                */}
                { showStreamflow && (
                    <MapSource
                        sourceKey="streamflow-source"
                        sourceOptions={{
                            type: 'geojson',
                        }}
                        geoJson={`${process.env.REACT_APP_STREAMFLOW_URL}`}
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
                                    'line-width': [
                                        'case',
                                        ['==', ['feature-state', 'hovered'], true],
                                        7,
                                        5,
                                    ],
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
                {gis && (showRain || showRiver) && (
                    <MapSource
                        sourceKey="gis-layer"
                        sourceOptions={{ type: 'geojson' }}
                        geoJson={gis}
                        supportHover
                    >
                        <MapLayer
                            layerKey="gis-outline"
                            layerOptions={{
                                type: 'line',
                                paint: {
                                    'line-color': '#004d40',
                                    'line-width': 1,
                                },
                            }}
                        />
                    </MapSource>
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
                                    // paint: mapStyles.rainPoint.paint,
                                    paint: isHovered
                                        ? mapStyles.rainPoint.circleDim
                                        : mapStyles.rainPoint.circle,
                                }}
                                onMouseEnter={this.handleHazardEnter}
                                onMouseLeave={this.handleHazardLeave}
                            />
                            {/* the layer below is to render traingles for rain */}
                            {/* <MapLayer
                                layerKey="real-time-rain-triangle"
                                onClick={this.handleRainClick}
                                layerOptions={{
                                    type: 'symbol',
                                    layout: mapStyles.rainSymbol.layout,
                                    paint: mapStyles.rainSymbol.paint,
                                }}
                            /> */}
                            <MapLayer
                                layerKey="real-time-rain-symbol"
                                layerOptions={{
                                    type: 'symbol',
                                    layout: {
                                        'icon-image': 'rain',
                                        'icon-size': 0.2,
                                    },
                                }}
                            />
                        </>
                    )}
                    <MapState
                        attributes={hazardHoveredAttribute}
                        attributeKey="hover"
                    />
                </MapSource>
                <MapSource
                    sourceKey="real-time-river-points"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={riverFeatureCollection}
                    supportHover
                >
                    { showRiver && (
                        <>
                            {/* <MapLayer
                                layerKey="real-time-river-circle"
                                onClick={this.handleRiverClick}
                                layerOptions={{
                                    type: 'circle',
                                    paint: mapStyles.riverPoint.paint,
                                }}
                            /> */}
                            <MapLayer
                                layerKey="real-time-river-custom"
                                onClick={this.handleRiverClick}
                                layerOptions={{
                                    type: 'symbol',
                                    layout: mapStyles.riverPoint.layout,
                                    // paint: mapStyles.riverPoint.paint,
                                    paint: isHovered
                                        ? mapStyles.riverPoint.textDim
                                        : mapStyles.riverPoint.text,
                                }}
                                onMouseEnter={this.handleHazardEnter}
                                onMouseLeave={this.handleHazardLeave}
                            />
                            <MapLayer
                                layerKey="real-time-river-symbol"
                                layerOptions={{
                                    type: 'symbol',
                                    layout: {
                                        'icon-image': 'river',
                                        'icon-size': 0.2,
                                    },
                                }}
                            />
                        </>
                    )}
                    <MapState
                        attributes={hazardHoveredAttribute}
                        attributeKey="hover"
                    />
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
                                    // paint: mapStyles.earthquakePoint.fill,
                                    paint: isHovered
                                        ? mapStyles.earthquakePoint.circleDim
                                        : mapStyles.earthquakePoint.circle,
                                }}
                                onMouseEnter={this.handleHazardEnter}
                                onMouseLeave={this.handleHazardLeave}
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
                                }}
                            />
                        </React.Fragment>
                    )}
                    <MapState
                        attributes={hazardHoveredAttribute}
                        attributeKey="hover"
                    />
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
                                    // paint: mapStyles.firePoint.paint,
                                    paint: isHovered
                                        ? mapStyles.firePoint.circleDim
                                        : mapStyles.firePoint.circle,
                                }}
                                onMouseEnter={this.handleHazardEnter}
                                onMouseLeave={this.handleHazardLeave}
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
                    <MapState
                        attributes={hazardHoveredAttribute}
                        attributeKey="hover"
                    />
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
                                    // paint: mapStyles.pollutionPoint.fill,
                                    paint: isHovered
                                        ? mapStyles.pollutionPoint.circleDim
                                        : mapStyles.pollutionPoint.circle,
                                }}
                                onMouseEnter={this.handleHazardEnter}
                                onMouseLeave={this.handleHazardLeave}
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
                    <MapState
                        attributes={hazardHoveredAttribute}
                        attributeKey="hover"
                    />
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
