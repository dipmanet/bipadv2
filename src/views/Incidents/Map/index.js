import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import CommonMap from '#components/CommonMap';
import {
    hazardTypesSelector,
    wardsMapSelector,
} from '#selectors';
import {
    mapStyles,
    getMapPaddings,
} from '#constants';
import IncidentInfo from '#components/IncidentInfo';

import { getYesterday } from '#utils/common';
import {
    incidentPointToGeojson,
    incidentPolygonToGeojson,
} from '#utils/domain';

const propTypes = {
};

const defaultProps = {
};

const mapStateToProps = state => ({
    hazards: hazardTypesSelector(state),
    wardsMap: wardsMapSelector(state),
});

// FIXME: move somewhere else
const framize = (fn, duration = 2000) => {
    let prevTimestamp;
    return (timestamp) => {
        if (!prevTimestamp) {
            prevTimestamp = timestamp;
        }
        const diff = timestamp - prevTimestamp;
        if (diff > duration) {
            prevTimestamp = timestamp;
        }
        const percent = (timestamp - prevTimestamp) / duration;
        return fn(percent, timestamp);
    };
};

class IncidentMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);
        this.prevTimestamp = undefined;
    }

    getBoundsPadding = memoize((leftPaneExpanded, rightPaneExpanded) => {
        const mapPaddings = getMapPaddings();

        if (leftPaneExpanded && rightPaneExpanded) {
            return mapPaddings.bothPaneExpanded;
        } else if (leftPaneExpanded) {
            return mapPaddings.leftPaneExpanded;
        } else if (rightPaneExpanded) {
            return mapPaddings.rightPaneExpanded;
        }
        return mapPaddings.noPaneExpanded;
    });

    getPointFeatureCollection = memoize(incidentPointToGeojson)

    getPolygonFeatureCollection = memoize(incidentPolygonToGeojson);

    getFilter = memoize(timestamp => (
        ['>', ['get', 'incidentOn'], timestamp]
    ))

    tooltipRendererParams = (id) => {
        const {
            wardsMap,
            incidentList,
        } = this.props;

        const incident = incidentList.find(i => i.id === id);

        return {
            incident,
            wardsMap,
        };
    }

    handleAnimationKeyframe = framize((percent) => {
        const p = percent ** 3;
        const radius = p * 20;
        const opacity = (1 - p);
        return {
            'circle-radius': radius,
            // 'circle-radius': ['+', mapStyles.incidentPoint.fill['circle-radius'], radius],
            'circle-opacity': opacity,
        };
    })

    render() {
        const {
            incidentList,
            hazards,
            leftPaneExpanded,
            rightPaneExpanded,
            recentDay,
        } = this.props;

        const pointFeatureCollection = this.getPointFeatureCollection(incidentList, hazards);
        const polygonFeatureCollection = this.getPolygonFeatureCollection(incidentList, hazards);

        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);

        const recentTimestamp = getYesterday(recentDay);
        const filter = this.getFilter(recentTimestamp);

        return (
            <React.Fragment>
                <CommonMap
                    boundsPadding={boundsPadding}
                />
                <MapSource
                    sourceKey="incident-points"
                    geoJson={pointFeatureCollection}
                >
                    <MapLayer
                        layerKey="incident-points-animate"
                        type="circle"
                        filter={filter}
                        paint={mapStyles.incidentPoint.animatedFill}
                        onAnimationKeyframe={this.handleAnimationKeyframe}
                    />
                    <MapLayer
                        layerKey="incident-points-fill"
                        type="circle"
                        paint={mapStyles.incidentPoint.fill}
                        enableHover
                        tooltipRenderer={IncidentInfo}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                </MapSource>
                <MapSource
                    sourceKey="incident-polygons"
                    geoJson={polygonFeatureCollection}
                >
                    <MapLayer
                        layerKey="incident-polygon-fill"
                        type="fill"
                        paint={mapStyles.incidentPolygon.fill}
                        enableHover
                        tooltipRenderer={IncidentInfo}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(IncidentMap);
