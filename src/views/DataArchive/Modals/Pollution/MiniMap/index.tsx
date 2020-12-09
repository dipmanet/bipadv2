import React from 'react';

import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';
import CommonMap from '#components/CommonMap';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import {
    mapStyles,
} from '#constants';

import styles from './styles.scss';

interface Props {
    mapStyle: string;
    coordinates: [number, number];
    geoarea: number;
    pollutionFeatureCollection: any;
}

const MiniMap = (props: Props) => {
    const { mapStyle, coordinates, geoarea, pollutionFeatureCollection } = props;
    const region = { adminLevel: 3, geoarea: geoarea || undefined };
    return (
        <Map
            mapStyle={mapStyle}
            mapOptions={{
                logoPosition: 'top-left',
                minZoom: 5,
                // center: coordinates,
            }}
        // debug
            scaleControlShown
            scaleControlPosition="bottom-right"

            navControlShown
            navControlPosition="bottom-right"
        >
            <MapContainer className={styles.map1} />
            <CommonMap
                sourceKey="comparative-first"
                region={geoarea ? region : undefined}
                debug
            />
            <MapSource
                sourceKey="real-time-pollution-points"
                geoJson={pollutionFeatureCollection}
                sourceOptions={{ type: 'geojson' }}
                supportHover
            >
                <React.Fragment>
                    <MapLayer
                        layerKey="real-time-pollution-points-fill"
                        layerOptions={{
                            type: 'circle',
                            property: 'pollutionId',
                            paint: { ...mapStyles.pollutionPoint.fill,
                                'circle-stroke-color': '#000000',
                                'circle-stroke-width': 2 },
                        }}
                    />
                    <MapLayer
                        layerKey="real-time-pollution-text"
                        layerOptions={{
                            type: 'symbol',
                            property: 'pollutionId',
                            layout: mapStyles.archivePollutionText.layout,
                            paint: mapStyles.archivePollutionText.paint,
                        }}
                    />
                </React.Fragment>
            </MapSource>
        </Map>
    );
};

export default MiniMap;
