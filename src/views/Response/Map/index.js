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
import { mapStyles } from '#constants';
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

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

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

    getBuffer = memoize((shape) => {
        const buffered = buffer(shape, 32, { units: 'kilometers' });
        const box = bbox(buffered);
        return box;
    });

    getIncidentList = memoize(incident => [incident]);

    getPointFeatureCollection = memoize(incidentPointToGeojson)

    getPolygonFeatureCollection = memoize(incidentPolygonToGeojson);

    getResourceFeatureCollection = memoize(resourceToGeojson);

    tooltipRenderer = ({ title, distance }) => (
        <div>
            <h3 className={styles.title}>
                { title }
            </h3>
            <DistanceOutput
                value={distance / 1000}
            />
        </div>
    )

    tooltipRendererParams = (id, { title, distance }) => ({
        title,
        distance,
    })

    render() {
        const {
            className,
            incident,
            resourceList,
            hazards,
        } = this.props;

        const {
            point,
            polygon,
        } = incident;

        const box = this.getBuffer(point || polygon);
        const incidentList = this.getIncidentList(incident);

        return (
            <React.Fragment>
                <ZoomMap
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
                        layout={mapStyles.resourcePoint.layout}
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
