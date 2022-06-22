import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import { DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@material-ui/core/TextField';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { connect } from 'react-redux';
import { createRequestClient, methods } from '@togglecorp/react-rest-request';
import Loader from 'react-loader';
import { FormHelperText } from '@material-ui/core';
import styles from './styles.module.scss';
import { createConnectedRequestCoordinator } from '#request';
import { countryListSelector, epidemicsPageSelector, resourceTypeListSelector } from '#selectors';

const mapStateToProps = (state, props) => ({
    // provinces: provincesSelector(state),
    // districts: districtsSelector(state),
    // municipalities: municipalitiesSelector(state),
    // wards: wardsSelector(state),
    epidemmicsPage: epidemicsPageSelector(state),
    resourceTypeList: resourceTypeListSelector(state),

    // user: userSelector(state),
});


const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    lossInfrastructure: {
        url: '/loss-infrastructure/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            // props.setEpidemicsPage({ lossID: response.id });
            console.log('This is params ', response);
            if (params && params.setPeopleLossRespId) {
                params.setPeopleLossRespId(response.id);
            }
            if (params && params.setLoader) {
                params.setLoader(false);
            }
            if (params && params.clearFormData) {
                console.log('This is params ', params);
                params.clearFormData();
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

};

const DataEntryForm = ({ requests: { lossInfrastructure }, open,
    handleCloseModal, epidemmicsPage: { lossID }, countryList, handlePeopleLoss,
    infrastructureType, infrastructureUnit,
    resource,
    backupWardId, resourceTypeList }) => {
    console.log('Data Entry');
    const [loader, setLoader] = useState(false);
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');
    const [statusId, setStatusId] = useState('');
    const [count, setCount] = useState(1);
    const [equipmentValue, setEquipmentValue] = useState(null);
    const [infrastructureValue, setInfrastructureValue] = useState(null);
    const [beneficiaryOwner, setBeneficiaryOwner] = useState('');
    const [beneficiaryCount, setBeneficiaryCount] = useState(null);
    const [serviceDisrupted, setServiceDisrupted] = useState(false);
    const [economicLoss, setEconomicLoss] = useState(null);
    const [type, setType] = useState('');
    const [typeId, setTypeId] = useState(null);
    const [selectedresource, setSelectedResource] = useState('');
    const [selectedResourceId,
        setSelectedResourceId] = useState(null);// resource id to be sent to backend
    const [unit, setUnit] = useState('');
    const [unitId, setunitId] = useState(null);
    const [infrastructureLossRespId, setInfrastructureLossRespId] = useState(null);


    const [titleErr, setTitleErr] = useState(false);
    const [statusErr, setStatusErr] = useState(false);
    const [economicLossErr, setEconomicLossErr] = useState(false);
    const [resourceType, setResourceType] = useState('');
    const [resourceMainList, setResourceMainList] = useState([]);


    console.log('This is loss id', countryList);
    console.log('infrastructureType', infrastructureType);
    console.log('infrastructureUnit', infrastructureUnit);
    console.log('resource', resource);
    console.log('backupWardId', backupWardId);
    console.log('resource type', resourceType);
    // useEffect(() => {
    //     const filteredResource = resource.filter(i => i.ward === backupWardId);
    //     setResourceMainList(filteredResource);
    // }, [backupWardId, resource]);

    const genderData = [
        {
            value: 'male',
            displayName: 'Male',
        },
        {
            value: 'female',
            displayName: 'Female',
        },
        {
            value: 'others',
            displayName: 'Others',

        }];

    const statusData = [
        {
            value: 'destroyed',
            displayName: 'Destroyed',
        },
        {
            value: 'affected',
            displayName: 'Affected',
        },
    ];


    const handleSelectedStatus = (e) => {
        const selectedStatus = statusData.find(i => i.displayName === e.target.value);
        const { displayName, value } = selectedStatus;
        setStatusErr(false);
        setStatus(displayName);
        setStatusId(value);
    };
    const clearFormData = () => {
        setTitle('');
        setStatus('');
        setStatusId(null);
        setEquipmentValue(null);
        setInfrastructureValue(null);
        setBeneficiaryOwner('');
        setBeneficiaryCount(null);
        setServiceDisrupted(false);
        setEconomicLoss(null);
        setType('');
        setTypeId(null);
        setSelectedResource(null);
        setSelectedResourceId(null);
        setUnit(null);
        setunitId(null);
    };

    const handleSubmit = () => {
        if (!title) {
            setTitleErr(true);
        } else {
            setTitleErr(false);
        } if (!economicLoss) {
            setEconomicLossErr(true);
        } else {
            setEconomicLossErr(false);
        }
        if (!status) {
            setStatusErr(true);
        } else {
            setStatusErr(false);
        }
        if (title && economicLoss && status) {
            setLoader(true);
            const finalSubmissionData = {
                title,
                count,
                equipmentValue,
                infrastructureValue,
                beneficiaryOwner,
                beneficiaryCount,
                serviceDisrupted,
                economicLoss,
                type: typeId,
                resource: selectedResourceId,
                unit: unitId,
            };
            lossInfrastructure.do({
                body: finalSubmissionData,
                setLoader,
                clearFormData,
                setInfrastructureLossRespId,
            });
        }
    };
    const handleResourceType = (e) => {
        const filteredResourceName = resourceTypeList.find(i => i.title === e.target.value).label;
        setResourceType(e.target.value);
        console.log('this is filteredResourceName', filteredResourceName);
        console.log('This is resource', resource);
        const filteredResourceList = resource
            .filter(i => i.ward === backupWardId)
            .filter(d => d.resourceType === e.target.value);
        console.log('This is ward', backupWardId);
        console.log('This is data', filteredResourceList);
        setResourceMainList(filteredResourceList);
        console.log('This is resource type', e);
    };

    const handleResource = (e) => {
        console.log('This value', e.target.value);
    };


    console.log('This is main list for filtering resource', resourceMainList);
    return (
        <div>
            <Modal
                open={open}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={styles.box}>
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
                    <div className={styles.mainDataEntrySection}>

                        <div>
                            <h3 className={styles.formGeneralInfo}>
                                Infrastructure Loss Information

                            </h3>

                            <div className={styles.twoInputSections}>
                                <TextField
                                    variant="outlined"
                                    className={styles.materialUiInput}
                                    value={title}
                                    onChange={(e) => {
                                        setTitleErr(false);
                                        setTitle(e.target.value);
                                    }}
                                    id="outlined-basic"
                                    label="Title"
                                    error={titleErr}
                                    helperText={titleErr ? 'This field is required' : null}
                                />
                                <FormControl fullWidth>
                                    <InputLabel id="hazard-label">Resource </InputLabel>
                                    <Select
                                        labelId="gender"
                                        id="gender-select"
                                        value={selectedresource}
                                        label="Resource"
                                        onChange={handleResource}
                                    >
                                        {resourceMainList.length && resourceMainList.map(
                                            item => (
                                                <MenuItem
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.title}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>

                                </FormControl>


                            </div>
                            <div className={styles.twoInputSections}>

                                <FormControl fullWidth>
                                    <InputLabel id="hazard-label">Resource Type</InputLabel>
                                    <Select
                                        labelId="gender"
                                        id="gender-select"
                                        value={resourceType}
                                        label="Resource Type"
                                        onChange={handleResourceType}
                                    >
                                        {resourceTypeList.length && resourceTypeList.map(
                                            item => (
                                                <MenuItem
                                                    key={item.id}
                                                    value={item.title}
                                                >
                                                    {item.label}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>

                                </FormControl>


                            </div>

                            {/* <div className={styles.twoInputSections}>
                                <FormControl fullWidth>
                                    <InputLabel id="hazard-label">Gender</InputLabel>
                                    <Select
                                        labelId="gender"
                                        id="gender-select"
                                        value={gender}
                                        label="Gender"
                                        error={genderErr}
                                        onChange={handleSelectedGender}
                                    >
                                        {genderData.length && genderData.map(
                                            item => (
                                                <MenuItem
                                                    key={item.displayName}
                                                    value={item.displayName}
                                                >
                                                    {item.displayName}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>
                                    {genderErr
                                        ? <FormHelperText
                                        style={{ color: '#f44336', marginLeft: '14px' }}>
                                        Gender is Required</FormHelperText>
                                         : ''}
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="hazard-label">Status</InputLabel>
                                    <Select
                                        labelId="status"
                                        id="status-select"
                                        value={status}
                                        label="Status"
                                        error={statusErr}
                                        onChange={handleSelectedStatus}
                                    >
                                        {statusData.length && statusData.map(
                                            item => (
                                                <MenuItem
                                                    key={item.displayName}
                                                    value={item.displayName}
                                                >
                                                    {item.displayName}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>
                                    {statusErr ? <FormHelperText
                                        style={{ color: '#f44336', marginLeft: '14px' }}>
                                        Status is Required</FormHelperText> : ''}
                                </FormControl>
                            </div> */}
                            {/* <div>
                                <FormControl fullWidth>
                                    <InputLabel id="hazard-label">Nationality</InputLabel>
                                    <Select
                                        labelId="status"
                                        id="status-select"
                                        value={nationalityId}
                                        label="Nationality"
                                        onChange={handleCountryList}
                                    >
                                        {countryList.length && countryList.map(
                                            item => (
                                                <MenuItem
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.titleEn}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>

                                </FormControl>
                            </div> */}
                            {/* <div className={styles.checkBoxArea}>
                                <div className={styles.verified}>
                                    <p className={styles.verifiedOrApproved}>
                                        Is Victim Below Poverty Line?

                                    </p>

                                    <input
                                        type="checkbox"
                                        name="verifiedCheck"
                                        id="verified"
                                        checked={isBelowPoverty}
                                        onChange={e => handleVerifiedChange()}
                                    />
                                </div>

                            </div> */}
                            {/* <div className={styles.checkBoxArea}>
                                <div className={styles.verified}>
                                    <p className={styles.verifiedOrApproved}>
                                        Is Victim Disable Person?

                                    </p>

                                    <input
                                        type="checkbox"
                                        name="verifiedCheck"
                                        id="verified"
                                        checked={disability}
                                        onChange={e => handleVerifiedDisability()}
                                    />


                                </div>

                            </div> */}
                            <div className={styles.checkBoxArea}>


                                <div className={styles.saveOrAddButtons}>
                                    <button className={styles.cancelButtons} onClick={() => handleCloseModal(infrastructureLossRespId)} type="submit">Close</button>
                                    <button className={styles.submitButtons} type="submit" onClick={handleSubmit}>Add</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            DataEntryForm,
        ),
    ),
);
