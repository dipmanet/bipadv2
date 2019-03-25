import React from 'react';
import PropTypes from 'prop-types';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import { mapSources, mapStyles } from '#constants';

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
                    url={mapSources.nepal.url}
                >
                    <MapLayer
                        layerKey="districts-fill"
                        type="fill"
                        paint={mapStyles.district.fill}
                        sourceLayer={mapSources.nepal.layers.district}
                    />
                    <MapLayer
                        layerKey="districts-outline"
                        type="line"
                        paint={mapStyles.district.outline}
                        sourceLayer={mapSources.nepal.layers.district}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}
