import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { Redirect } from 'react-router-dom';
import turf from 'turf';

import TextOutput from '#components/TextOutput';
import GeoOutput from '#components/GeoOutput';
import DateOutput from '#components/DateOutput';
import Loss from '#components/Loss';
import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import { reverseRoute, mapToList } from '@togglecorp/fujs';
import { routes } from '#constants';

import {
    wardsMapSelector,
} from '#redux';

import nepalGeoJson from '#resources/districts.json';

import { toTitleCase } from '#utils/common';

import {
    boundsFill,
    boundsOutline,
    pointPaint,
    hoverPaint,
} from './mapStyles';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    wardsMap: PropTypes.object,
};

const defaultProps = {
    className: '',
    wardsMap: {},
};

const emptyList = [];
const emptyObject = {};

const multiPolyToPoly = (multi) => {
    const { type, coordinates, ...other } = multi;
    const newCoords = type === 'MultiPolygon' ? coordinates[0] : coordinates;
    const newType = type === 'MultiPolygon' ? 'Polygon' : type;
    return {
        ...other,
        type: newType,
        coordinates: newCoords,
    };
};

class IncidentMap extends React.PureComponent {
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
                .filter(incident => incident.point || incident.polygon)
                .map(incident => ({
                    type: 'Feature',
                    geometry: multiPolyToPoly(incident.point || incident.polygon),
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
        const { id: incidentId } = properties;
        const redirectTo = reverseRoute(routes.response.path, { incidentId });
        this.setState({ redirectTo });
    }

    renderTooltip = ({ incident: incidentString }) => {
        const incident = JSON.parse(incidentString);
        const { wardsMap } = this.props;

        const {
            title,
            inducer,
            cause,
            source,

            // eslint-disable-next-line no-unused-vars
            hazard, id, point, createdOn,

            hazardInfo: { title: hazardType = emptyObject },
            incidentOn,
            wards = emptyList,
            streetAddress: geoareaName,
            event: {
                title: eventTitle = '-',
            } = {},

            loss = emptyObject,

            ...misc
        } = incident;

        const wardNames = wards.map(x => (wardsMap[x] || {}).title);

        const inducerText = {
            artificial: 'Artificial',
            natural: 'Natural',
        };

        const miscInfo = mapToList(
            misc,
            (value, key) => ({ key: toTitleCase(key), value: value.toString() }),
        );

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
                    className={styles.commonInfo}
                    label="Source"
                    value={source}
                />
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
                <TextOutput
                    className={styles.commonInfo}
                    label="Hazard"
                    value={hazardType}
                />
                <TextOutput
                    className={styles.commonInfo}
                    label="Event"
                    value={eventTitle}
                />
                <Loss
                    className={styles.loss}
                    label="Loss"
                    loss={loss}
                />
                <div className={styles.hr} />
                <b> Misc </b>
                <TextOutput
                    className={styles.commonInfo}
                    label="Wards"
                    value={wardNames.join(', ')}
                />
                {
                    miscInfo.map(x => (
                        <TextOutput
                            className={styles.commonInfo}
                            key={x.key}
                            label={x.key}
                            value={x.value}
                        />
                    ))
                }
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
                        layerKey="incident-points-fill"
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

const mapStateToProps = state => ({
    wardsMap: wardsMapSelector(state),
});

export default connect(mapStateToProps, null)(IncidentMap);
