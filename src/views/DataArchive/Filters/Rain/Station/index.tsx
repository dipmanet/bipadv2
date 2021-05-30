import React, { useState, useEffect } from 'react';
import { FaramInputElement } from '@togglecorp/faram';
import { connect } from 'react-redux';
import { useEventCallback } from '@material-ui/core';
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

    const [stationsFromProps, setStationsFromProps] = useState(mystationsFromProps);
    // stationsFromProps = mystationsFromProps;

    useEffect(() => {
        if (typeof rainFilters.basin !== 'object') {
            setStationsFromProps(mystationsFromProps.filter(s => s.basin === rainFilters.basin));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rainFilters.basin]);

    const [selectedStation, setSelectedStation] = useState(id);

    // if (typeof rainFilters.basin !== 'object') {
    //     stationsFromProps = mystationsFromProps.filter(s => s.basin === rainFilters.basin);
    // } else {
    //     stationsFromProps = mystationsFromProps;
    // }

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

export default connect(mapStateToProps, [])(FaramInputElement(StationSelector));
