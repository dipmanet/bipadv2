import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { isNotDefined } from '@togglecorp/fujs';

import MapSource from '#rscz/Map/MapSource';
import MapLayer from '#rscz/Map/MapLayer';

import { mapSources, mapStyles } from '#constants';

import { getAdminLevelTitles } from '#utils/domain';

import {
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
    regionLevelSelector,
    boundsSelector,
    selectedProvinceIdSelector,
    selectedDistrictIdSelector,
    selectedMunicipalityIdSelector,
} from '#selectors';

const propTypes = {
    boundsPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
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
    regionLevel: undefined,
    selectedProvinceId: undefined,
    selectedDistrictId: undefined,
    selectedMunicipalityId: undefined,
    sourceKey: 'country',
};

const mapStateToProps = state => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    regionLevel: regionLevelSelector(state),
    bounds: boundsSelector(state),
    selectedProvinceId: selectedProvinceIdSelector(state),
    selectedDistrictId: selectedDistrictIdSelector(state),
    selectedMunicipalityId: selectedMunicipalityIdSelector(state),
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

    getProvincesFeatureCollection = memoize(getAdminLevelTitles);
    getDistrictsFeatureCollection = memoize(getAdminLevelTitles);
    getMunicipalitiesFeatureCollection = memoize(getAdminLevelTitles);
    getWardsFeatureCollection = memoize(getAdminLevelTitles);

    render() {
        const {
            boundsPadding,
            regionLevel,
            bounds,
            provinces,
            districts,
            municipalities,
            wards,
            selectedProvinceId,
            selectedDistrictId,
            selectedMunicipalityId,
            sourceKey,
        } = this.props;

        const provinceLabels = this.getProvincesFeatureCollection(provinces);
        const districtLabels = this.getDistrictsFeatureCollection(districts);
        const municipalityLabels = this.getMunicipalitiesFeatureCollection(municipalities);
        const wardLabels = this.getWardsFeatureCollection(wards);

        const showProvince = isNotDefined(regionLevel) || regionLevel >= 0;
        const showDistrict = regionLevel >= 1;
        const showMunicipality = regionLevel >= 2;
        const showWard = regionLevel >= 3;

        const showProvinceLabel = isNotDefined(regionLevel) || regionLevel === 0;
        const showDistrictLabel = regionLevel === 1;
        const showMunicipalityLabel = regionLevel === 2;
        const showWardLabel = regionLevel === 3;

        return (
            <Fragment>
                <MapSource
                    sourceKey={`${sourceKey}-municipality-fill`}
                    url={mapSources.nepal.url}
                >
                    <MapLayer
                        layerKey="municipality-fill"
                        type="fill"
                        sourceLayer={mapSources.nepal.layers.municipality}
                        paint={mapStyles.municipality.fill}
                        hoveredId={selectedMunicipalityId}
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
                        paint={mapStyles.district.fill}
                        hoveredId={selectedDistrictId}
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
                        paint={mapStyles.province.fill}
                        hoveredId={selectedProvinceId}
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
                        paint={mapStyles.ward.outline}
                        layout={showWard ? visibleLayout : noneLayout}
                    />
                    <MapLayer
                        layerKey="municipality-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.municipality}
                        paint={mapStyles.municipality.outline}
                        layout={showMunicipality ? visibleLayout : noneLayout}
                    />
                    <MapLayer
                        layerKey="district-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={mapStyles.district.outline}
                        layout={showDistrict ? visibleLayout : noneLayout}
                    />
                    <MapLayer
                        layerKey="province-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.province}
                        paint={mapStyles.province.outline}
                        layout={showProvince ? visibleLayout : noneLayout}
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
                        layout={showProvinceLabel ? mapStyles.provinceLabel.layout : noneLayout}
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
                        layout={showDistrictLabel ? mapStyles.districtLabel.layout : noneLayout}
                        minzoom={6}
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
                            showMunicipalityLabel ? mapStyles.municipalityLabel.layout : noneLayout
                        }
                        minzoom={8}
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
                        layout={showWardLabel ? mapStyles.wardLabel.layout : noneLayout}
                        minzoom={9}
                    />
                </MapSource>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps)(CommonMap);
