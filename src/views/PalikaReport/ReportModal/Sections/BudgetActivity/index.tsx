/* eslint-disable indent */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import ReactPaginate from 'react-paginate';
import { isDefined, _cs } from '@togglecorp/fujs';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend } from 'recharts';
import Loader from 'react-loader-spinner';
import priorityData from '#views/PalikaReport/components/priorityDropdownSelectData';
import fsdata from '../../data';

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
            // limit: params.page,
            ordering: params.id,
            // offset: params.offset,
        }),
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;
            params.handlePendingState(false);
            if (params && params.budgetActivities) {
                params.budgetActivities(citizenReportList);
            }
            if (params && params.paginationParameters) {
                params.paginationParameters(response);
            }
        } },
    BudgetActivityPostRequest: {
        url: '/annual-budget-activity/',

        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            params.dataSubmitted(response);
            params.handlePendingState(false);
        },
        onFailure: ({ error, params }) => {
            console.log('params:', params);
            params.body.handlePendingState(false);
            params.body.setErrors(error);
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


const COLORS = ['rgb(0,117,117)', 'rgb(198,233,232)'];
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

    const {
        municipalBudget,
        drrFund,
        additionalFund,
    } = budgetData;

    const chartdata = [
        { name: 'DRR funding of municipality', value: Number(drrFund) },
        { name: 'Other DRR related funding', value: Number(additionalFund) },
    ];

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


    const [pending, setPending] = useState(false);
    const [postErrors, setPostErrors] = useState({});
    const [parent, setParent] = useState(1);
    const [otherSubtype, setSubtype] = useState('');
    const [showInfo, setShowInfo] = useState(false);

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
    const [priorityActionData, setPData] = useState([]);
    const [priorityActivityData, setAData] = useState([]);

    const handleInfoBtn = () => {
        setShowInfo(!showInfo);
    };
    const handlePending = (data: boolean) => {
        setPending(data);
    };
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
    const handleErrors = (errors) => {
        setPostErrors(errors);
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
        handlePendingState: handlePending,
        setErrors: handleErrors,


    });
    const handlePageClick = (e) => {
        const selectedPage = e.selected + 1;
        setOffset((selectedPage - 1) * paginationQueryLimit);
        setCurrentPageNumber(selectedPage);
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
            handlePendingState: handlePending,
            setErrors: handleErrors,


        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);
    useEffect(() => {
        if (budgetData.additionalFund && parseInt(budgetData.additionalFund, 10) > 0) {
            setSourceType(true);
        }
    }, [budgetData]);
    const handleOtherSubType = (data) => {
        setSubtype(data.target.value);
    };
    const handleNext = () => {
        updateTab();
    };
    const handleAreaOfImplementation = (data) => {
        setareaofImplementation(data.target.value);
    };
    const handleAddNew = () => {
        setPending(true);
        setPostErrors({});
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
                handlePendingState: handlePending,
                setErrors: handleErrors,


            },
            budgetActivities: handleBudgetActivities,
            dataSubmitted: handleDataSubmittedResponse,
        });
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
                handlePendingState: handlePending,
                setErrors: handleErrors,

            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSubmittedResponse]);
<<<<<<< HEAD
=======

    console.log(priorityData.Data);
    console.log('This priority data', priorityData);
