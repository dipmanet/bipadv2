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
    symbol,
    hoverPaint,
} from './mapStyles';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

export default class AlertMap extends React.PureComponent {
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

    getFeatureCollection = memoize((alertList) => {
        const geojson = {
            type: 'FeatureCollection',
            features: alertList
                .filter(alert => alert.point)
                .map(alert => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: alert.point,
                    },
                    properties: {
                        alert,
                    },
                })),
        };

        return geojson;
    });

    renderTooltip = ({ alert: alertString }) => {
        const alert = JSON.parse(alertString);

        const { title } = alert;

        return (
            <div className={styles.tooltip}>
                <h2 className={styles.heading}>
                    {title}
                </h2>
            </div>
        );
    }

    render() {
        const {
            className,
            alertList,
        } = this.props;

        const featureCollection = this.getFeatureCollection(alertList);

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
                        property="alert"
                        paint={pointsInner}
                        hoverInfo={this.hoverInfo}
                        // onClick={this.handlePointClick}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}
