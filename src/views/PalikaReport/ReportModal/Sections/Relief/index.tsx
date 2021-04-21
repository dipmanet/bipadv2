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
import NextPrevBtns from '../../NextPrevBtns';


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


                };
            }


            return { limit: params.page,
                offset: params.offset,
                resource_type: params.inventories,
                expand: params.fields };
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

const Relief = (props: Props) => {
    console.log(props);
    const handleDataSave = () => {
        props.updateTab();
    };
    const [fetchedData, setFetechedData] = useState([]);
    const [tableHeader, setTableHeader] = useState([]);
    const [paginationParameters, setPaginationParameters] = useState();
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(props.page);
    const [offset, setOffset] = useState(0);
    const [url, setUrl] = useState('/incident/');
    const { requests: { PalikaReportInventoriesReport }, provinces,
        districts,
        municipalities,
        user } = props;
    const [defaultQueryParameter, setDefaultQueryParameter] = useState('governance');
    const [fields, setfields] = useState('loss');
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
            <h2>
                <strong>
            Relief
                </strong>
            </h2>
            <div className={styles.palikaTable}>
                <table id="table-to-xls">
                    <tbody>
                        <tr>

                            <th>S.N</th>
                            <th>Title</th>
                            <th>Address</th>
                            <th>Reported On</th>
                            <th>Incident On</th>
                            <th>Total Death</th>
                            <th>Total Injured</th>
                            <th>Total Missing</th>
                            <th>Family Affected</th>
                            <th>Infrastructure Affected</th>
                            <th>Infrastructure Destroyed</th>

                        </tr>

                        {fetchedData.map((item, i) => (
                            <tr key={item.id}>
                                <td>{i + 1}</td>
                                <td>{item.title}</td>
                                <td>{item.streetAddress ? item.streetAddress : '-'}</td>
                                <td>{item.reportedOn}</td>
                                <td>{item.incidentOn}</td>
                                <td>{item.loss ? item.loss.peopleDeathCount : 0}</td>
                                <td>{item.loss ? item.loss.peopleInjuredCount : 0}</td>
                                <td>{item.loss ? item.loss.peopleMissingCount : 0}</td>
                                <td>{item.loss ? item.loss.familyAffectedCount : 0}</td>

                                <td>


                                    {Number(item.loss
                                        ? item.loss.infrastructureAffectedBridgeCount : 0)

                                     + Number(item.loss
                                         ? item.loss.infrastructureAffectedElectricityCount : 0)
+ Number(item.loss ? item.loss.infrastructureAffectedHouseCount : 0)
+ Number(item.loss ? item.loss.infrastructureAffectedRoadCount : 0)}


                                </td>
                                <td>{item.loss ? item.loss.infrastructureDestroyedCount : 0}</td>

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

            <NextPrevBtns
                handlePrevClick={props.handlePrevClick}
                handleNextClick={props.handleNextClick}

            />
        </div>
    );
};


export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Relief,
        ),
    ),
);
