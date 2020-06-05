import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import MapBounds from '#re-map/MapBounds';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';

import { mapSources, mapStyles } from '#constants';

import { boundsSelector } from '#selectors';

const propTypes = {
    boundsPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),

    // eslint-disable-next-line react/forbid-prop-types
    // provinces: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    bounds: PropTypes.array.isRequired,
    sourceKey: PropTypes.string,
};

const defaultProps = {
    boundsPadding: 24,
    sourceKey: 'country',
};

const mapStateToProps = (state, props) => ({
    bounds: boundsSelector(state, props),
});

const visibleLayout = {
    visibility: 'visible',
};

class CommonMap extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    render() {
        const {
            boundsPadding,
            // TODO: Set to Nepal's bounds
            bounds,
            sourceKey,
        } = this.props;

        return (
            <Fragment>
                <MapBounds
                    bounds={bounds}
                    padding={boundsPadding}
                />
                <MapSource
                    sourceKey={`${sourceKey}-outlines`}
                    sourceOptions={{
                        type: 'vector',
                        url: mapSources.nepal.url,
                    }}
                >
                    <MapLayer
                        layerKey="province-outline"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.province,
                            type: 'line',
                            paint: mapStyles.province.outline,
                            layout: visibleLayout,
                        }}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${sourceKey}-outlines`}
                    sourceOptions={{
                        type: 'vector',
                        url: mapSources.nepalCentroid.url,
                    }}
                >
                    <MapLayer
                        layerKey="province-label"
                        layerOptions={{
                            'source-layer': mapSources.nepalCentroid.layers.province,
                            type: 'symbol',
                            paint: mapStyles.provinceLabel.paint,
                            layout: mapStyles.provinceLabel.layout,
                        }}
                    />
                </MapSource>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps)(CommonMap);
