import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import MapSource from '#rscz/Map/MapSource';
import MapLayer from '#rscz/Map/MapLayer';

import { mapSources, mapStyles } from '#constants';

import {
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

    render() {
        const {
            boundsPadding,
            regionLevel,
            bounds,
            selectedProvinceId,
            selectedDistrictId,
            selectedMunicipalityId,
            sourceKey,
        } = this.props;

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
                    <MapLayer
                        layerKey="municipality-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.municipality}
                        paint={mapStyles.municipality.outline}
                        layout={regionLevel >= 2 ? visibleLayout : noneLayout}
                    />
                    <MapLayer
                        layerKey="ward-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.ward}
                        paint={mapStyles.ward.outline}
                        layout={regionLevel >= 3 ? visibleLayout : noneLayout}
                    />
                </MapSource>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps)(CommonMap);
