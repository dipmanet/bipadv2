import React from 'react';

import styles from './styles.scss';

interface Props {}

const StationSelector = (props: Props) => {
    console.log('Station Selector');
    return (
        <div className={styles.stationSelector}>
            <p> Station Selector </p>
        </div>
    );
};

export default StationSelector;
