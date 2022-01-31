/* eslint-disable max-len */

import React, { useState } from 'react';
import Table from 'src/admin/components/CovidTable';
import styles from './styles.module.scss';
import Ideaicon from '../../resources/ideaicon.svg';

const Covid19Table = (props) => {
    const [formtoggler, setformToggler] = useState('Individual Form');

    const handleChangeForm = (toggle) => {
        if (toggle === 'Individual Form') {
            setformToggler('Individual Form');
        } else {
            setformToggler('Group Form');
        }
    };
    return (

        <div className={styles.dataTable}>
            <div className={styles.generalInfoAndTableButton}>
                <h1 className={styles.headerCovid}>Covid-19 Data Table</h1>
                <div className={styles.maintoggler}>
                    {
                        ['Individual Form', 'Group Form'].map(item => (
                            <button
                                key={item}
                                type="submit"
                                onClick={() => handleChangeForm(item)}
                                className={item === formtoggler ? styles.togglerIndGroActive
                                    : styles.togglerIndGro}
                            >
                                {item}
                            </button>
                        ))
                    }
                </div>
                {/* <h1 className={styles.generalInfo}>General Information</h1> */}
                <button type="button" className={styles.viewDataTable}>View Report Form</button>
            </div>
            <div className={styles.shortGeneralInfo}>
                <img className={styles.ideaIcon} src={Ideaicon} alt="" />
                {
                    formtoggler === 'Individual Form'
                        ? <p className={styles.ideaPara}>The table below gives the details of COVID-19 cases reported by the institution. The table is downloadable and data can be edited as well.</p>
                        : (
                            <p className={styles.ideaPara}>
The table below gives the summary of COVID-19 cases with geographical information, casualty statistics on total infected, total death, and total recovered disaggregated by gender, and disability.
The table is downloadable and data can be edited as well.
                            </p>
                        )
                }


            </div>
            <div className={styles.infoBar}>
                <p className={styles.instInfo}>
Covid Data with patients details.

                </p>
            </div>
            <Table formtoggler={formtoggler} />
        </div>
    );
};

export default Covid19Table;
