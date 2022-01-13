import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import navigate from '@reach/router';
import Navbar from 'src/admin/components/Navbar';
import Footer from 'src/admin/components/Footer';
import MenuCommon from 'src/admin/components/MenuCommon';
import Map from 'src/admin/components/Mappointpicker';

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
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
    wardsSelector,
} from '#selectors';


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
            'incident_on': Date;
            'reported_on': Date;
            'verification_message': string;
            'hazard': number;
            'street_address': string;
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
            'incident_on': Date;
            'reported_on': Date;
            'verification_message': string;
            'hazard': number;
            'street_address': string;
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
const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
});

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
    const addedSuccessfullyRef = useRef(null);
    const [visibility, setvisibility] = useState('hidden');
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
    const addedRef = useRef(null);
    const [editLossId, setEditLossId] = useState('');
    const [editLossPeople, setEditLossPeople] = useState('');
    const [editWardId, setEditWardId] = useState('');

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

    const {
        provinces,
        districts,
        municipalities,
        wards,
    } = props;

    useEffect(() => {
        console.log(provinceId);
    }, [provinceId]);

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

    console.log(provinces, districts, municipalities, wards);
    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            <MenuCommon layout="common" currentPage={'Epidemics'} />
            <div className={styles.container}>

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
                            <button className={styles.viewDataTable} type="button">View Data Table</button>
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
                                        {wards && wards.filter(
                                            item => item.municipality === municipalityId,
                                        ).sort().map(
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
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

        </>
    );
};

export default connect(mapStateToProps)(Epidemics);
