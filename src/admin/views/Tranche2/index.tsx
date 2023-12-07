/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-undef */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { navigate, useLocation } from '@reach/router';
import Navbar from 'src/admin/components/Navbar';
import Footer from 'src/admin/components/Footer';
import MenuCommon from 'src/admin/components/MenuCommon';
import Modal from 'src/admin/components/Modal';
import Select from 'react-select';
import Page from '#components/Page';
import {
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
    userSelector,
} from '#selectors';
import { SetEpidemicsPageAction } from '#actionCreators';
import { ADToBS } from 'bikram-sambat-js';
import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import { englishToNepaliNumber } from 'nepali-number';
import 'nepali-datepicker-reactjs/dist/index.css';
import styles from './styles.module.scss';
import ListSvg from '../../resources/list.svg';
import Ideaicon from '../../resources/ideaicon.svg';


const mapStateToProps = (state, props) => ({
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    user: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setEpidemicsPage: params => dispatch(SetEpidemicsPageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {

    addEarthquakePostRequest: {
        url: '/temporary-shelter-enrollment-form/',
        method: methods.POST,
        query: { meta: true },
        onMount: false,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({
            params: { onSuccess } = { onSuccess: undefined },
            response,
        }) => {
            if (onSuccess) {
                onSuccess(response as PageType.Resource);
            }
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                const errorKey = Object.keys(error.response).find(i => i === 'ward');

                if (errorKey) {
                    const errorList = error.response;
                    errorList.location = errorList.ward;
                    delete errorList.ward;

                    params.setFaramErrors(errorList);
                } else {
                    const data = error.response;
                    const resultError = {};
                    const keying = Object.keys(data);
                    const valuing = Object.values(data).map(item => item[0]);
                    const outputError = () => {
                        const outputFinalError = keying.map((item, i) => (
                            resultError[`${item}`] = valuing[i]
                        ));
                        return outputFinalError;
                    };
                    outputError();


                    params.setFaramErrors(resultError);
                }
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setFaramErrors) {
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
        extras: { hasFile: true },
    },
    getEarthquakeRequest: {
        url: ({ params }) => `/temporary-shelter-enrollment-form/${params.id}/`,
        method: methods.GET,
        onMount: false,
        onSuccess: ({ response, props, params }) => {
            params.fetchedData(response);
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
            }
        },
        onFatal: ({ error, params }) => {
            console.warn('failure', error);
        },
    },
};

const Tranche2 = (props) => {
    const [added, setAdded] = useState(false);
    const [updated, setUpdated] = useState(false);

    const [data, setData] = useState(
        {
            entry_date_bs: '',
            pa_number: null,
            tole_name: '',
            grand_parent_title: 'श्री',
            grand_parent_name: '',
            grand_child_relation: null,
            parent_title: 'श्री',
            parent_name: '',
            child_relation: null,
            beneficiary_age: null,
            beneficiary_name_nepali: '',
            temporary_shelter_land_tole: '',
            beneficiary_name_english: '',
            beneficiary_citizenship_number: '',
            beneficiary_contact_number: '',
            beneficiary_photo: null,
            is_beneficiary_available_to_sign: false,
            beneficiary_representative_name_nepali: '',
            beneficiary_representative_citizenship_number: '',
            beneficiary_representative_grandfather_name: '',
            beneficiary_representative_parent_name: '',
            bank_account_holder_name: '',
            bank_account_number: '',
            bank_name: '',
            bank_branch_name: '',
            migration_certificate_number: '',
            migration_date_bs: '',
            signed_date: '',
            withness_name_nepali: '',
            withness_relation: '',
            withness_contact_number: '',
            operating_municipality_officer_name: '',
            operating_municipality_signed_date: '',
            identity_document: null,
            infrastructure_photo: null,
            application_document: null,
            police_report: null,
            beneficiary_district: null,
            beneficiary_municipality: null,
            beneficiary_ward: null,
            temporary_shelter_land_district: null,
            temporary_shelter_land_municipality: null,
            temporary_shelter_land_ward: null,
            beneficiary_representative_district: null,
            beneficiary_representative_municipality: null,
            beneficiary_representative_ward: null,
            operating_municipality: null,
        },
    );

    const [errorFields, setErrorFields] = useState({
        entry_date_bs: false,
        pa_number: false,
        tole_name: false,
        grand_parent_title: false,
        grand_parent_name: false,
        grand_child_relation: false,
        parent_title: false,
        parent_name: false,
        child_relation: false,
        beneficiary_age: false,
        beneficiary_name_nepali: false,
        temporary_shelter_land_tole: false,
        beneficiary_name_english: false,
        beneficiary_citizenship_number: false,
        beneficiary_contact_number: false,
        beneficiary_photo: false,
        is_beneficiary_available_to_sign: false,
        beneficiary_representative_name_nepali: false,
        beneficiary_representative_citizenship_number: false,
        beneficiary_representative_grandfather_name: false,
        beneficiary_representative_parent_name: false,
        beneficiary_representative_district: false,
        beneficiary_representative_municipality: false,
        beneficiary_representative_ward: false,
        bank_account_holder_name: false,
        bank_account_number: false,
        bank_name: false,
        bank_branch_name: false,
        migration_certificate_number: false,
        migration_date_bs: false,
        signed_date: false,
        withness_name_nepali: false,
        withness_relation: false,
        withness_contact_number: false,
        operating_municipality_officer_name: false,
        operating_municipality_signed_date: false,
        identity_document: false,
        infrastructure_photo: false,
        application_document: false,
        police_report: false,
        beneficiary_district: false,
        beneficiary_municipality: false,
        beneficiary_ward: false,
        temporary_shelter_land_district: false,
        temporary_shelter_land_municipality: false,
        temporary_shelter_land_ward: false,
        operating_municipality: false,
    });
    const [loading, setLoading] = useState(false);
    const [backendError, setBackendError] = useState(false);
    const [fetchedData, setFetchedData] = useState(null);
    const { pathname } = useLocation();
    const { user,
        districts,
        municipalities,
        wards,
        uri,
        requests: {
            addEarthquakePostRequest,

        } } = props;


    const handleFileInputChange = (e) => {
        setErrorFields({
            ...errorFields,
            [e.target.name]: false,
        });
        const file = e.target.files[0];
        setData({ ...data, [e.target.name]: file });
        // setSelectedFile(file);
        // setSelectedFile(file);
    };
    const handleShowImage = (file) => {
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            return imageUrl;
        }
    };
    const handleUpdateSuccess = () => {
        setAdded(false);
        setUpdated(false);

        navigate('/admin/temporary-shelter-enrollment-form/temporary-shelter-enrollment-form-data-table');
    };
    const handleAddedSuccess = () => {
        setAdded(false);
        setUpdated(false);
    };
    const handleErrorClose = () => {
        setAdded(false);
        setUpdated(false);
    };
    const handleTableButton = () => {
        navigate('/admin/temporary-shelter-enrollment-form/temporary-shelter-enrollment-form-data-table');
    };
    const handleFormData = (e) => {
        setErrorFields({
            ...errorFields,
            [e.target.name]: false,
        });

        if (e.target.name === 'beneficiary_district') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                beneficiary_municipality: null,
                beneficiary_ward: null,
            });
        } else if (e.target.name === 'beneficiary_municipality') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                beneficiary_ward: null,
            });
        } else if (e.target.name === 'temporary_shelter_land_district') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                temporary_shelter_land_municipality: null,
                temporary_shelter_land_ward: null,
            });
        } else if (e.target.name === 'temporary_shelter_land_municipality') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                temporary_shelter_land_ward: null,
            });
        } else if (e.target.name === 'beneficiary_representative_district') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                beneficiary_representative_municipality: null,
                beneficiary_representative_ward: null,
            });
        } else if (e.target.name === 'beneficiary_representative_municipality') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                beneficiary_representative_ward: null,
            });
        } else {
            setData({
                ...data, [e.target.name]: e.target.value,
            });
        }
    };

    const selectedMunicipality = municipalities.filter(i => i.district === Number(data.beneficiary_district));
    // const selectedWard =user&&user.profile&& wards.filter(i => i.municipality === Number(user.profile.municipality data.beneficiary_municipality));
    const selectedWard = user.isSuperuser
        ? user && user.profile && wards.filter(i => i.municipality === Number(data.beneficiary_municipality))
        : user && user.profile && wards.filter(i => i.municipality === (user.profile.municipality));
    const tempSelectedMunicipality = municipalities.filter(i => i.district === Number(data.temporary_shelter_land_district));
    // const tempSelectedWard = wards.filter(i => i.municipality === Number(data.temporary_shelter_land_municipality));
    const tempSelectedWard = user.isSuperuser
        ? user && user.profile && wards.filter(i => i.municipality === Number(data.temporary_shelter_land_municipality))
        : user && user.profile && wards.filter(i => i.municipality === user.profile.municipality);
    const beneficiarySelectedMunicipality = municipalities.filter(i => i.district === Number(data.beneficiary_representative_district));
    // const beneficiarySelectedWard = wards.filter(i => i.municipality === Number(data.beneficiary_representative_municipality));
    const beneficiarySelectedWard = user.isSuperuser
        ? user && user.profile && wards.filter(i => i.municipality === Number(data.beneficiary_representative_municipality))
        : user && user.profile && wards.filter(i => i.municipality === user.profile.municipality);


    const handleSuccessMessage = (d) => {
        navigate(`/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data-preview/${d.id}`);
    };
    const handleClick = () => {
        setBackendError(false);
        const errorCheckingFields = Object.keys(data);
        const latestErrorUpdate = errorFields;

        errorCheckingFields.map((i) => {
            if (!data[i]) {
                if (!data.is_beneficiary_available_to_sign) {
                    latestErrorUpdate.is_beneficiary_available_to_sign = false;
                    latestErrorUpdate.beneficiary_representative_name_nepali = false;
                    latestErrorUpdate.beneficiary_representative_citizenship_number = false;
                    latestErrorUpdate.beneficiary_representative_grandfather_name = false;
                    latestErrorUpdate.beneficiary_representative_ward = false;
                    latestErrorUpdate.beneficiary_representative_parent_name = false;
                    latestErrorUpdate.beneficiary_representative_district = false;
                    latestErrorUpdate.beneficiary_representative_municipality = false;
                }
                if (i === 'migration_certificate_number') {
                    return latestErrorUpdate[i] = false;
                }

                // if (i === 'responsible_municipality') {
                //     return latestErrorUpdate[i] = false;
                // }
                if (i === 'bank_account_holder_name') {
                    return latestErrorUpdate[i] = false;
                }
                if (i === 'bank_account_number') {
                    return latestErrorUpdate[i] = false;
                }
                if (i === 'bank_name') {
                    return latestErrorUpdate[i] = false;
                }
                if (i === 'bank_branch_name') {
                    return latestErrorUpdate[i] = false;
                }
                if (i === 'pa_number') {
                    return latestErrorUpdate[i] = false;
                }

                if (i === 'application_document') {
                    return latestErrorUpdate[i] = false;
                }


                if (!user.isSuperuser) {
                    if (i === 'beneficiary_municipality') {
                        return latestErrorUpdate[i] = false;
                    }
                    if (i === 'beneficiary_district') {
                        return latestErrorUpdate[i] = false;
                    }
                    if (i === 'temporary_shelter_land_district') {
                        return latestErrorUpdate[i] = false;
                    }
                    if (i === 'temporary_shelter_land_municipality') {
                        return latestErrorUpdate[i] = false;
                    }
                    if (i === 'beneficiary_representative_district') {
                        return latestErrorUpdate[i] = false;
                    }
                    if (i === 'beneficiary_representative_municipality') {
                        return latestErrorUpdate[i] = false;
                    }
                    if (i === 'operating_municipality') {
                        return latestErrorUpdate[i] = false;
                    }
                }

                return user.isSuperuser && !data.is_beneficiary_available_to_sign && i === 'beneficiary_representative_ward' ? latestErrorUpdate[i] = false : latestErrorUpdate[i] = true;
            } return null;
        });

        setErrorFields({ ...latestErrorUpdate });
        if (Object.values(latestErrorUpdate).filter(i => i === true).length) {
            return;
        }
        setLoading(true);
        const finalUpdateData = data;
        if (!finalUpdateData.migration_certificate_number) {
            finalUpdateData.migration_date_bs = '';
        }
        if (!user.isSuperuser) {
            finalUpdateData.beneficiary_municipality = user.profile.municipality;
            finalUpdateData.beneficiary_district = user.profile.district;

            finalUpdateData.temporary_shelter_land_district = user.profile.district;
            finalUpdateData.temporary_shelter_land_municipality = user.profile.municipality;
            finalUpdateData.beneficiary_representative_district = user.profile.district;
            finalUpdateData.beneficiary_representative_municipality = user.profile.municipality;
            finalUpdateData.operating_municipality = user.profile.municipality;
        }


        addEarthquakePostRequest.do({
            body: finalUpdateData,
            onSuccess: datas => handleSuccessMessage(datas),
            setFaramErrors: (err) => {
                setBackendError(true);
                setLoading(false);
            },

        });
        // return errorCheck;
    };
    // Function to handle checkbox change
    const handleCheckboxChange = () => {
        // Update the state with the opposite value of the current state
        setData({
            ...data,
            is_beneficiary_available_to_sign: !data.is_beneficiary_available_to_sign,
        });
    };

    useEffect(() => {
        const curDate = new Date();
        const day = curDate.getDate();
        const month = curDate.getMonth() + 1;
        const year = curDate.getFullYear();

        // This arrangement can be altered based on how we want the date's format to appear.
        const currentDate = ADToBS(`${year}-${month}-${day}`);
        setData({
            ...data,
            entry_date_bs: currentDate,
            signed_date: currentDate,
            operating_municipality_signed_date: currentDate,
            migration_date_bs: currentDate,
        });
    }, []);
    const handleDropdown = (name, value) => {
        if (name === 'beneficiary_district') {
            setData({
                ...data,
                [name]: value,
                beneficiary_municipality: '',
                beneficiary_ward: '',

            });
        } else if (name === 'beneficiary_municipality') {
            setData({
                ...data,
                [name]: value,
                beneficiary_ward: '',

            });
        } else if (name === 'temporary_shelter_land_district') {
            setData({
                ...data,
                [name]: value,
                temporary_shelter_land_municipality: '',
                temporary_shelter_land_ward: '',

            });
        } else if (name === 'temporary_shelter_land_municipality') {
            setData({
                ...data,
                [name]: value,
                temporary_shelter_land_ward: '',

            });
        } else if (name === 'beneficiary_representative_district') {
            setData({
                ...data,
                [name]: value,
                beneficiary_representative_municipality: '',
                beneficiary_representative_ward: '',

            });
        } else if (name === 'beneficiary_representative_municipality') {
            setData({
                ...data,
                [name]: value,
                beneficiary_representative_ward: '',

            });
        } else {
            setData({
                ...data,
                [name]: value,


            });
        }

        // setErrorPersonal({ ...errorPersonal, [name]: false });
    };
    const districtNameConverter = (id) => {
        const finalData = id && districts.find(i => i.id === Number(id)).title_ne;

        return finalData || '-';
    };

    const municipalityNameConverter = (id) => {
        // const finalData = fetchedData && municipalities.find(i => i.id === id).title_ne;
        const finalData = id && municipalities.find(i => i.id === Number(id));
        if (finalData && finalData.type === 'Rural Municipality') {
            const municipality = `${finalData.title_ne} गाउँपालिका`;
            return municipality;
        } if (finalData && finalData.type === 'Submetropolitan City') {
            const municipality = `${finalData.title_ne} उप-महानगरपालिका`;
            return municipality;
        } if (finalData && finalData.type === 'Metropolitan City') {
            const municipality = `${finalData.title_ne} महानगरपालिका`;
            return municipality;
        } if (finalData) {
            return `${finalData.title_ne} नगरपालिका`;
        }
        return '-';
    };

    const wardNameConverter = (id) => {
        const finalData = id && wards.find(i => i.id === Number(id)).title;
        return finalData || '-';
    };
    const splittedRouteId = pathname.split('/');
    const routeId = splittedRouteId[splittedRouteId.length - 1];
    const handleFetchedData = (finalData) => {
        setFetchedData(finalData);
    };

    useEffect(() => {
        const splittedRoute = pathname.split('/');
        const id = splittedRoute[splittedRoute.length - 1];
        if (id) {
            props.requests.getEarthquakeRequest.do({ id, fetchedData: handleFetchedData });
        }
    }, [pathname]);

    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            {/* <MenuCommon layout="common" currentPage={'Epidemics'} uri={uri} /> */}
            <div className={styles.container}>

                <h1 className={styles.header}>अस्थायी आश्रय नामांकन डाटा संरचना</h1>
                <p className={styles.dataReporting}>डाटा रिपोर्टिङ</p>
                {
                    fetchedData

                        ? (
                            <div className={styles.twoSections}>
                                <div
                                    className="reportingStatus123"
                                    style={{ display: 'flex', flexDirection: 'column', padding: '10px 20px' }}
                                >
                                    <div
                                        className="reporting123"
                                        style={{ cursor: 'pointer' }}
                                        role="button"
                                        onClick={() => navigate(`/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data-preview/${routeId}`)}
                                    >
                                        <img className="listSvg123" src={ListSvg} alt="" />
                                        <p className="reportingText123">जानकारी</p>
                                        <p className="grayCircle123" />
                                    </div>
                                    <div
                                        className="reporting123"
                                        style={{ cursor: 'pointer' }}
                                        role="button"
                                        onClick={() => navigate(`/admin/temporary-shelter-enrollment-form/add-view-tranche1/${routeId}`)}
                                    >
                                        <img className="listSvg123" src={ListSvg} alt="" />
                                        <p className="reportingText123">
                                            किस्ता १
                                        </p>
                                        <p className="grayCircle123" />
                                    </div>
                                    <div className="reporting123" style={{ cursor: 'pointer' }}>
                                        <img className="listSvg123" src={ListSvg} alt="" />
                                        <p className="reportingText123">
                                            किस्ता २
                                        </p>
                                        <p className="greenCircle123" />
                                    </div>
                                </div>
                                {/* <div className={styles.reportingStatus}>
                        <div className={styles.reporting}>
                            <img className={styles.listSvg} src={ListSvg} alt="" />
                            <p className={styles.reportingText}>जानकारी</p>
                            <p className={styles.greenCircle} />
                        </div>
                    </div> */}
                                <div className={styles.mainForm}>
                                    <div className={styles.generalInfoAndTableButton}>
                                        <h1 className={styles.generalInfo}>जानकारी</h1>
                                        <button className={styles.viewDataTable} type="button" onClick={handleTableButton}>डाटा तालिका हेर्नुहोस्</button>
                                    </div>
                                    <div className={styles.shortGeneralInfo}>
                                        <img className={styles.ideaIcon} src={Ideaicon} alt="" />
                                        <p className={styles.ideaPara}>
                                            अस्थायी आश्रय नामांकन फारममा भूकम्प प्रभावित क्षेत्रको विवरण र घरको विवरण समावेश हुन्छ।

                                        </p>
                                    </div>
                                    {/* <div className={styles.infoBar}>
                            <p className={styles.instInfo}>
                                Reported Date and Location are required information
                            </p>
                        </div> */}
                                    <div className={styles.mainDataEntrySection}>
                                        <div className={styles.formGeneralInfo}>
                                            <h1>अनुुसूूची ४</h1>
                                            <h1>दफा ४(२) सँँग सम्बन्धित</h1>
                                            <h1 style={{ textDecoration: 'underline' }}>भूूकम्प प्रभावितको अस्थायी आवासको दोस्रो किस्ता पाउन गरेेको निवेेदन</h1>
                                        </div>
                                        <div className={styles.datePickerForm}>
                                            <span>मितिः</span>
                                            {/* <input
                                    type="text"
                                    name="entry_date_bs"
                                    value={data.entry_date_bs}
                                    onChange={handleFormData}
                                    className={styles.inputClassName}
                                /> */}

                                            <NepaliDatePicker
                                                inputClassName="form-control"
                                                // className={styles.datePick}
                                                // value={ADToBS(dateAlt)}
                                                value={data.entry_date_bs}
                                                onChange={
                                                    (value: string) => {
                                                        setData({
                                                            ...data,
                                                            entry_date_bs: value,

                                                        });
                                                    }
                                                }
                                                options={{
                                                    calenderLocale: 'ne',
                                                    valueLocale: 'en',
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '20px', lineHeight: '40px' }}>
                                            <span>श्रीमान प्रमुुख प्रशासकीय अधिकृृतज्यूू,</span>
                                            <span>{fetchedData && municipalityNameConverter(fetchedData.operatingMunicipality)}</span>
                                        </div>
                                        {/* <div className={styles.countData}>
                                <div className={styles.countDataIndividual}>
                                    <span>लाभग्राही क्रम संंख्याः</span>
                                    <input type="text" name="" className={styles.inputClassName} disabled />
                                </div>
                                <div className={styles.countDataIndividual}>
                                    <span>सम्झौता क्रमााङ्क संंख्याः</span>
                                    <input
                                        type="text"
                                        name="pa_number"
                                        onChange={handleFormData}
                                        value={data.pa_number}
                                        className={styles.inputClassName}
                                        disabled
                                    />
                                </div>
                            </div> */}
                                        <div style={{ display: 'flex', justifyContent: 'center', fontSize: '20px', lineHeight: '40px' }}>
                                            <span>
                                                विषयः भूूकम्प प्रभावितको अस्थायी आवासको दोस्रो किस्ता पाऊँँ ।
                                            </span>
                                        </div>
                                        <div className={styles.formDetails}>
                                            <p>
                                                {`भूूकम्प प्रभावितको अस्थायी आवास निर्माणका लाागि ${districtNameConverter(fetchedData.beneficiaryDistrict)} जिल्ला
                                    ${municipalityNameConverter(fetchedData.beneficiaryMunicipality)}  वडा नंं. ${englishToNepaliNumber(wardNameConverter(fetchedData.beneficiaryWard))}
                                    गाउँँ/टोल ${fetchedData.toleName} बस्नेे श्री ${fetchedData.grandParentName} को ${fetchedData.grandChildRelation} श्री ${fetchedData.parentName}
                                                  को ${fetchedData.childRelation} बर्ष ${englishToNepaliNumber(fetchedData.beneficiaryAge)}  को म र यस पालिका बीच
                                    `}
                                                मिति
                                                <div style={{ width: 'fit-content' }}>
                                                    <NepaliDatePicker
                                                        inputClassName="form-control"
                                                        // className={styles.datePick}
                                                        // value={ADToBS(dateAlt)}
                                                        value={data.entry_date_bs}
                                                        onChange={
                                                            (value: string) => {
                                                                setData({
                                                                    ...data,
                                                                    entry_date_bs: value,

                                                                });
                                                            }
                                                        }
                                                        options={{
                                                            calenderLocale: 'ne',
                                                            valueLocale: 'en',
                                                        }}
                                                    />

                                                </div>

                                                {' '}
                                                मा भएको अस्थायी आवास निर्मााण सम्झौता बमोजिम प्रथम किस्ता रकमबाट आवास निर्मााण
                                                भइरहेेको/सम्पन्न भएकोलेे सो को फोटो यसैै साथ संंलग्न गरी दोस्रो किस्ता भुक्तानी पाउनको लागि निवेेदन पेेश गरेेको छुु ।

                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', fontSize: '20px', lineHeight: '40px' }}>
                                                    <span>निवेेदक</span>
                                                    <span>....................................................................................................................</span>
                                                    <span>(नााम र सहीछाप)</span>
                                                </div>
                                                <div style={{ fontSize: '20px', lineHeight: '40px' }}>
                                                    <span>
                                                        नोटः अस्थायी आवासको दुुई तर्फका मोहोडाको फोटो यसैै
                                                        निवेेदनका साथ संंलग्न गर्नेे ।
                                                    </span>
                                                </div>
                                            </div>
                                            <div>

                                                <table>
                                                    <tr style={{ background: 'none' }}>
                                                        <th
                                                            style={{
                                                                border: '1px solid black',
                                                                borderCollapse: 'collapse',
                                                                textAlign: 'center',
                                                            }}
                                                        >दायाँँ
                                                        </th>
                                                        <th
                                                            style={{
                                                                border: '1px solid black',
                                                                borderCollapse: 'collapse',
                                                                textAlign: 'center',
                                                            }}
                                                        >बायाँँ
                                                        </th>

                                                    </tr>
                                                    <tr style={{ background: 'none' }}>
                                                        <td
                                                            style={{
                                                                border: '1px solid black',
                                                                borderCollapse: 'collapse',
                                                                textAlign: 'center',
                                                                width: '200px',
                                                                height: '200px',
                                                            }}
                                                        />
                                                        <td
                                                            style={{
                                                                border: '1px solid black',
                                                                borderCollapse: 'collapse',
                                                                textAlign: 'center',
                                                                width: '200px',
                                                                height: '200px',
                                                            }}
                                                        />

                                                    </tr>

                                                </table>
                                            </div>
                                        </div>
                                        <div className={styles.mainTempAddress} style={{ fontSize: '20px', lineHeight: '40px' }}>
                                            <h2 style={{ textDecoration: 'underline', textAlign: 'center' }}>दोस्रो किस्ता भुक्तानी सिफारिस</h2>
                                            <p>
                                                <span> {`भूूकम्प प्रभावितको अस्थायी आवास निर्मााणका लाागि लाभग्राही श्री ${fetchedData.beneficiaryNameNepali}लेे दोसरो किस्ता भुक्तानीको
                                                लाागि निवेेदन पेेश गरेेकोलेे अस्थायी आवासको प्राविधिकको स्थलगत निरीक्षणबाट भूूकम्प प्रभावित घरपरिवारलाई अस्थायी
                                                आवास निर्मााण अनुुदान कार्यविधि, २०८० तथा मिति`}
                                                </span>
                                                <div style={{ width: 'fit-content' }}>
                                                    <NepaliDatePicker
                                                        inputClassName="form-control"
                                                        // className={styles.datePick}
                                                        // value={ADToBS(dateAlt)}
                                                        value={data.entry_date_bs}
                                                        onChange={
                                                            (value: string) => {
                                                                setData({
                                                                    ...data,
                                                                    entry_date_bs: value,

                                                                });
                                                            }
                                                        }
                                                        options={{
                                                            calenderLocale: 'ne',
                                                            valueLocale: 'en',
                                                        }}
                                                    />

                                                </div>
                                                मा भएको सम्झौता बमोजिम नैै अस्थायी आवास
                                                निमाण भइरहेेको/समपन्न भएको देेखिएको हुँँदा निजलाई दोस्रो किस्ता भुक्तानी दिन उपयुुक्त छ भनी सिफाारिस गर्दछौंं।
                                            </p>

                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '20px', lineHeight: '40px' }}>
                                                <h2 style={{ textDecoration: 'underline', textAlign: 'center' }}>प्राविधिक/इन्जिनियर</h2>
                                                <div className={styles.freeText}>
                                                    <span>नाम:</span>
                                                    <input
                                                        type="text"
                                                        onChange={handleFormData}
                                                        name="beneficiary_name_nepali"
                                                        value={data.beneficiary_name_nepali}
                                                        style={errorFields.beneficiary_name_nepali ? { borderBottom: '2px dotted red' } : {}}
                                                        className={styles.inputClassName}
                                                    />
                                                </div>
                                                <div className={styles.freeText}>
                                                    <span>हस्ताक्षरः</span>
                                                    <input
                                                        type="text"
                                                        onChange={handleFormData}
                                                        name="beneficiary_name_nepali"
                                                        value={data.beneficiary_name_nepali}
                                                        style={errorFields.beneficiary_name_nepali ? { borderBottom: '2px dotted red' } : {}}
                                                        className={styles.inputClassName}
                                                    />
                                                </div>
                                                <div className={styles.freeText}>
                                                    <span>पदः</span>
                                                    <input
                                                        type="text"
                                                        onChange={handleFormData}
                                                        name="beneficiary_name_nepali"
                                                        value={data.beneficiary_name_nepali}
                                                        style={errorFields.beneficiary_name_nepali ? { borderBottom: '2px dotted red' } : {}}
                                                        className={styles.inputClassName}
                                                    />
                                                </div>
                                                <div style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <span>मितिः</span>
                                                    <NepaliDatePicker
                                                        inputClassName="form-control"
                                                        // className={styles.datePick}
                                                        // value={ADToBS(dateAlt)}
                                                        value={data.entry_date_bs}
                                                        onChange={
                                                            (value: string) => {
                                                                setData({
                                                                    ...data,
                                                                    entry_date_bs: value,

                                                                });
                                                            }
                                                        }
                                                        options={{
                                                            calenderLocale: 'ne',
                                                            valueLocale: 'en',
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '20px', lineHeight: '40px' }}>
                                                <h2 style={{ textDecoration: 'underline', textAlign: 'center' }}>वडा अध्यक्ष</h2>
                                                <div className={styles.freeText}>
                                                    <span>नाम:</span>
                                                    <input
                                                        type="text"
                                                        onChange={handleFormData}
                                                        name="beneficiary_name_nepali"
                                                        value={data.beneficiary_name_nepali}
                                                        style={errorFields.beneficiary_name_nepali ? { borderBottom: '2px dotted red' } : {}}
                                                        className={styles.inputClassName}
                                                    />
                                                </div>
                                                <div className={styles.freeText}>
                                                    <span>हस्ताक्षरः</span>
                                                    <input
                                                        type="text"
                                                        onChange={handleFormData}
                                                        name="beneficiary_name_nepali"
                                                        value={data.beneficiary_name_nepali}
                                                        style={errorFields.beneficiary_name_nepali ? { borderBottom: '2px dotted red' } : {}}
                                                        className={styles.inputClassName}
                                                    />
                                                </div>

                                                <div style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <span>मितिः</span>
                                                    <NepaliDatePicker
                                                        inputClassName="form-control"
                                                        // className={styles.datePick}
                                                        // value={ADToBS(dateAlt)}
                                                        value={data.entry_date_bs}
                                                        onChange={
                                                            (value: string) => {
                                                                setData({
                                                                    ...data,
                                                                    entry_date_bs: value,

                                                                });
                                                            }
                                                        }
                                                        options={{
                                                            calenderLocale: 'ne',
                                                            valueLocale: 'en',
                                                        }}
                                                    />

                                                </div>
                                            </div>


                                        </div>
                                        {
                                            Object.values(errorFields).filter(i => i === true).length
                                                ? <span className={styles.ValidationErrors}>रातो रङले संकेत गरेको माथिको फारममा केही फिल्ड भर्न बाँकी छ, कृपया फारम पूरा गर्नुहोस् र पुन: प्रयास गर्नुहोस्</span>
                                                : ''
                                        }
                                        {
                                            backendError
                                                ? <span className={styles.ValidationErrors}>तपाईंको इन्टरनेट वा सर्भरमा समस्या छ कृपया पुन: प्रयास गर्नुहोस्</span>
                                                : ''
                                        }
                                        {/* <span className={styles.ValidationErrors}>{validationError}</span> */}
                                        <div className={styles.saveOrAddButtons}>
                                            <button className={styles.submitButtons} onClick={handleClick} type="submit" disabled={!!loading}>{loading ? 'पेश गरिँदै छ...' : 'पेश गर्नुहोस्'}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                        : <p>Loading...</p>}
            </div>
            <Footer />

        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Tranche2,
        ),
    ),
);
