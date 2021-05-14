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
    palikaRedirectSelector,
    generalDataSelector,
    drrmRegionSelector } from '#selectors';
import NextPrevBtns from '../../NextPrevBtns';


import {
    setPalikaRedirectAction,
    setDrrmContactsAction,
} from '#actionCreators';
import Icon from '#rscg/Icon';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import editIcon from '#resources/palikaicons/edit.svg';

const mapDispatchToProps = dispatch => ({
    setPalikaRedirect: params => dispatch(setPalikaRedirectAction(params)),
    setDrrmContacts: params => dispatch(setDrrmContactsAction(params)),

});

interface Props{

}

const mapStateToProps = (state, props) => ({
    generalData: generalDataSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    user: userSelector(state),
    palikaRedirect: palikaRedirectSelector(state),
    drrmRegion: drrmRegionSelector(state),

});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    PalikaReportInventoriesReport: {
        url: ({ params }) => `${params.url}`,
        query: ({ params, props }) => {
            if (params && params.province) {
                return {
                    province: params.province,
                    district: params.district,
                    municipality: params.municipality,
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
        onFailure: ({ error, params }) => {
            params.setErrors(error);
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
        onFailure: ({ error, params }) => {
            params.setErrors(error);
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
        onFailure: ({ error, params }) => {
            params.setErrors(error);
        },
    },
    NonGovGetRequest: {
        url: '/nongov-contact/',
        query: ({ params, props }) => ({
            province: params.province,
            district: params.district,
            municipality: params.municipality,

        }),
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params }) => {
            const trainingContacts = response as MultiResponse<CitizenReport>;
            const { results } = trainingContacts;
            if (params && params.nonGovContacts) {
                params.nonGovContacts(results);
            }
        },
        onFailure: ({ error, params }) => {
            params.setErrors(error);
        },

    },
    NonGovPostRequest: {
        url: '/nongov-contact/',
        method: methods.POST,

        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            params.nonGovPostContacts(response);
        },
        onFailure: ({ error, params }) => {
            params.setErrors(error);
        },


    },
    NonGovPutRequest: {
        url: ({ params }) => `/nongov-contact/${params.id}/`,
        method: methods.PUT,

        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            params.nonGovPostContacts(response);
        },
        onFailure: ({ error, params }) => {
            params.setErrors(error);
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
let province = 0;
let district = 0;
let municipality = 0;

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
    const [nonGovContactId, setNonGovContactId] = useState();
    const [nonGovContactIndex, setNonGovContactIndex] = useState();
    const [postErrors, setPostErrors] = useState({});
    const [editBtnClicked, setEditBtnClicked] = useState(false);


    const [checkedRows, setCheckedRows] = useState([]);
    const [checkedAll, setCheckedAll] = useState(true);
    const [dataWithIndex, setDataWithIndex] = useState<number[]>([]);


    const { requests: {
        PalikaReportInventoriesReport,
        OrganisationGetRequest,
        TrainingGetRequest,
        NonGovGetRequest,
        HazardDataGet,
        NonGovPostRequest,
        NonGovPutRequest,
    },
    setDrrmContacts, drrmRegion,
    user, generalData } = props;
    const [defaultQueryParameter, setDefaultQueryParameter] = useState('governance');

    if (drrmRegion.municipality) {
        municipality = drrmRegion.municipality;
        district = drrmRegion.district;
        province = drrmRegion.province;
    } else {
        municipality = user.profile.municipality;
        district = user.profile.district;
        province = user.profile.province;
    }

    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    const handleErrors = (errors) => {
        setPostErrors(errors);
        setLoader(false);
    };
    const OrganizationTypeChange = (e) => {
        setOrganizationType(e.target.value);
    };

    const OrganizationNameChange = (e) => {
        setOrganizationName(e.target.value);
    };

    const handlePositionChange = (e) => {
        setPosition(e.target.value);
    };

    const handleTraining = (e) => {
        setTrainedTitle(e.target.value);
    };

    const handleFocusedHazard = (e) => {
        setFocusHazard(e.target.value);
    };

    const handleActivities = (e) => {
        setTrainingActivities(e.target.value);
    };

    const handleContact = (e) => {
        setContactNumber(e.target.value);
    };
    const handleEmail = (e) => {
        setEmail(e.target.value);
    };
    const handleNonGovContacts = (response) => {
        setNonGovContacts(response);
        setLoader(false);
    };
    const handleNonGovPostContacts = (response) => {
        setName('');
        setOrganizationType('');
        setOrganizationName('');
        setPosition('');
        setTrainedTitle('');
        setTrainingActivities('');
        setTrainingDateFrom('');
        setTrainingDateTo('');
        setContactNumber('');
        setEmail('');
        setFocusHazard(null);
        setNonGovContactId(null);

        NonGovGetRequest.do({
            municipality,
            district,
            province,
            nonGovContacts: handleNonGovContacts,
            setErrors: handleErrors,
        });
    };
    const handleEditnonGovContact = (id, index) => {
        setNonGovContactId(id);
        setNonGovContactIndex(index);
        setEditBtnClicked(!editBtnClicked);
    };
    useEffect(() => {
        if (nonGovContacts.length > 0) {
            setName(finalArr[nonGovContactIndex].item.name);
            setOrganizationType(finalArr[nonGovContactIndex].item.typeOfOrganization);
            setOrganizationName(finalArr[nonGovContactIndex].item.nameOfOrganization);
            setPosition(finalArr[nonGovContactIndex].item.position);
            setTrainedTitle(finalArr[nonGovContactIndex].item.trainedTitle);
            setTrainingActivities(finalArr[nonGovContactIndex].item.trainingActivities);
            setTrainingDateFrom(finalArr[nonGovContactIndex].item.trainingDateFrom);
            setTrainingDateTo(finalArr[nonGovContactIndex].item.trainingDateTo);
            setContactNumber(finalArr[nonGovContactIndex].item.contactNumber);
            setEmail(finalArr[nonGovContactIndex].item.email);
            setFocusHazard(finalArr[nonGovContactIndex].item.focusedHazard);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nonGovContactIndex, editBtnClicked]);

    const handleAddNonGovContacts = () => {
        setLoader(true);
        NonGovPostRequest.do({
            body: {
                name,
                typeOfOrganization: organizationType,
                nameOfOrganization: organizationName,
                position,
                trainedTitle,
                trainingActivities: trainActivities,
                trainingDateFrom,
                trainingDateTo,
                contactNumber,
                email,
                focusedHazard,
                province,
                district,
                municipality,
                fiscalYear: generalData.fiscalYear,
            },
            nonGovPostContacts: handleNonGovPostContacts,
            setErrors: handleErrors,

        });
    };
    const handleHazardData = (response) => {
        setHazardDetails(response);
    };
    HazardDataGet.setDefaultParams({
        HazardData: handleHazardData,
    });
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
    const handleUpdateActivity = () => {
        setLoader(true);
        NonGovPutRequest.do({
            body: {
                name,
                typeOfOrganization: organizationType,
                nameOfOrganization: organizationName,
                position,
                trainedTitle,
                trainingActivities: trainActivities,
                trainingDateFrom,
                trainingDateTo,
                contactNumber,
                email,
                focusedHazard,
                province,
                district,
                municipality,
                fiscalYear: generalData.fiscalYear,
            },
            nonGovPostContacts: handleNonGovPostContacts,
            id: nonGovContactId,
            setErrors: handleErrors,

        });
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


    NonGovGetRequest.setDefaultParams({
        municipality,
        province,
        district,
        nonGovContacts: handleNonGovContacts,
        setErrors: handleErrors,
    });
    PalikaReportInventoriesReport.setDefaultParams({
        organisation: handleFetchedData,
        paginationParameters: handlePaginationParameters,
        url,
        page: paginationQueryLimit,
        inventories: defaultQueryParameter,
        municipality,
        district,
        province,
        setErrors: handleErrors,
    });
    OrganisationGetRequest.setDefaultParams({
        setOrgs: handleOrg,
        setErrors: handleErrors,
    });
    TrainingGetRequest.setDefaultParams({
        setTrainedContacts: handletrainedContacts,
        setErrors: handleErrors,
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
                    const chkArr = Array.from(Array(mergedList.length).keys());
                    setCheckedRows(chkArr);
                    setDataWithIndex(mergedList.map((items, i) => ({ ...items, index: i, selectedRow: true })));
                } else {
                    mergedList.push({ ...item, orgType: '-', orgName: '-' });
                    setMergedData(mergedData);
                    const chkArr = Array.from(Array(mergedList.length).keys());
                    setCheckedRows(chkArr);
                    setDataWithIndex(mergedList.map((it, i) => ({ ...it, index: i, selectedRow: true })));
                }
                return null;
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchedData, orgList, trainedContacts]);

    useEffect(() => {
        if (nonGovContacts && hazardDetails.length > 0) {
            const finalfetchedData = nonGovContacts.map((item, i) => {
                const hazardName = hazardDetails.find(data => data.id === item.focusedHazard);

                if (hazardName) {
                    return { hazardName: hazardName.titleEn,
                        item };
                }

                return null;
            });

            finalArr = [...new Set(finalfetchedData)];

            console.log('Final array');
        }
    }, [nonGovContacts, hazardDetails]);

    const handleCheckAll = (e) => {
        setCheckedAll(e.target.checked);
        if (e.target.checked) {
            setCheckedRows(Array.from(Array(mergedData.length).keys()));
            setDataWithIndex(mergedData.map((item, i) => ({ ...item, index: i, selectedRow: true })));
        } else {
            setCheckedRows([]);
            setDataWithIndex(mergedData.map((item, i) => ({ ...item, index: i, selectedRow: false })));
        }
    };

    const handleCheck = (idx: number, e) => {
        setCheckedAll(false);

        if (e.target.checked) {
            const arr = [...checkedRows, idx];
            setCheckedRows(arr);
            setDataWithIndex(dataWithIndex.map((item) => {
                if (item.index === idx) {
                    return Object.assign({}, item, { selectedRow: true });
                }
                return item;
            }));
        } else {
            setCheckedRows(checkedRows.filter(item => item !== idx));

            setDataWithIndex(dataWithIndex.map((item) => {
                if (item.index === idx) {
                    return Object.assign({}, item, { selectedRow: false });
                }
                return item;
            }));
        }
    };

    const handleNext = () => {
        setDrrmContacts(dataWithIndex);
        props.handleNextClick();
    };

    // console.log('Final array', loader);
    console.log('Final array', finalArr);
    console.log('hazard', hazardDetails);
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
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={checkedRows.indexOf(i) !== -1}

                                                            // defaultChecked
                                                                onChange={e => handleCheck(i, e)}
                                                                className={styles.checkBox}
                                                                key={item.id}
                                                            />
                                                        </td>
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
                                        {finalArr && finalArr.length > 0 && finalArr.map((data, i) => (
                                            nonGovContactId === data.item.id
                                                ? (
                                                    <tr>
                                                        <td>{nonGovContacts.length + 1}</td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className={styles.inputElement}
                                                                value={name}
                                                                placeholder={'Name'}
                                                                onChange={handleNameChange}
                                                            />
                                                        </td>
                                                        <td>
                                                            <select
                                                                value={organizationType}
                                                                className={styles.inputElement}
                                                                onChange={OrganizationTypeChange}
                                                            >
                                                                <option value="">Select Organization Type</option>
                                                                <option value="Federal Governement">Federal Governement</option>
                                                                <option value="Municipal Government">Municipal Government</option>
                                                                <option value="Nepal Police">Nepal Police </option>
                                                                <option value="Armed Police Force">Armed Police Force</option>
                                                                <option value="Army">Army</option>
                                                                <option value="I/NGO">I/NGO</option>
                                                                <option value="Others">Others</option>


                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className={styles.inputElement}
                                                                value={organizationName}
                                                                onChange={OrganizationNameChange}
                                                                placeholder={'Name of Organization'}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className={styles.inputElement}
                                                                value={position}
                                                                placeholder={'Position'}
                                                                onChange={handlePositionChange}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className={styles.inputElement}
                                                                value={trainedTitle}
                                                                onChange={handleTraining}
                                                                placeholder={'Training Title'}
                                                            />
                                                        </td>
                                                        <td>
                                                            <select
                                                                value={focusedHazard}
                                                                className={styles.inputElement}
                                                                onChange={handleFocusedHazard}
                                                            >
                                                                <option value="">Select Focused Hazard</option>
                                                                {hazardDetails.map(item => (
                                                                    <option value={item.id}>
                                                                        {item.titleEn}
                                                                    </option>
                                                                ))}


                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className={styles.inputElement}
                                                                value={trainActivities}
                                                                onChange={handleActivities}
                                                                placeholder={'Activities included in training'}
                                                            />
                                                        </td>
                                                        <td>
                                                            <NepaliDatePicker
                                                                inputClassName="form-control"
                                                                className={styles.datepicker}
                                                                value={trainingDateFrom}
                                                                onChange={date => setTrainingDateFrom(date)}
                                                                options={{ calenderLocale: 'en', valueLocale: 'en' }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <NepaliDatePicker
                                                                inputClassName="form-control"
                                                                className={styles.datepicker}
                                                                value={trainingDateTo}
                                                                onChange={date => setTrainingDateTo(date)}
                                                                options={{ calenderLocale: 'en', valueLocale: 'en' }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className={styles.inputElement}
                                                                value={contactNumber}
                                                                onChange={handleContact}
                                                                placeholder={'Contact Number'}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className={styles.inputElement}
                                                                value={email}
                                                                onChange={handleEmail}
                                                                placeholder={'Email'}
                                                            />
                                                        </td>
                                                        <td>
                                                            <button
                                                                className={styles.updateButtn}
                                                                type="button"
                                                                onClick={handleUpdateActivity}
                                                                title="Update Budget Activity"
                                                            >
                                                     Update
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                                : (
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


                                                            <button
                                                                className={styles.editButtn}
                                                                type="button"
                                                                onClick={() => handleEditnonGovContact(data.item.id, i)}
                                                                title="Edit Non Governmental Contact"
                                                            >
                                                                <ScalableVectorGraphics
                                                                    className={styles.bulletPoint}
                                                                    src={editIcon}
                                                                    alt="editPoint"
                                                                />
                                                            </button>

                                                        </td>
                                                    </tr>
                                                )
                                        ))}
                                        {!nonGovContactId && (
                                            <>
                                                <tr>
                                                    <td>{nonGovContacts.length + 1}</td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className={styles.inputElement}
                                                            value={name}
                                                            placeholder={'Name'}
                                                            onChange={handleNameChange}
                                                        />
                                                    </td>
                                                    <td>
                                                        <select
                                                            value={organizationType}
                                                            className={styles.inputElement}
                                                            onChange={OrganizationTypeChange}
                                                        >
                                                            <option value="">Select Organization Type</option>
                                                            <option value="Federal Governement">Federal Governement</option>
                                                            <option value="Municipal Government">Municipal Government</option>
                                                            <option value="Nepal Police">Nepal Police </option>
                                                            <option value="Armed Police Force">Armed Police Force</option>
                                                            <option value="Army">Army</option>
                                                            <option value="I/NGO">I/NGO</option>
                                                            <option value="Others">Others</option>


                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className={styles.inputElement}
                                                            value={organizationName}
                                                            onChange={OrganizationNameChange}
                                                            placeholder={'Name of Organization'}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className={styles.inputElement}
                                                            value={position}
                                                            placeholder={'Position'}
                                                            onChange={handlePositionChange}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className={styles.inputElement}
                                                            value={trainedTitle}
                                                            onChange={handleTraining}
                                                            placeholder={'Training Title'}
                                                        />
                                                    </td>
                                                    <td>
                                                        <select
                                                            value={focusedHazard}
                                                            className={styles.inputElement}
                                                            onChange={handleFocusedHazard}
                                                        >
                                                            <option value="">Select Focused Hazard</option>
                                                            {hazardDetails.map(data => (
                                                                <option value={data.id}>
                                                                    {data.titleEn}
                                                                </option>
                                                            ))}


                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className={styles.inputElement}
                                                            value={trainActivities}
                                                            onChange={handleActivities}
                                                            placeholder={'Activities included in training'}
                                                        />
                                                    </td>
                                                    <td>
                                                        <NepaliDatePicker
                                                            inputClassName="form-control"
                                                            className={styles.datepicker}
                                                            value={trainingDateFrom}
                                                            onChange={date => setTrainingDateFrom(date)}
                                                            options={{ calenderLocale: 'en', valueLocale: 'en' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <NepaliDatePicker
                                                            inputClassName="form-control"
                                                            className={styles.datepicker}
                                                            value={trainingDateTo}
                                                            onChange={date => setTrainingDateTo(date)}
                                                            options={{ calenderLocale: 'en', valueLocale: 'en' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className={styles.inputElement}
                                                            value={contactNumber}
                                                            onChange={handleContact}
                                                            placeholder={'Contact Number'}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className={styles.inputElement}
                                                            value={email}
                                                            onChange={handleEmail}
                                                            placeholder={'Email'}
                                                        />
                                                    </td>
                                                </tr>
                                            </>
                                        )}


                                    </tbody>
                                </table>
                                {
                                    Object.keys(postErrors).length > 0
                        && (
                            <ul>
                                <li>
                                    <span className={styles.errorHeading}>
                                    Please fix the following errors:
                                    </span>
                                </li>
                                {
                                    Object.keys(postErrors.response).map(errorItem => (
                                        <li>
                                            {`${errorItem}: ${postErrors.response[errorItem]}`}
                                        </li>
                                    ), // return <li>Please enter valid info in all fields</li>;
                                    )
                                }

                            </ul>
                        )
                                }
                                {!loader && !nonGovContactId
                                    && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => handleAddNonGovContacts()}
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
                                                handleNextClick={handleNext}
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
