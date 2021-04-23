/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { reverseRoute, _cs } from '@togglecorp/fujs';
import { useTheme } from '@material-ui/core';
import { Item } from 'semantic-ui-react';
import NextPrevBtns from '../../NextPrevBtns';
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
                    resource_type: params.inventories,
                    expand: params.fields,
                    meta: params.meta,

                };
            }


            return { limit: params.page,
                offset: params.offset,
                resource_type: params.inventories,
                expand: params.fields,
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


const Inventory: React.FC<Props> = (props: Props) => {
    const [fetchedData, setFetechedData] = useState([]);
    const [tableHeader, setTableHeader] = useState([]);
    const [paginationParameters, setPaginationParameters] = useState();
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(props.page);
    const [offset, setOffset] = useState(0);
    const [url, setUrl] = useState('/resource/');
    const { requests: { PalikaReportInventoriesReport }, provinces,
        districts,
        municipalities,
        user, rows } = props;
    const [defaultQueryParameter, setDefaultQueryParameter] = useState('governance');
    const [fields, setfields] = useState('inventories');
    const [meta, setMeta] = useState(true);
    const handleFetchedData = (response) => {
        setFetechedData(response);
    };
    const handleDataSave = () => {
        props.updateTab();
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
        rows,

    });

    useEffect(() => {
        PalikaReportInventoriesReport.do({
            offset,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);
    // Finding Header for table data

    console.log('inventory data', fetchedData);

    return (
        <div className={styles.tabsPageContainer}>
            <h2>
                <strong>
               Inventories
                </strong>
            </h2>
            <div className={styles.palikaTable}>
                <table id="table-to-xls">
                    <tbody>
                        <tr>

                            {/* <th>S.N</th> */}
                            <th>Name of resource</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>Owner Organization</th>
                            <th>Type of Organization</th>
                            <th>Added Date</th>

                        </tr>

                        {fetchedData && fetchedData.map(item => (
                            item.inventories.map((data, i) => (
                                <tr>
                                    {/* <td>
                                        {i + 1}
                                    </td> */}
                                    <td>{data.item.title}</td>
                                    <td>{data.quantity}</td>
                                    <td>{'pcs'}</td>
                                    <td>
                                        {item.title}
                                    </td>
                                    <td>{item.type}</td>
                                    <td>{data.createdOn.split('T')[0]}</td>
                                </tr>
                            ))

                        ))}
                        {/* {fetchedData.map(array => (

                            array.map((data, i) => (

                                <tr key={data.item.id}>
                                    <td>{i + 1}</td>
                                    <td>{data.item.title}</td>
                                    <td>{data.quantity}</td>
                                    <td />

                                    <td>

                                        {data.item.category}
                                    </td>
                                </tr>
                            ))

                        ))} */}


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

                }


                } */}
                <NextPrevBtns
                    handlePrevClick={props.handlePrevClick}
                    handleNextClick={props.handleNextClick}
                />
            </div>

        </div>
    );
};

export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Inventory,
        ),
    ),
);
