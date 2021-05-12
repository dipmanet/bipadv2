/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import Loader from 'react-loader';
import styles from './styles.scss';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    setProgramAndPolicyDataAction,
} from '#actionCreators';
import editIcon from '#resources/palikaicons/edit.svg';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import {
    programAndPolicySelector, userSelector, generalDataSelector,
} from '#selectors';
import NextPrevBtns from '../../NextPrevBtns';

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
});

const mapDispatchToProps = dispatch => ({
    setProgramData: params => dispatch(setProgramAndPolicyDataAction(params)),
});


interface Props{

}

const ProgramPolicies = (props: Props) => {
    const {
        programAndPolicyData,
        setProgramData,
        updateTab, user: { profile }, generalData,
        requests: { PolicyGetRequest, PolicyPostRequest, PolicyPutRequest },
    } = props;

    // const [inputList, setInputList] = useState([{ firstName: '', lastName: '' }]);
    // const [policies, setpolicies] = useState('');
    // const handlePolicies = (data) => {
    //     setpolicies(data.target.value);
    // };
    const [dataSubmittedResponse, setDataSubmittedResponse] = useState(false);
    const [serialNumber, setSerialNumber] = useState(0);
    const [point, setPoint] = useState('');
    const [finalPolicyData, setFinalPolicyData] = useState([]);
    const [province, setProvince] = useState(profile.province);
    const [district, setDistrict] = useState(profile.district);
    const [municipality, setMunicipality] = useState(profile.municipality);
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(6);
    const [paginationParameters, setPaginationParameters] = useState();
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [offset, setOffset] = useState(0);
    const [policyId, setPolicyId] = useState();
    const [policyIndex, setPolicyIndex] = useState();
    const [editPolicy, setEditPolicy] = useState(false);
    const [loader, setLoader] = useState(true);
    const [editBtnClicked, setEditBtnClicked] = useState(false);
    const handleSavefinalPolicyData = (response) => {
        setFinalPolicyData(response);
        setPoint('');
        setLoader(false);
        setDataSubmittedResponse(false);
    };
    const handlePaginationParameters = (response) => {
        setPaginationParameters(response);
    };
    const handleDataSubmittedResponse = (response) => {
        setDataSubmittedResponse(!dataSubmittedResponse);
        setPoint('');
        setEditPolicy(false);
        setPolicyId(null);
    };
    PolicyGetRequest.setDefaultParams({
        fiscalYear: generalData.fiscalYear,
        district: profile.district,
        municipality: profile.municipality,
        province: profile.province,
        finalPolicyData: handleSavefinalPolicyData,
        paginationParameters: handlePaginationParameters,
        page: paginationQueryLimit,
        id: '-id',

    });


    const handleChangePoint = (e) => {
        setPoint(e.target.value);
    };
    const handleSubmit = () => {
        setLoader(true);
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
    };
    const handlePageClick = (e) => {
        const selectedPage = e.selected + 1;
        setOffset((selectedPage - 1) * paginationQueryLimit);
        setCurrentPageNumber(selectedPage);
    };
    useEffect(() => {
        PolicyGetRequest.do({
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
        if (dataSubmittedResponse) {
            PolicyGetRequest.do({
                fiscalYear: generalData.fiscalYear,
                district: profile.district,
                municipality: profile.municipality,
                province: profile.province,
                page: paginationQueryLimit,
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
    };
    useEffect(() => {
        if (finalPolicyData.length > 0) {
            setPoint(finalPolicyData[policyIndex].point);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [policyIndex, editBtnClicked]);


    return (
        <>
            { !props.previewDetails
            && (
                <div>
                    <h2>{'Annual Policy and Programme for FY TODO'}</h2>
                    <table id="table-to-xls">
                        <tbody>
                            <tr>
                                <th>SN</th>
                                <th>Points</th>
                                <th>Action</th>
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
                                                             placeholder="Please enter the DRR related
                                    points in this fiscal year's Annual Policy and
                                    Programme of the municipality"
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
                                                   Update
                                                         </button>
                                                     </td>


                                                 </tr>
                                             )
                                             : (
                                                 <tr key={item.id}>
                                                     <td>
                                                         {(currentPageNumber - 1)
                                                * paginationQueryLimit + i + 1}
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
                                                placeholder="Please enter the DRR related
                                    points in this fiscal year's Annual Policy and
                                    Programme of the municipality"
                                                onChange={handleChangePoint}
                                                rows="4"
                                                cols="100"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                className={styles.savebtn}
                                            >
                                    + Add Annual Policy and Programme

                                            </button>
                                        </div>
                                    )
                                }
                                <NextPrevBtns
                                    handlePrevClick={props.handlePrevClick}
                                    handleNextClick={props.handleNextClick}
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
                    Disaster related topics in
                        <br />
                    Annual Program and policies
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

        </>
    );
};


export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            ProgramPolicies,
        ),
    ),
);
