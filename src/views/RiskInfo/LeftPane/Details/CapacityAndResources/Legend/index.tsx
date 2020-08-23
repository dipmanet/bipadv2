import React from 'react';
import Legend from '#rscz/Legend';

import styles from './styles.scss';

interface Props {
    activeLayersIndication: {
        education: boolean;
        health: boolean;
        finance: boolean;
        governance: boolean;
        tourism: boolean;
        cultural: boolean;
        industry: boolean;
        communication: boolean;
    };
}

const itemSelector = (d: { label: string }) => d.label;
const legendLabelSelector = (d: { label: string }) => d.label;
const classNameSelector = (d: { style: string }) => d.style;
const legendColorSelector = (d: { color: string }) => d.color;

const CapacityAndResourcesLegend = () => {
    const capacityAndResourcesLegendItems = [
        { color: '#ffd046', key: 'education', label: 'Education', style: styles.symbol },
        { color: '#EADAA2', key: 'health', label: 'Health', style: styles.symbol },
        { color: '#BD93BD', key: 'finance', label: 'Finance', style: styles.symbol },
        { color: '#82ddf0', key: 'governance', label: 'Governance', style: styles.symbol },
        { color: '#7dcd85', key: 'tourism', label: 'Tourism', style: styles.symbol },
        { color: '#c4b2bc', key: 'cultural', label: 'Cultural', style: styles.symbol },
        { color: '#a6a867', key: 'industry', label: 'Industry', style: styles.symbol },
        { color: '#efa8b8', key: 'communication', label: 'Communication', style: styles.symbol },
    ];
    // for dynamic legend render
    // const getActiveLegends = () => {
    //     const { activeLayersIndication } = props;
    //     const activeLegends = capacityAndResourcesLegendItems.filter((item) => {
    //         if (activeLayersIndication[item.key]) {
    //             return item;
    //         }
    //     });
    //     return activeLegends;
    // };
    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>Capacity and Resources Legends</div>
            <Legend
                className={styles.legend}
                data={capacityAndResourcesLegendItems}
                itemClassName={styles.legendItem}
                keySelector={itemSelector}
            // iconSelector={iconSelector}
                labelSelector={legendLabelSelector}
                symbolClassNameSelector={classNameSelector}
                colorSelector={legendColorSelector}
                emptyComponent={null}
            />
        </div>
    );
};

export default CapacityAndResourcesLegend;
