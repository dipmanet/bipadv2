import React, { useState } from 'react';
import { FaramInputElement } from '@togglecorp/faram';
import SelectInput from '#rsci/SelectInput';

import styles from './styles.scss';

import { RiverStation } from '#types';

interface Props {
    onChange: Function;
    value: string[];
    stations: RiverStation[];
}

const stationKeySelector = (r: RiverStation) => r.id;
const StationLabelSelector = (r: RiverStation) => r.title;

const compare = (a: RiverStation, b: RiverStation) => {
    const sortKey = 'title';
    if (a[sortKey] < b[sortKey]) {
        return -1;
    }
    if (a[sortKey] > b[sortKey]) {
        return 1;
    }
    return 0;
};

const StationSelector = (props: Props) => {
    const { onChange: onChangeFromProps, stations: stationsFromProps, value: { id } } = props;
    const [selectedStation, setSelectedStation] = useState(id);
    const handleStationChange = (stationId: number) => {
        setSelectedStation(stationId);
        const station = stationsFromProps.filter(s => s.id === stationId)[0];
        onChangeFromProps(station || {});
    };
    const sortedStations = stationsFromProps.sort(compare);
    if (!sortedStations || sortedStations.length < 1) {
        return (
            <div className={styles.stationSelector}>
                <span className={styles.stationInput}>
                    No station filters
                </span>
            </div>
        );
    }
    return (
        <div className={styles.stationSelector}>
            <SelectInput
                className={styles.stationInput}
                label="Station Name"
                options={sortedStations}
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