>>>>>>> e2785927baa919134b1e92ba939ad67ba0b2e48c
    const PriorityArea = priorityData.Data.filter(data => data.level === 0);
    const PriorityAction = priorityData.Data.filter(data => data.parent === parent);
    const PriorityActivity = priorityData.Data.filter(data => data.level === 2);

    const handlePriorityArea = (e) => {
        console.log('priorityArea:', e.target.value);
        setpriorityArea(e.target.value);
        const obj = priorityData.Data.filter(item => item.title === e.target.value);
        setParent(obj.sn);
        // console.log('our SN', obj);
        setPData(priorityData.Data.filter(item => item.parent === Number(obj[0].ndrrsapid)));
        // console.log('our obj', priorityData.Data.filter(item => item.parent === obj.sn));
    };

    const handlePriorityAction = (e) => {
        console.log('action:', e.target.value);

        setPriorityAction(e.target.value);
        const obj = priorityData.Data.filter(item => item.title === e.target.value);
        // setSubParent(obj.sn);
        setAData(priorityData.Data.filter(item => item.parent === Number(obj[0].ndrrsapid)));
    };
    const handlePriorityActivity = (e) => {
        setPriorityActivity(e.target.value);
    };
    const handlefundingType = (data) => {
        if (data.target.value === 'Others') {
            setSourceTypeOther(true);
            setfundingType('Others');
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
        console.log('errs:', postErrors);
    }, [postErrors]);
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
    const budgetName = fsdata.fiscalYear.filter(item => item.id === Number(generalData.fiscalYear))[0].titleEn;


    return (
        <>
            {pending
                ? (
                    <div className={styles.loaderClass}>

                        <Loader
                            type="TailSpin"
                            color="#00BFFF"
                            height={50}
                            width={50}
                            timeout={10000}

                        />
                    </div>
                )
                : (
                    <div>
                        {!props.previewDetails && !props.monitoringDetails
           && (
               <div className={styles.mainPageDetailsContainer}>
                   <h2>{`Budget Activities for Fiscal Year 0XX/0YY${budgetName}`}</h2>
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

                                       <button
                                           type="button"
                                           className={styles.infoBtn}
                                           onClick={handleInfoBtn}
                                       >
                                           <Icon
                                               name="info"
                                               className={styles.infoIcon}
                                           />
                                       </button>

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
                                   {
                                       showSourceTypeOther
                                    && (
                                        <th>
                                           Other Fund Type

                                        </th>
                                    )
                                   }
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
                                       <td>
                                           {
                                               data.priorityArea

                                           }
                                       </td>
                                       <td>{data.priorityAction}</td>
                                       <td>{data.priorityActivity}</td>
                                       {/* <td>{data.priorityArea}</td> */}
                                       <td>{data.fundType}</td>
                                       <td>{data.fundType}</td>
                                       <td>{data.donerOrganization}</td>
                                       <td>{data.budgetCode}</td>
                                       <td>{data.projectStartDate}</td>
                                       <td>{data.projectEndDate}</td>
                                       <td>{data.status}</td>
                                       <td>{data.annualBudget}</td>
                                       <td>{data.expenditure}</td>
                                       <td>{data.remarks}</td>
                                   </tr>
                               ))}
                               { !props.annex
                               && (
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
                                               {priorityActionData.map(data => (
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
                                               {priorityActivityData.map(data => (
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

                                       <td>
                                           {
                                               fundSource === 'DRR Fund of Muicipality'
                                              && (
                                                  <input
                                                      type="text"
                                                      className={styles.inputElement}
                                                      value={'Municipal Government'}
                                                      disabled
                                                  />
                                              )}

                                           {
                                               fundSource === 'Other DRR related funding'
                                                  && (
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
                                                  )
                                           }

                                       </td>
                                       {
                                           showSourceTypeOther
                                           && (
                                               <td>
                                                   <input
                                                       type="text"
                                                       className={styles.inputElement}
                                                       value={otherSubtype}
                                                       onChange={handleOtherSubType}
                                                       placeholder={'Please Specify'}
                                                   />
                                               </td>
                                           )
                                       }
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
                                           <input
                                               type="text"
                                               className={styles.inputElement}
                                               onChange={handleBudgetCode}
                                               value={budgetCode}
                                               placeholder={'Budget Code (if available)'}
                                           />
                                       </td>

                                       <td>
                                           <NepaliDatePicker
                                               inputClassName="form-control"
                                               className={styles.datepicker}
                                               value={projstartDate}
                                               onChange={date => setStartDate(date)}
                                               options={{ calenderLocale: 'en', valueLocale: 'en' }}
                                           />
                                       </td>
                                       <td>
                                           <NepaliDatePicker
                                               inputClassName="form-control"
                                               className={styles.datepicker}
                                               value={projcompletionDate}
                                               onChange={date => setprojCompletionDate(date)}
                                               options={{ calenderLocale: 'en', valueLocale: 'en' }}
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
                                       {
                                           !props.annex
                                            && (
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
                                            )
                                       }
                                   </tr>

                               )
                               }

                           </>


                       </tbody>
                   </table>
                   <div className={styles.drrsLink}>
                       {
                           showInfo
                           && (
                               <>
                                   <p>
                            The Disaster Risk Reduction
                            National Strategic
                            Plan of Action
                            2018 – 2030 adopting the Sendai Framework for Disaster Risk Reduction as a main
                            guidance, has identified 4 priority areas and 18 priority actions.
                            The activities will be monitored based on the these priorities set.
                                   </p>
                                   <p>
                            Get the action plan :
                                       <a
                                           href="https://bit.ly/3vLWgW4"
                                           target="_blank"
                                           rel="noopener noreferrer"
                                       >
                                           {'here'}
                                       </a>
                                   </p>
                               </>
                           )
                       }

                   </div>
                   {
                       Object.keys(postErrors).length > 0
                        && (
                            <ul>
                                <li>
                                    <span className={styles.errorHeading}>
                                    Please fix the following errors:
                                    </span>
                                </li>
                                {
                                    Object.keys(postErrors.response).map(errorItem => (
                                        <li>
                                            {`${errorItem}: ${postErrors.response[errorItem]}`}
                                        </li>
                                    ), // return <li>Please enter valid info in all fields</li>;
                                    )
                                }

                            </ul>
                        )
                   }
                   {
                       !props.annex
                       && (
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
                       )
                   }
               </div>
           )

                        }

                        {props.previewDetails
               && (
                   <div className={styles.budgetActPreviewContainer}>
                       <h2>Budget Activity</h2>
                       <div className={styles.budgetActChartContainer}>

                           <PieChart width={200} height={200}>
                               <Pie
                                   data={chartdata}
                                   cx={90}
                                   cy={95}
                                   innerRadius={40}
                                   outerRadius={80}
                                   fill="#8884d8"
                                   paddingAngle={1}
                                   dataKey="value"
                                   startAngle={90}
                                   endAngle={450}
                               >
                                   {chartdata.map((entry, index) => (
                                       // eslint-disable-next-line react/no-array-index-key
                                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                   ))}
                               </Pie>
                           </PieChart>

                           <div className={styles.legend}>
                               <div className={styles.activitiesAmt}>
                                   <span className={styles.light}>
                                       Total no. of activities
                                       {' '}
                                   </span>
                                   <span className={styles.biggerNum}>
                                       {budgetActivities.length > 0
                                           ? budgetActivities.length
                                           : 0
                                       }
                                   </span>
                               </div>
                               <div className={styles.legenditem}>

                                   <div className={styles.legendColorContainer}>
                                       <div
                                           style={{ backgroundColor: COLORS[0] }}
                                           className={styles.legendColor}
                                       />
                                   </div>
                                   <div className={styles.numberRow}>
                                       <ul>
                                           <li>
                                               <span className={styles.bigerNum}>
                                                   {
                                                       (Number(drrFund)
                                                   / (Number(drrFund)
                                                   + Number(additionalFund))
                                                   * 100).toFixed(0)
                                                   }
                                                   {
                                                       '%'
                                                   }

                                               </span>
                                           </li>
                                           <li className={styles.light}>
                                               <span>DRR Funding of Municipality</span>
                                           </li>
                                       </ul>
                                   </div>
                               </div>
                               <div className={_cs(styles.legenditem, styles.bottomRow)}>
                                   <div className={styles.legendColorContainer}>
                                       <div
                                           style={{ backgroundColor: COLORS[1] }}
                                           className={styles.legendColor}
                                       />
                                   </div>

                                   <div className={styles.numberRow}>
                                       <ul>
                                           <li>
                                               <span className={styles.bigerNum}>

                                                   {
                                                       (Number(additionalFund)
                                                   / (Number(drrFund)
                                                   + Number(additionalFund))
                                                   * 100).toFixed(0)
                                                   }
                                                   {
                                                       '%'
                                                   }
                                               </span>
                                           </li>
                                           <li className={styles.light}>
                                               <span>Other DRR related Funding</span>
                                           </li>
                                       </ul>
                                   </div>
                               </div>
                           </div>
                       </div>

                   </div>
               )

                        }

                        {props.monitoringDetails
               && (
                   <div className={styles.budgetActPreviewContainer}>

                       <ul>
                           <li>
                               <span className={styles.darkerText}>
                             Monitoring the activities based on the Priority Areas
                               </span>
                           </li>
                           <li>
                               <span className={styles.smallerText}>
                               Disaster Risk Reduction National Strategic Plan of Action 2018-2039
                               </span>
                           </li>
                       </ul>

                       <div className={styles.monitoringRow}>
                           <div className={styles.monitoringItem}>
                               <span className={styles.monTitle}>Area1</span>
                               <span className={styles.monDesc}>Understanding Disaster Risk</span>
                               <div className={styles.scorePatch}>
                                   {budgetActivities.length > 0
                                       ? budgetActivities.filter(item => item.priorityArea.includes('Priority Area 1')).length
                                       : 0
                                   }
                               </div>
                           </div>
                           <div className={styles.monitoringItem}>
                               <span className={styles.monTitle}>Area2</span>
                               <span className={styles.monDesc}>Understanding Disaster Risk</span>
                               <div className={styles.scorePatch}>
                                   {budgetActivities.length > 0
                                       ? budgetActivities.filter(item => item.priorityArea.includes('Priority Area 2')).length
                                       : 0
                                   }
                               </div>
                           </div>
                       </div>
                       <div className={styles.monitoringRow}>
                           <div className={styles.monitoringItem}>
                               <span className={styles.monTitle}>Area3</span>
                               <span className={styles.monDesc}>
                                       Promoting Comprehensive
                                       Risk-Informed Private and Public
                                       Investments in Disaster Risk Reduction
                                       for Resilience
                               </span>
                               <div className={styles.scorePatch}>
                                   {budgetActivities.length > 0

                                       ? budgetActivities.filter(item => item.priorityArea.includes('Priority Area 3')).length
                                       : 0
                                   }
                               </div>
                           </div>
                           <div className={styles.monitoringItem}>
                               <span className={styles.monTitle}>Area4</span>
                               <span className={styles.monDesc}>
                                       Enhancing Disaster Preparedness for
                                       Effective Response and to &quot; Build Back Better &quot;
                                       in Recovery, Rehabilitation and Reconstruction
                               </span>
                               <div className={styles.scorePatch}>
                                   {budgetActivities.length > 0
                                       ? budgetActivities.filter(item => item.priorityArea.includes('Priority Area 4')).length
                                       : 0
                                   }
                               </div>
                           </div>
                       </div>
                   </div>

               )

                        }

                    </div>
                )}
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            BudgetActivity,
        ),
    ),
);
