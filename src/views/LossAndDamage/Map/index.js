import React from 'react';
import PropTypes from 'prop-types';
import turf from 'turf';
import memoize from 'memoize-one';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import nepalGeoJson from '#resources/districts.json';

import {
    boundsFill,
    boundsOutline,
    pointPaint,
    polygonBoundsFill,
    hoverPaint,
    polygonHoverPaint,
} from './mapStyles';

const propTypes = {
};

const defaultProps = {
};

export default class LossAndDamageMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            currentRange: {},
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

    playback = () => {
        const {
            lossAndDamageList,
        } = this.props;

        if ((Object.keys(lossAndDamageList)).length > 0) {
            const {
                currentRange: {
                    start,
                    end,
                },
            } = this.state;

            const aDay = 1000 * 60 * 60 * 24;

            const timeExtent = this.getTimeExtent(lossAndDamageList);
            if (!start || end > timeExtent.max) {
                this.setState({
                    currentRange: {
                        start: timeExtent.min,
                        end: timeExtent.min + (aDay * 30),
                    },
                });
            } else {
                this.setState({
                    currentRange: {
                        start: end,
                        end: end + (aDay * 30),
                    },
                });
            }
        }

        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.playback, 1000);
    }

    render() {
        const {
            lossAndDamageList,
        } = this.props;

        const {
            currentRange,
        } = this.state;

        const pointFeatureCollection = this.getPointFeatureCollection(lossAndDamageList);
        const polygonFeatureCollection = this.getPolygonFeatureCollection(lossAndDamageList);

        let filter;

        if (currentRange.start) {
            filter = ['all', ['>=', 'incidentOn', currentRange.start], ['<=', 'incidentOn', currentRange.end]];
        }

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="loss-and-damage-bounds"
                    geoJson={nepalGeoJson}
                    bounds={turf.bbox(nepalGeoJson)}
                >
                    <MapLayer
                        layerKey="loss-and-damage-bounds-fill"
                        type="fill"
                        paint={boundsFill}
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
                        filter={filter}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

