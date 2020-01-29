import React, { useContext } from 'react';

import {
    getRasterTile,
    // getRasterLegendURL,
} from '#utils/domain';

import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapState from '#re-map/MapSource/MapState';

import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import { mapSources } from '#constants';

import CommonMap from '#components/CommonMap';

interface Props {
}

const sourceLayerByAdminLevel = {
    municipality: mapSources.nepal.layers.municipality,
    district: mapSources.nepal.layers.district,
};

const RiskInfoMap = (props: Props) => {
    const { activeLayers } = useContext(RiskInfoLayerContext);

    const rasterLayers = activeLayers.filter(d => d.type === 'raster');
    const choroplethLayers = activeLayers.filter(d => d.type === 'choropleth');

    return (
        <>
            <CommonMap />
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
                        layerKey="choropleth-layer"
                        layerOptions={{
                            type: 'fill',
                            'source-layer': sourceLayerByAdminLevel[layer.adminLevel],
                            paint: {
                                ...layer.paint,
                                'fill-opacity': layer.opacity,
                            },
                        }}
                    />
                    <MapState
                        attributes={layer.mapState}
                        attributeKey="value"
                        sourceLayer={sourceLayerByAdminLevel[layer.adminLevel]}
                    />
                </MapSource>
            ))}
        </>
    );
};

export default RiskInfoMap;
