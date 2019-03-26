import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import MapSource from '#rscz/Map/MapSource';
import MapLayer from '#rscz/Map/MapLayer';

import { mapSources, mapStyles } from '#constants';

const propTypes = {
    boundsPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    // eslint-disable-next-line react/forbid-prop-types
    bounds: PropTypes.array.isRequired,
    sourceKey: PropTypes.string,
};

const defaultProps = {
    boundsPadding: undefined,
    sourceKey: 'country',
};

export default class ZoomMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    render() {
        const {
            boundsPadding,
            bounds,
            sourceKey,
        } = this.props;

        return (
            <MapSource
                sourceKey={sourceKey}
                url={mapSources.nepal.url}
                bounds={bounds}
                boundsPadding={boundsPadding}
            >
                <MapLayer
                    layerKey="province-outline"
                    type="line"
                    sourceLayer={mapSources.nepal.layers.province}
                    paint={mapStyles.province.outline}
                />
                <MapLayer
                    layerKey="district-outline"
                    type="line"
                    sourceLayer={mapSources.nepal.layers.district}
                    paint={mapStyles.district.outline}
                    minzoom={6}
                />
                <MapLayer
                    layerKey="municipality-outline"
                    type="line"
                    sourceLayer={mapSources.nepal.layers.municipality}
                    paint={mapStyles.municipality.outline}
                    minzoom={8}
                />
                <MapLayer
                    layerKey="ward-outline"
                    type="line"
                    sourceLayer={mapSources.nepal.layers.ward}
                    paint={mapStyles.ward.outline}
                    minzoom={9}
                />
            </MapSource>
        );
    }
}
