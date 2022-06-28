import React, { useState } from 'react';
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
import { countryListSelector, epidemicsPageSelector } from '#selectors';

const mapStateToProps = (state, props) => ({
    // provinces: provincesSelector(state),
    // districts: districtsSelector(state),
    // municipalities: municipalitiesSelector(state),
    // wards: wardsSelector(state),
    epidemmicsPage: epidemicsPageSelector(state),

    // user: userSelector(state),
});


const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    lossFamily: {
        url: '/loss-family/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            // props.setEpidemicsPage({ lossID: response.id });

            if (params && params.setFamilyLossRespId) {
                params.setFamilyLossRespId(response.id);
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

const DataEntryForm = ({ requests: { lossFamily }, open,
    handleCloseModal, epidemmicsPage: { lossID }, countryList, handlePeopleLoss }) => {
    const [loader, setLoader] = useState(false);
    const [title, setTitle] = useState('');
    const [isBelowPoverty, setIsBelowPoverty] = useState(false);
    const [count, setCount] = useState(1);
    const [status, setStatus] = useState('');
    const [statusId, setStatusId] = useState('');
    const [phoneNumber, setphoneNumber] = useState('');

    const [familyLossRespId, setFamilyLossRespId] = useState(null);
    const [titleErr, setTitleErr] = useState(false);
    const [statusErr, setStatusErr] = useState(false);


    const statusData = [
        {
            value: 'affected',
            displayName: 'Affected',
        },
        {
            value: 'relocated',
            displayName: 'Relocated',
        },
        {
            value: 'evacuated',
            displayName: 'Evacuated',
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
        setIsBelowPoverty(false);
        setphoneNumber('');
    };


    const handleVerifiedChange = () => {
        setIsBelowPoverty(!isBelowPoverty);
    };


    const handleSubmit = () => {
        if (!title) {
            setTitleErr(true);
        } else {
            setTitleErr(false);
        }
        if (!status) {
            setStatusErr(true);
        } else {
            setStatusErr(false);
        }
        if (title && status) {
            setLoader(true);
            const finalSubmissionData = {
                title,
                count,
                belowPoverty: isBelowPoverty,
                loss: lossID,
                status: statusId,
                phoneNumber,


            };
            lossFamily.do({
                body: finalSubmissionData,
                setLoader,
                clearFormData,
                setFamilyLossRespId,
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
                            <h3 className={styles.formGeneralInfo}>People Loss Information</h3>

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
                                <TextField
                                    type="number"
                                    variant="outlined"
                                    className={styles.materialUiInput}
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        setphoneNumber(e.target.value);
                                    }}
                                    id="outlined-basic"
                                    label="Contact"
                                />
                            </div>
                            <div>
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
                                    {statusErr ? <FormHelperText style={{ color: '#f44336', marginLeft: '14px' }}>Status is Required</FormHelperText> : ''}
                                </FormControl>
                            </div>
                            <div className={styles.checkBoxArea}>
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
                            </div>
                            <div className={styles.checkBoxArea}>
                                <div className={styles.saveOrAddButtons}>
                                    <button className={styles.cancelButtons} onClick={() => handleCloseModal(familyLossRespId)} type="submit">Close</button>
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
