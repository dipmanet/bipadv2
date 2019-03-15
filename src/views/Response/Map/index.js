import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import bbox from '@turf/bbox';
import buffer from '@turf/buffer';
import ReactDOMServer from 'react-dom/server';

import DistanceOutput from '#components/DistanceOutput';
/*
import TextOutput from '#components/TextOutput';
import GeoOutput from '#components/GeoOutput';
import DateOutput from '#components/DateOutput';
import PeopleLoss from '#components/PeopleLoss';
*/
import MapMarkerLayer from '#rscz/Map/MapMarkerLayer';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import store from '#store';

import nepalGeoJson from '#resources/districts.json';
import healthFacilityIcon from '#resources/icons/health-facility.svg';
import groupIcon from '#resources/icons/group.svg';
import financeIcon from '#resources/icons/University.svg';
import educationIcon from '#resources/icons/Education.svg';

import Tooltip from '#components/Tooltip';

import {
    boundsFill,
    boundsOutline,
    pointPaint,
    hoverPaint,
} from './mapStyles';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

const icons = {
    health: healthFacilityIcon,
    volunteer: groupIcon,
    education: educationIcon,
    finance: financeIcon,
};

const polygonBoundsFill = {
    'fill-color': 'red',
    'fill-opacity': 0.4,
};

// NOTE: store needs to be passed bacause somehow this goes out of context in MapLayer
const toolTipWrapper = props => <Tooltip store={store} {...props} />;

export default class ResponseMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.hoverInfo = {
            paint: hoverPaint,
            showTooltip: true,
            tooltipModifier: toolTipWrapper,
        };
    }

    getResourceFeatureCollection = memoize((resourceList) => {
        const geojson = {
            type: 'FeatureCollection',
            features: resourceList
                .filter(resource => resource.point)
                .map(resource => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: resource.point.coordinates,
                    },
                    properties: {
                        resource,
                        containerClassName: styles.markerContainer,
                        markerHTML: ReactDOMServer.renderToString(
                            <img
                                src={icons[resource.resourceType]}
                                alt={resource.title}
                                className={styles.icon}
                            />,
                        ),
                        popupHTML: ReactDOMServer.renderToString(
                            <div className={styles.resourceDetailPopup}>
                                <h3 className={styles.title}>
                                    { resource.title }
                                </h3>
                                <DistanceOutput
                                    value={resource.distance / 1000}
                                />
                            </div>,
                        ),
                    },
                })),
        };

        return geojson;
    });

    handlePointClick = (propertiesString) => {
        /*
        const properties = JSON.parse(propertiesString);
        const { id: incidentId } = properties;
        const redirectTo = reverseRoute(routes.response.path, { incidentId });
        navigate(redirectTo);
        */
    }

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

        let featureMapSource;
        let box;

        if (point) {
            // const point = turf.point(point.coordinates);
            const buffered = buffer(point, 32, { units: 'kilometers' });
            box = bbox(buffered);

            const featureCollection = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: {
                        ...point,
                    },
                    properties: {
                        incident,
                        severity,
                    },
                }],
            };

            featureMapSource = (
                <MapSource
                    sourceKey="points"
                    geoJson={featureCollection}
                    supportHover
                >
                    <MapLayer
                        layerKey="points"
                        type="circle"
                        property="incident"
                        paint={pointPaint}
                        onClick={this.handlePointClick}
                        hoverInfo={this.hoverInfo}
                    />
                </MapSource>
            );
        } else if (polygon) {
            const buffered = buffer(polygon, 24, 'kilometers');
            box = bbox(buffered);

            const featureCollection = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: {
                        ...polygon,
                    },
                    properties: {
                        incident,
                        severity,
                    },
                }],
            };

            featureMapSource = (
                <MapSource
                    sourceKey="polygon"
                    geoJson={featureCollection}
                    supportHover
                >
                    <MapLayer
                        layerKey="points"
                        type="fill"
                        property="incident"
                        paint={polygonBoundsFill}
                        onClick={this.handlePointClick}
                        // hoverInfo={this.hoverInfo}
                    />
                </MapSource>
            );
        }

        const resourceFeatures = this.getResourceFeatureCollection(resourceList);

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="bounds"
                    geoJson={nepalGeoJson}
                    bounds={box}
                >
                    <MapLayer
                        layerKey="bounds-fill"
                        type="fill"
                        paint={boundsFill}
                    />
                    <MapLayer
                        layerKey="bounds-outline"
                        type="line"
                        paint={boundsOutline}
                    />
                </MapSource>
                <MapMarkerLayer
                    geoJson={resourceFeatures}
                />
                {featureMapSource}
            </React.Fragment>
        );
    }
}
