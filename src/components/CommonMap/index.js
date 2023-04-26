/* eslint-disable no-nested-ternary */
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { isNotDefined } from '@togglecorp/fujs';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';

import { mapSources, mapStyles } from '#constants';
import MapBounds from '#re-map/MapBounds';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import {
    boundsSelector,
    districtsSelector,
    languageSelector,
    // provincesSelector,
    municipalitiesSelector,
    regionLevelSelector,
    selectedDistrictIdSelector,
    selectedMunicipalityIdSelector,
    selectedProvinceIdSelector,
    showDistrictSelector,
    showMunicipalitySelector,
    showProvinceSelector,
    showWardSelector,
    wardsSelector,
} from '#selectors';
import {
    getDistrictFilter,
    getMunicipalityFilter,
    getProvinceFilter,
    getWardFilter,
} from '#utils/domain';

const propTypes = {
    boundsPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    regionLevel: PropTypes.number,

    // eslint-disable-next-line react/forbid-prop-types
    // provinces: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    districts: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    municipalities: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    wards: PropTypes.array.isRequired,

    // eslint-disable-next-line react/forbid-prop-types
    bounds: PropTypes.array.isRequired,
    selectedProvinceId: PropTypes.number,
    selectedDistrictId: PropTypes.number,
    selectedMunicipalityId: PropTypes.number,
    sourceKey: PropTypes.string,

    // NOTE: get this from redux
    showProvince: PropTypes.bool,
    showDistrict: PropTypes.bool,
    showMunicipality: PropTypes.bool,
    showWard: PropTypes.bool,

    // For props from components
    regionFromComp: PropTypes.number,
    provinceFromComp: PropTypes.number,
    districtFromComp: PropTypes.number,
    municipalityFromComp: PropTypes.number,
    // eslint-disable-next-line react/forbid-prop-types
    boundingsFromComp: PropTypes.array,
};

const defaultProps = {
    boundsPadding: 24,
    regionLevel: undefined,
    selectedProvinceId: undefined,
    selectedDistrictId: undefined,
    selectedMunicipalityId: undefined,
    sourceKey: 'country',

    showProvince: undefined,
    showDistrict: undefined,
    showMunicipality: undefined,
    showWard: undefined,
    regionFromComp: undefined,
    provinceFromComp: undefined,
    districtFromComp: undefined,
    municipalityFromComp: undefined,
    boundingsFromComp: undefined,
};

const mapStateToProps = (state, props) => ({
    // provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),

    regionLevel: regionLevelSelector(state, props),
    bounds: boundsSelector(state, props),

    selectedProvinceId: selectedProvinceIdSelector(state, props),
    selectedDistrictId: selectedDistrictIdSelector(state, props),
    selectedMunicipalityId: selectedMunicipalityIdSelector(state, props),

    showProvince: showProvinceSelector(state, props),
    showDistrict: showDistrictSelector(state, props),
    showMunicipality: showMunicipalitySelector(state, props),
    showWard: showWardSelector(state, props),
    language: languageSelector(state),
});

const visibleLayout = {
    visibility: 'visible',
};
const noneLayout = {
    visibility: 'none',
};

