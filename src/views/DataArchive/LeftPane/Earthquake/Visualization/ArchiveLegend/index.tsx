import React from 'react';

// import { legendData } from '../constants';
import styles from './styles.scss';

interface LegendData {
    id: number;
    label: string;
    fill: string;
}

interface Props {
    legendData: LegendData[];
}
const ArchiveLegend = (props: Props) => {
    const { legendData } = props;
    return (
        <div className={styles.archiveLegend}>
            {
                legendData.map((legendItem) => {
                    const { id, label, fill } = legendItem;
                    return (
                        <div key={id} className={styles.legendItem}>
                            <span className={styles.text}>{label}</span>
                            <div
                                className={styles.icon}
                                style={{ backgroundColor: fill }}
                            />
                        </div>
                    );
                })
            }
        </div>
    );
};

export default ArchiveLegend;
