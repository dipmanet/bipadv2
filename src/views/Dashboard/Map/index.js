import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import ReactDOMServer from 'react-dom/server';
import bbox from '@turf/bbox';
import { isTruthy } from '@togglecorp/fujs';
import { connect } from 'react-redux';

import {
    setDistrictsGeoJsonAction,
} from '#actionCreators';
import {
    filtersSelectorDP,
    districtsGeoJsonSelector,
} from '#selectors';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import {
    boundsFill,
    polygonBoundsFill,
    boundsOutline,
    // pointsOuter,
    hoverPaint,
} from './mapStyles';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

const emptyObject = {};
const emptyList = [];

class AlertMap extends React.PureComponent {
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
                .filter(alert => isTruthy(alert.polygon))
                .map((alert) => {
                    const hazardType = hazardTypes[alert.hazard];
                    const src = hazardType ? hazardType.icon : undefined;
                    return {
                        type: 'Feature',
                        geometry: {
                            ...alert.polygon,
                        },
                        properties: {
                            alert,
                            containerClassName: styles.iconContainer,
                            /*
                            markerHTML: ReactDOMServer.renderToString(
                                <img
                                    src={src}
                                    alt={alert.title}
                                    className={styles.icon}
                                />,
                            ),
                            */
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

    getCurrentBounds = () => {
        const {
            filters: {
                faramValues: {
                    region: {
                        adminLevel,
                        geoarea,
                    } = emptyObject,
                } = emptyObject,
            },
            requests: {
                districtsGeoJsonRequest: {
                    response: districtsGeoJson,
                },
            },
        } = this.props;

        const {
            features = emptyList,
        } = districtsGeoJson;

        let currentBoundingObject = districtsGeoJson;

        // FIXME: use better adminLevel detection
        if (adminLevel === 2 && geoarea) {
            const currentDistrict = features.find(d => geoarea === d.id);
            if (currentDistrict) {
                currentBoundingObject = currentDistrict;
            }
        }

        return bbox(currentBoundingObject);
    }

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
            filters,
            requests: {
                districtsGeoJsonRequest: {
                    response: districtsGeoJson,
                },
            },
        } = this.props;

        if (!districtsGeoJson) {
            return null;
        }

        const featureCollection = this.getFeatureCollection(alertList, hazardTypes);
        const bounds = this.getCurrentBounds();

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="bounds"
                    geoJson={districtsGeoJson}
                    // geoJson={nepalGeoJson}
                    bounds={bounds}
                    // bounds={bbox(districtsGeoJson)}
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
                {/*
                <MapMarkerLayer
                    geoJson={featureCollection}
                />
                */}
                <MapSource
                    sourceKey="polygons"
                    geoJson={featureCollection}
                    supportHover
                >
                    <MapLayer
                        layerKey="polygon"
                        type="fill"
                        property="alert"
                        paint={polygonBoundsFill}
                        // hoverInfo={this.hoverInfo}
                        // onClick={this.handlePointClick}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    filters: filtersSelectorDP(state),
    districtsGeoJson: districtsGeoJsonSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setDistrictsGeoJson: params => dispatch(setDistrictsGeoJsonAction),
});

const requests = {
    districtsGeoJsonRequest: {
        url: '/district/?format=geojson',
        onMount: true,
    },
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator()(
        createRequestClient(requests)(AlertMap),
    ),
);
