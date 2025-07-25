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
import { createConnectedRequestCoordinator } from '#request';
import { countryListSelector, epidemicsPageSelector, resourceTypeListSelector } from '#selectors';
import { SetEpidemicsPageAction } from '#actionCreators';
import styles from './styles.module.scss';

const mapStateToProps = (state, props) => ({
    // provinces: provincesSelector(state),
    // districts: districtsSelector(state),
    // municipalities: municipalitiesSelector(state),
    // wards: wardsSelector(state),
    epidemmicsPage: epidemicsPageSelector(state),
    resourceTypeList: resourceTypeListSelector(state),

    // user: userSelector(state),
});
const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setEpidemicsPage: params => dispatch(SetEpidemicsPageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    lossInfrastructure: {
        url: '/loss-infrastructure/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            // props.setEpidemicsPage({ lossID: response.id });

            if (params && params.setInfrastructureLossRespId) {
                params.setInfrastructureLossRespId(response.id);
            }
            if (params && params.setLoader) {
                params.setLoader(false);
            }
            if (params && params.clearFormData) {
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
    lossInfrastructureEdit: {
        url: ({ params }) => `/loss-infrastructure/${params.id}/`,
        method: methods.PUT,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            props.setEpidemicsPage({ infrastructureLossEditData: {} });
            if (params && params.testUpdateCondition) {
                params.testUpdateCondition();
            }
            if (params && params.setInfrastructureLossRespId) {
                params.setInfrastructureLossRespId(response.id);
            }
            if (params && params.setLoader) {
                params.setLoader(false);
            }
            if (params && params.clearFormData) {
                params.clearFormData();
            }
            if (params && params.openDataForm) {
                params.openDataForm();
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

const DataEntryForm = ({ requests: { lossInfrastructure, lossInfrastructureEdit }, open,
    testUpdateCondition,
    handleCloseModal, epidemmicsPage: { lossID, infrastructureLossEditData },
    countryList, handlePeopleLoss,
    infrastructureType, infrastructureUnit,
    resource, setEpidemicsPage,
    resourceTypeList, openDataForm }) => {
    const [loader, setLoader] = useState(false);
    const [title, setTitle] = useState('');
    const [statusId, setStatusId] = useState('');
    const [count, setCount] = useState(1);
    const [equipmentValue, setEquipmentValue] = useState('');
    const [infrastructureValue, setInfrastructureValue] = useState('');
    const [beneficiaryOwner, setBeneficiaryOwner] = useState('');
    const [beneficiaryCount, setBeneficiaryCount] = useState('');
    const [serviceDisrupted, setServiceDisrupted] = useState(false);
    const [economicLoss, setEconomicLoss] = useState('');
    const [typeId, setTypeId] = useState('');
    const [selectedresource, setSelectedResource] = useState('');
    const [selectedResourceId,
        setSelectedResourceId] = useState('');// resource id to be sent to backend
    const [unitId, setunitId] = useState('');
    const [infrastructureLossRespId, setInfrastructureLossRespId] = useState('');
    const [editedData, setEditedData] = useState(false);

    const [titleErr, setTitleErr] = useState(false);
    const [statusErr, setStatusErr] = useState(false);
    const [economicLossErr, setEconomicLossErr] = useState(false);
    const [resourceType, setResourceType] = useState('');
    const [resourceMainList, setResourceMainList] = useState([]);
    const [uniqueId, setUniqueId] = useState('');

    useEffect(() => {
        if (Object.keys(infrastructureLossEditData).length > 0) {
            setTitle(infrastructureLossEditData.title);
            setStatusId(infrastructureLossEditData.status);
            setEquipmentValue(infrastructureLossEditData.equipmentValue);
            setInfrastructureValue(infrastructureLossEditData.infrastructureValue);
            setBeneficiaryOwner(infrastructureLossEditData.beneficiaryOwner);
            setBeneficiaryCount(infrastructureLossEditData.beneficiaryCount);
            setServiceDisrupted(infrastructureLossEditData.serviceDisrupted);
            setEconomicLoss(infrastructureLossEditData.economicLoss);
            setTypeId(infrastructureLossEditData.type);
            setunitId(infrastructureLossEditData.unit);
            setSelectedResourceId(infrastructureLossEditData.resource);
            setUniqueId(infrastructureLossEditData.id);
            setEditedData(true);
            setResourceMainList(resource);
        }
    }, [infrastructureLossEditData, resource]);

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
        setStatusId(e.target.value);
    };
    const clearFormData = () => {
        setResourceType('');
        setTitle('');
        setStatusId('');
        setEquipmentValue('');
        setInfrastructureValue('');
        setBeneficiaryOwner('');
        setBeneficiaryCount('');
        setServiceDisrupted(false);
        setEconomicLoss('');
        setTypeId('');
        setSelectedResource('');
        setSelectedResourceId('');
        setunitId('');
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
        if (!statusId) {
            setStatusErr(true);
        } else {
            setStatusErr(false);
        }
        if (title && economicLoss && statusId) {
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
                loss: lossID,
                status: statusId,
            };
            lossInfrastructure.do({
                body: finalSubmissionData,
                setLoader,
                clearFormData,
                setInfrastructureLossRespId,
            });
        }
    };


    const handleEditedData = () => {
        if (!title) {
            setTitleErr(true);
        } else {
            setTitleErr(false);
        } if (!economicLoss) {
            setEconomicLossErr(true);
        } else {
            setEconomicLossErr(false);
        }
        if (!statusId) {
            setStatusErr(true);
        } else {
            setStatusErr(false);
        }
        if (title && economicLoss && statusId) {
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
                loss: lossID,
                status: statusId,
            };
            lossInfrastructureEdit.do({
                body: finalSubmissionData,
                setLoader,
                clearFormData,
                setInfrastructureLossRespId,
                testUpdateCondition,
                id: uniqueId,
                openDataForm: openDataForm(false),
            });
        }
    };
    const handleResourceType = (e) => {
        const filteredResourceName = resourceTypeList.find(i => i.title === e.target.value).label;
        setSelectedResourceId('');
        setResourceType(e.target.value);
        const filteredResourceList = resource
            .filter(d => d.resourceType === e.target.value);
        setResourceMainList(filteredResourceList);
    };

    const handleResource = (e) => {
        setSelectedResourceId(e.target.value);
    };

    const handleInfrastructureType = (e) => {
        setTypeId(e.target.value);
    };
    const handleInfrastructureUnit = (e) => {
        setunitId(e.target.value);
    };
    const handleVerifiedChange = () => {
        setServiceDisrupted(!serviceDisrupted);
    };


    return (
        <div>
            <Modal
                open={open}
                // onClose={handleCloseModal}
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
                                    <InputLabel id="hazard-label">Status</InputLabel>
                                    <Select
                                        labelId="status"
                                        id="status-select"
                                        value={statusId}
                                        label="Status"
                                        error={statusErr}
                                        onChange={handleSelectedStatus}
                                    >
                                        {statusData.length && statusData.map(
                                            item => (
                                                <MenuItem
                                                    key={item.value}
                                                    value={item.value}
                                                >
                                                    {item.displayName}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>
                                    {statusErr ? (
                                        <FormHelperText
                                            style={{ color: '#f44336', marginLeft: '14px' }}
                                        >
                                            Status is Required
                                        </FormHelperText>
                                    ) : ''}
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

                                <FormControl fullWidth>
                                    <InputLabel id="hazard-label">Resource </InputLabel>
                                    <Select
                                        labelId="gender"
                                        id="gender-select"
                                        value={selectedResourceId}
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

                                <TextField
                                    type="number"
                                    variant="outlined"
                                    className={styles.materialUiInput}
                                    value={equipmentValue}
                                    onChange={(e) => {
                                        setEquipmentValue(e.target.value);
                                    }}
                                    id="outlined-basic"
                                    label="Equipment Value"
                                />
                                <TextField
                                    type="number"
                                    variant="outlined"
                                    className={styles.materialUiInput}
                                    value={infrastructureValue}
                                    onChange={(e) => {
                                        setInfrastructureValue(e.target.value);
                                    }}
                                    id="outlined-basic"
                                    label="Infrastructure Value"

                                />
                            </div>
                            <div className={styles.twoInputSections}>

                                <TextField
                                    variant="outlined"
                                    className={styles.materialUiInput}
                                    value={beneficiaryOwner}
                                    onChange={(e) => {
                                        setBeneficiaryOwner(e.target.value);
                                    }}
                                    id="outlined-basic"
                                    label="Beneficiary Owner"
                                />
                                <TextField
                                    type="number"
                                    variant="outlined"
                                    className={styles.materialUiInput}
                                    value={beneficiaryCount}
                                    onChange={(e) => {
                                        setBeneficiaryCount(e.target.value);
                                    }}
                                    id="outlined-basic"
                                    label="Beneficiary Count"

                                />
                            </div>
                            <div className={styles.twoInputSections}>


                                <FormControl fullWidth>
                                    <InputLabel id="hazard-label">Infrastructure Type </InputLabel>
                                    <Select
                                        labelId="gender"
                                        id="gender-select"
                                        value={typeId}
                                        label="Infrastructure Type"
                                        onChange={handleInfrastructureType}
                                    >
                                        {infrastructureType.length && infrastructureType.map(
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
                                <FormControl fullWidth>
                                    <InputLabel id="hazard-label">Infrastructure Unit </InputLabel>
                                    <Select
                                        labelId="gender"
                                        id="gender-select"
                                        value={unitId}
                                        label="Infrastructure Type"
                                        onChange={handleInfrastructureUnit}
                                    >
                                        {infrastructureUnit.length && infrastructureUnit.map(
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
                            <div>
                                <TextField
                                    type="number"
                                    variant="outlined"
                                    className={styles.materialUiInput}
                                    value={economicLoss}
                                    onChange={(e) => {
                                        setEconomicLoss(e.target.value);
                                    }}
                                    id="outlined-basic"
                                    label="Economic Loss"
                                    error={economicLossErr}
                                    helperText={economicLossErr ? 'This field is required' : null}
                                />
                            </div>
                            <div>
                                <div className={styles.checkBoxArea}>
                                    <div className={styles.verified}>
                                        <p className={styles.verifiedOrApproved}>
                                            Is Service Disrupted?

                                        </p>

                                        <input
                                            type="checkbox"
                                            name="verifiedCheck"
                                            id="verified"
                                            checked={serviceDisrupted}
                                            onChange={e => handleVerifiedChange()}
                                        />
                                    </div>

                                </div>
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
                                    <button
                                        className={styles.cancelButtons}
                                        onClick={() => {
                                            setEpidemicsPage({ infrastructureLossEditData: {} });
                                            handleCloseModal(infrastructureLossRespId);
                                        }}
                                        type="submit"
                                    >
                                        Close

                                    </button>
                                    <button
                                        className={styles.submitButtons}
                                        type="submit"
                                        onClick={editedData ? handleEditedData : handleSubmit}
                                    >
                                        {' '}
                                        {editedData ? 'Save' : 'Add'}

                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            DataEntryForm,
        ),
    ),
);
