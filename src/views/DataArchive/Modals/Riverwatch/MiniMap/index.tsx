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
    riverFeatureCollection: any;
}

const MiniMap = (props: Props) => {
    const { mapStyle, coordinates, geoarea, riverFeatureCollection } = props;
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
                sourceKey="real-time-river-points"
                geoJson={riverFeatureCollection}
                sourceOptions={{ type: 'geojson' }}
                supportHover
            >
                <React.Fragment>
                    <MapLayer
                        layerKey="real-time-river-custom"
                        layerOptions={{
                            type: 'symbol',
                            layout: mapStyles.riverPoint.layout,
                            paint: mapStyles.riverPoint.text,
                        }}
                    />
                </React.Fragment>
            </MapSource>
        </Map>
    );
};

export default MiniMap;
