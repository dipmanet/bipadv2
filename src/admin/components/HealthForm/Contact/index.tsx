/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormControl } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { navigate } from '@reach/router';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker, TimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import AccentHeading from 'src/admin/components/AccentHeading';
import { connect } from 'react-redux';
import { FormDataType, institutionDetails, instDetail } from '../utils';
import NextButton from '../../NextButton';

import styles from './styles.module.scss';


import { SetHealthInfrastructurePageAction } from '#actionCreators';
import { healthInfrastructurePageSelector, userSelector } from '#selectors';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    healthInfrastructurePage: healthInfrastructurePageSelector(state),
    userDataMain: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setHealthInfrastructurePage: params => dispatch(SetHealthInfrastructurePageAction(params)),
});

type EventTarget = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>;

interface Props{
    handleFormData: (e: EventTarget, fN: string) => void;
    formData: FormDataType;
    progress: number;
    handleTime: (e: Date, fN: string) => void;
    getActiveMenu: (e: number) => void;
    activeMenu: number;
    handleProgress: (e: number) => void;

}

const Contact = (props: Props): JSX.Element => {
    const {
        handleFormData,
        handleTime,
        formData,
        progress,
        userDataMain,
        healthInfrastructurePage: {
            validationError,
        },
    } = props;

    const handleViewTableBtn = () => {
        navigate('/health-table');
    };
    useEffect(() => {
        window.scrollTo({ top: 400, left: 0 });
    }, []);

    const [fieldsToDisable, setDisableFields] = useState([]);
    const getDisabled = (field: string) => fieldsToDisable.includes(field);

    useEffect(() => {
        const allFields = Object.keys(institutionDetails);
        const fieldsToGiveValidator = ['hf_code', 'authority'];
        window.scrollTo({ top: 400, left: 0 });
        if (userDataMain.isSuperuser) {
            setDisableFields([]);
        } else if (
            userDataMain.profile && userDataMain.profile.role && userDataMain.profile.role === 'validator'
        ) {
            setDisableFields(allFields.filter(f => !fieldsToGiveValidator.includes(f)));
        } else if (
            userDataMain.profile && userDataMain.profile.role && userDataMain.profile.role === 'user'
        ) {
            setDisableFields(allFields.filter(f => fieldsToGiveValidator.includes(f)));
        } else if (
            userDataMain.profile && userDataMain.profile.role && userDataMain.profile.role === 'editor'
        ) {
            setDisableFields([]);
        } else {
            setDisableFields(allFields);
        }
    }, [userDataMain.isSuperuser, userDataMain.profile]);

    return (
        <>
            <div className={styles.rowTitle1}>
                <h2>Contact Details</h2>
                <button
                    className={styles.viewTablebtn}
                    onClick={handleViewTableBtn}
                    type="button"
                >
                    View Data Table
                </button>
            </div>
            <div className={styles.rowTitle2}>
                <FontAwesomeIcon
                    icon={faInfoCircle}
                    className={styles.infoIcon}
                />
                <p>This section contains the contact details of the institution including its opening hours.</p>
            </div>
            <div className={styles.row3}>
                <AccentHeading
                    content={'Please enter data in each field as relevant to the health institution, ward is a required field'}
                />
            </div>
            <div className={styles.containerForm}>

                <h2>
               Contact Information
                </h2>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <TextField
                        disabled={getDisabled('phone_number')}
                        id="phone_numberID"
                        label="Phone Number"
                        variant="filled"
                        value={formData.phone_number}
                        onChange={e => handleFormData(e, 'phone_number')}
                        InputProps={{
                            disableUnderline: true,
                        }}
                        style={{ border: '1px solid #d5d5d5' }}
                    />
                </FormControl>
                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <TextField
                        disabled={getDisabled('email_address')}
                        id="email_addressID"
                        label="Email Address"
                        variant="filled"
                        value={formData.email_address}
                        onChange={e => handleFormData(e, 'email_address')}
                        InputProps={{
                            disableUnderline: true,
                        }}
                        style={{ border: '1px solid #d5d5d5' }}
                    />
                </FormControl>
                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <TextField
                        disabled={getDisabled('website')}
                        id="websiteID"
                        label="Website"
                        variant="filled"
                        value={formData.website}
                        onChange={e => handleFormData(e, 'website')}
                        InputProps={{
                            disableUnderline: true,
                        }}
                        style={{ border: '1px solid #d5d5d5' }}
                    />
                </FormControl>

                <h2>What are the hours of operation of this facility?</h2>
                <div className={styles.row1}>
                    <div className={styles.col1}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <TimePicker
                                label="Opening Time"
                                value={new Date(`2014-06-12T${formData.start_time}`)}
                                onChange={(e: Date) => handleTime(e, 'start_time')}
                                ampm={false}
                                renderInput={params => (
                                    <TextField
                                        fullWidth
                                        style={{ border: '1px solid #d5d5d5' }}
                                        variant="filled"
                                        className={styles.materialUiInput}
                                        {...params}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className={styles.col1}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <TimePicker
                                label="Closing Time"
                                value={new Date(`2014-06-12T${formData.end_time}`)}
                                onChange={(e: Date) => handleTime(e, 'end_time')}
                                ampm={false}
                                disabled={getDisabled('start_time')}
                                renderInput={params => (
                                    <TextField
                                        fullWidth
                                        style={{ border: '1px solid #d5d5d5' }}
                                        variant="filled"
                                        className={styles.materialUiInput}
                                        {...params}
                                    />
                                )}
                            />
                        </LocalizationProvider>

                    </div>
                </div>
                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <TextField
                        disabled={getDisabled('remarks_on_opening_hours')}
                        id="remarks"
                        label="Remarks on opening hours"
                        variant="filled"
                        value={formData.remarks_on_opening_hours}
                        onChange={e => handleFormData(e, 'remarks_on_opening_hours')}
                        InputProps={{
                            disableUnderline: true,
                        }}
                        style={{ border: '1px solid #d5d5d5' }}
                    />
                </FormControl>

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
    Contact,
);
