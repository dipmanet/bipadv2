/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import React, { createContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector, connect } from 'react-redux';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { DatePicker } from '@mui/lab';
import Box from '@mui/material/Box';
// import Loader from 'react-loader';
import { navigate } from '@reach/router';
import Modal from 'src/admin/components/Modal';
import styles from './styles.module.scss';
import ListSvg from '../../resources/list.svg';
import PlusSvg from '../../resources/plus.svg';
import MinusSvg from '../../resources/minus.svg';
import Ideaicon from '../../resources/ideaicon.svg';
import Map from '../Mappointpicker/index';
// import Successfullyaddeddata from '../../Components/SucessfullyAdded/index';
// import { provinceData, districtData, municipalityData, wardData, covidDataIndividual, covidDataGroup } from '../../Redux/actions';
// import { RootState } from '../../Redux/store';
// import { covidDataPutIndividualId, covidDataPutGroupId, covidDataGetClearIndividualId, covidDataGetClearGroupId } from '../../Redux/covidActions/covidActions';
import { SetCovidPageAction } from '#actionCreators';
import {
    covidPageSelector,
    userSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    wardsSelector
} from '#selectors';
import { createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { AppState } from '#types';
import { propTypes } from '#rsci/MultiSelectInput';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    covidPage: covidPageSelector(state),
    userDataMain: userSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setCovidPage: params => dispatch(SetCovidPageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    covid19IndivisualPost: {
        url: '/covid19-case/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onFailure: ({ error, params }) => {
            if (params && params.setCovidPage) {
                // TODO: handle error
                console.warn('failure', error);
                // params.setCovidPage({
                //     lossError: 'Some problem occurred',
                // });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setCovidPage) {
                // params.setCovidPage({
                //     lossError: 'Some problem occurred',
                // });
            }
        },
    },
    covid19GroupPost: {
        url: '/covid19-quarantineinfo/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onFailure: ({ error, params }) => {
            if (params && params.setCovidPage) {
                console.warn('failure', error);
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setCovidPage) {
                // params.setEpidemicsPage({
                //     lossError: 'Some problem occurred',
                // });
            }
        },
    },
    covid19IndividualPatch: {
        url: ({ params }) => `/covid19-case/${params.id}/`,
        method: methods.PATCH,
        body: ({ params }) => params && params.body,
        onFailure: ({ error, params }) => {
            if (params && params.setCovidPage) {
                // TODO: handle error
                console.warn('failure', error);
                // params.setEpidemicsPage({
                //     lossError: 'Some problem occurred',
                // });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setCovidPage) {
                // params.setEpidemicsPage({
                //     lossError: 'Some problem occurred',
                // });
            }
        },
    },
    covid19GroupPatch: {
        url: ({ params }) => `/covid19-quarantineinfo/${params.id}/`,
        method: methods.PATCH,
        body: ({ params }) => params && params.body,
        onFailure: ({ error, params }) => {
            if (params && params.setCovidPage) {
                // TODO: handle error
                console.warn('failure', error);
                // params.setEpidemicsPage({
                //     lossError: 'Some problem occurred',
                // });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setCovidPage) {
                // params.setEpidemicsPage({
                //     lossError: 'Some problem occurred',
                // });
            }
        },
    },
};

export const LngLatContext = createContext([]);

