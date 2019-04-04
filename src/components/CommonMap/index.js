import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

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
        return (
            <Fragment>
                <MapSource
                    sourceKey={`${sourceKey}-province`}
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
                    sourceKey={`${sourceKey}-district`}
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
                    sourceKey={`${sourceKey}-municipality`}
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
                        layout={regionLevel >= 0 ? visibleLayout : noneLayout}
                    />
                    <MapLayer
                        layerKey="district-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={mapStyles.district.outline}
                        // NOTE: dont' show district in province level
                        layout={regionLevel >= 2 ? visibleLayout : noneLayout}
                    />
                </MapSource>
                <MapSource
                    sourceKey="province-label-source"
                    geoJson={provinceLabels}
                >
                    <MapLayer
                        layerKey="province-label"
                        type="symbol"
                        property="adminLevelId"
                        paint={mapStyles.provinceLabel.paint}
                        layout={regionLevel === 1 ? mapStyles.provinceLabel.layout : noneLayout}
                    />
                </MapSource>
                <MapSource
                    sourceKey="district-label-source"
                    geoJson={districtLabels}
                >
                    <MapLayer
                        layerKey="distrcit-label"
                        type="symbol"
                        property="adminLevelId"
                        paint={mapStyles.districtLabel.paint}
                        layout={regionLevel === 2 ? mapStyles.districtLabel.layout : noneLayout}
                    />
                </MapSource>
                <MapSource
                    sourceKey="municipality-label-source"
                    geoJson={municipalityLabels}
                >
                    <MapLayer
                        layerKey="municipality-label"
                        type="symbol"
                        property="adminLevelId"
                        paint={mapStyles.municipalityLabel.paint}
                        layout={regionLevel === 3 ? mapStyles.municipalityLabel.layout : noneLayout}
                    />
                </MapSource>
                <MapSource
                    sourceKey="ward-label-source"
                    geoJson={wardLabels}
                >
                    <MapLayer
                        layerKey="ward-label"
                        type="symbol"
                        property="adminLevelId"
                        paint={mapStyles.wardLabel.paint}
                        layout={regionLevel === 4 ? mapStyles.wardLabel.layout : noneLayout}
                    />
                </MapSource>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps)(CommonMap);
