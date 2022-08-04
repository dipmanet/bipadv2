import React from 'react';
import styles from './styles.scss';

const DamageLossTooltip = (props) => {
    const { currentSelection } = props;
    return (
        <p className={styles.textData}>
            currently showing : Number of
            {' '}
            {currentSelection}
        </p>
    );
};

export default DamageLossTooltip;
