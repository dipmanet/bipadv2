import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import ReactPaginate from 'react-paginate';
import { _cs } from '@togglecorp/fujs';
import priorityData from '#views/PalikaReport/components/priorityDropdownSelectData';
import styles from './styles.scss';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
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
    userSelector,
} from '#selectors';

import Icon from '#rscg/Icon';


const mapStateToProps = state => ({
    budgetActivityData: budgetActivityDataSelector(state),
    generalData: generalDataSelector(state),
    budgetData: budgetDataSelector(state),
    budgetId: budgetIdSelector(state),
    user: userSelector(state),

});

const mapDispatchToProps = dispatch => ({
    setBudgetActivityDatapp: params => dispatch(setBudgetActivityDataAction(params)),
});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    BudgetActivityGetRequest: { url: '/annual-budget-activity/',
        query: ({ params, props }) => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            annual_budget: params.annualBudget,
            district: params.district,
            municipality: params.municipality,
            province: params.province,
            limit: params.page,
            ordering: params.id,
            offset: params.offset,
        }),
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;

            if (params && params.budgetActivities) {
                params.budgetActivities(citizenReportList);
                console.log('wow', citizenReportsResponse);
            }
            if (params && params.paginationParameters) {
                params.paginationParameters(response);
            }
        } },
    BudgetActivityPostRequest: {
        url: '/annual-budget-activity/',
        query: ({ params, props }) => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            annual_budget: params.annualBudget,
            district: params.district,
            municipality: params.municipality,
            province: params.province,
        }),
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            console.log('This is response', response);
            params.dataSubmitted(response);
        },


    },

};

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
        requests: { BudgetActivityGetRequest, BudgetActivityPostRequest },
        user: { profile },
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

    const [dataSubmittedResponse, setDataSubmittedResponse] = useState(false);
    const [projstartDate, setStartDate] = useState('');
    const [projcompletionDate, setprojCompletionDate] = useState('');
    const [activityName, setactivityName] = useState('');
    const [fundSource, setfundSource] = useState('');
    const [fundingType, setfundingType] = useState('');
    const [otherFund, setotherFund] = useState('');
    const [budgetCode, setbudgetCode] = useState('');
    const [projStatus, setprojStatus] = useState('');
    const [allocatedBudget, setallocatedBudget] = useState();
    const [actualExp, setactualExp] = useState();
    const [remarks, setremarks] = useState('');
    const [priorityArea, setpriorityArea] = useState('');
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(6);
    const [offset, setOffset] = useState(0);
    const [paginationParameters, setPaginationParameters] = useState();
    const [action, setAction] = useState(actionfromprops);
    const [activity, setActivity] = useState(activityfromprops);
    const [areaofImplementation, setareaofImplementation] = useState(areaofImplementationfromprops);
    const [organisationName, setorganisationName] = useState('');
    const [priorityAction, setPriorityAction] = useState('');
    const [priorityActivity, setPriorityActivity] = useState('');
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [tableData, setTableData] = useState([]);
    const [showtable, setShowTable] = useState(false);
    const [showSourceType, setSourceType] = useState(false);
    const [showSourceTypeOther, setSourceTypeOther] = useState(false);
    const [showmunGovernment, setshowmunGovernment] = useState(false);
    const [selectedOption, setSelectedOption] = useState({});
    const [budgetActivities, setBudgetActivities] = useState([]);

    const handleDataSubmittedResponse = (response) => {
        setDataSubmittedResponse(!dataSubmittedResponse);
        setStartDate('');
        setprojCompletionDate('');
        setactivityName('');
        setfundSource('');
        setfundingType('');
        setbudgetCode('');
        setprojStatus('');
        setallocatedBudget(null);
        setactualExp(null);
        setremarks('');
        setpriorityArea('');
        setorganisationName('');
        setPriorityAction('');
        setPriorityActivity('');
    };
    const handleBudgetActivities = (response) => {
        setBudgetActivities(response);
    };
    const handlePaginationParameters = (response) => {
        setPaginationParameters(response);
    };

    const handleOrganisationName = (org: string) => {
        setorganisationName(org.target.value);
    };


    BudgetActivityGetRequest.setDefaultParams({
        province: profile.province,
        district: profile.district,
        municipality: profile.municipality,
        annualBudget: budgetId.id,
        budgetActivities: handleBudgetActivities,
        paginationParameters: handlePaginationParameters,
        id: '-id',
        page: paginationQueryLimit,

    });
    const handlePageClick = (e) => {
        const selectedPage = e.selected + 1;
        setOffset((selectedPage - 1) * paginationQueryLimit);
        setCurrentPageNumber(selectedPage);
        console.log('What is click>>>', e.selected);
    };
    useEffect(() => {
        BudgetActivityGetRequest.do({
            offset,
            page: paginationQueryLimit,
            fiscalYear: generalData.fiscalYear,
            district: profile.district,
            municipality: profile.municipality,
            province: profile.province,
            id: '-id',

        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);
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
        BudgetActivityPostRequest.do({
            body: {
                activityName,
                priorityArea,
                priorityAction,
                priorityActivity,
                fundType: fundingType,
                budgetCode,
                donerOrganization: organisationName,
                projectStartDate: projstartDate,
                projectEndDate: projcompletionDate,
                amount: allocatedBudget,
                expenditure: actualExp,
                status: projStatus,
                remarks,
                annualBudget: budgetId.id,

            },
            budgetActivities: handleBudgetActivities,
            dataSubmitted: handleDataSubmittedResponse,
        });


        // const newArr = [...tableData, {
        //     name: activityName,
        //     fundSource,
        //     budgetCode,
        //     projStatus,
        //     projcompletionDate,
        //     allocatedBudget,
        //     actualExp,
        //     remarks,

        //     action,
        //     activity,
        //     areaofImplementation,
        //     fundingType,
        //     organisationName,
        //     projstartDate,
        // }];
        // setTableData(newArr);
        // setBudgetActivityDatapp(newArr);
        // setShowTable(true);

        // setStartDate('');
        // setprojCompletionDate('');
        // setactivityName('');
        // setfundSource('');
        // setfundingType('');
        // setotherFund('');
        // setbudgetCode('');
        // setprojStatus('');
        // setallocatedBudget('');
        // setactualExp('');
        // setremarks('');
        // setAction('');
        // setActivity('');
        // setorganisationName('');
        // setPriorityAction([]);
        // setSourceType(false);
        // setSourceTypeOther(false);
        // setshowmunGovernment(false);
    };
    console.log('budget Activity>>>', budgetActivities);
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

    useEffect(() => {
        if (dataSubmittedResponse) {
            BudgetActivityGetRequest.do({
                province: profile.province,
                district: profile.district,
                municipality: profile.municipality,
                annualBudget: budgetId.id,
                budgetActivities: handleBudgetActivities,
                page: paginationQueryLimit,
                id: '-id',
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSubmittedResponse]);


    console.log('This what is>>>', budgetId.id);
    const PriorityArea = priorityData.Data.filter(data => data.level === 0);
    const PriorityAction = priorityData.Data.filter(data => data.level === 1);
    const PriorityActivity = priorityData.Data.filter(data => data.level === 2);

    const handlePriorityArea = (e) => {
        setpriorityArea(e.target.value);
    };
    const handlePriorityAction = (e) => {
        setPriorityAction(e.target.value);
    };
    const handlePriorityActivity = (e) => {
        setPriorityActivity(e.target.value);
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
    console.log('This is value>>>>', priorityArea);
    // useEffect(() => {
    //     if (selectedOption && selectedOption.label && priorityAction.length > 0) {
    //         const ourdata = priorityAction
    //             .filter(item => item.ndrrsapid === selectedOption.optionKey);
    //         if (selectedOption.label === 'priority area') {
    //             setpriorityArea(ourdata[0].title);
    //         } else if (selectedOption.label === 'priority action') {
    //             setAction(ourdata[0].title);
    //         } else {
    //             setActivity(ourdata[0].title);
    //         }
    //     }
    // }, [action, priorityAction, selectedOption]);

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
                            {/* <th>
                                        Area of implementation


                            </th> */}
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
                        {budgetActivities && budgetActivities.map((data, i) => (
                            <tr key={data.id}>
                                <td>{(currentPageNumber - 1) * paginationQueryLimit + i + 1}</td>
                                <td>{data.activityName}</td>
                                <td>{data.priorityArea}</td>
                                <td>{data.priorityAction}</td>
                                <td>{data.priorityActivity}</td>
                                {/* <td>{data.priorityArea}</td> */}
                                <td>{data.fundType}</td>
                                <td>{data.fundType}</td>
                                <td>{data.budgetCode}</td>
                                <td>{data.donerOrganization}</td>
                                <td>{data.projectStartDate}</td>
                                <td>{data.projectEndDate}</td>
                                <td>{data.status}</td>
                                <td>{data.annualBudget}</td>
                                <td>{data.expenditure}</td>
                                <td>{data.remarks}</td>
                            </tr>
                        ))}

                        <tr>
                            <td />
                            <td>
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    onChange={handleActivityName}
                                    value={activityName}
                                    placeholder={'Name of Activity'}
                                />
                            </td>

                            <td>
                                <select
                                    value={priorityArea}
                                    onChange={handlePriorityArea}
                                    className={styles.inputElement}
                                >
                                    <option value="">Select Priority Area</option>
                                    {PriorityArea.map(data => (
                                        <option value={data.title}>
                                            {data.title}
                                        </option>
                                    ))}

                                </select>
                            </td>
                            <td>
                                <select
                                    value={priorityAction}
                                    onChange={handlePriorityAction}
                                    className={styles.inputElement}
                                >
                                    <option value="">Select Priority Action</option>
                                    {PriorityAction.map(data => (
                                        <option value={data.title}>
                                            {data.title}
                                        </option>
                                    ))}

                                </select>
                            </td>
                            <td>
                                <select
                                    value={priorityActivity}
                                    onChange={handlePriorityActivity}
                                    className={styles.inputElement}
                                >
                                    <option value="">Select Priority Activity</option>
                                    {PriorityActivity.map(data => (
                                        <option value={data.title}>
                                            {data.title}
                                        </option>
                                    ))}

                                </select>
                            </td>
                            <td>
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
                            </td>
                            {/* <td>
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    onChange={handleOtherFund}
                                    value={fundingType}
                                    placeholder={'Please specify Other source type'}
                                />
                            </td> */}
                            <td>
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
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    onChange={handleBudgetCode}
                                    value={budgetCode}
                                    placeholder={'Budget Code'}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    onChange={handleOrganisationName}
                                    value={organisationName}
                                    placeholder={'Name of Organisation'}
                                />
                            </td>
                            <td>
                                <NepaliDatePicker
                                    inputClassName="form-control"
                                    className={styles.datepicker}
                                    value={projstartDate}
                                    onChange={date => setStartDate(date)}
                                    options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                                />
                            </td>
                            <td>
                                <NepaliDatePicker
                                    inputClassName="form-control"
                                    className={styles.datepicker}
                                    value={projcompletionDate}
                                    onChange={date => setprojCompletionDate(date)}
                                    options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                                />
                            </td>
                            <td>
                                <select
                                    value={projStatus}
                                    onChange={handleprojStatus}
                                    className={styles.inputElement}
                                    placeholder={'Project Status'}
                                >
                                    <option value="select">Select an Option</option>
                                    <option value="Started">Started</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    onChange={handleAlocBudget}
                                    value={allocatedBudget}
                                    placeholder={'Allocated Project Budget'}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    onChange={handleActualExp}
                                    value={actualExp}
                                    placeholder={'Actual Expenditure'}
                                />
                            </td>
                            <td>
                                {' '}
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    onChange={handleRemarks}
                                    value={remarks}
                                    placeholder={'Remarks'}
                                />

                            </td>
                        </tr>

                    </>


                </tbody>
            </table>
            {/* <div className={styles.row}>
                    <div className={styles.inputContainer}>

                    </div>
                    <div className={_cs(styles.inputContainer, styles.ndrrsaContainer)}>

                    </div>

                    <div className={styles.inputContainer}>
                        <span className={styles.dpText}>Funding Type</span>


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


                                </div>
                            ) : ''

                    }

                    {showSourceTypeOther
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


                          </div>
                      )

                    }

                    <div className={styles.inputContainer}>


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


                    </div>

                    <div className={styles.inputContainer}>
                        <span className={styles.dpText}>Project Status</span>


                    </div>
                    <div className={styles.inputContainer}>
                        <span className={styles.dpText}>Project Start Date</span>


                    </div>
                    <div className={styles.inputContainer}>
                        <span className={styles.dpText}>
                                Project Completion Date
                        </span>


                    </div>
                    <div className={styles.inputContainer}>


                    </div>
                    <div className={styles.inputContainer}>


                    </div>
                    <div className={styles.inputContainer}>


                    </div>
                </div> */}
            {/* {props.budgetActivityData && props.budgetActivityData.length > 0
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


                } */}
            {paginationParameters && paginationParameters.count !== 0
&& (
    <div className={styles.paginationRight}>

        <ReactPaginate
            previousLabel={'prev'}
            nextLabel={'next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            onPageChange={handlePageClick}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            pageCount={Math.ceil(paginationParameters.count
                                        / paginationQueryLimit)}
            containerClassName={styles.pagination}
            subContainerClassName={_cs(styles.pagination)}
            activeClassName={styles.active}
        />
    </div>
)}
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

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            BudgetActivity,
        ),
    ),
);
