/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { reverseRoute, _cs } from '@togglecorp/fujs';
import { useTheme } from '@material-ui/core';
import { Item } from 'semantic-ui-react';
import * as ReachRouter from '@reach/router';
import Loader from 'react-loader';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import styles from './styles.scss';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
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
import Icon from '#rscg/Icon';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import editIcon from '#resources/palikaicons/edit.svg';

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
    NonGovGetRequest: {
        url: '/nongov-contact/',
        query: ({ params, props }) => {
            if (params && params.user) {
                return {
                    province: params.user.profile.province,
                    district: params.user.profile.district,
                    municipality: params.user.profile.municipality,

                };
            }
            return null;
        },
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params }) => {
            const trainingContacts = response as MultiResponse<CitizenReport>;
            const { results } = trainingContacts;
            if (params && params.nonGovContacts) {
                params.nonGovContacts(results);
            }
        },

    },
    HazardDataGet: {
        url: '/hazard/',
        query: ({ params, props }) => ({
            incident: params.incidentId,
        }),
        method: methods.GET,
        onMount: true,

        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;

            if (params && params.HazardData) {
                params.HazardData(citizenReportList);
            }
        },
    },
};

let finalArr = [];
const Contacts = (props: Props) => {
    const [fetchedData, setFetechedData] = useState([]);
    const [tableHeader, setTableHeader] = useState([]);
    const [paginationParameters, setPaginationParameters] = useState();
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(props.page);
    const [offset, setOffset] = useState(0);
    const [orgList, setOrgList] = useState([]);
    const [trainedContacts, setTrainedContacts] = useState([]);
    const [mergedData, setMergedData] = useState([]);
    const [trainingsList, setTrainingsList] = useState([]);
    const [url, setUrl] = useState('/municipality-contact/');
    const [loader, setLoader] = useState(true);
    const [nonGovContacts, setNonGovContacts] = useState([]);
    const [hazardDetails, setHazardDetails] = useState([]);
    /** used for non governmental contact data */
    const [name, setName] = useState('');
    const [organizationType, setOrganizationType] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [position, setPosition] = useState('');
    const [trainedTitle, setTrainedTitle] = useState('');
    const [focusedHazard, setFocusHazard] = useState();
    const [trainActivities, setTrainingActivities] = useState('');
    const [trainingDateFrom, setTrainingDateFrom] = useState('');
    const [trainingDateTo, setTrainingDateTo] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');

    const { requests: {
        PalikaReportInventoriesReport,
        OrganisationGetRequest,
        TrainingGetRequest,
        NonGovGetRequest,
        HazardDataGet,

    },
    user } = props;
    const [defaultQueryParameter, setDefaultQueryParameter] = useState('governance');

    const handleFetchedData = (response) => {
        setFetechedData(response);
        setLoader(false);
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

    const handleEditContacts = (contactItem) => {
        const { setPalikaRedirect } = props;
        setPalikaRedirect({
            showForm: true,
            contactItem,
            showModal: 'contact',
            contactID: contactItem.id,
            redirectTo: 7,
        });
        ReachRouter.navigate('/profile/',
            { state: { showForm: true }, replace: true });
    };
    const handleAddContacts = () => {
        const { setPalikaRedirect } = props;
        setPalikaRedirect({
            showForm: true,
            showModal: 'contact',
            redirectTo: 7,
        });
        ReachRouter.navigate('/profile/',
            { state: { showForm: true }, replace: true });
    };
    const handleNonGovContacts = (response) => {
        setNonGovContacts(response);
    };
    const handleHazardData = (response) => {
        setHazardDetails(response);
    };
    HazardDataGet.setDefaultParams({
        HazardData: handleHazardData,
    });
    NonGovGetRequest.setDefaultParams({
        user,
        nonGovContacts: handleNonGovContacts,
    });
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
    console.log('nonGov contact', nonGovContacts);

    useEffect(() => {
        if (mergedData.length > 0) {
            const arr = [];
            const data = mergedData.map((item) => {
                if (item.trainingTitle) {
                    return (item.trainingTitle);
                }
                return null;
            }).filter(contact => contact !== null).map(e => arr.push(...e));
            setTrainingsList(arr);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mergedData]);

    useEffect(() => {
        const mergedList = [];
        if (fetchedData.length > 0 && orgList.length > 0 && trainedContacts.length > 0) {
            fetchedData.map((item) => {
                const orgTypeObj = orgList.filter(org => org.id === item.organization);
                const trainedContactsObj = trainedContacts.filter(cts => cts.contact === item.id);
                if (orgTypeObj.length > 0) {
                    mergedList.push({
                        ...item,
                        orgType: (orgTypeObj[0].title || '-'),
                        orgName: (orgTypeObj[0].longName || '-'),
                        trainingTitle: (trainedContactsObj.map(trainings => trainings.title)),
                        trainingDuration: (trainedContactsObj
                            .map(trainings => trainings.durationDays)),
                    });
                    setMergedData(mergedList);
                    console.log('contact id? merged list: ', mergedList);
                } else {
                    mergedList.push({ ...item, orgType: '-', orgName: '-' });
                    setMergedData(mergedData);
                }
                return null;
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchedData, orgList, trainedContacts]);
    useEffect(() => {
        if (nonGovContacts && hazardDetails) {
            const finalfetchedData = nonGovContacts.map((item, i) => {
                const hazardName = hazardDetails.find(data => data.id === item.focusedHazard);

                if (hazardName) {
                    return { hazardName: hazardName.titleEn,
                        item };
                }

                return null;
            });

            finalArr = [...new Set(finalfetchedData)];
        }
    }, [nonGovContacts, hazardDetails]);

    console.log('Final array', finalArr);
    console.log('Final array', nonGovContacts);
    return (
        <>
            {
                !props.previewDetails
                && (
                    <div className={styles.tabsPageContainer}>
                        <h2>
                                Contacts
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
                                        <th>Training Duration(Days)</th>
                                        <th>Contact number</th>
                                        <th>Email</th>
                                        <th>Action</th>
                                    </tr>
                                    {loader ? (
                                        <>
                                            {' '}
                                            <Loader
                                                top="50%"
                                                left="60%"
                                            />
                                            <p className={styles.loaderInfo}>Loading...Please Wait</p>
                                        </>
                                    ) : (
                                        <>
                                            {mergedData
                                                ? mergedData.map((item, i) => (
                                                    <tr key={item.id}>
                                                        <td>{i + 1}</td>
                                                        <td>{item.name || '-'}</td>
                                                        <td>{item.orgType || '-'}</td>
                                                        <td>{item.position || '-'}</td>
                                                        <td>{item.orgName || '-'}</td>
                                                        <td>
                                                            {
                                                                item.trainingTitle
                                                                    ? item.trainingTitle.map(training => training)
                                                                    : '-'
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                item.trainingDuration
                                                                    ? item.trainingDuration.map(training => training)
                                                                    : '-'
                                                            }
                                                        </td>
                                                        <td>{item.mobileNumber || '-'}</td>
                                                        <td>{item.email || '-'}</td>
                                                        <td>
                                                            <button
                                                                className={styles.editButtn}
                                                                type="button"
                                                                onClick={() => handleEditContacts(item)}
                                                                title="Edit Contact"
                                                            >

                                                                <ScalableVectorGraphics
                                                                    className={styles.bulletPoint}
                                                                    src={editIcon}
                                                                    alt="editPoint"
                                                                />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                                : '-'
                                            }
                                        </>
                                    )}
                                </tbody>
                            </table>
                            {!loader && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handleAddContacts()}
                                        className={styles.savebtn}
                                    >
                                        <Icon
                                            name="plus"
                                            className={styles.plusIcon}
                                        />
                            Add Contact
                                    </button>

                                </>
                            )}
                        </div>
                        {!loader && (
                            <>
                                <h2>Non-Governmental Contact</h2>
                                <table id="table-to-xls">
                                    <tbody>
                                        <tr>
                                            <th>
                                    SN
                                            </th>
                                            <th>
                                    Name
                                            </th>
                                            <th>
                                    Type of Organization
                                            </th>
                                            <th>
                                    Name of Organization
                                            </th>
                                            <th>
                                    Position
                                            </th>
                                            <th>
                                    Trained Title
                                            </th>
                                            <th>
                                    Focused Hazard
                                            </th>
                                            <th>
                                Activities included in the training
                                            </th>
                                            <th>
                               Training Date(from)
                                            </th>
                                            <th>
                                Training Date(to)
                                            </th>
                                            <th>
                                Contact number
                                            </th>
                                            <th>
                                Email
                                            </th>
                                            <th>Action</th>

                                        </tr>
                                        {finalArr && finalArr.map((data, i) => (
                                            <tr key={data.item.id}>
                                                <td>{i + 1}</td>
                                                <td>{data.item.name}</td>
                                                <td>{data.item.typeOfOrganization}</td>
                                                <td>{data.item.nameOfOrganization}</td>
                                                <td>{data.item.position}</td>
                                                <td>{data.item.trainedTitle}</td>
                                                <td>{data.hazardName}</td>
                                                <td>{data.item.trainingActivities}</td>
                                                <td>{data.item.trainingDateFrom}</td>
                                                <td>{data.item.trainingDateTo}</td>
                                                <td>{data.item.contactNumber}</td>
                                                <td>{data.item.email}</td>
                                                <td>
                                                    <td>

                                                        <button
                                                            className={styles.editButtn}
                                                            type="button"

                                                            title="Edit Non Governmental Contact"
                                                        >
                                                            <ScalableVectorGraphics
                                                                className={styles.bulletPoint}
                                                                src={editIcon}
                                                                alt="editPoint"
                                                            />
                                                        </button>
                                                    </td>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td>{nonGovContacts.length + 1}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className={styles.inputElement}
                                                    value={name}
                                                    placeholder={'Name of Activity'}
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    value={organizationType}
                                                    className={styles.inputElement}
                                                >
                                                    <option value="">Select Priority Area</option>
                                                    <option value="">Federal Governement</option>
                                                    <option value="">Municipal Government</option>
                                                    <option value="">Nepal Police </option>
                                                    <option value="">Armed Police Force</option>
                                                    <option value="">Army</option>
                                                    <option value="">I/NGO</option>
                                                    <option value="">Others</option>


                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className={styles.inputElement}
                                                    value={organizationName}
                                                    placeholder={'Name of Activity'}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className={styles.inputElement}
                                                    value={position}
                                                    placeholder={'Name of Activity'}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className={styles.inputElement}
                                                    value={trainedTitle}
                                                    placeholder={'Name of Activity'}
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    value={focusedHazard}
                                                    className={styles.inputElement}
                                                >
                                                    <option value="">Select Priority Area</option>
                                                    {hazardDetails.map(data => (
                                                        <option value={data.title}>
                                                            {data.titleEn}
                                                        </option>
                                                    ))}


                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className={styles.inputElement}

                                                    placeholder={'Name of Activity'}
                                                />
                                            </td>
                                            <td>
                                                <NepaliDatePicker
                                                    inputClassName="form-control"
                                                    className={styles.datepicker}

                                                    options={{ calenderLocale: 'en', valueLocale: 'en' }}
                                                />
                                            </td>
                                            <td>
                                                <NepaliDatePicker
                                                    inputClassName="form-control"
                                                    className={styles.datepicker}

                                                    options={{ calenderLocale: 'en', valueLocale: 'en' }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className={styles.inputElement}

                                                    placeholder={'Name of Activity'}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className={styles.inputElement}

                                                    placeholder={'Name of Activity'}
                                                />
                                            </td>
                                        </tr>


                                    </tbody>
                                </table>
                                {!loader && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleAddContacts()}
                                            className={styles.savebtn}
                                        >
                                            <Icon
                                                name="plus"
                                                className={styles.plusIcon}
                                            />
                            Add Contact
                                        </button>
                                        <NextPrevBtns
                                            handlePrevClick={props.handlePrevClick}
                                            handleNextClick={props.handleNextClick}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )
            }
            {
                props.previewDetails
                && (
                    <div className={styles.budgetPreviewContainer}>
                        <div className={styles.simElementsContainer}>
                            <h2>
                                 DRR Related Training
                            </h2>
                            <div className={styles.simRow}>
                                <div className={styles.simElements}>
                                    <div className={styles.circlePatch}>
                                        {mergedData.length > 0
                                        && mergedData.map((item) => {
                                            if (item.trainingTitle) {
                                                return item;
                                            }
                                            return null;
                                        }).filter(contact => contact !== null).length
                                        }
                                    </div>
                                    <p className={styles.simDesc}>
                                    No. of trained people
                                    </p>
                                </div>
                                <div className={styles.simElements}>
                                    <div className={styles.circlePatch}>
                                        {trainingsList.length}
                                    </div>
                                    <p className={styles.simDesc}>
                                 Training Activities
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.simElementsContainer}>
                            <p>List of training activities</p>
                            <div className={styles.simRow}>
                                <div className={styles.simElements}>
                                    <ul>
                                        {trainingsList.length > 0
                                    && trainingsList.map(item => (
                                        <li key={Math.random()}>
                                            {item}
                                        </li>
                                    ))

                                        }
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
        </>
    );
};


export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Contacts,
        ),
    ),
);
