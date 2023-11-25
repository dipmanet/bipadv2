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
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import Navbar from 'src/admin/components/Navbar';
import Footer from 'src/admin/components/Footer';
import MenuCommon from 'src/admin/components/MenuCommon';
import Map from 'src/admin/components/Mappointpicker';
import Modal from 'src/admin/components/Modal';

import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@material-ui/core/TextField';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import Page from '#components/Page';
import {
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
    wardsSelector,
    epidemicsPageSelector,
    userSelector,
} from '#selectors';
import { SetEpidemicsPageAction } from '#actionCreators';
import { ADToBS } from 'bikram-sambat-js';
import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import { englishToNepaliNumber } from 'nepali-number';
import styles from './styles.module.scss';
import ListSvg from '../../resources/list.svg';
import Ideaicon from '../../resources/ideaicon.svg';
import 'nepali-datepicker-reactjs/dist/index.css';

import {
    lossFormDataInitial,
    incidentFormDataInitial,
    deadMaleInitial,
    deadFemaleInitial,
    deadOtherInitial,
    deadDisabledInitial,
    injuredMaleInitial,
    injuredFemaleInitial,
    injuredOtherInitial,
    injuredDisabledInitial,
} from './utils';


const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    epidemmicsPage: epidemicsPageSelector(state),
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
    loss: {
        url: '/loss/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ lossID: response.id });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossError: 'Some problem occurred',
                });
            }
        },
    },
    incident: {
        url: '/incident/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Incident added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    incidentError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    incidentError: 'Some problem occurred',
                });
            }
        },
    },
    incidentUpdate: {
        url: ({ params }) => `/incident/${params.id}/`,
        method: methods.PATCH,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Incident Updated' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    incidentError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    incidentError: 'Some problem occurred',
                });
            }
        },
    },
    incidentPatch: {
        url: ({ params }) => `/incident/${params.id}/`,
        method: methods.PATCH,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Incident verified' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    incidentError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    incidentError: 'Some problem occurred',
                });
            }
        },
    },
    lossDeadMale: {
        url: '/loss-people/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
    lossDeadMaleUpdate: {
        url: ({ params }) => `/loss-people/${params.id}/`,
        method: methods.PUT,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
    lossDeadFemale: {
        url: '/loss-people/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
    lossDeadFemaleUpdate: {
        url: ({ params }) => `/loss-people/${params.id}/`,
        method: methods.PUT,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
    lossDeadOther: {
        url: '/loss-people/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
    lossDeadOtherUpdate: {
        url: ({ params }) => `/loss-people/${params.id}/`,
        method: methods.PUT,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
    lossDeadDisabled: {
        url: '/loss-people/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
    lossDeadDisabledUpdate: {
        url: ({ params }) => `/loss-people/${params.id}/`,
        method: methods.PUT,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
    lossInjuredMale: {
        url: '/loss-people/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
    lossInjuredMaleUpdate: {
        url: ({ params }) => `/loss-people/${params.id}/`,
        method: methods.PUT,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
    lossInjuredFemale: {
        url: '/loss-people/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
    lossInjuredFemaleUpdate: {
        url: ({ params }) => `/loss-people/${params.id}/`,
        method: methods.PUT,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
    lossInjuredOther: {
        url: '/loss-people/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
    lossInjuredOtherUpdate: {
        url: ({ params }) => `/loss-people/${params.id}/`,
        method: methods.PUT,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
    lossInjuredDisabled: {
        url: '/loss-people/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
    lossInjuredDisabledUpdate: {
        url: ({ params }) => `/loss-people/${params.id}/`,
        method: methods.PUT,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setEpidemicsPage) {
                params.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
};

interface EpidemicState {
    epidemic: {
        lossID: number;
        loader: boolean;
        lossError: string;
        incidentError: string;
        lossPeopleError: string;
        incidentUpdateError: string;
        epidemicChartDailyError: string;
        epidemicChartWeeklyError: string;
        epidemicChartYearlyError: string;
        epidemicChartMonthlyError: string;
        epidemicTableError: string;
        successMessage: string;
        incidentFormData: {
            'title': string;
            'cause': string;
            'loss': number;
            'verified': boolean;
            'approved': boolean;
            'incidentOn': Date;
            'reportedOn': Date;
            'verificationMessage': string;
            'hazard': number;
            'streetAddress': string;
            'point': {
                'type': string;
                'coordinates': number[];
            };
            'wards': number[];
            'source': string;
        };
        incidentEditData: {
            'id': number;
            'title': string;
            'cause': string;
            'loss': number;
            'verified': boolean;
            'approved': boolean;
            'incidentOn': Date;
            'reportedOn': Date;
            'verificationMessage': string;
            'hazard': number;
            'streetAddress': string;
            'point': {
                'type': string;
                'coordinates': number[];
            };
            'wards': number[];
            'source': string;
            'peoples': [];
        };
    };
}


const TemporaryShelter = (props) => {
    const [uniqueId, setuniqueId] = useState('');
    const [reportedDate, setReportedDate] = useState(null);
    const [provinceName, setprovinceName] = useState('');
    const [districtName, setdistrictName] = useState('');
    const [municipalityName, setmunicipalityName] = useState('');
    const [wardName, setwardName] = useState('');
    const [cause, setCause] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [lattitude, setLattitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [deadFormMale, setDeadMale] = useState('');
    const [deadFormFemale, setDeadFemale] = useState('');
    const [deadFormOther, setDeadOther] = useState('');
    const [deadFormDisabled, setDeadDisabled] = useState('');
    const [injuredFormMale, setInjuredMale] = useState('');
    const [injuredFormFemale, setInjuredFemale] = useState('');
    const [injuredFormOther, setInjuredOther] = useState('');
    const [injuredFormDisabled, setInjuredDisabled] = useState('');
    const [verified, setverified] = useState(false);
    const [notVerified, setNotVerified] = useState(false);
    const [approved, setApproved] = useState(false);
    const [notApproved, setNotApproved] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('');
    const [validationError, setvalidationError] = useState(null);
    const [provinceDataIs, setProvinceDataIs] = useState([]);
    const [districtDataIs, setdistrictDataIs] = useState([]);
    const [municipalityDataIs, setmunicipalityDataIs] = useState([]);
    const [wardDataIs, setwardDataIs] = useState([]);
    const [provinceId, setprovinceId] = useState(0);
    const [provinceCentriodForMap, setprovinceCentriodForMap] = useState<mapboxgl.LngLatLike>(null);
    const [districtId, setdistrictId] = useState(0);
    const [districtCentriodForMap, setdistrictCentriodForMap] = useState<mapboxgl.LngLatLike>(null);
    const [municipalityId, setmunicipalityId] = useState(0);
    // eslint-disable-next-line max-len
    const [municipalityCentriodForMap, setmunicipalityCentriodForMap] = useState<mapboxgl.LngLatLike>(null);
    const [wardId, setwardId] = useState(0);
    const [wardCentriodForMap, setwardCentriodForMap] = useState<mapboxgl.LngLatLike>(null);
    const [editLossId, setEditLossId] = useState('');
    const [editLossPeople, setEditLossPeople] = useState('');
    const [editWardId, setEditWardId] = useState(0);

    const [added, setAdded] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [error, setError] = useState(false);
    const [fieldsToDisable, setDisableFields] = useState([]);

    const [dateError, setDateError] = useState(false);
    const [provinceError, setProvinceError] = useState(false);
    const [districtError, setDistrictError] = useState(false);
    const [municipalityError, setMunnicipalityError] = useState(false);
    const [wardError, setWardError] = useState(false);
    const [latError, setLatError] = useState(false);
    const [longError, setLongError] = useState(false);
    const [dmError, setdmError] = useState(false);
    const [dfError, setdfError] = useState(false);
    const [doError, setdoError] = useState(false);
    const [ddError, setddError] = useState(false);
    const [amError, setamError] = useState(false);
    const [afError, setafError] = useState(false);
    const [aoError, setaoError] = useState(false);
    const [adError, setadError] = useState(false);

    // const [formError, setFormError] = useState(ErrorObj);

    const [initialProvinceCenter, setinitialProvinceCenter] = useState([]);
    const [initialDistrictCenter, setinitialDistrictCenter] = useState([]);
    const [initialMunCenter, setinitialMunCenter] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [date, setDate] = useState(null);
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
            temporary_shelter_land_kitta_number: '',
            temporary_shelter_land_area: '',
            temporary_shelter_land_map_sheet_number: '',
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
    const [loading, setLoading] = useState(false);

    const { epidemmicsPage:
        {
            lossID,
            lossPeopleError,
            incidentError,
            incidentUpdateError,
            lossError,
            incidentEditData,
        },
        user,
        provinces,
        districts,
        municipalities,
        wards,
        uri,
        requests: {
            addEarthquakePostRequest,

        } } = props;


    const handleFileInputChange = (e) => {
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
    useEffect(() => {
        if (user && user.profile && user.profile.province && provinces && provinces.length > 0) {
            const nameOfProvince = provinces.filter(item => item.id === user.profile.province).map(item => item.title)[0];
            setprovinceName(nameOfProvince);
            const provinceCenter = provinces.filter(item => item.id === user.profile.province).map(item => item.centroid.coordinates)[0];
            setinitialProvinceCenter(provinceCenter);
        }
        if (user && user.profile && user.profile.district && districts && districts.length > 0) {
            const nameOfDistrict = districts.filter(item => item.id === user.profile.district).map(item => item.title)[0];
            setdistrictName(nameOfDistrict);
            const districtCenter = districts.filter(item => item.id === user.profile.district).map(item => item.centroid.coordinates)[0];
            setinitialDistrictCenter(districtCenter);
        }
        if (user && user.profile && user.profile.municipality && municipalities && municipalities.length > 0) {
            const nameOfMunicipality = municipalities.filter(item => item.id === user.profile.municipality).map(item => item.title)[0];
            setmunicipalityName(nameOfMunicipality);
            const munCenter = municipalities.filter(item => item.id === user.profile.municipality).map(item => item.centroid.coordinates)[0];
            setinitialMunCenter(munCenter);
        }
        if (user && user.profile && user.profile.ward && wards && wards.length > 0) {
            const nameOfWard = wards.filter(item => item.id === user.profile.ward).map(item => item.title)[0];
            setwardName(nameOfWard);
        }
    }, [districts, municipalities, provinces, user, wards]);

    console.log('This is final file', selectedFile);
    const clearData = () => {
        setuniqueId('');
        setReportedDate(null);
        setCause('');
        setprovinceName('');
        setdistrictName('');
        setmunicipalityName('');
        setwardName('');
        setStreetAddress('');
        setLattitude('');
        setLongitude('');
        setDeadMale('');
        setDeadFemale('');
        setDeadOther('');
        setDeadDisabled('');
        setInjuredMale('');
        setInjuredFemale('');
        setInjuredOther('');
        setInjuredDisabled('');
        setverified(false);
        setNotVerified(false);
        setApproved(false);
        setNotApproved(false);
        setVerificationMessage('');
    };

    const centriodsForMap = {
        provinceName,
        districtName,
        municipalityName,
        wardName,
        provinceDataIs,
        districtDataIs,
        municipalityDataIs,
        wardDataIs,
        provinceCentriodForMap,
        districtCentriodForMap,
        municipalityCentriodForMap,
        wardCentriodForMap,
        provinceId,
        districtId,
        municipalityId,
        wardId,
        setLattitude,
        setLongitude,
    };

    useEffect(() => {
        const province = provinces.filter(
            item => item.title === provinceName,
        ).map(item => item.id)[0];
        if (provinceName) {
            setprovinceId(province);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinceName]);

    useEffect(() => {
        const district = districts.filter(
            item => item.title === districtName,
        ).map(item => item.id)[0];
        if (districtName) {
            setdistrictId(district);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [districtName]);

    useEffect(() => {
        const municipality = municipalities.filter(
            item => item.title === municipalityName,
        ).map(item => item.id)[0];
        if (municipalityName) {
            setmunicipalityId(municipality);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [municipalityName]);

    useEffect(() => {
        if (provinceId) {
            const temp = provinceDataIs.filter(item => item.id === provinceId)
                .map(item => item.centroid.coordinates)[0];
            setprovinceCentriodForMap(temp);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinceId]);

    useEffect(() => {
        const id = wards.filter(item => item.municipality === municipalityId)
            .filter(item => item.title === String(wardName)).map(item => item.id)[0];
        if (wardName) {
            setwardId(id);
            setEditWardId(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wardName]);

    const handleVerifiedChange = () => {
        setverified(true);
        setNotVerified(false);
    };
    const handleNotVerifiedChange = () => {
        setverified(false);
        setNotVerified(true);
    };
    const handleApprovedChange = () => {
        setApproved(true);
        setNotApproved(false);
    };
    const handleNotApprovedChange = () => {
        setApproved(false);
        setNotApproved(true);
    };

    const handleUpdateSuccess = () => {
        setAdded(false);
        setUpdated(false);
        setError(false);
        navigate('/admin/temporary-shelter-enrollment-form/temporary-shelter-enrollment-form-data-table');
    };
    const handleAddedSuccess = () => {
        setAdded(false);
        setUpdated(false);
        setError(false);
        clearData();
    };
    const handleErrorClose = () => {
        setAdded(false);
        setUpdated(false);
        setError(false);
    };
    const handleTableButton = () => {
        console.log('Entered here');
        navigate('/admin/temporary-shelter-enrollment-form/temporary-shelter-enrollment-form-data-table');
    };

    useEffect(() => {
        if (incidentEditData && Object.keys(incidentEditData).length > 0) {
            setuniqueId(incidentEditData.id);
            setReportedDate(incidentEditData.reportedOn);
            setLattitude(incidentEditData.point.coordinates[1]);
            setLongitude(incidentEditData.point.coordinates[0]);
            setStreetAddress(incidentEditData.streetAddress);
            setCause(incidentEditData.cause);

            setprovinceName(incidentEditData.wards[0].municipality.district.province.title);

            setdistrictName(incidentEditData.wards[0].municipality.district.title);
            setmunicipalityName(incidentEditData.wards[0].municipality.title);
            setwardName(incidentEditData.wards[0].title);
            setVerificationMessage(incidentEditData.verificationMessage);
            // setwardId(incidentEditData.wards[0].id);
            setEditWardId(incidentEditData.wards[0].id);
            // setEditWardName(incidentEditData.wards[0].title);
            setDeadMale(incidentEditData.loss.peopleDeathMaleCount);
            setDeadFemale(incidentEditData.loss.peopleDeathFemaleCount);
            setDeadOther(incidentEditData.loss.peopleDeathOtherCount);
            setDeadDisabled(incidentEditData.loss.peopleDeathDisabledCount);
            setInjuredMale(incidentEditData.loss.peopleInjuredMaleCount);
            setInjuredFemale(incidentEditData.loss.peopleInjuredFemaleCount);
            setInjuredOther(incidentEditData.loss.peopleInjuredOtherCount);
            setInjuredDisabled(incidentEditData.loss.peopleInjuredDisabledCount);
            setEditLossId(incidentEditData.loss.id);
            setEditLossPeople(incidentEditData.loss.peoples);
            if (incidentEditData.verified) {
                setverified(true);
            }
            if (!incidentEditData.verified) {
                setNotVerified(true);
            }
            if (incidentEditData.approved) {
                setApproved(true);
            }
            if (!incidentEditData.approved) {
                setNotApproved(true);
            }
            // dispatch(clearFormEditEpidemic());
            props.setEpidemicsPage({ incidentEditData: {} });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [incidentEditData]);

    const handleEpidemicFormSubmit = async () => {
        if (!reportedDate || !provinceName || !districtName || !municipalityName || !wardName
            || !lattitude || !longitude || !deadFormMale || !deadFormFemale || !deadFormOther
            || !deadFormDisabled || !injuredFormMale || !injuredFormFemale || !injuredFormOther
            || !injuredFormDisabled) {
            if (!reportedDate) {
                setDateError(true);
            } else {
                setDateError(false);
            }
            if (!provinceName) {
                setProvinceError(true);
            } else {
                setProvinceError(false);
            }
            if (!districtName) {
                setDistrictError(true);
            } else {
                setDistrictError(false);
            }
            if (!municipalityName) {
                setMunnicipalityError(true);
            } else {
                setMunnicipalityError(false);
            }
            if (!wardName) {
                setWardError(true);
            } else {
                setWardError(false);
            }
            if (!lattitude) {
                setLatError(true);
            } else {
                setLatError(false);
            }
            if (!longitude) {
                setLongError(true);
            } else {
                setLongError(false);
            }
            if (!deadFormMale) {
                setdmError(true);
            } else {
                setdmError(false);
            }
            if (!deadFormFemale) {
                setdfError(true);
            } else {
                setdfError(false);
            }
            if (!deadFormOther) {
                setdoError(true);
            } else {
                setdoError(false);
            }
            if (!deadFormDisabled) {
                setddError(true);
            } else {
                setddError(false);
            }
            if (!injuredFormMale) {
                setamError(true);
            } else {
                setamError(false);
            }
            if (!injuredFormFemale) {
                setafError(true);
            } else {
                setafError(false);
            }
            if (!injuredFormOther) {
                setaoError(true);
            } else {
                setaoError(false);
            }
            if (!injuredFormDisabled) {
                setadError(true);
            } else {
                setadError(false);
            }
        } else if (uniqueId) {
            const title = `Epidemic at ${provinceName}, ${districtName}, ${municipalityName}-${wardName}`;
            const datai = {
                ...incidentFormDataInitial,
                title,
                incidentOn: reportedDate,
                cause,
                verified,
                approved,
                reportedOn: reportedDate,
                verificationMessage,
                loss: editLossId,
                streetAddress,
                point: {
                    type: 'Point',
                    coordinates: [longitude, lattitude],
                },
                wards: [editWardId],
            };
            if (user
                && user.profile
                && user.profile.role === 'validator'
            ) {
                const verify = {
                    verified,
                    approved,
                    verification_message: verificationMessage,
                };
                props.requests.incidentPatch.do({ id: uniqueId, body: verify });
            } else {
                props.requests.incidentUpdate.do({ id: uniqueId, body: datai });
            }


            const obj = {
                injuredMale: editLossPeople && editLossPeople.filter(item => item.status === 'injured' && item.gender === 'male' && !item.disability)[0].id,
                injuredFemale: editLossPeople && editLossPeople.filter(item => item.status === 'injured' && item.gender === 'female' && !item.disability)[0].id,
                injuredOther: editLossPeople && editLossPeople.filter(item => item.status === 'injured' && item.gender === 'others' && !item.disability)[0].id,
                injuredDisabled: editLossPeople && editLossPeople.filter(item => item.status === 'injured' && !item.gender && item.disability === 1)[0].id,
                deadMale: editLossPeople && editLossPeople.filter(item => item.status === 'dead' && item.gender === 'male' && !item.disability)[0].id,
                deadFemale: editLossPeople && editLossPeople.filter(item => item.status === 'dead' && item.gender === 'female' && !item.disability)[0].id,
                deadOther: editLossPeople && editLossPeople.filter(item => item.status === 'dead' && item.gender === 'others' && !item.disability)[0].id,
                deadDisabled: editLossPeople && editLossPeople.filter(item => item.status === 'dead' && !item.gender && item.disability === 1)[0].id,
            };

            const deadMale = {
                ...deadMaleInitial,
                loss: editLossId,
                count: deadFormMale,
            };
            props.requests.lossDeadMaleUpdate.do({ id: obj.deadMale, body: deadMale });
            // dispatch(lossPeopleUpdateData(obj.deadMale, deadMale));
            const deadFemale = {
                ...deadFemaleInitial,
                loss: editLossId,
                count: deadFormFemale,
            };
            props.requests.lossDeadFemaleUpdate.do({ id: obj.deadFemale, body: deadFemale });
            // dispatch(lossPeopleUpdateData(obj.deadFemale, deadFemale));
            const deadOther = {
                ...deadOtherInitial,
                loss: editLossId,
                count: deadFormOther,
            };
            props.requests.lossDeadOtherUpdate.do({ id: obj.deadOther, body: deadOther });
            // dispatch(lossPeopleUpdateData(obj.deadOther, deadOther));
            const deadDisabled = {
                ...deadDisabledInitial,
                loss: editLossId,
                count: deadFormDisabled,
            };
            props.requests.lossDeadDisabledUpdate.do({ id: obj.deadDisabled, body: deadDisabled });
            // dispatch(lossPeopleUpdateData(obj.deadDisabled, deadDisabled));
            const injuredMale = {
                ...injuredMaleInitial,
                loss: editLossId,
                count: injuredFormMale,
            };
            props.requests.lossInjuredMaleUpdate.do({ id: obj.injuredMale, body: injuredMale });
            // dispatch(lossPeopleUpdateData(obj.injuredMale, injuredMale));
            const injuredFemale = {
                ...injuredFemaleInitial,
                loss: editLossId,
                count: injuredFormFemale,
            };
            props.requests.lossInjuredFemaleUpdate.do({ id: obj.injuredFemale, body: injuredFemale });
            // dispatch(lossPeopleUpdateData(obj.injuredFemale, injuredFemale));
            const injuredOther = {
                ...injuredOtherInitial,
                loss: editLossId,
                count: injuredFormOther,
            };
            props.requests.lossInjuredOtherUpdate.do({ id: obj.injuredOther, body: injuredOther });
            // dispatch(lossPeopleUpdateData(obj.injuredOther, injuredOther));
            const injuredDisabled = {
                ...injuredDisabledInitial,
                loss: editLossId,
                count: injuredFormDisabled,
            };
            props.requests.lossInjuredDisabledUpdate.do({ id: obj.injuredDisabled, body: injuredDisabled });
            // dispatch(lossPeopleUpdateData(obj.injuredDisabled, injuredDisabled));
            if (lossPeopleError || incidentError || lossError || incidentUpdateError) {
                setError(true);
            }
            setUpdated(true);
        } else {
            // dispatch(lossData(lossFormDataInitial));
            props.requests.loss.do(lossFormDataInitial);
        }
    };

    useEffect(() => {
        if (lossID) {
            const title = `Epidemic at ${provinceName}, ${districtName}, ${municipalityName}-${wardName}`;
            const datasa = {
                ...incidentFormDataInitial,
                loss: lossID,
                title,
                incidentOn: reportedDate,
                cause,
                verified,
                approved,
                reportedOn: reportedDate,
                verificationMessage,
                streetAddress,
                point: {
                    type: 'Point',
                    coordinates: [longitude, lattitude],
                },
                wards: [wardId],
            };
            props.requests.incident.do({ body: datasa });
            const deadMale = {
                ...deadMaleInitial,
                loss: lossID,
                count: deadFormMale,
            };
            props.requests.lossDeadMale.do({ body: deadMale });
            const deadFemale = {
                ...deadFemaleInitial,
                loss: lossID,
                count: deadFormFemale,
            };
            props.requests.lossDeadFemale.do({ body: deadFemale });
            const deadOther = {
                ...deadOtherInitial,
                loss: lossID,
                count: deadFormOther,
            };
            props.requests.lossDeadOther.do({ body: deadOther });
            const deadDisabled = {
                ...deadDisabledInitial,
                loss: lossID,
                count: deadFormDisabled,
            };
            props.requests.lossDeadDisabled.do({ body: deadDisabled });
            const injuredMale = {
                ...injuredMaleInitial,
                loss: lossID,
                count: injuredFormMale,
            };
            props.requests.lossInjuredMale.do({ body: injuredMale });
            const injuredFemale = {
                ...injuredFemaleInitial,
                loss: lossID,
                count: injuredFormFemale,
            };
            props.requests.lossInjuredFemale.do({ body: injuredFemale });
            const injuredOther = {
                ...injuredOtherInitial,
                loss: lossID,
                count: injuredFormOther,
            };
            props.requests.lossInjuredOther.do({ body: injuredOther });
            const injuredDisabled = {
                ...injuredDisabledInitial,
                loss: lossID,
                count: injuredFormDisabled,
            };
            props.requests.lossInjuredDisabled.do({ body: injuredDisabled });
            setAdded(true);
        }
        if (lossPeopleError || incidentError || lossError) {
            setError(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lossID]);


    const handleFormData = (e) => {
        if (e.target.value === 'beneficiary_district') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                beneficiary_municipality: null,
                beneficiary_ward: null,
            });
        } else if (e.target.value === 'beneficiary_municipality') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                beneficiary_ward: null,
            });
        } else if (e.target.value === 'temporary_shelter_land_district') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                temporary_shelter_land_municipality: null,
                temporary_shelter_land_ward: null,
            });
        } else if (e.target.value === 'temporary_shelter_land_municipality') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                temporary_shelter_land_ward: null,
            });
        } else if (e.target.value === 'beneficiary_representative_district') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                beneficiary_representative_municipality: null,
                beneficiary_representative_ward: null,
            });
        } else if (e.target.value === 'beneficiary_representative_municipality') {
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


    const municipalityDefinedName = user.profile.municipality
        ? municipalities.find(i => i.id === user.profile.municipality).title_ne : '';

    console.log('This is final data', data);
    const handleSuccessMessage = (d) => {
        navigate(`/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data-preview/${d.id}`);
    };
    const handleClick = () => {
        setLoading(true);
        const finalUpdateData = data;
        finalUpdateData.operating_municipality = user.profile.municipality;
        finalUpdateData.responsible_municipality = user.profile.municipality;
        console.log('final data', finalUpdateData);
        addEarthquakePostRequest.do({
            body: finalUpdateData,
            onSuccess: datas => handleSuccessMessage(datas),
            setFaramErrors: err => console.log('err', err),

        });
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
        });
    }, []);

    console.log('This is final date', date);
    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            <MenuCommon layout="common" currentPage={'Epidemics'} uri={uri} />
            <div className={styles.container}>
                <Modal
                    open={added || updated}
                    title={'Thank you!'}
                    description={
                        added ? 'Your record has been added'
                            : updated ? 'Your record has been updated'
                                : lossError
                                || incidentError
                                || lossPeopleError
                                || incidentUpdateError
                    }
                    handleClose={updated ? handleUpdateSuccess
                        : added ? handleAddedSuccess
                            : handleErrorClose}
                />

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
                                <input
                                    type="text"
                                    name="entry_date_bs"
                                    value={data.entry_date_bs}
                                    onChange={handleFormData}
                                    className={styles.inputClassName}
                                />

                                {/* <NepaliDatePicker
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

                                /> */}
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
                                        value={data.beneficiary_district}
                                        id="districts-benificery"
                                        onChange={handleFormData}
                                    >
                                        <option>जिल्ला</option>
                                        {
                                            districts.map(item => (
                                                <option value={item.id}>{item.title_ne}</option>
                                            ))
                                        }


                                    </select>
                                    {' '}
                                    जिल्ला
                                    {' '}
                                    <select
                                        id="beneficiary_municipality"
                                        name="beneficiary_municipality"
                                        value={data.beneficiary_municipality}
                                        onChange={handleFormData}
                                    >
                                        <option> गा.पा/न.पा. वडा नंं.</option>
                                        {
                                            selectedMunicipality.map(item => (
                                                <option value={item.id}>{item.title_ne}</option>
                                            ))
                                        }
                                    </select>
                                    {' '}
                                    गा.पा/न.पा.
                                    {' '}
                                    {' '}
                                    वडा नंं.
                                    <select
                                        id="beneficiary_ward"
                                        name="beneficiary_ward"
                                        value={data.beneficiary_ward}
                                        onChange={handleFormData}
                                    >
                                        <option>वडा नंं.</option>
                                        {
                                            selectedWard.map(item => (
                                                <option value={item.id}>{item.title}</option>
                                            ))
                                        }
                                    </select>
                                    {' '}
                                    गाउँँ/टोल
                                    <input
                                        type="text"
                                        className={styles.inputClassName}
                                        name="tole_name"
                                        value={data.tole_name}
                                        onChange={handleFormData}
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
                                    />
                                    {' '}
                                    को
                                    {' '}
                                    <select
                                        id="grand_child_relation"
                                        name="grand_child_relation"
                                        value={data.grand_child_relation}
                                        onChange={handleFormData}
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
                                    />
                                    {' '}
                                    को
                                    {' '}
                                    <select
                                        id="child_relation"
                                        name="child_relation"
                                        value={data.child_relation}
                                        onChange={handleFormData}


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
                                    />
                                    {' '}
                                    को लाभग्रााही श्री
                                    {' '}
                                    <input
                                        type="text"
                                        name="beneficiary_name_nepali"
                                        value={data.beneficiary_name_nepali}
                                        onChange={handleFormData}
                                        className={styles.inputClassName}
                                    />
                                    {' '}
                                    (यसपछि प्रथम पक्ष भनिनेे) र
                                    {' '}
                                    <input type="text" className={styles.inputClassName} value={municipalityDefinedName} disabled />
                                    {' '}
                                    गााउँँपालिका,
                                    नगरपालिका कार्यालय (यसपछि दोश्रो पक्ष भनिनेे) बीच देेहाय बमोजिमका शर्तहरुको अधिनमा रही भूूकम्पबाट प्रभावित
                                    घरपरिवारलाई अस्थायी आवास निर्मााण अनुुदान कार्ययविधि,२०८०, बमोजिम अस्थायी आवास निर्मााण गर्न यो अनुुदान
                                    सम्झौता-पत्रमा सहीछााप गरेेका छौंं ।
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
                                            value={data.temporary_shelter_land_district}
                                            onChange={handleFormData}
                                        >
                                            <option> जिल्ला</option>
                                            {
                                                districts.map(item => (
                                                    <option value={item.id}>{item.title_ne}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className={styles.tempAddressIndividualDiv}>
                                        गा.पा/न.पा.
                                        {' '}
                                        <select
                                            id="temporary_shelter_land_municipality"
                                            name="temporary_shelter_land_municipality"
                                            value={data.temporary_shelter_land_municipality}
                                            onChange={handleFormData}
                                        >
                                            <option> गा.पा/न.पा. वडा नंं.</option>
                                            {
                                                tempSelectedMunicipality.map(item => (
                                                    <option value={item.id}>{item.title_ne}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className={styles.tempAddressIndividualDiv}>
                                        वडा नंं.
                                        {' '}
                                        <select
                                            id="temporary_shelter_land_ward"
                                            name="temporary_shelter_land_ward"
                                            value={data.temporary_shelter_land_ward}
                                            onChange={handleFormData}
                                        >
                                            <option>वडा नंं.</option>
                                            {
                                                tempSelectedWard.map(item => (
                                                    <option value={item.id}>{item.title}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className={styles.tempAddressIndividualDiv}>
                                        कित्ता नंं.
                                        {' '}
                                        <input
                                            type="text"
                                            name="temporary_shelter_land_kitta_number"
                                            value={data.temporary_shelter_land_kitta_number}
                                            onChange={handleFormData}
                                            className={styles.inputClassName}
                                        />
                                    </div>
                                    <div className={styles.tempAddressIndividualDiv}>
                                        क्षेेत्रफल
                                        {' '}
                                        <input
                                            type="text"
                                            name="temporary_shelter_land_area"
                                            value={data.temporary_shelter_land_area}
                                            onChange={handleFormData}
                                            className={styles.inputClassName}
                                        />
                                    </div>
                                    <div className={styles.tempAddressIndividualDiv}>
                                        नक्सा सिट नंं.
                                        {' '}
                                        <input
                                            type="text"
                                            name="temporary_shelter_land_map_sheet_number"
                                            value={data.temporary_shelter_land_map_sheet_number}
                                            onChange={handleFormData}
                                            className={styles.inputClassName}
                                        />
                                    </div>
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
                                            />
                                        </div>
                                        <div className={styles.locationDetails}>
                                            <div>
                                                <span>जिल्लाः</span>
                                                {' '}
                                                <select name="beneficiary_district" value={data.beneficiary_district} disabled id="beneficiary_district1">
                                                    <option value="volvo"> वडा नंं.</option>
                                                    {
                                                        districts.map(item => (
                                                            <option value={item.id}>{item.title_ne}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div>
                                                <span>गा.पा./न.पाः</span>
                                                {' '}
                                                <select name="beneficiary_municipality" value={data.beneficiary_municipality} disabled id="cars">
                                                    <option value="volvo"> गा.पा./न.पाः</option>
                                                    {
                                                        selectedMunicipality.map(item => (
                                                            <option value={item.id}>{item.title_ne}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div>
                                                <span>वडा नंं.</span>
                                                {' '}
                                                <select name="beneficiary_ward" value={data.beneficiary_ward} disabled id="cars">
                                                    <option value="volvo"> वडा नंं.</option>
                                                    {
                                                        selectedWard.map(item => (
                                                            <option value={item.id}>{item.title}</option>
                                                        ))
                                                    }
                                                </select>
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

                                                    className={styles.inputClassName}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
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
                                                        <div className={styles.locationDetails}>
                                                            <div className={styles.freeText}>
                                                                <span>नाम, थर नेेपालीमाः</span>
                                                                <input
                                                                    type="text"
                                                                    onChange={handleFormData}
                                                                    name="beneficiary_representative_name_nepali"
                                                                    value={data.beneficiary_representative_name_nepali}

                                                                    className={styles.inputClassName}
                                                                />
                                                            </div>
                                                            <div>
                                                                <span>जिल्लाः</span>
                                                                {' '}
                                                                <select
                                                                    name="beneficiary_representative_district"
                                                                    value={data.beneficiary_representative_district}
                                                                    onChange={handleFormData}
                                                                    id="beneficiary_representative_district1"
                                                                >
                                                                    <option>जिल्लाः</option>
                                                                    {
                                                                        districts.map(item => (
                                                                            <option value={item.id}>{item.title_ne}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <span>गा.पा./न.पाः</span>
                                                                {' '}
                                                                <select
                                                                    name="beneficiary_representative_municipality"
                                                                    value={data.beneficiary_representative_municipality}
                                                                    onChange={handleFormData}
                                                                    id="beneficiary_representative_municipality1"

                                                                >
                                                                    <option> गा.पा./न.पाः</option>
                                                                    {
                                                                        beneficiarySelectedMunicipality.map(item => (
                                                                            <option value={item.id}>{item.title_ne}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <span>वडा नंं.</span>
                                                                {' '}
                                                                <select
                                                                    name="beneficiary_representative_ward"
                                                                    value={data.beneficiary_representative_ward}
                                                                    onChange={handleFormData}
                                                                    id="beneficiary_representative_ward1"
                                                                >
                                                                    <option> वडा नंं.</option>
                                                                    {
                                                                        beneficiarySelectedWard.map(item => (
                                                                            <option value={item.id}>{item.title}</option>
                                                                        ))
                                                                    }
                                                                </select>
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
                                                                />
                                                            </div>

                                                        </div>

                                                    </div>
                                                ) : ''
                                        }

                                        <div className={styles.freeText}>
                                            <span>बाजेेको नाम, थर:</span>
                                            {' '}
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                name="beneficiary_representative_grandfather_name"
                                                value={data.beneficiary_representative_grandfather_name}
                                                onChange={handleFormData}
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
                                            />
                                        </div>


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
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="migration_date_bs"
                                                value={data.migration_date_bs}
                                            />
                                        </div>

                                    </div>
                                </div>
                                <div className={styles.firstPartContainer}>
                                    <span>४. लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको औंठा छाप लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको हस्ताक्षर</span>
                                    <div className={styles.formElements}>
                                        <div className={styles.freeText}>
                                            <span>मितिः</span>
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="signed_date"
                                                value={data.signed_date}
                                            />

                                            {/* <NepaliDatePicker
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
                                            /> */}
                                        </div>
                                        <div className={styles.freeText}>
                                            <span>साक्षीको नाम, थर</span>
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="withness_name_nepali"
                                                value={data.withness_name_nepali}
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
                                            />
                                        </div>
                                        <div className={styles.freeTextTable}>
                                            <span>लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको औठांंछाप</span>
                                            <table>
                                                <tr>
                                                    <th>दायाँँ</th>
                                                    <th>बायाँँ</th>

                                                </tr>
                                                <tr>
                                                    <td />
                                                    <td />

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
                                            <input type="text" className={styles.inputClassName} value={municipalityDefinedName} disabled />
                                            <span>गा.पा/न.पा.</span>
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
                                            />
                                        </div>
                                        <div className={styles.freeText}>
                                            <span>पदः प्रमुुख प्रशासकीय अधिकृृत</span>

                                        </div>
                                        <div className={styles.freeText}>
                                            <span>मितिः</span>
                                            <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="operating_municipality_signed_date"
                                                value={data.operating_municipality_signed_date}
                                            />
                                            {/* <NepaliDatePicker
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
                                            /> */}
                                        </div>


                                    </div>
                                </div>


                            </div>
                            <div>
                                <h2>प्रथम पक्ष लाभग्राहीलेे मञ्जुुर गरेेका शर्तहरुः</h2>
                                <div>
                                    <h2> {`${englishToNepaliNumber(1)}. म/मेेरो परिवारका लागि अस्थायी आवास निर्माण गर्न मेेरो/मेेरो परिवारको नाममा उपयुुक्त र पर्याप्त घडेेरी छ ।`}</h2>
                                </div>
                                <div>
                                    <h2> {`${englishToNepaliNumber(2)}. मैैलेे भूूकम्पबाट प्रभावित घरपरिवारलाई अस्थायी आवास निर्माण अनुुदान कार्यविधि, २०८० एबंं यस सम्झौता-पत्रमा
                                        उल्लेेखित शर्त, मापदण्ड, प्रविधि र गुुणस्तर अनुुरुप बनाउनेे छुु ।`}
                                    </h2>
                                </div>
                                <div>
                                    <h2> {`${englishToNepaliNumber(3)}. निर्माण सामग्रीको खरिद गर्नेे तथा डकर्मी, सिकर्मी, प्लम्बर, इलेेक्ट्रिसियन, तथा अन्य निर्माण कार्य गर्न तथा श्रमिक
                                        जुुटाउनेे र काममा लगाउनेे जिम्मेेवारी मेेरो हुुनेेछ ।`}
                                    </h2>
                                </div>
                                <div>
                                    <h2>{`${englishToNepaliNumber(4)}. मैैलेे प्राप्त गर्नेे अस्थायी आवास निर्माण अनुुदान रकम अस्थायी आवास निर्माणका लागि मात्र गर्नेेछुु ।`}</h2>
                                </div>
                                <div>
                                    <h2>
                                        {`${englishToNepaliNumber(5)}. उपलब्ध अनुुदान नपुुग भएमा अतिरिक्त ‍‍लागत म आफैँँलेे थप गरी अस्थायी आवास निर्माण सम्पन्न गर्नेेछुु।`}
                                    </h2>
                                </div>
                                <div>
                                    <h2>
                                        {`${englishToNepaliNumber(6)}. परिवारको व्यक्तिगत सरसफाई ध्यानमा राखी संंरचना निर्माण गर्नेेछुु।`}
                                    </h2>
                                </div>

                            </div>
                            <div>
                                <h2>दोश्रो पक्ष (स्थानीय तह) लेे मञ्जुुरी गरेेका शर्तहरुः</h2>
                                <div>
                                    <h2>
                                        {`${englishToNepaliNumber(1)}. प्रथम पक्षबाट उल्लिखित शर्तहरु पूूरा भएको अवस्थामा तोकिए अनुुसारको अस्थायी आवाास निर्माण अनुुदान सरकारको
                                        तर्फ बाट बैंंक मार्फत उपलब्ध गराइनेे छ ।`}
                                    </h2>
                                </div>
                            </div>
                            <div>
                                <h2>आवश्यक कागजातहरुः</h2>
                                <div>
                                    <h2> {`${englishToNepaliNumber(1)}. नागरिकता प्रमाण-पत्रको प्रतिलिपि वा राष्ट्रिय परिचयपत्रको प्रतिलिपि वा मतदाता परिचयपत्रको प्रतिलिपि`}</h2>
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
                                                data.identity_document ? <img height={100} width={100} src={handleShowImage(data.identity_document)} alt="img" /> : ''
                                            }
                                        </div>


                                    </div>
                                </div>
                                <div>
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
                                                data.infrastructure_photo ? <img height={100} width={100} src={handleShowImage(data.infrastructure_photo)} alt="img" /> : ''
                                            }
                                        </div>


                                    </div>
                                </div>
                                <div>
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
                                                data.application_document ? <img height={100} width={100} src={handleShowImage(data.application_document)} alt="img" /> : ''
                                            }
                                        </div>


                                    </div>
                                </div>
                                <div>
                                    <h2>{`${englishToNepaliNumber(4)}. प्रहरीको मुुचुल्का`}</h2>
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
                                                data.police_report ? <img height={100} width={100} src={handleShowImage(data.police_report)} alt="img" /> : ''
                                            }
                                        </div>


                                    </div>
                                </div>


                            </div>
                            <span className={styles.ValidationErrors}>{validationError}</span>
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
