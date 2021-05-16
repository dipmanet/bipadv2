import React, { useState } from 'react';
import { connect } from 'react-redux';
import { FaramInputElement } from '@togglecorp/faram';
import SelectInput from '#rsci/SelectInput';
import { dataArchiveRainListSelector } from '#selectors';
import styles from './styles.scss';

import { RainStation } from '#types';

interface Props {
    onChange: Function;
    value: string[];
    stations: RainStation[];
}

const stationKeySelector = (r: RainStation) => r.id;
const StationLabelSelector = (r: RainStation) => r.title;

const mapStateToProps = (state: AppState) => ({
    rainStations: dataArchiveRainListSelector(state),
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

const BasinSelector = (props: Props) => {
    console.log('basin station: ', props);
    const { onChange: onChangeFromProps,
        stations: stationsFromProps,
        // value: { id } ,
        rainStations } = props;

    const id = 1;
    const [selectedStation, setSelectedStation] = useState(id);


    const sortedStations = stationsFromProps.sort(compare);

    const handleStationChange = (stationId: number) => {
        setSelectedStation(stationId);
        console.log('handle ma ke aauch:', stationId);
        // const station = stationsFromProps.filter(s => s.id === stationId)[0];
        const station = stationsFromProps[0];
        console.log('handle ma ke aauch:', station);

        onChangeFromProps(station || {});

        console.log('sorted rain', rainStations);
        console.log('key selector rain', stationKeySelector);
        console.log('key label rain', StationLabelSelector);
    };

    const uniqueBasins = [...new Set(rainStations.map(item => item.basin))];

    const sampleBasinData = uniqueBasins.map((item, i) => ({
        id: i + 1,
        title: item,
    }));
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
        <div className={styles.basinSelector}>
            <SelectInput
                className={styles.basinInput}
                label="Station Name"
                options={sampleBasinData}
                keySelector={stationKeySelector}
                labelSelector={StationLabelSelector}
                value={selectedStation}
                onChange={handleStationChange}
                placeholder="All Basins"
                autoFocus
            />
        </div>
    );
};


export default connect(mapStateToProps, undefined)(FaramInputElement(BasinSelector));
