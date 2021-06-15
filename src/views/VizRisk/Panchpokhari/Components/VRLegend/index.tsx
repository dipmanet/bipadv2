import React from 'react';
import styles from './styles.scss';

const VrLegend = (props: Props) => {
    const { title, children } = props;
    return (
        <div className={styles.vrLegendContainer}>
            {title}
            {children}
        </div>
    );
};

export default VrLegend;
