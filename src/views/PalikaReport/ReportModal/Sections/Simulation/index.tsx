import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import styles from './styles.scss';
import 'nepali-datepicker-reactjs/dist/index.css';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import {
    setGeneralDataAction,
    setBudgetDataAction,
    setBudgetIdAction,
} from '#actionCreators';
import {
    generalDataSelector,
    budgetDataSelector,
    userSelector, budgetIdSelector,
    hazardTypeListSelector,
} from '#selectors';
import NextPrevBtns from '../../NextPrevBtns';
import priorityData from '#views/PalikaReport/components/priorityDropdownSelectData';
import Hazard from '#views/RiskInfo/LeftPane/Details/Hazard';
import Icon from '#rscg/Icon';

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

const mapStateToProps = state => ({
    generalData: generalDataSelector(state),
    budgetData: budgetDataSelector(state),
    user: userSelector(state),
    budgetId: budgetIdSelector(state),
    hazardType: hazardTypeListSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setGeneralDatapp: params => dispatch(setGeneralDataAction(params)),
    setBudgetDatapp: params => dispatch(setBudgetDataAction(params)),
    setBudgetId: params => dispatch(setBudgetIdAction(params)),
});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    SimulationGetRequest: { url: '/simulation/',
        query: ({ params, props }) => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            fiscal_year: params.fiscalYear,
            district: params.district,
            municipality: params.municipality,
            province: params.province,
            ordering: params.id,
        }),
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;

            if (params && params.finalsetSimulationData) {
                params.finalsetSimulationData(citizenReportList);
            }
        } },
    SimulationPostRequest: {
        url: '/simulation/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            params.submittedData(response);
        },


    },

};

const currentFiscalYear = new Date().getFullYear() + 56;

