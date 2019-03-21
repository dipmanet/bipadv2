import React from 'react';
import PropTypes from 'prop-types';
import bbox from '@turf/bbox';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import nepalGeoJson from '#resources/districts.json';

import {
    districtsFill,
    districtsOutline,
} from './mapStyles';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

export default class ResponseMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    render() {
        const { className } = this.props;

        const bounds = bbox(nepalGeoJson);
        return (
            <React.Fragment>
                <MapSource
                    sourceKey="districts"
                    geoJson={nepalGeoJson}
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
            </React.Fragment>
        );
    }
}
