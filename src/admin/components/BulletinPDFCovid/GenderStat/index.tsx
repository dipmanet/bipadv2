import React from 'react';
import styles from './styles.scss';

const GenderStat = (props) => {
    const { title, value, icon } = props;
    return (
        <div className={styles.itemContainer}>
            <div className={styles.icon}>
                <img src={icon} alt="Male/Female" />
            </div>
            <div className={styles.stat}>
                <div className={styles.goloBatch}>
                    {Number(value).toLocaleString()}
                </div>
                {title}
            </div>
        </div>
    );
};

export default GenderStat;
