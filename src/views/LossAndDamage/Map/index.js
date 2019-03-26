import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';

import MapLayer from '#rscz/Map/MapLayer';
import MapDraw from '#rscz/Map/MapDraw';
import MapSource from '#rscz/Map/MapSource';

import CommonMap from '#components/CommonMap';

import {
    hazardTypesSelector,
    wardsMapSelector,
} from '#selectors';
import { mapSources, mapStyles } from '#constants';
import {
    incidentPointToGeojson,
    incidentPolygonToGeojson,
} from '#utils/domain';
import IncidentInfo from '#components/IncidentInfo';

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

const PLAYBACK_INTERVAL = 2000;


const mapStateToProps = state => ({
    hazards: hazardTypesSelector(state),
    wardsMap: wardsMapSelector(state),
});

class LossAndDamageMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            currentRange: {},
            selectedIds: [],
        };
    }

    componentDidMount() {
        this.timeout = setTimeout(this.playback, PLAYBACK_INTERVAL);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    getPointFeatureCollection = memoize(incidentPointToGeojson)

    getPolygonFeatureCollection = memoize(incidentPolygonToGeojson);

    getTimeExtent = (lossAndDamageList) => {
        const timestamps = lossAndDamageList.filter(d => d.incidentOn)
            .map(d => (new Date(d.incidentOn)).getTime());

        return ({
            max: Math.max(...timestamps),
            min: Math.min(...timestamps),
        });
    }

    handleSelectionChange = (ids) => {
        const { onDistrictSelect } = this.props;
        this.setState({ selectedIds: ids });
        if (onDistrictSelect) {
            onDistrictSelect(ids);
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
        this.timeout = setTimeout(this.playback, PLAYBACK_INTERVAL);
    }

    tooltipRendererParams = (id) => {
        const {
            wardsMap,
            lossAndDamageList,
        } = this.props;

        const incident = lossAndDamageList.find(i => i.id === id);

        return {
            incident,
            wardsMap,
            hideLink: true,
        };
    }

    render() {
        const {
            lossAndDamageList,
            hazards,
        } = this.props;
        const { currentRange } = this.state;

        let pointsFilter;
        if (currentRange.start) {
            pointsFilter = [
                'all',
                ['>=', 'incidentOn', currentRange.start],
                ['<', 'incidentOn', currentRange.end],
            ];
        }

        const pointFeatureCollection = this.getPointFeatureCollection(
            lossAndDamageList,
            hazards,
        );
        const polygonFeatureCollection = this.getPolygonFeatureCollection(
            lossAndDamageList,
            hazards,
        );

        return (
            <React.Fragment>
                <CommonMap />
                {/*
                <MapSource
                    sourceKey="district"
                    url={mapSources.nepal.url}
                    boundsPadding={districtsPadding}
                >
                    <MapLayer
                        layerKey="district-fill"
                        type="fill"
                        paint={mapStyles.district.fill}
                        sourceLayer={mapSources.nepal.layers.district}
                        enableHover
                        enableSelection
                        selectedIds={this.state.selectedIds}
                        onSelectionChange={this.handleSelectionChange}
                    />
                    <MapLayer
                        layerKey="district-outline"
                        type="line"
                        paint={mapStyles.district.outline}
                        sourceLayer={mapSources.nepal.layers.district}
                    />
                </MapSource>
                */}
                <MapSource
                    sourceKey="points"
                    geoJson={pointFeatureCollection}
                >
                    <MapLayer
                        layerKey="points"
                        type="circle"
                        paint={mapStyles.incidentPoint.fill}
                        filter={pointsFilter}
                        enableHover
                        tooltipRenderer={IncidentInfo}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                </MapSource>
                <MapSource
                    sourceKey="polygons"
                    geoJson={polygonFeatureCollection}
                >
                    <MapLayer
                        layerKey="polygons"
                        type="fill"
                        paint={mapStyles.incidentPolygon.fill}
                        enableHover
                        tooltipRenderer={IncidentInfo}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                </MapSource>
                <MapDraw />
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(LossAndDamageMap);
