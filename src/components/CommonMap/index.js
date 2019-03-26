import PropTypes from 'prop-types';
import React from 'react';
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
            <MapSource
                sourceKey={sourceKey}
                url={mapSources.nepal.url}
                bounds={bounds}
                boundsPadding={boundsPadding}
            >
                { regionLevel === 1 &&
                    <MapLayer
                        layerKey="province-fill"
                        type="fill"
                        sourceLayer={mapSources.nepal.layers.province}
                        paint={mapStyles.province.fill}
                        hoveredId={selectedProvinceId}
                    />
                }
                { regionLevel === 2 &&
                    <MapLayer
                        layerKey="district-fill"
                        type="fill"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={mapStyles.district.fill}
                        hoveredId={selectedDistrictId}
                    />
                }
                { regionLevel === 3 &&
                    <MapLayer
                        layerKey="municipality-fill"
                        type="fill"
                        sourceLayer={mapSources.nepal.layers.municipality}
                        paint={mapStyles.municipality.fill}
                        hoveredId={selectedMunicipalityId}
                    />
                }
                { regionLevel >= 0 &&
                    <MapLayer
                        layerKey="province-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.province}
                        paint={mapStyles.province.outline}
                    />
                }
                { regionLevel >= 2 && // NOTE: dont' show district in province level
                    <MapLayer
                        layerKey="district-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={mapStyles.district.outline}
                    />
                }
                { regionLevel >= 2 &&
                    <MapLayer
                        layerKey="municipality-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.municipality}
                        paint={mapStyles.municipality.outline}
                    />
                }
                { regionLevel >= 3 &&
                    <MapLayer
                        layerKey="ward-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.ward}
                        paint={mapStyles.ward.outline}
                    />
                }
            </MapSource>
        );
    }
}

export default connect(mapStateToProps)(CommonMap);
