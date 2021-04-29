/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { reverseRoute, _cs } from '@togglecorp/fujs';
import { useTheme } from '@material-ui/core';
import * as ReachRouter from '@reach/router';
import { Table } from 'react-bootstrap';
import styles from './styles.scss';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import { provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    userSelector } from '#selectors';

import NextPrevBtns from '../../NextPrevBtns';
import {
    setCarKeysAction,
    setGeneralDataAction,
} from '#actionCreators';

const mapDispatchToProps = dispatch => ({
    setGeneralDatapp: params => dispatch(setGeneralDataAction(params)),
    setCarKeys: params => dispatch(setCarKeysAction(params)),
});

interface Props{

}
const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    user: userSelector(state),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    PalikaReportOrganizationReport: {
        url: ({ params }) => `${params.url}`,
        query: ({ params, props }) => {
            if (params && params.user) {
                return {
                    province: params.user.profile.province,
                    district: params.user.profile.district,
                    municipality: params.user.profile.municipality,
                    limit: params.page,
                    resource_type: params.governance,
                    meta: params.meta,
                };
            }


            return { limit: params.page,
                offset: params.offset,
                resource_type: params.governance,
                meta: params.meta };
        },
        method: methods.GET,
        onMount: true,

        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;

            if (params && params.organisation) {
                params.organisation(citizenReportList);
            }
            if (params && params.paginationParameters) {
                params.paginationParameters(response);
            }
        },
    },
};


const Organisation: React.FC<Props> = (props: Props) => {
    const [fetchedData, setFetechedData] = useState([]);
    const [tableHeader, setTableHeader] = useState([]);
    const [paginationParameters, setPaginationParameters] = useState();
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(props.page);
    const [offset, setOffset] = useState(0);
    const [CIselected, setCISelected] = useState('');

    const { requests: { PalikaReportOrganizationReport }, url, provinces,
        districts,
        municipalities,
        user,
        updateTab } = props;
    const [defaultQueryParameter, setDefaultQueryParameter] = useState('governance');
    const [meta, setMeta] = useState(2);


    const handleDataSave = () => {
        updateTab();
    };


    const handleFetchedData = (response) => {
        setFetechedData(response);
    };
    const handlePaginationParameters = (response) => {
        setPaginationParameters(response);
    };

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage * 2);
    };
    const handleCIButton = (item) => {
        setCISelected(item);
    };

    const handleOrnaisationRedirect = () => {
        const { setCarKeys } = props;
        setCarKeys(1);
        // ReachRouter.navigate('/risk-info/#/capacity-and-resources',
        // { state: { showForm: true }, replace: true });
    };
    PalikaReportOrganizationReport.setDefaultParams({
        organisation: handleFetchedData,
        paginationParameters: handlePaginationParameters,
        url,
        page: paginationQueryLimit,
        governance: defaultQueryParameter,
        meta,
        user,
    });

    console.log('this url>>', url);
    useEffect(() => {
        PalikaReportOrganizationReport.do({
            offset,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);
    // Finding Header for table data


    return (
        <div className={styles.tabsPageContainer}>
            <h2>
                <strong>DRR related organizations in Municipal Government</strong>
            </h2>
            <div className={styles.palikaTable}>
                {fetchedData && fetchedData.length > 0
                    ? fetchedData.map((item, i) => (
                        <tr key={item.id}>

                            <td>
                                <button
                                    type="button"
                                    onClick={() => handleCIButton(item.title)}
                                >
                                    {item.title}
                                </button>
                            </td>
                        </tr>
                    )) : ''
                }
                <table id="table-to-xls">
                    <tbody>
                        <tr>
                            <th>S.N</th>
                            <th>Name of Organization</th>
                            <th>Type of organization</th>
                            {/* <th>Level (for governmental organization)</th> */}
                            <th>Number of Male Employee</th>
                            <th>Number of Female Employee</th>
                        </tr>
                        {fetchedData && fetchedData.length > 0
                            ? fetchedData.map((item, i) => (
                                <tr key={item.id}>
                                    <td>{i + 1}</td>
                                    <td>{item.title}</td>
                                    <td>{item.type}</td>
                                    <td>
                                        {item.noOfMaleEmployee ? item.noOfMaleEmployee : 0}
                                    </td>
                                    <td>
                                        {item.noOfFemaleEmployee ? item.noOfFemaleEmployee : 0}
                                    </td>
                                </tr>
                            )) : ''
                        }


                    </tbody>
                </table>
                {
                    props.hide !== 1
                        ? (
                            <div className={styles.btnsCont}>
                                <NextPrevBtns
                                    handlePrevClick={props.handlePrevClick}
                                    handleNextClick={props.handleNextClick}
                                />
                                <button
                                    type="button"
                                    onClick={handleOrnaisationRedirect}
                                    className={styles.savebtn}
                                >

                                + Add Data
                                </button>
                            </div>
                        )
                        : ''
                }

            </div>

        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Organisation,
        ),
    ),
);