class CommonMap extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    getWardFilter = memoize(getWardFilter);

    getMunicipalityFilter = memoize(getMunicipalityFilter);

    getDistrictFilter = memoize(getDistrictFilter);

    getProvinceFilter = memoize(getProvinceFilter);

    render() {
        const {
            boundsPadding,
            regionLevel: selfRegionLevel,
            bounds: selfBounds,
            // provinces,
            districts,
            municipalities,
            wards,

            selectedProvinceId: selfProvinceId,
            selectedDistrictId: selfDistrictId,
            selectedMunicipalityId: selfMunicipalityId,
            sourceKey,

            showProvince: showProvinceFromProps,
            showDistrict: showDistrictFromProps,
            showMunicipality: showMunicipalityFromProps,
            showWard: showWardFromProps,
            regionFromComp,
            provinceFromComp,
            districtFromComp,
            municipalityFromComp,
            boundingsFromComp,
            children,
            language: { language },
        } = this.props;
        const regionLevel = regionFromComp || selfRegionLevel;
        const provinceId = provinceFromComp || selfProvinceId;
        const districtId = districtFromComp || selfDistrictId;
        const municipalityId = municipalityFromComp || selfMunicipalityId;
        const bounds = boundingsFromComp || selfBounds;

        const isForced = showProvinceFromProps
            || showDistrictFromProps
            || showMunicipalityFromProps
            || showWardFromProps;

        let showProvince;
        let showDistrict;
        let showMunicipality;
        let showWard;
        let showProvinceLabel;
        let showDistrictLabel;
        let showMunicipalityLabel;
        let showWardLabel;
        if (isForced) {
            showProvince = showProvinceFromProps;
            showDistrict = showDistrictFromProps;
            showMunicipality = showMunicipalityFromProps;
            showWard = showWardFromProps;

            showProvinceLabel = showProvinceFromProps;
            showDistrictLabel = showDistrictFromProps;
            showMunicipalityLabel = showMunicipalityFromProps;
            showWardLabel = showWardFromProps;
        } else {
            showProvince = isNotDefined(regionLevel) || regionLevel === 1;
            showDistrict = [1, 2].includes(regionLevel);
            showMunicipality = [2, 3].includes(regionLevel);
            showWard = [3, 4].includes(regionLevel);

            showProvinceLabel = isNotDefined(regionLevel);
            showDistrictLabel = regionLevel === 1;
            showMunicipalityLabel = regionLevel === 2;
            showWardLabel = regionLevel === 3;
        }

        const wardFilter = showWard
            ? this.getWardFilter(provinceId, districtId, municipalityId, wards)
            : undefined;
        const municipalityFilter = showMunicipality
            ? this.getMunicipalityFilter(provinceId, districtId, municipalityId, municipalities)
            : undefined;
        const districtFilter = showDistrict
            ? this.getDistrictFilter(provinceId, districtId, districts)
            : undefined;
        const provinceFilter = showProvince
            ? this.getProvinceFilter(provinceId)
            : undefined;

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
                        layerKey="ward-outline"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.ward,
                            type: 'line',
                            paint: mapStyles.ward.outline,
                            layout: showWard ? visibleLayout : noneLayout,
                            filter: wardFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="municipality-outline"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.municipality,
                            type: 'line',
                            paint: mapStyles.municipality.outline,
                            layout: showMunicipality ? visibleLayout : noneLayout,
                            filter: municipalityFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="district-outline"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.district,
                            type: 'line',
                            paint: mapStyles.district.outline,
                            layout: showDistrict ? visibleLayout : noneLayout,
                            filter: districtFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="province-outline"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.province,
                            type: 'line',
                            paint: mapStyles.province.outline,
                            layout: showProvince ? visibleLayout : noneLayout,
                            filter: provinceFilter,
                        }}
                    />
                </MapSource>
                {children}
                <MapSource
                    sourceKey={`${sourceKey}-label`}
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
                            layout: showProvinceLabel
                                ? (language === 'en'
                                    ? mapStyles.provinceLabel.layout
                                    : mapStyles.provinceLabelNep.layout
                                )
                                : noneLayout,
                            filter: provinceFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="district-label"
                        layerOptions={{
                            'source-layer': mapSources.nepalCentroid.layers.district,
                            type: 'symbol',
                            paint: mapStyles.districtLabel.paint,
                            layout: showDistrictLabel
                                ? (language === 'en'
                                    ? mapStyles.districtLabel.layout
                                    : mapStyles.districtLabelNep.layout
                                ) : noneLayout,
                            filter: districtFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="municipality-label"
                        layerOptions={{
                            'source-layer': mapSources.nepalCentroid.layers.municipality,
                            type: 'symbol',
                            paint: mapStyles.municipalityLabel.paint,
                            layout: showMunicipalityLabel
                                ? (language === 'en'
                                    ? mapStyles.municipalityLabel.layout
                                    : mapStyles.municipalityLabelNep.layout
                                )
                                : noneLayout,
                            filter: municipalityFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="ward-label"
                        layerOptions={{
                            'source-layer': mapSources.nepalCentroid.layers.ward,
                            type: 'symbol',
                            paint: mapStyles.wardLabel.paint,
                            layout: showWardLabel
                                ? (language === 'en'
                                    ? mapStyles.wardLabel.layout
                                    : mapStyles.wardLabelNep.layout)
                                : noneLayout,
                            filter: wardFilter,
                        }}
                    />
                </MapSource>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps)(CommonMap);
