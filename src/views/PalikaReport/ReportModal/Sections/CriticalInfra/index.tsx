/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { reverseRoute, _cs } from '@togglecorp/fujs';
import { useTheme } from '@material-ui/core';
import { Item } from 'semantic-ui-react';
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


interface Props{
    width: string;
    height?: string;

}
const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    user: userSelector(state),
});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    PalikaReportInventoriesReport: {
        url: ({ params }) => `${params.url}`,
        query: ({ params, props }) => {
            if (params && params.user) {
                return {
                    province: params.user.profile.province,
                    district: params.user.profile.district,
                    municipality: params.user.profile.municipality,
                    limit: params.page,

                    meta: params.meta,

                };
            }


            return { limit: params.page,
                offset: params.offset,


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
const CriticalInfra = (props: Props) => {
    const [fetchedData, setFetechedData] = useState([]);
    const [tableHeader, setTableHeader] = useState([]);
    const [paginationParameters, setPaginationParameters] = useState();
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(props.page);
    const [offset, setOffset] = useState(0);
    const [url, setUrl] = useState('/resource/');
    const { requests: { PalikaReportInventoriesReport }, provinces,
        districts,
        municipalities,
        user } = props;
    const [defaultQueryParameter, setDefaultQueryParameter] = useState('governance');
    const [fields, setfields] = useState('inventories');
    const [meta, setMeta] = useState(true);
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
    PalikaReportInventoriesReport.setDefaultParams({
        organisation: handleFetchedData,
        paginationParameters: handlePaginationParameters,
        url,
        page: paginationQueryLimit,
        inventories: defaultQueryParameter,
        fields,
        user,
        meta,

    });
    console.log('hang fetch data>>>', fetchedData);

    useEffect(() => {
        PalikaReportInventoriesReport.do({
            offset,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);
    // Finding Header for table data


    return (

        <div className={styles.tabsPageContainer}>
            <p>
                <strong>
                   Critical Infrastructures
                </strong>
            </p>
            <div className={styles.palikaTable}>
                <table id="table-to-xls">
                    <tbody>
                        <tr>

                            <th>S.N</th>
                            <th>Resource Name</th>
                            <th>Resource Type</th>
                            <th>Operator Type</th>
                            <th>Number Of male Employee</th>
                            <th>Number Of female Employee</th>
                            <th>Total Employee</th>

                        </tr>
                        {fetchedData.map((item, i) => (
                            <tr key={item.id}>
                                <td>{i + 1}</td>
                                <td>{item.title ? item.title : '-'}</td>
                                <td>{item.resourceType ? item.resourceType : '-'}</td>
                                <td>{item.operatorType ? item.operatorType : '-'}</td>
                                <td>{item.noOfMaleEmployee ? item.noOfMaleEmployee : '-'}</td>
                                <td>{item.noOfFemaleEmployee ? item.noOfFemaleEmployee : '-'}</td>
                                <td>{item.noOfEmployee ? item.noOfEmployee : '-'}</td>
                            </tr>
                        ))}


                    </tbody>
                </table>
                {/* {paginationParameters && paginationParameters.count !== 0
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
                {fetchedData && fetchedData.length === 0
                    && <p className={styles.dataUnavailable}>Data Unavailable</p>

                } */}
            </div>

        </div>

    );
};
export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            CriticalInfra,
        ),
    ),
);
