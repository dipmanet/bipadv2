/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Table } from 'react-bootstrap';

import styles from './styles.scss';

interface Props{

}

const Preparedness = (props: Props) => {
    console.log(props);
    const handleDataSave = () => {
        props.updateTab();
    };

    const [municipalBudget, setmunicipalBudget] = useState('');
    const [conductedArea, setconductedArea] = useState('');
    const [activitySource, setactivitySource] = useState('');
    const [costEstimated, setcostEstimated] = useState('');
    const [totalExpenditure, settotalExpenditure] = useState('');
    const [remarks, setremarks] = useState('');
    const [priorityArea, setpriorityArea] = useState('');
    const [priorityAction, setpriorityAction] = useState('');
    const [priorityActivity, setpriorityActivity] = useState('');


    const handleMunicipalBudget = (data) => {
        setmunicipalBudget(data.target.value);
    };
    const handleConductedArea = (data) => {
        setconductedArea(data.target.value);
    };
    const handleActivitySource = (data) => {
        setactivitySource(data.target.value);
    };
    const handleCostEstimated = (data) => {
        setcostEstimated(data.target.value);
    };
    const handleTotalExpenditure = (data) => {
        settotalExpenditure(data.target.value);
    };
    const handleRemarks = (data) => {
        setremarks(data.target.value);
    };

    const handlePriorityArea = (data) => {
        setpriorityArea(data.target.value);
    };
    const handlePriorityAction = (data) => {
        setpriorityAction(data.target.value);
    };
    const handlePriorityActivity = (data) => {
        setpriorityActivity(data.target.value);
    };

    return (
        <>
            <h2>
        Initiatives taken in Recovery and
        Reconstruction Activity conducted in FY 77/78
            </h2>
            <div className={styles.featureText}>
                FEATURE UNDER DEVELOPMENT
            </div>
            <div className={styles.disabled} />
            <div className={styles.tabsPageContainer}>

                <div className={styles.formColumn}>
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>
                                 Activity Conducted

                            <input
                                type="text"
                                className={styles.inputElement}
                                onChange={handleMunicipalBudget}
                                placeholder={'Kindly specify activity conducted'}
                                value={municipalBudget}
                            />

                        </label>
                    </div>
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>
                        Conducted Area

                            <input
                                type="text"
                                className={styles.inputElement}
                                onChange={handleConductedArea}
                                placeholder={'Kindly specify conducted area'}
                                value={conductedArea}
                            />

                        </label>
                    </div>
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>
                        Source of Activity

                            <input
                                type="text"
                                className={styles.inputElement}
                                onChange={handleActivitySource}
                                placeholder={'Kindly specify source of activity'}
                                value={activitySource}
                            />

                        </label>
                    </div>
                </div>

                <div className={styles.formColumn}>
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>
                Cost Estimated

                            <input
                                type="text"
                                className={styles.inputElement}
                                onChange={handleCostEstimated}
                                placeholder={'Kindly specify Cost Estimated'}
                                value={costEstimated}
                            />

                        </label>
                    </div>
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>
                Total Expenditure

                            <input
                                type="text"
                                className={styles.inputElement}
                                onChange={handleTotalExpenditure}
                                placeholder={'Kindly specify Total Expenditure'}
                                value={totalExpenditure}
                            />

                        </label>
                    </div>
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>
                Remarks

                            <input
                                type="text"
                                className={styles.inputElement}
                                onChange={handleRemarks}
                                placeholder={'Kindly specify Remarks if any'}
                                value={remarks}
                            />

                        </label>
                    </div>


                </div>


                <div className={styles.formColumn}>
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>
                                 Priority Area

                            <input
                                type="text"
                                className={styles.inputElement}
                                onChange={handlePriorityArea}
                                placeholder={'Please choose priority area'}
                                value={priorityArea}
                            />

                        </label>
                    </div>
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>
                        Priority Action

                            <input
                                type="text"
                                className={styles.inputElement}
                                onChange={handlePriorityAction}
                                placeholder={'Please choose priority action'}
                                value={priorityAction}
                            />

                        </label>
                    </div>
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>
                        Priority Activity

                            <input
                                type="text"
                                className={styles.inputElement}
                                onChange={handlePriorityActivity}
                                placeholder={'Please choose priority activity'}
                                value={priorityActivity}
                            />

                        </label>
                    </div>
                </div>


            </div>
            <button
                type="button"
                onClick={handleDataSave}
                className={styles.savebtn}
            >
                Save and Proceed
            </button>
        </>
    );
};

export default Preparedness;
