/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import styles from './styles.scss';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';

import {
    setProgramAndPolicyDataAction,
    setDrrmProgressAction,
} from '#actionCreators';
import Gt from '../../../../utils';
import editIcon from '#resources/palikaicons/edit.svg';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import {
    programAndPolicySelector,
    userSelector,
    generalDataSelector,
    drrmRegionSelector,
    drrmProgresSelector,
    palikaLanguageSelector,
} from '#selectors';
import NextPrevBtns from '../../NextPrevBtns';
import Translations from '#views/PalikaReport/Constants/Translations';

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    PolicyGetRequest: { url: '/annual-policy-program/',
        query: ({ params, props }) => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            fiscal_year: params.fiscalYear,
            district: params.district,
            municipality: params.municipality,
            province: params.province,
            // offset: params.offset,
            // limit: params.page,
            ordering: params.id,
        }),
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;

            if (params && params.finalPolicyData) {
                params.finalPolicyData(citizenReportList);
            }
            if (params && params.paginationParameters) {
                params.paginationParameters(response);
            }
        } },
    PolicyPostRequest: {
        url: '/annual-policy-program/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            params.dataSubmitted(response);
        },


    },

    PolicyPutRequest: {
        url: ({ params }) => `/annual-policy-program/${params.id}/`,
        method: methods.PUT,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            params.dataSubmitted(response);
        },
        onFailure: ({ error, params }) => {
            console.log('params:', params);
        },


    },

};
const mapStateToProps = state => ({
    programAndPolicyData: programAndPolicySelector(state),
    user: userSelector(state),
    generalData: generalDataSelector(state),
    drrmRegion: drrmRegionSelector(state),
    drrmProgress: drrmProgresSelector(state),
    drrmLanguage: palikaLanguageSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setProgramData: params => dispatch(setProgramAndPolicyDataAction(params)),
    setProgress: params => dispatch(setDrrmProgressAction(params)),
});


interface Props{

}

let province = 0;
let district = 0;
let municipality = 0;

