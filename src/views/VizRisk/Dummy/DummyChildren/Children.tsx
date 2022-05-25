import React, { useContext, useEffect } from 'react';
import { getCommonRasterLayer } from '#views/VizRisk/Butwal/MultiHazardMap/utils';
import { RatnaNagarMapContext } from '../../RatnaNagar/context';


export default function DummyChildren() {
    const { map } = useContext(RatnaNagarMapContext);

    useEffect(() => {
        if (map) {
            map.on('style.load', () => {
                console.log('we are running');
                map.addSource('floodInundation', {
                    type: 'raster',
                    tiles: [getCommonRasterLayer('wfp_ratnanagar_2017')],
                    tileSize: 256,
                });

                map.addLayer(
                    {
                        id: 'inundationLayer',
                        type: 'raster',
                        source: 'floodInundation',
                        layout: {
                            visibility: 'visible',
                        },
                        paint: {
                            'raster-opacity': 1,
                        },
                    },

                );
            });
        }
    }, [map]);

    // console.log('map', map);

    return (
        <>
            <h1>Hello</h1>
        </>
    );
}
