/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';

import Select from 'react-select';
import DatePicker from 'react-datepicker';
import styles from './styles.scss';

import 'react-datepicker/dist/react-datepicker.css';
import NextPrevBtns from '../../NextPrevBtns';


import {
    setBudgetActivityDataAction,
} from '#actionCreators';
import {
    budgetActivityDataSelector,
    generalDataSelector,
    budgetDataSelector,
} from '#selectors';

import Icon from '#rscg/Icon';


const mapStateToProps = state => ({
    budgetActivityData: budgetActivityDataSelector(state),
    generalData: generalDataSelector(state),
    budgetData: budgetDataSelector(state),

});

const mapDispatchToProps = dispatch => ({
    setBudgetActivityDatapp: params => dispatch(setBudgetActivityDataAction(params)),
});

interface BudgetActivityData{
    name: string;
    fundSource: string;
    additionalDrrBudget: string;
    budgetCode: string;
    drrmCycle: string;
    projStatus: string;
    projCompletionDate: string;
    allocatedBudget: string;
    actualExp: string;
    remarks: string;
}


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
        budgetActivityData,
        generalData,
    } = props;
    const {
        name: nm,
        fundSource: fd,
        additionalDrrBudget: ad,
        budgetCode: bc,
        drrmCycle: dc,
        projStatus: ps,
        projCompletionDate,
        allocatedBudget: ab,
        actualExp: ae,
        remarks: rm,
    } = budgetActivityData;


    const [startDate, setStartDate] = useState(new Date());
    const [projcompletionDate, setprojCompletionDate] = useState(new Date());
    const [activityName, setactivityName] = useState(nm);
    const [fundSource, setfundSource] = useState(fd);
    const [fundSourcetype, setfundSourcetype] = useState(ad);
    const [otherFund, setotherFund] = useState('');
    const [budgetCode, setbudgetCode] = useState(bc);
    const [drrmCycle, setdrrmCycle] = useState(dc);
    const [projStatus, setprojStatus] = useState(ps);
    const [allocatedBudget, setallocatedBudget] = useState(ab);
    const [actualExp, setactualExp] = useState(ae);
    const [remarks, setremarks] = useState(rm);
    // const tableData = [];

    const [showTable, setShowTable] = useState(false);
    const [tableData, setTableData] = useState([]);

    const [showSourceType, setSourceType] = useState(false);
    const [showSourceTypeOther, setSourceTypeOther] = useState(false);

    useEffect(() => {
        if (budgetData.additionalFund && parseInt(budgetData.additionalFund, 10) > 0) {
            setSourceType(true);
        }
    }, [budgetData]);

    const handleNext = () => {
        updateTab();
    };

    const handleSave = () => {
        const newArr = [...tableData, {
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
        }];
        setTableData(newArr);
        setBudgetActivityDatapp(newArr);
    };

    const handleAddNew = () => {
        setShowTable(true);
        setStartDate(new Date());
        setprojCompletionDate(new Date());
        setactivityName('');
        setfundSource('');
        setfundSourcetype('');
        setotherFund('');
        setbudgetCode('');
        setdrrmCycle('');
        setprojStatus('');
        setallocatedBudget('');
        setactualExp('');
        setremarks('');
    };


    const handleActivityName = (data) => {
        setactivityName(data.target.value);
    };
    const handlefundSource = (data) => {
        setfundSource(data.target.value);
        // if (data.target.value === 'Additional') {
        //     setSourceType(true);
        // }
    };
    const handlefundSourceType = (data) => {
        setfundSourcetype(data.target.value);
        if (data.target.value === 'Others') {
            setSourceTypeOther(true);
        }
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
                                 Name of Activity:
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
                                 Source of Fund:
                        <select
                            value={fundSource}
                            onChange={handlefundSource}
                            className={styles.inputElement}
                        >
                            <option value="select">Select a fund source</option>
                            <option value="Municipal">Municipal Budget</option>
                            <option value="DRR">DRR Fund</option>
                            <option value="Additional">Additional DRR Budget</option>
                        </select>

                    </label>
                </div>
                {
                    showSourceType
                    && (
                        <div className={styles.inputContainer}>
                            <label className={styles.label}>
                                 Fund source type:
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
                    )

                }
                {showSourceTypeOther
                      && (
                          <div className={styles.inputContainer}>
                              <label className={styles.label}>
                                   Please specify Other source type
                                  <input
                                      type="text"
                                      className={styles.inputElement}
                                      onChange={handleOtherFund}
                                      value={otherFund}
                                  />

                              </label>

                          </div>
                      )

                }

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
                            <option value="Rehabilitation">Started</option>
                            <option value="Not started">Ongoing</option>
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
                {props.budgetActivityData && props.budgetActivityData.length > 0
                 && (

                     <Table striped bordered hover size="md">
                         <thead>
                             <tr>
                                 {Object.keys(props.budgetActivityData[0]).map(item => (
                                     <th key={item}>
                                         {item}
                                     </th>
                                 ))}

                             </tr>
                         </thead>
                         <tbody>
                             {
                                 props.budgetActivityData.map(data => (
                                     <tr key={data.name}>
                                         {Object.keys(props.budgetActivityData[0]).map((title) => {
                                             console.log('data', data[title]);
                                             return (
                                                 <td key={title}>
                                                     {data[title] ? String(data[title]) : 'No data'}

                                                 </td>
                                             );
                                         })}
                                     </tr>
                                 ))}
                         </tbody>
                     </Table>
                 )

                }
                <div className={styles.btns}>

                    <button
                        type="button"
                        onClick={handleAddNew}
                        className={styles.newActivityBtn}
                    >
                            Add New Activity
                    </button>
                    <NextPrevBtns
                        handlePrevClick={props.handlePrevClick}
                        handleNextClick={props.handleNextClick}
                    />
                </div>

            </div>

        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(BudgetActivity);
