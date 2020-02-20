import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { isNotDefined } from '@togglecorp/fujs';

import MapBounds from '#re-map/MapBounds';
import MapState from '#re-map/MapSource/MapState';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';

import { mapSources, mapStyles } from '#constants';

import { regionLabelToGeojson } from '#utils/domain';

import {
    provincesSelector,

    regionLevelSelector,
    boundsSelector,
} from '#selectors';

const propTypes = {
    regionLevelFromAppState: PropTypes.number,
    regionLevel: PropTypes.number,

    // eslint-disable-next-line react/forbid-prop-types
    provinces: PropTypes.array.isRequired,

    // eslint-disable-next-line react/forbid-prop-types
    bounds: PropTypes.array.isRequired,
    sourceKey: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    paint: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    mapState: PropTypes.array.isRequired,
};

const defaultProps = {
    regionLevelFromAppState: undefined,
    regionLevel: undefined,
    sourceKey: 'country',
};

const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),

    regionLevelFromAppState: regionLevelSelector(state, props),
    bounds: boundsSelector(state, props),
});

const visibleLayout = {
    visibility: 'visible',
};
const noneLayout = {
    visibility: 'none',
};

class ChoroplethMap extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    getProvincesFeatureCollection = memoize(regionLabelToGeojson);

    render() {
        const {
            bounds,
            provinces,

            sourceKey,

            paint,
            mapState,
            regionLevelFromAppState,
            regionLevel = regionLevelFromAppState,
        } = this.props;

        const showProvince = isNotDefined(regionLevel) || regionLevel === 1;

        const showProvinceFill = isNotDefined(regionLevel);

        const showProvinceLabel = showProvinceFill;

        const provinceMapState = showProvinceFill ? mapState : undefined;

        const provinceLabels = this.getProvincesFeatureCollection(provinces);

        const {
            province,
        } = mapSources.nepal.layers;

        return (
            <Fragment>
                <MapBounds
                    bounds={bounds}
                    padding={20}
                />
                <MapSource
                    sourceKey={`${sourceKey}-fills`}
                    sourceOptions={{
                        type: 'vector',
                        url: mapSources.nepal.url,
                    }}
                >
                    <MapLayer
                        layerKey="province-fill"
                        layerOptions={{
                            type: 'fill',
                            'source-layer': mapSources.nepal.layers.province,
                            paint,
                            layout: showProvinceFill ? visibleLayout : noneLayout,
                        }}
                    />
                    {provinceMapState && (
                        <MapState
                            attributes={provinceMapState}
                            attributeKey="value"
                            sourceLayer={province}
                        />
                    )}
                </MapSource>
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
                            layout: showProvince ? visibleLayout : noneLayout,
                        }}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${sourceKey}-province-label`}
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={provinceLabels}
                >
                    <MapLayer
                        layerKey="province-label"
                        layerOptions={{
                            type: 'symbol',
                            property: 'adminLevelId',
                            paint: mapStyles.provinceLabel.paint,
                            layout: showProvinceLabel ? mapStyles.provinceLabel.layout : noneLayout,
                        }}
                    />
                </MapSource>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps)(ChoroplethMap);