const options = Array.from(Array(10).keys()).map(item => ({
    value: currentFiscalYear - item,
}));
const PriorityArea = priorityData.Data.filter(data => data.level === 0);
const PriorityAction = priorityData.Data.filter(data => data.level === 1);
const PriorityActivity = priorityData.Data.filter(data => data.level === 2);
let finalArr = [];
const Simulation = (props: Props) => {
    const {
        generalData,
        budgetData,
        updateTab,
        setBudgetDatapp,
        user, budgetId, setBudgetId,
        hazardType,
    } = props;

    // setBudgetId({ id: 2 });
    const {
        municipalBudget: mb,
        drrFund: df,
        additionalFund: af,
    } = budgetData;
    const [submittedData, setSubmittedData] = useState();
    const [municipalBudget, setMunicipalBudget] = useState(mb);
    const [description, setDescription] = useState('');
    const [simulationName, setSimulationName] = useState('');
    const [organizer, setOrganizer] = useState('');
    const [participants, setParticipants] = useState(null);
    const [hazard, setHazard] = useState([]);
    const [drrFund, setdrrFund] = useState(df);
    const [additionalFund, setadditionalFund] = useState(af);
    const [province, setProvince] = useState(0);
    const [district, setDistrict] = useState(0);
    const [municipality, setMunicipality] = useState(0);
    const [budgetTitle, setBudgetTitle] = useState('Demo Budget Title');
    const [fiscal, setFiscal] = useState(1);
    const [annualBudgetData, setAnnualBudgetData] = useState([]);
    const [simulationData, setSimulationData] = useState([]);
    const [priorityAction, setPriorityAction] = useState('');
    const [priorityActivity, setPriorityActivity] = useState('');
    const [priorityArea, setpriorityArea] = useState('');
    const [focusHazard, setFocusHazard] = useState(null);
    const [startDate, setStartDate] = useState('');
    // const [fiscalYear, setFiscalYear] = useState(2);
    const { user: { profile },
        requests: { SimulationPostRequest,
            SimulationGetRequest,

            HazardGetRequest } } = props;
    const handleSubmittedData = (response) => {
        setSubmittedData(response);
        setDescription('');
        setSimulationName('');
        setOrganizer('');
        setParticipants(null);
        setPriorityAction('');
        setPriorityActivity('');
        setpriorityArea('');
        setFocusHazard(null);
        setStartDate('');
    };
    const handleSavesetSimulationData = (response) => {
        setSimulationData(response);
    };
    const handleHazardData = (response) => {
        setHazard(response);
    };
    SimulationGetRequest.setDefaultParams({
        fiscalYear: generalData.fiscalYear,
        district: profile.district,
        municipality: profile.municipality,
        province: profile.province,
        finalsetSimulationData: handleSavesetSimulationData,
        id: '-id',

    });
    // HazardGetRequest.setDefaultParams({
    //     hazardData: handleHazardData,
    // });

    const handleSelectedProvince = (response) => {
        const selectedProvince = response.filter(item => item.id === profile.district);

        setProvince(selectedProvince[0].province);
        setDistrict(profile.district);
        setMunicipality(profile.municipality);
    };
    useEffect(() => {
        setProvince(profile.province);
        setDistrict(profile.district);
        setMunicipality(profile.municipality);
    }, [profile.district, profile.municipality, profile.province]);


    const handleSimulationName = (e) => {
        setSimulationName(e.target.value);
    };
    const handleOrganizer = (e) => {
        setOrganizer(e.target.value);
    };
    const handleNumberOfParticipants = (e) => {
        setParticipants(e.target.value);
    };
    const handlePriorityArea = (e) => {
        setpriorityArea(e.target.value);
    };
    const handlePriorityAction = (e) => {
        setPriorityAction(e.target.value);
    };
    const handlePriorityActivity = (e) => {
        setPriorityActivity(e.target.value);
    };
    const handleFocusHazard = (e) => {
        setFocusHazard(e.target.value);
    };
    const handleSimulationDescription = (e) => {
        setDescription(e.target.value);
    };
    const handleDataSave = () => {
        setBudgetDatapp({
            municipalBudget,
            drrFund,
            additionalFund,
        });
        updateTab();
    };
    const selectStyles = {
        option: (provided, state) => ({
            ...provided,
            borderBottom: '1px dotted gray',
            color: state.isSelected ? 'white' : 'gray',
            padding: 10,
        }),
        control: () => ({
            // none of react-select's styles are passed to <Control />
            width: 200,
        }),
        singleValue: (provided, state) => {
            const opacity = state.isDisabled ? 0.5 : 1;
            const transition = 'opacity 900ms';

            return { ...provided, opacity, transition };
        },
    };
    const handleBudgetId = (response) => {
        setBudgetId({ id: response.id });
    };
    const handleNextClick = () => {
        // if (!annualBudgetData.length) {
        //     SimulationPostRequest.do({

        //         body: {
        //             title: budgetTitle,
        //             totalBudgetNrs: Number(drrFund),
        //             disasterBudgetNrs: Number(municipalBudget),
        //             otherBudgetNrs: Number(additionalFund),
        //             fiscalYear: fiscal,
        //             province,
        //             district,
        //             municipality,
        //         },
        //         budgetId: handleBudgetId,

        //     });
        // } else {
        //     setBudgetId({ id: annualBudgetData[0].id });
        // }
        props.handleNextClick();
    };

    useEffect(() => {
        if (simulationData) {
            const finalSimulationData = simulationData.map((data) => {
                const FinalHazard = hazardType.find(item => item.id === data.focusHazard);
                if (FinalHazard) {
                    return {
                        HazardName: FinalHazard.titleEn,
                        data,
                    };
                }
                return null;
            });
            finalArr = [...new Set(finalSimulationData)];
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [simulationData]);

    const handleChange = (e) => {
        setProvince(e.target.value);
    };
    const handleDataSubmittedResponse = (response) => {
        setDescription('');
        setSimulationName('');
        setOrganizer('');
        setParticipants(null);
        setPriorityAction('');
        setPriorityActivity('');
        setpriorityArea('');
        setFocusHazard(null);
    };
    const handleAddNew = () => {
        SimulationPostRequest.do({
            body: {
                title: simulationName,
                description,
                priorityArea,
                priorityAction,
                priorityActivity,
                organizer,
                totalParticipants: participants,
                date: startDate,
                fiscalYear: generalData.fiscalYear,
                province,
                district,
                municipality,
                focusHazard,
            },
            submittedData: handleSubmittedData,


        });
    };
    useEffect(() => {
        SimulationGetRequest.do({
            fiscalYear: generalData.fiscalYear,
            district: profile.district,
            municipality: profile.municipality,
            province: profile.province,
            id: '-id',
            finalsetSimulationData: handleSavesetSimulationData,

        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submittedData]);
    // useEffect(() => {
    //     if (annualBudgetData.length > 0) {
    //         setBudgetTitle(annualBudgetData[0].title);
    //         setdrrFund(annualBudgetData[0].disasterBudgetNrs);
    //         setmunicipalBudget(annualBudgetData[0].totalBudgetNrs);
    //         setadditionalFund(annualBudgetData[0].otherBudgetNrs);
    //     }


    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [annualBudgetData]);

    // useEffect(() => {
    //     if (budgetId.id) {
    //         props.handleNextClick();
    //     }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [budgetId.id]);
    return (
        <>
            {
                !props.previewDetails
            && (
                <div className={styles.mainDiv}>
                    <h2>Simulations</h2>
                    <div className={styles.palikaTable}>
                        <table id="table-to-xls">
                            <tbody>
                                <>
                                    <tr>
                                        <th>SN</th>
                                        <th>
                                            Name of Simulation excerise
                                        </th>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>
                                            Priority Area
                                        </th>
                                        <th>
                                            Priority Action
                                        </th>
                                        <th>
                                            Priority Acitivity
                                        </th>
                                        <th>
                                            Organizer
                                        </th>
                                        <th>
                                            Number of Participants
                                        </th>
                                        <th>
                                            Focused Hazard
                                        </th>


                                    </tr>
                                    {finalArr && finalArr.map((item, i) => (
                                        <tr key={item.data.id}>
                                            <td>{i + 1}</td>
                                            <td>{item.data.title}</td>
                                            <td>{item.data.date}</td>
                                            <td>{item.data.description}</td>
                                            <td>{item.data.priorityArea}</td>
                                            <td>{item.data.priorityAction}</td>
                                            <td>{item.data.priorityActivity}</td>
                                            <td>{item.data.organizer}</td>
                                            <td>{item.data.totalParticipants}</td>
                                            <td>{item.HazardName}</td>
                                        </tr>
                                    ))}
                                    {
                                        !props.annex
                                        && (
                                            <tr>
                                                <td />
                                                <td>
                                                    <input type="text" value={simulationName} placeholder="Simulation Name" onChange={handleSimulationName} />
                                                    {' '}
                                                </td>
                                                <td>
                                                    <NepaliDatePicker
                                                        inputClassName="form-control"
                                                        className={styles.datepicker}
                                                        value={startDate}
                                                        onChange={date => setStartDate(date)}
                                                        options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                                                    />
                                                </td>
                                                <td>
                                                    <input type="text" value={description} placeholder="Simulation Description" onChange={handleSimulationDescription} />
                                                    {' '}
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
                                                    <input type="text" value={organizer} placeholder="Organizer" onChange={handleOrganizer} />
                                                    {' '}
                                                </td>
                                                <td>
                                                    <input type="number" value={participants} placeholder="Participants" onChange={handleNumberOfParticipants} />
                                                    {' '}
                                                </td>
                                                <td>
                                                    <select
                                                        value={focusHazard}
                                                        onChange={handleFocusHazard}
                                                        className={styles.inputElement}
                                                    >
                                                        <option value="">Select Priority Activity</option>
                                                        {hazardType && hazardType.map(data => (
                                                            <option value={data.id}>
                                                                {data.titleEn}
                                                            </option>
                                                        ))}

                                                    </select>
                                                </td>

                                            </tr>
                                        )
                                    }


                                </>


                            </tbody>
                        </table>
                        {
                            !props.annex
                          && (
                              <>
                                  <button
                                      type="button"
                                      onClick={handleAddNew}
                                      className={styles.savebtn}
                                  >
                                      <Icon
                                          name="plus"
                                          className={styles.plusIcon}
                                      />
                                Add New Simulation
                                  </button>
                                  <div className={styles.btns}>
                                      <NextPrevBtns
                                          handlePrevClick={props.handlePrevClick}
                                          handleNextClick={handleNextClick}
                                      />

                                  </div>
                              </>
                          )
                        }
                    </div>
                </div>
            )
            }

            {
                props.previewDetails
                && (
                    <div className={styles.budgetPreviewContainer}>
                        <h2>
                             Simulations
                        </h2>
                        <div className={styles.simElementsContainer}>
                            <div className={styles.simElements}>
                                <div className={styles.circlePatch}>
                            22
                                </div>
                                <p className={styles.simDesc}>
                            No. of simulation
                                    {' '}
                                    <br />
                            conducted
                                </p>
                            </div>
                            <div className={styles.simElements}>
                                <div className={styles.circlePatch}>
                            10
                                </div>
                                <p className={styles.simDesc}>
                            No. of people
                                    {' '}
                                    <br />
                            trained
                                </p>
                            </div>


                        </div>
                    </div>
                )}
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Simulation,
        ),
    ),
);
