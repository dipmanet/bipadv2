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
    budgetDataSelector, budgetIdSelector,
} from '#selectors';

import Icon from '#rscg/Icon';


const mapStateToProps = state => ({
    budgetActivityData: budgetActivityDataSelector(state),
    generalData: generalDataSelector(state),
    budgetData: budgetDataSelector(state),
    budgetId: budgetIdSelector(state),

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
        budgetId,
    } = props;


    const TableNameTitle = {
        name: 'Name of Activity',
        fundSource: 'Source of Fund',
        budgetCode: 'Budget Code',
        projStatus: 'Project Status',
        allocatedBudget: 'Allocated Budget',
        actualExp: 'Actual Expenses',
        remarks: 'Remarks',
        priorityArea: 'Priority Area',
        action: 'Priority Action',
        activity: 'Priority Activity',
        areaofImplementation: 'Area of Implementation',
        fundingType: 'Funding Type',
        organisationName: 'Name of Organisation',
        projcompletionDate: 'Project Completion Date',
        projstartDate: 'Project Start Date',
    };

    const {
        name: namefromprops,
        fundSource: fundSourcefromprops,
        budgetCode: budgetCodefromprops,
        projStatus: projStatusfromprops,
        projCompletionDate: projCompletionDatefromprops,
        allocatedBudget: allocatedBudgetfromprops,
        actualExp: actualExpfromprops,
        remarks: remarksfromprops,
        priorityArea: priorityAreafromprops,
        action: actionfromprops,
        activity: activityfromprops,
        areaofImplementation: areaofImplementationfromprops,
        fundingType: fundingTypefromprops,
        organisationName: organisationNamefromprops,
        projstartDate: projstartDatefromprops,

    } = budgetActivityData;


    const [projstartDate, setStartDate] = useState(projstartDatefromprops);
    const [projcompletionDate, setprojCompletionDate] = useState(projCompletionDatefromprops);
    const [activityName, setactivityName] = useState(namefromprops);
    const [fundSource, setfundSource] = useState(fundSourcefromprops);
    const [fundingType, setfundingType] = useState(fundingTypefromprops);
    const [otherFund, setotherFund] = useState('');
    const [budgetCode, setbudgetCode] = useState(budgetCodefromprops);
    const [projStatus, setprojStatus] = useState(projStatusfromprops);
    const [allocatedBudget, setallocatedBudget] = useState(allocatedBudgetfromprops);
    const [actualExp, setactualExp] = useState(actualExpfromprops);
    const [remarks, setremarks] = useState(remarksfromprops);
    const [priorityArea, setpriorityArea] = useState(priorityAreafromprops);
    const [action, setAction] = useState(actionfromprops);
    const [activity, setActivity] = useState(activityfromprops);
    const [areaofImplementation, setareaofImplementation] = useState(areaofImplementationfromprops);
    const [organisationName, setorganisationName] = useState(organisationNamefromprops);
    const [priorityAction, setPriorityAction] = useState([]);

    const [tableData, setTableData] = useState([]);
    const [showtable, setShowTable] = useState(false);
    const [showSourceType, setSourceType] = useState(false);
    const [showSourceTypeOther, setSourceTypeOther] = useState(false);
    const [showmunGovernment, setshowmunGovernment] = useState(false);
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
    const handleAreaOfImplementation = (data) => {
        setareaofImplementation(data.target.value);
    };
    const handleAddNew = () => {
        const newArr = [...tableData, {
            name: activityName,
            fundSource,
            budgetCode,
            projStatus,
            projcompletionDate,
            allocatedBudget,
            actualExp,
            remarks,
            priorityArea,
            action,
            activity,
            areaofImplementation,
            fundingType,
            organisationName,
            projstartDate,
        }];
        setTableData(newArr);
        setBudgetActivityDatapp(newArr);
        setShowTable(true);

        setStartDate('');
        setprojCompletionDate('');
        setactivityName('');
        setfundSource('');
        setfundingType('');
        setotherFund('');
        setbudgetCode('');
        setprojStatus('');
        setallocatedBudget('');
        setactualExp('');
        setremarks('');
        setpriorityArea('');
        setAction('');
        setActivity('');
        setorganisationName('');
        setPriorityAction([]);
        setSourceType(false);
        setSourceTypeOther(false);
        setshowmunGovernment(false);
    };


    const handleActivityName = (data) => {
        setactivityName(data.target.value);
    };
    const handlefundSource = (data) => {
        setfundSource(data.target.value);

        if (data.target.value === 'DRR Fund of Muicipality') {
            setshowmunGovernment(true);
            setSourceType(false);
            setSourceTypeOther(false);
        } if (data.target.value === 'Other DRR related funding') {
            setSourceType(true);
            setshowmunGovernment(false);
        }
    };
    const handlefundingType = (data) => {
        if (data.target.value === 'Others') {
            setSourceTypeOther(true);
        } else {
            setSourceTypeOther(false);
            setfundingType(data.target.value);
        }
    };
    const handleOtherFund = (data) => {
        setfundingType(data.target.value);
    };
    const handleBudgetCode = (data) => {
        setbudgetCode(data.target.value);
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
        if (data.length > 0 && action.length === 0) {
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
    }, [action, priorityAction, selectedOption]);

    return (
        <div className={styles.mainPageDetailsContainer}>
            <h2 className={styles.title}>Budget Activities</h2>
            <table id="table-to-xls">
                <tbody>


                    <>

                        <tr>

                            <th>SN</th>


                            <th>
                                        Name of activity


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
                            <th>
                                        Area of implementation


                            </th>
                            <th>
                                        Funding type


                            </th>
                            <th>
                                        Source of fund


                            </th>
                            <th>
                                        Budget code


                            </th>
                            <th>
                                        Organization Name


                            </th>
                            <th>
                                        Project start date


                            </th>
                            <th>
                                        Project Completion date


                            </th>
                            <th>
                                        Status


                            </th>
                            <th>
                                        Allocated Project budget


                            </th>
                            <th>
                                        Actual expenditure


                            </th>
                            <th>
                                        Remarks


                            </th>


                        </tr>
                        <tr>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>
                                {' '}
                                <input type="text" placeholder="Total Budget" />
                            </td>
                            <td>
                                {' '}
                                <input type="text" placeholder="Total Budget" />
                            </td>
                            <td>
                                {' '}
                                <input type="text" placeholder="Total Budget" />
                            </td>
                            <td>
                                {' '}
                                <input type="text" placeholder="Total Budget" />
                            </td>
                            <td>
                                {' '}
                                <input type="text" placeholder="Total Budget" />
                            </td>
                            <td>
                                {' '}
                                <input type="text" placeholder="Total Budget" />
                            </td>
                            <td>
                                {' '}
                                <input type="text" placeholder="Total Budget" />
                            </td>
                            <td>
                                {' '}
                                <input type="text" placeholder="Total Budget" />
                            </td>
                            <td>
                                {' '}
                                <input type="text" placeholder="Total Budget" />
                            </td>
                            <td>
                                {' '}
                                <input type="text" placeholder="Total Budget" />
                            </td>
                            <td>
                                {' '}
                                <input type="text" placeholder="Total Budget" />
                            </td>
                            <td>
                                {' '}
                                <input type="text" placeholder="Total Budget" />
                            </td>
                            <td>
                                {' '}
                                <input type="text" placeholder="Total Budget" />
                            </td>
                            <td>
                                {' '}
                                <input type="text" placeholder="Total Budget" />
                            </td>
                            <td>
                                {' '}
                                <input type="text" placeholder="Total Budget" />
                            </td>

                        </tr>

                    </>


                </tbody>
            </table>
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
                        getSubPriorityAction={getSubPriorityAction}
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
                        <option value="DRR Fund of Muicipality">
                            DRR Fund of Municipality

                        </option>
                        <option value="Other DRR related funding">
                            Other DRR related funding

                        </option>
                    </select>

                </div>
                {
                    showmunGovernment
                        ? (
                            <div className={styles.inputContainer}>

                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    value={otherFund}
                                    placeholder={'Source Of Fund: Municipal Government'}
                                    disabled
                                />
                            </div>
                        ) : ''

                }
                {
                    showSourceType
                        ? (
                            <div className={styles.inputContainer}>
                                <span className={styles.dpText}>Source of Fund</span>
                                <select
                                    value={fundingType}
                                    onChange={handlefundingType}
                                    className={styles.inputElement}
                                >
                                    <option value="select">Select Source of Funds</option>
                                    <option value="Federal Government">
                                        Federal Government

                                    </option>
                                    <option value="Provincial Government">
                                        Provincial Government

                                    </option>
                                    <option value="INGO">I/NGOs</option>
                                    <option value="Private Sector">Private Sector</option>
                                    <option value="Academia">Academia</option>
                                    <option value="Others">Others</option>
                                </select>

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
                                  value={fundingType}
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
                    <span className={styles.dpText}>Area of Implementation</span>
                    <input
                        type="text"
                        className={styles.inputElement}
                        onChange={handleAreaOfImplementation}
                        value={areaofImplementation}
                        placeholder={'Enter ward number and village name'}
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
                        value={projstartDate}
                        onChange={date => setStartDate(date)}
                        options={{ calenderLocale: 'ne', valueLocale: 'en' }}

                    />

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


                                 </tr>
                             </thead>
                             <tbody>
                                 {
                                     props.budgetActivityData.map(data => (
                                         <tr key={data.name}>
                                             {Object.keys(props.budgetActivityData[0])
                                                 .map(title => (
                                                     <td key={title}>
                                                         {data[title]
                                                             ? String(data[title]) : 'No data'}
                                                     </td>
                                                 ))}

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
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(BudgetActivity);
