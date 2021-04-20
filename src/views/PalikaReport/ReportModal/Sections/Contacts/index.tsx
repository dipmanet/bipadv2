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
const Contacts = (props: Props) => {
    const [fetchedData, setFetechedData] = useState([]);
    const [tableHeader, setTableHeader] = useState([]);
    const [paginationParameters, setPaginationParameters] = useState();
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(props.page);
    const [offset, setOffset] = useState(0);
    const [url, setUrl] = useState('/municipality-contact/');
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

        user,


    });

    useEffect(() => {
        PalikaReportInventoriesReport.do({
            offset,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);
    // Finding Header for table data
    const handleDataSave = () => {
        props.updateTab();
    };
    return (

        <div className={styles.tabsPageContainer}>
            <h2>
                <strong>
                DRR related Person Contact Info
                </strong>
            </h2>
            <div className={styles.palikaTable}>
                <table id="table-to-xls">
                    <tbody>
                        <tr>

                            <th>S.N</th>
                            <th>Contact Name</th>
                            <th>Position</th>
                            <th>Mobile Number</th>


                        </tr>
                        {fetchedData.map((item, i) => (
                            <tr key={item.id}>
                                <td>{i + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.position}</td>
                                <td>{item.mobileNumber ? item.mobileNumber : '-'}</td>

                            </tr>
                        ))}


                    </tbody>
                </table>


                <button
                    type="button"
                    onClick={handleDataSave}
                    className={styles.savebtn}
                >
                Save and Proceed
                </button>
            </div>
        </div>
    );
};


export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Contacts,
        ),
    ),
);
