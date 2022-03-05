/* eslint-disable max-len */
import React, { createContext, useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { navigate } from '@reach/router';
import styles from './styles.module.scss';
import Map from '../../Mappointpicker/index';
import AccentHeading from '../../AccentHeading';
import NextButton from '../../NextButton';


import { SetHealthInfrastructurePageAction } from '#actionCreators';
import {
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
    healthInfrastructurePageSelector,
    userSelector,
} from '#selectors';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    healthInfrastructurePage: healthInfrastructurePageSelector(state),
    userDataMain: userSelector(state),
    provinceData: provincesSelector(state),
    districtDataMain: districtsSelector(state),
    municipalityDataMain: municipalitiesSelector(state),
    wardDataMain: wardsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setHealthInfrastructurePage: params => dispatch(SetHealthInfrastructurePageAction(params)),
});

export const LngLatContext = createContext([]);

const Location = (props) => {
    const {
        handleFormData,
        setPoint,
        handleDate,
        formData,
        progress,
        healthInfrastructurePage: {
            healthFormEditData,
            validationError,
            resourceID,
        },
        userDataMain,
        provinceData,
        districtDataMain,
        municipalityDataMain,
        wardDataMain,
    } = props;


    const [provinceName, setprovinceName] = useState('');
    const [districtName, setdistrictName] = useState('');
    const [municipalityName, setmunicipalityName] = useState('');
    const [wardName, setwardName] = useState('');

    const [LocalAddress, setLocalAddress] = useState('');
    const [verified, setverified] = useState(false);
    const [approved, setApproved] = useState(false);
    const addedSuccessfullyRef = useRef(null);
    const [visibility, setvisibility] = useState('hidden');

    const [lattitude, setLattitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const [provinceDataIs, setProvinceDataIs] = useState([]);
    const [districtDataIs, setdistrictDataIs] = useState([]);
    const [municipalityDataIs, setmunicipalityDataIs] = useState([]);
    const [wardDataIs, setwardDataIs] = useState([]);

    const [provinceId, setprovinceId] = useState(0);
    const [districtId, setdistrictId] = useState(0);
    const [municipalityId, setmunicipalityId] = useState(0);
    const [wardId, setwardId] = useState(0);

    const [provinceCentriodForMap, setprovinceCentriodForMap] = useState<mapboxgl.LngLatLike>(null);
    const [initialProvinceCenter, setinitialProvinceCenter] = useState([]);
    const [initialDistrictCenter, setinitialDistrictCenter] = useState([]);
    const [initialMunCenter, setinitialMunCenter] = useState([]);
    const [districtCentriodForMap, setdistrictCentriodForMap] = useState<mapboxgl.LngLatLike>(null);
    const [municipalityCentriodForMap, setmunicipalityCentriodForMap] = useState<mapboxgl.LngLatLike>(null);
    const [wardCentriodForMap, setwardCentriodForMap] = useState<mapboxgl.LngLatLike>(null);

    const handleViewTableBtn = () => {
        navigate('/health-table');
    };

    const getDisabled = () => {
        if (userDataMain.isSuperuser) {
            return false;
        }
        if (
            userDataMain.profile
            && userDataMain.profile.role
            && userDataMain.profile.role === 'validator'
        ) {
            return true;
        } if (
            userDataMain.profile
            && userDataMain.profile.role === null
        ) {
            return true;
        } if (Object.keys(userDataMain).length === 0) {
            return true;
        }
        return false;
    };
    // const { provincialData, loading } = useSelector((state: RootState) => state.province);
    // const { districtDataMain, loadingDistrict } = useSelector((state: RootState) => state.district);
    // const { municipalityDataMain, loadingMunicipality } = useSelector((state: RootState) => state.municipality);
    // const { wardDataMain, loadingWard } = useSelector((state: RootState) => state.ward);

    useEffect(() => {
        if (userDataMain && userDataMain.profile && userDataMain.profile.province) {
            const nameOfProvince = provinceData.filter(item => item.id === userDataMain.profile.province).map(item => item.title)[0];
            setprovinceName(nameOfProvince);
            const provinceCenter = provinceData.filter(item => item.id === userDataMain.profile.province).map(item => item.centroid.coordinates)[0];
            setinitialProvinceCenter(provinceCenter);
        }
        if (userDataMain && userDataMain.profile && userDataMain.profile.district) {
            const nameOfDistrict = districtDataMain.filter(item => item.id === userDataMain.profile.district).map(item => item.title)[0];
            setdistrictName(nameOfDistrict);
            const districtCenter = districtDataMain.filter(item => item.id === userDataMain.profile.district).map(item => item.centroid.coordinates)[0];
            setinitialDistrictCenter(districtCenter);
        }
        if (userDataMain && userDataMain.profile && userDataMain.profile.municipality && municipalityDataMain && municipalityDataMain.length > 0) {
            const nameOfMunicipality = municipalityDataMain.filter(item => item.id === userDataMain.profile.municipality).map(item => item.title)[0];
            setmunicipalityName(nameOfMunicipality);
            const munCenter = municipalityDataMain.filter(item => item.id === userDataMain.profile.municipality).map(item => item.centroid.coordinates)[0];
            setinitialMunCenter(munCenter);
        }
        if (userDataMain && userDataMain.profile && userDataMain.profile.ward && wardDataMain && wardDataMain.length > 0) {
            const nameOfWard = wardDataMain.filter(item => item.id === userDataMain.profile.ward).map(item => item.title)[0];
            setwardName(nameOfWard);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDataMain]);


    // useEffect(() => {
    //     dispatch(provinceData());
    // }, [dispatch, provinceData]);

    useEffect(() => {
        if (resourceID) {
            setprovinceName((formData.ward && formData.ward.municipality.district.province) ? formData.ward.municipality.district.province.title : '');
            setdistrictName((formData.ward && formData.ward.municipality.district) ? formData.ward.municipality.district.title : '');
            setmunicipalityName((formData.ward && formData.ward.municipality) ? formData.ward.municipality.title : '');
            setwardName(formData.ward ? formData.ward.title : '');
            if (formData.point && formData.point.coordinates && formData.point.coordinates[0]) {
                setLongitude(formData.point.coordinates[0]);
            }
            if (formData.point && formData.point.coordinates && formData.point.coordinates[1]) {
                setLattitude(formData.point.coordinates[1]);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resourceID]);


    useEffect(() => {
        if (Object.keys(healthFormEditData).length > 0) {
            setLattitude(healthFormEditData.point.coordinates[1]);
            setLongitude(healthFormEditData.point.coordinates[0]);
        }
    }, [healthFormEditData]);

    useEffect(() => {
        if (visibility === 'visible') {
            addedSuccessfullyRef.current.style.visibility = visibility;
        }
    }, [visibility]);

    useEffect(() => {
        setProvinceDataIs(provinceData);
        setdistrictDataIs(districtDataMain);
        setmunicipalityDataIs(municipalityDataMain);
        setwardDataIs(wardDataMain);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const province = provinceDataIs.filter(item => item.title === provinceName).map(item => item.id)[0];
        console.log('test', province, provinceName);
        if (provinceName) {
            // dispatch(districtData(provinceId));
            setprovinceId(province);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinceName]);


    useEffect(() => {
        const district = districtDataIs.filter(item => item.title === districtName).map(item => item.id)[0];
        console.log('test district', district, districtName);
        if (districtName) {
            // dispatch(municipalityData(districtId));
            setdistrictId(district);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [districtName]);


    useEffect(() => {
        // console.log('municipalityName', municipalityName);
        const munId = municipalityDataIs.filter(item => item.title === municipalityName).map(item => item.id)[0];
        console.log('test muni', munId, municipalityName);
        if (municipalityName) {
            // dispatch(wardData(munId));
            setmunicipalityId(munId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [municipalityName]);


    useEffect(() => {
        // console.log('wardName', wardName);

        const ward = wardDataIs.filter(item => item.municipality === municipalityId)
            .filter(item => item.title === String(wardName)).map(item => item.id)[0];
        console.log('test ward', ward, wardName);
        if (wardName) {
            setwardId(ward);
            // console.log('ward id', wardId);
            handleFormData(ward, 'ward');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wardName]);


    useEffect(() => {
        if (provinceId) {
            const provinceCentriodForMaps = provinceDataIs.filter(item => item.id === provinceId)
                .map(item => item.centroid.coordinates)[0];
            setprovinceCentriodForMap(provinceCentriodForMaps);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinceId]);

    useEffect(() => {
        if (districtId) {
            const districtCentriodForMaps = districtDataIs.filter(item => item.id === districtId)
                .map(item => item.centroid.coordinates)[0];
            setdistrictCentriodForMap(districtCentriodForMaps);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [districtId]);

    useEffect(() => {
        if (municipalityId) {
            const municipalityCentriodForMaps = municipalityDataIs.filter(item => item.id === municipalityId)
                .map(item => item.centroid.coordinates)[0];
            setmunicipalityCentriodForMap(municipalityCentriodForMaps);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [municipalityId]);

    useEffect(() => {
        if (wardId) {
            const wardCentriodForMaps = wardDataIs.filter(item => item.id === wardId)
                .map(item => item.centroid.coordinates)[0];
            setwardCentriodForMap(wardCentriodForMaps);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wardId]);


    const centriodsForMap = {
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
        lattitude,
        longitude,
    };


    // useEffect(() => {
    //     if (wardName) {
    //         handleFormData(wardName, 'ward');
    //     }
    // }, [handleFormData, wardName]);
    useEffect(() => {
        setPoint(lattitude, 'lat');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lattitude]);
    useEffect(() => {
        setPoint(longitude, 'lng');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [longitude]);

    return (
        <>
            <div className={styles.rowTitle1}>
                <h2>Location</h2>
                <button
                    type="button"
                    className={styles.viewTablebtn}
                    onClick={handleViewTableBtn}
                >
                    View Data Table
                </button>
            </div>
            <div className={styles.rowTitle2}>
                <FontAwesomeIcon
                    icon={faInfoCircle}
                    className={styles.infoIcon}
                />
                <p>
                    This section contains the address and geolocation of the institutions.
                    Location is required to submit the form.
                </p>
            </div>
            <div className={styles.row3}>
                <AccentHeading
                    content={'Please click on the map to set latitude and longitude of the health institution'}
                />
            </div>
            <div className={styles.locationPage}>
                <div className={styles.infoBar}>
                    <p className={styles.instInfo}>
                        {' '}
                        <span style={{ color: '#003572' }}>A.</span>
                        {' '}
                        {' '}
                        Geographical Information on the area
                    </p>
                </div>
                {
                    Object.keys(healthFormEditData).length === 0 && (
                    <>
                        <div className={styles.fourInputSections}>
                            <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                                <InputLabel id="demo-simple-select-label">Select Province</InputLabel>
                                <Select
                                    disabled={getDisabled() || (userDataMain.profile && userDataMain.profile.province)}
                                    className={styles.adminLvlSelection}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={provinceName}
                                    error={typeof validationError === 'string'}
                                    label="Select Province"
                                    style={(typeof validationError === 'string' && !provinceName) ? { border: '1px solid #ff0000' } : { border: '1px solid #d5d5d5' }}
                                    disableUnderline
                                    onChange={e => setprovinceName(e.target.value)}
                                >
                                    {provinceDataIs && provinceDataIs.map(item => (
                                        <MenuItem key={item.title} value={item.title}>{item.title}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                                <InputLabel id="demo-simple-select-label">Select District</InputLabel>
                                <Select
                                    className={provinceName === '' ? styles.adminLvlSelectionDisabled
                                        : styles.adminLvlSelection}
                                    disabled={provinceName === '' || getDisabled() || (userDataMain.profile && userDataMain.profile.district)}
                                    labelId="demo-simple-select-label"
                                    error={typeof validationError === 'string'}
                                    id="demo-simple-select"
                                    value={districtName}
                                    label="Select District"
                                    style={(typeof validationError === 'string' && !districtName) ? { border: '1px solid #ff0000' } : { border: '1px solid #d5d5d5' }}
                                    disableUnderline
                                    onChange={e => setdistrictName(e.target.value)}
                                >
                                    {districtDataIs && districtDataIs.filter(
                                        item => item.province === provinceId,
                                    ).map(item => (
                                        <MenuItem key={item.title} value={item.title}>{item.title}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                                <InputLabel id="demo-simple-select-label">Select Municipality</InputLabel>
                                <Select
                                    className={districtName === '' ? styles.adminLvlSelectionDisabled
                                        : styles.adminLvlSelection}
                                    disabled={districtName === '' || getDisabled() || (userDataMain.profile && userDataMain.profile.municipality)}
                                    error={typeof validationError === 'string'}
                                    helperText={typeof validationError === 'string' ? 'This field is required' : null}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={municipalityName}
                                    label="Select Municipality"
                                    style={(typeof validationError === 'string' && !municipalityName) ? { border: '1px solid #ff0000' } : { border: '1px solid #d5d5d5' }}
                                    disableUnderline
                                    onChange={e => setmunicipalityName(e.target.value)}
                                >
                                    {municipalityDataIs && municipalityDataIs.filter(
                                        item => item.district === districtId,
                                    ).map(item => (
                                        <MenuItem key={item.title} value={item.title}>{item.title}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                                <InputLabel id="demo-simple-select-label">Select Ward</InputLabel>
                                <Select
                                    disableUnderline
                                    error={typeof validationError === 'string'}
                                    helperText={typeof validationError === 'string' ? 'This field is required' : null}
                                    disabled={municipalityName === '' || getDisabled()}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={wardName}
                                    label="Select Ward"
                                    style={(typeof validationError === 'string' && !wardName) ? { border: '1px solid #ff0000' } : { border: '1px solid #d5d5d5' }}
                                    onChange={e => setwardName(e.target.value)}
                                >
                                    {wardDataIs && wardDataIs.filter(
                                        item => item.municipality === municipalityId,
                                    ).map(item => Number(item.title)).sort((a, b) => a - b).map(item => (
                                        <MenuItem key={item} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                    </>
                    )}

                <div className={styles.twoInputSections}>
                    <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                        <TextField
                            className={styles.materialUiInput}
                            value={lattitude}
                            error={typeof validationError === 'string' && !lattitude}
                            helperText={typeof validationError === 'string' ? 'This field is required' : null}
                            disabled={getDisabled()}
                            onChange={e => setLattitude(e.target.value)}
                            id="outlined-basic"
                            label="Lattitude"
                            InputProps={{ disableUnderline: true }}
                            variant="filled"
                            style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                            fullWidth
                        />
                    </FormControl>
                    <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                        <TextField
                            className={styles.materialUiInput}
                            value={longitude}
                            disabled={getDisabled()}
                            error={typeof validationError === 'string' && !longitude}
                            helperText={typeof validationError === 'string' ? 'This field is required' : null}
                            onChange={e => setLongitude(e.target.value)}
                            id="outlined-basic"
                            label="Longitude"
                            InputProps={{ disableUnderline: true }}
                            variant="filled"
                            style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                            fullWidth
                        />
                    </FormControl>
                </div>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <TextField
                        disabled={getDisabled('local_address')}
                        id="local_addressID"
                        label="What is the local address of the facility?"
                        variant="filled"
                        value={formData.local_address}
                        onChange={e => handleFormData(e, 'local_address')}
                        InputProps={{ disableUnderline: true }}
                        style={{ border: '1px solid #d5d5d5' }}
                    />
                </FormControl>

                <Map
                    disabled={getDisabled('point')}
                    centriodsForMap={centriodsForMap}
                    initialProvinceCenter={initialProvinceCenter}
                    initialDistrictCenter={initialDistrictCenter}
                    initialMunCenter={initialMunCenter}
                />

                {
                    validationError && <p style={{ color: 'red' }}>{validationError}</p>
                }
                <NextButton
                    getActiveMenu={props.getActiveMenu}
                    progress={progress}
                    activeMenu={props.activeMenu}
                    handleProgress={props.handleProgress}
                    formData={formData}
                />
            </div>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    Location,
);
