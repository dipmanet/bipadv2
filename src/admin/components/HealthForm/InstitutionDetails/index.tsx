/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable max-len */
/* eslint-disable no-mixed-spaces-and-tabs */
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
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { navigate } from '@reach/router';
import { connect, useSelector } from 'react-redux';
import AccentHeading from 'src/admin/components/AccentHeading';
import { FormDataType, instDetail, institutionDetails } from '../utils';
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
    handleFormData?: (e: EventTarget, fN: string) => void;
    formData?: FormDataType;
    progress?: number;
    handleDate?: (e: Date, fN: string) => void;
    getActiveMenu?: (e: number) => void;
    activeMenu?: number;
    handleProgress: (e: number) => void;

}


const InstitutionDetails = (props: Props): JSX.Element => {
    const {
        handleFormData,
        handleDate,
        formData,
        progress,
        userDataMain,
        setHealthInfrastructurePage,
        healthInfrastructurePage: {
            validationError,
        },
    } = props;

    const [disabled, setDisabled] = useState<string|undefined>(undefined);
    const [error, setError] = useState<string|undefined>(undefined);
    const [fieldsToDisable, setDisableFields] = useState([]);
    // const navigate = useNavigate();
    const handleViewTableBtn = () => {
        navigate('/health-table');
    };


    const getDisabled = (field: string) => fieldsToDisable.includes(field);

    useEffect(() => {
        console.log('validationError', validationError);
    }, [validationError]);

    useEffect(() => {
        const allFields = Object.keys(institutionDetails);
        const fieldsToGiveValidator = ['is_verified', 'is_approved', 'verfication_message'];
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
    }, [userDataMain]);

    return (
        <>
            <div className={styles.rowTitle1}>
                <h2>Institution Details</h2>
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
                <p>
                    Institution details cover the general information of the health facility including the services provided, capacity, their status, and the employee details.
                </p>
            </div>
            <div className={styles.row3}>
                <AccentHeading
                    content={'Name of the health institution is a required field'}
                />
            </div>
            <div className={styles.containerForm}>

                <h2>Institutional Information</h2>
                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <TextField
                        id="outlined-basic"
                        label="HF CODE"
                        variant="filled"
                        value={formData.hf_code}
                        onChange={e => handleFormData(e, 'hf_code')}
                        InputProps={{ disableUnderline: true }}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disabled={getDisabled('hf_code')}
                    />
                </FormControl>
                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <TextField
                        error={typeof validationError === 'string'}
                        helperText={typeof validationError === 'string' ? 'This field is required' : null}
                        id="outlined-basic"
                        label="Name of the health institution"
                        variant="filled"
                        value={formData.title}
                        onChange={e => handleFormData(e, 'title')}
                        InputProps={{ disableUnderline: true }}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disabled={getDisabled('title')}
                    />
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="authorityInput">Authority</InputLabel>
                    <Select
                        disabled={getDisabled('authority')}
                        labelId="authorityLabel"
                        id="authority"
                        value={formData.authority}
                        label="Type of the facility"
                        onChange={e => handleFormData(e, 'authority')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Government'}>Government</MenuItem>
                        <MenuItem value={'Non Government'}>Non-Government</MenuItem>
                    </Select>
                </FormControl>
                {
                    formData.authority === 'Government'
                && (
                    <div className={styles.row1}>
                        <div className={styles.col1}>
                            <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                                <InputLabel id="authorityLevelInput">Authority Level</InputLabel>
                                <Select
                                    disabled={getDisabled('authority_level')}
                                    labelId="authorityLevelLabel"
                                    id="authorityLevel"
                                    value={formData.authority === 'Government' ? formData.authority_level : null}
                                    label="Authority Level"
                                    onChange={e => handleFormData(e, 'authority_level')}
                                    style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                                    disableUnderline
                                >
                                    <MenuItem value={'Federal'}>Federal</MenuItem>
                                    <MenuItem value={'Province'}>Province</MenuItem>
                                    <MenuItem value={'Local'}>Local</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className={styles.col1}>

                            <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>

                                <InputLabel id="ownershipInput">Ownership</InputLabel>
                                <Select
                                    disabled={getDisabled('ownership')}
                                    labelId="ownershipLabel"
                                    id="ownership"
                                    value={formData.authority === 'Government' ? formData.ownership : null}
                                    label="Ownership"
                                    onChange={e => handleFormData(e, 'ownership')}
                                    style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                                    disableUnderline
                                >
                                    {instDetail.Ownership.options.map(own => (
                                        <MenuItem key={own} value={own}>{own}</MenuItem>
                                    ))
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                )
                }

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="facilityTypeInput">Facility Type</InputLabel>
                    <Select
                        disabled={getDisabled('type')}
                        labelId="facilityTypeLabel"
                        id="facilityType"
                        value={formData.type}
                        label="Facility Type"
                        onChange={e => handleFormData(e, 'type')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        {
                            instDetail['Facility Type'].options.map(d => (
                                <MenuItem key={d} value={d}>{d}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="facilityTypeInput">Service Type</InputLabel>
                    <Select
                        disabled={getDisabled('service_type')}
                        labelId="service_typeLabel"
                        id="service_type"
                        value={formData.service_type}
                        label="Service Type"
                        onChange={e => handleFormData(e, 'service_type')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        {
                            instDetail['Service Type'].options.map(d => (
                                <MenuItem key={d} value={d}>{d}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="OperationalStatusInput">Operation Status</InputLabel>
                    <Select
                        disabled={getDisabled('operational_status')}
                        labelId="operational_statusLabel"
                        id="operational_status"
                        value={formData.operational_status}
                        label="Operation Status"
                        onChange={e => handleFormData(e, 'operational_status')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        {
                            instDetail['Operational Status'].options.map(d => (
                                <MenuItem key={d} value={d}>{d}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <TextField
                        id="bed_countId"
                        label="Bed Count"
                        variant="filled"
                        value={formData.bed_count}
                        onChange={e => handleFormData(e, 'bed_count')}
                        InputProps={{
                            disableUnderline: true,
                            inputMode: 'numeric',
                        }}
                        disabled={getDisabled('bed_count')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                    />
                </FormControl>


                <div className={styles.row1}>
                    <div className={styles.col1}>
                        <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                            <InputLabel id="Hospital-Bed-Input">Hospital Bed</InputLabel>
                            <Select
                                disabled={getDisabled('hospital_bed_count')}
                                labelId="Hospital BedLabel"
                                id="Hospital-Bed"
                                value={formData.hospital_bed_count}
                                label="Hospital Bed"
                                onChange={e => handleFormData(e, 'hospital_bed_count')}
                                style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                                disableUnderline
                            >
                                <MenuItem value={'Sanctioned'}>Sanctioned</MenuItem>
                                <MenuItem value={'Functional'}>Functional</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.col1}>
                        <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                            <InputLabel id="icu_bed_count_input">ICU Bed</InputLabel>
                            <Select
                                disabled={getDisabled('icu_bed_count')}
                                labelId="icu_bed_countlabel"
                                id="icu_bed_count"
                                value={formData.icu_bed_count}
                                label="ICU Bed"
                                onChange={e => handleFormData(e, 'icu_bed_count')}
                                style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                                disableUnderline
                            >
                                <MenuItem value={'Sanctioned'}>Sanctioned</MenuItem>
                                <MenuItem value={'Functional'}>Functional</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.col1}>
                        <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                            <InputLabel id="Ventilator-Bed-Input">Ventilator Bed</InputLabel>
                            <Select
                                disabled={getDisabled('ventilator_bed_count')}
                                labelId="Ventilator-Bed-Label"
                                id="Ventilator-Bed_ID"
                                value={formData.ventilator_bed_count}
                                label="Hospital Bed"
                                onChange={e => handleFormData(e, 'ventilator_bed_count')}
                                style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                                disableUnderline
                            >
                                <MenuItem value={'Sanctioned'}>Sanctioned</MenuItem>
                                <MenuItem value={'Functional'}>Functional</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <h2>
                Select the services offered at the facility
                </h2>
                <div className={styles.checkBoxGrp}>
                    <Box sx={{ display: 'flex' }}>
                        <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                            <FormGroup>
                                {
                                    Object.keys(instDetail['Services available']
                                        .ref).slice(0, 3).map((item: string) => (
                                            <FormControlLabel
                                                control={(
                                                    <Checkbox
                                                        disabled={getDisabled(instDetail['Services available'].ref[item])}
                                                        checked={formData[instDetail['Services available'].ref[item]]}
                                                        onChange={(e => handleFormData(e, instDetail['Services available'].ref[item]))}
                                                    />
                                            )}
                                                label={item}
                                                key={item}
                                            />
                                    ))
                                }
                            </FormGroup>
                        </FormControl>
                        <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                            <FormGroup>
                                {
                                Object.keys(instDetail['Services available'].ref).slice(-3).map((item: string) => (
                                    <FormControlLabel
                                        control={(
                                            <Checkbox
                                                disabled={getDisabled(instDetail['Services available'].ref[item])}
                                                checked={formData[instDetail['Services available'].ref[item]]}
                                                onChange={(e => handleFormData(e, instDetail['Services available'].ref[item]))}
                                            />
                                            )}
                                        label={item}
                                        key={item}
                                    />
                                    ))
                                    }
                            </FormGroup>
                        </FormControl>
                    </Box>
                    {
                    formData.has_safe_motherhood
                    && (
                    <>
                        <h2>Please select all services available</h2>
                        <Box sx={{ display: 'flex' }}>
                            <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                                <FormGroup>
                                    {
                                    Object.keys(instDetail['Services available (if yes)'].ref).slice(0, 4).map((item: string) => (
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    disabled={getDisabled(instDetail['Services available (if yes)'].ref[item])}
                                                    checked={formData.has_safe_motherhood ? formData[instDetail['Services available (if yes)'].ref[item]] : null}
                                                    onChange={(e => handleFormData(e, instDetail['Services available (if yes)'].ref[item]))}
                                                />
                                                )}
                                            label={item}
                                            key={item}
                                        />
                                        ))
                                        }
                                </FormGroup>
                            </FormControl>
                            <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                                <FormGroup>
                                    {
                                    Object.keys(instDetail['Services available (if yes)'].ref).slice(-3).map((item: string) => (
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    disabled={getDisabled(instDetail['Services available (if yes)'].ref[item])}
                                                    checked={formData.has_safe_motherhood ? formData[instDetail['Services available (if yes)'].ref[item]] : null}
                                                    onChange={(e => handleFormData(e, instDetail['Services available (if yes)'].ref[item]))}
                                                />
                            )}
                                            label={item}
                                            key={item}
                                        />
                    ))
                    }
                                </FormGroup>
                            </FormControl>
                        </Box>
                    </>
                    )
                    }


                </div>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="family_planning-Input">Family Planning</InputLabel>
                    <Select
                        disabled={getDisabled('family_planning')}
                        labelId="family_planning-Label"
                        id="family_planning_ID"
                        value={formData.family_planning ? 'Yes' : 'No'}
                        label="Family Planning"
                        onChange={e => handleFormData(e, 'family_planning')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>
                {
                formData.family_planning
                && (
                <>
                    <h2>Please select all that apply</h2>
                    <div className={styles.checkBoxGrp}>

                        <Box sx={{ display: 'flex' }}>
                            <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                                <FormGroup>
                                    {
                                    Object.keys(instDetail['Family Planning (if yes)'].ref).slice(0, 3).map((item: string) => (
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    disabled={getDisabled(instDetail['Family Planning (if yes)'].ref[item])}
                                                    checked={formData[instDetail['Family Planning (if yes)'].ref[item]]}
                                                    onChange={(e => handleFormData(e, instDetail['Family Planning (if yes)'].ref[item]))}
                                                />
                                                )}
                                            label={item}
                                            key={item}
                                        />
                                        ))
                                        }
                                </FormGroup>
                            </FormControl>
                            <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                                <FormGroup>
                                    {
                                    Object.keys(instDetail['Family Planning (if yes)'].ref).slice(-2).map((item: string) => (
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    disabled={getDisabled(instDetail['Family Planning (if yes)'].ref[item])}
                                                    checked={formData[instDetail['Family Planning (if yes)'].ref[item]]}
                                                    onChange={(e => handleFormData(e, instDetail['Family Planning (if yes)'].ref[item]))}
                                                />
                                                )}
                                            label={item}
                                            key={item}
                                        />
                                        ))
                                        }
                                </FormGroup>
                            </FormControl>
                        </Box>
                    </div>
                </>
                )}
                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="OPD-Input">OPD</InputLabel>
                    <Select
                        disabled={getDisabled('has_opd')}
                        labelId="OPD-Label"
                        id="OPD_ID"
                        value={formData.has_opd ? 'Yes' : 'No'}
                        label="OPD"
                        onChange={e => handleFormData(e, 'has_opd')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>
                {
                formData.has_opd
                && (
                <>
                    <h2>Please select all that apply</h2>
                    <div className={styles.checkBoxGrp}>
                        <Box sx={{ display: 'flex' }}>
                            <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                                <FormGroup>
                                    {
                                    Object.keys(instDetail['OPD (if yes)'].ref).slice(0, 3).map((item: string) => (
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    disabled={getDisabled(instDetail['OPD (if yes)'].ref[item])}
                                                    checked={formData[instDetail['OPD (if yes)'].ref[item]]}
                                                    onChange={(e => handleFormData(e, instDetail['OPD (if yes)'].ref[item]))}
                                                />
                                                )}
                                            label={item}
                                            key={item}
                                        />
                                        ))
                                    }
                                </FormGroup>
                            </FormControl>
                            <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                                <FormGroup>
                                    {
                                    Object.keys(instDetail['OPD (if yes)'].ref).slice(-2).map((item: string) => (
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    disabled={getDisabled(instDetail['OPD (if yes)'].ref[item])}
                                                    checked={formData[instDetail['OPD (if yes)'].ref[item]]}
                                                    onChange={(e => handleFormData(e, instDetail['OPD (if yes)'].ref[item]))}
                                                />
                                                )}
                                            label={item}
                                            key={item}
                                        />
                                        ))
                                        }
                                </FormGroup>
                            </FormControl>
                        </Box>
                    </div>
                </>
                )
                }

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_treatement_of_tb-Input">Treatment of Tuberculosis</InputLabel>
                    <Select
                        disabled={getDisabled('has_treatement_of_tb')}
                        labelId="has_treatement_of_tb-Label"
                        id="has_treatement_of_tbID"
                        value={formData.has_treatement_of_tb ? 'Yes' : 'No'}
                        label="Treatment of Tuberculosis"
                        onChange={e => handleFormData(e, 'has_treatement_of_tb')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_treatement_of_mdr_tb-Input">Treatment of Multi-drug resistance (MDR) tuberculosis</InputLabel>
                    <Select
                        disabled={getDisabled('has_treatement_of_mdr_tb')}
                        labelId="has_treatement_of_mdr_tb-Label"
                        id="has_treatement_of_mdr_tbID"
                        value={formData.has_treatement_of_mdr_tb ? 'Yes' : 'No'}
                        label="Treatment of Tuberculosis"
                        onChange={e => handleFormData(e, 'has_treatement_of_mdr_tb')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_treatement_of_mdr_tb-Input">Treatment of Multi-drug resistance (MDR) tuberculosis</InputLabel>
                    <Select
                        disabled={getDisabled('has_treatement_of_mdr_tb')}
                        labelId="has_treatement_of_mdr_tb-Label"
                        id="has_treatement_of_mdr_tbID"
                        value={formData.has_treatement_of_mdr_tb ? 'Yes' : 'No'}
                        label="Treatment of Tuberculosis"
                        onChange={e => handleFormData(e, 'has_treatement_of_mdr_tb')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_treatement_of_leprosy-Input">Treatment of Leprosy</InputLabel>
                    <Select
                        disabled={getDisabled('has_treatement_of_leprosy')}
                        labelId="has_treatement_of_leprosy-Label"
                        id="has_treatement_of_leprosyID"
                        value={formData.has_treatement_of_leprosy ? 'Yes' : 'No'}
                        label="Treatment of Leprosy"
                        onChange={e => handleFormData(e, 'has_treatement_of_leprosy')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_treatement_of_malaria-Input">Treatment of Malaria</InputLabel>
                    <Select
                        disabled={getDisabled('has_treatement_of_malaria')}
                        labelId="has_treatement_of_malaria-Label"
                        id="has_treatement_of_malariaID"
                        value={formData.has_treatement_of_malaria ? 'Yes' : 'No'}
                        label="Treatment of Malaria"
                        onChange={e => handleFormData(e, 'has_treatement_of_malaria')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_treatement_of_kalaazar-Input">Treatment of Kala-azar</InputLabel>
                    <Select
                        disabled={getDisabled('has_treatement_of_kalaazar')}
                        labelId="has_treatement_of_kalaazar-Label"
                        id="has_treatement_of_kalaazarID"
                        value={formData.has_treatement_of_kalaazar ? 'Yes' : 'No'}
                        label="Treatment of Kala-azar"
                        onChange={e => handleFormData(e, 'has_treatement_of_kalaazar')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_treatement_of_japanese_encephalitis-Input">Treatment of Japanese Encephalitis</InputLabel>
                    <Select
                        disabled={getDisabled('has_treatement_of_japanese_encephalitis')}
                        labelId="has_treatement_of_japanese_encephalitis-Label"
                        id="has_treatement_of_japanese_encephalitisID"
                        value={formData.has_treatement_of_japanese_encephalitis ? 'Yes' : 'No'}
                        label="Treatment of Japanese Encephalitis"
                        onChange={e => handleFormData(e, 'has_treatement_of_japanese_encephalitis')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_treatement_of_japanese_encephalitis-Input">Laboratory Service</InputLabel>
                    <Select
                        disabled={getDisabled('has_laboratory_service')}
                        labelId="has_laboratory_service-Label"
                        id="has_laboratory_serviceID"
                        value={formData.has_laboratory_service ? 'Yes' : 'No'}
                        label="Laboratory Service"
                        onChange={e => handleFormData(e, 'has_laboratory_service')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                {
                formData.has_laboratory_service
                && (
                <>
                    <h2>Please select all that apply</h2>
                    <div className={styles.checkBoxGrp}>
                        <Box sx={{ display: 'flex' }}>
                            <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                                <FormGroup>
                                    {
                                    Object.keys(instDetail['Laboratory Service (if yes)'].ref).slice(0, 3).map((item: string) => (
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    disabled={getDisabled(instDetail['Laboratory Service (if yes)'].ref[item])}
                                                    checked={formData[instDetail['Laboratory Service (if yes)'].ref[item]]}
                                                    onChange={(e => handleFormData(e, instDetail['Laboratory Service (if yes)'].ref[item]))}
                                                />
                                                )}
                                            label={item}
                                            key={item}
                                        />
                                        ))
                                    }
                                </FormGroup>
                            </FormControl>
                            <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                                <FormGroup>
                                    {
                                    Object.keys(instDetail['Laboratory Service (if yes)'].ref).slice(-2).map((item: string) => (
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    disabled={getDisabled(instDetail['Laboratory Service (if yes)'].ref[item])}
                                                    checked={formData[instDetail['Laboratory Service (if yes)'].ref[item]]}
                                                    onChange={(e => handleFormData(e, instDetail['Laboratory Service (if yes)'].ref[item]))}
                                                />
                                                )}
                                            label={item}
                                            key={item}
                                        />
                                        ))
                                        }
                                </FormGroup>
                            </FormControl>
                        </Box>
                    </div>
                </>
                )
                }

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_volunteer_counseling_test-Input">Volunteer Counseling Test (VCT) for HIV/AIDS</InputLabel>
                    <Select
                        disabled={getDisabled('has_volunteer_counseling_test')}
                        labelId="has_volunteer_counseling_test-Label"
                        id="has_volunteer_counseling_testID"
                        value={formData.has_volunteer_counseling_test ? 'Yes' : 'No'}
                        label="Volunteer Counseling Test (VCT) for HIV/AIDS"
                        onChange={e => handleFormData(e, 'has_volunteer_counseling_test')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_pmtct-Input">Prevention of mother-to-child transmission (PMTCT)</InputLabel>
                    <Select
                        disabled={getDisabled('has_pmtct')}
                        labelId="has_pmtct-Label"
                        id="has_pmtctID"
                        value={formData.has_pmtct ? 'Yes' : 'No'}
                        label="Prevention of mother-to-child transmission (PMTCT)"
                        onChange={e => handleFormData(e, 'has_pmtct')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_anti_retro_viral_treatment-Input">Anti-retro Viral Treatment</InputLabel>
                    <Select
                        disabled={getDisabled('has_anti_retro_viral_treatment')}
                        labelId="has_anti_retro_viral_treatment-Label"
                        id="has_anti_retro_viral_treatmentID"
                        value={formData.has_anti_retro_viral_treatment ? 'Yes' : 'No'}
                        label="Anti-retro Viral Treatment"
                        onChange={e => handleFormData(e, 'has_anti_retro_viral_treatment')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_dental-Input">Dental</InputLabel>
                    <Select
                        disabled={getDisabled('has_dental')}
                        labelId="has_dental-Label"
                        id="has_anti_retro_viral_treatmentID"
                        value={formData.has_dental ? 'Yes' : 'No'}
                        label="Dental"
                        onChange={e => handleFormData(e, 'has_dental')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_in_patient-Input">In Patient</InputLabel>
                    <Select
                        disabled={getDisabled('has_in_patient')}
                        labelId="has_in_patient-Label"
                        id="has_in_patient"
                        value={formData.has_in_patient ? 'Yes' : 'No'}
                        label="In Patient"
                        onChange={e => handleFormData(e, 'has_in_patient')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="Radiology-Input">Radiology</InputLabel>
                    <Select
                        disabled={getDisabled('has_radiology')}
                        labelId="Radiology-Label"
                        id="Radiology"
                        value={formData.has_radiology ? 'Yes' : 'No'}
                        label="In Patient"
                        onChange={e => handleFormData(e, 'has_radiology')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>


                {
                formData.has_radiology && (
                <>
                    <h2>Please select all that apply</h2>
                    <div className={styles.checkBoxGrp}>
                        <Box sx={{ display: 'flex' }}>
                            <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                                <FormGroup>
                                    {
                                    Object.keys(instDetail['Radiology (if yes)'].ref).slice(0, 3).map((item: string) => (
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    disabled={getDisabled(instDetail['Radiology (if yes)'].ref[item])}
                                                    checked={formData[instDetail['Radiology (if yes)'].ref[item]]}
                                                    onChange={(e => handleFormData(e, instDetail['Radiology (if yes)'].ref[item]))}
                                                />
                                            )}
                                            label={item}
                                            key={item}
                                        />
                                    ))
                                    }
                                </FormGroup>
                            </FormControl>
                            <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                                <FormGroup>
                                    {
                                    Object.keys(instDetail['Radiology (if yes)'].ref).slice(-2).map((item: string) => (
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    disabled={getDisabled(instDetail['Radiology (if yes)'].ref[item])}
                                                    checked={formData[instDetail['Radiology (if yes)'].ref[item]]}
                                                    onChange={(e => handleFormData(e, instDetail['Radiology (if yes)'].ref[item]))}
                                                />
                                            )}
                                            label={item}
                                            key={item}
                                        />
                                    ))
                                    }
                                </FormGroup>
                            </FormControl>
                        </Box>
                    </div>
                </>
                )
                }

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_surgical_service-Input">Surgical Service</InputLabel>
                    <Select
                        disabled={getDisabled('has_surgical_service')}
                        labelId="has_surgical_service-Label"
                        id="has_surgical_serviceID"
                        value={formData.has_surgical_service ? 'Yes' : 'No'}
                        label="Surgical Service"
                        onChange={e => handleFormData(e, 'has_surgical_service')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>
                {
                formData.has_surgical_service
                && (
                <>
                    <h2>Please select all that apply</h2>
                    <div className={styles.checkBoxGrp}>
                        <Box sx={{ display: 'flex' }}>
                            <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                                <FormGroup>
                                    {
                                    Object.keys(instDetail['Surgical Service (if yes)'].ref).slice(0, 3).map((item: string) => (
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    disabled={getDisabled(instDetail['Surgical Service (if yes)'].ref[item])}
                                                    checked={formData[instDetail['Surgical Service (if yes)'].ref[item]]}
                                                    onChange={(e => handleFormData(e, instDetail['Surgical Service (if yes)'].ref[item]))}
                                                />
                                            )}
                                            label={item}
                                            key={item}
                                        />
                                        ))
                                        }
                                </FormGroup>
                            </FormControl>
                            <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                                <FormGroup>
                                    {
                                    Object.keys(instDetail['Surgical Service (if yes)'].ref).slice(-2).map((item: string) => (
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    disabled={getDisabled(instDetail['Surgical Service (if yes)'].ref[item])}
                                                    checked={formData[instDetail['Surgical Service (if yes)'].ref[item]]}
                                                    onChange={(e => handleFormData(e, instDetail['Surgical Service (if yes)'].ref[item]))}
                                                />
                                            )}
                                            label={item}
                                            key={item}
                                        />
                                    ))
                                    }
                                </FormGroup>
                            </FormControl>
                        </Box>
                    </div>
                </>
                )
                }
                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_specialized_service-Input">Specialized Service</InputLabel>
                    <Select
                        disabled={getDisabled('has_specialized_service')}
                        labelId="has_specialized_service-Label"
                        id="has_specialized_serviceID"
                        value={formData.has_specialized_service ? 'Yes' : 'No'}
                        label="Specialized Service"
                        onChange={e => handleFormData(e, 'has_specialized_service')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>
                {
                formData.has_specialized_service
                && (
                <>
                    <h2>Please select all that apply</h2>
                    <div className={styles.checkBoxGrp}>
                        <Box sx={{ display: 'flex' }}>
                            <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                                <FormGroup>
                                    {
                                    Object.keys(instDetail['Specialized Service (if yes)'].ref).slice(0, 3).map((item: string) => (
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    disabled={getDisabled(instDetail['Specialized Service (if yes)'].ref[item])}
                                                    checked={formData[instDetail['Specialized Service (if yes)'].ref[item]]}
                                                    onChange={(e => handleFormData(e, instDetail['Specialized Service (if yes)'].ref[item]))}
                                                />
                                            )}
                                            label={item}
                                            key={item}
                                        />
                                     ))
                                     }
                                </FormGroup>
                            </FormControl>
                            <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                                <FormGroup>
                                    {
                                    Object.keys(instDetail['Specialized Service (if yes)'].ref).slice(-2).map((item: string) => (
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    disabled={getDisabled(instDetail['Specialized Service (if yes)'].ref[item])}
                                                    checked={formData[instDetail['Specialized Service (if yes)'].ref[item]]}
                                                    onChange={(e => handleFormData(e, instDetail['Specialized Service (if yes)'].ref[item]))}
                                                />
                                            )}
                                            label={item}
                                            key={item}
                                        />
                                    ))
                                    }
                                </FormGroup>
                            </FormControl>
                        </Box>
                    </div>
                </>
                )
                }

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_cardiac_catheterization-Input">Cardiac Catheterization</InputLabel>
                    <Select
                        disabled={getDisabled('has_cardiac_catheterization')}
                        labelId="has_cardiac_catheterization-Label"
                        id="has_cardiac_catheterizationID"
                        value={formData.has_cardiac_catheterization ? 'Yes' : 'No'}
                        label="Cardiac Catheterization"
                        onChange={e => handleFormData(e, 'has_cardiac_catheterization')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_physiotherapy-Input">Physiotherapy</InputLabel>
                    <Select
                        disabled={getDisabled('has_physiotherapy')}
                        labelId="has_physiotherapy-Label"
                        id="has_physiotherapyID"
                        value={formData.has_physiotherapy ? 'Yes' : 'No'}
                        label="Physiotherapy"
                        onChange={e => handleFormData(e, 'has_physiotherapy')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_ambulance_service-Input">Ambulance services</InputLabel>
                    <Select
                        disabled={getDisabled('has_ambulance_service')}
                        labelId="has_ambulance_service-Label"
                        id="has_ambulance_serviceID"
                        value={formData.has_ambulance_service ? 'Yes' : 'No'}
                        label="Ambulance services"
                        onChange={e => handleFormData(e, 'has_ambulance_service')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_extended_health_service-Input">Extended Health Service</InputLabel>
                    <Select
                        disabled={getDisabled('has_extended_health_service')}
                        labelId="has_extended_health_service-Label"
                        id="has_extended_health_serviceId"
                        value={formData.has_extended_health_service ? 'Yes' : 'No'}
                        label="Extended Health Service"
                        onChange={e => handleFormData(e, 'has_extended_health_service')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_geriatric_ward-Input">Geriatric Ward</InputLabel>
                    <Select
                        disabled={getDisabled('has_geriatric_ward')}
                        labelId="has_geriatric_ward-Label"
                        id="has_geriatric_wardID"
                        value={formData.has_geriatric_ward ? 'Yes' : 'No'}
                        label="Geriatric Ward"
                        onChange={e => handleFormData(e, 'has_geriatric_ward')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_pharmacy-Input">Pharmacy</InputLabel>
                    <Select
                        disabled={getDisabled('has_pharmacy')}
                        labelId="has_pharmacy-Label"
                        id="has_pharmacyID"
                        value={formData.has_pharmacy ? 'Yes' : 'No'}
                        label="Pharmacy"
                        onChange={e => handleFormData(e, 'has_pharmacy')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="OCMC-Input">OCMC</InputLabel>
                    <Select
                        disabled={getDisabled('has_ocmc')}
                        labelId="OCMC-Label"
                        id="OCMCID"
                        value={formData.has_ocmc ? 'Yes' : 'No'}
                        label="Pharmacy"
                        onChange={e => handleFormData(e, 'has_ocmc')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_health_insurance-Input">Health Insurance</InputLabel>
                    <Select
                        disabled={getDisabled('has_health_insurance')}
                        labelId="has_health_insurance-Label"
                        id="has_health_insuranceID"
                        value={formData.has_health_insurance ? 'Yes' : 'No'}
                        label="Health Insurance"
                        onChange={e => handleFormData(e, 'has_health_insurance')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="SSU-Input">SSU</InputLabel>
                    <Select
                        disabled={getDisabled('has_ssu')}
                        labelId="SSU-Label"
                        id="SSUID"
                        value={formData.has_ssu ? 'Yes' : 'No'}
                        label="Health Insurance"
                        onChange={e => handleFormData(e, 'has_ssu')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_ayurveda_service-Input">Ayurveda Service</InputLabel>
                    <Select
                        disabled={getDisabled('has_ayurveda_service')}
                        labelId="has_ayurveda_service-Label"
                        id="has_ayurveda_serviceID"
                        value={formData.has_ayurveda_service ? 'Yes' : 'No'}
                        label="Ayurveda Service"
                        onChange={e => handleFormData(e, 'has_ayurveda_service')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_covid_clinic_service-Input">COVID Clinic Service</InputLabel>
                    <Select
                        disabled={getDisabled('has_covid_clinic_service')}
                        labelId="has_covid_clinic_service-Label"
                        id="has_covid_clinic_serviceID"
                        value={formData.has_covid_clinic_service ? 'Yes' : 'No'}
                        label="COVID Clinic Service"
                        onChange={e => handleFormData(e, 'has_covid_clinic_service')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_emergency_services-Input">Emergency services</InputLabel>
                    <Select
                        disabled={getDisabled('has_emergency_services')}
                        labelId="has_emergency_services-Label"
                        id="has_emergency_servicesID"
                        value={formData.has_emergency_services ? 'Yes' : 'No'}
                        label="COVID Clinic Service"
                        onChange={e => handleFormData(e, 'has_emergency_services')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_operating_theatre-Input">Operating theatre</InputLabel>
                    <Select
                        disabled={getDisabled('has_operating_theatre')}
                        labelId="has_operating_theatre-Label"
                        id="has_operating_theatreID"
                        value={formData.has_operating_theatre ? 'Yes' : 'No'}
                        label="Operating theatre"
                        onChange={e => handleFormData(e, 'has_operating_theatre')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_blood_donation-Input">Blood donation</InputLabel>
                    <Select
                        disabled={getDisabled('has_blood_donation')}
                        labelId="has_blood_donation-Label"
                        id="has_blood_donationID"
                        value={formData.has_blood_donation ? 'Yes' : 'No'}
                        label="Blood donation"
                        onChange={e => handleFormData(e, 'has_blood_donation')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <h2>Listed for free treatment Bipanna</h2>
                <div className={styles.checkBoxGrp}>
                    <Box sx={{ display: 'flex' }}>
                        <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                            <FormGroup>
                                {
                                Object.keys(instDetail['Listed for free treatment Bipanna'].ref).slice(0, 5).map((item: string) => (
                                    <FormControlLabel
                                        control={(
                                            <Checkbox
                                                disabled={getDisabled(instDetail['Listed for free treatment Bipanna'].ref[item])}
                                                checked={formData[instDetail['Listed for free treatment Bipanna'].ref[item]]}
                                                onChange={(e => handleFormData(e, instDetail['Listed for free treatment Bipanna'].ref[item]))}
                                            />
                                        )}
                                        label={item}
                                        key={item}
                                    />
                                    ))
                                    }
                            </FormGroup>
                        </FormControl>
                        <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                            <FormGroup>
                                {
                                Object.keys(instDetail['Listed for free treatment Bipanna'].ref).slice(-5).map((item: string) => (
                                    <FormControlLabel
                                        control={(
                                            <Checkbox
                                                disabled={getDisabled(instDetail['Listed for free treatment Bipanna'].ref[item])}
                                                checked={formData[instDetail['Listed for free treatment Bipanna'].ref[item]]}
                                                onChange={(e => handleFormData(e, instDetail['Listed for free treatment Bipanna'].ref[item]))}
                                            />
                                            )}
                                        label={item}
                                        key={item}
                                    />
                                    ))
                                    }
                            </FormGroup>
                        </FormControl>
                    </Box>
                </div>
                <h2>Number of Employees</h2>
                <div className={styles.row1}>
                    <div className={styles.col1}>
                        <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                            <TextField
                                id="no_of_employeeID"
                                label="Number of Total Employees"
                                variant="filled"
                                value={formData.no_of_employee}
                                onChange={e => handleFormData(e, 'no_of_employee')}
                                InputProps={{
                                    disableUnderline: true,
                                    inputMode: 'numeric',
                                }}
                                disabled={getDisabled('no_of_employee')}
                                style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                            />
                        </FormControl>
                    </div>
                    <div className={styles.col1}>
                        <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                            <TextField
                                id="no_of_male_employeeID"
                                label="Number of Male Employees"
                                variant="filled"
                                value={formData.no_of_male_employee}
                                onChange={e => handleFormData(e, 'no_of_male_employee')}
                                InputProps={{
                                    disableUnderline: true,
                                    inputMode: 'numeric',
                                }}
                                disabled={getDisabled('no_of_male_employee')}
                                style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                            />
                        </FormControl>
                    </div>
                </div>

                <div className={styles.row1}>
                    <div className={styles.col1}>
                        <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                            <TextField
                                id="no_of_female_employeeID"
                                label="Number of Female Employees"
                                variant="filled"
                                value={formData.no_of_female_employee}
                                onChange={e => handleFormData(e, 'no_of_female_employee')}
                                InputProps={{
                                    disableUnderline: true,
                                    inputMode: 'numeric',
                                }}
                                disabled={getDisabled('no_of_female_employee')}
                                style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                            />
                        </FormControl>
                    </div>
                    <div className={styles.col1}>
                        <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                            <TextField
                                id="no_of_other_employeeID"
                                label="Number of Other Employees"
                                variant="filled"
                                value={formData.no_of_other_employee}
                                onChange={e => handleFormData(e, 'no_of_other_employee')}
                                InputProps={{
                                    disableUnderline: true,
                                    inputMode: 'numeric',
                                }}
                                disabled={getDisabled('no_of_other_employee')}
                                style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                            />
                        </FormControl>
                    </div>
                </div>

                <div className={styles.row1}>
                    <div className={styles.col1}>
                        <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                            <TextField
                                id="no_of_differently_abled_male_employeesID"
                                label="Number of Differently-abled Male Employees"
                                variant="filled"
                                value={formData.no_of_differently_abled_male_employees}
                                onChange={e => handleFormData(e, 'no_of_differently_abled_male_employees')}
                                InputProps={{
                                    disableUnderline: true,
                                    inputMode: 'numeric',
                                }}
                                disabled={getDisabled('no_of_differently_abled_male_employees')}
                                style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                            />
                        </FormControl>
                    </div>
                    <div className={styles.col1}>
                        <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                            <TextField
                                id="no_of_differently_abled_female_employeesID"
                                label="Number of Differently-abled Female Employees"
                                variant="filled"
                                value={formData.no_of_differently_abled_female_employees}
                                onChange={e => handleFormData(e, 'no_of_differently_abled_female_employees')}
                                InputProps={{
                                    disableUnderline: true,
                                    inputMode: 'numeric',
                                }}
                                disabled={getDisabled('no_of_differently_abled_female_employees')}
                                style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                            />
                        </FormControl>
                    </div>
                </div>
                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <TextField
                        id="no_of_differently_abled_other_employeesID"
                        label="Number of Differently-abled Other Employees"
                        variant="filled"
                        value={formData.no_of_differently_abled_other_employees}
                        onChange={e => handleFormData(e, 'no_of_differently_abled_other_employees')}
                        InputProps={{
                            disableUnderline: true,
                            inputMode: 'numeric',
                        }}
                        disabled={getDisabled('no_of_differently_abled_other_employees')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                    />
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <TextField
                        id="specializationID"
                        label="Specialization"
                        variant="filled"
                        value={formData.specialization}
                        onChange={e => handleFormData(e, 'specialization')}
                        InputProps={{
                            disableUnderline: true,
                        }}
                        disabled={getDisabled('specialization')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                    />
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Registration/Est. Date"
                            disableFuture
                            value={formData.registration_est_date}
                            onChange={(e: Date) => handleDate(e, 'registration_est_date')}
                            disabled={getDisabled('registration_est_date')}
                            renderInput={params => (
                                <TextField

                                    style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                                    variant="filled"
                                    className={styles.materialUiInput}
                                    {...params}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Last Renewal Date"
                            disableFuture
                            value={formData.last_renewal_date}
                            onChange={(e: Date) => handleDate(e, 'last_renewal_date')}
                            disabled={getDisabled('last_renewal_date')}
                            renderInput={params => (
                                <TextField
                                    style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                                    variant="filled"
                                    className={styles.materialUiInput}
                                    {...params}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Date of Validity"
                            disableFuture
                            value={formData.date_of_validity}
                            onChange={(e: Date) => handleDate(e, 'date_of_validity')}
                            disabled={getDisabled('date_of_validity')}
                            renderInput={params => (
                                <TextField
                                    style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                                    variant="filled"
                                    className={styles.materialUiInput}
                                    {...params}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_internet_facility-Input">Internet Facility</InputLabel>
                    <Select
                        disabled={getDisabled('has_internet_facility')}
                        labelId="has_internet_facility-Label"
                        id="has_internet_facilityID"
                        value={formData.has_internet_facility ? 'Yes' : 'No'}
                        label="Internet Facility"
                        onChange={e => handleFormData(e, 'has_internet_facility')}
                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>
                {
                validationError
                && <p style={{ color: 'red' }}>{validationError}</p>
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

// export default InstitutionDetails;
export default connect(mapStateToProps, mapDispatchToProps)(
    InstitutionDetails,
);
