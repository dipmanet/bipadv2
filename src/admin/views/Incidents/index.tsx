/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
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

import Loader from 'react-loader';
import styles from './styles.module.scss';
import ListSvg from '../../resources/list.svg';
import Ideaicon from '../../resources/ideaicon.svg';
import Page from '#components/Page';
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

import {
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
    wardsSelector,
    epidemicsPageSelector,
    userSelector,
} from '#selectors';
import { setCountryListAction, SetEpidemicsPageAction } from '#actionCreators';

import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import General from './General';
import PeopleLoss from './PeopleLoss';
import FamilyLoss from './FamilyLoss';
import InfrastructureLoss from './InfrastructureLoss';
import AgricultureLoss from './AgricultureLoss';
import LivestockLoss from './LivestockLoss';


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
    countryListFetch: {
        url: '/country/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, props, params }) => {
            if (params && params.setCountryList) {
                params.setCountryList(response.results);
            }
        },
    },
    infrastructureTypeListFetch: {
        url: '/infrastructure-type/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, props, params }) => {
            if (params && params.setInfrastructureType) {
                params.setInfrastructureType(response.results);
            }
        },
    },
    agricultureTypeListFetch: {
        url: '/agriculture-type/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, props, params }) => {
            if (params && params.setAgricultureType) {
                params.setAgricultureType(response.results);
            }
        },
    },
    liveStockTypeListFetch: {
        url: '/livestock-type/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, props, params }) => {
            if (params && params.setLiveStockType) {
                params.setLiveStockType(response.results);
            }
        },
    },
    infrastructureUnitListFetch: {
        url: '/infrastructure-unit/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, props, params }) => {
            if (params && params.setInfrastructureUnit) {
                params.setInfrastructureUnit(response.results);
            }
        },
    },
    resourceListFetch: {
        // url: '/resource/',
        url: ({ params }) => `/resource/?ward=${params.wardId}`,
        method: methods.GET,
        onMount: false,
        onSuccess: ({ response, props, params }) => {
            if (params && params.setResource) {
                params.setResource(response.results);
            }
        },
    },
    hazardListFetch: {
        url: '/hazard/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, props, params }) => {
            if (params && params.setHazardList) {
                params.setHazardList(response.results);
            }
            params.loadingCondition(false);
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
        onSuccess: ({ response, props, params }) => {
            props.setEpidemicsPage({ successMessage: 'Incident added' });
            if (params && params.handleNext) {
                params.handleNext(2);
            }
        },
        onFailure: ({ error, props, params }) => {
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    incidentError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props, params }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
                    incidentError: 'Some problem occurred',
                });
            }
        },
    },
    incidentUpdate: {
        url: ({ params }) => `/incident/${params.id}/`,
        method: methods.PATCH,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            props.setEpidemicsPage({ successMessage: 'Incident Updated' });
            if (params && params.update) {
                params.update(true);
                params.handleLoader();
            }
            if (params && params.handleNext) {
                params.handleNext(2);
            }
        },
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                props.setEpidemicsPage({
                    incidentUpdateError: 'Invalid Location on map,please select province,district,municipality and ward and enter respective location on map.',
                });
            }
        },
        onFatal: ({ props, params }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
                    incidentUpdateError: 'Some problem occurred',
                });
            }
        },
    },
    incidentPatch: {
        url: ({ params }) => `/incident/${params.id}/`,
        method: methods.PATCH,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            props.setEpidemicsPage({ successMessage: 'Incident verified' });
            if (params && params.update) {
                params.update(true);
                params.handleLoader();
            }
            if (params && params.handleNext) {
                params.handleNext(2);
            }
        },
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    incidentError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props, params }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
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
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
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
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
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
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
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
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
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
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
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
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
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
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
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
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
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
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
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
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
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
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
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
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
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
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
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
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
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
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
    },
    lossInjuredDisabledUpdate: {
        url: ({ params }) => `/loss-people/${params.id}/`,
        method: methods.PUT,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            props.setEpidemicsPage({ successMessage: 'Loss people added' });
            if (params && params.update) {
                params.update(true);
                params.handleLoader();
            }
        },
        onFailure: ({ error, props, params }) => {
            if (params && params.errorOccur) {
                params.errorOccur(false);
            }
            if (params && params.update) {
                params.update(true);
                params.handleLoader();
            }
            if (props && props.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                props.setEpidemicsPage({
                    lossPeopleError: 'Some problem occurred',
                });
            }
        },
        onFatal: ({ props }) => {
            if (props && props.setEpidemicsPage) {
                props.setEpidemicsPage({
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


const Epidemics = (props) => {
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
    const [deadFormMale, setDeadMale] = useState(0);
    const [deadFormFemale, setDeadFemale] = useState(0);
    const [deadFormOther, setDeadOther] = useState(0);
    const [deadFormDisabled, setDeadDisabled] = useState(0);
    const [injuredFormMale, setInjuredMale] = useState(0);
    const [injuredFormFemale, setInjuredFemale] = useState(0);
    const [injuredFormOther, setInjuredOther] = useState(0);
    const [injuredFormDisabled, setInjuredDisabled] = useState(0);
    const [missingMale, setMissingMale] = useState(0);
    const [missingFemale, setMissingFemale] = useState(0);
    const [missingOther, setMissingOther] = useState(0);
    const [missingDisabled, setMissingDisabled] = useState(0);
    const [totalEstimatedLoss, setTotalEstimatedLoss] = useState(0);
    const [agricultureEconomicLoss, setAgricultureEconomicLoss] = useState(0);
    const [infrastructureEconomicLoss, setInfrastructureEconomicLoss] = useState(0);
    const [infrastructureDestroyed, setInfrastructureDestroyed] = useState(0);
    const [houseDestroyed, setHouseDestroyed] = useState(0);
    const [houseAffected, setHouseAffected] = useState(0);
    const [livestockDestroyed, setLivestockDestroyed] = useState(0);
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
    const [hazardError, setHazardError] = useState(false);
    const [dmError, setdmError] = useState(false);
    const [dfError, setdfError] = useState(false);
    const [doError, setdoError] = useState(false);
    const [ddError, setddError] = useState(false);
    const [amError, setamError] = useState(false);
    const [afError, setafError] = useState(false);
    const [aoError, setaoError] = useState(false);
    const [adError, setadError] = useState(false);
    const [teError, setteError] = useState(false);
    const [aeError, setaeError] = useState(false);
    const [ieError, setieError] = useState(false);
    const [idError, setidError] = useState(false);
    const [hdError, sethdError] = useState(false);
    const [haError, sethaError] = useState(false);
    const [ldError, setldError] = useState(false);
    // const [formError, setFormError] = useState(ErrorObj);

    const [initialProvinceCenter, setinitialProvinceCenter] = useState([]);
    const [initialDistrictCenter, setinitialDistrictCenter] = useState([]);
    const [initialMunCenter, setinitialMunCenter] = useState([]);
    const [disableMapFilter, setDisableMapFilter] = useState(true);

    const [isEditedIncident, setIsEditedIncident] = useState(false);
    const [errorOccured, setErrorOccured] = useState(false);
    const [loader, setLoader] = useState(false);
    const [hazardList, setHazardList] = useState([]);
    const [selectedHazardName, setSelectedHazardName] = useState('');
    const [selectedHazardId, setSelectedHazardId] = useState('');
    const [countryList, setCountryList] = useState([]);
    const [infrastructureType, setInfrastructureType] = useState([]);
    const [infrastructureUnit, setInfrastructureUnit] = useState([]);
    const [resource, setResource] = useState([]);
    const [agricultureType, setAgricultureType] = useState([]);
    const [liveStockType, setLiveStockType] = useState([]);
    const [modulePage, setmodulePage] = useState(1);
    const [isLossDataUpdated, setIsLossDataUpdated] = useState(false);
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
        epidemmicsPage, requests: { hazardListFetch, countryListFetch, infrastructureTypeListFetch,
            infrastructureUnitListFetch, resourceListFetch, agricultureTypeListFetch, liveStockTypeListFetch } } = props;


    const progressBar = (moduleNo, div) => {
        if (div <= moduleNo) {
            return true;
        }
        return false;
    };


    useEffect(() => {
        hazardListFetch.do({ setHazardList });
        countryListFetch.do({ setCountryList });
        infrastructureTypeListFetch.do({ setInfrastructureType });
        infrastructureUnitListFetch.do({ setInfrastructureUnit });
        agricultureTypeListFetch.do({ setAgricultureType });
        liveStockTypeListFetch.do({ setLiveStockType });
    }, []);

    const handleSelectedHazard = (e) => {
        setSelectedHazardName(e.target.value);
        const hazardId = hazardList.find(i => i.title === e.target.value).id;
        setSelectedHazardId(hazardId);
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
        setDeadMale(0);
        setDeadFemale(0);
        setDeadOther(0);
        setDeadDisabled(0);
        setInjuredMale(0);
        setInjuredFemale(0);
        setInjuredOther(0);
        setInjuredDisabled(0);
        setverified(false);
        setNotVerified(false);
        setApproved(false);
        setNotApproved(false);
        setVerificationMessage('');
        setSelectedHazardName('');
        setSelectedHazardId('');
        setTotalEstimatedLoss(0);
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
            setDisableMapFilter(true);
            if (isEditedIncident) {
                setdistrictId(0);
                setmunicipalityId(0);
                setwardId(0);
                setEditWardId(0);
                setdistrictName('');
                setmunicipalityName('');
                setwardName('');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinceName]);


    useEffect(() => {
        const district = districts.filter(
            item => item.title === districtName,
        ).map(item => item.id)[0];
        if (districtName) {
            setdistrictId(district);
            setDisableMapFilter(true);
            if (isEditedIncident) {
                setmunicipalityId(0);
                setwardId(0);
                setEditWardId(0);
                setmunicipalityName('');
                setwardName('');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [districtName]);

    useEffect(() => {
        const municipality = municipalities.filter(
            item => item.title === municipalityName,
        ).map(item => item.id)[0];
        if (municipalityName) {
            setmunicipalityId(municipality);
            setDisableMapFilter(true);
            if (isEditedIncident) {
                setwardId(0);
                setEditWardId(0);
                setwardName('');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [municipalityName]);

    useEffect(() => {
        if (provinceId) {
            const temp = provinces.filter(item => item.id === provinceId)
                .map(item => item.centroid.coordinates)[0];

            setprovinceCentriodForMap(temp);
            setdistrictCentriodForMap(null);
            setmunicipalityCentriodForMap(null);
            setwardCentriodForMap(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinceId]);
    useEffect(() => {
        if (districtId) {
            const temp = districts.filter(item => item.id === districtId)
                .map(item => item.centroid.coordinates)[0];

            setdistrictCentriodForMap(temp);
            setmunicipalityCentriodForMap(null);
            setwardCentriodForMap(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [districtId]);
    useEffect(() => {
        if (municipalityId) {
            const temp = municipalities.filter(item => item.id === municipalityId)
                .map(item => item.centroid.coordinates)[0];

            setmunicipalityCentriodForMap(temp);
            setwardCentriodForMap(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [municipalityId]);
    useEffect(() => {
        if (wardId) {
            const temp = wards.filter(item => item.id === wardId)
                .map(item => item.centroid.coordinates)[0];

            setwardCentriodForMap(temp);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wardId]);

    useEffect(() => {
        const id = wards.filter(item => item.municipality === municipalityId)
            .filter(item => item.title === String(wardName)).map(item => item.id)[0];

        if (wardName) {
            setwardId(id);
            setEditWardId(id);
            setDisableMapFilter(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wardName, municipalityId]);

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
        navigate('/admin/incident/incident-data-table');
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
        setErrorOccured(false);
    };
    const handleTableButton = () => {
        navigate('/admin/incident/incident-data-table');
    };
    const hazardNameSelected = (id) => {
        setSelectedHazardName(hazardList.length && id ? hazardList.find(i => i.id === id).title : '');
    };

    console.log('This is incident edit data', incidentEditData);
    useEffect(() => {
        if (incidentEditData && Object.keys(incidentEditData).length > 0) {
            setuniqueId(incidentEditData.id);
            setReportedDate(incidentEditData.reportedOn);
            setLattitude(incidentEditData.point.coordinates[1].toFixed(8));
            setLongitude(incidentEditData.point.coordinates[0].toFixed(8));
            setStreetAddress(incidentEditData.streetAddress);
            setCause(incidentEditData.cause);
            setSelectedHazardId(incidentEditData.hazard);
            hazardNameSelected(incidentEditData.hazard);
            setprovinceName(incidentEditData.wards[0].municipality.district.province.title);

            setdistrictName(incidentEditData.wards[0].municipality.district.title);
            setmunicipalityName(incidentEditData.wards[0].municipality.title);
            setwardName(incidentEditData.wards[0].title);
            setVerificationMessage(incidentEditData.verificationMessage);
            setwardId(incidentEditData.wards[0].id);
            setEditWardId(incidentEditData.wards[0].id);
            // setEditWardName(incidentEditData.wards[0].title);
            setTotalEstimatedLoss(incidentEditData.loss.estimatedLoss);
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

    console.log('This is ward id', wardId);
    console.log('This is ward edit data', editWardId);
    useEffect(() => {
        hazardNameSelected(selectedHazardId);
    }, [selectedHazardId, hazardList]);


    const handleError = () => {
        setErrorOccured(true);
    };
    const handleLoader = () => {
        setLoader(false);
    };
    const handleEpidemicFormSubmit = async () => {
        if (!reportedDate || !provinceName || !districtName || !municipalityName || !wardName
            || !lattitude || !longitude
            // || !deadFormMale || !deadFormFemale || !deadFormOther
            // || !deadFormDisabled || !injuredFormMale || !injuredFormFemale || !injuredFormOther
            // || !injuredFormDisabled
        ) {
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

            // if (!deadFormMale) {
            //     setdmError(true);
            // } else {
            //     setdmError(false);
            // }
            // if (!deadFormFemale) {
            //     setdfError(true);
            // } else {
            //     setdfError(false);
            // }
            // if (!deadFormOther) {
            //     setdoError(true);
            // } else {
            //     setdoError(false);
            // }
            // if (!deadFormDisabled) {
            //     setddError(true);
            // } else {
            //     setddError(false);
            // }
            // if (!injuredFormMale) {
            //     setamError(true);
            // } else {
            //     setamError(false);
            // }
            // if (!injuredFormFemale) {
            //     setafError(true);
            // } else {
            //     setafError(false);
            // }
            // if (!injuredFormOther) {
            //     setaoError(true);
            // } else {
            //     setaoError(false);
            // }
            // if (!injuredFormDisabled) {
            //     setadError(true);
            // } else {
            //     setadError(false);
            // }
        } else if (uniqueId) {
            setLoader(true);
            const title = `${selectedHazardName} at ${provinceName}, ${districtName}, ${municipalityName}-${wardName}`;
            const data = {
                ...incidentFormDataInitial,
                title,
                incidentOn: reportedDate,
                cause,
                verified,
                approved,
                hazard: selectedHazardId,
                reportedOn: reportedDate,
                verificationMessage,
                loss: editLossId,
                streetAddress,
                point: {
                    type: 'Point',
                    coordinates: [Number(longitude), Number(lattitude)],
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
                props.requests.incidentPatch.do({ id: uniqueId, body: verify, errorOccur: handleError });
            } else {
                props.requests.incidentUpdate.do({ id: uniqueId, body: data, errorOccur: handleError });
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
            await props.requests.lossDeadMaleUpdate.do({ id: obj.deadMale, body: deadMale, errorOccur: handleError });
            // dispatch(lossPeopleUpdateData(obj.deadMale, deadMale));
            const deadFemale = {
                ...deadFemaleInitial,
                loss: editLossId,
                count: deadFormFemale,
            };
            await props.requests.lossDeadFemaleUpdate.do({ id: obj.deadFemale, body: deadFemale, errorOccur: handleError });
            // dispatch(lossPeopleUpdateData(obj.deadFemale, deadFemale));
            const deadOther = {
                ...deadOtherInitial,
                loss: editLossId,
                count: deadFormOther,
            };
            await props.requests.lossDeadOtherUpdate.do({ id: obj.deadOther, body: deadOther, errorOccur: handleError });
            // dispatch(lossPeopleUpdateData(obj.deadOther, deadOther));
            const deadDisabled = {
                ...deadDisabledInitial,
                loss: editLossId,
                count: deadFormDisabled,
            };
            await props.requests.lossDeadDisabledUpdate.do({ id: obj.deadDisabled, body: deadDisabled, errorOccur: handleError });
            // dispatch(lossPeopleUpdateData(obj.deadDisabled, deadDisabled));
            const injuredMale = {
                ...injuredMaleInitial,
                loss: editLossId,
                count: injuredFormMale,
            };
            await props.requests.lossInjuredMaleUpdate.do({ id: obj.injuredMale, body: injuredMale, errorOccur: handleError });
            // dispatch(lossPeopleUpdateData(obj.injuredMale, injuredMale));
            const injuredFemale = {
                ...injuredFemaleInitial,
                loss: editLossId,
                count: injuredFormFemale,
            };
            await props.requests.lossInjuredFemaleUpdate.do({ id: obj.injuredFemale, body: injuredFemale, errorOccur: handleError });
            // dispatch(lossPeopleUpdateData(obj.injuredFemale, injuredFemale));
            const injuredOther = {
                ...injuredOtherInitial,
                loss: editLossId,
                count: injuredFormOther,
            };
            await props.requests.lossInjuredOtherUpdate.do({ id: obj.injuredOther, body: injuredOther, errorOccur: handleError });
            // dispatch(lossPeopleUpdateData(obj.injuredOther, injuredOther));
            const injuredDisabled = {
                ...injuredDisabledInitial,
                loss: editLossId,
                count: injuredFormDisabled,
            };
            await props.requests.lossInjuredDisabledUpdate.do({
                id: obj.injuredDisabled,
                body: injuredDisabled,
                errorOccur: handleError,
                update: setUpdated,
                handleLoader,
            });
            // dispatch(lossPeopleUpdateData(obj.injuredDisabled, injuredDisabled));
            if (lossPeopleError || incidentError || lossError || incidentUpdateError) {
                setError(true);
            }
            // setUpdated(true);
        } else {
            // dispatch(lossData(lossFormDataInitial));
            const lossFormData = {
                estimatedLoss: Number(totalEstimatedLoss),
            };
            await props.requests.loss.do({ body: lossFormData });
        }
    };

    const handleNext = (pageNo) => {
        setmodulePage(pageNo);
    };
    const handlePreview = (pageNo) => {
        setmodulePage(pageNo);
    };

    useEffect(() => {
        if (lossID && uniqueId) {
            console.log('This is ward id for final', editWardId);
            console.log('This is ward id for final', wardId);
            setLoader(true);
            const title = `${selectedHazardName} at ${provinceName}, ${districtName}, ${municipalityName}-${wardName}`;
            const data = {
                ...incidentFormDataInitial,
                title,
                incidentOn: reportedDate,
                cause,
                verified,
                approved,
                hazard: selectedHazardId,
                reportedOn: reportedDate,
                verificationMessage,
                loss: editLossId,
                streetAddress,
                point: {
                    type: 'Point',
                    coordinates: [Number(longitude), Number(lattitude)],
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
                props.requests.incidentPatch.do({
                    id: uniqueId,
                    body: verify,
                    errorOccur: handleError,
                    handleNext,
                    update: setUpdated,
                    handleLoader,
                });
            } else {
                props.requests.incidentUpdate.do({
                    id: uniqueId,
                    body: data,
                    errorOccur: handleError,
                    handleNext,
                    update: setUpdated,
                    handleLoader,
                });
            }
        } else {
            console.log('This is ward id for final', wardId);
            const title = `${selectedHazardName} at ${provinceName}, ${districtName}, ${municipalityName}-${wardName}`;
            const data = {
                ...incidentFormDataInitial,
                loss: lossID,
                title,
                incidentOn: reportedDate,
                hazard: selectedHazardId,
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
            props.requests.incident.do({ body: data, handleNext });


            setAdded(true);
        }
        if (lossPeopleError || incidentError || lossError) {
            setError(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lossID, isLossDataUpdated]);

    useEffect(() => {
        if (wardId) {
            props.requests.resourceListFetch.do({ setResource, wardId });
        }
    }, [wardId]);


    const disableMapFilterLofic = (boolean) => {
        setDisableMapFilter(boolean);
    };

    const handleProvince = (e) => {
        setprovinceName(e.target.value);
        setIsEditedIncident(true);
    };

    const handleDistrict = (e) => {
        setdistrictName(e.target.value);
        setIsEditedIncident(true);
    };

    const handleMunicipality = (e) => {
        setmunicipalityName(e.target.value);
        setIsEditedIncident(true);
    };

    const handleWard = (e) => {
        setwardName(e.target.value);
        setIsEditedIncident(true);
    };

    const handleLossDataSwitchListener = () => {
        setIsLossDataUpdated(!isLossDataUpdated);
    };
    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            <MenuCommon layout="common" currentPage={'Epidemics'} uri={uri} />
            {loader
                ? (
                    <Loader options={{
                        position: 'fixed',
                        top: '48%',
                        right: 0,
                        bottom: 0,
                        left: '48%',
                        background: 'gray',
                        zIndex: 9999,
                    }}
                    />
                ) : ''}
            <div className={styles.container}>
                {/* <Modal
                    open={added || updated}
                    title={'Thank you!'}
                    description={
                        added ? 'Your record has been added'
                            : updated && !errorOccured ? 'Your record has been updated'
                                : lossError
                                || incidentError
                                || lossPeopleError
                                || incidentUpdateError
                    }
                    handleClose={updated && !errorOccured ? handleUpdateSuccess
                        : added ? handleAddedSuccess
                            : handleErrorClose}
                /> */}

                <h1 className={styles.header}>Incident Data Structure</h1>
                <p className={styles.dataReporting}>Data Reporting</p>
                <div className={styles.twoSections}>
                    <div className={styles.reportingStatus}>
                        <div className={styles.reporting}>
                            <img className={styles.listSvg} src={ListSvg} alt="" />
                            <p className={styles.reportingText}>General Information</p>
                            <p className={progressBar(modulePage, 1) ? styles.greenCircle : styles.grayCircle} />
                        </div>
                        <div className={styles.reporting}>
                            <img className={styles.listSvg} src={ListSvg} alt="" />
                            <p className={styles.reportingText}>People Loss</p>
                            <p className={progressBar(modulePage, 2) ? styles.greenCircle : styles.grayCircle} />
                        </div>
                        <div className={styles.reporting}>
                            <img className={styles.listSvg} src={ListSvg} alt="" />
                            <p className={styles.reportingText}>Family Loss</p>
                            <p className={progressBar(modulePage, 3) ? styles.greenCircle : styles.grayCircle} />
                        </div>
                        <div className={styles.reporting}>
                            <img className={styles.listSvg} src={ListSvg} alt="" />
                            <p className={styles.reportingText}>Infrastructure Loss</p>
                            <p className={progressBar(modulePage, 4) ? styles.greenCircle : styles.grayCircle} />
                        </div>
                        <div className={styles.reporting}>
                            <img className={styles.listSvg} src={ListSvg} alt="" />
                            <p className={styles.reportingText}>Agriculture Loss</p>
                            <p className={progressBar(modulePage, 5) ? styles.greenCircle : styles.grayCircle} />
                        </div>
                        <div className={styles.reporting}>
                            <img className={styles.listSvg} src={ListSvg} alt="" />
                            <p className={styles.reportingText}>Livestock Loss</p>
                            <p className={progressBar(modulePage, 6) ? styles.greenCircle : styles.grayCircle} />
                        </div>
                    </div>
                    {modulePage === 1
                        ? (
                            <General
                                setteError={setteError}
                                handleLossDataSwitchListener={handleLossDataSwitchListener}
                                lossID={editLossId}
                                user={user}
                                validationError={validationError}
                                uniqueId={uniqueId}
                                setuniqueId={setuniqueId}
                                reportedDate={reportedDate}
                                setReportedDate={setReportedDate}
                                dateError={dateError}
                                hazardList={hazardList}
                                selectedHazardName={selectedHazardName}
                                handleSelectedHazard={handleSelectedHazard}
                                cause={cause}
                                setCause={setCause}
                                provinceName={provinceName}
                                handleProvince={handleProvince}
                                provinces={provinces}
                                districtName={districtName}
                                handleDistrict={handleDistrict}
                                districts={districts}
                                provinceId={provinceId}
                                municipalityName={municipalityName}
                                handleMunicipality={handleMunicipality}
                                municipalities={municipalities}
                                districtId={districtId}
                                wardName={wardName}
                                handleWard={handleWard}
                                wards={wards}
                                municipalityId={municipalityId}
                                streetAddress={streetAddress}
                                setStreetAddress={setStreetAddress}
                                lattitude={lattitude}
                                setLattitude={setLattitude}
                                latError={latError}
                                longitude={longitude}
                                setLongitude={setLongitude}
                                longError={longError}
                                centriodsForMap={centriodsForMap}
                                initialProvinceCenter={initialProvinceCenter}
                                initialDistrictCenter={initialDistrictCenter}
                                initialMunCenter={initialMunCenter}
                                incidentEditData={incidentEditData}
                                disableMapFilterLofic={disableMapFilterLofic}
                                disableMapFilter={disableMapFilter}
                                teError={teError}
                                totalEstimatedLoss={totalEstimatedLoss}
                                setTotalEstimatedLoss={setTotalEstimatedLoss}
                                verified={verified}
                                handleVerifiedChange={handleVerifiedChange}
                                notVerified={notVerified}
                                handleNotVerifiedChange={handleNotVerifiedChange}
                                verificationMessage={verificationMessage}
                                setVerificationMessage={setVerificationMessage}
                                approved={approved}
                                handleApprovedChange={handleApprovedChange}
                                notApproved={notApproved}
                                handleNotApprovedChange={handleNotApprovedChange}
                                handleEpidemicFormSubmit={handleEpidemicFormSubmit}
                                handleTableButton={handleTableButton}
                                handleNext={handleNext}
                                clearData={clearData}
                                setDateError={setDateError}
                                setProvinceError={setProvinceError}
                                setDistrictError={setDistrictError}
                                setMunnicipalityError={setMunnicipalityError}
                                setWardError={setWardError}
                                setLatError={setLatError}
                                setLongError={setLongError}
                                provinceError={provinceError}
                                districtError={districtError}
                                municipalityError={municipalityError}
                                wardError={wardError}
                                hazardError={hazardError}
                                setHazardError={setHazardError}
                                selectedHazardId={selectedHazardId}


                            />
                        ) : ''}
                    {modulePage === 2 ? (
                        <PeopleLoss
                            countryList={countryList}
                            handleNext={handleNext}
                        />
                    ) : ''}
                    {modulePage === 3 ? (
                        <FamilyLoss
                            handleNext={handleNext}
                            countryList={countryList}
                        />
                    ) : ''}
                    {modulePage === 4 ? (
                        <InfrastructureLoss
                            countryList={countryList}
                            infrastructureType={infrastructureType}
                            infrastructureUnit={infrastructureUnit}
                            resource={resource}
                            handleNext={handleNext}
                        />
                    ) : ''}
                    {modulePage === 5 ? (
                        <AgricultureLoss
                            countryList={countryList}
                            infrastructureType={infrastructureType}
                            infrastructureUnit={infrastructureUnit}
                            resource={resource}
                            handleNext={handleNext}
                            agricultureType={agricultureType}

                        />

                    ) : ''}
                    {modulePage === 6 ? (
                        <LivestockLoss
                            countryList={countryList}
                            infrastructureType={infrastructureType}
                            infrastructureUnit={infrastructureUnit}
                            resource={resource}
                            handleNext={handleNext}
                            agricultureType={agricultureType}
                            liveStockType={liveStockType}
                            clearData={clearData}
                        />

                    ) : ''}

                </div>
            </div>
            <Footer />

        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Epidemics,
        ),
    ),
);
