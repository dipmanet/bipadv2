import React from 'react';
import { ArchivePollution } from '../types';

import NoData from '../NoData';
import styles from './styles.scss';

interface Props {
    stationData: ArchivePollution[];
}
const Graph = (props: Props) => {
    const { stationData } = props;
    if (stationData.length === 0) {
        return (
            <NoData />
        );
    }

    return (
        <div className={styles.graph}>
            <p> Graph </p>
        </div>
    );
};

export default Graph;
