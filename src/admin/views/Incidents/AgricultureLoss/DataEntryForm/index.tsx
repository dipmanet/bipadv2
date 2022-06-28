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
        url: '/loss-agriculture/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            // props.setEpidemicsPage({ lossID: response.id });

            if (params && params.setAgricultureLossRespId) {
                params.setAgricultureLossRespId(response.id);
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

};

const DataEntryForm = ({ requests: { lossInfrastructure }, open,
    handleCloseModal, epidemmicsPage: { lossID }, countryList, handlePeopleLoss,
    infrastructureType, infrastructureUnit,
    resource,
    resourceTypeList, agricultureType }) => {
    const [loader, setLoader] = useState(false);
    const [beneficiaryOwner, setBeneficiaryOwner] = useState('');
    const [beneficiaryCount, setBeneficiaryCount] = useState('');
    const [status, setStatus] = useState('');
    const [statusId, setStatusId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [economicLoss, setEconomicLoss] = useState('');
    const [typeId, setTypeId] = useState('');
    const [agricultureLossRespId, setAgricultureLossRespId] = useState('');
    const [statusErr, setStatusErr] = useState(false);
    const [economicLossErr, setEconomicLossErr] = useState(false);

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

    const handleSelectedType = (e) => {
        setTypeId(e.target.value);
    };
    const clearFormData = () => {
        setStatus('');
        setStatusId('');
        setQuantity('');
        setBeneficiaryOwner('');
        setBeneficiaryCount('');
        setEconomicLoss('');
        setTypeId('');
        setTypeId('');
    };

    const handleSubmit = () => {
        if (!economicLoss) {
            setEconomicLossErr(true);
        } else {
            setEconomicLossErr(false);
        }
        if (!status) {
            setStatusErr(true);
        } else {
            setStatusErr(false);
        }
        if (economicLoss && status) {
            setLoader(true);
            const finalSubmissionData = {
                quantity,
                beneficiaryOwner,
                beneficiaryCount,
                economicLoss,
                type: typeId,
                loss: lossID,
                status: statusId,
            };
            lossInfrastructure.do({
                body: finalSubmissionData,
                setLoader,
                clearFormData,
                setAgricultureLossRespId,
            });
        }
    };
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
                                Agriculture Loss Information

                            </h3>
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
                                <TextField
                                    type="number"
                                    variant="outlined"
                                    className={styles.materialUiInput}
                                    value={quantity}
                                    onChange={(e) => {
                                        setQuantity(e.target.value);
                                    }}
                                    id="outlined-basic"
                                    label="Quantity"
                                />
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


                            <div className={styles.twoInputSections}>
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
                                    {statusErr ? (
                                        <FormHelperText
                                            style={{ color: '#f44336', marginLeft: '14px' }}
                                        >
                                            Status is Required
                                        </FormHelperText>
                                    ) : ''}
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="hazard-label">Type</InputLabel>
                                    <Select
                                        labelId="status"
                                        id="status-select"
                                        value={typeId}
                                        label="Type"
                                        onChange={handleSelectedType}
                                    >
                                        {agricultureType.length && agricultureType.map(
                                            item => (
                                                <MenuItem
                                                    key={item.displayName}
                                                    value={item.id}
                                                >
                                                    {item.title}
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
                            <div className={styles.checkBoxArea}>


                                <div className={styles.saveOrAddButtons}>
                                    <button className={styles.cancelButtons} onClick={() => handleCloseModal(agricultureLossRespId)} type="submit">Close</button>
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
