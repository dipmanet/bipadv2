import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { isNotDefined } from '@togglecorp/fujs';

import MapSource from '#rscz/Map/MapSource';
import MapLayer from '#rscz/Map/MapLayer';

import { mapSources, mapStyles } from '#constants';

import {
    regionLevelSelector,
    boundsSelector,
} from '#selectors';

const propTypes = {
    boundsPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    // eslint-disable-next-line react/forbid-prop-types
    bounds: PropTypes.array.isRequired,
    sourceKey: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    mapState: PropTypes.array,
    regionLevel: PropTypes.number,
};

const defaultProps = {
    boundsPadding: undefined,
    sourceKey: 'country',
    mapState: undefined,
    regionLevel: undefined,
};

const mapStateToProps = state => ({
    regionLevel: regionLevelSelector(state),
    bounds: boundsSelector(state),
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

    render() {
        const {
            regionLevel,

            boundsPadding,
            bounds,
            sourceKey,

            mapState,
            paint,
        } = this.props;

        const showProvince = isNotDefined(regionLevel) || regionLevel >= 0;
        const showDistrict = regionLevel >= 1;
        const showMunicipality = regionLevel >= 2;
        const showWard = regionLevel >= 3;

        const showProvinceFill = isNotDefined(regionLevel) || regionLevel === 0;
        const showDistrictFill = regionLevel === 1;
        const showMunicipalityFill = regionLevel === 2;
        const showWardFill = regionLevel === 3;

        const provinceMapState = showProvinceFill ? mapState : undefined;
        const districtMapState = showDistrictFill ? mapState : undefined;
        const municipalityWardState = showMunicipalityFill ? mapState : undefined;
        const wardMapState = showWardFill ? mapState : undefined;

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
                    />
                </MapSource>

                <MapSource
                    sourceKey={`${sourceKey}-outline`}
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
                    />
                    <MapLayer
                        layerKey="municipality-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.municipality}
                        paint={mapStyles.municipality.choroplethOutline}
                        layout={showMunicipality ? visibleLayout : noneLayout}
                    />
                    <MapLayer
                        layerKey="district-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={mapStyles.district.choroplethOutline}
                        layout={showDistrict ? visibleLayout : noneLayout}
                    />
                    <MapLayer
                        layerKey="province-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.province}
                        paint={mapStyles.province.choroplethOutline}
                        layout={showProvince ? visibleLayout : noneLayout}
                    />
                </MapSource>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps)(ChoroplethMap);
