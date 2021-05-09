import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
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
        requests: { PolicyGetRequest, PolicyPostRequest },
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

    const handleSavefinalPolicyData = (response) => {
        setFinalPolicyData(response);
        setPoint('');
    };
    const handlePaginationParameters = (response) => {
        setPaginationParameters(response);
    };
    const handleDataSubmittedResponse = (response) => {
        setDataSubmittedResponse(!dataSubmittedResponse);
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
                            </tr>
                            {finalPolicyData.length > 0 && finalPolicyData.map((item, i) => (
                                <tr key={item.id}>
                                    <td>
                                        {(currentPageNumber - 1) * paginationQueryLimit + i + 1}
                                    </td>
                                    <td>{item.point}</td>
                                </tr>
                            ))
                            }

                            {/* <td>
                                {' '}
                                <input type="Number" placeholder="Disaster Budget" />
                            </td> */}


                        </tbody>
                    </table>
                    {
                        !props.annex
                        && (
                            <>
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
Add

                                    </button>
                                </div>
                                <NextPrevBtns
                                    handlePrevClick={props.handlePrevClick}
                                    handleNextClick={props.handleNextClick}
                                />
                            </>
                        )
                    }

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
                        {finalPolicyData.length > 0 && finalPolicyData.length < 3
                            ? finalPolicyData.map(item => (
                                <li key={item.id}>
                                    {item.point}
                                </li>
                            ))
                            : finalPolicyData.slice(0, 3).map(item => (
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
