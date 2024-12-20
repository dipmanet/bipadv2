import React, { useState } from 'react';
import { connect } from 'react-redux';
import { FaramInputElement } from '@togglecorp/faram';
import SelectInput from '#rsci/SelectInput';
import { riverStationsSelector } from '#selectors';
import { RiverStation } from '#types';
import styles from './styles.scss';


interface Props {
    onChange: Function;
    value: string[];
    stations: RiverStation[];
}

const basinKeySelector = (r: BasinData) => r.id;
const BasinLabelSelector = (r: BasinData) => r.title;

const basinData = [
    { id: '1', title: 'Babai' },
    { id: '2', title: 'Bagmati' },
    { id: '3', title: 'Kankai' },
    { id: '4', title: 'Karnali' },
    { id: '5', title: 'Koshi' },
    { id: '6', title: 'Mahakali' },
    { id: '7', title: 'Narayani' },
    { id: '8', title: 'West Rapti' },
];

const mapStateToProps = (state: AppState) => ({
    riverStations: riverStationsSelector(state),
});

const BasinSelector = (props: Props) => {
    const { onChange: onChangeFromProps,
        value } = props;

    const [selectedBasin, setSelectedBasin] = useState(value
        && Object.keys(value).length > 0 && value.id);

    const handleBasinChange = (basinId: number) => {
        setSelectedBasin(basinId);
        const basin = basinData.filter(s => s.id === basinId)[0];
        onChangeFromProps(basin || {});
    };

    return (
        <div className={styles.basinSelector}>
            <SelectInput
                className={styles.basinInput}
                label="Basin Name"
                options={basinData}
                keySelector={basinKeySelector}
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
