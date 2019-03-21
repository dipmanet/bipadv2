import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
// import ReactDOMServer from 'react-dom/server';
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
    districtsFill,
    polygonFill,
    districtsOutline,
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

    getFeatureCollection = memoize((alertList) => {
        const geojson = {
            type: 'FeatureCollection',
            features: alertList
                .filter(alert => isTruthy(alert.polygon))
                .map((alert) => {
                    const {
                        id,
                        title,
                        polygon,
                        description,
                    } = alert;

                    return {
                        id,
                        type: 'Feature',
                        geometry: {
                            ...polygon,
                        },
                        properties: {
                            title,
                            description,
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

    tooltipRendererParams = (id, { title, description }) => ({
        title,
        description,
    })

    tooltipRenderer = ({ title, description }) => (
        <div>
            <h3>
                {title}
            </h3>
            <p>
                {description}
            </p>
        </div>
    )

    render() {
        const {
            className,
            alertList,
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

        const featureCollection = this.getFeatureCollection(alertList);
        const bounds = this.getCurrentBounds();

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="districts"
                    geoJson={districtsGeoJson}
                    bounds={bounds}
                >
                    <MapLayer
                        layerKey="districts-fill"
                        type="fill"
                        paint={districtsFill}
                    />
                    <MapLayer
                        layerKey="districts-outline"
                        type="line"
                        paint={districtsOutline}
                    />
                </MapSource>
                <MapSource
                    sourceKey="polygons"
                    geoJson={featureCollection}
                >
                    <MapLayer
                        layerKey="polygon"
                        type="fill"
                        paint={polygonFill}
                        enableHover
                        tooltipRenderer={this.tooltipRenderer}
                        tooltipRendererParams={this.tooltipRendererParams}
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