const Covid = (props) => {
    // const { loadingCovid19IndividualId, covid19DataMainIndividualId } = useSelector((state: RootState) => state.covidGetIndividualId);
    // const { userDataMain } = useSelector((state: RootState) => state.user);
    // const { loadingCovid19GroupId, covid19DataMainGroupId } = useSelector((state: RootState) => state.covidGetGroupId);
    const [fieldsToDisable, setDisableFields] = useState([]);

    const [uniqueId, setuniqueId] = useState('');
    const [reportedDate, setReportedDate] = useState(null);
    const [formtoggler, setFormtoggler] = useState('Individual Form');
    const [hazardInducer, sethazardInducer] = useState('');
    const [provinceName, setprovinceName] = useState('');
    const [districtName, setdistrictName] = useState('');
    const [municipalityName, setmunicipalityName] = useState('');
    const [wardName, setwardName] = useState('');
    const [LocalAddress, setLocalAddress] = useState('');
    const [patientStatus, setpatientStatus] = useState('');
    const [age, setAge] = useState('');
    const [togglePlusMinus, settogglePlusMinus] = useState({
        geo: true,
        casuality: true,
        verification: true,
    });
    const [gender, setGender] = useState('');
    const [condition, setCondition] = useState('');
    const [verified, setverified] = useState(false);
    const [notVerified, setNotVerified] = useState(false);
    const [approved, setApproved] = useState(false);
    const [notApproved, setNotApproved] = useState(false);
    const addedSuccessfullyRef = useRef(null);
    const [visibility, setvisibility] = useState('hidden');
    const [lattitude, setLattitude] = useState('');
    const [longitude, setLongitude] = useState('');

    // const [provinceDataIs, setProvinceDataIs] = useState([]);
    // const [districtDataIs, setdistrictDataIs] = useState([]);
    // const [municipalityDataIs, setmunicipalityDataIs] = useState([]);
    // const [wardDataIs, setwardDataIs] = useState([]);

    const [verificationMessage, setverificationMessage] = useState('');
    const [provinceId, setprovinceId] = useState(0);
    const [provinceCentriodForMap, setprovinceCentriodForMap] = useState<mapboxgl.LngLatLike>([0, 0]);
    const [districtId, setdistrictId] = useState(0);
    const [districtCentriodForMap, setdistrictCentriodForMap] = useState<mapboxgl.LngLatLike>([0, 0]);
    const [municipalityId, setmunicipalityId] = useState(0);
    const [municipalityCentriodForMap, setmunicipalityCentriodForMap] = useState<mapboxgl.LngLatLike>([0, 0]);
    const [wardId, setwardId] = useState(0);
    const [wardCentriodForMap, setwardCentriodForMap] = useState<mapboxgl.LngLatLike>([0, 0]);
    const addedRef = useRef(null);
    // const dispatch = useDispatch();
    // Group Form Section
    const [totalMaleInFected, settotalMaleInFected] = useState(0);
    const [totalFemaleInFected, settotalFemaleInFected] = useState(0);
    const [totalOthersInFected, settotalOthersInFected] = useState(0);
    const [totalDisabledInfected, settotalDisabledInfected] = useState(0);
    const [totalMaleDeath, settotalMaleDeath] = useState(0);
    const [totalFemaleDeath, settotalFemaleDeath] = useState(0);
    const [totalOthersDeath, settotalOthersDeath] = useState(0);
    const [totalDisabledDeath, settotalDisabledDeath] = useState(0);
    const [totalMaleRecovered, settotalMaleRecovered] = useState(0);
    const [totalFemaleRecovered, settotalFemaleRecovered] = useState(0);
    const [totalOthersRecovered, settotalOthersRecovered] = useState(0);
    const [totalDisabledRecovered, settotalDisabledRecovered] = useState(0);
    const [resetMap, setresetMap] = useState(false);


    // errors
    const [provinceError, setprovinceError] = useState(false);
    const [districtError, setdistrictError] = useState(false);
    const [munError, setmunError] = useState(false);
    const [wardError, setwardError] = useState(false);
    const [lngError, setlngError] = useState(false);
    const [latError, setlatError] = useState(false);
    const [dateError, setdateError] = useState(false);


    const [added, setAdded] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [error, setError] = useState(false);


    // map idle functionality
    const [provinceDisabled, setprovinceDisabled] = useState(true);
    const [munDisabled, setmunDisabled] = useState(true);
    const [districtDisabled, setdistrictDisabled] = useState(true);
    const [wardDisabled, setwardDisabled] = useState(true);
    const [initialProvinceCenter, setinitialProvinceCenter] = useState([]);
    const [initialDistrictCenter, setinitialDistrictCenter] = useState([]);
    const [initialMunCenter, setinitialMunCenter] = useState([]);

    const [loading, setLoading] = useState(false);

    // const { provincialData, loading } = useSelector((state: RootState) => state.province);
    // const { districtDataMain, loadingDistrict } = useSelector((state: RootState) => state.district);
    // const { municipalityDataMain, loadingMunicipality } = useSelector((state: RootState) => state.municipality);
    // const { wardDataMain, loadingWard } = useSelector((state: RootState) => state.ward);
    const { userDataMain,
        provinces,
        districts,
        municipalities,
        wards,
        covidPage: {
            covidIndivisualData,
            covidIndivisualCount,
            covidGroupData,
            covidGroupCount,
            covid19IndividualEditData,
            covid19GroupEditData,
        } } = props;
    // useEffect(() => {
    //     dispatch(provinceData());
    // }, [dispatch]);

    useEffect(() => {
        setuniqueId();
        setuniqueId('');
    }, []);

    useEffect(() => {
        if (userDataMain && userDataMain.profile && userDataMain.profile.province && provinces && provinces.length > 0) {
            const nameOfProvince = provinces.filter(item => item.id === userDataMain.profile.province).map(item => item.title)[0];
            setprovinceName(nameOfProvince);
            const provinceCenter = provinces.filter(item => item.id === userDataMain.profile.province).map(item => item.centroid.coordinates)[0];
            setinitialProvinceCenter(provinceCenter);
        }
        if (userDataMain && userDataMain.profile && userDataMain.profile.district && districts && districts.length > 0) {
            const nameOfDistrict = districts.filter(item => item.id === userDataMain.profile.district).map(item => item.title)[0];
            setdistrictName(nameOfDistrict);
            const districtCenter = districts.filter(item => item.id === userDataMain.profile.district).map(item => item.centroid.coordinates)[0];
            setinitialDistrictCenter(districtCenter);
        }
        if (userDataMain && userDataMain.profile && userDataMain.profile.municipality && municipalities && municipalities.length > 0) {
            const nameOfMunicipality = municipalities.filter(item => item.id === userDataMain.profile.municipality).map(item => item.title)[0];
            setmunicipalityName(nameOfMunicipality);
            const munCenter = municipalities.filter(item => item.id === userDataMain.profile.municipality).map(item => item.centroid.coordinates)[0];
            setinitialMunCenter(munCenter);
        }
        if (userDataMain && userDataMain.profile && userDataMain.profile.ward && wards && wards.length > 0) {
            const nameOfWard = wards.filter(item => item.id === userDataMain.profile.ward).map(item => item.title)[0];
            setwardName(nameOfWard);
        }
    }, [districts, municipalities, provinces, userDataMain, wards]);

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
            const temp = provinces.filter(item => item.id === provinceId)
                .map(item => item.centroid.coordinates)[0];
            setprovinceCentriodForMap(temp);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinceId]);

    useEffect(() => {
        if (districtId) {
            const districtCentriodForMaps = districts.filter(item => item.id === districtId)
                .map(item => item.centroid.coordinates)[0];
            setdistrictCentriodForMap(districtCentriodForMaps);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [districtId]);

    useEffect(() => {
        if (municipalityId) {
            const municipalityCentriodForMaps = municipalities.filter(item => item.id === municipalityId)
                .map(item => item.centroid.coordinates)[0];
            setmunicipalityCentriodForMap(municipalityCentriodForMaps);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [municipalityId]);

    useEffect(() => {
        if (wardId) {
            const wardCentriodForMaps = wards.filter(item => item.id === wardId)
                .map(item => item.centroid.coordinates)[0];
            setwardCentriodForMap(wardCentriodForMaps);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wardId]);

    useEffect(() => {
        const id = wards.filter(item => item.municipality === municipalityId)
            .filter(item => item.title === String(wardName)).map(item => item.id)[0];
        if (wardName) {
            setwardId(id);
            // setEditWardId(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wardName]);

    useEffect(() => {
        if (covid19IndividualEditData && Object.keys(covid19IndividualEditData).length > 0) {
            setFormtoggler('Individual Form');
            window.scrollTo(0, 1000);
            if (covid19IndividualEditData.approved) {
                setApproved(true);
            } else {
                setNotApproved(true);
            }
            if (covid19IndividualEditData.verified) {
                setverified(true);
            } else {
                setNotVerified(true);
            }
            setuniqueId(covid19IndividualEditData.id);
            setReportedDate(covid19IndividualEditData.reportedOn);
            setLongitude(covid19IndividualEditData.point.coordinates[0]);
            setLattitude(covid19IndividualEditData.point.coordinates[1]);
            setprovinceName(covid19IndividualEditData.province.title);
            setdistrictName(covid19IndividualEditData.district.title);
            setmunicipalityName(covid19IndividualEditData.municipality.title);
            setwardName(covid19IndividualEditData.ward.title);
            setpatientStatus(covid19IndividualEditData.currentState);
            setGender(covid19IndividualEditData.gender);
            setverificationMessage(covid19IndividualEditData.verificationMessage);
            props.setCovidPage({ covid19IndividualEditData: {} });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [covid19IndividualEditData]);

    useEffect(() => {
        if (covid19GroupEditData && Object.keys(covid19GroupEditData).length > 0) {
            setFormtoggler('Group Form');
            window.scrollTo(0, 1000);
            if (covid19GroupEditData.approved) {
                setApproved(true);
            } else {
                setNotApproved(true);
            }
            if (covid19GroupEditData.verified) {
                setverified(true);
            } else {
                setNotVerified(true);
            }
            setuniqueId(covid19GroupEditData.id);
            setReportedDate(covid19GroupEditData.reportedOn);
            setprovinceName(covid19GroupEditData.province.title);
            setdistrictName(covid19GroupEditData.district.title);
            setmunicipalityName(covid19GroupEditData.municipality ? covid19GroupEditData.municipality.title : '');
            setwardName(covid19GroupEditData.ward ? covid19GroupEditData.ward.title : '');
            sethazardInducer(covid19GroupEditData.hazardInducer);
            settotalMaleInFected(covid19GroupEditData.newcasesMale);
            props.setCovidPage({ covid19GroupEditData: {} });
            // dispatch(covidDataGetClearGroupId());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [covid19GroupEditData]);


    // const { loadingCovid19Individual, errorCovidIndividual } = useSelector((state: RootState) => state.covidIndividual);
    // const { errorCovidIndividualPutId } = useSelector((state: RootState) => state.covidPutIndividualId);

    // useEffect(() => {
    //     if (errorCovidIndividual) {
    //         setError(true);
    //     } else {
    //         setError(false);
    //     }
    // }, [errorCovidIndividual]);

    const getDisabled = (field: string) => fieldsToDisable.includes(field);

    useEffect(() => {
        // const allFields = Object.keys(institutionDetails);
        const allFields = [
            'point',
            'uniqueId',
            'reportedDate',
            'formtoggler',
            'hazardInducer',
            'provinceName',
            'districtName',
            'municipalityName',
            'wardName',
            'LocalAddress',
            'patientStatus',
            'age',
            'togglePlusMinus',
            'gender',
            'condition',
            'verified',
            'notVerified',
            'approved',
            'notApproved',
            'validationError',
            'visibility',
            'lattitude',
            'longitude',
            'provinceDataIs',
            'districtDataIs',
            'municipalityDataIs',
            'wardDataIs',
            'verificationMessage',
            'provinceId',
            'provinceCentriodForMap',
            'districtId',
            'districtCentriodForMap',
            'municipalityId',
            'municipalityCentriodForMap',
            'wardId',
            'wardCentriodForMap',
            'totalMaleInFected',
            'totalFemaleInFected',
            'totalOthersInFected',
            'totalDisabledInfected',
            'totalMaleDeath',
            'totalFemaleDeath',
            'totalOthersDeath',
            'totalDisabledDeath',
            'totalMaleRecovered',
            'totalFemaleRecovered',
            'totalOthersRecovered',
            'totalDisabledRecovered',
            'resetMap',
            'is_verified',
            'is_approved',
            'verification_message',
        ];

        const fieldsToGiveValidator = [
            'verified',
            'notVerified',
            'approved',
            'notApproved',
            'verificationMessage',
        ];

        if (uniqueId) {
            if (userDataMain.isSuperuser) {
                setDisableFields([]);
            } else if (
                userDataMain.profile && userDataMain.profile.role
                && userDataMain.profile.role === 'validator'
            ) {
                if (covid19IndividualEditData && covid19IndividualEditData.id) {
                    setDisableFields(allFields.filter(f => !fieldsToGiveValidator.includes(f)));
                } else {
                    setDisableFields(allFields);
                }
            } else if (
                userDataMain.profile
                && userDataMain.profile.role
                && userDataMain.profile.role === 'user'
            ) {
                setDisableFields(allFields.filter(f => fieldsToGiveValidator.includes(f)));
            } else if (
                userDataMain.profile
                && userDataMain.profile.role
                && userDataMain.profile.role === 'editor'
            ) {
                setDisableFields([]);
            } else {
                setDisableFields(allFields);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [covid19IndividualEditData]);

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
    const covid19DataSummaryIndividual = {
        gender,
        age: age || null,
        currentState: patientStatus || 'active',
        point: {
            type: 'Point',
            coordinates: [
                longitude, lattitude,
            ],
        },
        reportedOn: reportedDate && new Date(reportedDate).toISOString().slice(0, 10),
        hazardInducer,
        verified,
        verificationMessage,
        approved,
        province: provinceId,
        district: districtId,
        municipality: municipalityId,
        ward: wardId,
    };

    const covid19DataSummaryGroup = {
        reportedOn: reportedDate && new Date(reportedDate).toISOString().slice(0, 10),
        hazardInducer,
        gender,
        province: provinceId,
        district: districtId,
        municipality: municipalityId,
        ward: wardId,
        newCasesMale: totalMaleInFected,
        newCasesFemale: Number(totalFemaleInFected),
        newCasesOther: Number(totalOthersInFected),
        newCasesDisabled: Number(totalDisabledInfected),
        newDeathMale: Number(totalMaleDeath),
        newDeathFemale: Number(totalFemaleDeath),
        newDeathOther: Number(totalOthersDeath),
        newDeathDisabled: Number(totalDisabledDeath),
        newRecoveredMale: Number(totalMaleRecovered),
        newRecoveredFemale: Number(totalFemaleRecovered),
        newRecoveredOther: Number(totalOthersRecovered),
        newRecoveredDisabled: Number(totalDisabledRecovered),
        isVerified: verified,
        verificationMessage,
        approved,
    };

    const handleCovid19DataEntry = () => {
        if (formtoggler === 'Individual Form') {
            if (!provinceName || !districtName || !municipalityName || !wardName || !longitude || !lattitude || !reportedDate) {
                if (!provinceName) {
                    setprovinceError(true);
                } else {
                    setprovinceError(false);
                }
                if (!districtName) {
                    setdistrictError(true);
                } else {
                    setdistrictError(false);
                }
                if (!municipalityName) {
                    setmunError(true);
                } else {
                    setmunError(false);
                }
                if (!wardName) {
                    setwardError(true);
                } else {
                    setwardError(false);
                }
                if (!longitude) {
                    setlngError(true);
                } else {
                    setlngError(false);
                }
                if (!longitude) {
                    setlatError(true);
                } else {
                    setlatError(false);
                }
                if (!reportedDate) {
                    setdateError(true);
                } else {
                    setdateError(false);
                }
                window.scrollTo(0, 500);
            } else {
                if (formtoggler === 'Individual Form' && uniqueId) {
                    // if (userDataMain.profile && userDataMain.profile.role && userDataMain.profile.role === 'validator') {
                    // console.log('putting...');
                    props.requests.covid19IndividualPatch.do({ id: uniqueId, body: covid19DataSummaryIndividual });

                    setUpdated(true);
                    setresetMap(true);
                } else {
                    props.requests.covid19IndivisualPost.do({ body: covid19DataSummaryIndividual });
                    // dispatch(covidDataIndividual(covid19DataSummaryIndividual));
                    setAdded(true);
                    setresetMap(true);
                }
                setReportedDate(null);
                setvisibility('visible');
                setLongitude('');
                setLattitude('');
                setuniqueId('');
                sethazardInducer('');
                setNotVerified(false);
                setNotApproved(false);
                setLocalAddress('');
                setpatientStatus('');
                setAge('');
                setGender('');
                setCondition('');
                setverified(false);
                setverificationMessage('');
                setApproved(false);
            }
        }
        if (formtoggler === 'Group Form') {
            if (!provinceName || !districtName || !municipalityName || !wardName) {
                if (!provinceName) {
                    setprovinceError(true);
                } else {
                    setprovinceError(false);
                }
                if (!districtName) {
                    setdistrictError(true);
                } else {
                    setdistrictError(false);
                }
                if (!municipalityName) {
                    setmunError(true);
                } else {
                    setmunError(false);
                }
                if (!wardName) {
                    setwardError(true);
                } else {
                    setwardError(false);
                }
                if (!reportedDate) {
                    setdateError(true);
                } else {
                    setdateError(false);
                }
                window.scrollTo(0, 500);
            } else {
                if (formtoggler === 'Group Form' && uniqueId) {
                    props.requests.covid19GroupPatch.do({ id: uniqueId, body: covid19DataSummaryGroup });
                    // dispatch(covidDataPutGroupId(uniqueId, covid19DataSummaryGroup));
                    setresetMap(true);
                    setUpdated(true);
                } else {
                    props.requests.covid19GroupPost.do({ body: covid19DataSummaryGroup });
                    // dispatch(covidDataGroup(covid19DataSummaryGroup));
                    setAdded(true);
                    setresetMap(true);
                }
                setvisibility('visible');
                setLongitude('');
                setLattitude('');
                // setvalidationError('');
                setReportedDate(null);
                setuniqueId('');
                sethazardInducer('');
                setLocalAddress('');
                setpatientStatus('');
                setAge('');
                setGender('');
                setCondition('');
                setverified(false);
                setNotVerified(false);
                setNotApproved(false);
                setverificationMessage('');
                setApproved(false);
                settotalMaleInFected('');
                settotalFemaleInFected('');
                settotalDisabledInfected('');
                settotalDisabledInfected('');
                settotalMaleDeath('');
                settotalFemaleDeath('');
                settotalOthersDeath('');
                settotalDisabledDeath('');
                settotalMaleRecovered('');
                settotalFemaleRecovered('');
                settotalOthersRecovered('');
                settotalDisabledRecovered('');
            }
        }
    };

    const handleOk = () => {
        // addedSuccessfullyRef.current.style.visibility = 'hidden';
        // document.body.style.backgroundColor = '';
        setvisibility('hidden');
    };

    const handleShowhideGeo = () => {
        if (togglePlusMinus.geo) {
            settogglePlusMinus(prevState => ({ ...prevState }));
        } else {
            // settogglePlusMinus(prevState=> prevState.geo=false);
        }
    };

    const handleChangeForm = (formName) => {
        if (formName === 'Group Form') {
            setFormtoggler('Group Form');
        } else {
            setFormtoggler('Individual Form');
        }
    };

    const centriodsForMap = {
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
    const handleUpdateSuccess = () => {
        setAdded(false);
        setUpdated(false);
        setError(false);
    };

    const handleAddedSuccess = () => {
        setAdded(false);
        setUpdated(false);
        setError(false);
    };
    const handleErrorClose = () => {
        setAdded(false);
        setUpdated(false);
        setError(false);
    };

    const gotoTable = () => {
        navigate('/admin/covid-19/covid-19-data-table');
    };
    return (

        <>
            <Box>
                <div className={styles.covid19MainFormPage}>
                    <div className={styles.individualGroupFormToggler}>
                        <h1 className={styles.headerCovid}>Covid-19 Data Structure</h1>
                        <div className={styles.maintoggler}>
                            {
                                ['Individual Form', 'Group Form'].map(item => (
                                    <button
                                        key={item}
                                        type="submit"
                                        onClick={() => handleChangeForm(item)}
                                        className={item === formtoggler ? styles.togglerIndGroActive
                                            : styles.togglerIndGro}
                                    >
                                        {item}
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                    <p className={styles.dataReporting}>Data Reporting</p>
                    <div className={styles.twoSections}>
                        <div className={styles.reportingStatus}>
                            <div className={styles.reporting}>
                                <img className={styles.listSvg} src={ListSvg} alt="" />
                                <p className={styles.reportingText}>COVID-19 Reporting</p>
                                <p className={styles.greenCircle} />
                            </div>
                        </div>
                        <div className={styles.mainForm}>
                            <div className={styles.generalInfoAndTableButton}>
                                <h1 className={styles.generalInfo}>General Information</h1>
                                <button type="button" onClick={gotoTable} className={styles.viewDataTable}>View Data Table</button>
                            </div>
                            <div className={styles.shortGeneralInfo}>
                                <img className={styles.ideaIcon} src={Ideaicon} alt="" />
                                {
                                    formtoggler === 'Individual Form'
                                        ? <p className={styles.ideaPara}>The individual COVID-19 form consists of the geographical information of the affected people, and the casualty details disaggregated by gender and disability.</p>
                                        : <p className={styles.ideaPara}>The group COVID-19 form consists of the geographical information of the affected area, and the casualty details with total infected, total death, and total recovered disaggregated by gender and disability.</p>
                                }

                            </div>
                            <div className={styles.infoBar}>
                                <p className={styles.instInfo}>
                                    Reported Date, Patient Status, and Location are required fields
                                </p>
                            </div>

                            <div className={styles.mainCovidDataEntrySection}>
                                <h3 className={styles.formGeneralInfo}>General Information</h3>
                                <div className={styles.twoInputSections}>
                                    <TextField
                                        className={styles.materialUiInput}
                                        type="number"
                                        disabled
                                        value={uniqueId}
                                        onChange={e => setuniqueId(e.target.value)}
                                        id="outlined-basic"
                                        label="Id"
                                    />
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Reported Date"
                                            value={reportedDate}
                                            onChange={(newValue) => {
                                                setReportedDate(newValue);
                                            }}
                                            disabled={getDisabled('reportedDate')}
                                            renderInput={params => <TextField error={dateError} className={styles.materialUiInput} {...params} helperText={dateError ? 'This is required' : ''} />}
                                        />
                                    </LocalizationProvider>
                                </div>

                                <TextField
                                    id="outlined-basic"
                                    label="Hazard Inducer"
                                    variant="outlined"
                                    className={styles.hazardInducer}
                                    disabled={getDisabled('hazardInducer')}
                                    value={hazardInducer}
                                    onChange={e => sethazardInducer(e.target.value)}
                                />

                                <div className={styles.infoBar}>
                                    <p className={styles.instInfo}>
                                        <span style={{ color: '#003572' }} />
                                        Geographical Information on the area

                                    </p>
                                    <div role="presentation" className={styles.plusMinus} onKeyDown={handleShowhideGeo} onClick={handleShowhideGeo}>
                                        {
                                            togglePlusMinus ? (
                                                <img src={PlusSvg} alt="" />
                                            ) : (
                                                <img src={MinusSvg} alt="" />
                                            )
                                        }
                                    </div>
                                </div>

                                <div className={styles.fourInputSections}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select Province</InputLabel>
                                        <Select
                                            error={provinceError}
                                            className={styles.adminLvlSelection}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={provinceName}
                                            label="Select Province"
                                            onChange={e => setprovinceName(e.target.value)}
                                            disabled={getDisabled('provinceName') || (userDataMain.profile && userDataMain.profile.province)}
                                            required
                                        >
                                            {provinces.map(item => (
                                                <MenuItem key={item.title} value={item.title}>{item.title}</MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select District</InputLabel>
                                        <Select
                                            error={districtError}
                                            // className={provinceName === '' && loadingDistrict ? styles.adminLvlSelectionDisabled
                                            //     : styles.adminLvlSelection}
                                            disabled={provinceName === '' || getDisabled('districtName') || (userDataMain.profile && userDataMain.profile.district)}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={districtName}
                                            label="Select District"
                                            onChange={e => setdistrictName(e.target.value)}
                                        >
                                            {districts.filter(item => item.province === provinceId).map(item => (
                                                <MenuItem key={item.title} value={item.title}>{item.title}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select Municipality</InputLabel>
                                        <Select
                                            error={munError}
                                            // className={districtName === '' || loadingMunicipality ? styles.adminLvlSelectionDisabled
                                            //     : styles.adminLvlSelection}
                                            disabled={districtName === '' || getDisabled('municipalityName') || (userDataMain.profile && userDataMain.profile.municipality)}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={municipalityName}
                                            label="Select Municipality"
                                            onChange={e => setmunicipalityName(e.target.value)}
                                        >
                                            {municipalities.filter(item => item.district === districtId).map(item => (
                                                <MenuItem key={item.title} value={item.title}>{item.title}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select Ward</InputLabel>
                                        <Select
                                            error={wardError}
                                            disabled={municipalityName === '' || getDisabled('wardName')}
                                            // className={municipalityName === '' || loadingWard ? styles.adminLvlSelectionDisabled
                                            //     : styles.adminLvlSelection}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={wardName}
                                            label="Select Ward"
                                            onChange={e => setwardName(e.target.value)}
                                        >
                                            {wards.filter(item => item.municipality === municipalityId).map(item => Number(item.title)).sort((a, b) => a - b).map(item => (
                                                <MenuItem key={item} value={item}>{item}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <Map
                                    centriodsForMap={centriodsForMap}
                                    initialProvinceCenter={initialProvinceCenter}
                                    initialDistrictCenter={initialDistrictCenter}
                                    initialMunCenter={initialMunCenter}
                                />

                                <div className={formtoggler === 'Individual Form' ? styles.togglingSectionIndividual : styles.togglingSectionIndividualNone}>
                                    <TextField
                                        className={styles.hazardInducer}
                                        id="outlined-basic"
                                        label="Local Address(Kindly Specify)"
                                        variant="outlined"
                                        value={LocalAddress}
                                        disabled={getDisabled('LocalAddress')}

                                        onChange={e => setLocalAddress(e.target.value)}
                                    />

                                    <div className={styles.twoInputSections}>
                                        <TextField
                                            className={styles.materialUiInput}
                                            error={latError}
                                            type="number"
                                            value={lattitude}
                                            disabled={getDisabled('lattitude')}

                                            onChange={e => setLattitude(e.target.value)}
                                            id="outlined-basic"
                                            label="Lattitude"
                                        />

                                        <TextField
                                            className={styles.materialUiInput}
                                            error={lngError}
                                            type="number"
                                            disabled={getDisabled('longitude')}

                                            value={longitude}
                                            onChange={e => setLongitude(e.target.value)}
                                            id="outlined-basic"
                                            label="Longitude"
                                        />

                                    </div>
                                    <LngLatContext.Provider value={[longitude, setLongitude, lattitude, setLattitude]}>
                                        {
                                            (uniqueId && longitude && longitude)
                                            && (
                                                <Map
                                                    disabled={getDisabled('point')}
                                                    centriodsForMap={centriodsForMap}
                                                    resetMap={resetMap}
                                                    editedCoordinates={{ point: { type: 'Point', coordinates: [longitude, lattitude] } }}
                                                />
                                            )
                                        }
                                        {
                                            (!uniqueId && (initialMunCenter.length > 0 || initialDistrictCenter.length > 0 || initialProvinceCenter.length > 0))
                                            && (
                                                <Map
                                                    disabled={getDisabled('point')}
                                                    centriodsForMap={centriodsForMap}
                                                    resetMap={resetMap}
                                                    initialProvinceCenter={initialProvinceCenter}
                                                    initialDistrictCenter={initialDistrictCenter}
                                                    initialMunCenter={initialMunCenter}
                                                />
                                            )
                                        }


                                    </LngLatContext.Provider>
                                    <div className={styles.infoBarCasuality}>
                                        <p className={styles.instInfo}>
                                            {' '}
                                            <span style={{ color: '#003572' }} />
                                            {' '}
                                            {' '}
                                            Casuality Statistics of the area

                                        </p>
                                    </div>


                                    <div className={styles.fourInputSections}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Patient Status</InputLabel>
                                            <Select
                                                disabled={getDisabled('patientStatus')}
                                                className={styles.adminLvlSelection}
                                                labelId="demo-simple-select-dfghjkl"
                                                id="demo-simple-fghjk"
                                                value={patientStatus}
                                                label="Patient Status"
                                                onChange={e => setpatientStatus(e.target.value)}
                                                style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                                                disableUnderline
                                            >
                                                <MenuItem value="death">Death</MenuItem>
                                                <MenuItem value="active">Active</MenuItem>
                                                <MenuItem value="recovered">Recovered</MenuItem>
                                            </Select>

                                        </FormControl>

                                        <TextField
                                            disabled={getDisabled('age')}

                                            className={styles.adminLvlSelection}
                                            type="number"
                                            value={age}
                                            onChange={e => setAge(e.target.value)}
                                            id="outlined-basic"
                                            label="Age"
                                        />


                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                                            <Select
                                                disabled={getDisabled('gender')}

                                                className={styles.adminLvlSelection}
                                                labelId="demo-simple-select-label-random"
                                                id="demo-simple-select-random123"
                                                value={gender}
                                                label="Gender"
                                                onChange={e => setGender(e.target.value)}
                                            >
                                                <MenuItem value="male">Male</MenuItem>
                                                <MenuItem value="female">Female</MenuItem>
                                                <MenuItem value="other">Other</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Disabled</InputLabel>
                                            <Select
                                                disabled={getDisabled('condition')}

                                                className={styles.adminLvlSelection}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={condition}
                                                label="Disabled"
                                                onChange={e => setCondition(e.target.value)}
                                            >
                                                <MenuItem value="Disabled">Disabled</MenuItem>
                                                <MenuItem value="null">-</MenuItem>

                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                                {/* -----------------------------------Group From-----------------------------						 */}
                                <div className={formtoggler === 'Group Form' ? styles.togglingSectionGroup : styles.togglingSectionGroupNone}>
                                    <div className={styles.infoBarCasuality}>
                                        <p className={styles.instInfo}>
                                            {' '}
                                            <span style={{ color: '#003572' }} />
                                            {' '}
                                            {' '}
                                            Casuality Statistics of the area

                                        </p>
                                    </div>
                                    <div className={styles.twoInputSections}>
                                        <TextField
                                            className={styles.materialUiInput}
                                            type="number"
                                            value={totalMaleInFected}
                                            onChange={e => settotalMaleInFected(e.target.value)}
                                            disabled={getDisabled('totalMaleInFected')}
                                            id="outlined-basic"
                                            label="Total Male Infected"
                                        />

                                        <TextField
                                            className={styles.materialUiInput}
                                            type="number"
                                            disabled={getDisabled('totalFemaleInFected')}

                                            value={totalFemaleInFected}
                                            onChange={e => settotalFemaleInFected(e.target.value)}
                                            id="outlined-basic"
                                            label="Total Female infected"
                                        />

                                    </div>
                                    <div className={styles.twoInputSections}>
                                        <TextField
                                            className={styles.materialUiInput}
                                            type="number"
                                            disabled={getDisabled('totalOthersInFected')}
                                            value={totalOthersInFected}
                                            onChange={e => settotalOthersInFected(e.target.value)}
                                            id="outlined-basic"
                                            label="Total Disabled Infected"
                                        />

                                        <TextField
                                            className={styles.materialUiInput}
                                            type="number"
                                            disabled={getDisabled('totalDisabledInfected')}

                                            value={totalDisabledInfected}
                                            onChange={e => settotalDisabledInfected(e.target.value)}
                                            id="outlined-basic"
                                            label="Total Disabled Infected"
                                        />

                                    </div>
                                    <div className={styles.twoInputSections}>
                                        <TextField
                                            className={styles.materialUiInput}
                                            type="number"
                                            disabled={getDisabled('totalMaleDeath')}

                                            value={totalMaleDeath}
                                            onChange={e => settotalMaleDeath(e.target.value)}
                                            id="outlined-basic"
                                            label="Total Male Death"
                                        />

                                        <TextField
                                            className={styles.materialUiInput}
                                            type="number"
                                            disabled={getDisabled('totalFemaleDeath')}

                                            value={totalFemaleDeath}
                                            onChange={e => settotalFemaleDeath(e.target.value)}
                                            id="outlined-basic"
                                            label="Total Female Death"
                                        />

                                    </div>
                                    <div className={styles.twoInputSections}>
                                        <TextField
                                            className={styles.materialUiInput}
                                            type="number"
                                            disabled={getDisabled('totalOthersDeath')}

                                            value={totalOthersDeath}
                                            onChange={e => settotalOthersDeath(e.target.value)}
                                            id="outlined-basic"
                                            label="Total Others Death"
                                        />

                                        <TextField
                                            className={styles.materialUiInput}
                                            type="number"
                                            disabled={getDisabled('totalDisabledDeath')}

                                            value={totalDisabledDeath}
                                            onChange={e => settotalDisabledDeath(e.target.value)}
                                            id="outlined-basic"
                                            label="Total Disabled Death"
                                        />

                                    </div>
                                    <div className={styles.twoInputSections}>
                                        <TextField
                                            className={styles.materialUiInput}
                                            type="number"
                                            disabled={getDisabled('totalMaleRecovered')}

                                            value={totalMaleRecovered}
                                            onChange={e => settotalMaleRecovered(e.target.value)}
                                            id="outlined-basic"
                                            label="Total Male Recovered"
                                        />

                                        <TextField
                                            className={styles.materialUiInput}
                                            type="number"
                                            disabled={getDisabled('totalFemaleRecovered')}

                                            value={totalFemaleRecovered}
                                            onChange={e => settotalFemaleRecovered(e.target.value)}
                                            id="outlined-basic"
                                            label="Total Female Recovered"
                                        />

                                    </div>
                                    <div className={styles.twoInputSections}>
                                        <TextField
                                            className={styles.materialUiInput}
                                            type="number"
                                            disabled={getDisabled('totalOthersRecovered')}

                                            value={totalOthersRecovered}
                                            onChange={e => settotalOthersRecovered(e.target.value)}
                                            id="outlined-basic"
                                            label="Total Others Recovered"
                                        />

                                        <TextField
                                            className={styles.materialUiInput}
                                            type="number"
                                            disabled={getDisabled('totalDisabledRecovered')}

                                            value={totalDisabledRecovered}
                                            onChange={e => settotalDisabledRecovered(e.target.value)}
                                            id="outlined-basic"
                                            label="Total Disabled Recovered"
                                        />

                                    </div>

                                </div>
                                <div className={styles.infoBarCasuality}>
                                    <p className={styles.instInfo}>
                                        {' '}
                                        <span style={{ color: '#003572' }} />
                                        {' '}
                                        {'  '}
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
                                            disabled={getDisabled('verified')}
                                            onChange={handleVerifiedChange}
                                        />


                                        <label htmlFor="verified">Yes</label>


                                    </div>
                                    <div className={styles.notVerified}>
                                        <input
                                            type="checkbox"
                                            name="verifiedCheck"
                                            id="notVerified"
                                            checked={notVerified}
                                            disabled={getDisabled('notVerified')}

                                            onChange={handleNotVerifiedChange}
                                        />
                                        <label htmlFor="notVerified">No</label>
                                    </div>
                                </div>
                                <div className={styles.checkBoxArea}>

                                    <TextField
                                        className={styles.hazardInducer}
                                        id="outlined-basic"
                                        label="Verification Message"
                                        value={verificationMessage}
                                        disabled={getDisabled('verificationMessage')}

                                        onChange={e => setverificationMessage(e.target.value)}
                                    />
                                    <p className={styles.verifiedOrApproved}>02.Approved</p>

                                    <div className={styles.verified}>
                                        <input
                                            type="checkbox"
                                            name="verifiedCheck"
                                            id="verified"
                                            disabled={getDisabled('approved')}

                                            checked={approved}
                                            onChange={handleApprovedChange}
                                        />

                                        <label htmlFor="verified">Yes</label>


                                    </div>
                                    <div className={styles.notVerified}>
                                        <input
                                            type="checkbox"
                                            name="verifiedCheck"
                                            id="notVerified"
                                            checked={notApproved}
                                            onChange={handleNotApprovedChange}
                                            disabled={getDisabled('notApproved')}
                                        />
                                        <label htmlFor="notVerified">No</label>
                                    </div>
                                </div>
                                <div className={styles.saveOrAddButtons}>

                                    <button className={styles.submitButtons} onClick={handleCovid19DataEntry} type="submit">{uniqueId ? 'Update' : 'Add New'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
        </>

    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Covid,
        ),
    ),
);
