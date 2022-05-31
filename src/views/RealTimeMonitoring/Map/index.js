/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import { connect } from 'react-redux';
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
    getRasterTile,
    earthquakeToGeojson,
    riverToGeojson,
    rainToGeojson,
    fireToGeojson,
    pollutionToGeojson,
} from '#utils/domain';

import { httpGet } from '#utils/common';

import {
    realTimeDurationSelector, riverStationsSelector,
    riverFiltersSelector, rainStationsSelector,
} from '#selectors';
import RiverDetails from './RiverDetails';
import RainDetails from './RainDetails';
import StreamflowDetails from './StreamflowDetails';
import styles from './styles.scss';

const noop = () => { };

const RealTimeTooltip = ({ renderer: Renderer, params }) => (
    <Renderer {...params} />
);

RealTimeTooltip.propTypes = {
    renderer: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};
const tileUrl = [
    `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
    '&version=1.1.0',
    '&service=WMS',
    '&request=GetMap',
    '&layers=Bipad:watershed-area',
    '&tiled=true',
    '&width=256',
    '&height=256',
    '&srs=EPSG:3857',
    '&bbox={bbox-epsg-3857}',
    '&transparent=true',
    '&format=image/png',
].join('');

const GIS_URL = [
    `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/ows?`,
    'service=WFS',
    '&version=1.0.0',
    '&request=GetFeature',
    '&typeName=Bipad:watershed-area',
    '&outputFormat=application/json',
].join('');

const mapStateToProps = state => ({
    duration: realTimeDurationSelector(state),
    riverFilters: riverFiltersSelector(state),
    riverStations: riverStationsSelector(state),
    rainStation: rainStationsSelector(state),

});

const rainStationToGeojson = (rainStation) => {
    const geojson = {
        type: 'FeatureCollection',
        features: rainStation
            .filter(station => station.point)
            .map(station => ({
                id: station.id,
                type: 'Feature',
                geometry: {
                    ...station.point,
                },
                properties: {
                    ...station,
                    stationId: station.id,
                    title: station.title,
                    description: station.description,
                    basin: station.basin,
                    status: station.status,
                    measuredOn: station.measuredOn,
                    averages: station.averages,
                },
            })),
    };
    return geojson;
};

class RealTimeMap extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            rainTitle: undefined,
            riverTitle: undefined,
            streamflowId: undefined,
            gis: undefined,
            rainId: undefined,
            riverId: undefined,
            rasterLayers: [],
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


    componentDidUpdate(prevProps) {
        if (prevProps.riverFilters !== this.props.riverFilters) {
            // eslint-disable-next-line prefer-const
            let basinCoordinates = [];
            if (this.props.riverFilters.basin != null) {
                // eslint-disable-next-line max-len
                const mydata = this.props.rainStation.filter(item => item.basin === this.props.riverFilters.basin.title);

                if (mydata.length > 0) {
                    basinCoordinates = mydata[0].point.coordinates;
                    const tile = [
                        `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
                        '&service=WMS',
                        '&version=1.1.1',
                        '&request=GetMap',
                        '&layers=Bipad:watershed-area',
                        '&tiled=true',
                        '&width=256',
                        '&height=256',
                        '&srs=EPSG:3857',
                        '&bbox={bbox-epsg-3857}',
                        '&transparent=true',
                        '&format=image/png',
                        // eslint-disable-next-line max-len
                        `&CQL_FILTER=INTERSECTS(the_geom,%20POINT%20(${basinCoordinates[0]}%20${basinCoordinates[1]}))`,
                    ].join('');

                    const ourAarray = [{
                        key: `basin-${this.props.riverFilters.basin.title}`,
                        layername: `layer-basin-${this.props.riverFilters.basin.title}`,
                        tiles: tile,
                    }];
                    // eslint-disable-next-line max-len
                    if (!(this.props.riverFilters.basin && Object.keys(this.props.riverFilters.basin).length)) {
                        // eslint-disable-next-line react/no-did-update-set-state
                        this.setState({ rasterLayers: [] });
                    } else {
                        // eslint-disable-next-line react/no-did-update-set-state
                        this.setState({
                            rasterLayers: [
                                ourAarray[0]],
                        });
                    }
                }
            }
            // }
        }
    }


    getRainStationFeatureCollection = memoize(rainStationToGeojson);

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
        const { properties: { title, rainId } } = feature;
        this.setState({
            rainTitle: title,
            riverTitle: undefined,
            streamflowId: undefined,
            rainId,

        });
        return true;
    }

    handleRiverClick = (feature) => {
        const { properties: { title, riverId } } = feature;
        this.setState({
            riverTitle: title,
            streamflowId: undefined,
            rainTitle: undefined,
            riverId,
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
        this.setState({
            streamflowId: comid,
        });
    }

    handleHazardEnter = (feature) => {
        const { id, source } = feature;
        const { onHazardHover } = this.props;
        onHazardHover(id, source);
    }

    handleHazardLeave = () => {
        const { onHazardHover } = this.props;
        onHazardHover();
    }

    getRainPointCircle = (duration) => {
        if (duration === 1) {
            return {
                'circle-color': [
                    'case',
                    ['!=', ['typeof', ['get', 'one']], 'number'], '#BFBFBF',
                    ['==', ['get', 'one'], 0], '#BFBFBF',
                    ['<', ['get', 'one'], 0.5], '#798590',
                    ['<', ['get', 'one'], 10], '#569ED4',
                    ['<', ['get', 'one'], 20], '#5D9E52',
                    ['<', ['get', 'one'], 40], '#F8D054',
                    ['<', ['get', 'one'], 50], '#F3A53A',
                    ['>', ['get', 'one'], 50], '#BA2719',
                    '#ECECEC',
                ],
                'circle-radius': ['case',
                    ['!=', ['typeof', ['get', 'one']], 'number'], 10,
                    ['==', ['get', 'one'], 0], 10,
                    ['>', ['get', 'one'], 0], 16, 10,
                ],
                'circle-stroke-color': '#000000',
                'circle-stroke-width': ['case', ['all',
                    ['boolean', ['feature-state', 'hover'], false],
                    ['==', ['feature-state', 'dataSource'], 'real-time-rain-points'],
                ],
                    3,
                    1,
                ],
                'circle-opacity': 0.9,
            };
        }
        if (duration === 3) {
            return {
                'circle-color': [
                    'case',
                    ['!=', ['typeof', ['get', 'three']], 'number'], '#BFBFBF',
                    ['==', ['get', 'three'], 0], '#BFBFBF',
                    ['<', ['get', 'three'], 0.5], '#798590',
                    ['<', ['get', 'three'], 20], '#569ED4',
                    ['<', ['get', 'three'], 40], '#5D9E52',
                    ['<', ['get', 'three'], 60], '#F8D054',
                    ['<', ['get', 'three'], 80], '#F3A53A',
                    ['>', ['get', 'three'], 80], '#BA2719',
                    '#ECECEC',
                ],
                'circle-radius': ['case',
                    ['!=', ['typeof', ['get', 'three']], 'number'], 10,
                    ['==', ['get', 'three'], 0], 10,
                    ['>', ['get', 'three'], 0], 16, 10,
                ],
                'circle-stroke-color': '#000000',
                'circle-stroke-width': ['case', ['all',
                    ['boolean', ['feature-state', 'hover'], false],
                    ['==', ['feature-state', 'dataSource'], 'real-time-rain-points'],
                ],
                    3,
                    1,
                ],
                'circle-opacity': 0.9,
            };
        }
        if (duration === 6) {
            return {
                'circle-color': [
                    'case',
                    ['!=', ['typeof', ['get', 'six']], 'number'], '#BFBFBF',
                    ['==', ['get', 'six'], 0], '#BFBFBF',
                    ['<', ['get', 'six'], 0.5], '#798590',
                    ['<', ['get', 'six'], 40], '#569ED4',
                    ['<', ['get', 'six'], 60], '#5D9E52',
                    ['<', ['get', 'six'], 80], '#F8D054',
                    ['<', ['get', 'six'], 80], '#F3A53A',
                    ['>', ['get', 'six'], 100], '#BA2719',
                    '#ECECEC',
                ],
                'circle-radius': ['case',
                    ['!=', ['typeof', ['get', 'six']], 'number'], 10,
                    ['==', ['get', 'six'], 0], 10,
                    ['>', ['get', 'six'], 0], 16, 10,
                ],
                'circle-stroke-color': '#000000',
                'circle-stroke-width': ['case', ['all',
                    ['boolean', ['feature-state', 'hover'], false],
                    ['==', ['feature-state', 'dataSource'], 'real-time-rain-points'],
                ],
                    3,
                    1,
                ],
                'circle-opacity': 0.9,
            };
        }
        if (duration === 12) {
            return {
                'circle-color': [
                    'case',
                    ['!=', ['typeof', ['get', 'twelve']], 'number'], '#BFBFBF',
                    ['==', ['get', 'twelve'], 0], '#BFBFBF',
                    ['<', ['get', 'twelve'], 0.5], '#798590',
                    ['<', ['get', 'twelve'], 60], '#569ED4',
                    ['<', ['get', 'twelve'], 80], '#5D9E52',
                    ['<', ['get', 'twelve'], 100], '#F8D054',
                    ['<', ['get', 'twelve'], 100], '#F3A53A',
                    ['>', ['get', 'twelve'], 120], '#BA2719',
                    '#ECECEC',
                ],
                'circle-radius': ['case',
                    ['!=', ['typeof', ['get', 'twelve']], 'number'], 10,
                    ['==', ['get', 'twelve'], 0], 10,
                    ['>', ['get', 'twelve'], 0], 16, 10,
                ],
                'circle-stroke-color': '#000000',
                'circle-stroke-width': ['case', ['all',
                    ['boolean', ['feature-state', 'hover'], false],
                    ['==', ['feature-state', 'dataSource'], 'real-time-rain-points'],
                ],
                    3,
                    1,
                ],
                'circle-opacity': 0.9,
            };
        }

        return {
            'circle-color': [
                'case',
                ['!=', ['typeof', ['get', 'twentyfour']], 'number'], '#BFBFBF',
                ['==', ['get', 'twentyfour'], 0], '#BFBFBF',
                ['<', ['get', 'twentyfour'], 0.5], '#798590',
                ['<', ['get', 'twentyfour'], 80], '#569ED4',
                ['<', ['get', 'twentyfour'], 100], '#5D9E52',
                ['<', ['get', 'twentyfour'], 120], '#F8D054',
                ['<', ['get', 'twentyfour'], 140], '#F3A53A',
                ['>', ['get', 'twentyfour'], 140], '#BA2719',
                '#ECECEC',
            ],
            'circle-radius': ['case',
                ['!=', ['typeof', ['get', 'twentyfour']], 'number'], 10,
                ['==', ['get', 'twentyfour'], 0], 10,
                ['>', ['get', 'twentyfour'], 0], 16, 10,
            ],
            'circle-stroke-color': '#000000',
            'circle-stroke-width': ['case', ['all',
                ['boolean', ['feature-state', 'hover'], false],
                ['==', ['feature-state', 'dataSource'], 'real-time-rain-points'],
            ],
                3,
                1,
            ],
            'circle-opacity': 0.9,
        };
    }

    getRainPointCircleDim = (duration) => {
        if (duration === 1) {
            return {
                'circle-color': [
                    'case',
                    ['!=', ['typeof', ['get', 'one']], 'number'], '#BFBFBF',
                    ['==', ['get', 'one'], 0], '#BFBFBF',
                    ['<', ['get', 'one'], 0.5], '#798590',
                    ['<', ['get', 'one'], 10], '#569ED4',
                    ['<', ['get', 'one'], 20], '#5D9E52',
                    ['<', ['get', 'one'], 40], '#F8D054',
                    ['<', ['get', 'one'], 50], '#F3A53A',
                    ['>', ['get', 'one'], 50], '#BA2719',
                    '#ECECEC',
                ],
                'circle-radius': ['case',
                    ['!=', ['typeof', ['get', 'one']], 'number'], 10,
                    ['==', ['get', 'one'], 0], 10,
                    ['>', ['get', 'one'], 0], 16, 10,
                ],
                'circle-stroke-color': '#000000',
                'circle-stroke-width': ['case', ['all',
                    ['boolean', ['feature-state', 'hover'], false],
                    ['==', ['feature-state', 'dataSource'], 'real-time-rain-points'],
                ],
                    3,
                    0,
                ],
                'circle-opacity': ['case', ['all',
                    ['boolean', ['feature-state', 'hover'], false],
                    ['==', ['feature-state', 'dataSource'], 'real-time-rain-points'],
                ],
                    1,
                    0.3,
                ],
            };
        }
        if (duration === 3) {
            return {
                'circle-color': [
                    'case',
                    ['!=', ['typeof', ['get', 'three']], 'number'], '#BFBFBF',
                    ['==', ['get', 'three'], 0], '#BFBFBF',
                    ['<', ['get', 'three'], 0.5], '#798590',
                    ['<', ['get', 'three'], 20], '#569ED4',
                    ['<', ['get', 'three'], 40], '#5D9E52',
                    ['<', ['get', 'three'], 60], '#F8D054',
                    ['<', ['get', 'three'], 80], '#F3A53A',
                    ['>', ['get', 'three'], 80], '#BA2719',
                    '#ECECEC',
                ],
                'circle-radius': ['case',
                    ['!=', ['typeof', ['get', 'three']], 'number'], 10,
                    ['==', ['get', 'three'], 0], 10,
                    ['>', ['get', 'three'], 0], 16, 10,
                ],
                'circle-stroke-color': '#000000',
                'circle-stroke-width': ['case', ['all',
                    ['boolean', ['feature-state', 'hover'], false],
                    ['==', ['feature-state', 'dataSource'], 'real-time-rain-points'],
                ],
                    3,
                    0,
                ],
                'circle-opacity': ['case', ['all',
                    ['boolean', ['feature-state', 'hover'], false],
                    ['==', ['feature-state', 'dataSource'], 'real-time-rain-points'],
                ],
                    1,
                    0.3,
                ],
            };
        }
        if (duration === 6) {
            return {
                'circle-color': [
                    'case',
                    ['!=', ['typeof', ['get', 'six']], 'number'], '#BFBFBF',
                    ['==', ['get', 'six'], 0], '#BFBFBF',
                    ['<', ['get', 'six'], 0.5], '#798590',
                    ['<', ['get', 'six'], 40], '#569ED4',
                    ['<', ['get', 'six'], 60], '#5D9E52',
                    ['<', ['get', 'six'], 80], '#F8D054',
                    ['<', ['get', 'six'], 80], '#F3A53A',
                    ['>', ['get', 'six'], 100], '#BA2719',
                    '#ECECEC',
                ],
                'circle-radius': ['case',
                    ['!=', ['typeof', ['get', 'six']], 'number'], 10,
                    ['==', ['get', 'six'], 0], 10,
                    ['>', ['get', 'six'], 0], 16, 10,
                ],
                'circle-stroke-color': '#000000',
                'circle-stroke-width': ['case', ['all',
                    ['boolean', ['feature-state', 'hover'], false],
                    ['==', ['feature-state', 'dataSource'], 'real-time-rain-points'],
                ],
                    3,
                    0,
                ],
                'circle-opacity': ['case', ['all',
                    ['boolean', ['feature-state', 'hover'], false],
                    ['==', ['feature-state', 'dataSource'], 'real-time-rain-points'],
                ],
                    1,
                    0.3,
                ],
            };
        }
        if (duration === 12) {
            return {
                'circle-color': [
                    'case',
                    ['!=', ['typeof', ['get', 'twelve']], 'number'], '#BFBFBF',
                    ['==', ['get', 'twelve'], 0], '#BFBFBF',
                    ['<', ['get', 'twelve'], 0.5], '#798590',
                    ['<', ['get', 'twelve'], 60], '#569ED4',
                    ['<', ['get', 'twelve'], 80], '#5D9E52',
                    ['<', ['get', 'twelve'], 100], '#F8D054',
                    ['<', ['get', 'twelve'], 100], '#F3A53A',
                    ['>', ['get', 'twelve'], 120], '#BA2719',
                    '#ECECEC',
                ],
                'circle-radius': ['case',
                    ['!=', ['typeof', ['get', 'twelve']], 'number'], 10,
                    ['==', ['get', 'twelve'], 0], 10,
                    ['>', ['get', 'twelve'], 0], 16, 10,
                ],
                'circle-stroke-color': '#000000',
                'circle-stroke-width': ['case', ['all',
                    ['boolean', ['feature-state', 'hover'], false],
                    ['==', ['feature-state', 'dataSource'], 'real-time-rain-points'],
                ],
                    3,
                    0,
                ],
                'circle-opacity': ['case', ['all',
                    ['boolean', ['feature-state', 'hover'], false],
                    ['==', ['feature-state', 'dataSource'], 'real-time-rain-points'],
                ],
                    1,
                    0.3,
                ],
            };
        }

        return {
            'circle-color': [
                'case',
                ['!=', ['typeof', ['get', 'twentyfour']], 'number'], '#BFBFBF',
                ['==', ['get', 'twentyfour'], 0], '#BFBFBF',
                ['<', ['get', 'twentyfour'], 0.5], '#798590',
                ['<', ['get', 'twentyfour'], 80], '#569ED4',
                ['<', ['get', 'twentyfour'], 100], '#5D9E52',
                ['<', ['get', 'twentyfour'], 120], '#F8D054',
                ['<', ['get', 'twentyfour'], 140], '#F3A53A',
                ['>', ['get', 'twentyfour'], 140], '#BA2719',
                '#ECECEC',
            ],
            'circle-radius': ['case',
                ['!=', ['typeof', ['get', 'twentyfour']], 'number'], 10,
                ['==', ['get', 'twentyfour'], 0], 10,
                ['>', ['get', 'twentyfour'], 0], 16, 10,
            ],
            'circle-stroke-color': '#000000',
            'circle-stroke-width': ['case', ['all',
                ['boolean', ['feature-state', 'hover'], false],
                ['==', ['feature-state', 'dataSource'], 'real-time-rain-points'],
            ],
                3,
                0,
            ],
            'circle-opacity': ['case', ['all',
                ['boolean', ['feature-state', 'hover'], false],
                ['==', ['feature-state', 'dataSource'], 'real-time-rain-points'],
            ],
                1,
                0.3,
            ],
        };
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
            duration,
            riverFilters,
        } = this.props;

        const { rasterLayers } = this.state;

        /**
         * handling riverdata from filters
         */
        const filteredRealTimeRiverList = riverFilters.basin && riverFilters.basin.title
            && riverFilters.active && riverFilters.active === 'river'
            ? realTimeRiverList.filter(river => river.basin
                === riverFilters.basin.title) : realTimeRiverList;

        /**
         * handling raindata from filters
         */
        const filteredRealTimeRainList = riverFilters.basin && riverFilters.basin.title
            && riverFilters.active && riverFilters.active === 'rain'
            ? realTimeRainList.filter(rain => rain.basin
                === riverFilters.basin.title) : realTimeRainList;

        const rainFeatureCollection = this.getRainFeatureCollection(filteredRealTimeRainList);
        const riverFeatureCollection = this.getRiverFeatureCollection(filteredRealTimeRiverList);
        const earthquakeFeatureCollection = this.getEarthquakeFeatureCollection(
            realTimeEarthquakeList,
        );

        const rainStationFeatureCollection = this.getRainStationFeatureCollection(
            this.props.rainStation,
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
            rainId,
            gis,
            riverId,
        } = this.state;

        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 8,
        };
        const region = {
            adminLevel: riverFilters.municipality ? 3 : undefined,
            geoarea: riverFilters.municipality ? riverFilters.municipality : undefined,
        };

        return (
            <React.Fragment>
                <CommonMap
                    sourceKey="realtime"
                    boundsPadding={boundsPadding}
                    region={riverFilters.municipality ? region : undefined}
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
                {showStreamflow && (
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
                {coordinates && (
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
                                    'line-color': 'purple',
                                    'line-width': 1.5,
                                    'line-dasharray': [1, 2],
                                },
                            }}
                        />
                    </MapSource>

                )}

                {(rasterLayers.length === 0)
                    && (
                        <MapSource
                            key="basin-rain-key"
                            sourceKey="basin-rain-key"
                            sourceOptions={{
                                type: 'raster',
                                tiles: [tileUrl],
                                tileSize: 256,
                            }}
                        >

                            {/* <MapLayer
                                layerKey="raster-rain-layer"
                                layerOptions={{
                                    type: 'raster',
                                    paint: {
                                        'raster-opacity': 0.9,
                                    },
                                }}
                            /> */}
                        </MapSource>
                    )
                }
                {rasterLayers && rasterLayers.length > 0 && rasterLayers.map(layer => (
                    <MapSource
                        key={`key${layer.key}`}
                        sourceKey={`source${layer.key}`}
                        sourceOptions={{
                            type: 'raster',
                            tiles: [layer.tiles],
                            tileSize: 256,
                        }}
                    >

                        <MapLayer
                            layerKey={`${layer.layername}`}
                            layerOptions={{
                                type: 'raster',
                                paint: {
                                    'raster-opacity': 1,

                                },
                            }}
                        />
                    </MapSource>
                ))
                }
                <MapSource
                    sourceKey="real-time-rain-points"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={rainFeatureCollection}
                    supportHover
                    generateId
                >
                    {showRain && (
                        <>
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

                            <MapLayer
                                layerKey="real-time-rain-circle"
                                onClick={this.handleRainClick}
                                layerOptions={{
                                    type: 'circle',
                                    paint: isHovered
                                        ? this.getRainPointCircleDim(duration)
                                        : this.getRainPointCircle(duration),
                                }}
                                onMouseEnter={this.handleHazardEnter}
                                onMouseLeave={this.handleHazardLeave}
                            />
                            {
                                duration === 24
                                && (
                                    <MapLayer
                                        layerKey="real-time-rain-text"
                                        layerOptions={{
                                            type: 'symbol',
                                            layout: mapStyles.rain24Text.layout,
                                            paint: mapStyles.rain24Text.paint,
                                        }}
                                    />
                                )
                            }
                            {
                                duration === 12 && (
                                    <MapLayer
                                        layerKey="real-time-rain-twelve-text"
                                        layerOptions={{
                                            type: 'symbol',
                                            layout: mapStyles.rain12Text.layout,
                                            paint: mapStyles.rain12Text.paint,
                                        }}
                                    />
                                )
                            }
                            {
                                duration === 6
                                && (
                                    <MapLayer
                                        layerKey="real-time-rain-six-text"
                                        layerOptions={{
                                            type: 'symbol',
                                            layout: mapStyles.rain6Text.layout,
                                            paint: mapStyles.rain6Text.paint,
                                        }}
                                    />
                                )
                            }
                            {
                                duration === 3
                                && (
                                    <MapLayer
                                        layerKey="real-time-rain-three-text"
                                        layerOptions={{
                                            type: 'symbol',
                                            layout: mapStyles.rain3Text.layout,
                                            paint: mapStyles.rain3Text.paint,
                                        }}
                                    />
                                )
                            }
                            {
                                duration === 1
                                && (
                                    <MapLayer
                                        layerKey="real-time-rain-one-text"
                                        layerOptions={{
                                            type: 'symbol',
                                            layout: mapStyles.rain1Text.layout,
                                            paint: mapStyles.rain1Text.paint,
                                        }}
                                    />
                                )
                            }
                            {/* <MapLayer
                                layerKey="real-time-rain-circle"
                                onClick={this.handleRainClick}
                                layerOptions={{
                                    type: 'circle',
                                    paint: isHovered
                                        ? mapStyles.rainPoint.circleDim
                                        : mapStyles.rainPoint.circle,
                                }}
                                onMouseEnter={this.handleHazardEnter}
                                onMouseLeave={this.handleHazardLeave}
                            /> */}
                            {/* This layer below is to render traingles for rain */}
                            {/* <MapLayer
                                layerKey="real-time-rain-triangle"
                                onClick={this.handleRainClick}
                                layerOptions={{
                                    type: 'symbol',
                                    layout: mapStyles.rainSymbol.layout,
                                    paint: mapStyles.rainSymbol.paint,
                                }}
                            /> */}

                        </>
                    )}
                    {hazardHoveredAttribute
                        && (
                            <MapState
                                attributes={hazardHoveredAttribute}
                                attributeKey="hover"
                            />
                        )
                    }

                </MapSource>
                <MapSource
                    sourceKey="real-time-river-points"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={riverFeatureCollection}
                    supportHover
                    generateId
                >
                    {showRiver && (
                        <>
                            <MapLayer
                                layerKey="real-time-river-custom"
                                onClick={this.handleRiverClick}
                                layerOptions={{
                                    type: 'symbol',
                                    layout: mapStyles.riverPoint.layout,
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
                            <MapLayer
                                layerKey="real-time-river-text"
                                layerOptions={{
                                    type: 'symbol',
                                    layout: mapStyles.riverText.layout,
                                    paint: mapStyles.riverText.paint,
                                }}
                            />

                        </>
                    )}
                    {hazardHoveredAttribute
                        && (
                            <MapState
                                attributes={hazardHoveredAttribute}
                                attributeKey="hover"
                            />
                        )
                    }
                </MapSource>
                <MapSource
                    sourceKey="real-time-earthquake-points"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={earthquakeFeatureCollection}
                    supportHover
                    generateId
                >
                    {showEarthquake && (
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
                    {/* {
                        hovered == true &&
                    } */}
                    {hazardHoveredAttribute
                        && (
                            <MapState
                                attributes={hazardHoveredAttribute}
                                attributeKey="hover"
                            />
                        )
                    }
                </MapSource>
                <MapSource
                    sourceKey="real-time-fire-points"
                    geoJson={fireFeatureCollection}
                    sourceOptions={{ type: 'geojson' }}
                    supportHover
                    generateId
                >
                    {showFire && (
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
                    {hazardHoveredAttribute
                        && (
                            <MapState
                                attributes={hazardHoveredAttribute}
                                attributeKey="hover"
                            />
                        )
                    }
                </MapSource>
                <MapSource
                    sourceKey="real-time-pollution-points"
                    geoJson={pollutionFeatureCollection}
                    sourceOptions={{ type: 'geojson' }}
                    supportHover
                    generateId
                >
                    {showPollution && (
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
                    {hazardHoveredAttribute
                        && (
                            <MapState
                                attributes={hazardHoveredAttribute}
                                attributeKey="hover"
                            />
                        )
                    }
                </MapSource>
                {riverTitle && (
                    <RiverDetails
                        title={riverTitle}
                        id={riverId}
                        handleModalClose={this.handleModalClose}
                    />
                )}
                {rainTitle && (
                    <RainDetails
                        title={rainTitle}
                        id={rainId}
                        handleModalClose={this.handleModalClose}
                    />
                )}
                {streamflowId && (
                    <StreamflowDetails
                        id={streamflowId}
                        handleModalClose={this.handleModalClose}
                    />
                )}
            </React.Fragment>
        );
    }
}

export default
    connect(mapStateToProps)(RealTimeMap);
