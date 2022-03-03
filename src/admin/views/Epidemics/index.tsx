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
import { SetEpidemicsPageAction } from '#actionCreators';

import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';


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
    wards } = props;

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

    useEffect(() => {
        console.log('test', initialProvinceCenter);
    }, [initialProvinceCenter]);

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
        navigate('/admin/epidemics/epidemics-data-table');
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
        navigate('/admin/epidemics/epidemics-data-table');
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
            const data = { ...incidentFormDataInitial,
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
                wards: [editWardId] };
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
                props.requests.incidentUpdate.do({ id: uniqueId, body: data });
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

            const deadMale = { ...deadMaleInitial,
                loss: editLossId,
                count: deadFormMale };
            props.requests.lossDeadMaleUpdate.do({ id: obj.deadMale, body: deadMale });
            // dispatch(lossPeopleUpdateData(obj.deadMale, deadMale));
            const deadFemale = { ...deadFemaleInitial,
                loss: editLossId,
                count: deadFormFemale };
            props.requests.lossDeadFemaleUpdate.do({ id: obj.deadFemale, body: deadFemale });
            // dispatch(lossPeopleUpdateData(obj.deadFemale, deadFemale));
            const deadOther = { ...deadOtherInitial,
                loss: editLossId,
                count: deadFormOther };
            props.requests.lossDeadOtherUpdate.do({ id: obj.deadOther, body: deadOther });
            // dispatch(lossPeopleUpdateData(obj.deadOther, deadOther));
            const deadDisabled = { ...deadDisabledInitial,
                loss: editLossId,
                count: deadFormDisabled };
            props.requests.lossDeadDisabledUpdate.do({ id: obj.deadDisabled, body: deadDisabled });
            // dispatch(lossPeopleUpdateData(obj.deadDisabled, deadDisabled));
            const injuredMale = { ...injuredMaleInitial,
                loss: editLossId,
                count: injuredFormMale };
            props.requests.lossInjuredMaleUpdate.do({ id: obj.injuredMale, body: injuredMale });
            // dispatch(lossPeopleUpdateData(obj.injuredMale, injuredMale));
            const injuredFemale = { ...injuredFemaleInitial,
                loss: editLossId,
                count: injuredFormFemale };
            props.requests.lossInjuredFemaleUpdate.do({ id: obj.injuredFemale, body: injuredFemale });
            // dispatch(lossPeopleUpdateData(obj.injuredFemale, injuredFemale));
            const injuredOther = { ...injuredOtherInitial,
                loss: editLossId,
                count: injuredFormOther };
            props.requests.lossInjuredOtherUpdate.do({ id: obj.injuredOther, body: injuredOther });
            // dispatch(lossPeopleUpdateData(obj.injuredOther, injuredOther));
            const injuredDisabled = { ...injuredDisabledInitial,
                loss: editLossId,
                count: injuredFormDisabled };
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
            const data = { ...incidentFormDataInitial,
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
                wards: [wardId] };
            props.requests.incident.do({ body: data });
            const deadMale = { ...deadMaleInitial,
                loss: lossID,
                count: deadFormMale };
            props.requests.lossDeadMale.do({ body: deadMale });
            const deadFemale = { ...deadFemaleInitial,
                loss: lossID,
                count: deadFormFemale };
            props.requests.lossDeadFemale.do({ body: deadFemale });
            const deadOther = { ...deadOtherInitial,
                loss: lossID,
                count: deadFormOther };
            props.requests.lossDeadOther.do({ body: deadOther });
            const deadDisabled = { ...deadDisabledInitial,
                loss: lossID,
                count: deadFormDisabled };
            props.requests.lossDeadDisabled.do({ body: deadDisabled });
            const injuredMale = { ...injuredMaleInitial,
                loss: lossID,
                count: injuredFormMale };
            props.requests.lossInjuredMale.do({ body: injuredMale });
            const injuredFemale = { ...injuredFemaleInitial,
                loss: lossID,
                count: injuredFormFemale };
            props.requests.lossInjuredFemale.do({ body: injuredFemale });
            const injuredOther = { ...injuredOtherInitial,
                loss: lossID,
                count: injuredFormOther };
            props.requests.lossInjuredOther.do({ body: injuredOther });
            const injuredDisabled = { ...injuredDisabledInitial,
                loss: lossID,
                count: injuredFormDisabled };
            props.requests.lossInjuredDisabled.do({ body: injuredDisabled });
            setAdded(true);
        }
        if (lossPeopleError || incidentError || lossError) {
            setError(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lossID]);
    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            <MenuCommon layout="common" currentPage={'Epidemics'} />
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

                <h1 className={styles.header}>Epidemics Data Structure</h1>
                <p className={styles.dataReporting}>Data Reporting</p>
                <div className={styles.twoSections}>
                    <div className={styles.reportingStatus}>
                        <div className={styles.reporting}>
                            <img className={styles.listSvg} src={ListSvg} alt="" />
                            <p className={styles.reportingText}>Epidemics Reporting</p>
                            <p className={styles.greenCircle} />
                        </div>
                    </div>
                    <div className={styles.mainForm}>
                        <div className={styles.generalInfoAndTableButton}>
                            <h1 className={styles.generalInfo}>General Information</h1>
                            <button className={styles.viewDataTable} type="button" onClick={handleTableButton}>View Data Table</button>
                        </div>
                        <div className={styles.shortGeneralInfo}>
                            <img className={styles.ideaIcon} src={Ideaicon} alt="" />
                            <p className={styles.ideaPara}>
                                    The epidemics form consists of the details of the epidemics,
                                    geographical information of the affected area, and the
                                    casualty details disaggregated by gender and disability.

                            </p>
                        </div>
                        <div className={styles.infoBar}>
                            <p className={styles.instInfo}>
                                Reported Date and Location are required information
                            </p>
                        </div>
                        <div className={styles.mainDataEntrySection}>
                            <h3 className={styles.formGeneralInfo}>General Information</h3>
                            <span className={styles.ValidationErrors}>{validationError}</span>
                            <div className={styles.twoInputSections}>
                                <TextField
                                    variant="outlined"
                                    className={styles.materialUiInput}
                                    value={uniqueId}
                                    onChange={e => setuniqueId(e.target.value)}
                                    id="outlined-basic"
                                    label="Unique Id"
                                    disabled
                                />
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Reported Date"
                                        value={reportedDate}
                                        onChange={(newValue) => {
                                            setReportedDate(newValue);
                                        }}
                                        renderInput={params => (
                                            <TextField
                                                variant="outlined"
                                                error={dateError}
                                                helperText={dateError ? 'This field is required' : null}
                                                className={styles.materialUiInput}
                                                {...params}
                                                required
                                            />
                                        )}
                                    />
                                </LocalizationProvider>

                            </div>
                            <TextField
                                required
                                id="outlined-basic"
                                label="Hazard Inducer"
                                variant="outlined"
                                className={styles.hazardInducer}
                                value={cause}
                                onChange={e => setCause(e.target.value)}
                            />

                            <div className={styles.infoBar}>
                                <p className={styles.instInfo}>
                                    <span style={{ color: '#003572' }} />
                                    {' '}
                                    {' '}
                                    Geographical Information on the area
                                </p>
                            </div>
                            <div className={styles.fourInputSections}>
                                <FormControl fullWidth>
                                    <InputLabel id="province-label">Province</InputLabel>
                                    <Select
                                        labelId="province"
                                        id="province-select"
                                        value={provinceName}
                                        label="Provinvce"
                                        onChange={e => setprovinceName(e.target.value)}
                                    >
                                        {provinces && provinces.map(item => (
                                            <MenuItem
                                                key={item.title}
                                                value={item.title}
                                            >
                                                {item.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel id="district-label">District</InputLabel>
                                    <Select
                                        labelId="district"
                                        id="district-select"
                                        value={districtName}
                                        label="District"
                                        onChange={e => setdistrictName(e.target.value)}
                                    >
                                        {districts && districts.filter(
                                            item => item.province === provinceId,
                                        ).map(
                                            item => (
                                                <MenuItem
                                                    key={item.title}
                                                    value={item.title}
                                                >
                                                    {item.title}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="municipality-label">Municipality</InputLabel>
                                    <Select
                                        labelId="municipality"
                                        id="munnicipality-select"
                                        value={municipalityName}
                                        label="Municipality"
                                        onChange={e => setmunicipalityName(e.target.value)}
                                    >
                                        {municipalities && municipalities.filter(
                                            item => item.district === districtId,
                                        ).map(
                                            item => (
                                                <MenuItem
                                                    key={item.title}
                                                    value={item.title}
                                                >
                                                    {item.title}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="ward-label">Ward</InputLabel>
                                    <Select
                                        labelId="ward"
                                        id="ward-select"
                                        value={wardName}
                                        label="Ward"
                                        onChange={e => setwardName(e.target.value)}
                                    >
                                        {wards && wards.filter(item => item.municipality === municipalityId)
                                            .map(item => Number(item.title)).sort((a, b) => a - b)
                                            .map(item => (
                                                <MenuItem key={item} value={item}>
                                                    {item}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <TextField

                                className={styles.hazardInducer}
                                id="outlined-basic"
                                label="Local Address(Kindly Specify)"
                                variant="outlined"
                                value={streetAddress}
                                onChange={e => setStreetAddress(e.target.value)}
                            />
                            <div className={styles.twoInputSections}>
                                <TextField
                                    variant="outlined"
                                    className={styles.materialUiInput}
                                    value={lattitude}
                                    onChange={e => setLattitude(e.target.value)}
                                    error={latError}
                                    helperText={latError ? 'This field is required' : null}
                                    id="outlined-basic"
                                    label="Lattitude"
                                />

                                <TextField
                                    variant="outlined"
                                    className={styles.materialUiInput}
                                    value={longitude}
                                    onChange={e => setLongitude(e.target.value)}
                                    error={longError}
                                    helperText={longError ? 'This field is required' : null}
                                    id="outlined-basic"
                                    label="Longitude"
                                />

                            </div>
                            <Map
                                centriodsForMap={centriodsForMap}
                                initialProvinceCenter={initialProvinceCenter}
                                initialDistrictCenter={initialDistrictCenter}
                                initialMunCenter={initialMunCenter}
                            />
                            <div className={styles.infoBarCasuality}>
                                <p className={styles.instInfo}>
                                    <span style={{ color: '#003572' }} />
                                    Casualty Statistics of the area
                                </p>
                            </div>


                            <div className={styles.mycontainer}>
                                <div className={styles.innerContainer}>
                                    <div className={styles.label}>Dead</div>
                                    <TextField
                                        className={styles.deadandaffected}
                                        error={dmError}
                                        helperText={dmError ? 'This field is required' : null}
                                        variant="outlined"
                                        value={deadFormMale}

                                        onChange={e => setDeadMale(e.target.value)}
                                        id="outlined-basic"
                                        label="Total no. of male"
                                    />
                                    <TextField
                                        className={styles.deadandaffected}
                                        error={dfError}
                                        helperText={dfError ? 'This field is required' : null}
                                        value={deadFormFemale}
                                        onChange={e => setDeadFemale(e.target.value)}
                                        id="outlined-basic"
                                        label="Total no. of female"
                                        variant="outlined"
                                    />
                                    <TextField
                                        className={styles.deadandaffected}
                                        value={deadFormOther}
                                        error={doError}
                                        helperText={doError ? 'This field is required' : null}
                                        onChange={e => setDeadOther(e.target.value)}
                                        id="outlined-basic"
                                        label="Total no. of others"
                                        variant="outlined"

                                    />
                                    <TextField
                                        className={styles.deadandaffected}
                                        value={deadFormDisabled}
                                        error={ddError}
                                        helperText={ddError ? 'This field is required' : null}
                                        onChange={e => setDeadDisabled(e.target.value)}
                                        id="outlined-basic"
                                        label="Total no. of disabled"
                                        variant="outlined"
                                    />
                                </div>
                                <div className={styles.innerContainer}>
                                    <div className={styles.label}>Affected</div>
                                    <TextField
                                        className={styles.deadandaffected}
                                        value={injuredFormMale}
                                        error={amError}
                                        helperText={amError ? 'This field is required' : null}
                                        onChange={e => setInjuredMale(e.target.value)}
                                        id="outlined-basic"
                                        label="Total no. of male"
                                        variant="outlined"
                                    />
                                    <TextField
                                        className={styles.deadandaffected}
                                        value={injuredFormFemale}
                                        error={afError}
                                        helperText={afError ? 'This field is required' : null}
                                        onChange={e => setInjuredFemale(e.target.value)}
                                        id="outlined-basic"
                                        label="Total no. of female"
                                        variant="outlined"
                                    />
                                    <TextField
                                        className={styles.deadandaffected}
                                        value={injuredFormOther}
                                        error={aoError}
                                        helperText={aoError ? 'This field is required' : null}
                                        onChange={e => setInjuredOther(e.target.value)}
                                        id="outlined-basic"
                                        label="Total no. of others"
                                        variant="outlined"
                                    />
                                    <TextField
                                        className={styles.deadandaffected}
                                        value={injuredFormDisabled}
                                        error={adError}
                                        helperText={adError ? 'This field is required' : null}
                                        onChange={e => setInjuredDisabled(e.target.value)}
                                        id="outlined-basic"
                                        label="Total no. of disabled"
                                        variant="outlined"
                                    />
                                </div>
                            </div>
                            <div className={styles.infoBarCasuality}>
                                <p className={styles.instInfo}>
                                    <span style={{ color: '#003572' }} />
                                        Verification of the data
                                </p>
                            </div>
                            <div className={styles.checkBoxArea}>
                                <p className={styles.verifiedOrApproved}>01.Verified</p>
                                <div className={styles.verified}>

                                    <input
                                        type="checkbox"
                                        name="verifiedCheck"
                                        id="verified"
                                        checked={verified}
                                        onChange={e => handleVerifiedChange()}

                                    />

                                    <InputLabel htmlFor="verified">Yes</InputLabel>


                                </div>
                                <div className={styles.notVerified}>
                                    <input
                                        type="checkbox"
                                        name="verifiedCheck"
                                        id="notVerified"
                                        checked={notVerified}
                                        onChange={e => handleNotVerifiedChange()}


                                    />
                                    <InputLabel htmlFor="notVerified">No</InputLabel>
                                </div>
                            </div>
                            <div className={styles.checkBoxArea}>

                                <TextField
                                    className={styles.hazardInducer}
                                    id="outlined-basic"
                                    label="Verification Message"
                                    value={verificationMessage}
                                    onChange={e => setVerificationMessage(e.target.value)}

                                    variant="outlined"
                                />
                                <p className={styles.verifiedOrApproved}>02.Approved</p>

                                <div className={styles.verified}>
                                    <input
                                        type="checkbox"
                                        name="verifiedCheck"
                                        id="verified"
                                        checked={approved}
                                        onChange={handleApprovedChange}

                                    />

                                    <InputLabel htmlFor="verified">Yes</InputLabel>
                                </div>
                                <div className={styles.notVerified}>
                                    <input
                                        type="checkbox"
                                        name="verifiedCheck"
                                        id="notVerified"
                                        checked={notApproved}
                                        onChange={handleNotApprovedChange}

                                    />
                                    <InputLabel htmlFor="notVerified">No</InputLabel>
                                </div>
                            </div>
                            <div className={styles.saveOrAddButtons}>
                                <button className={styles.submitButtons} onClick={handleEpidemicFormSubmit} type="submit">{uniqueId ? 'Update' : 'Save and New' }</button>
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
            Epidemics,
        ),
    ),
);
