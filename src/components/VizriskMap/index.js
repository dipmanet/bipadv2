import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { isNotDefined } from '@togglecorp/fujs';
import { MapChildContext as MapContext } from '#re-map/context';

import MapBounds from '#re-map/MapBounds';
import MapState from '#re-map/MapSource/MapState';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';
import Button from '#rsca/Button';
import { mapSources, vizriskmapStyles } from '#constants';
import TextOutput from '#components/TextOutput';

import {
    getWardFilter,
    getMunicipalityFilter,
    getDistrictFilter,
    getProvinceFilter,
} from '#utils/domain';

import {
    // provincesSelector,
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
    regionLevelFromAppState: PropTypes.number,
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
    tooltipRenderer: PropTypes.func,
    tooltipParams: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    paint: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    mapState: PropTypes.array.isRequired,
};

const defaultProps = {
    regionLevelFromAppState: undefined,
    regionLevel: undefined,
    selectedProvinceId: undefined,
    selectedDistrictId: undefined,
    selectedMunicipalityId: undefined,
    tooltipRenderer: undefined,
    tooltipParams: undefined,
    sourceKey: 'country',
};

const mapStateToProps = (state, props) => ({
    // provinces: provincesSelector(state),
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

class VizriskMap extends React.PureComponent {
    static contextType = MapContext;

    constructor(props) {
        super(props);

        this.state = {
            feature: undefined,
            hoverLngLat: undefined,
            id: 0,
        };
    }

    static propTypes = propTypes;

    static defaultProps = defaultProps;

    getWardFilter = memoize(getWardFilter);

    getMunicipalityFilter = memoize(getMunicipalityFilter);

    getDistrictFilter = memoize(getDistrictFilter);

    getProvinceFilter = memoize(getProvinceFilter);

    // handleMouseEnter = (feature, lngLat, id) => {
    //     this.setState({
    //         feature,
    //         hoverLngLat: lngLat,
    //         id,
    //     });
    // }
    componentDidMount() {
        console.log('ourcontext', this.context);
    }

    handleMouseEnter = (e) => {
        const { id } = e;
        const hoverLngLat = e.properties.centroid;
        // const coordinates = [parseFloat(hoverLngLat.substr(31, 16)),
        // parseFloat(hoverLngLat.substr(48, 16))];

        // eslint-disable-next-line no-useless-escape
        const coordinates = Number(hoverLngLat.replace(/[^0-9\.]+/g, ''));
        console.log('coordinate', coordinates);
        this.setState({
            id,
            hoverLngLat: coordinates,
        });
    }

    handleMouseLeave = () => {
        this.setState({
            feature: undefined,
            hoverLngLat: undefined,
        });
    }

    handleLayerClick = (e) => {
        this.setState({
            id: e.id,
        });
    }

    render() {
        const {
            bounds,
            // provinces,
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
            tooltipRenderer: TooltipRenderer,
            tooltipParams,
            settlementData,
        } = this.props;
        console.log('settlement data', settlementData);
        const showProvince = isNotDefined(regionLevel) || regionLevel === 1;
        const showDistrict = [1, 2].includes(regionLevel);
        const showMunicipality = [2, 3].includes(regionLevel);
        const showWard = [3, 4].includes(regionLevel);

        const showProvinceFill = isNotDefined(regionLevel);
        const showDistrictFill = regionLevel === 1;
        const showMunicipalityFill = regionLevel === 2;
        const showWardFill = regionLevel === 3;

        const showProvinceLabel = showProvinceFill;
        const showDistrictLabel = showDistrictFill;
        const showMunicipalityLabel = showMunicipalityFill;
        const showWardLabel = showWardFill;

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
        const municipalityMapState = showMunicipalityFill ? mapState : undefined;
        const wardMapState = showWardFill ? mapState : undefined;

        const {
            ward,
            municipality,
            district,
            province,
        } = mapSources.nepal.layers;

        const {
            hoverLngLat,
            feature,
            id,
        } = this.state;

        const tooltipOptions = {
            closeOnClick: false,
            closeButton: false,
            offset: 8,
        };

        let extraParams = {};
        if (tooltipParams) {
            extraParams = tooltipParams();
        }
        return (
            <Fragment>
                <MapBounds
                    bounds={bounds}
                    padding={20}
                />
                <MapSource
                    sourceKey={`${sourceKey}-fills`}
                    sourceOptions={{
                        type: 'vector',
                        url: mapSources.nepal.url,
                    }}
                >
                    <MapLayer
                        layerKey="ward-fill"
                        onClick={this.handleMouseEnter}
                        // onMouseLeave={this.handleMouseLeave}
                        layerOptions={{
                            type: 'fill',
                            'source-layer': mapSources.nepal.layers.ward,
                            paint,
                            layout: showWardFill ? visibleLayout : noneLayout,
                            filter: wardFilter,
                        }}
                    />
                    <MapTooltip
                        coordinates={hoverLngLat}
                        tooltipOptions={tooltipOptions}
                    >
                        <Button>
                            <TextOutput
                                label="vzmap"
                                value={id}
                                isNumericValue
                            />
                        </Button>

                        {/* {this.state.hoverLngLat} */}
                    </MapTooltip>
                    <MapLayer
                        layerKey="municipality-fill"
                        onMouseEnter={this.handleMouseEnter}
                        onMouseLeave={this.handleMouseLeave}
                        layerOptions={{
                            type: 'fill',
                            'source-layer': mapSources.nepal.layers.municipality,
                            paint,
                            layout: showMunicipalityFill ? visibleLayout : noneLayout,
                            filter: municipalityFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="district-fill"
                        onMouseEnter={this.handleMouseEnter}
                        onMouseLeave={this.handleMouseLeave}
                        layerOptions={{
                            type: 'fill',
                            'source-layer': mapSources.nepal.layers.district,
                            paint,
                            layout: showDistrictFill ? visibleLayout : noneLayout,
                            filter: districtFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="province-fill"
                        layerOptions={{
                            type: 'fill',
                            'source-layer': mapSources.nepal.layers.province,
                            paint,
                            layout: showProvinceFill ? visibleLayout : noneLayout,
                            filter: provinceFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="ward-outline"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.ward,
                            type: 'line',
                            paint: vizriskmapStyles.ward.outline,
                            layout: showWard ? visibleLayout : noneLayout,
                            filter: wardFilter,
                        }}
                    />

                    <MapLayer
                        layerKey="municipality-outline"
                        onMouseEnter={this.handleMouseEnter}
                        onMouseLeave={this.handleMouseLeave}
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.municipality,
                            type: 'line',
                            paint: vizriskmapStyles.municipality.outline,
                            layout: showMunicipality ? visibleLayout : noneLayout,
                            filter: municipalityFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="district-outline"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.district,
                            type: 'line',
                            paint: vizriskmapStyles.district.outline,
                            layout: showDistrict ? visibleLayout : noneLayout,
                            filter: districtFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="province-outline"
                        layerOptions={{
                            'source-layer': mapSources.nepal.layers.province,
                            type: 'line',
                            paint: vizriskmapStyles.province.outline,
                            layout: showProvince ? visibleLayout : noneLayout,
                            filter: provinceFilter,
                        }}
                    />

                    {TooltipRenderer && hoverLngLat && (
                        <MapTooltip
                            coordinates={hoverLngLat}
                            tooltipOptions={tooltipOptions}
                            trackPointer
                        >
                            <TooltipRenderer
                                feature={feature}
                                {...extraParams}
                            />
                        </MapTooltip>
                    )}
                    {wardMapState && (
                        <MapState
                            attributes={wardMapState}
                            attributeKey="value"
                            sourceLayer={ward}
                        />
                    )}
                    {districtMapState && (
                        <MapState
                            attributes={districtMapState}
                            attributeKey="value"
                            sourceLayer={district}
                        />
                    )}
                    {municipalityMapState && (
                        <MapState
                            attributes={municipalityMapState}
                            attributeKey="value"
                            sourceLayer={municipality}
                        />
                    )}
                    {provinceMapState && (
                        <MapState
                            attributes={provinceMapState}
                            attributeKey="value"
                            sourceLayer={province}
                        />
                    )}
                </MapSource>
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
                            paint: vizriskmapStyles.provinceLabel.paint,
                            layout: showProvinceLabel
                                ? vizriskmapStyles.provinceLabel.layout : noneLayout,
                            filter: provinceFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="district-label"
                        layerOptions={{
                            'source-layer': mapSources.nepalCentroid.layers.district,
                            type: 'symbol',
                            paint: vizriskmapStyles.districtLabel.paint,
                            layout: showDistrictLabel
                                ? vizriskmapStyles.districtLabel.layout : noneLayout,
                            filter: districtFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="municipality-label"
                        layerOptions={{
                            'source-layer': mapSources.nepalCentroid.layers.municipality,
                            type: 'symbol',
                            paint: vizriskmapStyles.municipalityLabel.paint,
                            layout: showMunicipalityLabel
                                ? vizriskmapStyles.municipalityLabel.layout : noneLayout,
                            filter: municipalityFilter,
                        }}
                    />
                    <MapLayer
                        layerKey="ward-label"
                        layerOptions={{
                            'source-layer': mapSources.nepalCentroid.layers.ward,
                            type: 'symbol',
                            paint: vizriskmapStyles.wardLabel.paint,
                            layout: showWardLabel ? vizriskmapStyles.wardLabel.layout : noneLayout,
                            filter: wardFilter,
                        }}
                    />
                </MapSource>
                {/* <MapSource
                    sourceKey="settlement-source"
                    sourceOptions={{
                        type: 'geojson',
                    }}
                    geoJson={settlementData}
                >
                    <MapLayer
                        layerKey="settlement-layer"
                        onClick={this.handlesettlementClick}
                            // NOTE: to set this layer as hoverable
                        layerOptions={{
                            type: 'circle',
                            paint: vizriskmapStyles.settlementPoints.circle,
                            // paint: isHovered
                            //     ? mapStyles.firePoint.circleDim
                            //     : mapStyles.firePoint.circle,
                        }}
                        // onMouseEnter={this.handleHazardEnter}
                        // onMouseLeave={this.handleHazardLeave}
                    />
                </MapSource> */}
            </Fragment>
        );
    }
}

export default connect(mapStateToProps)(VizriskMap);
