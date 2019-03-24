import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import bbox from '@turf/bbox';

import MapLayer from '#rscz/Map/MapLayer';
import MapDraw from '#rscz/Map/MapDraw';
import MapSource from '#rscz/Map/MapSource';

import { mapSources } from '#constants';

import {
    boundsFill,
    boundsOutline,
    pointPaint,
    activeBoundsFill,
} from './mapStyles';

const districtsPadding = {
    top: 0,
    right: 64,
    bottom: 0,
    left: 330,
};

const propTypes = {
    pause: PropTypes.bool,
};

const defaultProps = {
    pause: false,
};

export default class LossAndDamageMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            currentRange: {},
            // selectedDistrict: undefined,
            selectedDistricts: [],
        };
    }

    componentDidMount() {
        this.timeout = setTimeout(this.playback, 1000);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    getBounds = memoize(geoJson => bbox(geoJson))

    getActiveFilter = memoize(districts => ['in', 'title', ...districts])

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

    /*
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
    */

    handleDistrictClick = (id, item) => {
        const district = item.title;

        const { selectedDistricts } = this.state;
        const newSelectedDistricts = [...selectedDistricts];

        const districtIndex = selectedDistricts.findIndex(d => d === district);

        if (districtIndex === -1) {
            newSelectedDistricts.push(district);
        } else {
            newSelectedDistricts.splice(districtIndex, 1);
        }

        this.setState({
            // selectedDistrict: district,
            selectedDistricts: newSelectedDistricts,
        });

        const { onDistrictSelect } = this.props;
        if (onDistrictSelect) {
            onDistrictSelect(newSelectedDistricts);
        }
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
        } = this.props;

        const {
            currentRange,
            // selectedDistrict = 'none',
            selectedDistricts,
        } = this.state;

        const pointFeatureCollection = this.getPointFeatureCollection(lossAndDamageList);
        // const polygonFeatureCollection = this.getPolygonFeatureCollection(lossAndDamageList);

        let pointsFilter;
        if (currentRange.start) {
            pointsFilter = [
                'all',
                ['>=', 'incidentOn', currentRange.start],
                ['<=', 'incidentOn', currentRange.end],
            ];
        }

        const activeFilter = this.getActiveFilter(selectedDistricts);

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="district"
                    url={mapSources.nepal.url}
                    boundsPadding={districtsPadding}
                >
                    {/* FIXME: this selection method is obsolete */}
                    <MapLayer
                        layerKey="district-selected-fill"
                        type="fill"
                        paint={activeBoundsFill}
                        property="title"
                        filter={activeFilter}
                        sourceLayer={mapSources.nepal.layers.district}
                    />
                    <MapLayer
                        layerKey="district-fill"
                        type="fill"
                        paint={boundsFill}
                        enableHover
                        onClick={this.handleDistrictClick}
                        sourceLayer={mapSources.nepal.layers.district}
                    />
                    <MapLayer
                        layerKey="district-outline"
                        type="line"
                        paint={boundsOutline}
                        sourceLayer={mapSources.nepal.layers.district}
                    />
                </MapSource>
                <MapSource
                    sourceKey="points"
                    geoJson={pointFeatureCollection}
                >
                    <MapLayer
                        layerKey="points"
                        type="circle"
                        paint={pointPaint}
                        filter={pointsFilter}
                    />
                </MapSource>
                <MapDraw />
            </React.Fragment>
        );
    }
}
