import React, { useContext } from 'react';
import { _cs } from '@togglecorp/fujs';
import Legend from '#rscz/Legend';
import legendItems from './legendItems';

import { TitleContext, Profile } from '#components/TitleContext';

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

const CapacityAndResourcesLegend = (props: Props) => {
    const titleContext = useContext(TitleContext);
    // for dynamic legend render
    const getActiveLegends = () => {
        const { activeLayersIndication } = props;
        const activeLegends = legendItems.filter((item) => {
            if (activeLayersIndication[item.key]) {
                return item;
            }
            return null;
        });
        return activeLegends;
    };
    const activeLegends = getActiveLegends();

    const { setCapacityAndResources } = titleContext;

    if (activeLegends.length === 0) {
        if (setCapacityAndResources) {
            setCapacityAndResources('');
        }
        return null;
    }


    if (activeLegends.length === 1) {
        const { label } = activeLegends[0];
        if (setCapacityAndResources) {
            setCapacityAndResources((prevState: string) => {
                if (prevState !== label) {
                    return label;
                }
                return prevState;
            });
        }
    }

    if (activeLegends.length > 1) {
        if (setCapacityAndResources) {
            setCapacityAndResources('');
        }
    }

    return (
        <div className={_cs(styles.wrapper, 'map-legend-container')}>
            <div className={styles.title}>Capacity and Resources</div>
            <Legend
                className={styles.legend}
                // data={capacityAndResourcesLegendItems}
                data={activeLegends}
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
