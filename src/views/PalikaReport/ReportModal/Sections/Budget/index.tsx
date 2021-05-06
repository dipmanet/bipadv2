/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';

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
} from '#selectors';
import NextPrevBtns from '../../NextPrevBtns';
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
});

const mapDispatchToProps = dispatch => ({
    setGeneralDatapp: params => dispatch(setGeneralDataAction(params)),
    setBudgetDatapp: params => dispatch(setBudgetDataAction(params)),
    setBudgetId: params => dispatch(setBudgetIdAction(params)),
});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    BudgetGetRequest: { url: '/annual-budget/',
        query: ({ params, props }) => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            fiscal_year: params.fiscalYear,
            district: params.district,
            municipality: params.municipality,
            province: params.province,
        }),
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;
            params.handlePendingState(false);
            if (params && params.finalAnnualBudgetData) {
                params.finalAnnualBudgetData(citizenReportList);
            }
        } },
    BudgetPostRequest: {
        url: '/annual-budget/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            params.budgetId(response);
            params.callGetApi(response);
        },
        onFailure: ({ error, params }) => {
            console.log('params:', params);
            params.body.handlePendingState(false);
            params.body.setErrors(error);
        },


    },

};

const currentFiscalYear = new Date().getFullYear() + 56;

const options = Array.from(Array(10).keys()).map(item => ({
    value: currentFiscalYear - item,
}));


