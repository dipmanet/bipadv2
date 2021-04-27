import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';

import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.scss';

import 'react-datepicker/dist/react-datepicker.css';
import NextPrevBtns from '../../NextPrevBtns';
import ProjectsProfile from '#views/Profile/ProjectsProfile';

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
}));
const subpriority = [];

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
        projCompletionDate: pcd,
        allocatedBudget: ab,
        actualExp: ae,
        remarks: rm,
    } = budgetActivityData;

    const TableNameTitle = {
        name: 'Name',
        fundSource: 'Fund Source',
        additionalDrrBudget: 'Additional DRR Budget',
        budgetCode: 'Budget Code',
        drrmCycle: 'Priority Area',
        projStatus: 'Project Status',
        projCompletionDate: 'Project Completion Date',
        allocatedBudget: 'Allocated Budget',
        actualExp: 'Actual Expenses',
        remarks: 'Remarks',
    };


    const [startDate, setStartDate] = useState('');
    const [projcompletionDate, setprojCompletionDate] = useState(pcd);
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

    const [priorityAction, setPriorityAction] = useState([]);
    const [priorityActivity, setPriorityActivity] = useState('');
    const [priorityOptions, setPriorityOptions] = useState('');
    const [optionsSelected, setoptionsSelected] = useState('');

    const [priorityArea, setpriorityArea] = useState('');
    const [action, setAction] = useState('');
    const [activity, setActivity] = useState('');

    const [organisationName, setorganisationName] = useState('');


    const [showTable, setShowTable] = useState(false);
    const [tableData, setTableData] = useState([]);

    const [showSourceType, setSourceType] = useState(false);
    const [showSourceTypeOther, setSourceTypeOther] = useState(false);
    const [selectedOption, setSelectedOption] = useState({});
    const handleOrganisationName = (org: string) => {
        setorganisationName(org.target.value);
    };

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

        setShowTable(true);
        setStartDate('');
        setprojCompletionDate('');
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
        document.body.scrollTop = 0;
    };


    const handleActivityName = (data) => {
        setactivityName(data.target.value);
    };
    const handlefundSource = (data) => {
        setfundSource(data.target.value);
        if (data.target.value === 'Additional') {
            setSourceType(true);
        } else {
            setSourceType(false);
        }
    };
    const handlefundSourceType = (data) => {
        console.log(data.target.value);
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
    const getSelectedOption = (data) => {
        setSelectedOption(data);
    };
    const getSubPriorityAction = (data) => {
        console.log(data);
        console.log('pA: ', priorityAction);
        console.log(selectedOption);
        // if(data.length>0){
        // }
        if (data.length > 0 && priorityAction.length === 0) {
            setPriorityAction(data);
        }
    };

    useEffect(() => {
        if (selectedOption && selectedOption.label && priorityAction.length > 0) {
            const ourdata = priorityAction
                .filter(item => item.ndrrsapid === selectedOption.optionKey);
            if (selectedOption.label === 'priority area') {
                setpriorityArea(ourdata[0].title);
            } else if (selectedOption.label === 'priority action') {
                setAction(ourdata[0].title);
            } else {
                setActivity(ourdata[0].title);
            }
        }
    }, [priorityAction, priorityAction.length, selectedOption]);

    const getPriorityActivity = (data) => {
        setPriorityActivity(data);
    };
    const getPriorityOptions = (data) => {
        setPriorityOptions(data);
    };


    return (
        <div className={styles.mainPageDetailsContainer}>
            <div className={styles.formColumn}>
                <h2 className={styles.title}>Budget Activities</h2>
                <div className={styles.row}>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            className={styles.inputElement}
                            onChange={handleActivityName}
                            value={activityName}
                            placeholder={'Name of Activity'}
                        />
                    </div>
                    <div className={_cs(styles.inputContainer, styles.ndrrsaContainer)}>
                        <ProjectsProfile
                            className={styles.view}
                            showFilterOnly
                            getSelectedOption={getSelectedOption}

                        // getPriorityOptions={getPriorityOptions}
                            getSubPriorityAction={getSubPriorityAction}
                        // getPriorityActivity={getPriorityActivity}
                        />
                    </div>

                    <div className={styles.inputContainer}>
                        <span className={styles.dpText}>Funding Type</span>
                        <select
                            value={fundSource}
                            onChange={handlefundSource}
                            className={styles.inputElement}
                        >
                            <option value="select"> Select Funding Type</option>
                            <option value="DRR">DRR Fund of Municipality</option>
                            <option value="Additional">Other DRR related funding</option>
                        </select>

                    </div>
                    {
                        showSourceType
                            ? (
                                <div className={styles.inputContainer}>
                                    <span className={styles.dpText}>Source of Fund</span>
                                    <select
                                        value={fundSourcetype}
                                        onChange={handlefundSourceType}
                                        className={styles.inputElement}
                                    >
                                        <option value="select">Select Source of Funds</option>
                                        <option value="Federal Government">Federal Government</option>
                                        <option value="Provincial Government">Provincial Government</option>
                                        <option value="INGO">I/NGOs</option>
                                        <option value="Private Sector">Private Sector</option>
                                        <option value="Academia">Academia</option>
                                        <option value="Others">Others</option>
                                    </select>

                                </div>
                            ) : ''

                    }
                    {
                        !showSourceType
                            ? (
                                <div className={styles.inputContainer}>

                                    <input
                                        type="text"
                                        className={styles.inputElement}
                                        onChange={handleOtherFund}
                                        value={otherFund}
                                        placeholder={'Source Of Fund: Municipal Government'}
                                        disabled
                                    />
                                </div>
                            ) : ''

                    }
                    {showSourceTypeOther
                      && (
                          <div className={styles.inputContainer}>

                              <input
                                  type="text"
                                  className={styles.inputElement}
                                  onChange={handleOtherFund}
                                  value={otherFund}
                                  placeholder={'Please specify Other source type'}
                              />


                          </div>
                      )

                    }

                    <div className={styles.inputContainer}>

                        <input
                            type="text"
                            className={styles.inputElement}
                            onChange={handleBudgetCode}
                            value={budgetCode}
                            placeholder={'Budget Code'}
                        />

                    </div>
                    <div className={styles.inputContainer}>

                        <input
                            type="text"
                            className={styles.inputElement}
                            onChange={handleOrganisationName}
                            value={organisationName}
                            placeholder={'Name of Organisation'}
                        />

                    </div>

                    <div className={styles.inputContainer}>
                        <span className={styles.dpText}>Project Status</span>
                        <select
                            value={projStatus}
                            onChange={handleprojStatus}
                            className={styles.inputElement}
                            placeholder={'Project Status'}
                        >
                            <option value="select">Select an Option</option>
                            <option value="Rehabilitation">Started</option>
                            <option value="Not started">Ongoing</option>
                            <option value="INGO">Completed</option>
                        </select>

                    </div>
                    <div className={styles.inputContainer}>
                        <span className={styles.dpText}>Project Start Date</span>
                        <NepaliDatePicker
                            inputClassName="form-control"
                            className={styles.datepicker}
                            value={startDate}
                            onChange={date => setStartDate(date)}
                            options={{ calenderLocale: 'ne', valueLocale: 'en' }}

                        />
                        {/* <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            className={styles.datepicker}
                        /> */}

                    </div>
                    <div className={styles.inputContainer}>
                        <span className={styles.dpText}>
                                Project Completion Date
                        </span>
                        <NepaliDatePicker
                            inputClassName="form-control"
                            className={styles.datepicker}
                            value={projcompletionDate}
                            onChange={date => setprojCompletionDate(date)}
                            options={{ calenderLocale: 'ne', valueLocale: 'en' }}

                        />
                        {/* <DatePicker
                            selected={projcompletionDate}
                            onChange={date => setprojCompletionDate(date)}
                        /> */}
                    </div>
                    <div className={styles.inputContainer}>

                        <input
                            type="text"
                            className={styles.inputElement}
                            onChange={handleAlocBudget}
                            value={allocatedBudget}
                            placeholder={'Allocated Project Budget'}

                        />

                    </div>
                    <div className={styles.inputContainer}>

                        <input
                            type="text"
                            className={styles.inputElement}
                            onChange={handleActualExp}
                            value={actualExp}
                            placeholder={'Actual Expenditure'}

                        />

                    </div>
                    <div className={styles.inputContainer}>

                        <input
                            type="text"
                            className={styles.inputElement}
                            onChange={handleRemarks}
                            value={remarks}
                            placeholder={'Remarks'}
                        />

                    </div>
                </div>
                {props.budgetActivityData && props.budgetActivityData.length > 0
                 && (
                     <>

                         <Table className={styles.bdaTable} striped bordered hover size="md">
                             <thead>
                                 <tr>
                                     {Object.keys(props.budgetActivityData[0]).map(item => (
                                         <th key={item}>
                                             {TableNameTitle[item]}
                                         </th>
                                     ))}
                                     <th>
                                         Start Date
                                     </th>
                                     <th>
                                         Priority Area
                                     </th>
                                     <th>
                                         Priority Action
                                     </th>
                                     <th>
                                         Priority Activity
                                     </th>

                                 </tr>
                             </thead>
                             <tbody>
                                 {
                                     props.budgetActivityData.map(data => (
                                         <tr key={data.name}>
                                             {Object.keys(props.budgetActivityData[0])
                                                 .map(title => (
                                                     <td key={title}>

                                                         {data[title] ? String(data[title]) : 'No data'}

                                                     </td>
                                                 ))}
                                             <td>
                                                 {startDate}
                                             </td>
                                             <td>
                                                 {priorityArea}
                                             </td>
                                             <td>
                                                 {action}
`
                                             </td>
                                             <td>
                                                 {activity}
``
                                             </td>
                                         </tr>
                                     ))
                                 }
                             </tbody>
                         </Table>
                     </>
                 )

                }
                <div className={styles.btns}>
                    <NextPrevBtns
                        handlePrevClick={props.handlePrevClick}
                        handleNextClick={props.handleNextClick}
                    />
                    <button
                        type="button"
                        onClick={handleAddNew}
                        className={styles.newActivityBtn}
                    >
                            Add New Activity
                    </button>

                </div>

            </div>

        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(BudgetActivity);
