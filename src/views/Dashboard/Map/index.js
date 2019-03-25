import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import {
    hazardTypesSelector,
    regionLevelSelector,
    boundsSelector,
} from '#selectors';

import { mapSources, mapStyles } from '#constants';
import { alertToGeojson } from '#utils/domain';

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

    getFeatureCollection = memoize(alertToGeojson);

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
                        layerKey="province-fill"
                        type="fill"
                        sourceLayer={mapSources.nepal.layers.province}
                        paint={mapStyles.province.fill}
                    />
                    <MapLayer
                        layerKey="province-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.province}
                        paint={mapStyles.province.outline}
                    />
                    { regionLevel >= 1 &&
                        <MapLayer
                            layerKey="districts-outline"
                            type="line"
                            sourceLayer={mapSources.nepal.layers.district}
                            paint={mapStyles.district.outline}
                        />
                    }
                    { regionLevel >= 2 &&
                        <MapLayer
                            layerKey="municipalities-outline"
                            type="line"
                            sourceLayer={mapSources.nepal.layers.municipality}
                            paint={mapStyles.municipality.outline}
                        />
                    }
                    { regionLevel >= 3 &&
                        <MapLayer
                            layerKey="wards-outline"
                            type="line"
                            sourceLayer={mapSources.nepal.layers.ward}
                            paint={mapStyles.ward.outline}
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
                        paint={mapStyles.alertPolygon.fill}
                        tooltipRenderer={Tooltip}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(AlertMap);
