/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
// import Loader from 'react-loader-spinner';
import Loader from 'react-loader';
import { ADToBS } from 'bikram-sambat-js';
import styles from './styles.scss';
import 'nepali-datepicker-reactjs/dist/index.css';
import Gt from '../../../../utils';
import Translations from '../../../../Translations';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
import {
    setGeneralDataAction,
    setBudgetDataAction,
    setBudgetIdAction,
    setDrrmRegionAction,
    setDrrmProgressAction,
} from '#actionCreators';
import {
    generalDataSelector,
    budgetDataSelector,
    userSelector,
    budgetIdSelector,
    drrmRegionSelector,
    drrmProgresSelector,
    palikaLanguageSelector,
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
    drrmRegion: drrmRegionSelector(state),
    drrmProgress: drrmProgresSelector(state),
    drrmLanguage: palikaLanguageSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setGeneralDatapp: params => dispatch(setGeneralDataAction(params)),
    setBudgetDatapp: params => dispatch(setBudgetDataAction(params)),
    setBudgetId: params => dispatch(setBudgetIdAction(params)),
    setdrrmRegion: params => dispatch(setDrrmRegionAction(params)),
    setProgress: params => dispatch(setDrrmProgressAction(params)),
});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {

    BudgetGetRequest: { url: '/annual-budget/',
        query: ({ params, props }) => ({
            // district: params.district,
            // municipality: params.municipality,
            // province: params.province,
            // eslint-disable-next-line @typescript-eslint/camelcase
            fiscal_year: params.fiscalYear,
            province: params.province,
            district: params.district,
            municipality: params.municipality,
        }),
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;
            // params.handlePendingState(false);
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
            params.body.handlePendingState(false);
            params.body.setErrors(error);
        },


    },
    BudgetPutRequest: {
        url: ({ params }) => `/annual-budget/${params.id}/`,
        method: methods.PUT,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            params.budgetId(response);
            params.callGetApi(response);
        },
        onFailure: ({ error, params }) => {
            console.log('params:', params);
        },


    },

};

const currentFiscalYear = new Date().getFullYear() + 56;

const options = Array.from(Array(10).keys()).map(item => ({
    value: currentFiscalYear - item,
}));

let province = 0;
let district = 0;
let municipality = 0;

