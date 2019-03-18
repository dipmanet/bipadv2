import React from 'react';
import PropTypes from 'prop-types';
import bbox from '@turf/bbox';
import memoize from 'memoize-one';

import { createRequestClient } from '#request';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import nepalGeoJson from '#resources/districts.json';

import {
    boundsFill,
    boundsHoverFill,
    boundsOutline,
    pointPaint,
    activeBoundsFill,
} from './mapStyles';

const propTypes = {
    pause: PropTypes.bool,
};

const defaultProps = {
    pause: false,
};

class LossAndDamageMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            currentRange: {},
            selectedDistrict: undefined,
        };
    }

    componentDidMount() {
        this.timeout = setTimeout(this.playback, 1000);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    getTimeExtent = (lossAndDamageList) => {
        const timestamps = lossAndDamageList.filter(d => d.incidentOn)
            .map(d => (new Date(d.incidentOn)).getTime());

        return ({
            max: Math.max(...timestamps),
            min: Math.min(...timestamps),
        });
    }

    getPointFeatureCollection = memoize((lossAndDamageList) => {
        const geojson = {
            type: 'FeatureCollection',
            features: lossAndDamageList
                .filter(lossAndDamage => lossAndDamage.point)
                .map(lossAndDamage => ({
                    type: 'Feature',
                    geometry: {
                        ...lossAndDamage.point,
                    },
                    properties: {
                        lossAndDamage,
                        severity: lossAndDamage.severity,
                        incidentOn: (new Date(lossAndDamage.incidentOn)).getTime(),
                    },
                })),
        };

        return geojson;
    });

    getPolygonFeatureCollection = memoize((lossAndDamageList) => {
        const geojson = {
            type: 'FeatureCollection',
            features: lossAndDamageList
                .filter(lossAndDamage => lossAndDamage.polygon)
                .map(lossAndDamage => ({
                    type: 'Feature',
                    geometry: {
                        ...lossAndDamage.polygon,
                    },
                    properties: {
                        lossAndDamage,
                        severity: lossAndDamage.severity,
                    },
                })),
        };

        return geojson;
    });

    handleDistrictClick = (args) => {
        this.setState({ selectedDistrict: args });
    }

    playback = () => {
        const {
            lossAndDamageList,
            onPlaybackProgress,
            pause: isPaused,
        } = this.props;

        if (!isPaused && (Object.keys(lossAndDamageList)).length > 0) {
            const {
                currentRange: {
                    start,
                    end,
                },
            } = this.state;

            const aDay = 1000 * 60 * 60 * 24;
            const offset = aDay * 10;

            const timeExtent = this.getTimeExtent(lossAndDamageList);
            if (!start || end > timeExtent.max) {
                const currentRange = {
                    start: timeExtent.min,
                    end: timeExtent.min + offset,
                };

                this.setState({ currentRange });
                if (onPlaybackProgress) {
                    onPlaybackProgress(currentRange, timeExtent);
                }
            } else {
                const currentRange = {
                    start: end,
                    end: end + offset,
                };

                this.setState({ currentRange });
                if (onPlaybackProgress) {
                    onPlaybackProgress(currentRange, timeExtent);
                }
            }
        }

        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.playback, 1000);
    }

    render() {
        const {
            lossAndDamageList,
            requests: {
                districtsGeoJsonRequest: {
                    pending,
                    response: districtsGeoJson,
                },
            },
        } = this.props;

        if (!districtsGeoJson) {
            return null;
        }

        const {
            currentRange,
            selectedDistrict = 'none',
        } = this.state;

        const pointFeatureCollection = this.getPointFeatureCollection(lossAndDamageList);
        const polygonFeatureCollection = this.getPolygonFeatureCollection(lossAndDamageList);

        let pointsFilter;

        if (currentRange.start) {
            pointsFilter = ['all', ['>=', 'incidentOn', currentRange.start], ['<=', 'incidentOn', currentRange.end]];
        }

        const activeFilter = ['==', 'title', selectedDistrict];

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="loss-and-damage-bounds"
                    geoJson={districtsGeoJson}
                    bounds={bbox(districtsGeoJson)}
                    boundsPadding={{
                        top: 0,
                        right: 64,
                        bottom: 0,
                        left: 330,
                    }}
                >
                    <MapLayer
                        layerKey="loss-and-damage-bounds-fill"
                        type="fill"
                        paint={boundsFill}
                        hoverInfo={{
                            paint: boundsHoverFill,
                        }}
                        onClick={this.handleDistrictClick}
                        property="title"
                    />
                    <MapLayer
                        layerKey="loss-and-damage-active-bounds-fill"
                        type="fill"
                        paint={activeBoundsFill}
                        property="title"
                        filter={activeFilter}
                    />
                    <MapLayer
                        layerKey="loss-and-damage-bounds-outline"
                        type="line"
                        paint={boundsOutline}
                    />
                </MapSource>
                <MapSource
                    sourceKey="loss-and-damage-points"
                    geoJson={pointFeatureCollection}
                    supportHover
                >
                    <MapLayer
                        layerKey="incident-points-fill"
                        type="circle"
                        property="incident"
                        paint={pointPaint}
                        filter={pointsFilter}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

const requests = {
    districtsGeoJsonRequest: {
        url: '/district/?format=geojson',
        onMount: true,
    },
};

export default createRequestClient(requests)(LossAndDamageMap);
