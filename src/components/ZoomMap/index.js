import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import MapSource from '#rscz/Map/MapSource';
import MapLayer from '#rscz/Map/MapLayer';

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
                <MapSource
                    sourceKey={sourceKey}
                    url={mapSources.nepal.url}
                    bounds={bounds}
                    boundsPadding={boundsPadding}
                >
                    <MapLayer
                        layerKey="ward-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.ward}
                        paint={mapStyles.ward.outline}
                        minzoom={9}
                    />
                    <MapLayer
                        layerKey="municipality-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.municipality}
                        paint={mapStyles.municipality.outline}
                        minzoom={8}
                    />
                    <MapLayer
                        layerKey="district-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={mapStyles.district.outline}
                        minzoom={6}
                    />
                    <MapLayer
                        layerKey="province-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.province}
                        paint={mapStyles.province.outline}
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
                        layout={mapStyles.wardLabel.layout}
                        minzoom={9}
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
                        layout={mapStyles.municipalityLabel.layout}
                        minzoom={8}
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
                        layout={mapStyles.districtLabel.layout}
                        minzoom={6}
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
                        layout={mapStyles.provinceLabel.layout}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(ZoomMap);
