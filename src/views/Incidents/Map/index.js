import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { Redirect } from 'react-router-dom';
import turf from 'turf';

import TextOutput from '#components/TextOutput';
import GeoOutput from '#components/GeoOutput';
import DateOutput from '#components/DateOutput';
import PeopleLoss from '#components/PeopleLoss';
import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import { reverseRoute } from '@togglecorp/fujs';
import { routes } from '#constants';

import nepalGeoJson from '#resources/districts.json';

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

const emptyList = [];
const emptyObject = {};

export default class IncidentMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            redirectTo: undefined,
        };

        this.hoverInfo = {
            paint: hoverPaint,
            showTooltip: true,
            tooltipModifier: this.renderTooltip,
        };
    }

    getFeatureCollection = memoize((incidentList) => {
        const geojson = {
            type: 'FeatureCollection',
            features: incidentList
                .filter(incident => incident.point)
                .map(incident => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: incident.point,
                    },
                    properties: {
                        incident,
                        severity: incident.severity,
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
            incidentList,
        } = this.props;

        const { redirectTo } = this.state;

        if (redirectTo) {
            return (
                <Redirect
                    to={redirectTo}
                    push
                />
            );
        }

        const featureCollection = this.getFeatureCollection(incidentList);

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="incident-bounds"
                    geoJson={nepalGeoJson}
                    bounds={turf.bbox(nepalGeoJson)}
                >
                    <MapLayer
                        layerKey="incident-bounds-fill"
                        type="fill"
                        paint={boundsFill}
                    />
                    <MapLayer
                        layerKey="incident-bounds-outline"
                        type="line"
                        paint={boundsOutline}
                    />
                </MapSource>
                <MapSource
                    sourceKey="incident-points"
                    geoJson={featureCollection}
                    supportHover
                >
                    <MapLayer
                        layerKey="incident-points"
                        type="circle"
                        property="incident"
                        paint={pointPaint}
                        onClick={this.handlePointClick}
                        hoverInfo={this.hoverInfo}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}
