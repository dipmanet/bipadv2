import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import TextOutput from '#components/TextOutput';
import GeoOutput from '#components/GeoOutput';
import DateOutput from '#components/DateOutput';
import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import nepalGeoJson from '#resources/districts.json';

import {
    boundsFill,
    boundsOutline,
    // pointsOuter,
    pointsInner,
    hoverPaint,
} from './mapStyles';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

export default class IncidentMap extends React.PureComponent {
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
                    },
                })),
        };

        return geojson;
    });

    renderTooltip = ({ incident: incidentString }) => {
        const incident = JSON.parse(incidentString);

        const {
            title,
            inducer,
            cause,
            incident_on: incidentOn,
            geoareaName,
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
            </div>
        );
    }

    render() {
        const {
            className,
            incidentList,
        } = this.props;

        const featureCollection = this.getFeatureCollection(incidentList);

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="bounds"
                    geoJson={nepalGeoJson}
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
                        paint={pointsInner}
                        // onClick={this.handlePointClick}
                        hoverInfo={this.hoverInfo}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}
