import React from 'react';

import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';
import CommonMap from '#components/CommonMap';

import styles from './styles.scss';

interface Props {
    mapStyle: string;
    coordinates: [number, number];
}

const MiniMap = (props: Props) => {
    console.log('Mini Map');
    const { mapStyle, coordinates } = props;
    return (
        <Map
            mapStyle={mapStyle}
            mapOptions={{
                logoPosition: 'top-left',
                minZoom: 8,
                center: coordinates,
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
                // region={faramValues.region1}
                debug
            />
        </Map>
    );
};

export default MiniMap;
