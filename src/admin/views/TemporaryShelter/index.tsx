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
import { navigate } from '@reach/router';
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

};

const TemporaryShelter = (props) => {
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
            responsible_municipality: null,
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
        responsible_municipality: false,
        temporary_shelter_land_district: false,
        temporary_shelter_land_municipality: false,
        temporary_shelter_land_ward: false,
        beneficiary_representative_district: false,
        beneficiary_representative_municipality: false,
        beneficiary_representative_ward: false,
        operating_municipality: false,
    });
    const [loading, setLoading] = useState(false);
    const [backendError, setBackendError] = useState(false);

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
    const selectedWard = wards.filter(i => i.municipality === Number(data.beneficiary_municipality));
    const tempSelectedMunicipality = municipalities.filter(i => i.district === Number(data.temporary_shelter_land_district));
    const tempSelectedWard = wards.filter(i => i.municipality === Number(data.temporary_shelter_land_municipality));
    const beneficiarySelectedMunicipality = municipalities.filter(i => i.district === Number(data.beneficiary_representative_district));
    const beneficiarySelectedWard = wards.filter(i => i.municipality === Number(data.beneficiary_representative_municipality));


    const handleSuccessMessage = (d) => {
        navigate(`/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data-preview/${d.id}`);
    };
    const handleClick = () => {
        setBackendError(false);
        const errorCheckingFields = Object.keys(data);
        const latestErrorUpdate = errorFields;
        errorCheckingFields.map((i) => {
            if (!data[i]) {
                if (data.is_beneficiary_available_to_sign === false) {
                    latestErrorUpdate.beneficiary_representative_name_nepali = false;
                    latestErrorUpdate.beneficiary_representative_citizenship_number = false;
                    latestErrorUpdate.beneficiary_representative_grandfather_name = false;
                    latestErrorUpdate.beneficiary_representative_parent_name = false;
                    latestErrorUpdate.beneficiary_representative_district = false;
                    latestErrorUpdate.beneficiary_representative_municipality = false;
                    latestErrorUpdate.beneficiary_representative_ward = false;
                }
                if (i === 'migration_certificate_number') {
                    return latestErrorUpdate[i] = false;
                }
                if (i === 'operating_municipality') {
                    return latestErrorUpdate[i] = false;
                }
                if (i === 'responsible_municipality') {
                    return latestErrorUpdate[i] = false;
                }
                if (i === 'pa_number') {
                    return latestErrorUpdate[i] = false;
                }
                if (i === 'is_beneficiary_available_to_sign') {
                    return latestErrorUpdate[i] = false;
                }
                if (i === 'application_document') {
                    return latestErrorUpdate[i] = false;
                }
                return latestErrorUpdate[i] = true;
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
        finalUpdateData.operating_municipality = user.profile.municipality;
        finalUpdateData.responsible_municipality = user.profile.municipality;

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
    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            <MenuCommon layout="common" currentPage={'Epidemics'} uri={uri} />
            <div className={styles.container}>

                <h1 className={styles.header}>अस्थायी आश्रय नामांकन डाटा संरचना</h1>
                <p className={styles.dataReporting}>डाटा रिपोर्टिङ</p>
                <div className={styles.twoSections}>
                    <div className={styles.reportingStatus}>
                        <div className={styles.reporting}>
                            <img className={styles.listSvg} src={ListSvg} alt="" />
                            <p className={styles.reportingText}>जानकारी</p>
                            <p className={styles.greenCircle} />
                        </div>
                    </div>
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
                                <h1>अनुुसूूची ३</h1>
                                <h1>दफा ३(५) सँँग सम्बन्धित</h1>
                                <h1 style={{ textDecoration: 'underline' }}>भूूकम्प प्रभावितको अस्थायी आवास निर्माणका लागि अनुुदान सम्झौता-पत्र</h1>
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
                            <div className={styles.formDetails}>
                                <p>
                                    भूूकम्प प्रभावितको अस्थायी आवास निर्माणका लाागि
                                    {' '}
                                    <select
                                        name="beneficiary_district"
                                        value={data.beneficiary_district || ''}
                                        id="districts-benificery"
                                        onChange={handleFormData}
                                        style={errorFields.beneficiary_district ? { border: '1px solid red' } : {}}
                                    >
                                        <option>जिल्ला</option>
                                        {
                                            districts.map(item => (
                                                <option value={item.id}>{item.title_ne}</option>
                                            ))
                                        }


                                    </select>
                                    {/* <Select
                                        isClearable
                                        value={data.beneficiary_district === '' ? '' : handleProvincialFormDataNepaliValue(data.beneficiary_district, districts)}
                                        name="beneficiary_district"
                                        placeholder={'जिल्ला छान्नुहोस्'}
                                        onChange={(value, actionMeta) => handleDropdown(actionMeta.name, value)}
                                        options={DistrictListSelect}
                                        className="dropdownZindex"
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    /> */}
                                    {' '}
                                    जिल्ला
                                    {' '}
                                    <select
                                        id="beneficiary_municipality"
                                        name="beneficiary_municipality"
                                        value={data.beneficiary_municipality || ''}
                                        onChange={handleFormData}
                                        style={errorFields.beneficiary_municipality ? { border: '1px solid red' } : {}}
                                    >
                                        <option> गा.पा/न.पा.</option>
                                        {
                                            selectedMunicipality.map(item => (
                                                <option value={item.id}>{item.title_ne}</option>
                                            ))
                                        }
                                    </select>
                                    {/* <Select
                                        isClearable
                                        value={data.beneficiary_municipality === '' ? '' : handleProvincialFormDataNepaliValue(data.beneficiary_municipality, municipalities)}
                                        name="beneficiary_municipality"
                                        placeholder={'पालिका छान्नुहोस्'}
                                        onChange={(value, actionMeta) => handleDropdown(actionMeta.name, value)}
                                        options={MunicipalityListSelectedMunicipality}
                                        className="dropdownZindex"
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    /> */}
                                    {' '}
                                    गा.पा/न.पा.
                                    {' '}
                                    {' '}
                                    वडा नंं.
                                    <select
                                        id="beneficiary_ward"
                                        name="beneficiary_ward"
                                        value={data.beneficiary_ward || ''}
                                        onChange={handleFormData}
                                        style={errorFields.beneficiary_ward ? { border: '1px solid red' } : {}}
                                    >
                                        <option>वडा नंं.</option>
                                        {
                                            selectedWard.map(item => (
                                                <option value={item.id}>{englishToNepaliNumber(item.title)}</option>
                                            ))
                                        }
                                    </select>
                                    {/* <Select
                                        isClearable
                                        value={data.beneficiary_ward === '' ? '' : handleProvincialFormDataNepaliValue(data.beneficiary_ward, wards)}
                                        name="beneficiary_ward"
                                        placeholder={'वडा छान्नुहोस्'}
                                        onChange={(value, actionMeta) => handleDropdown(actionMeta.name, value)}
                                        options={WardListSelectedWard}
                                        className="dropdownZindex"
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    /> */}
                                    {' '}
                                    गाउँँ/टोल
                                    <input
                                        type="text"
                                        className={styles.inputClassName}
                                        name="tole_name"
                                        value={data.tole_name}
                                        onChange={handleFormData}
                                        style={errorFields.tole_name ? { borderBottom: '2px dotted red' } : {}}
                                    />
                                    {' '}
                                    बस्नेे श्री
                                    {' '}
                                    <input
                                        type="text"
                                        name="grand_parent_name"
                                        value={data.grand_parent_name}
                                        className={styles.inputClassName}
                                        onChange={handleFormData}
                                        style={errorFields.grand_parent_name ? { borderBottom: '2px dotted red' } : {}}
                                    />
                                    {' '}
                                    को
                                    {' '}
                                    <select
                                        id="grand_child_relation"
                                        name="grand_child_relation"
                                        value={data.grand_child_relation}
                                        onChange={handleFormData}
                                        style={errorFields.grand_child_relation ? { border: '1px solid red' } : {}}
                                    >
                                        <option>सम्बन्ध</option>
                                        <option value="नाती">नाती</option>
                                        <option value="नातीनी">नातीनी</option>
                                        <option value="बुुहारी">बुुहारी</option>
                                    </select>
                                    {' '}
                                    श्री
                                    {' '}
                                    <input
                                        type="text"
                                        className={styles.inputClassName}
                                        onChange={handleFormData}
                                        name="parent_name"
                                        value={data.parent_name}
                                        style={errorFields.parent_name ? { borderBottom: '2px dotted red' } : {}}
                                    />
                                    {' '}
                                    को
                                    {' '}
                                    <select
                                        id="child_relation"
                                        name="child_relation"
                                        value={data.child_relation}
                                        onChange={handleFormData}
                                        style={errorFields.child_relation ? { border: '1px solid red' } : {}}


                                    >
                                        <option>सम्बन्ध</option>
                                        <option value="छोरा">छोरा</option>
                                        <option value="छोरी">छोरी</option>
                                        <option value="श्रीमती">श्रीमती</option>

                                    </select>
                                    {' '}
                                    बर्ष
                                    {' '}
                                    <input
                                        type="number"
                                        name="beneficiary_age"
                                        onChange={handleFormData}
                                        value={data.beneficiary_age}
                                        className={styles.inputClassName}
                                        style={errorFields.beneficiary_age ? { borderBottom: '2px dotted red' } : {}}
                                    />
                                    {' '}
                                    को लाभग्राही श्री
                                    {' '}
                                    <input
                                        type="text"
                                        name="beneficiary_name_nepali"
                                        value={data.beneficiary_name_nepali}
                                        onChange={handleFormData}
                                        className={styles.inputClassName}
                                        style={errorFields.beneficiary_name_nepali ? { borderBottom: '2px dotted red' } : {}}
                                    />
                                    {' '}
                                    (यसपछि प्रथम पक्ष भनिनेे) र
                                    {' '}
                                    <input type="text" className={styles.inputClassName} value={municipalityNameConverter(user.profile.municipality)} disabled />
                                    {' '}
                                    कार्यालय (यसपछि दोश्रो पक्ष भनिनेे) बीच देेहाय बमोजिमका शर्तहरुको अधिनमा रही भूूकम्पबाट प्रभावित
                                    घरपरिवारलाई अस्थायी आवास निर्मााण अनुुदान कार्ययविधि,२०८०, बमोजिम अस्थायी आवास निर्माण गर्न यो अनुुदान
                                    सम्झौता-पत्रमा सहीछाप गरेेका छौंं ।
                                </p>
                            </div>
                            <div className={styles.mainTempAddress}>
                                <h2 style={{ textDecoration: 'underline' }}>अस्थायी आवास निर्माण हुुनेे जग्गाको विवरण</h2>
                                <div className={styles.tempAddress}>
                                    <div className={styles.tempAddressIndividualDiv}>
                                        जिल्ला
                                        {' '}
                                        <select
                                            id="temporary_shelter_land_district"
                                            name="temporary_shelter_land_district"
                                            value={data.temporary_shelter_land_district || ''}
                                            onChange={handleFormData}
                                            style={errorFields.temporary_shelter_land_district ? { border: '1px solid red' } : {}}
                                        >
                                            <option> जिल्ला</option>
                                            {
                                                districts.map(item => (
                                                    <option value={item.id}>{item.title_ne}</option>
                                                ))
                                            }
                                        </select>
                                        {/* <Select
                                            isClearable
                                            value={data.temporary_shelter_land_district === '' ? '' : handleProvincialFormDataNepaliValue(data.temporary_shelter_land_district, districts)}
                                            name="temporary_shelter_land_district"
                                            placeholder={'जिल्ला छान्नुहोस्'}
                                            onChange={(value, actionMeta) => handleDropdown(actionMeta.name, value)}
                                            options={DistrictListSelect}
                                            className="dropdownZindex"
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        /> */}
                                    </div>
                                    <div className={styles.tempAddressIndividualDiv}>
                                        गा.पा/न.पा.
                                        {' '}
                                        <select
                                            id="temporary_shelter_land_municipality"
                                            name="temporary_shelter_land_municipality"
                                            value={data.temporary_shelter_land_municipality || ''}
                                            onChange={handleFormData}
                                            style={errorFields.temporary_shelter_land_municipality ? { border: '1px solid red' } : {}}
                                        >
                                            <option> गा.पा/न.पा. वडा नंं.</option>
                                            {
                                                tempSelectedMunicipality.map(item => (
                                                    <option value={item.id}>{item.title_ne}</option>
                                                ))
                                            }
                                        </select>
                                        {/* <Select
                                            isClearable
                                            value={data.temporary_shelter_land_municipality === '' ? '' : handleProvincialFormDataNepaliValue(data.temporary_shelter_land_municipality, municipalities)}
                                            name="temporary_shelter_land_municipality"
                                            placeholder={'गा.पा/न.पा. छान्नुहोस्'}
                                            onChange={(value, actionMeta) => handleDropdown(actionMeta.name, value)}
                                            options={MunicipalityListTempSelectedMunicipality}
                                            className="dropdownZindex"
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        /> */}
                                    </div>
                                    <div className={styles.tempAddressIndividualDiv}>
                                        वडा नंं.
                                        {' '}
                                        <select
                                            id="temporary_shelter_land_ward"
                                            name="temporary_shelter_land_ward"
                                            value={data.temporary_shelter_land_ward || ''}
                                            onChange={handleFormData}
                                            style={errorFields.temporary_shelter_land_ward ? { border: '1px solid red' } : {}}
                                        >
                                            <option>वडा नंं.</option>
                                            {
                                                tempSelectedWard.map(item => (
                                                    <option value={item.id}>{englishToNepaliNumber(item.title)}</option>
                                                ))
                                            }
                                        </select>
                                        {/* <Select
                                            isClearable
                                            value={data.temporary_shelter_land_ward === '' ? '' : handleProvincialFormDataNepaliValue(data.temporary_shelter_land_ward, wards)}
                                            name="temporary_shelter_land_ward"
                                            placeholder={'वडा नंं. छान्नुहोस्'}
                                            onChange={(value, actionMeta) => handleDropdown(actionMeta.name, value)}
                                            options={WardListTempSelectedWard}
                                            className="dropdownZindex"
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        /> */}
                                    </div>
                                    <div className={styles.tempAddressIndividualDiv}>
                                        टोल
                                        {' '}
                                        <input
                                            type="text"
                                            name="temporary_shelter_land_tole"
                                            value={data.temporary_shelter_land_tole}
                                            onChange={handleFormData}
                                            className={styles.inputClassName}
                                            style={errorFields.temporary_shelter_land_tole ? { borderBottom: '2px dotted red' } : {}}
                                        />
                                    </div>
                                    {/* <div className={styles.tempAddressIndividualDiv}>
                                        क्षेेत्रफल
                                        {' '}
                                        <input
                                            type="text"
                                            name="temporary_shelter_land_area"
                                            value={data.temporary_shelter_land_area}
                                            onChange={handleFormData}
                                            className={styles.inputClassName}
                                        />
                                    </div> */}
                                    {/* <div className={styles.tempAddressIndividualDiv}>
                                        नक्सा सिट नंं.
                                        {' '}
                                        <input
                                            type="text"
                                            name="temporary_shelter_land_map_sheet_number"
                                            value={data.temporary_shelter_land_map_sheet_number}
                                            onChange={handleFormData}
                                            className={styles.inputClassName}
                                        />
                                    </div> */}
                                </div>
                            </div>
                            <div className={styles.firstPartDetails}>
                                <h2 style={{ textDecoration: 'underline' }}>क. प्रथम पक्ष (लाभग्राही)</h2>
                                <div className={styles.firstPartContainer}>
                                    <span>१. व्यक्तिगत विवरण</span>
                                    <div className={styles.formElements}>
                                        <div className={styles.freeText}>
                                            <span>नाम, थर नेेपालीमाः</span>
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
                                            <span>नाम, थर अंंग्रेजीमाः</span>
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="beneficiary_name_english"
                                                value={data.beneficiary_name_english}
                                                style={errorFields.beneficiary_name_english ? { borderBottom: '2px dotted red' } : {}}
                                            />
                                        </div>
                                        <div className={styles.locationDetails}>
                                            <div>
                                                <span>{`जिल्ला ${districtNameConverter(data.beneficiary_district)}`}</span>

                                            </div>
                                            <div>
                                                <span>{`${data.beneficiary_municipality ? municipalityNameConverter(data.beneficiary_municipality) : ''}`}</span>

                                            </div>
                                            <div>
                                                <span>{`वडा नंं. ${englishToNepaliNumber(wardNameConverter(data.beneficiary_ward))}`}</span>

                                            </div>
                                            <div>
                                                <span>ना.प्र.न.</span>
                                                {' '}
                                                <input
                                                    type="text"
                                                    name="beneficiary_citizenship_number"
                                                    value={data.beneficiary_citizenship_number}
                                                    onChange={handleFormData}
                                                    className={styles.inputClassName}
                                                    style={errorFields.beneficiary_citizenship_number ? { borderBottom: '2px dotted red' } : {}}
                                                />
                                            </div>
                                            <div>
                                                <span>सम्पर्क नंं.</span>
                                                {' '}
                                                <input
                                                    type="text"
                                                    name="beneficiary_contact_number"
                                                    value={data.beneficiary_contact_number}
                                                    onChange={handleFormData}
                                                    style={errorFields.beneficiary_contact_number ? { borderBottom: '2px dotted red' } : {}}
                                                    className={styles.inputClassName}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', gap: '5px', alignItems: errorFields.beneficiary_photo ? 'flex-start' : 'center' }}>
                                                <span>फोटो:</span>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        id="file-input"
                                                        // style={{ display: 'none' }}
                                                        onChange={handleFileInputChange}
                                                        name="beneficiary_photo"
                                                    />
                                                    {errorFields.beneficiary_photo
                                                        ? <p style={{ margin: '0', color: 'red' }}>कृपया फोटो अपलोड गर्नुहोस्</p> : ''
                                                    }
                                                    {
                                                        data.beneficiary_photo ? <img height={100} width={100} src={handleShowImage(data.beneficiary_photo)} alt="img" /> : ''
                                                    }
                                                </div>


                                            </div>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <span>
                                                    लाभार्थी हस्ताक्षर गर्न उपलब्ध छैन?
                                                </span>
                                                {' '}
                                                <input
                                                    style={{ cursor: 'pointer' }}
                                                    type="checkbox"
                                                    checked={data.is_beneficiary_available_to_sign}
                                                    onChange={handleCheckboxChange}

                                                />
                                            </div>

                                        </div>
                                        {
                                            data.is_beneficiary_available_to_sign
                                                ? (
                                                    <div>
                                                        <p>
                                                            सम्झौता-पत्रमा हस्ताक्षर गर्न अधिकार/मञ्जुुरी प्राप्त व्यक्तिको
                                                            विवरण (लाभग्राही उपस्थित हुुन नसकेेको अवस्थामा मात्र)
                                                            संंरक्षक/अधिकार प्राप्त/मञ्जुुरी प्राप्त व्यक्तिको विवरण

                                                        </p>
                                                        <div className={styles.freeText} style={{ marginBottom: '10px' }}>
                                                            <span>नाम, थर नेेपालीमाः</span>
                                                            <input
                                                                type="text"
                                                                onChange={handleFormData}
                                                                name="beneficiary_representative_name_nepali"
                                                                value={data.beneficiary_representative_name_nepali}
                                                                style={errorFields.beneficiary_representative_name_nepali ? { borderBottom: '2px dotted red' } : {}}
                                                                className={styles.inputClassName}
                                                            />
                                                        </div>
                                                        <div className={styles.locationDetails}>

                                                            <div>
                                                                <span>जिल्लाः</span>
                                                                {' '}
                                                                <select
                                                                    name="beneficiary_representative_district"
                                                                    value={data.beneficiary_representative_district || ''}
                                                                    onChange={handleFormData}
                                                                    id="beneficiary_representative_district1"
                                                                    style={errorFields.beneficiary_representative_district ? { border: '1px solid red' } : {}}
                                                                >
                                                                    <option>जिल्लाः</option>
                                                                    {
                                                                        districts.map(item => (
                                                                            <option value={item.id}>{item.title_ne}</option>
                                                                        ))
                                                                    }
                                                                </select>

                                                                {/* <Select
                                                                    isClearable
                                                                    value={data.beneficiary_representative_district === '' ? '' : handleProvincialFormDataNepaliValue(data.beneficiary_representative_district, wards)}
                                                                    name="beneficiary_representative_district"
                                                                    placeholder={'जिल्ला छान्नुहोस्'}
                                                                    onChange={(value, actionMeta) => handleDropdown(actionMeta.name, value)}
                                                                    options={DistrictListSelect}
                                                                    className="dropdownZindex"
                                                                    menuPortalTarget={document.body}
                                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                /> */}
                                                            </div>
                                                            <div>
                                                                <span>गा.पा./न.पाः</span>
                                                                {' '}
                                                                <select
                                                                    name="beneficiary_representative_municipality"
                                                                    value={data.beneficiary_representative_municipality || ''}
                                                                    onChange={handleFormData}
                                                                    id="beneficiary_representative_municipality1"
                                                                    style={errorFields.beneficiary_representative_municipality ? { border: '1px solid red' } : {}}

                                                                >
                                                                    <option> गा.पा./न.पाः</option>
                                                                    {
                                                                        beneficiarySelectedMunicipality.map(item => (
                                                                            <option value={item.id}>{item.title_ne}</option>
                                                                        ))
                                                                    }
                                                                </select>

                                                                {/* <Select
                                                                    isClearable
                                                                    value={data.beneficiary_representative_municipality === '' ? '' : handleProvincialFormDataNepaliValue(data.beneficiary_representative_municipality, wards)}
                                                                    name="beneficiary_representative_municipality"
                                                                    placeholder={'जिल्ला छान्नुहोस्'}
                                                                    onChange={(value, actionMeta) => handleDropdown(actionMeta.name, value)}
                                                                    options={MunicipalityListTempBeneficiarySelectedMunicipality}
                                                                    className="dropdownZindex"
                                                                    menuPortalTarget={document.body}
                                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                /> */}
                                                            </div>
                                                            <div>
                                                                <span>वडा नंं.</span>
                                                                {' '}
                                                                <select
                                                                    name="beneficiary_representative_ward"
                                                                    value={data.beneficiary_representative_ward || ''}
                                                                    onChange={handleFormData}
                                                                    id="beneficiary_representative_ward1"
                                                                    style={errorFields.beneficiary_representative_ward ? { border: '1px solid red' } : {}}
                                                                >
                                                                    <option> वडा नंं.</option>
                                                                    {
                                                                        beneficiarySelectedWard.map(item => (
                                                                            <option value={item.id}>{englishToNepaliNumber(item.title)}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                                {/* <Select
                                                                    isClearable
                                                                    value={data.beneficiary_representative_ward === '' ? '' : handleProvincialFormDataNepaliValue(data.beneficiary_representative_ward, wards)}
                                                                    name="beneficiary_representative_ward"
                                                                    placeholder={'वडा छान्नुहोस्'}
                                                                    onChange={(value, actionMeta) => handleDropdown(actionMeta.name, value)}
                                                                    options={WardListBeneficiarySelectedWard}
                                                                    className="dropdownZindex"
                                                                    menuPortalTarget={document.body}
                                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                /> */}
                                                            </div>
                                                            <div>
                                                                <span>ना.प्र.न.</span>
                                                                {' '}
                                                                <input
                                                                    type="text"
                                                                    name="beneficiary_representative_citizenship_number"
                                                                    value={data.beneficiary_representative_citizenship_number}
                                                                    onChange={handleFormData}
                                                                    className={styles.inputClassName}
                                                                    style={errorFields.beneficiary_representative_citizenship_number ? { borderBottom: '2px dotted red' } : {}}
                                                                />
                                                            </div>

                                                        </div>
                                                        <div className={styles.freeText}>
                                                            <span>बाजेेको नाम, थर:</span>
                                                            {' '}
                                                            <input
                                                                type="text"
                                                                className={styles.inputClassName}
                                                                name="beneficiary_representative_grandfather_name"
                                                                value={data.beneficiary_representative_grandfather_name}
                                                                onChange={handleFormData}
                                                                style={errorFields.beneficiary_representative_grandfather_name ? { borderBottom: '2px dotted red' } : {}}
                                                            />
                                                        </div>
                                                        <div className={styles.freeText}>
                                                            <span>बाबुु/आमाको नाम, थर:</span>
                                                            {' '}
                                                            <input
                                                                type="text"
                                                                className={styles.inputClassName}
                                                                name="beneficiary_representative_parent_name"
                                                                value={data.beneficiary_representative_parent_name}
                                                                onChange={handleFormData}
                                                                style={errorFields.beneficiary_representative_parent_name ? { borderBottom: '2px dotted red' } : {}}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : ''
                                        }


                                    </div>
                                </div>
                                <div className={styles.firstPartContainer}>
                                    <span>२. बैंंक/वित्तीय संंस्थामा रहेेको खाताको विवरण</span>
                                    <div className={styles.formElements}>
                                        <div className={styles.freeText}>
                                            <span>खातावालाको नाम, थरः</span>
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                name="bank_account_holder_name"
                                                value={data.bank_account_holder_name}
                                                onChange={handleFormData}
                                                style={errorFields.bank_account_holder_name ? { borderBottom: '2px dotted red' } : {}}
                                            />
                                        </div>
                                        <div className={styles.freeText}>
                                            <span>खाता नम्बरः</span>
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="bank_account_number"
                                                value={data.bank_account_number}
                                                style={errorFields.bank_account_number ? { borderBottom: '2px dotted red' } : {}}
                                            />
                                        </div>
                                        <div className={styles.freeText}>
                                            <span>बैंंक/वित्तीय संंस्थाको नामः</span>
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="bank_name"
                                                value={data.bank_name}
                                                style={errorFields.bank_name ? { borderBottom: '2px dotted red' } : {}}
                                            />
                                        </div>
                                        <div className={styles.freeText}>
                                            <span>शाखाः</span>
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="bank_branch_name"
                                                value={data.bank_branch_name}
                                                style={errorFields.bank_branch_name ? { borderBottom: '2px dotted red' } : {}}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.firstPartContainer}>
                                    <span>३. स्थायी ठेेगाना र नागरिकतामा उल्लिखित ठेेगाना फरक भएमा (बसााइँँसराइको विवरण उल्लेेख गर्नेे)</span>
                                    <div className={styles.formElements}>
                                        <div className={styles.freeText}>
                                            <span>बसाइँँसराइ प्रमाण-पत्र नंः</span>
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="migration_certificate_number"
                                                value={data.migration_certificate_number}
                                            />
                                        </div>
                                        <div className={styles.freeText}>
                                            <span>बसाइँँसराइको मितिः</span>
                                            {/* <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="migration_date_bs"
                                                value={data.migration_date_bs}
                                            /> */}
                                            <NepaliDatePicker
                                                inputClassName="form-control"
                                                // className={styles.datePick}
                                                // value={ADToBS(dateAlt)}
                                                value={data.migration_date_bs}
                                                onChange={
                                                    (value: string) => {
                                                        setData({
                                                            ...data,
                                                            migration_date_bs: value,

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
                                <div className={styles.firstPartContainer}>
                                    <span>४. लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको औंठा छाप लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको हस्ताक्षर</span>
                                    <div className={styles.formElements}>
                                        <div className={styles.freeText}>
                                            <span>लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको हस्ताक्षर</span>
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                disabled
                                            />
                                        </div>
                                        <div className={styles.freeText}>
                                            <span>मितिः</span>
                                            {/* <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="signed_date"
                                                value={data.signed_date}
                                            /> */}

                                            <NepaliDatePicker
                                                inputClassName="form-control"
                                                // className={styles.datePick}
                                                // value={ADToBS(dateAlt)}
                                                value={data.signed_date}
                                                onChange={
                                                    (value: string) => {
                                                        setData({
                                                            ...data,
                                                            signed_date: value,

                                                        });
                                                    }
                                                }
                                                options={{
                                                    calenderLocale: 'ne',
                                                    valueLocale: 'en',
                                                }}
                                            />
                                        </div>
                                        <div className={styles.freeText}>
                                            <span>साक्षीको नाम, थर</span>
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="withness_name_nepali"
                                                value={data.withness_name_nepali}
                                                style={errorFields.withness_name_nepali ? { borderBottom: '2px dotted red' } : {}}
                                            />
                                        </div>
                                        <div className={styles.freeText}>
                                            <span>हस्ताक्षर</span>
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                disabled
                                            />
                                        </div>
                                        <div className={styles.freeText}>
                                            <span>लाभग्राहीसँँगको नाता</span>
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="withness_relation"
                                                value={data.withness_relation}
                                                style={errorFields.withness_relation ? { borderBottom: '2px dotted red' } : {}}
                                            />
                                        </div>
                                        <div className={styles.freeText}>
                                            <span>सम्पर्क नंं.</span>
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="withness_contact_number"
                                                value={data.withness_contact_number}
                                                style={errorFields.withness_contact_number ? { borderBottom: '2px dotted red' } : {}}
                                            />
                                        </div>
                                        <div className={styles.freeTextTable}>
                                            <span>लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको औठांंछाप</span>
                                            <table style={{ width: '60%' }}>
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
                                                            height: '300px',
                                                        }}
                                                    />
                                                    <td
                                                        style={{
                                                            border: '1px solid black',
                                                            borderCollapse: 'collapse',
                                                            textAlign: 'center',
                                                            width: '200px',
                                                            height: '300px',
                                                        }}
                                                    />

                                                </tr>

                                            </table>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className={styles.firstPartDetails}>
                                <h2 style={{ textDecoration: 'underline' }}>ख. दोश्रो पक्ष</h2>
                                <div className={styles.firstPartContainer} style={{ gap: '20px' }}>
                                    <div className={styles.formElements}>
                                        <div className={styles.freeTextPart2}>
                                            (<input type="text" disabled className={styles.inputClassName} />
                                            <span>कार्यपालिका कार्यालयको छाप</span>)
                                        </div>
                                        <div className={styles.freeText}>
                                            (
                                            <input type="text" className={styles.inputClassName} value={municipalityNameConverter(user.profile.municipality)} disabled />

                                            )
                                        </div>
                                        <div className={styles.freeText}>
                                            <span>हस्ताक्षरः</span>
                                            <input type="text" className={styles.inputClassName} disabled />
                                        </div>
                                        <div className={styles.freeText}>
                                            <span>नामः</span>
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="operating_municipality_officer_name"
                                                value={data.operating_municipality_officer_name}
                                                style={errorFields.operating_municipality_officer_name ? { borderBottom: '2px dotted red' } : {}}
                                            />
                                        </div>
                                        <div className={styles.freeText}>
                                            <span>पदः प्रमुुख प्रशासकीय अधिकृृत</span>

                                        </div>
                                        <div className={styles.freeText}>
                                            <span>मितिः</span>
                                            {/* <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="operating_municipality_signed_date"
                                                value={data.operating_municipality_signed_date}
                                            /> */}
                                            <NepaliDatePicker
                                                inputClassName="form-control"
                                                // className={styles.datePick}
                                                // value={ADToBS(dateAlt)}
                                                value={data.operating_municipality_signed_date}
                                                onChange={
                                                    (value: string) => {
                                                        setData({
                                                            ...data,
                                                            operating_municipality_signed_date: value,

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


                            </div>
                            <div>
                                <h2>प्रथम पक्ष लाभग्राहीलेे मञ्जुुर गरेेका शर्तहरुः</h2>
                                <div>
                                    <h2> {`${englishToNepaliNumber(1)}. मैैलेे भूूकम्पबाट प्राभाावित घरपरिवारलाई अस्थायी आवास निर्माण अनुुदान कार्ययविधि, २०८० एबंं यस सम्झौता-पत्र अनुुरुप बनाउनेे छुु ।`}</h2>
                                </div>
                                <div>
                                    <h2> {`${englishToNepaliNumber(2)}. निर्माण सामग्रीको खरिद गर्नेे तथा डकर्मी, सिकर्मी, प्लम्बर, इलेेक्ट्रिसियन, तथा अन्य निर्माण कार्य गर्न तथा श्रमिक
जुुटाउनेे र काममा लगाउनेे जिम्मेेवारी मेेरो हुुनेेछ ।`}
                                    </h2>
                                </div>
                                <div>
                                    <h2> {`${englishToNepaliNumber(3)}. मैैलेे प्राप्त गर्नेे अस्थायी आवास निर्माण अनुुदान रकम अस्थायी आवास निर्माणका लागि मात्र गर्नेेछुु ।`}
                                    </h2>
                                </div>
                                <div>
                                    <h2>{`${englishToNepaliNumber(4)}. उपलब्ध अनुुदान नपुुग भएमा अतिरिक्त ‍‍लागत म आफैँँलेे थप गरी अस्थायी आवास निर्माण सम्पन्न गर्नेेछुु।`}</h2>
                                </div>
                                <div>
                                    <h2>
                                        {`${englishToNepaliNumber(5)}. परिवारको व्यक्तिगत सरसफाई ध्यानमा राखी संंरचना निर्माण गर्नेेछुु।`}
                                    </h2>
                                </div>

                            </div>
                            <div>
                                <h2>दोश्रो पक्ष (स्थानीय तह) लेे मञ्जुुरी गरेेका शर्तहरुः</h2>
                                <div>
                                    <h2>
                                        {`${englishToNepaliNumber(1)}. प्रथम पक्षबाट यस कार्यविधि अनुुसार अस्थायी आवास निर्मााणको कार्य भएमा अनुुदान रकम सरकारको तर्फ बाट दफा
५ बमोजिम उपलब्ध गराइनेे छ ।`}
                                    </h2>
                                </div>
                            </div>
                            <div>
                                <h2>आवश्यक कागजातहरुः</h2>
                                <div style={{ margin: '10px 0px' }}>
                                    <h2> {`${englishToNepaliNumber(1)}. नागरिकता प्रमाण-पत्रको प्रतिलिपि वा राष्ट्रिय परिचयपत्रको प्रतिलिपि वा मतदाता परिचयपत्रको प्रतिलिपि वा वडाको सिफारिस`}</h2>
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: '20px' }}>फोटो:</span>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="file-input"
                                                // style={{ display: 'none' }}
                                                onChange={handleFileInputChange}
                                                name="identity_document"
                                            />
                                            {
                                                errorFields.identity_document
                                                    ? <p style={{ margin: 0, color: 'red' }}>कृपया फोटो अपलोड गर्नुहोस्</p> : ''
                                            }

                                            {
                                                data.identity_document ? <img height={100} width={100} src={handleShowImage(data.identity_document)} alt="img" /> : ''
                                            }
                                        </div>


                                    </div>
                                </div>
                                <div style={{ margin: '10px 0px' }}>
                                    <h2> {`${englishToNepaliNumber(2)}. पूूर्ण रूपलेे क्षति भएको वा आंंशिक क्षति भएता पनि बसोवास गर्न योग्य नरहेेको संंरचनाको फोटो`}
                                    </h2>
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: '20px' }}>फोटो:</span>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="file-input"
                                                // style={{ display: 'none' }}
                                                onChange={handleFileInputChange}
                                                name="infrastructure_photo"
                                            />
                                            {
                                                errorFields.infrastructure_photo
                                                    ? <p style={{ margin: 0, color: 'red' }}>कृपया फोटो अपलोड गर्नुहोस्</p> : ''
                                            }
                                            {
                                                data.infrastructure_photo ? <img height={100} width={100} src={handleShowImage(data.infrastructure_photo)} alt="img" /> : ''
                                            }
                                        </div>


                                    </div>
                                </div>
                                <div style={{ margin: '10px 0px' }}>
                                    <h2> {`${englishToNepaliNumber(3)}. घरमूूली उपस्थित नभएको अवस्थामा, मञ्जुुरीनामा सहितको निवेेदन`}
                                    </h2>
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: '20px' }}>फोटो:</span>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="file-input"
                                                // style={{ display: 'none' }}
                                                onChange={handleFileInputChange}
                                                name="application_document"
                                            />
                                            {
                                                errorFields.application_document
                                                    ? <p style={{ margin: 0, color: 'red' }}>कृपया फोटो अपलोड गर्नुहोस्</p> : ''
                                            }
                                            {
                                                data.application_document ? <img height={100} width={100} src={handleShowImage(data.application_document)} alt="img" /> : ''
                                            }
                                        </div>


                                    </div>
                                </div>
                                <div style={{ margin: '10px 0px' }}>
                                    <h2>{`${englishToNepaliNumber(4)}. प्रहरीको मुुचुल्का (प्रत्येेक घरधुुरीको मुुचुल्का नभएको अवस्थामा सामुुहिक मुुचुल्का पनि मान्य हुुनेे)`}</h2>
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: '20px' }}>फोटो:</span>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="file-input"
                                                // style={{ display: 'none' }}
                                                onChange={handleFileInputChange}
                                                name="police_report"
                                            />
                                            {
                                                errorFields.police_report
                                                    ? <p style={{ margin: 0, color: 'red' }}>कृपया फोटो अपलोड गर्नुहोस्</p> : ''
                                            }
                                            {
                                                data.police_report ? <img height={100} width={100} src={handleShowImage(data.police_report)} alt="img" /> : ''
                                            }
                                        </div>


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
            </div>
            <Footer />

        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            TemporaryShelter,
        ),
    ),
);
