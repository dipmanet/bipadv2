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

interface Props {
    onChange: Function;
    value: string[];
}

const stationOptions: StationElement[] = stations;
const stationKeySelector = (r: RegionElement) => r.id;
const StationLabelSelector = (r: RegionElement) => r.title;

const StationSelector = (props: Props) => {
    const { onChange: onChangeFromProps } = props;
    const [selectedStation, setSelectedStation] = useState(0);

    const handleStationChange = (stationId: number) => {
        setSelectedStation(stationId);
        const station = stations.filter(s => s.id === stationId)[0];
        onChangeFromProps(station);
    };
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
