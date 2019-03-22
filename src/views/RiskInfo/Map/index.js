import React from 'react';
import PropTypes from 'prop-types';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import { mapSources } from '#constants';

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

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="districts"
                    url={mapSources.district.url}
                >
                    <MapLayer
                        layerKey="districts-fill"
                        type="fill"
                        paint={districtsFill}
                        sourceLayer={mapSources.district.sourceLayer}
                    />
                    <MapLayer
                        layerKey="districts-outline"
                        type="line"
                        paint={districtsOutline}
                        sourceLayer={mapSources.district.sourceLayer}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}
