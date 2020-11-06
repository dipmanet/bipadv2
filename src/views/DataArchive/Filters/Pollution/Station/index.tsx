import React, { useState } from 'react';
import { FaramInputElement } from '@togglecorp/faram';
import SelectInput from '#rsci/SelectInput';

import styles from './styles.scss';

import { PollutionStation } from '#types';

interface Props {
    onChange: Function;
    value: string[];
    stations: PollutionStation[];
}

const stationKeySelector = (r: PollutionStation) => r.id;
const StationLabelSelector = (r: PollutionStation) => r.name;

const StationSelector = (props: Props) => {
    const { onChange: onChangeFromProps, stations: stationsFromProps } = props;
    const [selectedStation, setSelectedStation] = useState(0);
    const handleStationChange = (stationId: number) => {
        setSelectedStation(stationId);
        const station = stationsFromProps.filter(s => s.id === stationId)[0];
        onChangeFromProps(station || {});
    };
    return (
        <div className={styles.stationSelector}>
            <SelectInput
                className={styles.stationInput}
                label="Station Name"
                options={stationsFromProps}
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
