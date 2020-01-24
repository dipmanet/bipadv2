import React from 'react';

import Numeral from '#rscv/Numeral';
import HorizontalBar from '#rscz/HorizontalBar';
import styles from './styles.scss';

const genderBreakdown = {
    title: 'Gender Breakdown',
    data: [
        {
            label: 'female',
            value: 49.9,
        },
        {
            label: 'male',
            value: 50.1,
        },
    ],
};

const populationByAge = {
    title: 'Population by Age Group',
    data: [
        {
            label: '0-19',
            value: 34.9,
        },
        {
            label: '20-39',
            value: 35.9,
        },
        {
            label: '40-59',
            value: 19.6,
        },
        {
            label: '60-79',
            value: 8.3,
        },
        {
            label: '80+',
            value: 1.2,
        },
    ],
};
const barColorSelector = [

];

class Demographics extends React.PureComponent {
    render() {
        return (
            <div className={styles.mainContainer}>
                <div className={styles.dataBlock}>
                    <div className={styles.left}>
                        <div className={styles.title}>
                            Population
                        </div>
                        <Numeral
                            className={styles.value}
                            value={45352}
                            precision={0}
                        />
                    </div>
                    <div className={styles.right}>
                        <div className={styles.title}>
                            {genderBreakdown.title}
                        </div>
                        <HorizontalBar
                            className={styles.bar}
                            data={genderBreakdown.data}
                            valueSelector={d => d.value}
                            labelSelector={d => d.label}
                            colorScheme={['#d3d3d3']}
                            showTooltip
                        />
                    </div>
                </div>

                <div className={styles.dataBlock}>
                    <div className={styles.left}>
                        <div className={styles.title}>
                            Median Age
                        </div>
                        <Numeral
                            className={styles.value}
                            value={26}
                            precision={0}
                        />
                    </div>
                    <div className={styles.right}>
                        <div className={styles.title}>
                            {populationByAge.title}
                        </div>
                        <HorizontalBar
                            className={styles.bar}
                            data={populationByAge.data}
                            valueSelector={d => d.value}
                            labelSelector={d => d.label}
                            colorScheme={['#d3d3d3']}
                            showTooltip
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default Demographics;
