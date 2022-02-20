import React, { useState } from 'react';
import AdminTable from 'src/admin/components/AdminTable/index';
import styles from './styles.module.scss';
import Ideaicon from '../../resources/ideaicon.svg';

const DataTable = (props) => {
    const [formtoggler, setformToggler] = useState('Individual Form');

    return (
        <div className={styles.dataTable}>
            <div className={styles.generalInfoAndTableButton}>
                <h1 className={styles.headerCovid}>Admin Control and Role Matrix</h1>
            </div>
            <div className={styles.shortGeneralInfo}>
                <img className={styles.ideaIcon} src={Ideaicon} alt="" />
                <p className={styles.ideaPara}>
The table below gives the details of COVID-19 cases reported
by the institution. The table is downloadable and data can be
edited as well.
                </p>
            </div>
            <div className={styles.generalInfoAndTableButton}>
                <h1 className={styles.crendential}>Crendential Management</h1>
            </div>
            <AdminTable formtoggler={formtoggler} />
        </div>
    );
};

export default DataTable;
