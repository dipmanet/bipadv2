import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import bbox from '@turf/bbox';
import buffer from '@turf/buffer';
import { convex } from '@turf/turf';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import DistanceOutput from '#components/DistanceOutput';
import ZoomMap from '#components/ZoomMap';
import {
    mapStyles,
    getMapPaddings,
} from '#constants';
import { hazardTypesSelector } from '#selectors';

import {
    incidentPointToGeojson,
    incidentPolygonToGeojson,
    resourceToGeojson,
} from '#utils/domain';

import healthFacilityIcon from '#resources/icons/health-facility.svg';
import groupIcon from '#resources/icons/group.svg';
import financeIcon from '#resources/icons/University.svg';
import educationIcon from '#resources/icons/Education.svg';

import ResourceItem from '../resources/ResourceItem';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    incident: PropTypes.object,
    resourceList: PropTypes.arrayOf(PropTypes.object),
};

const defaultProps = {
    className: '',
    incident: {},
    resourceList: [],
};

const emptyObject = {};

const resourceImages = [
    { name: 'health', icon: healthFacilityIcon },
    { name: 'volunteer', icon: groupIcon },
    { name: 'education', icon: educationIcon },
    { name: 'finance', icon: financeIcon },
];

const mapStateToProps = state => ({
    hazards: hazardTypesSelector(state),
});

class ResponseMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getBoundsPadding = memoize((leftPaneExpanded, rightPaneExpanded) => {
        const mapPaddings = getMapPaddings();

        if (leftPaneExpanded && rightPaneExpanded) {
            mapPaddings.bothPaneExpanded.right += (360 - 256);
            return mapPaddings.bothPaneExpanded;
        } else if (leftPaneExpanded) {
            return mapPaddings.leftPaneExpanded;
        } else if (rightPaneExpanded) {
            mapPaddings.rightPaneExpanded.right += (360 - 256);
            return mapPaddings.rightPaneExpanded;
        }
        return mapPaddings.noPaneExpanded;
    });

    getBuffer = memoize((shape) => {
        const buffered = buffer(shape, 32, { units: 'kilometers' });
        const box = bbox(buffered);
        return box;
    });

    getIncidentList = memoize(incident => [incident]);

    getPointFeatureCollection = memoize(incidentPointToGeojson)

    getPolygonFeatureCollection = memoize(incidentPolygonToGeojson);

    getResourceFeatureCollection = memoize(resourceToGeojson);

    getConvex = memoize((incidentShape, resourceList) => {
        const v = {
            ...resourceList,
            features: [
                ...resourceList.features,
                {
                    // id: 99999999999,
                    type: 'Feature',
                    properties: {},
                    geometry: incidentShape,
                },
            ],
        };
        // NOTE: at least have 10km space around the incident point
        const bufferedV = buffer(v, 10, { units: 'kilometers' });
        return bbox(bufferedV);
    })

    tooltipRenderer = params => <ResourceItem {...params} showDetails />

    tooltipRendererParams = id =>
        this.props.resourceList.find(x => x.id === id) || emptyObject

    render() {
        const {
            incident,
            resourceList,
            hazards,
            leftPaneExpanded,
            rightPaneExpanded,
        } = this.props;

        const {
            point,
            polygon,
        } = incident;
        // const box = this.getBuffer(point || polygon);

        const incidentList = this.getIncidentList(incident);

        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);

        const resourceGeoJson = this.getResourceFeatureCollection(resourceList);

        const mybox = this.getConvex(point || polygon, resourceGeoJson);

        return (
            <React.Fragment>
                <ZoomMap
                    boundsPadding={boundsPadding}
                    bounds={mybox}
                />
                <MapSource
                    sourceKey="resource"
                    geoJson={resourceGeoJson}
                    images={resourceImages}
                >
                    <MapLayer
                        layerKey="resource-point"
                        type="circle"
                        paint={mapStyles.resourcePoint.circle}
                        enableHover
                        tooltipRenderer={this.tooltipRenderer}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                    <MapLayer
                        layerKey="resource-symbol"
                        type="symbol"
                        layout={mapStyles.resourceSymbol.layout}
                        paint={mapStyles.resourceSymbol.symbol}
                    />
                </MapSource>

                { point &&
                    <MapSource
                        sourceKey="points"
                        geoJson={this.getPointFeatureCollection(incidentList, hazards)}
                    >
                        <MapLayer
                            layerKey="points"
                            type="circle"
                            property="incident"
                            paint={mapStyles.incidentPoint.fill}
                        />
                    </MapSource>
                }
                { polygon &&
                    <MapSource
                        sourceKey="polygon"
                        geoJson={this.getPolygonFeatureCollection(incidentList, hazards)}
                    >
                        <MapLayer
                            layerKey="polygon"
                            type="fill"
                            property="incident"
                            paint={mapStyles.incidentPolygon.fill}
                        />
                    </MapSource>
                }
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(ResponseMap);
