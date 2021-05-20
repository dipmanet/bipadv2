import React, { useState } from 'react';
import { connect } from 'react-redux';
import { FaramInputElement } from '@togglecorp/faram';
import SelectInput from '#rsci/SelectInput';
import { dataArchiveRainListSelector, rainStationsSelector } from '#selectors';
import styles from './styles.scss';

import { RainStation } from '#types';

interface Props {
    onChange: Function;
    value: string[];
    stations: RainStation[];
}

const BasinKeySelector = (r: sampleBasinData) => r.title;
const BasinLabelSelector = (r: sampleBasinData) => r.title;

const mapStateToProps = (state: AppState) => ({
    rainStations: dataArchiveRainListSelector(state),
    basinStations: rainStationsSelector(state),
});

const BasinSelector = (props: Props) => {
    const { onChange: onChangeFromProps,
        stations: stationsFromProps,
        rainStations,
        basinStations } = props;

    const [selectedBasin, setSelectedBasin] = useState();

    const handleBasinChange = (basinName: string) => {
        setSelectedBasin(basinName);
        onChangeFromProps(basinName || {});
        console.log(basinName);
    };
    const uniqueBasins = [...new Set(basinStations.map(item => item.basin))];

    const sampleBasinData = uniqueBasins.map((item, i) => ({
        id: i + 1,
        title: item,
    }));

    return (
        <div className={styles.basinSelector}>
            <SelectInput
                className={styles.basinInput}
                label="Basin Name"
                options={sampleBasinData}
                keySelector={BasinKeySelector}
                labelSelector={BasinLabelSelector}
                value={selectedBasin}
                onChange={handleBasinChange}
                placeholder="All Basins"
                autoFocus
            />
        </div>
    );
};

export default connect(mapStateToProps, undefined)(FaramInputElement(BasinSelector));