const Budget = (props: Props) => {
    const {
        generalData,
        budgetData,
        updateTab,
        setBudgetDatapp,
        user, budgetId, setBudgetId,
    } = props;

    // setBudgetId({ id: 2 });
    const {
        municipalBudget: mb,
        drrFund: df,
        additionalFund: af,
    } = budgetData;
    const [municipalBudget, setmunicipalBudget] = useState('');
    const [drrFund, setdrrFund] = useState('');
    const [additionalFund, setadditionalFund] = useState('');
    const [province, setProvince] = useState(0);
    const [district, setDistrict] = useState(0);
    const [municipality, setMunicipality] = useState(0);
    const [budgetTitle, setBudgetTitle] = useState('Demo Budget Title');
    const [fiscal, setFiscal] = useState(1);
    const [annualBudgetData, setAnnualBudgetData] = useState([]);


    const [pending, setPending] = useState(false);
    const [postErrors, setPostErrors] = useState({});


    // const [fiscalYear, setFiscalYear] = useState(2);
    const { user: { profile }, requests: { BudgetPostRequest, BudgetGetRequest } } = props;
    const handlePending = (data: boolean) => {
        setPending(data);
    };
    const handleErrors = (errors) => {
        setPostErrors(errors);
    };

    const handleSaveAnnualBudgetData = (response) => {
        setAnnualBudgetData(response);
    };

    BudgetGetRequest.setDefaultParams({
        fiscalYear: generalData.fiscalYear,
        district: profile.district,
        municipality: profile.municipality,
        province: profile.province,
        finalAnnualBudgetData: handleSaveAnnualBudgetData,
        handlePendingState: handlePending,


    });

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


    const handleMunicipalBudget = (budgetVal) => {
        setmunicipalBudget(budgetVal.target.value);
    };
    const handleDRRFund = (fundVal) => {
        setdrrFund(fundVal.target.value);
    };
    const handleAddFund = (addFundVal) => {
        setadditionalFund(addFundVal.target.value);
    };

    const handleDataSave = () => {
        setBudgetDatapp({
            municipalBudget,
            drrFund,
            additionalFund,
        });
        updateTab();
    };


    const handleBudgetId = (response) => {
        setBudgetId({ id: response.id });
    };

    const handleCallGetApi = (response) => {
        BudgetGetRequest.do({
            fiscalYear: generalData.fiscalYear,
            district: profile.district,
            municipality: profile.municipality,
            province: profile.province,
            finalAnnualBudgetData: handleSaveAnnualBudgetData,
            handlePendingState: handlePending,
            setErrors: handleErrors,

        });
    };

    const handleNextClick = () => {
        if (!annualBudgetData.length) {
            BudgetPostRequest.do({

                body: {
                    title: budgetTitle,
                    totalBudgetNrs: Number(drrFund),
                    disasterBudgetNrs: Number(municipalBudget),
                    otherBudgetNrs: Number(additionalFund),
                    fiscalYear: generalData.fiscalYear,
                    province,
                    district,
                    municipality,
                    handlePendingState: handlePending,
                    setErrors: handleErrors,
                },
                budgetId: handleBudgetId,
                callGetApi: handleCallGetApi,

            });
        } else {
            const {
                totalBudgetNrs,
                disasterBudgetNrs,
                otherBudgetNrs,
            } = annualBudgetData[0];
            setBudgetDatapp({
                municipalBudget: totalBudgetNrs,
                drrFund: disasterBudgetNrs,
                additionalFund: otherBudgetNrs,
            });
        }
    };

    const handleChange = (e) => {
        setProvince(e.target.value);
    };
    useEffect(() => {
        if (annualBudgetData.length > 0) {
            setBudgetTitle(annualBudgetData[0].title);
            setdrrFund(annualBudgetData[0].disasterBudgetNrs);
            setmunicipalBudget(annualBudgetData[0].totalBudgetNrs);
            setadditionalFund(annualBudgetData[0].otherBudgetNrs);
        }


    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [annualBudgetData]);

    // useEffect(() => {
    //     if (budgetId.id) {
    //         props.handleNextClick();
    //     }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [budgetId.id]);
    return (
        <>
            {' '}
            {
                pending
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
                            {
                                !props.previewDetails

            && (
                <div>

                    <h2>Budget</h2>
                    <div className={styles.palikaTable}>
                        <table id="table-to-xls">
                            <tbody>


                                <>
                                    {annualBudgetData.length > 0
                                        ? (
                                            <tr>

                                                <th>SN</th>


                                                <th>
                                    Total municipal budget


                                                </th>
                                                <th>
                                    DRR fund of municipality


                                                </th>
                                                <th>
                                    Other DRR related funding


                                                </th>
                                                <th>
                                Updated By


                                                </th>
                                                <th>
                                    Updated On


                                                </th>


                                            </tr>
                                        ) : (
                                            <tr>

                                                <th>SN</th>


                                                <th>
    Total municipal budget


                                                </th>
                                                <th>
    DRR fund of municipality


                                                </th>
                                                <th>
    Other DRR related funding


                                                </th>


                                            </tr>
                                        )}
                                    {annualBudgetData.length > 0 ? annualBudgetData.map((item, i) => (
                                        <tr key={item.id}>
                                            <td>{i + 1}</td>
                                            <td>{item.totalBudgetNrs}</td>
                                            <td>{item.disasterBudgetNrs}</td>
                                            <td>{item.otherBudgetNrs}</td>
                                            <td>{item.updatedBy}</td>
                                            <td>{item.modifiedOn}</td>


                                        </tr>
                                    )) : (
                                        <tr>
                                            <td>1</td>
                                            <td>
                                                <input type="text" value={municipalBudget} placeholder="Total Budget" onChange={handleMunicipalBudget} />
                                                {' '}
                                            </td>
                                            <td>
                                                <input type="text" value={drrFund} placeholder="Disaster Budget" onChange={handleDRRFund} />
                                                {' '}
                                            </td>
                                            <td>
                                                <input type="text" value={additionalFund} placeholder="Other Budget" onChange={handleAddFund} />
                                                {' '}
                                            </td>


                                        </tr>
                                    )
                                    }


                                </>


                            </tbody>
                        </table>
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
                            <>
                                {annualBudgetData.length === 0
                                && (
                                    <button
                                        type="button"
                                        className={styles.savebtn}
                                        onClick={handleNextClick}
                                    >
                                        <Icon
                                            name="plus"
                                            className={styles.plusIcon}
                                        />
                    Add New Budget
                                    </button>
                                )}

                                <NextPrevBtns
                                    handlePrevClick={props.handlePrevClick}
                                    handleNextClick={props.handleNextClick}
                                    // disabled={!(annualBudgetData.length > 0)}
                                />

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
                            <h2>Budget</h2>
                            <div className={styles.budgetDetailsContainer}>

                                <div className={styles.budgetDetails}>
                                    <ul>
                                        <li>
                                            <h2>
                                                Rs.
                                                {' '}
                                                {municipalBudget || 'No data'}
                                            </h2>
                                        </li>
                                        <li>
                                            <span className={styles.light}>Municipal Budget</span>
                                        </li>
                                    </ul>
                                    <ul>
                                        <li>
                                            <span className={styles.lighter}>
                                                {(Number(drrFund) / Number(municipalBudget) * 100).toFixed(0)}
                                                {'%'}
                                                {' '}
                                            of municipal budget
                                            </span>
                                        </li>
                                        <li>
                                            <h2>
                                            Rs.
                                                {' '}
                                                {drrFund}
                                            </h2>

                                        </li>
                                        <li>
                                            <span className={styles.light}>
                                             DRR Fund of Municipality
                                            </span>

                                        </li>
                                    </ul>
                                </div>
                                <div className={styles.budgetDetails}>
                                    <ul>
                                        <li>
                                            <h2>
                                                Rs.
                                                {' '}
                                                {additionalFund || 0}
                                            </h2>
                                        </li>
                                        <li>
                                            <span className={styles.light}>
                                            Other sources of DRR funding
                                            </span>
                                        </li>
                                    </ul>
                                </div>


                            </div>
                        </div>
                    )
                            }
                        </div>
                    )
            }
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Budget,
        ),
    ),
);
