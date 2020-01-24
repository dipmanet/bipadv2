import React from 'react';
import { listToMap } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';
import styles from './styles.scss';

const healthFacilities = [
    {
        key: 1,
        name: 'Hospitals',
        count: 481,
    },
    {
        key: 2,
        name: 'Sub-Health Post',
        count: 200,
    },
    {
        key: 3,
        name: 'Health Post',
        count: 200,
    },
    {
        key: 4,
        name: 'Clinics',
        count: 127,
    },
    {
        key: 5,
        name: 'Dental Clinics',
        count: 350,
    },
];

const healthFacilitesRenderer = list => (
    <div className={styles.listItem}>
        <div className={styles.count}>
            {list.count}
        </div>
        <div className={styles.name}>
            {list.name}
        </div>
    </div>
);

const healthFacilitiesKeySelector = d => d.key;

const healthFacilitiesRendererParams = (key, list) => ({
    key: list.key,
    name: list.name,
    count: list.count,
});

class CapacitiesAndResources extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: undefined,
        };
    }

    render() {
        return (
            <div className={styles.mainContainer}>
                <div className={styles.title}>
                    Health Facilities
                </div>
                <ListView
                    className={styles.content}
                    keySelector={healthFacilitiesKeySelector}
                    data={healthFacilities}
                    renderer={healthFacilitesRenderer}
                    rendererParams={healthFacilitiesRendererParams}
                />
            </div>
        );
    }
}
export default CapacitiesAndResources;
