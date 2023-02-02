/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable max-len */
/* eslint-disable react/jsx-indent */
import React, { useState, useRef, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker } from '@mui/lab';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Map from 'src/admin/components/Mappointpicker';
import { connect } from 'react-redux';
import { createRequestClient, methods } from '@togglecorp/react-rest-request';
import Loader from 'react-loader';
import { FormHelperText } from '@material-ui/core';
import mapboxgl from 'mapbox-gl';
import styles from '../styles.module.scss';
import Ideaicon from '../../../resources/ideaicon.svg';
import { createConnectedRequestCoordinator } from '#request';
import { SetEpidemicsPageAction } from '#actionCreators';
import { boundsSelector, epidemicsPageSelector } from '#selectors';

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setEpidemicsPage: params => dispatch(SetEpidemicsPageAction(params)),
});
const mapStateToProps = (state, props) => ({
    bounds: boundsSelector(state, props),

});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    loss: {
        url: '/loss/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            props.setEpidemicsPage({ lossID: response.id });
            // if (params && params.clearData) {
            //     params.clearData();
            // }
            if (params && params.setLoader) {
                params.setLoader(false);
            }
            // if (params && params.handleNext) {
            //     params.handleNext(2);
            // }
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossError: 'Some problem occurred',
                });
                if (params && params.setLoader) {
                    params.setLoader(false);
                }
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
    lossUpdate: {
        url: ({ props }) => `/loss/${props.lossID}/`,
        method: methods.PUT,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            params.handleLossDataSwitchListener();
            props.setEpidemicsPage({ lossID: response.id });
            // if (params && params.clearData) {
            //     params.clearData();
            // }
            if (params && params.setLoader) {
                params.setLoader(false);
            }
            // if (params && params.handleNext) {
            //     params.handleNext(2);
            // }
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
                params.setEpidemicsPage({
                    lossError: 'Some problem occurred',
                });
                if (params && params.setLoader) {
                    params.setLoader(false);
                }
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
    incidentFetchData: {
        url: ({ params }) => `/incident/${params.id}`,
        method: methods.GET,
        onMount: false,
        query: ({
            expand: ['loss.peoples', 'wards', 'wards.municipality', 'wards.municipality.district', 'wards.municipality.district.province'],
            format: 'json',
        }),
        onSuccess: ({ response, props, params }) => {
            props.setEpidemicsPage({
                incidentEditData: response,
                lossID: response.loss.id,
            });
            if (params && params.setLoader) {
                params.setLoader(false);
            }
        },
    },

};


