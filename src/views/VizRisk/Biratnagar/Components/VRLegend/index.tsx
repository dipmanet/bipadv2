import React from 'react';
import styles from './styles.scss';

const VrLegend = (props: Props) => {
    const { title, children, rightElement } = props;
    return (
        <div className={rightElement === 4 ? styles.vrLegendContainer4 : styles.vrLegendContainer}>
            {title}
            {children}
        </div>
    );
};

export default VrLegend;
