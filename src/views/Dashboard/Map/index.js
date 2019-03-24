import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import { isTruthy } from '@togglecorp/fujs';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

// import { filtersSelectorDP } from '#selectors';
import { mapSources } from '#constants';

import {
    alertFill,
    districtsFill,
    districtsOutline,
} from './mapStyles';

import styles from './styles.scss';

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    alertList: PropTypes.array,
};

const defaultProps = {
    alertList: [],
};

export default class AlertMap extends React.PureComponent {
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

    tooltipRendererParams = (id, { title, description }) => ({
        title,
        description,
    })

    tooltipRenderer = ({ title, description }) => (
        <div className={styles.tooltip}>
            <h3 className={styles.heading}>
                {title}
            </h3>
            <p>
                {description}
            </p>
        </div>
    )

    render() {
        const { alertList } = this.props;
        const featureCollection = this.getFeatureCollection(alertList);

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
                        tooltipRenderer={this.tooltipRenderer}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

/*
const mapStateToProps = state => ({
    filters: filtersSelectorDP(state),
});
export default connect(mapStateToProps)(AlertMap);
*/
