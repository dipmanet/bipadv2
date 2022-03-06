/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormControl } from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { TimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import AccentHeading from 'src/admin/components/AccentHeading';
import { navigate } from '@reach/router';
import { connect, useSelector } from 'react-redux';
import NextButton from '../../NextButton';
import { FormDataType, institutionDetails } from '../utils';
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
    handleSelectGroup?: (e: SelectChangeEvent<string>, fN: string) => void;
    formData?: FormDataType;
    progress?: number;
    getActiveMenu?: (e: number) => void;
    handleTime?: (e: Date, fN: string) => void;
    activeMenu?: number;
    handleProgress: (e: number) => void;

}


const DisasterManagement = (props: Props): JSX.Element => {
    const {
        handleFormData,
        handleTime,
        formData,
        progress,
        getActiveMenu,
        activeMenu,
        userDataMain,
    } = props;

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

    // const navigate = useNavigate();
    const handleViewTableBtn = () => {
        navigate('/health-table');
    };

    useEffect(() => {
        window.scrollTo({ top: 400, left: 0 });
    }, []);

    return (
        <>
            <div className={styles.rowTitle1}>
                <h2>Disaster Management Details</h2>
                <button
                    className={styles.viewTablebtn}
                    type="button"
                    onClick={handleViewTableBtn}
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
                    This section contains information regarding the disaster management capacity of the institution. It includes information on whether the facility is disaster friendly, built following building code, has DRR focal person, has open space, and a helipad.
                </p>
            </div>
            <div className={styles.row3}>
                <AccentHeading
                    content={'Please enter data in each field, as relevant to the health institution'}
                />
            </div>
            <div className={styles.containerForm}>

                <h2>
                Disaster Management Information
                </h2>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="is_designed_following_building_code-Input">Is the facility designed following building code?</InputLabel>
                    <Select
                        disabled={getDisabled('is_designed_following_building_code')}
                        labelId="is_designed_following_building_code-Label"
                        id="is_designed_following_building_codeID"
                        value={formData.is_designed_following_building_code ? 'Yes' : 'No'}
                        label="Internet Facility"
                        onChange={e => handleFormData(e, 'is_designed_following_building_code')}
                        style={{ border: '1px solid #d5d5d5' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_disable_friendly_infrastructure-Input">Does the facility have disabled friendly infrastructure?</InputLabel>
                    <Select
                        disabled={getDisabled('has_disable_friendly_infrastructure')}
                        labelId="has_disable_friendly_infrastructure-Label"
                        id="has_disable_friendly_infrastructureID"
                        value={formData.has_disable_friendly_infrastructure ? 'Yes' : 'No'}
                        label="Does the facility have disabled friendly infrastructure?"
                        onChange={e => handleFormData(e, 'has_disable_friendly_infrastructure')}
                        style={{ border: '1px solid #d5d5d5' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>
                {
                    formData.has_disable_friendly_infrastructure && (
                    <>
                        <h2>Please specify</h2>
                        <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                            <TextField
                                disabled={getDisabled('specify_infrastructure')}
                                id="specify_infrastructureID"
                                label="Please specify"
                                variant="filled"
                                value={formData.specify_infrastructure}
                                onChange={e => handleFormData(e, 'specify_infrastructure')}
                                InputProps={{
                                    disableUnderline: true,
                                }}
                                style={{ border: '1px solid #d5d5d5' }}
                            />
                        </FormControl>
                    </>
                    )
                }
                <div className={styles.row1}>
                    <div className={styles.col1}>
                        <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                            <InputLabel id="has_helipad-Input">Does the facility have a helipad?</InputLabel>
                            <Select
                                disabled={getDisabled('has_helipad')}
                                labelId="has_helipad-Label"
                                id="has_helipadID"
                                value={formData.has_helipad ? 'Yes' : 'No'}
                                label="Does the facility have a helipad?"
                                onChange={e => handleFormData(e, 'has_helipad')}
                                style={{ border: '1px solid #d5d5d5' }}
                                disableUnderline
                            >
                                <MenuItem value={'Yes'}>Yes</MenuItem>
                                <MenuItem value={'No'}>No</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.col1}>
                        <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                            <InputLabel id="has_evacuation_route-Input">Does the facility have an evacuation route?</InputLabel>
                            <Select
                                disabled={getDisabled('has_evacuation_route')}
                                labelId="has_evacuation_route-Label"
                                id="has_evacuation_routeID"
                                value={formData.has_evacuation_route ? 'Yes' : 'No'}
                                label="Does the facility have an evacuation route?"
                                onChange={e => handleFormData(e, 'has_evacuation_route')}
                                style={{ border: '1px solid #d5d5d5' }}
                                disableUnderline
                            >
                                <MenuItem value={'Yes'}>Yes</MenuItem>
                                <MenuItem value={'No'}>No</MenuItem>
                            </Select>
                        </FormControl>

                    </div>
                </div>
                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_focal_person-Input">Does the facility have a disaster focal point person?</InputLabel>
                    <Select
                        disabled={getDisabled('has_focal_person')}
                        labelId="has_focal_person-Label"
                        id="has_focal_personID"
                        value={formData.has_focal_person ? 'Yes' : 'No'}
                        label="Does the facility have a disaster focal point person?"
                        onChange={e => handleFormData(e, 'has_focal_person')}
                        style={{ border: '1px solid #d5d5d5' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>
                {
                    formData.has_focal_person && (
                        <>
                            <div className={styles.row1}>
                                <div className={styles.col1}>
                                    <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                                        <TextField
                                            disabled={getDisabled('focal_person_name')}
                                            id="focal_person_nameID"
                                            label="Name of disaster focal point person"
                                            variant="filled"
                                            value={formData.focal_person_name}
                                            onChange={e => handleFormData(e, 'focal_person_name')}
                                            InputProps={{ disableUnderline: true }}
                                            style={{ border: '1px solid #d5d5d5' }}
                                        />
                                    </FormControl>
                                </div>
                                <div className={styles.col1}>
                                    <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                                        <TextField
                                            disabled={getDisabled('focal_person_phone_number')}
                                            id="focal_person_phone_numberID"
                                            label="Phone number of disaster focal point person"
                                            variant="filled"
                                            value={formData.focal_person_phone_number}
                                            onChange={e => handleFormData(e, 'focal_person_phone_number')}
                                            InputProps={{ disableUnderline: true }}
                                            style={{ border: '1px solid #d5d5d5' }}
                                        />
                                    </FormControl>

                                </div>
                            </div>
                            {/* <div className={styles.row1}>
                                <div className={styles.col1}>
                                    <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                                        <TextField
                                            disabled={getDisabled('focal_person_phone_number')}
                                            id="focal_person_phone_numberID"
                                            label="Phone number of disaster focal point person"
                                            variant="filled"
                                            value={formData.focal_person_phone_number}
                                            onChange={e => handleFormData(e, 'focal_person_phone_number')}
                                            InputProps={{ disableUnderline: true }}
                                            style={{ border: '1px solid #d5d5d5' }}
                                        />
                                    </FormControl>

                                </div>
                            </div> */}
                        </>
                    )
                }
                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_open_space-Input">Does the facility have open space?</InputLabel>
                    <Select
                        disabled={getDisabled('has_open_space')}
                        labelId="has_open_space-Label"
                        id="has_open_spaceID"
                        value={formData.has_open_space ? 'Yes' : 'No'}
                        label="Does the facility have open space?"
                        onChange={e => handleFormData(e, 'has_open_space')}
                        style={{ border: '1px solid #d5d5d5' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>
                {
                    formData.has_open_space && (
                        <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                            <TextField
                                disabled={getDisabled('area_of_open_space')}
                                id="area_of_open_spaceID"
                                label="Please specify the area of open space in sq km."
                                variant="filled"
                                value={formData.area_of_open_space}
                                onChange={e => handleFormData(e, 'area_of_open_space')}
                                InputProps={{
                                    disableUnderline: true,
                                }}
                                style={{ border: '1px solid #d5d5d5' }}
                            />
                        </FormControl>
                    )
                }
                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_medicine_storage_space-Input">Has medicine storage space?</InputLabel>
                    <Select
                        disabled={getDisabled('has_medicine_storage_space')}
                        labelId="has_medicine_storage_space-Label"
                        id="has_medicine_storage_spaceID"
                        value={formData.has_medicine_storage_space ? 'Yes' : 'No'}
                        label="Has medicine storage space?"
                        onChange={e => handleFormData(e, 'has_medicine_storage_space')}
                        style={{ border: '1px solid #d5d5d5' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>
                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                    <InputLabel id="has_medicine_storage_space-Input">Does the facility have backup electricity?</InputLabel>
                    <Select
                        disabled={getDisabled('has_backup_electricity')}
                        labelId="has_backup_electricity-Label"
                        id="has_backup_electricityID"
                        value={formData.has_backup_electricity ? 'Yes' : 'No'}
                        label="Does the facility have backup electricity?"
                        onChange={e => handleFormData(e, 'has_backup_electricity')}
                        style={{ border: '1px solid #d5d5d5' }}
                        disableUnderline
                    >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                </FormControl>


                <NextButton
                    getActiveMenu={getActiveMenu}
                    progress={progress}
                    activeMenu={activeMenu}
                    handleProgress={props.handleProgress}
                />
            </div>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    DisasterManagement,
);
