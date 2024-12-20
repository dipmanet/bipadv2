/* eslint-disable max-len */
import React from 'react';
import styles from './styles.scss';

const DRRCountBox = (props: any) => {
    const { title, children, contactData } = props;
    return (
        <div className={styles.drrCountBox}>
            <div className={styles.provinceSummary}>
                <h3 className={styles.provinceTitle}>Provincial Summary</h3>
                <p className={styles.contactPara}>Total Contact</p>
                <p className={styles.totalCount}>{contactData.length}</p>
            </div>
            <div className={styles.otherInfoRow}>
                <div className={styles.smallBox}>
                    <h3 className={styles.provinceTitle}>District Disaster Management Committee(DDMC)</h3>
                    <p className={styles.totalCount}>10</p>
                </div>
                <div className={styles.smallBox2}>
                    <h3 className={styles.provinceTitle}>District Disaster Management Committee(DDMC)</h3>
                    <p className={styles.totalCount}>12</p>
                </div>
            </div>
        </div>
    );
};

export default DRRCountBox;
