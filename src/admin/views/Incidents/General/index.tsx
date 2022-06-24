/* eslint-disable max-len */
/* eslint-disable react/jsx-indent */
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker } from '@mui/lab';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Map from 'src/admin/components/Mappointpicker';
import { connect } from 'react-redux';
import { createRequestClient, methods } from '@togglecorp/react-rest-request';
import Loader from 'react-loader';
import styles from '../styles.module.scss';
import Ideaicon from '../../../resources/ideaicon.svg';
import { createConnectedRequestCoordinator } from '#request';
import { SetEpidemicsPageAction } from '#actionCreators';

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setEpidemicsPage: params => dispatch(SetEpidemicsPageAction(params)),
});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    loss: {
        url: '/loss/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            props.setEpidemicsPage({ lossID: response.id });
            if (params && params.clearData) {
                params.clearData();
            }
            if (params && params.setLoader) {
                params.setLoader(false);
            }
            if (params && params.handleNext) {
                params.handleNext(2);
            }
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

};


const General = ({ validationError,
    uniqueId, setuniqueId, reportedDate, setReportedDate, dateError, hazardList,
    selectedHazardName, handleSelectedHazard,
    cause, setCause, provinceName, handleProvince, provinces,
    districtName, handleDistrict,
    districts, provinceId, municipalityName, handleMunicipality,
    municipalities, districtId,
    wardName, handleWard, wards, municipalityId,
    streetAddress, setStreetAddress,
    lattitude, setLattitude, latError, longitude, setLongitude, longError,
    centriodsForMap, initialProvinceCenter,
    initialDistrictCenter, initialMunCenter, incidentEditData, disableMapFilterLofic,
    disableMapFilter, teError,
    totalEstimatedLoss, setTotalEstimatedLoss,
    verified, handleVerifiedChange, notVerified, handleNotVerifiedChange,
    verificationMessage, setVerificationMessage,
    approved, handleApprovedChange, notApproved, handleNotApprovedChange, handleTableButton, handleEpidemicFormSubmit,
    handleNext, clearData, user: { profile: { province: userProvince, district: userDistrict, municipality: userMunicipality } }, requests: { loss } }) => {
    const [loader, setLoader] = useState(false);


    const handleSave = async () => {
        const lossFormData = {
            estimatedLoss: Number(totalEstimatedLoss),
        };
        setLoader(true);
        await loss.do({ body: lossFormData, setLoader, handleNext, clearData });
    };
    console.log('This is userProvince', userProvince);


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
                                onChange={handleSelectedHazard}
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
                                onChange={handleProvince}
                                disabled={userProvince}
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
                                onChange={handleDistrict}
                                disabled={userDistrict}
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
                                onChange={handleMunicipality}
                                disabled={userMunicipality}
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
                                onChange={handleWard}
                                disabled={disableMapFilter}
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
                        editedCoordinates={incidentEditData}
                        disableMapFilterLofic={disableMapFilterLofic}
                        disableMapFilter={disableMapFilter}
                        userProvince={userProvince}
                        userDistrict={userDistrict}
                        userMunicipality={userMunicipality}
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

                            onChange={e => setTotalEstimatedLoss(e.target.value)}
                            id="outlined-basic"
                            label="Total Estimated Loss (NPR)"
                        />
                    </div>

                    {/* <div className={styles.mycontainer}>
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
                                    <div className={styles.label}>Injured</div>
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
                                <div className={styles.innerContainer}>
                                    <div className={styles.label}>Missing</div>
                                    <TextField
                                        className={styles.deadandaffected}
                                        value={missingMale}
                                        error={amError}
                                        helperText={amError ? 'This field is required' : null}
                                        onChange={e => setMissingMale(e.target.value)}
                                        id="outlined-basic"
                                        label="Total no. of male"
                                        variant="outlined"
                                    />
                                    <TextField
                                        className={styles.deadandaffected}
                                        value={missingFemale}
                                        error={afError}
                                        helperText={afError ? 'This field is required' : null}
                                        onChange={e => setMissingFemale(e.target.value)}
                                        id="outlined-basic"
                                        label="Total no. of female"
                                        variant="outlined"
                                    />
                                    <TextField
                                        className={styles.deadandaffected}
                                        value={missingOther}
                                        error={aoError}
                                        helperText={aoError ? 'This field is required' : null}
                                        onChange={e => setMissingOther(e.target.value)}
                                        id="outlined-basic"
                                        label="Total no. of others"
                                        variant="outlined"
                                    />
                                    <TextField
                                        className={styles.deadandaffected}
                                        value={missingDisabled}
                                        error={adError}
                                        helperText={adError ? 'This field is required' : null}
                                        onChange={e => setMissingDisabled(e.target.value)}
                                        id="outlined-basic"
                                        label="Total no. of disabled"
                                        variant="outlined"
                                    />
                                </div>
                            </div>

                            <div className={styles.infoBarCasuality}>
                                <p className={styles.instInfo}>
                                    <span style={{ color: '#003572' }} />
                                    Loss and Damage by Incidents
                                </p>
                            </div>
                            <div className={styles.mycontainer}>
                                <div className={styles.innerContainer}>
                                    <div className={styles.label}>Loss</div>
                                    <TextField
                                        className={styles.deadandaffected}
                                        error={teError}
                                        helperText={teError ? 'This field is required' : null}
                                        variant="outlined"
                                        value={totalEstimatedLoss}

                                        onChange={e => setTotalEstimatedLoss(e.target.value)}
                                        id="outlined-basic"
                                        label="Total Estimated Loss (NPR)"
                                    />
                                    <TextField
                                        className={styles.deadandaffected}
                                        error={aeError}
                                        helperText={aeError ? 'This field is required' : null}
                                        value={agricultureEconomicLoss}
                                        onChange={e => setAgricultureEconomicLoss(e.target.value)}
                                        id="outlined-basic"
                                        label="Agriculture Economic Loss (NPR)"
                                        variant="outlined"
                                    />
                                    <TextField
                                        className={styles.deadandaffected}
                                        value={infrastructureEconomicLoss}
                                        error={ieError}
                                        helperText={ieError ? 'This field is required' : null}
                                        // eslint-disable-next-line max-len
                                        // eslint-disable-next-line max-len
                                        onChange={e => setInfrastructureEconomicLoss(e.target.value)}
                                        id="outlined-basic"
                                        label="Infrastructure Economic Loss (NPR)"
                                        variant="outlined"

                                    />
                                </div>
                                <div className={styles.innerContainer}>
                                    <div className={styles.label}>Damage</div>
                                    <TextField
                                        className={styles.deadandaffected}
                                        error={idError}
                                        helperText={idError ? 'This field is required' : null}
                                        variant="outlined"
                                        value={infrastructureDestroyed}

                                        onChange={e => setInfrastructureDestroyed(e.target.value)}
                                        id="outlined-basic"
                                        label="Total Infrastructure Destroyed"
                                    />
                                    <TextField
                                        className={styles.deadandaffected}
                                        error={hdError}
                                        helperText={hdError ? 'This field is required' : null}
                                        value={houseDestroyed}
                                        onChange={e => setHouseDestroyed(e.target.value)}
                                        id="outlined-basic"
                                        label="Total House Destroyed"
                                        variant="outlined"
                                    />
                                    <TextField
                                        className={styles.deadandaffected}
                                        value={houseAffected}
                                        error={haError}
                                        helperText={haError ? 'This field is required' : null}
                                        onChange={e => setHouseAffected(e.target.value)}
                                        id="outlined-basic"
                                        label="Total House Affected"
                                        variant="outlined"

                                    />
                                    <TextField
                                        className={styles.deadandaffected}
                                        value={livestockDestroyed}
                                        error={ldError}
                                        helperText={ldError ? 'This field is required' : null}
                                        onChange={e => setLivestockDestroyed(e.target.value)}
                                        id="outlined-basic"
                                        label="Total livestock Destroyed"
                                        variant="outlined"
                                    />
                                </div>
                            </div>
                            */}
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
                        <div className={styles.saveOrAddButtons}>
                            <button className={styles.submitButtons} type="submit" onClick={handleSave}>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};


export default connect(null, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            General,
        ),
    ),
);
