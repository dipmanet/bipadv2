/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { reverseRoute, _cs } from '@togglecorp/fujs';
import { useTheme } from '@material-ui/core';
import { Item } from 'semantic-ui-react';
import * as ReachRouter from '@reach/router';
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
    userSelector,
    palikaRedirectSelector } from '#selectors';
import Loading from '#components/Loading';


import {
    setPalikaRedirectAction,
} from '#actionCreators';

interface Props{

}
const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    user: userSelector(state),
    palikaRedirect: palikaRedirectSelector(state),

});


const mapDispatchToProps = dispatch => ({
    setPalikaRedirect: params => dispatch(setPalikaRedirectAction(params)),
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
    const [finalInventoriesData, setFinalInventoriesData] = useState([]);
    const [firstSerialNumber, setFirstSerialNumber] = useState(0);
    const [lastSerialNumber, setLastSerialNumber] = useState(10);
    const handleFetchedData = (response) => {
        setFetechedData(response);
    };
    const handleDataSave = () => {
        props.updateTab();
    };
    const handlePaginationParameters = (response) => {
        setPaginationParameters(response);
    };


    const handleEditInventory = (inventoryItem) => {
        const { setPalikaRedirect } = props;
        setPalikaRedirect({
            showForm: true,
            inventoryItem,
            showModal: 'inventory',

        });
        ReachRouter.navigate('/risk-info/#/capacity-and-resources',
            { state: { showForm: true }, replace: true });
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
    let count = 0;
    console.log('page>>>', props.page);

    const inventoriesData = fetchedData.map(item => (
        item.inventories.map((data) => {
            count += 1;
            return ({
                ...data,
                SN: count,
                resourceName: item.title,
                organizationType: item.type,


            }


            );
        })
    ));
    console.log('This is data>>>', inventoriesData);


    useEffect(() => {
        if (finalInventoriesData.length === 0) {
            inventoriesData.map((item) => {
                if (item.length > 0) {
                    finalInventoriesData.push(...item);
                }
                return null;
            });
        }


    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inventoriesData]);
    console.log('This is finaldata>>>', finalInventoriesData);
    const handlePageClick = (e) => {
        const selectedPage = e.selected + 1;
        // setOffset((selectedPage - 1) * paginationQueryLimit);
        // setCurrentPageNumber(selectedPage);
        console.log('What is click>>>', e.selected);
        setLastSerialNumber(finalInventoriesData.length);
    };


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

                            <th>S.N</th>
                            <th>Name of Resource</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>Category</th>
                            <th>Owner Organization Name</th>
                            <th>Type of Organization</th>
                            <th>Added Date</th>
                            <th>Updated Date</th>

                        </tr>

                        {finalInventoriesData && finalInventoriesData.map(item => (

                            <tr>

                                <td>
                                    {item.SN}
                                </td>
                                <td>{item.item.title}</td>
                                <td>{item.quantity}</td>
                                <td>{item.item.unit}</td>
                                <td>{item.item.category}</td>
                                <td>

                                    {item.resourceName}
                                </td>
                                <td>{item.organizationType}</td>
                                <td>{item.createdOn.split('T')[0]}</td>
                                <td>{item.modifiedOn.split('T')[0]}</td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => handleEditInventory(item)}
                                    >
                                            Edit
                                    </button>
                                </td>
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
                                        pageCount={Math.ceil(finalInventoriesData.length
                                         / 10)}
                                        containerClassName={styles.pagination}
                                        subContainerClassName={_cs(styles.pagination)}
                                        activeClassName={styles.active}
                                    />
                                </div>
                            )} */}
                {finalInventoriesData && finalInventoriesData.length === 0
                && <p className={styles.dataUnavailable}>Data Unavailable</p>

                }


                <NextPrevBtns
                    handlePrevClick={props.handlePrevClick}
                    handleNextClick={props.handleNextClick}
                />
            </div>

        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Inventory,
        ),
    ),
);
