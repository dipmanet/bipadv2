/* eslint-disable max-len */
import React from 'react';

import { getRasterTile, getBuildingFootprint } from '#utils/domain';

import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapState from '#re-map/MapSource/MapState';
import MapTooltip from '#re-map/MapTooltip';

import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import { mapSources, mapStyles } from '#constants';

import CommonMap from '#components/CommonMap';

interface Props {
}

interface State {
    feature: any;
    hoverLngLat: any;
}

const sourceLayerByAdminLevel = {
    municipality: mapSources.nepal.layers.municipality,
    district: mapSources.nepal.layers.district,
    ward: mapSources.nepal.layers.ward,
};

const linePaintByAdminLevel = {
    municipality: mapStyles.municipality.choroplethOutline,
    district: mapStyles.district.choroplethOutline,
    ward: mapStyles.ward.choroplethOutline,
};

const tooltipOptions = {
    closeOnClick: false,
    closeButton: false,
    offset: 8,
};

class RiskInfoMap extends React.PureComponent<Props, State> {
    public state = {
        feature: undefined,
        hoverLngLat: undefined,
    }

    private handleMouseEnter = (feature, lngLat) => {
        this.setState({
            feature,
            hoverLngLat: lngLat,
        });
    }

    private handleMouseLeave = () => {
        this.setState({
            feature: undefined,
            hoverLngLat: undefined,
        });
    }

    public render() {
        const { activeLayers } = this.context;
        const {
            feature,
            hoverLngLat,
        } = this.state;

        const rasterLayers = activeLayers.filter(d => d.type === 'raster');
        const choroplethLayers = activeLayers.filter(d => d.type === 'choropleth');
        console.log('this is map', choroplethLayers);
        return (
            <>
                <CommonMap
                    sourceKey="risk-infoz"
                />
                { rasterLayers.map(layer => (
                    <MapSource
                        key={layer.id}
                        sourceKey={layer.layername}
                        sourceOptions={{
                            type: 'raster',
                            tiles: [getRasterTile(layer)],
                            tileSize: 256,
                        }}
                    >
                        <MapLayer
                            layerKey="raster-layer"
                            layerOptions={{
                                type: 'raster',
                                paint: {
                                    'raster-opacity': layer.opacity,
                                },
                            }}
                        />
                    </MapSource>
                ))}

                {/* <MapSource
                    key={'buildingKey'}
                    sourceKey={'buildingFootprint'}
                    sourceOptions={{
                        type: 'raster',
                        tiles: [getBuildingFootprint()],
                        tileSize: 256,
                    }}
                >
                    <MapLayer
                        layerKey="raster-layer"
                        layerOptions={{
                            type: 'raster',
                            paint: {
                                'raster-opacity': 1,
                            },
                        }}
                    />
                </MapSource> */}

                { choroplethLayers.map(layer => (
                    <MapSource
                        key={layer.id}
                        sourceKey={layer.layername}
                        sourceOptions={{
                            type: 'vector',
                            url: mapSources.nepal.url,
                        }}
                    >


                        <MapLayer
                            layerKey="choropleth-layer-outline"
                            layerOptions={{
                                'source-layer': sourceLayerByAdminLevel[layer.adminLevel],
                                type: 'line',
                                paint: linePaintByAdminLevel.municipality,
                            }}
                        />


                        <MapLayer
                            layerKey="choropleth-layer"
                            layerOptions={{
                                type: 'fill',
                                'source-layer': sourceLayerByAdminLevel[layer.adminLevel],
                                paint: {
                                    ...layer.paint,
                                    'fill-opacity': layer.paint['fill-opacity'].map(
                                        val => (typeof val === 'number' ? val * layer.opacity : val),
                                    ),
                                },
                            }}
                            onClick={layer.onClick ? layer.onClick : undefined}
                            onMouseEnter={layer.tooltipRenderer ? this.handleMouseEnter : undefined}
                            onMouseLeave={layer.tooltipRenderer ? this.handleMouseLeave : undefined}
                        />

                        <MapState
                            attributes={layer.mapState}
                            attributeKey="value"
                            sourceLayer={sourceLayerByAdminLevel[layer.adminLevel]}
                        />
                        { layer.tooltipRenderer
                            && hoverLngLat
                            && feature
                            && (feature.source === layer.layername)
                            && (
                                <MapTooltip
                                    coordinates={hoverLngLat}
                                    trackPointer
                                    tooltipOptions={tooltipOptions}
                                >
                                    <layer.tooltipRenderer
                                        feature={feature}
                                        layer={layer}
                                    />
                                </MapTooltip>
                            )
                        }
                    </MapSource>
                ))}
            </>
        );
    }
}

RiskInfoMap.contextType = RiskInfoLayerContext;
export default RiskInfoMap;
