import React from 'react';
import { CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis, YAxis } from 'recharts';
import styles from './styles.scss';
import LineData from './data';

interface Props{
    reportData: Element[];
}

const Preview = (props: Props) => {
    const { reportData } = props;
    const { lineData } = LineData;
    return (
        <div className={styles.previewContainer}>
            {/* {reportData.map(comp => (
                <div key={comp.name} className={styles.previewComps}>

                    {comp}
                </div>
            ))} */}

            <div className={styles.header}>
                Header
            </div>
            <div className={styles.rowOne}>
                <div className={styles.columnOneOne}>
                    Col 1 1
                </div>
                <div className={styles.columnOneTwo}>
                    Col 1 2
                </div>
            </div>
            <div className={styles.rowTwo}>
                <div className={styles.columnTwoOne}>
                    Col 2 1
                </div>
                <div className={styles.columnTwoTwo}>
                    Col 2 2
                </div>
            </div>
            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                    Col 3 1
                </div>
                <div className={styles.columnThreeTwo}>
                    Col 3 2
                </div>
            </div>
        </div>


    );
};

export default Preview;
