import React, { useState } from 'react';
import { FaramInputElement } from '@togglecorp/faram';
import SelectInput from '#rsci/SelectInput';

import styles from './styles.scss';

import { RegionElement } from '#types';
import stations from './stations';

interface StationElement {
    id: number;
    title: string;
    code?: string;
    bbox: number[];
    centroid: {
        type: string;
        coordinates: number[];
    };
}

interface Props {}

const stationOptions: StationElement[] = stations;
const stationKeySelector = (r: RegionElement) => r.id;
const StationLabelSelector = (r: RegionElement) => r.title;

const StationSelector = (props: Props) => {
    console.log('Station Selector');
    const [selectedStation, setSelectedStation] = useState(0);

    const handleStationChange = (stationId: number) => {
        setSelectedStation(stationId);
    };
    console.log('Selected Station: ', selectedStation);
    return (
        <div className={styles.stationSelector}>
            <SelectInput
                className={styles.stationInput}
                label="Station Name"
                options={stationOptions}
                keySelector={stationKeySelector}
                labelSelector={StationLabelSelector}
                value={selectedStation}
                onChange={handleStationChange}
                placeholder="All Stations"
                autoFocus
            />
        </div>
    );
};

export default FaramInputElement(StationSelector);
