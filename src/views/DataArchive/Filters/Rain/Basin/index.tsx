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

const basinKeySelector = (r: BasinData) => r.id;
const BasinLabelSelector = (r: BasinData) => r.title;

const basinData = [
    { id: '1', title: 'Babai' },
    { id: '2', title: 'Babai (Sarada)' },
    { id: '3', title: 'Bagmati' },
    { id: '4', title: 'Banganga' },
    { id: '5', title: 'Biring' },
    { id: '6', title: 'Churiya' },
    { id: '7', title: 'Gandaki' },
    { id: '8', title: 'Kamala' },
    { id: '9', title: 'Kankai' },
    { id: '10', title: 'Karnali' },
    { id: '11', title: 'Karnali (Thuligad)' },
    { id: '12', title: 'Koshi' },
    { id: '13', title: 'Koshi/Churiya' },
    { id: '14', title: 'Lalbakaiya' },
    { id: '15', title: 'Mahakali' },
    { id: '16', title: 'Mahakali (Rangoon-Puntura)' },
    { id: '17', title: 'Mahakali Basin' },
    { id: '18', title: 'Mahakali-Rangoon' },
    { id: '19', title: 'Mohana' },
    { id: '20', title: 'Narayani' },
    { id: '21', title: 'Nayarani' },
    { id: '22', title: 'Tinau' },
    { id: '23', title: 'West Rapti' },
    { id: '24', title: 'West rapti' },
];
const mapStateToProps = (state: AppState) => ({
    rainStations: dataArchiveRainListSelector(state),
});

const BasinSelector = (props: Props) => {
    const { onChange: onChangeFromProps,
        value: { id } } = props;

    const [selectedBasin, setSelectedBasin] = useState(id);

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
