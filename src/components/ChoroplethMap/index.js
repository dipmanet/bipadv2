import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { isNotDefined } from '@togglecorp/fujs';

import MapSource from '#rscz/Map/MapSource';
import MapLayer from '#rscz/Map/MapLayer';

import { mapSources, mapStyles } from '#constants';

import {
    regionLabelToGeojson,

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

const propTypes = {
    boundsPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    regionLevelFromAppState: PropTypes.number,
    regionLevel: PropTypes.number,

    // eslint-disable-next-line react/forbid-prop-types
    provinces: PropTypes.array.isRequired,
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
};

const defaultProps = {
    boundsPadding: undefined,
    regionLevelFromAppState: undefined,
    regionLevel: undefined,
    selectedProvinceId: undefined,
    selectedDistrictId: undefined,
    selectedMunicipalityId: undefined,
    sourceKey: 'country',
};

const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),

    regionLevelFromAppState: regionLevelSelector(state, props),
    bounds: boundsSelector(state, props),
    selectedProvinceId: selectedProvinceIdSelector(state, props),
    selectedDistrictId: selectedDistrictIdSelector(state, props),
    selectedMunicipalityId: selectedMunicipalityIdSelector(state, props),
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

    getDistrictsFeatureCollection = memoize(regionLabelToGeojson);

    getMunicipalitiesFeatureCollection = memoize(regionLabelToGeojson);

    getWardsFeatureCollection = memoize(regionLabelToGeojson);

    getWardFilter = memoize(getWardFilter);

    getMunicipalityFilter = memoize(getMunicipalityFilter);

    getDistrictFilter = memoize(getDistrictFilter);

    getProvinceFilter = memoize(getProvinceFilter);

    render() {
        const {
            boundsPadding,
            bounds,
            provinces,
            districts,
            municipalities,
            wards,

            selectedProvinceId: provinceId,
            selectedDistrictId: districtId,
            selectedMunicipalityId: municipalityId,
            sourceKey,

            paint,
            mapState,
            regionLevelFromAppState,
            regionLevel = regionLevelFromAppState,
        } = this.props;

        const showProvince = isNotDefined(regionLevel) || regionLevel === 1;
        const showDistrict = [1, 2].includes(regionLevel);
        const showMunicipality = [2, 3].includes(regionLevel);
        const showWard = [3, 4].includes(regionLevel);

        const showProvinceFill = isNotDefined(regionLevel);
        const showDistrictFill = regionLevel === 1;
        const showMunicipalityFill = regionLevel === 2;
        const showWardFill = regionLevel === 3;

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

        const provinceMapState = showProvinceFill ? mapState : undefined;
        const districtMapState = showDistrictFill ? mapState : undefined;
        const municipalityWardState = showMunicipalityFill ? mapState : undefined;
        const wardMapState = showWardFill ? mapState : undefined;

        const provinceLabels = this.getProvincesFeatureCollection(provinces);
        const districtLabels = this.getDistrictsFeatureCollection(districts);
        const municipalityLabels = this.getMunicipalitiesFeatureCollection(municipalities);
        const wardLabels = this.getWardsFeatureCollection(wards);

        return (
            <Fragment>
                <MapSource
                    sourceKey={`${sourceKey}-ward-fill`}
                    url={mapSources.nepal.url}
                >
                    <MapLayer
                        layerKey="ward-fill"
                        type="fill"
                        sourceLayer={mapSources.nepal.layers.ward}
                        paint={paint}
                        mapState={wardMapState}
                        layout={showWardFill ? visibleLayout : noneLayout}
                        filter={wardFilter}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${sourceKey}-municipality-fill`}
                    url={mapSources.nepal.url}
                >
                    <MapLayer
                        layerKey="municipality-fill"
                        type="fill"
                        sourceLayer={mapSources.nepal.layers.municipality}
                        paint={paint}
                        mapState={municipalityWardState}
                        layout={showMunicipalityFill ? visibleLayout : noneLayout}
                        filter={municipalityFilter}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${sourceKey}-district-fill`}
                    url={mapSources.nepal.url}
                >
                    <MapLayer
                        layerKey="district-fill"
                        type="fill"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={paint}
                        mapState={districtMapState}
                        layout={showDistrictFill ? visibleLayout : noneLayout}
                        filter={districtFilter}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${sourceKey}-province-fill`}
                    url={mapSources.nepal.url}
                >
                    <MapLayer
                        layerKey="province-fill"
                        type="fill"
                        sourceLayer={mapSources.nepal.layers.province}
                        paint={paint}
                        mapState={provinceMapState}
                        layout={showProvinceFill ? visibleLayout : noneLayout}
                        filter={provinceFilter}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${sourceKey}-country-outline`}
                    url={mapSources.nepal.url}
                    bounds={bounds}
                    boundsPadding={boundsPadding}
                >
                    <MapLayer
                        layerKey="ward-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.ward}
                        paint={mapStyles.ward.choroplethOutline}
                        layout={showWard ? visibleLayout : noneLayout}
                        filter={wardFilter}
                    />
                    <MapLayer
                        layerKey="municipality-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.municipality}
                        paint={mapStyles.municipality.choroplethOutline}
                        layout={showMunicipality ? visibleLayout : noneLayout}
                        filter={municipalityFilter}
                    />
                    <MapLayer
                        layerKey="district-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={mapStyles.district.choroplethOutline}
                        layout={showDistrict ? visibleLayout : noneLayout}
                        filter={districtFilter}
                    />
                    <MapLayer
                        layerKey="province-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.province}
                        paint={mapStyles.province.choroplethOutline}
                        layout={showProvince ? visibleLayout : noneLayout}
                        filter={provinceFilter}
                    />
                </MapSource>

                <MapSource
                    sourceKey={`${sourceKey}-ward-label`}
                    geoJson={wardLabels}
                >
                    <MapLayer
                        layerKey="ward-label"
                        type="symbol"
                        property="adminLevelId"
                        paint={mapStyles.wardLabel.paint}
                        layout={showWardFill ? mapStyles.wardLabel.layout : noneLayout}
                        filter={wardFilter}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${sourceKey}-municipality-label`}
                    geoJson={municipalityLabels}
                >
                    <MapLayer
                        layerKey="municipality-label"
                        type="symbol"
                        property="adminLevelId"
                        paint={mapStyles.municipalityLabel.paint}
                        layout={
                            showMunicipalityFill ? mapStyles.municipalityLabel.layout : noneLayout
                        }
                        filter={municipalityFilter}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${sourceKey}-district-label`}
                    geoJson={districtLabels}
                >
                    <MapLayer
                        layerKey="district-label"
                        type="symbol"
                        property="adminLevelId"
                        paint={mapStyles.districtLabel.paint}
                        layout={showDistrictFill ? mapStyles.districtLabel.layout : noneLayout}
                        filter={districtFilter}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${sourceKey}-province-label`}
                    geoJson={provinceLabels}
                >
                    <MapLayer
                        layerKey="province-label"
                        type="symbol"
                        property="adminLevelId"
                        paint={mapStyles.provinceLabel.paint}
                        layout={showProvinceFill ? mapStyles.provinceLabel.layout : noneLayout}
                        filter={provinceFilter}
                    />
                </MapSource>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps)(ChoroplethMap);
