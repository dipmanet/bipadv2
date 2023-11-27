/* eslint-disable consistent-return */
/* eslint-disable no-const-assign */
/* eslint-disable no-return-assign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { navigate, useLocation, Router } from '@reach/router';
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
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
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
import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
// import styles from './styles.module.scss';
import { englishToNepaliNumber } from 'nepali-number';
import ListSvg from '../../resources/list.svg';
import Ideaicon from '../../resources/ideaicon.svg';
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


const TemporaryShelterPreview = (props) => {
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
    const [loadPrint, setLoadPrint] = useState(false);
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
    const [data, setData] = useState(
        {
            entry_date_bs: '',
            pa_number: '',
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
    const [fetchedData, setFetchedData] = useState(null);
    const { pathname } = useLocation();
    let componentRef = useRef();
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
            const datas = {
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
                props.requests.incidentUpdate.do({ id: uniqueId, body: datas });
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
            const datai = {
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
            props.requests.incident.do({ body: datai });
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


    const municipalityDefinedName = fetchedData && fetchedData.operatingMunicipality
        && municipalities.find(i => i.id === fetchedData.operatingMunicipality).title_ne;


    const handleClick = () => {
        const finalUpdateData = data;
        finalUpdateData.operating_municipality = user.profile.municipality;
        finalUpdateData.responsible_municipality = user.profile.municipality;

        addEarthquakePostRequest.do({
            body: finalUpdateData,
            onSuccess: datas => console.log('Successful', datas),
            setFaramErrors: err => console.log('err', err),

        });
    };

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

    const districtNameConverter = (id) => {
        const finalData = fetchedData && districts.find(i => i.id === id).title_ne;

        return finalData;
    };

    const municipalityNameConverter = (id) => {
        // const finalData = fetchedData && municipalities.find(i => i.id === id).title_ne;
        const finalData = fetchedData && municipalities.find(i => i.id === id);
        if (finalData.type === 'Rural Municipality') {
            const municipality = `${finalData.title_ne} गाउँपालिका`;
            return municipality;
        } if (finalData.type === 'Submetropolitan City') {
            const municipality = `${finalData.title_ne} उप-महानगरपालिका`;
            return municipality;
        } if (finalData.type === 'Metropolitan City') {
            const municipality = `${finalData.title_ne} महानगरपालिका`;
            return municipality;
        }
        return `${finalData.title_ne} नगरपालिका`;
    };

    const wardNameConverter = (id) => {
        const finalData = fetchedData && wards.find(i => i.id === id).title;
        return finalData;
    };
    const handlePrint = () => {
        setLoadPrint(true);
    };

    useEffect(() => {
        if (loadPrint) {
            const timer = setTimeout(() => {
                setLoadPrint(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [loadPrint]);
    useEffect(() => {
        function addScript(url) {
            const script = document.createElement('script');
            script.type = 'application/javascript';
            script.src = url;
            document.head.appendChild(script);
        }
        addScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
    }, []);


    const dateFormatter = (date) => {
        const slicedDate = date.split('-');
        const year = englishToNepaliNumber(slicedDate[0]);
        const month = englishToNepaliNumber(slicedDate[1]);
        const day = englishToNepaliNumber(slicedDate[2]);
        const finalDate = `${year}/${month}/${day}`;
        return finalDate;
    };


    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            <div className="container123">
                <h1 className="header123">अस्थायी आश्रय नामांकन डाटा संरचना</h1>
                <p className="dataReporting123">डाटा रिपोर्टिङ</p>
                <div className="twoSections123">
                    <div className="reportingStatus123">
                        <div className="reporting123">
                            <img className="listSvg123" src={ListSvg} alt="" />
                            <p className="reportingText123">जानकारी</p>
                            <p className="greenCircle123" />
                        </div>
                    </div>
                    <div className="mainForm123">
                        <div className="generalInfoAndTableButton123">
                            <h1 className="generalInfo">जानकारी</h1>
                            <button
                                className="DataTableClick123"
                                type="button"
                                onClick={handleTableButton}
                            >डाटा तालिका हेर्नुहोस्
                            </button>
                        </div>
                        <div className="shortGeneralInfo123">
                            <img className="ideaIcon123" src={Ideaicon} alt="" />
                            <p className="ideaPara123">
                                अस्थायी आश्रय नामांकन फारममा भूकम्प प्रभावित क्षेत्रको विवरण र घरको विवरण समावेश हुन्छ।

                            </p>
                        </div>
                        {/* <div className='infoBar123'>
                            <p className='instInfo123'>
                                Reported Date and Location are required information
                            </p>
                        </div> */}
                        {
                            !fetchedData ? <p>Loading...</p>

                                : (
                                    <div style={{ width: '8.3in', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', padding: '15px 0px' }}>
                                        <div className="mainDataEntrySection123" ref={el => (componentRef = el)} id="downloadDiv">
                                            <div className="formGeneralInfo123">
                                                <h2>अनुुसूूची ३</h2>
                                                <h2>दफा ३(५) सँँग सम्बन्धित</h2>
                                                <h2 style={{ textDecoration: 'underline' }}>भूूकम्प प्रभावितको अस्थायी आवास निर्माणका लागि अनुुदान सम्झौता-पत्र</h2>
                                            </div>
                                            <div
                                                className="datePickerForm123"
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    fontSize: '16px',
                                                }}
                                            >
                                                <span>{`मितिः ${dateFormatter(fetchedData.entryDateBs)}`}</span>
                                            </div>
                                            <div className="countData123">
                                                <div className="countDataIndividual123">
                                                    <span>{`लाभग्राही क्रम संंख्याः ${englishToNepaliNumber(fetchedData.id)}`}</span>

                                                </div>
                                                {/* <div className="countDataIndividual123">
                                                    <span>{`सम्झौता क्रमााङ्क संंख्याः ${fetchedData.id}`}</span>

                                                </div> */}
                                            </div>
                                            <div className="formDetails123">
                                                <p style={{ margin: 0 }}>
                                                    {`भूूकम्प प्रभावितको अस्थायी आवास निर्माणका लागि ${districtNameConverter(fetchedData.beneficiaryDistrict)}
                                                  जिल्ला ${municipalityNameConverter(fetchedData.beneficiaryMunicipality)} वडा नंं. ${englishToNepaliNumber(wardNameConverter(fetchedData.beneficiaryWard))} गाउँँ/टोल ${fetchedData.toleName} बस्नेे श्री ${fetchedData.grandParentName} को ${fetchedData.grandChildRelation} श्री ${fetchedData.parentName}
                                                  को ${fetchedData.childRelation} बर्ष ${englishToNepaliNumber(fetchedData.beneficiaryAge)} को लाभग्राही श्री ${fetchedData.beneficiaryNameNepali}
                                                  (यसपछि प्रथम पक्ष भनिनेे) र ${municipalityNameConverter(fetchedData.operatingMunicipality)} कार्यालय (यसपछि दोश्रो पक्ष भनिनेे) बीच देेहाय बमोजिमका शर्तहरुको अधिनमा रही भूूकम्पबाट प्रभावित
                                                  घरपरिवारलाई अस्थायी आवास निर्माण अनुुदान कार्यविधि,२०८०, बमोजिम अस्थायी आवास निर्माण गर्न यो अनुुदान
                                                  सम्झौता-पत्रमा सहीछाप गरेेका छौंं । 
                                                `}
                                                </p>
                                            </div>
                                            <div className="mainTempAddress123">
                                                <h2 style={{ textDecoration: 'underline' }}>अस्थायी आवास निर्माण हुुनेे जग्गाको विवरण</h2>
                                                <div className="tempAddress123">
                                                    <div className="tempAddressIndividualDiv123">
                                                        {`जिल्ला ${districtNameConverter(fetchedData.temporaryShelterLandDistrict)}`}
                                                    </div>
                                                    <div className="tempAddressIndividualDiv123">
                                                        {`${municipalityNameConverter(fetchedData.temporaryShelterLandMunicipality)}`}
                                                    </div>
                                                    <div className="tempAddressIndividualDiv123">
                                                        {`वडा नंं. ${englishToNepaliNumber(wardNameConverter(fetchedData.temporaryShelterLandWard))}`}
                                                    </div>
                                                    {/* <div className="tempAddressIndividualDiv123">
                                                        {`कित्ता नंं. ${englishToNepaliNumber(fetchedData.temporaryShelterLandKittaNumber)}`}
                                                    </div>
                                                    <div className="tempAddressIndividualDiv123">
                                                        {`क्षेेत्रफल ${fetchedData.temporaryShelterLandArea}`}
                                                    </div>
                                                    <div className="tempAddressIndividualDiv123">
                                                        {`नक्सा सिट नंं ${fetchedData.temporaryShelterLandMapSheetNumber}`}.
                                                    </div> */}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ flex: 1, paddingRight: '5px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <h2 style={{ textDecoration: 'underline' }}>क. प्रथम पक्ष (लाभग्राही)</h2>
                                                            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>१. व्यक्तिगत विवरण</span>
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                            {
                                                                fetchedData.beneficiaryPhoto ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={130} width={130} src={fetchedData.beneficiaryPhoto} alt="img" /> : ''
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="firstPartContainer123" style={{ marginTop: '20px' }}>
                                                        <div className="formElements123">
                                                            <div className="freeText123">
                                                                <span>{`नाम, थर नेेपालीमाः ${fetchedData.beneficiaryNameNepali}`}</span>
                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`नाम, थर अंंग्रेजीमाः ${fetchedData.beneficiaryNameEnglish}`}</span>
                                                            </div>
                                                            <div className="locationDetails123">
                                                                <div>
                                                                    <span>{`जिल्लाः ${districtNameConverter(fetchedData.beneficiaryDistrict)}`}</span>
                                                                </div>
                                                                <div>
                                                                    <span>{`गा.पा./न.पाः ${municipalityNameConverter(fetchedData.beneficiaryMunicipality)}`}</span>
                                                                </div>
                                                                <div>
                                                                    <span>{`वडा नंं. ${englishToNepaliNumber(wardNameConverter(fetchedData.beneficiaryWard))}`}</span>
                                                                </div>
                                                                <div>
                                                                    <span>{`ना.प्र.न. ${fetchedData.beneficiaryCitizenshipNumber}`}</span>
                                                                </div>
                                                                <div>
                                                                    <span>{`सम्पर्क नंं. ${englishToNepaliNumber(fetchedData.beneficiaryContactNumber)}`}</span>

                                                                </div>
                                                            </div>
                                                            {
                                                                fetchedData.isBeneficiaryAvailableToSign
                                                                    ? (
                                                                        <div>
                                                                            <p style={{ lineHeight: '30px' }}>
                                                                                सम्झौता-पत्रमा हस्ताक्षर गर्न अधिकार/मञ्जुुरी प्राप्त व्यक्तिको
                                                                                विवरण (लाभग्राही उपस्थित हुुन नसकेेको अवस्थामा मात्र)
                                                                                संंरक्षक/अधिकार प्राप्त/मञ्जुुरी प्राप्त व्यक्तिको विवरण

                                                                            </p>
                                                                            <div style={{ marginBottom: '10px' }} className="freeText123">
                                                                                <span>{`नाम, थर नेेपालीमाः ${fetchedData.beneficiaryRepresentativeNameNepali}`}</span>

                                                                            </div>
                                                                            <div className="locationDetails123">

                                                                                <div>
                                                                                    <span>{`जिल्लाः ${districtNameConverter(fetchedData.beneficiaryRepresentativeDistrict)}`}</span>


                                                                                </div>
                                                                                <div>
                                                                                    <span>{`गा.पा./न.पाः ${municipalityNameConverter(fetchedData.beneficiaryRepresentativeMunicipality)}`}</span>


                                                                                </div>
                                                                                <div>
                                                                                    <span>{`गा.पा./न.पाः ${englishToNepaliNumber(wardNameConverter(fetchedData.beneficiaryRepresentativeWard))}`}</span>

                                                                                </div>
                                                                                <div>
                                                                                    <span>{`ना.प्र.न. ${fetchedData.beneficiaryRepresentativeCitizenshipNumber}`}</span>

                                                                                </div>

                                                                            </div>
                                                                            <div className="freeText123" style={{ marginTop: '10px' }}>
                                                                                <span>{`बाजेेको नाम, थर: ${fetchedData.beneficiaryRepresentativeGrandfatherName}`}</span>


                                                                            </div>
                                                                            <div className="freeText123" style={{ marginTop: '10px' }}>
                                                                                <span>{`बाबुु/आमाको नाम, थर: ${fetchedData.beneficiaryRepresentativeParentName}`}</span>

                                                                            </div>
                                                                        </div>
                                                                    ) : ''
                                                            }


                                                        </div>

                                                    </div>
                                                    <div className="freeTextTable123" style={{ pageBreakBefore: 'always' }}>
                                                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>४. लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको औठांंछाप</span>
                                                        <table
                                                            className="lyapcheTable"
                                                            style={{
                                                                width: '96%',
                                                                border: '1px solid black',
                                                                borderCollapse: 'collapse',
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            <tr style={{ background: 'none' }}>
                                                                <th style={{
                                                                    border: '1px solid black',
                                                                    borderCollapse: 'collapse',
                                                                    textAlign: 'center',
                                                                }}
                                                                >दायाँँ
                                                                </th>
                                                                <th style={{
                                                                    border: '1px solid black',
                                                                    borderCollapse: 'collapse',
                                                                    textAlign: 'center',
                                                                }}
                                                                >बायाँँ
                                                                </th>

                                                            </tr>
                                                            <tr style={{ background: 'none' }}>
                                                                <td style={{
                                                                    border: '1px solid black',
                                                                    borderCollapse: 'collapse',
                                                                    textAlign: 'center',
                                                                    height: '150px',
                                                                    width: '200px',
                                                                }}
                                                                />
                                                                <td style={{
                                                                    border: '1px solid black',
                                                                    borderCollapse: 'collapse',
                                                                    textAlign: 'center',
                                                                    height: '150px',
                                                                    width: '200px',
                                                                }}
                                                                />

                                                            </tr>

                                                        </table>
                                                    </div>
                                                </div>
                                                <div style={{ flex: 1, paddingLeft: '5px' }}>
                                                    <div className="firstPartContainer123">
                                                        <span style={{ fontWeight: 'bold' }}>२. बैंंक/वित्तीय संंस्थामा रहेेको खाताको विवरण</span>
                                                        <div className="formElements123">
                                                            <div className="freeText123">
                                                                <span>{`खातावालाको नाम, थरः ${fetchedData.bankAccountHolderName}`}</span>
                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`खाता नम्बरः ${fetchedData.bankAccountNumber}`}</span>

                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`बैंंक/वित्तीय संंस्थाको नामः ${fetchedData.bankName}`}</span>

                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`शाखाः ${fetchedData.bankBranchName}`}</span>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="firstPartContainer123">
                                                        <span style={{ fontWeight: 'bold', lineHeight: '30px' }}>३. स्थायी ठेेगाना र नागरिकतामा उल्लिखित ठेेगाना फरक भएमा (बसाइँँसराइको विवरण उल्लेेख गर्नेे)</span>
                                                        <div className="formElements123">
                                                            <div className="freeText123">
                                                                <span>{`बसाइँँसराइ प्रमाण-पत्र नंः ${fetchedData.migrationCertificateNumber}`}</span>

                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`बसाइँँसराइको मितिः ${dateFormatter(fetchedData.migrationDateBs)}`}</span>

                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="firstPartContainer123" style={{ marginBottom: '58px' }}>
                                                        <span style={{ fontWeight: 'bold', lineHeight: '30px' }}>४. लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको औंठा छाप लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको हस्ताक्षर</span>
                                                        <div className="formElements123">
                                                            <div className="freeText123">
                                                                <span>{`मितिः ${dateFormatter(fetchedData.signedDate)}`}</span>

                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`साक्षीको नाम, थर: ${fetchedData.withnessNameNepali}`}</span>

                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{'हस्ताक्षर: .................... '}</span>

                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`लाभग्राहीसँँगको नाता: ${fetchedData.withnessRelation}`}</span>

                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`सम्पर्क नंं. ${fetchedData.withnessContactNumber}`}</span>

                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="firstPartDetails123" style={{ pageBreakBefore: 'always' }}>
                                                        <h2 style={{ textDecoration: 'underline' }}>ख. दोश्रो पक्ष</h2>
                                                        <div className="firstPartContainer123" style={{ gap: '20px' }}>
                                                            <div className="formElements123">
                                                                <div className="freeTextPart2">
                                                                    (<input type="text" disabled className="inputClassName123" style={{ width: '48%' }} />
                                                                    <span>कार्यपालिका कार्यालयको छाप</span>)
                                                                </div>
                                                                <div className="freeText123">
                                                                    (

                                                                    <span>{`${municipalityNameConverter(fetchedData.operatingMunicipality)}`}</span>
                                                                    )
                                                                </div>
                                                                <div className="freeText123">
                                                                    <span>हस्ताक्षरः ...........................................</span>

                                                                </div>
                                                                <div className="freeText123">
                                                                    <span>{`नामः ${fetchedData.operatingMunicipalityOfficerName}`}</span>
                                                                </div>
                                                                <div className="freeText123">
                                                                    <span>पदः प्रमुुख प्रशासकीय अधिकृृत</span>

                                                                </div>
                                                                <div className="freeText123">
                                                                    <span>{`मितिः ${dateFormatter(fetchedData.operatingMunicipalitySignedDate)}`}</span>

                                                                </div>


                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h2>प्रथम पक्ष लाभग्राहीलेे मञ्जुुर गरेेका शर्तहरुः</h2>
                                                <div>
                                                    <h3> {`${englishToNepaliNumber(1)}. म/मेेरो परिवारका लाागि अस्थायी आवास निर्माण गर्न मेेरो/मेेरो परिवारको नाममा उपयुुक्त र पर्याप्त घडेेरी छ ।`}</h3>
                                                </div>
                                                <div>
                                                    <h3> {`${englishToNepaliNumber(2)}. मैैलेे भूूकम्पबाट प्राभावित घरपरिवारलाई अस्थायी आवास निर्माण अनुुदान कार्यविधि, २०८० एबंं यस सम्झौता-पत्रमा
                                                        उल्लेेखित शर्त, मापदण्ड, प्रविधि र गुुणस्तर अनुुरुप बनाउनेे छुु ।`}
                                                    </h3>
                                                </div>
                                                <div>
                                                    <h3>  {`${englishToNepaliNumber(3)}. निर्माण सामग्रीको खरिद गर्नेे तथा डकर्मी, सिकर्मी, प्लम्बर, इलेेक्ट्रिसियन, तथा अन्य निर्माण कार्य गर्न तथा श्रमिक
                                                        जुुटाउनेे र काममा लगाउनेे जिम्मेेवारी मेेरो हुुनेेछ ।`}
                                                    </h3>
                                                </div>
                                                <div>
                                                    <h3> {`${englishToNepaliNumber(4)}. मैैलेे प्राप्त गर्नेे अस्थायी आवास निर्माण अनुुदान रकम अस्थायी आवास निर्माणका लागि मात्र गर्नेेछुु ।`}</h3>
                                                </div>
                                                <div>
                                                    <h3>
                                                        {`${englishToNepaliNumber(5)}. उपलब्ध अनुुदान नपुुग भएमा अतिरिक्त ‍‍लागत म आफैँँलेे थप गरी अस्थायी आवास निर्माण सम्पन्न गर्नेेछुु।`}
                                                    </h3>
                                                </div>
                                                <div>
                                                    <h3>
                                                        {`${englishToNepaliNumber(6)}. परिवारको व्यक्तिगत सरसफााई ध्यानमा राखी संंरचना निर्माण गर्नेेछुु।`}
                                                    </h3>
                                                </div>

                                            </div>
                                            <div>
                                                <h3>दोश्रो पक्ष (स्थानीय तह) लेे मञ्जुुरी गरेेका शर्तहरुः</h3>
                                                <div>
                                                    <h3>
                                                        {`${englishToNepaliNumber(1)}. प्रथम पक्षबाट उल्लिखित शर्तहरु पूूरा भएको अवस्थामा तोकिए अनुुसारको अस्थायी आवास निर्माण अनुुदान सरकारको
                                                        तर्फ बाट बैंंक मार्फत उपलब्ध गराइनेे छ ।`}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div>
                                                <h3>प्राप्त कागजातहरुः</h3>
                                                {
                                                    fetchedData.identityDocument ? (
                                                        <div>
                                                            <h3> {`${englishToNepaliNumber(1)}. नागरिकता प्रमाण-पत्रको प्रतिलिपि वा राष्ट्रिय परिचयपत्रको प्रतिलिपि वा मतदाता परिचयपत्रको प्रतिलिपि`}</h3>
                                                            {/* <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                                <span style={{ fontSize: '20px' }}>फोटो:</span>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                                    {
                                                                        fetchedData.identityDocument ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.identityDocument} alt="img" /> : ''
                                                                    }
                                                                </div>


                                                            </div> */}
                                                        </div>
                                                    ) : ''
                                                }
                                                {
                                                    fetchedData.infrastructurePhoto ? (
                                                        <div>
                                                            <h3> {`${englishToNepaliNumber(2)}. पूूर्ण रूपलेे क्षति भएको वा आंंशिक क्षति भएता पनि बसोवास गर्न योग्य नरहेेको संंरचनाको फोटो`}
                                                            </h3>
                                                            {/* <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                                <span style={{ fontSize: '20px' }}>फोटो:</span>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                                    {
                                                                        fetchedData.infrastructurePhoto ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.infrastructurePhoto} alt="img" /> : ''
                                                                    }
                                                                </div>


                                                            </div> */}
                                                        </div>
                                                    ) : ''

                                                }

                                                {
                                                    fetchedData.applicationDocument ? (
                                                        <div>
                                                            <h3> {`${englishToNepaliNumber(3)}. घरमूूली उपस्थित नभएको अवस्थामा, मञ्जुुरीनामा सहितको निवेेदन`}
                                                            </h3>
                                                            {/* <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                                <span style={{ fontSize: '20px' }}>फोटो:</span>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                                    {
                                                                        fetchedData.applicationDocument ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.applicationDocument} alt="img" /> : ''
                                                                    }
                                                                </div>


                                                            </div> */}
                                                        </div>
                                                    ) : ''

                                                }
                                                {
                                                    fetchedData.policeReport ? (
                                                        <div>
                                                            <h3>{`${englishToNepaliNumber(fetchedData.applicationDocument ? 4 : 3)}. प्रहरीको मुुचुल्का`}</h3>
                                                            {/* <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                                <span style={{ fontSize: '20px' }}>फोटो:</span>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                                    {
                                                                        fetchedData.policeReport ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.policeReport} alt="img" /> : ''
                                                                    }
                                                                </div>


                                                            </div> */}
                                                        </div>
                                                    ) : ''

                                                }


                                            </div>
                                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', pageBreakBefore: 'always' }}>
                                                <h3>प्राप्त कागजातका फोटोहरुः</h3>

                                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                                    <h3> {`${englishToNepaliNumber(1)}. नागरिकता प्रमाण-पत्रको प्रतिलिपि वा राष्ट्रिय परिचयपत्रको प्रतिलिपि वा मतदाता परिचयपत्रको प्रतिलिपि`}</h3>
                                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                        {/* <span style={{ fontSize: '20px' }}>फोटो:</span> */}
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                            {
                                                                fetchedData.identityDocument ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.identityDocument} alt="img" /> : ''
                                                            }
                                                        </div>


                                                    </div>
                                                </div>


                                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                                    <h3> {`${englishToNepaliNumber(2)}. पूूर्ण रूपलेे क्षति भएको वा आंंशिक क्षति भएता पनि बसोवास गर्न योग्य नरहेेको संंरचनाको फोटो`}
                                                    </h3>
                                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                        {/* <span style={{ fontSize: '20px' }}>फोटो:</span> */}
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                            {
                                                                fetchedData.infrastructurePhoto ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.infrastructurePhoto} alt="img" /> : ''
                                                            }
                                                        </div>


                                                    </div>
                                                </div>
                                                {
                                                    fetchedData.applicationDocument


                                                        ? (
                                                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                                                <h3> {`${englishToNepaliNumber(3)}. घरमूूली उपस्थित नभएको अवस्थामा, मञ्जुुरीनामा सहितको निवेेदन`}
                                                                </h3>
                                                                <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                                    {/* <span style={{ fontSize: '20px' }}>फोटो:</span> */}
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                                        {
                                                                            fetchedData.applicationDocument ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.applicationDocument} alt="img" /> : ''
                                                                        }
                                                                    </div>


                                                                </div>

                                                            </div>
                                                        )
                                                        : ''}


                                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                                    <h3>{`${englishToNepaliNumber(fetchedData.applicationDocument ? 4 : 3)}. प्रहरीको मुुचुल्का`}</h3>
                                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                        {/* <span style={{ fontSize: '20px' }}>फोटो:</span> */}
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                            {
                                                                fetchedData.policeReport ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.policeReport} alt="img" /> : ''
                                                            }
                                                        </div>


                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                        <span className="ValidationErrors123">{validationError}</span>
                                        <div className="saveOrAddButtons123">
                                            <ReactToPrint
                                                trigger={() => <button className="submitButtons123" onClick={handlePrint} type="submit">{loadPrint ? 'Printing...' : 'प्रिन्ट'}</button>}
                                                content={() => componentRef}

                                            />

                                        </div>
                                    </div>
                                )
                        }
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
            TemporaryShelterPreview,
        ),
    ),
);
