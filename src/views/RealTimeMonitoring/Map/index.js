import React from 'react';
import memoize from 'memoize-one';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';
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

import RiverDetails from './RiverDetails';
import RainDetails from './RainDetails';
import styles from './styles.scss';


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

    handleRainClick = (id, { title }) => {
        this.setState({
            rainTitle: title,
            showRainModal: true,
            showRiverModal: false,
        });
    }

    handleRiverClick = (id, { title }) => {
        this.setState({
            riverTitle: title,
            showRainModal: false,
            showRiverModal: true,
        });
    }

    handleModalClose = () => {
        this.setState({
            rainTitle: undefined,
            riverTitle: undefined,
            showRiverModal: false,
            showRainModal: false,
        });
    }

    earthquakeTooltipRendererParams = (id, { address, description, eventOn, magnitude }) => ({
        address,
        description,
        eventOn,
        magnitude,
    })


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

    fireTooltipRendererParams = (id, { brightness, confidence, eventOn, landCover }) => ({
        brightness,
        confidence,
        eventOn,
        landCover,
    })

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

    pollutionTooltipRendererParams = (id, { location, measuredOn, measurements, city }) => ({
        id,
        location,
        measuredOn,
        city,
    })

    pollutionTooltipRenderer = ({ id, location, measuredOn, city }) => {
        const { realTimePollutionList } = this.props;
        const { measurements } = realTimePollutionList.find(m => m.id === id);

        const measurement = measurements.flat().map(m => (
            <TextOutput
                label={`${m.parameter} measurement (${m.unit})`}
                value={m.value}
                precision={3}
                isNumericValue
            />
        ));

        return (
            <div>
                <TextOutput
                    label="city"
                    value={city}
                />
                <TextOutput
                    label="location"
                    value={location}
                />
                <TextOutput
                    label="Measured On"
                    value={(
                        <FormattedDate
                            value={measuredOn}
                            mode="yyyy-MM-dd hh:mm"
                        />
                    )}
                />
                { measurement }
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

        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);

        const {
            showRiverModal,
            showRainModal,
            riverTitle,
            rainTitle,
        } = this.state;

        return (
            <React.Fragment>
                <CommonMap
                    boundsPadding={boundsPadding}
                />
                <MapSource
                    sourceKey="real-time-rain-points"
                    geoJson={rainFeatureCollection}
                    supportHover
                >
                    { showRain && (
                        <MapLayer
                            layerKey="real-time-rain-symbol"
                            type="symbol"
                            layout={mapStyles.rainPoint.layout}
                            paint={mapStyles.rainPoint.paint}
                            enableHover
                            onClick={this.handleRainClick}
                        />
                    )}
                </MapSource>
                <MapSource
                    sourceKey="real-time-river-points"
                    geoJson={riverFeatureCollection}
                    supportHover
                >
                    { showRiver && (
                        <MapLayer
                            layerKey="real-time-river-symbol"
                            type="symbol"
                            layout={mapStyles.riverPoint.layout}
                            paint={mapStyles.riverPoint.paint}
                            enableHover
                            onClick={this.handleRiverClick}
                        />
                    )}
                </MapSource>
                <MapSource
                    sourceKey="real-time-eartquake-points"
                    geoJson={earthquakeFeatureCollection}
                    supportHover
                >
                    { showEarthquake && (
                        <React.Fragment>
                            <MapLayer
                                layerKey="real-time-earthquake-points-fill"
                                type="circle"
                                property="earthquakeId"
                                paint={mapStyles.earthquakePoint.fill}
                                enableHover
                                tooltipRenderer={this.earthquakeTooltipRenderer}
                                tooltipRendererParams={this.earthquakeTooltipRendererParams}
                            />
                            <MapLayer
                                layerKey="real-time-earthquake-text"
                                type="symbol"
                                property="earthquakeId"
                                layout={mapStyles.earthquakeText.layout}
                                paint={mapStyles.earthquakeText.paint}
                            />
                        </React.Fragment>
                    )}
                </MapSource>
                <MapSource
                    sourceKey="real-time-fire-points"
                    geoJson={fireFeatureCollection}
                    supportHover
                >
                    { showFire && (
                        <MapLayer
                            layerKey="real-time-fire-points-fill"
                            type="symbol"
                            property="fireId"
                            layout={mapStyles.firePoint.layout}
                            paint={mapStyles.firePoint.paint}
                            enableHover
                            tooltipRenderer={this.fireTooltipRenderer}
                            tooltipRendererParams={this.fireTooltipRendererParams}
                        />
                    )}
                </MapSource>
                <MapSource
                    sourceKey="real-time-pollution-points"
                    geoJson={pollutionFeatureCollection}
                    supportHover
                >
                    { showPollution && (
                        <React.Fragment>
                            <MapLayer
                                layerKey="real-time-pollution-points-fill"
                                type="circle"
                                property="pollutionId"
                                paint={mapStyles.pollutionPoint.fill}
                                enableHover
                                tooltipRenderer={this.pollutionTooltipRenderer}
                                tooltipRendererParams={this.pollutionTooltipRendererParams}
                            />
                            <MapLayer
                                layerKey="real-time-pollution-text"
                                type="symbol"
                                property="pollutionId"
                                layout={mapStyles.pollutionText.layout}
                                paint={mapStyles.pollutionText.paint}
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
