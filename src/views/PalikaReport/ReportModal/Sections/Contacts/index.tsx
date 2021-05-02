import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { reverseRoute, _cs } from '@togglecorp/fujs';
import { useTheme } from '@material-ui/core';
import { Item } from 'semantic-ui-react';
import * as ReachRouter from '@reach/router';
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
import NextPrevBtns from '../../NextPrevBtns';


import {
    setPalikaRedirectAction,
} from '#actionCreators';

const mapDispatchToProps = dispatch => ({
    setPalikaRedirect: params => dispatch(setPalikaRedirectAction(params)),
});

interface Props{

}

const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    user: userSelector(state),
    palikaRedirect: palikaRedirectSelector(state),

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
    OrganisationGetRequest: {
        url: '/organization/',
        method: methods.GET,
        onMount: true,

        onSuccess: ({ response, params }) => {
            const orgResponse = response as MultiResponse<CitizenReport>;
            const { results } = orgResponse;
            if (params && params.setOrgs) {
                params.setOrgs(results);
            }
        },
    },
    TrainingGetRequest: {
        url: '/contact-training/',
        method: methods.GET,
        onMount: true,

        onSuccess: ({ response, params }) => {
            const trainingContacts = response as MultiResponse<CitizenReport>;
            const { results } = trainingContacts;
            if (params && params.setTrainedContacts) {
                params.setTrainedContacts(results);
            }
        },
    },
};

const mergedList = [];

const Contacts = (props: Props) => {
    const [fetchedData, setFetechedData] = useState([]);
    const [tableHeader, setTableHeader] = useState([]);
    const [paginationParameters, setPaginationParameters] = useState();
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(props.page);
    const [offset, setOffset] = useState(0);
    const [orgList, setOrgList] = useState([]);
    const [trainedContacts, setTrainedContacts] = useState([]);
    const [url, setUrl] = useState('/municipality-contact/');
    const { requests: {
        PalikaReportInventoriesReport,
        OrganisationGetRequest,
        TrainingGetRequest,
    },
    provinces,
    districts,
    municipalities,
    user } = props;
    const [defaultQueryParameter, setDefaultQueryParameter] = useState('governance');
    const [fields, setfields] = useState('inventories');
    const [meta, setMeta] = useState(true);

    const [orgType, setOrgType] = useState('');

    const handleFetchedData = (response) => {
        setFetechedData(response);
    };
    const handleOrg = (response) => {
        setOrgList(response);
    };
    const handletrainedContacts = (response) => {
        setTrainedContacts(response);
    };
    const handlePaginationParameters = (response) => {
        setPaginationParameters(response);
    };
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage * 2);
    };
    const handleContactEdit = (contact) => {

    };
    const handleEditContacts = (contactItem) => {
        const { setPalikaRedirect } = props;
        setPalikaRedirect({
            showForm: true,
            contactItem,
            showModal: 'contact',

        });
        ReachRouter.navigate('/profile/',
            { state: { showForm: true }, replace: true });
    };
    const handleAddContacts = () => {
        const { setPalikaRedirect } = props;
        setPalikaRedirect({
            showForm: true,
            showModal: 'contact',
        });
        ReachRouter.navigate('/profile/',
            { state: { showForm: true }, replace: true });
    };

    PalikaReportInventoriesReport.setDefaultParams({
        organisation: handleFetchedData,
        paginationParameters: handlePaginationParameters,
        url,
        page: paginationQueryLimit,
        inventories: defaultQueryParameter,
        user,
    });
    OrganisationGetRequest.setDefaultParams({
        setOrgs: handleOrg,
    });
    TrainingGetRequest.setDefaultParams({
        setTrainedContacts: handletrainedContacts,
    });

    useEffect(() => {
        PalikaReportInventoriesReport.do({
            offset,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);

    useEffect(() => {
        if (fetchedData.length > 0 && orgList.length > 0 && trainedContacts.length > 0) {
            fetchedData.map((item) => {
                const orgTypeObj = orgList.filter(org => org.id === item.organization);
                const trainedContactsObj = trainedContacts.filter(cts => cts.contact === item.id);
                if (orgTypeObj.length > 0) {
                    mergedList.push({
                        ...item,
                        orgType: (orgTypeObj[0].title || 'No data'),
                        orgName: (orgTypeObj[0].longName || 'No data'),
                        trainingTitle: (trainedContactsObj.map(trainings => trainings.title)),
                        trainingDuration: (trainedContactsObj
                            .map(trainings => trainings.durationDays)),
                    });
                } else {
                    mergedList.push({ ...item, orgType: 'No data', orgName: 'No data' });
                }
                return null;
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchedData, orgList, trainedContacts]);

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
                            <th>Name</th>
                            <th>Type of Organisation</th>
                            <th>Position</th>
                            <th>Name of Organisation</th>
                            <th>Trained Title</th>
                            <th>Training Duration</th>
                            <th>Contact number</th>
                            <th>Email</th>
                        </tr>
                        {mergedList
                            ? mergedList.map((item, i) => (
                                <tr key={item.id}>
                                    <td>{i + 1}</td>
                                    <td>{item.name || 'No data'}</td>
                                    <td>{item.orgType || 'No data'}</td>
                                    <td>{item.position || 'No data'}</td>
                                    <td>{item.orgName || 'No data'}</td>
                                    <td>
                                        {
                                            item.trainingTitle
                                                ? item.trainingTitle.map(training => training)
                                                : 'No data'
                                        }
                                    </td>
                                    <td>
                                        {
                                            item.trainingDuration
                                                ? item.trainingDuration.map(training => training)
                                                : 'No data'
                                        }
                                    </td>
                                    <td>{item.mobileNumber || 'No Data'}</td>
                                    <td>{item.email || 'No Data'}</td>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => handleEditContacts(item)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                            : 'No Data'
                        }
                    </tbody>
                </table>


                <NextPrevBtns
                    handlePrevClick={props.handlePrevClick}
                    handleNextClick={props.handleNextClick}
                />
                <button
                    type="button"
                    onClick={() => handleAddContacts()}
                    className={styles.savebtn}
                >
                    Add
                </button>
            </div>
        </div>
    );
};


export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Contacts,
        ),
    ),
);
