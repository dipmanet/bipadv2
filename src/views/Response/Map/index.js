import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import turf from 'turf';
import { reverseRoute } from '@togglecorp/fujs';
import ReactDOMServer from 'react-dom/server';

import DistanceOutput from '#components/DistanceOutput';
import TextOutput from '#components/TextOutput';
import GeoOutput from '#components/GeoOutput';
import DateOutput from '#components/DateOutput';
import PeopleLoss from '#components/PeopleLoss';
import MapMarkerLayer from '#components/MapMarkerLayer';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import store from '#store';
import { routes } from '#constants';

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
    hospital: healthFacilityIcon,
    volunteer: groupIcon,
    education: educationIcon,
    finance: financeIcon,
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
        const properties = JSON.parse(propertiesString);
        const { id: incidentId } = properties;
        const redirectTo = reverseRoute(routes.response.path, { incidentId });
        this.setState({ redirectTo });
    }

    render() {
        const {
            className,
            incident,
            resourceList,
        } = this.props;

        const point = turf.point(incident.point.coordinates);
        const buffered = turf.buffer(point, 32, 'kilometers');
        const bbox = turf.bbox(buffered);

        const featureCollection = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: incident.point.coordinates,
                },
                properties: {
                    incident,
                    severity: incident.severity,
                },
            }],
        };

        const resourceFeatures = this.getResourceFeatureCollection(resourceList);

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="bounds"
                    geoJson={nepalGeoJson}
                    bounds={bbox}
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
                <MapMarkerLayer
                    geoJson={resourceFeatures}
                />
            </React.Fragment>
        );
    }
}
