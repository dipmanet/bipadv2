import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapBounds from '#re-map/MapBounds';

import { mapSources, mapStyles } from '#constants';

import {
    getWardFilter,
    getMunicipalityFilter,
    getDistrictFilter,
    getProvinceFilter,
} from '#utils/domain';

import {
    provincesSelector,
    municipalitiesSelector,
    districtsSelector,
    wardsSelector,

    regionLevelSelector,
    boundsSelector,
    selectedProvinceIdSelector,
    selectedDistrictIdSelector,
    selectedMunicipalityIdSelector,
} from '#selectors';

interface Props {
}

interface State {
}

const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),

    regionLevel: regionLevelSelector(state, props),
    bounds: boundsSelector(state, props),

    selectedProvinceId: selectedProvinceIdSelector(state, props),
    selectedDistrictId: selectedDistrictIdSelector(state, props),
    selectedMunicipalityId: selectedMunicipalityIdSelector(state, props),
});

class LocationInputMap extends React.PureComponent<Props, State> {
    private getWardFilter = memoize(getWardFilter);

    private getMunicipalityFilter = memoize(getMunicipalityFilter);

    private getDistrictFilter = memoize(getDistrictFilter);

    private getProvinceFilter = memoize(getProvinceFilter);

    public render() {
        const {
            regionLevel,
            bounds,
            provinces,
            districts,
            municipalities,
            wards,

            selectedProvinceId: provinceId,
            selectedDistrictId: districtId,
            selectedMunicipalityId: municipalityId,
            sourceKey,
        } = this.props;

        const wardFilter = this.getWardFilter(provinceId, districtId, municipalityId, wards);
        const municipalityFilter = this.getMunicipalityFilter(
            provinceId,
            districtId,
            municipalityId,
            municipalities,
        );
        const districtFilter = this.getDistrictFilter(provinceId, districtId, districts);
        const provinceFilter = this.getProvinceFilter(provinceId);

        return (
            <Fragment>
                <MapSource
                    sourceKey={'location-input-country'}
                    sourceOptions={{
                        type: 'vector',
                        url: mapSources.nepal.url,
                    }}
                >
                    <MapBounds
                        bounds={bounds}
                        padding={5}
                    />
                    <MapLayer
                        layerKey="ward-fill"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.ward,
                            type: 'fill',
                            paint: mapStyles.ward.fill,
                            filter: wardFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="ward-outline"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.ward,
                            type: 'line',
                            paint: mapStyles.ward.outline,
                            filter: wardFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="municipality-outline"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.municipality,
                            type: 'line',
                            paint: mapStyles.municipality.outline,
                            filter: municipalityFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="district-outline"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.district,
                            type: 'line',
                            paint: mapStyles.district.outline,
                            filter: districtFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="province-outline"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.province,
                            type: 'line',
                            paint: mapStyles.province.outline,
                            filter: provinceFilter,
                        }}
                    />
                </MapSource>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps)(LocationInputMap);
