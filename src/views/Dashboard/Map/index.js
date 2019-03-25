import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';

import { isTruthy } from '@togglecorp/fujs';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import {
    hazardTypesSelector,
    regionLevelSelector,
    boundsSelector,
} from '#selectors';

import { mapSources } from '#constants';
import { getHazardColor } from '#utils/domain';

import {
    alertFill,
    provincesFill,
    wardsOutline,
    municipalitiesOutline,
    districtsOutline,
    provincesOutline,
} from './mapStyles';

import styles from './styles.scss';

const Tooltip = ({ title, description }) => (
    <div className={styles.tooltip}>
        <h3 className={styles.heading}>
            {title}
        </h3>
        <p>
            {description}
        </p>
    </div>
);
Tooltip.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};


const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    alertList: PropTypes.array,
    // eslint-disable-next-line react/forbid-prop-types
    bounds: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    hazards: PropTypes.object,
    regionLevel: PropTypes.number,
};

const defaultProps = {
    alertList: [],
    hazards: {},
    regionLevel: undefined,
};

const mapStateToProps = state => ({
    hazards: hazardTypesSelector(state),
    regionLevel: regionLevelSelector(state),
    bounds: boundsSelector(state),
});

class AlertMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getFeatureCollection = memoize((alertList, hazards) => {
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
                            hazardColor: getHazardColor(hazards, alert.hazard),
                        },
                    };
                }),
        };

        return geojson;
    });

    tooltipRendererParams = (id, { title, description }) => ({
        title,
        description,
    })

    render() {
        const {
            alertList,
            hazards,
            regionLevel,
            bounds,
        } = this.props;

        const featureCollection = this.getFeatureCollection(alertList, hazards);

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="districts"
                    url={mapSources.nepal.url}
                    bounds={bounds}
                >
                    <MapLayer
                        layerKey="province-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.province}
                        paint={provincesOutline}
                    />
                    <MapLayer
                        layerKey="province-fill"
                        type="fill"
                        sourceLayer={mapSources.nepal.layers.province}
                        paint={provincesFill}
                    />
                    { regionLevel >= 1 &&
                        <MapLayer
                            layerKey="districts-outline"
                            type="line"
                            sourceLayer={mapSources.nepal.layers.district}
                            paint={districtsOutline}
                        />
                    }
                    { regionLevel >= 2 &&
                        <MapLayer
                            layerKey="municipalities-outline"
                            type="line"
                            sourceLayer={mapSources.nepal.layers.municipality}
                            paint={municipalitiesOutline}
                        />
                    }
                    { regionLevel >= 3 &&
                        <MapLayer
                            layerKey="wards-outline"
                            type="line"
                            sourceLayer={mapSources.nepal.layers.ward}
                            paint={wardsOutline}
                        />
                    }
                </MapSource>
                <MapSource
                    sourceKey="alerts"
                    geoJson={featureCollection}
                >
                    <MapLayer
                        layerKey="alerts-fill"
                        type="fill"
                        enableHover
                        paint={alertFill}
                        tooltipRenderer={Tooltip}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(AlertMap);
