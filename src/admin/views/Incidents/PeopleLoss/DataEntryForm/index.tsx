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
    lossPeople: {
        url: '/loss-people/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            // props.setEpidemicsPage({ lossID: response.id });
            console.log('This is params ', params);
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

const DataEntryForm = ({ requests: { lossPeople }, open,
    handleCloseModal, epidemmicsPage: { lossID }, countryList }) => {
    console.log('Data Entry');
    const [loader, setLoader] = useState(false);
    const [name, setName] = useState('');
    const [age, setAge] = useState(null);
    const [gender, setGender] = useState('');
    const [genderId, setGenderId] = useState(null);
    const [isBelowPoverty, setIsBelowPoverty] = useState(false);
    const [count, setCount] = useState(1);
    const [nationality, setNationality] = useState('');
    const [nationalityId, setNationalityId] = useState(null);
    const [disability, setDisability] = useState(false);
    const [status, setStatus] = useState('');
    const [statusId, setStatusId] = useState('');

    const [nameErr, setNameErr] = useState(false);
    const [ageErr, setAgeErr] = useState(false);
    const [genderErr, setGenderErr] = useState(false);
    const [statusErr, setStatusErr] = useState(false);
    const [disabilityId, setDisabilityId] = useState(null);


    console.log('This is loss id', countryList);
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
            value: 'dead',
            displayName: 'Dead',
        },
        {
            value: 'missing',
            displayName: 'Missing',
        },
        {
            value: 'injured',
            displayName: 'Injured',
        },
        {
            value: 'affected',
            displayName: 'Affected',
        },
    ];
    console.log('Country list', countryList);
    const handleCountryList = (e) => {
        const selectedCountry = countryList.find(i => i.id === Number(e.target.value));
        const { id, titleEn } = selectedCountry;
        setNationalityId(id);
        setNationality(titleEn);
    };
    const handleSelectedGender = (e) => {
        const selectedGender = genderData.find(i => i.displayName === e.target.value);
        const { displayName, value } = selectedGender;
        setGenderErr(false);
        setGender(displayName);
        setGenderId(value);
    };
    const handleSelectedStatus = (e) => {
        const selectedStatus = statusData.find(i => i.displayName === e.target.value);
        const { displayName, value } = selectedStatus;
        setStatusErr(false);
        setStatus(displayName);
        setStatusId(value);
    };
    const clearFormData = () => {
        setName('');
        setAge('');
        setGender('');
        setGenderId(null);
        setStatus('');
        setStatusId(null);
        setIsBelowPoverty(false);
        setNationality('');
        setDisability(false);
        setNationality('');
        setNationalityId(null);
        setDisabilityId(null);
    };


    console.log('This is gender name', gender);
    console.log('This is gender id', genderId);
    const handleVerifiedChange = () => {
        setIsBelowPoverty(!isBelowPoverty);
    };

    const handleVerifiedDisability = () => {
        setDisability(!disability);
        if (disability) {
            setDisabilityId(null);
        } else {
            setDisabilityId(1);
        }
    };

    console.log('Nationality', nationality);
    console.log('Nationality id', nationalityId);

    const handleSubmit = () => {
        if (!name) {
            setNameErr(true);
        } else {
            setNameErr(false);
        } if (!age) {
            setAgeErr(true);
        } else {
            setAgeErr(false);
        }
        if (!gender) {
            setGenderErr(true);
        } else {
            setGenderErr(false);
        }
        if (!status) {
            setStatusErr(true);
        } else {
            setStatusErr(false);
        }
        if (name && age && gender && status) {
            setLoader(true);
            const finalSubmissionData = {
                name,
                age: Number(age),
                gender: genderId,
                count,
                belowPoverty: isBelowPoverty,
                nationality: nationalityId,
                loss: lossID,
                status: statusId,
                disability: disabilityId,


            };
            lossPeople.do({ body: finalSubmissionData, setLoader, clearFormData });
        }
    };

    console.log('nationality', nationality);
    console.log('This is age', age);
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
                                    value={name}
                                    onChange={(e) => {
                                        setNameErr(false);
                                        setName(e.target.value);
                                    }}
                                    id="outlined-basic"
                                    label="Name"
                                    error={nameErr}
                                    helperText={nameErr ? 'This field is required' : null}
                                />
                                <TextField
                                    type="number"
                                    variant="outlined"
                                    className={styles.materialUiInput}
                                    value={age}
                                    onChange={(e) => {
                                        setAgeErr(false);
                                        setAge(e.target.value);
                                    }}
                                    id="outlined-basic"
                                    label="Age"
                                    error={ageErr}
                                    helperText={ageErr ? 'This field is required' : null}
                                />
                            </div>

                            <div className={styles.twoInputSections}>
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
                                    {genderErr ? <FormHelperText style={{ color: '#f44336', marginLeft: '14px' }}>Gender is Required</FormHelperText> : ''}
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
                                    {statusErr ? <FormHelperText style={{ color: '#f44336', marginLeft: '14px' }}>Status is Required</FormHelperText> : ''}
                                </FormControl>
                            </div>
                            <div>
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

                            </div>
                            <div className={styles.checkBoxArea}>


                                <div className={styles.saveOrAddButtons}>
                                    <button className={styles.cancelButtons} onClick={handleCloseModal} type="submit">Close</button>
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
