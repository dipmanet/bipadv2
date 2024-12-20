import React from 'react';
import { Translation } from 'react-i18next';
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
                    {value}
                </div>
                <Translation>
                    {
                        t => (
                            <span>
                                {t(`${title}`)}
                            </span>
                        )
                    }
                </Translation>
            </div>
        </div>
    );
};

export default GenderStat;
