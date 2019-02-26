import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import ReactDOMServer from 'react-dom/server';
import turf from 'turf';

import TextOutput from '#components/TextOutput';
import GeoOutput from '#components/GeoOutput';
import DateOutput from '#components/DateOutput';
import MapMarkerLayer from '#components/MapMarkerLayer';
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

    getFeatureCollection = memoize((alertList, hazardTypes) => {
        const geojson = {
            type: 'FeatureCollection',
            features: alertList
                .filter(alert => alert.point)
                .map((alert) => {
                    const hazardType = hazardTypes[alert.hazard];
                    const src = hazardType ? hazardType.icon : undefined;
                    return {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: alert.point,
                        },
                        properties: {
                            alert,
                            containerClassName: styles.iconContainer,
                            markerHTML: ReactDOMServer.renderToString(
                                <img
                                    src={src}
                                    alt={alert.title}
                                    className={styles.icon}
                                />,
                            ),
                            popupHTML: ReactDOMServer.renderToString(
                                <div className={styles.markerPopup}>
                                    <h3 className={styles.heading}>
                                        { alert.title }
                                    </h3>
                                </div>,
                            ),
                        },
                    };
                }),
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
            hazardTypes,
        } = this.props;

        const featureCollection = this.getFeatureCollection(alertList, hazardTypes);

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="bounds"
                    geoJson={nepalGeoJson}
                    bounds={turf.bbox(nepalGeoJson)}
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
                    geoJson={featureCollection}
                />
                {/*
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
                */}
            </React.Fragment>
        );
    }
}
