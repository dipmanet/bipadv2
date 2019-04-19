import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import bbox from '@turf/bbox';
import buffer from '@turf/buffer';

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
            return mapPaddings.bothPaneExpanded;
        } else if (leftPaneExpanded) {
            return mapPaddings.leftPaneExpanded;
        } else if (rightPaneExpanded) {
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

        const box = this.getBuffer(point || polygon);
        const incidentList = this.getIncidentList(incident);

        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);

        return (
            <React.Fragment>
                <ZoomMap
                    boundsPadding={boundsPadding}
                    bounds={box}
                />
                <MapSource
                    sourceKey="resource"
                    geoJson={this.getResourceFeatureCollection(resourceList)}
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
