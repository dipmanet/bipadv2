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

import { routes } from '#constants';

import nepalGeoJson from '#resources/districts.json';
import healthFacilityIcon from '#resources/icons/health-facility.svg';
import groupIcon from '#resources/icons/group.svg';

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
};

const emptyList = [];
const emptyObject = {};

export default class ResponseMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.hoverInfo = {
            paint: hoverPaint,
            showTooltip: true,
            tooltipModifier: this.renderTooltip,
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
                        coordinates: resource.point,
                    },
                    properties: {
                        resource,
                        containerClassName: styles.markerContainer,
                        markerHTML: ReactDOMServer.renderToString(
                            <img
                                src={icons[resource.type]}
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
                                    value={resource.distance}
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
        const { pk: incidentId } = properties;
        const redirectTo = reverseRoute(routes.response.path, { incidentId });
        this.setState({ redirectTo });
    }

    renderTooltip = ({ incident: incidentString }) => {
        const incident = JSON.parse(incidentString);

        const {
            title,
            inducer,
            cause,
            incident_on: incidentOn,
            geoareaName,
            loss: {
                peoples = emptyList,
            } = emptyObject,
        } = incident;

        const inducerText = {
            artificial: 'Artificial',
            natural: 'Natural',
        };

        return (
            <div className={styles.tooltip}>
                <h2 className={styles.heading}>
                    {title}
                </h2>
                <GeoOutput
                    geoareaName={geoareaName}
                    className={styles.geoareaName}
                />
                <DateOutput
                    className={styles.incidentDate}
                    date={incidentOn}
                />
                <div className={styles.hr} />
                <TextOutput
                    className={styles.inducer}
                    label="Inducer"
                    value={inducerText[inducer]}
                />
                <TextOutput
                    className={styles.cause}
                    label="Cause"
                    value={cause}
                />
                <PeopleLoss
                    className={styles.peopleLoss}
                    label="People loss"
                    peopleList={peoples}
                />
            </div>
        );
    }

    render() {
        const {
            className,
            incident,
            resourceList,
        } = this.props;

        const point = turf.point(incident.point);
        const buffered = turf.buffer(point, 5, 'kilometers');
        const bbox = turf.bbox(buffered);

        const featureCollection = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: incident.point,
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
