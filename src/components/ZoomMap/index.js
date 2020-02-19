import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import MapBounds from '#re-map/MapBounds';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';

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

class ZoomMap extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    render() {
        const {
            boundsPadding,
            bounds,
            sourceKey,
        } = this.props;

        return (
            <React.Fragment>
                <MapBounds
                    bounds={bounds}
                    padding={boundsPadding}
                />
                <MapSource
                    sourceKey={`${sourceKey}-zoom-outlines`}
                    sourceOptions={{
                        type: 'vector',
                        url: mapSources.nepal.url,
                    }}
                >
                    <MapLayer
                        layerKey="ward-outline"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.ward,
                            type: 'line',
                            paint: mapStyles.ward.outline,
                            minzoom: 9,
                        }}
                    />
                    <MapLayer
                        layerKey="municipality-outline"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.municipality,
                            type: 'line',
                            paint: mapStyles.municipality.outline,
                            minzoom: 8,
                        }}
                    />
                    <MapLayer
                        layerKey="district-outline"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.district,
                            type: 'line',
                            paint: mapStyles.district.outline,
                            minzoom: 6,
                        }}
                    />
                    <MapLayer
                        layerKey="province-outline"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.province,
                            type: 'line',
                            paint: mapStyles.province.outline,
                        }}
                    />

                    <MapLayer
                        layerKey="province-label"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.provinceLabel,
                            type: 'symbol',
                            paint: mapStyles.provinceLabel.paint,
                            layout: mapStyles.provinceLabel.layout,
                        }}
                    />
                    <MapLayer
                        layerKey="district-label"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.districtLabel,
                            type: 'symbol',
                            paint: mapStyles.districtLabel.paint,
                            layout: mapStyles.districtLabel.layout,
                            minzoom: 6,
                        }}
                    />
                    <MapLayer
                        layerKey="municipality-label"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.municipalityLabel,
                            type: 'symbol',
                            paint: mapStyles.municipalityLabel.paint,
                            layout: mapStyles.municipalityLabel.layout,
                            minzoom: 8,
                        }}
                    />
                    <MapLayer
                        layerKey="ward-label"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.wardLabel,
                            type: 'symbol',
                            paint: mapStyles.wardLabel.paint,
                            layout: mapStyles.wardLabel.layout,
                            minzoom: 9,
                        }}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

export default ZoomMap;
