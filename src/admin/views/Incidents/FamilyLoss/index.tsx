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
import Modal from 'src/admin/components/Modal';
import Box from '@mui/material/Box';
import styles from '../styles.module.scss';
import Ideaicon from '../../../resources/ideaicon.svg';
import { createConnectedRequestCoordinator } from '#request';
import { SetEpidemicsPageAction } from '#actionCreators';
import PeopleLossTable from './Table';
import DataEntryForm from './DataEntryForm';

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setEpidemicsPage: params => dispatch(SetEpidemicsPageAction(params)),
});


const FamilyLoss = ({ validationError,
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
    handleNext, requests: { loss }, countryList }) => {
    const [loader, setLoader] = useState(false);
    const [open, setOpen] = useState(false);
    const [familyLossResponseId, setFamilyLossResponseId] = useState(null);

    const handleCloseModal = (id) => {
        setOpen(false);
        setFamilyLossResponseId(id);
    };
    const handleSave = async () => {
        const lossFormData = {
            estimatedLoss: Number(totalEstimatedLoss),
        };
        setLoader(true);
        await loss.do({ body: lossFormData, setLoader, handleNext });
    };

    console.log('this open', open);
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
            <DataEntryForm
                open={open}
                handleCloseModal={handleCloseModal}
                countryList={countryList}
                openDataForm={setOpen}
            />

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
                    <h3 className={styles.formGeneralInfo}>Family Loss Information</h3>
                    <span className={styles.ValidationErrors}>{validationError}</span>
                    <PeopleLossTable
                        familyLossResponseId={familyLossResponseId}
                        openDataForm={setOpen}
                    />


                    <div className={styles.checkBoxArea}>


                        {/* <div className={styles.saveOrAddButtons}>
                                <button className={styles.submitButtons} onClick={handleEpidemicFormSubmit} type="submit">{uniqueId ? 'Update' : 'Save and New'}</button>
                            </div> */}
                        <div className={styles.saveOrAddButtons}>
                            <button className={styles.addButtons} onClick={() => setOpen(true)} type="submit">Add Data</button>
                            <button className={styles.submitButtons} onClick={() => handleNext(2)} type="submit">Previous</button>
                            <button className={styles.submitButtons} onClick={() => handleNext(4)} type="submit">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};


export default connect(null, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient()(
            FamilyLoss,
        ),
    ),
);
