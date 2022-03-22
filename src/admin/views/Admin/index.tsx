import React from 'react';
import AdminTable from 'src/admin/components/AdminTable/index';
import Navbar from 'src/admin/components/Navbar';
import MenuCommon from 'src/admin/components/MenuCommon';
import Footer from 'src/admin/components/Footer';
import styles from './styles.module.scss';
import Ideaicon from '../../resources/ideaicon.svg';
import Page from '#components/Page';

const DataTable = () => (
    <>
        <Page hideFilter hideMap />
        <Navbar layout="common" />
        <MenuCommon />
        <div className={styles.dataTable}>
            <div className={styles.generalInfoAndTableButton}>
                <h1 className={styles.headerCovid}>Admin Control and Role Matrix</h1>
            </div>
            <div className={styles.shortGeneralInfo}>
                <img className={styles.ideaIcon} src={Ideaicon} alt="" />
                <p className={styles.ideaPara}>
                        The table below gives the details of users.
                </p>
            </div>
            <div className={styles.generalInfoAndTableButton}>
                <h1 className={styles.crendential}>Crendential Management</h1>
            </div>
            <AdminTable />
        </div>
        <Footer />
    </>
);

export default DataTable;
