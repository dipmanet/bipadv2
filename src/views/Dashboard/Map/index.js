import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';

import { isTruthy } from '@togglecorp/fujs';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import { hazardTypesSelector } from '#selectors';

import { mapSources } from '#constants';
import { getHazardColor } from '#utils/domain';

import {
    alertFill,
    districtsFill,
    districtsOutline,
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
    hazards: PropTypes.object,
};

const defaultProps = {
    alertList: [],
    hazards: {},
};

const mapStateToProps = state => ({
    hazards: hazardTypesSelector(state),
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
        } = this.props;
        const featureCollection = this.getFeatureCollection(alertList, hazards);

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="districts"
                    url={mapSources.nepal.url}
                >
                    <MapLayer
                        layerKey="districts-fill"
                        type="fill"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={districtsFill}
                    />
                    <MapLayer
                        layerKey="districts-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={districtsOutline}
                    />
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
