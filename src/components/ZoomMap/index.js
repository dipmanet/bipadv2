import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import MapBounds from '#re-map/MapBounds';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';

import { mapSources, mapStyles } from '#constants';
import { regionLabelToGeojson } from '#utils/domain';

import {
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
} from '#selectors';

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

const mapStateToProps = state => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
});

class ZoomMap extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    getProvincesFeatureCollection = memoize(regionLabelToGeojson);

    getDistrictsFeatureCollection = memoize(regionLabelToGeojson);

    getMunicipalitiesFeatureCollection = memoize(regionLabelToGeojson);

    getWardsFeatureCollection = memoize(regionLabelToGeojson);

    render() {
        const {
            boundsPadding,
            bounds,
            sourceKey,
            provinces,
            districts,
            municipalities,
            wards,
        } = this.props;

        const provinceLabels = this.getProvincesFeatureCollection(provinces);
        const districtLabels = this.getDistrictsFeatureCollection(districts);
        const municipalityLabels = this.getMunicipalitiesFeatureCollection(municipalities);
        const wardLabels = this.getWardsFeatureCollection(wards);

        return (
            <React.Fragment>
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
                        }}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${sourceKey}-municipality-label`}
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={municipalityLabels}
                >
                    <MapLayer
                        layerKey="municipality-label"
                        layerOptions={{
                            type: 'symbol',
                            property: 'adminLevelId',
                            paint: mapStyles.municipalityLabel.paint,
                            minzoom: 6,
                        }}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${sourceKey}-district-label`}
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={districtLabels}
                >
                    <MapLayer
                        layerKey="district-label"
                        layerOptions={{
                            type: 'symbol',
                            property: 'adminLevelId',
                            paint: mapStyles.districtLabel.paint,
                            minzoom: 8,
                        }}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${sourceKey}-ward-label`}
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={wardLabels}
                >
                    <MapLayer
                        layerKey="ward-label"
                        layerOptions={{
                            type: 'symbol',
                            property: 'adminLevelId',
                            paint: mapStyles.wardLabel.paint,
                            minzoom: 9,
                        }}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(ZoomMap);
