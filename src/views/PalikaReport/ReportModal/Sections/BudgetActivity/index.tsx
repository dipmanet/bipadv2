/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Select from 'react-select';
import DatePicker from 'react-datepicker';
import styles from './styles.scss';

import 'react-datepicker/dist/react-datepicker.css';

import {
    setBudgetActivityDataAction,
} from '#actionCreators';
import {
    budgetDataSelector,
} from '#selectors';

import Icon from '#rscg/Icon';


const mapStateToProps = state => ({
    budgetData: budgetDataSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setBudgetActivityDatapp: params => dispatch(setBudgetActivityDataAction(params)),
});


interface Props{
    reportTitle: string;
    datefrom: string;
    dateTo: string;
    mayor: string;
    cao: string;
    focalPerson: string;
    formationDate: string;
    memberCount: string;
    setreportTitle: React.ChangeEventHandler<HTMLInputElement>;
    setdatefrom: React.ChangeEventHandler<HTMLInputElement>;
    setdateTo: React.ChangeEventHandler<HTMLInputElement>;
    setmayor: React.ChangeEventHandler<HTMLInputElement>;
    setcao: React.ChangeEventHandler<HTMLInputElement>;
    setfocalPerson: React.ChangeEventHandler<HTMLInputElement>;
    setformationDate: React.ChangeEventHandler<HTMLInputElement>;
    setmemberCount: React.ChangeEventHandler<HTMLInputElement>;
}

interface Location{
    municipalityId: number;
    districtId: number;
    provinceId: number;
}

const currentFiscalYear = new Date().getFullYear() + 56;

const options = Array.from(Array(10).keys()).map(item => ({
    value: currentFiscalYear - item,
    label: `${currentFiscalYear - item}/${currentFiscalYear + 1 - item}`,
}));

const BudgetActivity = (props: Props) => {
    const {
        updateTab,
        budgetData,
        setBudgetActivityDatapp,
    } = props;

    const [startDate, setStartDate] = useState(new Date());
    const [projcompletionDate, setprojCompletionDate] = useState(new Date());
    const [activityName, setactivityName] = useState('');
    const [fundSource, setfundSource] = useState('');
    const [fundSourcetype, setfundSourcetype] = useState('');
    const [otherFund, setotherFund] = useState('');
    const [budgetCode, setbudgetCode] = useState('');
    const [drrmCycle, setdrrmCycle] = useState('');
    const [projStatus, setprojStatus] = useState('');
    const [allocatedBudget, setallocatedBudget] = useState('');
    const [actualExp, setactualExp] = useState('');
    const [remarks, setremarks] = useState('');

    const handleDataSave = () => {
        setBudgetActivityDatapp({
            name: activityName,
            fundSource,
            additionalDrrBudget: '',
            budgetCode,
            drrmCycle,
            projStatus,
            projcompletionDate,
            allocatedBudget,
            actualExp,
            remarks,
        });
        updateTab();
    };

    const handleActivityName = (data) => {
        setactivityName(data.target.value);
    };
    const handlefundSource = (data) => {
        setfundSource(data.target.value);
    };
    const handlefundSourceType = (data) => {
        setfundSourcetype(data.target.value);
    };
    const handleOtherFund = (data) => {
        setotherFund(data.target.value);
    };
    const handleBudgetCode = (data) => {
        setbudgetCode(data.target.value);
    };
    const handleDrrmCycle = (data) => {
        setdrrmCycle(data.target.value);
    };
    const handleprojStatus = (data) => {
        setprojStatus(data.target.value);
    };
    const handleAlocBudget = (data) => {
        setallocatedBudget(data.target.value);
    };
    const handleActualExp = (data) => {
        setactualExp(data.target.value);
    };
    const handleRemarks = (data) => {
        setremarks(data.target.value);
    };


    return (
        <div className={styles.mainPageDetailsContainer}>
            <div className={styles.formContainer}>
                <h2 className={styles.title}>Budget Activities</h2>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>
                                 Name of Activity
                        <input
                            type="text"
                            className={styles.inputElement}
                            onChange={handleActivityName}
                            value={activityName}
                        />

                    </label>

                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>
                                 Source of Fund
                        <select
                            value={fundSource}
                            onChange={handlefundSource}
                            className={styles.inputElement}
                        >
                            <option value="select">Select an Option</option>
                            <option value="First">First</option>
                            <option value="Second">Second</option>
                            <option value="Third">Third</option>
                        </select>

                    </label>
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>
                                 Select One
                        <select
                            value={fundSourcetype}
                            onChange={handlefundSourceType}
                            className={styles.inputElement}
                        >
                            <option value="select">Select an Option</option>
                            <option value="Federal Government">Federal Government</option>
                            <option value="Provincial Government">Provincial Government</option>
                            <option value="INGO">I/NGOs</option>
                            <option value="Private Sector">Private Sector</option>
                            <option value="Academia">Academia</option>
                            <option value="Others">Others</option>
                        </select>

                    </label>
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>
                                 Please specify
                        <input
                            type="text"
                            className={styles.inputElement}
                            onChange={handleOtherFund}
                            value={otherFund}
                        />

                    </label>

                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>
                                 Budget Code
                        <input
                            type="text"
                            className={styles.inputElement}
                            onChange={handleBudgetCode}
                            value={budgetCode}
                        />

                    </label>
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>
                                DRRM Cycle
                        <select
                            value={drrmCycle}
                            onChange={handleDrrmCycle}
                            className={styles.inputElement}
                        >
                            <option value="select">Select an Option</option>
                            <option value="Relief">Relief</option>
                            <option value="Rehabilitation">Rehabilitation</option>
                            <option value="INGO">Reconstuction</option>
                            <option value="Private Sector">Livelihood</option>
                            <option value="Others">Others</option>
                        </select>

                    </label>
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>
                                Project Status
                        <select
                            value={projStatus}
                            onChange={handleprojStatus}
                            className={styles.inputElement}
                        >
                            <option value="select">Select an Option</option>
                            <option value="Not started">Not started</option>
                            <option value="Rehabilitation">Started</option>
                            <option value="INGO">Completed</option>
                        </select>

                    </label>
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>
                                Project Start Date
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                        />

                    </label>
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>
                                Project Completion Date
                        <DatePicker
                            selected={projcompletionDate}
                            onChange={date => setprojCompletionDate(date)}
                        />
                    </label>
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>
                                 Allocated Project Budget
                        <input
                            type="text"
                            className={styles.inputElement}
                            onChange={handleAlocBudget}
                            value={allocatedBudget}
                        />

                    </label>
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>
                                 Actual Expenditure
                        <input
                            type="text"
                            className={styles.inputElement}
                            onChange={handleActualExp}
                            value={actualExp}
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
                            value={remarks}
                        />

                    </label>
                </div>
                <button
                    type="button"
                    onClick={handleDataSave}
                    className={styles.savebtn}
                >
                            Save and Proceed
                </button>
            </div>

        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(BudgetActivity);
