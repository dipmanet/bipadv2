import React, { useState } from 'react';
import { FaramInputElement } from '@togglecorp/faram';
import { connect } from 'react-redux';
import SelectInput from '#rsci/SelectInput';

import styles from './styles.scss';

import { RainStation } from '#types';
import { rainFiltersSelector } from '#selectors';

interface Props {
    onChange: Function;
    value: string[];
    stations: RainStation[];
}

const stationKeySelector = (r: RainStation) => r.id;
const StationLabelSelector = (r: RainStation) => r.title;

const mapStateToProps = state => ({
    rainFilters: rainFiltersSelector(state),
});


const compare = (a: RainStation, b: RainStation) => {
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
    const { onChange: onChangeFromProps,
        stations: mystationsFromProps,
        rainFilters,
        value: { id } } = props;

    const [selectedStation, setSelectedStation] = useState(id);

    const handleStationChange = (stationId: number) => {
        setSelectedStation(stationId);
        const station = mystationsFromProps.filter(s => s.id === stationId)[0];
        onChangeFromProps(station || {});
    };
    const sortedStations = mystationsFromProps.sort(compare);
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

export default connect(mapStateToProps, [])(FaramInputElement(StationSelector));
