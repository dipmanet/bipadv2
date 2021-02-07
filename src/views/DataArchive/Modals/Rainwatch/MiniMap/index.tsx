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
    rainFeatureCollection: any;
}

const MiniMap = (props: Props) => {
    const { mapStyle, coordinates, geoarea, rainFeatureCollection } = props;
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
                sourceKey="real-time-rain-points"
                geoJson={rainFeatureCollection}
                sourceOptions={{ type: 'geojson' }}
                supportHover
            >
                <React.Fragment>
                    <MapLayer
                        layerKey="real-time-rain-circle"
                        layerOptions={{
                            type: 'circle',
                            // paint: mapStyles.rainPoint.paint,
                            paint: mapStyles.rainPoint.circle,
                        }}
                    />
                </React.Fragment>
            </MapSource>
        </Map>
    );
};

export default MiniMap;
