import React, { useState } from 'react';
import styles from './styles.scss';

const ReportModal = (props: Props) => {
    console.log(props);
    const tabs = ['Tab1', 'Tab2', 'Tab3', 'Tab4'];
    return (
        <>
            <div className={styles.tabsTitle}>
                { tabs.map(tab => tab)}
            </div>
        </>
    );
};

export default ReportModal;
