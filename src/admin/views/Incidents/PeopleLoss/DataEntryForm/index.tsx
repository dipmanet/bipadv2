import React, { useState, useEffect } from 'react';
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

            if (params && params.setPeopleLossRespId) {
                params.setPeopleLossRespId(response.id);
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
    lossPeopleEdit: {
        url: ({ params }) => `/loss-people/${params.id}/`,
        method: methods.PUT,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            // props.setEpidemicsPage({ lossID: response.id });

            if (params && params.setPeopleLossRespId) {
                params.setPeopleLossRespId(response.id);
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

const DataEntryForm = ({ requests: { lossPeople, lossPeopleEdit }, open,
    handleCloseModal, epidemmicsPage: { lossID, peopleLossEditData },
    countryList, handlePeopleLoss, openDataForm }) => {
    const [loader, setLoader] = useState(false);
    const [name, setName] = useState('');
    const [age, setAge] = useState(null);
    const [genderId, setGenderId] = useState(null);
    const [isBelowPoverty, setIsBelowPoverty] = useState(false);
    const [count, setCount] = useState(1);
    const [nationality, setNationality] = useState('');
    const [nationalityId, setNationalityId] = useState(null);
    const [disability, setDisability] = useState(false);
    const [statusId, setStatusId] = useState('');
    const [peopleLossRespId, setPeopleLossRespId] = useState(null);
    const [nameErr, setNameErr] = useState(false);
    const [ageErr, setAgeErr] = useState(false);
    const [genderErr, setGenderErr] = useState(false);
    const [statusErr, setStatusErr] = useState(false);
    const [disabilityId, setDisabilityId] = useState(null);
    const [editedData, setEditedData] = useState(false);
    const [uniqueId, setUniqueId] = useState('');
    useEffect(() => {
        if (Object.keys(peopleLossEditData).length > 0) {
            setName(peopleLossEditData.name);
            setAge(peopleLossEditData.age);
            setGenderId(peopleLossEditData.gender);
            setStatusId(peopleLossEditData.status);
            setNationalityId(peopleLossEditData.nationality);
            setIsBelowPoverty(peopleLossEditData.belowPoverty);
            setDisabilityId(peopleLossEditData.disability);
            setEditedData(true);
            setUniqueId(peopleLossEditData.id);
        }
    }, [peopleLossEditData]);
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


    const handleCountryList = (e) => {
        const selectedCountry = countryList.find(i => i.id === Number(e.target.value));
        const { id, titleEn } = selectedCountry;
        setNationalityId(id);
        setNationality(titleEn);
    };
    const handleSelectedGender = (e) => {
        setGenderId(e.target.value);
    };
    const handleSelectedStatus = (e) => {
        setStatusId(e.target.value);
    };
    const clearFormData = () => {
        setName('');
        setAge('');
        setGenderId('');
        setStatusId('');
        setIsBelowPoverty(false);
        setNationality('');
        setDisability(false);
        setNationality('');
        setNationalityId('');
        setDisabilityId(null);
    };


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
        if (!genderId) {
            setGenderErr(true);
        } else {
            setGenderErr(false);
        }
        if (!statusId) {
            setStatusErr(true);
        } else {
            setStatusErr(false);
        }
        if (name && age && genderId && statusId) {
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
            lossPeople.do({
                body: finalSubmissionData,
                setLoader,
                clearFormData,
                setPeopleLossRespId,
            });
        }
    };
    const handleEditedData = () => {
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
        lossPeopleEdit.do({
            body: finalSubmissionData,
            setLoader,
            clearFormData,
            setPeopleLossRespId,
            id: uniqueId,
            openDataForm: openDataForm(false),
        });
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
                                        value={genderId}
                                        label="Gender"
                                        error={genderErr}
                                        onChange={handleSelectedGender}
                                    >
                                        {genderData.length && genderData.map(
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
                                    {genderErr ? <FormHelperText style={{ color: '#f44336', marginLeft: '14px' }}>Gender is Required</FormHelperText> : ''}
                                </FormControl>
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
                                    <button className={styles.cancelButtons} onClick={() => handleCloseModal(peopleLossRespId)} type="submit">Close</button>
                                    <button
                                        className={styles.submitButtons}
                                        type="submit"
                                        onClick={editedData ? handleEditedData : handleSubmit}
                                    >
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

export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            DataEntryForm,
        ),
    ),
);
