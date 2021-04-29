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
            offset: params.offset,
            limit: params.page,
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
            console.log('This is response', response);
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
        console.log('What is click>>>', e.selected);
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
    console.log('This hang>>>>', finalPolicyData);
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
    return (
        <div>
            <table id="table-to-xls">
                <tbody>
                    <tr>
                        <th>SN</th>
                        <th>Points</th>
                    </tr>
                    {finalPolicyData.length > 0 && finalPolicyData.map((item, i) => (
                        <tr key={item.id}>
                            <td>{(currentPageNumber - 1) * paginationQueryLimit + i + 1}</td>
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
            <div className={styles.txtAreadetails}>
                <textarea value={point} placeholder="Disaster Budget" onChange={handleChangePoint} rows="4" cols="100" />
                <button type="button" onClick={handleSubmit}>Add</button>
            </div>
            <NextPrevBtns
                handlePrevClick={props.handlePrevClick}
                handleNextClick={props.handleNextClick}
            />
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
            subContainerClassName={styles.pagination}
            activeClassName={styles.active}
        />
    </div>
)}
        </div>
    );
};
// <div className={styles.mainPageDetailsContainer}>
//     <div className={styles.formColumn}>
//         <h2>Annual Program and Policy</h2>
//         <p>DRR programmes listed in the annual policy and programme</p>
//         <div className={styles.row}>
//             <div className={styles.inputContainer}>
//                 <textarea
//                     placeholder="Kindly enter DRR programmes "
//                     value={policies}
//                     onChange={handlePolicies}
//                     rows={10}
//                 />
//             </div>

//

//         </div>
//     </div>
// </div>
// <div>


export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            ProgramPolicies,
        ),
    ),
);