const Budget = (props: Props) => {
    const {
        generalData,
        budgetData,
        updateTab,
        setBudgetDatapp,
        user, budgetId, setBudgetId,
        drrmRegion,
        setProgress,
        drrmProgress,
        drrmLanguage,
    } = props;

    const [municipalBudget, setmunicipalBudget] = useState('');
    const [drrFund, setdrrFund] = useState('');
    const [additionalFund, setadditionalFund] = useState('');
    const [budgetTitle, setBudgetTitle] = useState('Demo Budget Title');
    const [annualBudgetData, setAnnualBudgetData] = useState([]);
    const [loader, setLoader] = useState(true);
    const [pending, setPending] = useState(false);
    const [postErrors, setPostErrors] = useState({});
    const [editBudget, setEditBudget] = useState(false);
    const [totalMun, setTotalMun] = useState(false);
    const [drrfundInfo, setDrrFundInfo] = useState(false);
    const [otherFunding, setOtherFunding] = useState(false);


    // const [fiscalYear, setFiscalYear] = useState(2);
    const { user: { profile }, requests: { BudgetPostRequest, BudgetGetRequest, BudgetPutRequest } } = props;

    if (drrmRegion.municipality) {
        municipality = drrmRegion.municipality;
        district = drrmRegion.district;
        province = drrmRegion.province;
    } else {
        municipality = user.profile.municipality;
        district = user.profile.district;
        province = user.profile.province;
    }

    const handlePending = (data: boolean) => {
        setPending(data);
    };
    const handleErrors = (errors) => {
        setPostErrors(errors);
    };

    const handleSaveAnnualBudgetData = (response) => {
        setAnnualBudgetData(response);
        setLoader(false);
    };

    BudgetGetRequest.setDefaultParams({
        fiscalYear: generalData.fiscalYear,
        district,
        municipality,
        province,
        finalAnnualBudgetData: handleSaveAnnualBudgetData,
        handlePendingState: handlePending,
    });

    const handleMunicipalBudget = (budgetVal) => {
        setmunicipalBudget(budgetVal.target.value);
    };
    const handleDRRFund = (fundVal) => {
        setdrrFund(fundVal.target.value);
    };
    const handleAddFund = (addFundVal) => {
        setadditionalFund(addFundVal.target.value);
    };
    const handleinfoClick = (data) => {
        if (data === 'totalMun') {
            setTotalMun(true);
            setDrrFundInfo(false);
            setOtherFunding(false);
        } if (data === 'drrFund') {
            setTotalMun(false);
            setDrrFundInfo(true);
            setOtherFunding(false);
        } if (data === 'otherFunding') {
            setTotalMun(false);
            setDrrFundInfo(false);
            setOtherFunding(true);
        }
    };

    const handleBudgetId = (response) => {
        setBudgetId({ id: response.id });
        setEditBudget(false);
    };

    const handleCallGetApi = (response) => {
        BudgetGetRequest.do({
            fiscalYear: generalData.fiscalYear,
            district,
            municipality,
            province,
            finalAnnualBudgetData: handleSaveAnnualBudgetData,
            handlePendingState: handlePending,
            setErrors: handleErrors,

        });
        props.handleNextClick();
    };

    const handleCallUpdateApi = (response) => {
        BudgetGetRequest.do({
            fiscalYear: generalData.fiscalYear,
            district,
            municipality,
            province,
            finalAnnualBudgetData: handleSaveAnnualBudgetData,
            handlePendingState: handlePending,
            setErrors: handleErrors,

        });
    };

    const handleNextClick = () => {
        if (municipalBudget && drrFund && additionalFund) {
            if (!annualBudgetData.length) {
                BudgetPostRequest.do({
                    body: {
                        title: budgetTitle,
                        totalBudgetNrs: Number(municipalBudget),
                        disasterBudgetNrs: Number(drrFund),
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
                setBudgetId({ id: annualBudgetData[0].id });
                props.handleNextClick();
                updateTab();
            }
        } else {
            props.handleNextClick();
        }
        if (drrmProgress < 1) {
            setProgress(1);
        }
    };


    useEffect(() => {
        if (annualBudgetData.length > 0) {
            setBudgetTitle(annualBudgetData[0].title);
            setdrrFund(annualBudgetData[0].disasterBudgetNrs);
            setmunicipalBudget(annualBudgetData[0].totalBudgetNrs);
            setadditionalFund(annualBudgetData[0].otherBudgetNrs);
            setBudgetId({ id: annualBudgetData[0].id });
        }


    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [annualBudgetData]);
    const handleEditBudget = () => {
        setEditBudget(true);
    };
    const handleUpdateBudget = () => {
        setLoader(true);
        BudgetPutRequest.do({
            body: {
                title: budgetTitle,
                totalBudgetNrs: Number(municipalBudget),
                disasterBudgetNrs: Number(drrFund),
                otherBudgetNrs: Number(additionalFund),
                fiscalYear: generalData.fiscalYear,
                province,
                district,
                municipality,
                handlePendingState: handlePending,
                setErrors: handleErrors,
            },
            id: budgetId.id,
            budgetId: handleBudgetId,
            callGetApi: handleCallUpdateApi,
        });
    };
    return (
        <>

            {
                pending
                    ? (
                        <div className={styles.loaderClass}>

                            <Loader />
                        </div>
                    )
                    : (
                        <div>
                            {
                                !props.previewDetails

            && (
                <div className={drrmLanguage.language === 'np' && styles.nep}>

                    <h2>
                        <Gt section={Translations.BudgetTitlePart1} />
                        {`
                                ${generalData.fiscalYearTitle}
                            `
                        }
                        <Gt section={Translations.BudgetTitlePart2} />
                    </h2>
                    <div className={styles.palikaTable}>
                        <table id="table-to-xls">
                            <tbody>


                                <>
                                    {annualBudgetData.length > 0
                                        ? (
                                            <tr>

                                                {/* <th>SN</th> */}


                                                <th>
                                                    <Gt section={Translations.TotalMunBudget} />

                                                    <Icon
                                                        name="info"
                                                        className={styles.infoIcon}
                                                        title={drrmLanguage.language === 'en'
                                                            ? 'Total municipal budget is the total budget allocated by the municipality for the execution of various activities for this fiscal year'
                                                            : 'कुल बजेट भन्नाले यस आर्थिक वर्षको लागि विभिन्न गतिविधिहरू कार्यान्वयन गर्न नगरपालिकाबाट विनियोजन गरिएको कुल बजेट'
                                                        }
                                                    />

                                                </th>

                                                <th>
                                                    <Gt section={Translations.DRRFundMun} />


                                                    <Icon
                                                        name="info"
                                                        className={styles.infoIcon}
                                                        title={drrmLanguage.language === 'en'
                                                            ? 'DRR fund of the municipality is part of the total municipal budget of this fiscal year which is specifically separated for DRRM related activities'
                                                            : 'नगरपालिकाको विपद कोष भनेको  यस आर्थिक वर्षको कुल बजेटको हिस्सा हो जुन विशेष रूपमा विपद  सम्बन्धित गतिविधिहरूको लागि छुट्याइएको छ'
                                                        }
                                                    />

                                                </th>
                                                <th>
                                                    <Gt section={Translations.OtherDrrFund} />
                                                    <Icon
                                                        name="info"
                                                        className={styles.infoIcon}
                                                        title={drrmLanguage.language === 'en'
                                                            ? 'Other DRR related funding is the funding received by the municipality from various sources like I/NGOS, the federal government, provincial government, private sectors, etc. for this fiscal year'
                                                            : 'अन्य विपद् सम्बन्धित बजेट भनेको यस आर्थिक वर्षको लागि दात्री निकाय , संघीय सरकार,प्रादेशिक  सरकार, निजी क्षेत्र आदि जस्ता विभिन्न स्रोतबाट नगरपालिकाले प्राप्त गरेको रकम हो।'
                                                        }
                                                    />
                                                </th>
                                                {/* <th>
                                                    Updated By
                                                </th> */}
                                                <th>
                                                    <Gt section={Translations.dashboardTblHeaderLastModified} />
                                                </th>


                                            </tr>
                                        ) : (
                                            <tr>

                                                {/* <th>SN</th> */}


                                                <th>


                                                    <Gt section={Translations.TotalMunBudget} />


                                                    <Icon
                                                        name="info"
                                                        className={styles.infoIcon}
                                                        title={drrmLanguage.language === 'en'
                                                            ? 'Total municipal budget is the total budget allocated by the municipality for the execution of various activities for this fiscal year'
                                                            : 'कुल बजेट भन्नाले यस आर्थिक वर्षको लागि विभिन्न गतिविधिहरू कार्यान्वयन गर्न नगरपालिकाबाट विनियोजन गरिएको कुल बजेट'
                                                        }
                                                    />


                                                </th>
                                                <th>
                                                    <Gt section={Translations.DRRFundMun} />


                                                    <Icon
                                                        name="info"
                                                        className={styles.infoIcon}
                                                        title={drrmLanguage.language === 'en'
                                                            ? 'DRR fund of the municipality is part of the total municipal budget of this fiscal year which is specifically separated for DRRM related activities'
                                                            : 'नगरपालिकाको विपद कोष भनेको  यस आर्थिक वर्षको कुल बजेटको हिस्सा हो जुन विशेष रूपमा विपद  सम्बन्धित गतिविधिहरूको लागि छुट्याइएको छ'
                                                        }
                                                    />

                                                </th>
                                                <th>
                                                    <Gt section={Translations.OtherDrrFund} />
                                                    <Icon
                                                        name="info"
                                                        className={styles.infoIcon}
                                                        title={drrmLanguage.language === 'en'
                                                            ? 'Other DRR related funding is the funding received by the municipality from various sources like I/NGOS, the federal government, provincial government, private sectors, etc. for this fiscal year'
                                                            : 'अन्य विपद् सम्बन्धित बजेट भनेको यस आर्थिक वर्षको लागि दात्री निकाय , संघीय सरकार,प्रादेशिक  सरकार, निजी क्षेत्र आदि जस्ता विभिन्न स्रोतबाट नगरपालिकाले प्राप्त गरेको रकम हो।'
                                                        }
                                                    />

                                                </th>


                                            </tr>
                                        )}
                                    {loader ? (
                                        <>
                                            <Loader
                                                top="50%"
                                                left="60%"
                                            />
                                            <p className={styles.loaderInfo}>Loading...Please Wait</p>
                                        </>
                                    ) : (
                                        <>
                                            {annualBudgetData.length > 0
                                                ? annualBudgetData.map((item, i) => (
                                                    editBudget ? (
                                                        <tr>
                                                            {/* <td>1</td> */}
                                                            <td>
                                                                <input className={styles.inputContainer} type="text" value={municipalBudget} placeholder="Enter Total Municipal Budget" onChange={handleMunicipalBudget} />
                                                                {' '}
                                                            </td>
                                                            <td>
                                                                <input type="text" className={styles.inputContainer} value={drrFund} placeholder="Enter DRR Fund of the Municipality" onChange={handleDRRFund} />
                                                                {' '}
                                                            </td>
                                                            <td>
                                                                <input type="text" className={styles.inputContainer} value={additionalFund} placeholder="Other DRR Related Funding" onChange={handleAddFund} />
                                                                {' '}
                                                            </td>
                                                            <td>{item.modifiedOn.split('T')[0]}</td>

                                                        </tr>
                                                    )
                                                        : (
                                                            <tr key={item.id}>
                                                                {/* <td>{i + 1}</td> */}
                                                                <td>{item.totalBudgetNrs}</td>
                                                                <td>{item.disasterBudgetNrs}</td>
                                                                <td>{item.otherBudgetNrs}</td>
                                                                {/* <td>{item.updatedBy}</td> */}
                                                                <td>{ADToBS(item.modifiedOn.split('T')[0])}</td>


                                                            </tr>
                                                        )
                                                ))

                                                : !props.annex
                                                    ? (
                                                        <tr>
                                                            {/* <td>1</td> */}
                                                            <td>
                                                                <input

                                                                    className={styles.inputContainer}
                                                                    type="text"
                                                                    value={municipalBudget}
                                                                    placeholder={drrmLanguage.language === 'en'
                                                                        ? 'Please Enter Total Municipal Budget'
                                                                        : 'कृपया गरपालिकाको कुल बजेट  प्रविष्ट गर्नुहोस्'
                                                                    }
                                                                    onChange={handleMunicipalBudget}
                                                                />
                                                                {' '}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className={styles.inputContainer}
                                                                    value={drrFund}
                                                                    placeholder={drrmLanguage.language === 'en'
                                                                        ? 'Please Enter DRR Fund of the Municipality'
                                                                        : 'कृपया नगरपालिकाको विपद् कोष प्रविष्ट गर्नुहोस्'
                                                                    }
                                                                    onChange={handleDRRFund}
                                                                />
                                                                {' '}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className={styles.inputContainer}
                                                                    value={additionalFund}
                                                                    placeholder={drrmLanguage.language === 'en'
                                                                        ? 'Please Enter Other DRR Related Funding'
                                                                        : 'कृपया अन्य विपद् सम्बन्धित बजेट प्रविष्ट गर्नुहोस्'
                                                                    }
                                                                    onChange={handleAddFund}
                                                                />
                                                                {' '}
                                                            </td>


                                                        </tr>
                                                    ) : (
                                                        <tr>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                        </tr>
                                                    )}
                                        </>
                                    )}

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
                        {!loader && (
                            <>
                                {
                                    !props.annex
                        && (
                            <>
                                {annualBudgetData.length > 0
                                && (editBudget
                                    ? (
                                        <button
                                            type="button"
                                            className={styles.savebtn}
                                            onClick={handleUpdateBudget}
                                        >
                                            <Icon
                                                name="plus"
                                                className={styles.plusIcon}
                                            />
                                            <Gt section={Translations.BudgetUpdateBtn} />

                                        </button>
                                    )
                                    : (
                                        <button
                                            type="button"
                                            className={styles.savebtn}
                                            onClick={handleEditBudget}
                                        >
                                            <Icon
                                                name="plus"
                                                className={styles.plusIcon}
                                            />
                                            <Gt section={Translations.BudgetEditBtn} />
                                        </button>
                                    )
                                )}

                                <NextPrevBtns
                                    handlePrevClick={props.handlePrevClick}
                                    // handleNextClick={props.handleNextClick}
                                    handleNextClick={handleNextClick}

                                    // disabled={!((drrFund && municipalBudget && additionalFund))}
                                    // disabled={!(annualBudgetData.length > 0)}
                                />

                            </>
                        )
                                }
                            </>
                        )}

                    </div>
                </div>
            )
                            }


                            {
                                props.previewDetails
                    && (
                        <div className={styles.budgetPreviewContainer}>
                            <h2>
                                <Gt section={Translations.Budget} />
                            </h2>
                            <div className={styles.budgetDetailsContainer}>

                                <div className={styles.budgetDetails}>
                                    <ul>
                                        <li>
                                            <h2>
                                                <Gt section={Translations.Rupees} />
                                                {' '}
                                                {municipalBudget || '-'}
                                            </h2>
                                        </li>
                                        <li>
                                            <span className={styles.light}>Municipal Budget</span>
                                        </li>
                                    </ul>
                                    <ul>
                                        <li className={styles.lighter}>
                                            {/* <span > */}
                                            {(Number(drrFund) / Number(municipalBudget) * 100).toFixed(0)}
                                            {'%'}
                                            {' '}
                                            <Gt section={Translations.OfMunBudget} />

                                            {/* </span> */}
                                        </li>
                                        <li>
                                            <h2>
                                                <Gt section={Translations.Rupees} />
                                                {' '}
                                                {drrFund}
                                            </h2>

                                        </li>
                                        <li>
                                            <span className={styles.light}>
                                                <Gt section={Translations.DRRFundMun} />
                                            </span>

                                        </li>
                                    </ul>
                                </div>
                                <div className={styles.budgetDetails}>
                                    <ul>
                                        <li>
                                            <h2>
                                                <Gt section={Translations.Rupees} />
                                                {' '}
                                                {additionalFund || 0}
                                            </h2>
                                        </li>
                                        <li>
                                            <span className={styles.light}>
                                                <Gt section={Translations.OtherDrrFund} />
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