const General = ({ validationError, lossID,
    uniqueId, setuniqueId, reportedDate, setReportedDate, dateError, hazardList,
    selectedHazardName, handleSelectedHazard,
    cause, setCause, provinceName, handleProvince, provinces, handleLossDataSwitchListener,
    districtName, handleDistrict,
    districts, provinceId, municipalityName, handleMunicipality,
    municipalities, districtId,
    wardName, handleWard, wards, municipalityId,
    streetAddress, setStreetAddress,
    lattitude, setLattitude, latError, longitude, setLongitude, longError,
    centriodsForMap, initialProvinceCenter,
    initialDistrictCenter, initialMunCenter, incidentEditData, disableMapFilterLofic,
    disableMapFilter, teError,
    totalEstimatedLoss, setTotalEstimatedLoss, setEpidemicsPage,
    verified, handleVerifiedChange, notVerified, handleNotVerifiedChange,
    verificationMessage, setVerificationMessage, mapDataIncidentEdit,
    approved, handleApprovedChange, notApproved, handleNotApprovedChange, handleTableButton, handleEpidemicFormSubmit,
    handleNext, clearData, bounds, setteError, selectedHazardId, isNewIncident,
    setIsNewIncident,
    setDateError, setProvinceError, setDistrictError, setMunnicipalityError, setWardError, setLatError, setLongError,
    provinceError, districtError, municipalityError, wardError, hazardError, setHazardError,
    user: { profile: { province: userProvince, district: userDistrict, municipality: userMunicipality } },
    requests: { loss, lossUpdate, incidentFetchData } }) => {
    const [loader, setLoader] = useState(false);
    const mapRef = useRef(null);
    const markerRef = useRef(null);


    useEffect(() => {
        if (uniqueId) {
            setLoader(true);
            incidentFetchData.do({
                id: uniqueId,
                setLoader,
            });
        }
    }, []);


    const handleSave = async () => {
        // if (mapRef.current) {
        //     mapRef.current.fitBounds(mapDataIncidentEdit.wards[0].bbox);
        // }

        const lossFormData = {
            estimatedLoss: Number(totalEstimatedLoss),
        };

        if (!reportedDate || !provinceName || !districtName || !municipalityName || !wardName
            || !lattitude || !longitude || !selectedHazardId
        ) {
            if (!reportedDate) {
                setDateError(true);
            } else {
                setDateError(false);
            }
            if (!selectedHazardId) {
                setHazardError(true);
            } else {
                setHazardError(false);
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
            // if (!totalEstimatedLoss) {
            //     setteError(true);
            // } else {
            //     setteError(false);
            // }
        } else {
            setLoader(true);
            if (uniqueId) {
                await lossUpdate.do({ body: lossFormData, setLoader, handleNext, clearData, handleLossDataSwitchListener });
            } else {
                setIsNewIncident(true);
                await loss.do({ body: lossFormData, setLoader, handleNext, clearData });
            }
        }
    };


    const setCoordinateonClick = () => {
        if (mapRef.current) {
            centriodsForMap.setLattitude(Number(lattitude));
            centriodsForMap.setLongitude(Number(longitude));
            setLongError(false);
            setLatError(false);
            if (markerRef.current) {
                markerRef.current.setLngLat([Number(longitude), Number(lattitude)]).addTo(mapRef.current);
            }
        }
    };
    return (

        <div className={styles.mainForm}>
            {
                loader
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
                    ) : ''
            }
            <div className={styles.generalInfoAndTableButton}>
                <h1 className={styles.generalInfo}>General Information</h1>
                <button className={styles.viewDataTable} type="button" onClick={handleTableButton}>View Data Table</button>
            </div>
            <div className={styles.shortGeneralInfo}>
                <img className={styles.ideaIcon} src={Ideaicon} alt="" />
                <p className={styles.ideaPara}>
                    The incident form consists of the details of the incident,
                    geographical information of the affected area,hazard details and estimated loss.

                </p>
            </div>
            <div className={styles.infoBar}>
                <p className={styles.instInfo}>
                    Reported Date and Location are required information
                </p>
            </div>
            <div className={styles.mainDataEntrySection}>

                <div>
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
                                    setDateError(false);
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
                    <div className={styles.twoInputSections}>
                        <FormControl fullWidth>
                            <InputLabel id="hazard-label">Hazard</InputLabel>
                            <Select
                                labelId="hazard"
                                id="hazard-select"
                                value={hazardList.length ? selectedHazardName : ''}
                                label="Hazard"
                                onChange={(e) => {
                                    handleSelectedHazard(e);
                                    setHazardError(false);
                                }}
                                error={hazardError}
                            >
                                {hazardList.length && hazardList.map(
                                    item => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.title}
                                        >
                                            {item.title}
                                        </MenuItem>
                                    ),
                                )}
                            </Select>
                            {hazardError ? <FormHelperText style={{ color: '#f44336', marginLeft: '14px' }}>Hazard is Required</FormHelperText> : ''}
                        </FormControl>
                        <TextField
                            required
                            id="outlined-basic"
                            label="Hazard Inducer"
                            variant="outlined"

                            value={cause}
                            onChange={e => setCause(e.target.value)}
                        />
                    </div>
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
                                onChange={(e) => {
                                    handleProvince(e);
                                    setProvinceError(false);
                                    setLongitude('');
                                    setLattitude('');
                                }}
                                disabled={userProvince}
                                error={provinceError}
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
                            {provinceError ? <FormHelperText style={{ color: '#f44336', marginLeft: '14px' }}>Province is Required</FormHelperText> : ''}
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="district-label">District</InputLabel>
                            <Select
                                labelId="district"
                                id="district-select"
                                value={districtName}
                                label="District"
                                onChange={(e) => {
                                    handleDistrict(e);
                                    setDistrictError(false);
                                    setLongitude('');
                                    setLattitude('');
                                }}
                                disabled={userDistrict}
                                error={districtError}
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
                            {districtError ? <FormHelperText style={{ color: '#f44336', marginLeft: '14px' }}>District is Required</FormHelperText> : ''}
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="municipality-label">Municipality</InputLabel>
                            <Select
                                labelId="municipality"
                                id="munnicipality-select"
                                value={municipalityName}
                                label="Municipality"
                                onChange={(e) => {
                                    handleMunicipality(e);
                                    setMunnicipalityError(false);
                                    setLongitude('');
                                    setLattitude('');
                                }}
                                disabled={userMunicipality}
                                error={municipalityError}
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
                            {municipalityError ? <FormHelperText style={{ color: '#f44336', marginLeft: '14px' }}>Municipality is Required</FormHelperText> : ''}
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="ward-label">Ward</InputLabel>
                            <Select
                                labelId="ward"
                                id="ward-select"
                                value={wardName}
                                label="Ward"
                                onChange={(e) => {
                                    handleWard(e);
                                    setWardError(false);
                                    setLongitude('');
                                    setLattitude('');
                                }}
                                disabled={disableMapFilter}
                                error={wardError}
                            >
                                {wards && wards.filter(item => item.municipality === municipalityId)
                                    .map(item => Number(item.title)).sort((a, b) => a - b)
                                    .map(item => (
                                        <MenuItem key={item} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                            </Select>
                            {wardError ? <FormHelperText style={{ color: '#f44336', marginLeft: '14px' }}>Ward is Required</FormHelperText> : ''}
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
                    <div className={styles.threeInputSections}>
                        <TextField
                            variant="outlined"
                            className={styles.materialUiInput}
                            value={lattitude}
                            onChange={(e) => {
                                setLattitude(e.target.value);
                                setLatError(false);
                            }}
                            error={latError}
                            helperText={latError ? 'This field is required' : null}
                            id="outlined-basic"
                            label="Lattitude"
                        />

                        <TextField
                            variant="outlined"
                            className={styles.materialUiInput}
                            value={longitude}
                            onChange={(e) => {
                                setLongitude(e.target.value);
                                setLongError(false);
                            }}
                            error={longError}
                            helperText={longError ? 'This field is required' : null}
                            id="outlined-basic"
                            label="Longitude"
                        />
                        <div className={styles.saveOrAddButtons}>
                            <button
                                type="button"
                                onClick={setCoordinateonClick}
                                className={styles.submitButtons}
                                disabled={!longitude || !lattitude}
                            >
                                Set Location

                            </button>
                        </div>
                    </div>

                    <Map
                        centriodsForMap={centriodsForMap}
                        initialProvinceCenter={initialProvinceCenter}
                        initialDistrictCenter={initialDistrictCenter}
                        initialMunCenter={initialMunCenter}
                        editedCoordinates={mapDataIncidentEdit}
                        disableMapFilterLofic={disableMapFilterLofic}
                        disableMapFilter={disableMapFilter}
                        userProvince={userProvince}
                        userDistrict={userDistrict}
                        userMunicipality={userMunicipality}
                        bounds={bounds}
                        setLatError={setLatError}
                        setLongError={setLongError}
                        mapRef={mapRef}
                        markerRef={markerRef}

                    />

                    <div className={styles.infoBarCasuality}>
                        <p className={styles.instInfo}>
                            <span style={{ color: '#003572' }} />
                            Loss Statistics of the area
                        </p>
                    </div>
                    <div className={styles.mycontainer}>
                        {/* <div className={styles.innerContainer}>
                                    <div className={styles.label}>Dead</div>
                                </div> */}
                        <TextField
                            className={styles.hazardInducer}
                            error={teError}
                            helperText={teError ? 'This field is required' : null}
                            variant="outlined"
                            value={totalEstimatedLoss}

                            onChange={(e) => {
                                setTotalEstimatedLoss(e.target.value);
                                setteError(false);
                            }}
                            id="outlined-basic"
                            label="Total Estimated Loss (NPR)"
                        />
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
                        {/* <div className={styles.saveOrAddButtons}>
                                <button className={styles.submitButtons} onClick={handleEpidemicFormSubmit} type="submit">{uniqueId ? 'Update' : 'Save and New'}</button>
                            </div> */}
                        <div className={styles.saveOrAddButtons} style={{ justifyContent: 'flex-end' }}>
                            <button className={styles.submitButtons} type="submit" onClick={handleSave}>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};


export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            General,
        ),
    ),
);