const ProgramPolicies = (props: Props) => {
    const {
        user,
        generalData,
        requests: { PolicyGetRequest, PolicyPostRequest, PolicyPutRequest },
        drrmRegion,
        setProgress,
        drrmProgress,
        drrmLanguage,
    } = props;

    const [dataSubmittedResponse, setDataSubmittedResponse] = useState(false);
    const [point, setPoint] = useState('');
    const [finalPolicyData, setFinalPolicyData] = useState([]);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [policyId, setPolicyId] = useState();
    const [policyIndex, setPolicyIndex] = useState();
    const [editPolicy, setEditPolicy] = useState(false);
    const [loader, setLoader] = useState(true);
    const [editBtnClicked, setEditBtnClicked] = useState(false);
    const [postErrors, setPostErrors] = useState('');

    if (drrmRegion.municipality) {
        municipality = drrmRegion.municipality;
        district = drrmRegion.district;
        province = drrmRegion.province;
    } else {
        municipality = user.profile.municipality;
        district = user.profile.district;
        province = user.profile.province;
    }

    const handleSavefinalPolicyData = (response) => {
        setFinalPolicyData(response);
        setPoint('');
        setLoader(false);
        setDataSubmittedResponse(false);
    };
    const handlePaginationParameters = (response) => {
        // setPaginationParameters(response);
    };
    const handleDataSubmittedResponse = (response) => {
        setDataSubmittedResponse(!dataSubmittedResponse);
        setPoint('');
        setEditPolicy(false);
        setPolicyId(null);
    };
    PolicyGetRequest.setDefaultParams({
        fiscalYear: generalData.fiscalYear,
        district,
        municipality,
        province,
        finalPolicyData: handleSavefinalPolicyData,
        paginationParameters: handlePaginationParameters,
        id: '-id',
    });


    const handleChangePoint = (e) => {
        setPoint(e.target.value);
    };
    const handleSubmit = () => {
        setLoader(true);
        if (point) {
            setPostErrors('');
            PolicyPostRequest.do({
                body: {
                    province,
                    district,
                    municipality,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    fiscalYear: generalData.fiscalYear,
                    point,
                },
                dataSubmitted: handleDataSubmittedResponse,
            });
        } else {
            setLoader(false);
            setPostErrors("Please Enter DRR related points for this fiscal year's annual policy and program of the municipality");
        }
    };

    useEffect(() => {
        if (dataSubmittedResponse) {
            PolicyGetRequest.do({
                fiscalYear: generalData.fiscalYear,
                district,
                municipality,
                province,
                // page: paginationQueryLimit,
                finalPolicyData: handleSavefinalPolicyData,
                paginationParameters: handlePaginationParameters,
                id: '-id',

            });
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSubmittedResponse]);
    // eslint-disable-next-line max-len
    const handleEditActivity = (id, index) => {
        setPolicyId(id);
        setPolicyIndex(index);
        setEditPolicy(true);
        setEditBtnClicked(!editBtnClicked);
    };
    const handleUpdateActivity = () => {
        setLoader(true);
        if (point) {
            setPostErrors('');
            PolicyPutRequest.do({
                body: {
                    province,
                    district,
                    municipality,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    fiscalYear: generalData.fiscalYear,
                    point,
                },
                id: policyId,
                dataSubmitted: handleDataSubmittedResponse,
            });
        } else {
            setLoader(false);
            setPostErrors("Please Enter DRR related points for this fiscal year's annual policy and program of the municipality");
        }
    };
    useEffect(() => {
        if (finalPolicyData.length > 0) {
            setPoint(finalPolicyData[policyIndex].point);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [policyIndex, editBtnClicked]);

    const handleNext = () => {
        if (drrmProgress < 3) {
            setProgress(3);
        }
        props.handleNextClick();
    };

    return (
        <div className={drrmLanguage.language === 'np' && styles.nep}>
            { !props.previewDetails
            && (
                <div className={styles.mainPageDetailsContainer}>
                    <h2>
                        <Gt section={Translations.PapTitlePart1} />
                        {''}
                        {
                            ` ${generalData.fiscalYearTitle} `
                        }
                        {''}
                        <Gt section={Translations.PapTitlePart2} />

                    </h2>
                    <table>
                        <tbody>
                            <tr>


                                <th><Gt section={Translations.dashboardTblHeaderSN} /></th>
                                <th><Gt section={Translations.points} /></th>

                                {finalPolicyData.length > 0
                                    ? (
                                        <th>
                                            <Gt section={Translations.dashboardTblHeaderLastAction} />
                                        </th>
                                    )
                                    : ''}

                            </tr>
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
                                    {finalPolicyData.length > 0
                                     && finalPolicyData.map((item, i) => (
                                         policyId === item.id
                                             ? (
                                                 <tr>
                                                     <td>{policyIndex + 1}</td>
                                                     <td>
                                                         <textarea
                                                             value={point}
                                                             placeholder={drrmLanguage.language === 'en'
                                                                 ? 'DRR programmes listed in the annual policy and programme'
                                                                 : 'विपद् जोखिम न्यूनीकरण सम्बन्धि  वार्षिक नीति तथा कार्यक्रममा सूचीबद्ध कार्यक्रमहरू'
                                                             }


                                                             onChange={handleChangePoint}
                                                             rows="4"
                                                             cols="100"
                                                         />
                                                     </td>
                                                     <td>
                                                         <button
                                                             className={styles.updateButtn}
                                                             type="button"
                                                             onClick={handleUpdateActivity}
                                                             title="Update Policy"
                                                         >
                                                             <Gt section={Translations.Update} />

                                                         </button>
                                                     </td>


                                                 </tr>
                                             )
                                             : (
                                                 <tr key={item.id}>
                                                     <td>
                                                         {(currentPageNumber - 1)
                                                * i + 1}
                                                     </td>
                                                     <td>{item.point}</td>
                                                     <td>
                                                         <button
                                                             className={styles.editButtn}
                                                             type="button"
                                                             onClick={() => handleEditActivity(item.id, i)}
                                                             title="Edit Policy"
                                                         >
                                                             <ScalableVectorGraphics
                                                                 className={styles.bulletPoint}
                                                                 src={editIcon}
                                                                 alt="editPoint"
                                                             />
                                                         </button>

                                                     </td>
                                                 </tr>
                                             )
                                     ))
                                    }
                                </>
                            )}


                        </tbody>
                    </table>

                    {!loader && (
                        <>

                            {
                                !props.annex
                        && (
                            <>
                                {editPolicy ? ''
                                    : (
                                        <div className={styles.txtAreadetails}>
                                            <textarea
                                                value={point}
                                                placeholder={drrmLanguage.language === 'en'
                                                    ? 'DRR programmes listed in the annual policy and programme'
                                                    : 'विपद् जोखिम न्यूनीकरण सम्बन्धि  वार्षिक नीति तथा कार्यक्रममा सूचीबद्ध कार्यक्रमहरू'
                                                }
                                                onChange={handleChangePoint}
                                                rows="4"
                                                cols="100"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                className={styles.savebtn}
                                            >
                                                <Gt section={Translations.PaPAddbtn} />

                                            </button>
                                        </div>
                                    )
                                }
                                {
                                    (postErrors)
                            && (
                                <ul>
                                    <li>
                                        <span className={styles.errorHeading}>
                                    Please fix the following errors:
                                        </span>
                                    </li>

                                    <li>
                                        {postErrors}
                                    </li>


                                </ul>
                            )
                                }
                                <NextPrevBtns
                                    handlePrevClick={props.handlePrevClick}
                                    handleNextClick={handleNext}
                                />
                            </>
                        )
                            }
                        </>
                    )}
                </div>
            )}

            { props.previewDetails
            && (
                <div className={styles.budgetPreviewContainer}>
                    <h2>
                        <Gt section={Translations.DRRprogrammeslisted} />

                    </h2>
                    <ul>
                        {finalPolicyData.length > 0
                        && finalPolicyData.slice(0, 2).map(item => (
                            <li key={item.id}>
                                {item.point}
                            </li>
                        ))

                        }
                    </ul>
                </div>
            )}

        </div>
    );
};


export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            ProgramPolicies,
        ),
    ),
);
