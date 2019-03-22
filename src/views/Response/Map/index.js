import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import bbox from '@turf/bbox';
import buffer from '@turf/buffer';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import DistanceOutput from '#components/DistanceOutput';

import healthFacilityIcon from '#resources/icons/health-facility.svg';
import groupIcon from '#resources/icons/group.svg';
import financeIcon from '#resources/icons/University.svg';
import educationIcon from '#resources/icons/Education.svg';
import { mapSources } from '#constants';

import {
    districtsFill,
    districtsOutline,
    pointPaint,
    polygonFill,
    resourceIconLayout,
    resourcePointPaint,
} from './mapStyles';
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

export default class ResponseMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getResourceFeatureCollection = memoize((resourceList) => {
        const geojson = {
            type: 'FeatureCollection',
            features: resourceList
                .filter(resource => resource.point)
                .map((resource, i) => ({
                    id: i,
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: resource.point.coordinates,
                    },
                    properties: {
                        iconName: resource.resourceType,
                        title: resource.title,
                        distance: resource.distance,
                    },
                })),
        };

        return geojson;
    });

    getFeatureCollection = memoize((shape, incident, severity) => ({
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                ...shape,
            },
            properties: {
                incident,
                severity,
            },
        }],
    }))

    getBuffer = memoize((shape) => {
        const buffered = buffer(shape, 32, { units: 'kilometers' });
        const box = bbox(buffered);
        return box;
    });

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
        } = this.props;

        const {
            point,
            polygon,
            severity,
        } = incident;

        const box = this.getBuffer(point || polygon);

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="districts"
                    url={mapSources.district.url}
                    bounds={box}
                >
                    <MapLayer
                        layerKey="districts-fill"
                        type="fill"
                        sourceLayer={mapSources.district.sourceLayer}
                        paint={districtsFill}
                    />
                    <MapLayer
                        layerKey="districts-outline"
                        type="line"
                        sourceLayer={mapSources.district.sourceLayer}
                        paint={districtsOutline}
                    />
                </MapSource>

                <MapSource
                    sourceKey="resource"
                    geoJson={this.getResourceFeatureCollection(resourceList)}
                    images={resourceImages}
                >
                    <MapLayer
                        layerKey="resource-point"
                        type="circle"
                        paint={resourcePointPaint}
                        enableHover
                        tooltipRenderer={this.tooltipRenderer}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                    <MapLayer
                        layerKey="resource-symbol"
                        type="symbol"
                        layout={resourceIconLayout}
                    />
                </MapSource>

                { point &&
                    <MapSource
                        sourceKey="points"
                        geoJson={this.getFeatureCollection(point, incident, severity)}
                    >
                        <MapLayer
                            layerKey="points"
                            type="circle"
                            property="incident"
                            paint={pointPaint}
                        />
                    </MapSource>
                }
                { polygon &&
                    <MapSource
                        sourceKey="polygon"
                        geoJson={this.getFeatureCollection(polygon, incident, severity)}
                    >
                        <MapLayer
                            layerKey="polygon"
                            type="fill"
                            property="incident"
                            paint={polygonFill}
                        />
                    </MapSource>
                }
            </React.Fragment>
        );
    }
}
