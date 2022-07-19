/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import Input from '@material-ui/core/Input';
import { connect } from 'react-redux';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { _cs } from '@togglecorp/fujs';
import { Translation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import { FormHelperText } from '@material-ui/core';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';
import { ADToBS, BSToAD } from 'bikram-sambat-js';
import Loader from 'react-loader';
import {
    hazardTypesSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    languageSelector,
    bulletinEditDataSelector,
} from '#selectors';

import { setLanguageAction, setBulletinEditDataAction } from '#actionCreators';

import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';
import {
    incidentSummary,
    peopleLoss,
    genderWiseLoss,
    nepaliRef,
    englishRef,
} from '../formFields';

import styles from './styles.scss';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    hazardTypes: hazardTypesSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    language: languageSelector(state),
    bulletinEditData: bulletinEditDataSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setLanguage: params => dispatch(setLanguageAction(params)),
    setBulletinEditData: params => dispatch(setBulletinEditDataAction(params)),
});

interface Props {
    handleIncidentChange: (e: Record<string, undefined>) => void;
    handlePeopleLossChange: (e: Record<string, undefined>) => void;
    handlehazardwiseLoss: (e: Record<string, undefined>) => void;
    handlegenderWiseLoss: (e: Record<string, undefined>) => void;
}


const Bulletin = (props: Props) => {
    const {
        handleIncidentChange,
        handlePeopleLossChange,
        handlehazardwiseLoss,
        handlegenderWiseLoss,
        incidentData,
        peopleLossData,
        hazardWiseLossData,
        genderWiseLossData,
        sitRep,
        handleSitRep,
        handlehazardAdd,
        hazardTypes,
        provinces,
        districts,
        municipalities,
        hilight,
        handleHilightChange,
        handleSameHazardAdd,
        addedHazardFields,
        handleSameHazardChange,
        recordSelectedDate,
        language: { language },
        handleBulletinDate,
        setLanguage,
        resetFeedback,
        uri,
        bulletinEditData,
        handlesitRepBlur,
        dateAlt,
        setDateAlt,
        dateAltTo,
        setDateAltTo,
        setBulletinEditData,
        startingTime,
        endingTime,
        setStartingTime,
        setEndingTime,
        handleDateTo,
        filterDateType,
        setFilterDateType,
        recordSelectedDateTo,
        loading,
        filterDataTypeError,
        setFilterDataTypeError,
    } = props;

    const [hazard, setHazard] = useState(null);
    const [hazardIncidents, setHazardIncidents] = useState();
    const [hazardDeaths, setHazardDeaths] = useState();
    const [resetFilterProps, setResetFilterProps] = useState(false);
    const [filtered, setFiltered] = useState(false);
    // const [dateAlt, setDate] = useState('');

    useEffect(() => {
        if (uri && uri.includes('nepali')) {
            setLanguage({ language: 'np' });
        } if (uri && uri.includes('english')) {
            setLanguage({ language: 'en' });
        }
    }, [uri]);

    const getRegionDetails = ({ adminLevel, geoarea } = {}) => {
        if (adminLevel === 1) {
            return provinces.find(p => p.id === geoarea);
        }
        if (adminLevel === 2) {
            return {
                centroid: districts.find(p => p.id === geoarea).centroid,
                district: districts.find(p => p.id === geoarea).title_ne,
            };
        }
        if (adminLevel === 3) {
            const districtId = districts.filter(d => d.id === (municipalities.find(p => p.id === geoarea).district))[0].id;
            const municipalityId = geoarea;
            const provinceId = districts.filter(d => d.id === (municipalities.find(p => p.id === geoarea).district))[0].province;
            return {
                centroid: municipalities.find(p => p.id === geoarea).centroid,
                municipalityId,
                districtId,
                provinceId,
                district: districts.filter(d => d.id === (municipalities.find(p => p.id === geoarea).district))[0].title_ne,
            };
        }
        return '';
    };

    const handleFormRegion = (region, field, subfield) => {
        const { centroid: { coordinates }, district, municipalityId, districtId, provinceId } = getRegionDetails(region);
        handleSameHazardChange({ district, coordinates, municipalityId, districtId, provinceId }, field, 'location');
    };

    const handleCheckFilterDisableButtonForProvince = (province) => {
        if (province) {
            setFiltered(false);
        }
    };
    const handleCheckFilterDisableButtonForDistrict = (district) => {
        if (district) {
            setFiltered(false);
        }
    };
    const handleCheckFilterDisableButtonForMunicipality = (municipality) => {
        if (municipality) {
            setFiltered(false);
        }
    };

    const handleHazardAddItem = () => {
        if (hazard) {
            // handlehazardAdd(hazard);
            console.log('hazard', hazard);
            handleSameHazardAdd(hazard);
            setHazard(null);
        }
    };
    const handleHazardRemoveItem = (removeHazard, id) => {
        if (removeHazard) {
            console.log('removing removeHazard', removeHazard);
        }
    };
    const handleHazardChange = (e) => {
        setHazard(e);
    };

    const getRegionValue = (distCoordinate) => {
        const { provinceId, districtId, municipalityId } = distCoordinate;
        if (provinceId && districtId && municipalityId) {
            return { adminLevel: 3, geoarea: municipalityId };
        } if (provinceId && districtId && !municipalityId) {
            return { adminLevel: 2, geoarea: districtId };
        } if (provinceId && !districtId && !municipalityId) {
            return { adminLevel: 1, geoarea: provinceId };
        }
        return null;
    };


    useEffect(() => {
        if (dateAlt) {
            const selectedDate = new Date(dateAlt);
            recordSelectedDate(selectedDate);
            handleBulletinDate(dateAlt);
            // update the covid API
            // if there is date in redux dont update
        } else {
            let today;
            if (bulletinEditData && Object.keys(bulletinEditData).length > 0 && bulletinEditData.fromDateTime) {
                today = new Date(bulletinEditData.fromDateTime);
            } else {
                today = new Date();
                today.setDate(today.getDate() - 1);
            }
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
            const yyyy = today.getFullYear();

            const finalDate = `${yyyy}-${mm}-${dd}`;

            const selectedDate = new Date(finalDate);
            recordSelectedDate(selectedDate);
            setDateAlt(finalDate);
            handleBulletinDate(finalDate);
        }
    }, [dateAlt, bulletinEditData]);
    useEffect(() => {
        if (dateAltTo) {
            const selectedDate = new Date(dateAltTo);
            recordSelectedDateTo(selectedDate);
            handleDateTo(dateAltTo);
            // update the covid API
            // if there is date in redux dont update
        } else {
            let today;
            if (bulletinEditData && Object.keys(bulletinEditData).length > 0 && bulletinEditData.toDateTime) {
                today = new Date(bulletinEditData.toDateTime);
            } else {
                today = new Date();
            }
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
            const yyyy = today.getFullYear();

            const finalDate = `${yyyy}-${mm}-${dd}`;

            const selectedDate = new Date(finalDate);
            recordSelectedDateTo(selectedDate);
            setDateAltTo(finalDate);
            handleDateTo(finalDate);
        }
    }, [dateAltTo, bulletinEditData]);
    useEffect(() => {
        if (!startingTime && !endingTime) {
            const currentDate = new Date();
            const currentHour = currentDate.getHours();
            const currentMinute = String(currentDate.getMinutes());
            const presentTime = `${currentHour}:${currentMinute.length === 1 ? `0${currentMinute}` : currentMinute}`;
            setStartingTime('10:00');
            setEndingTime('10:00');
        }
    }, []);
    const handleStartTime = (e) => {
        setStartingTime(e.target.value);
        setFilterDateType('');
    };
    const handleEndTime = (e) => {
        setEndingTime(e.target.value);
        setFilterDateType('');
    };
    return (
        <>
            {loading
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
            <div className={styles.formContainer}>
                <Translation>
                    {
                        t => <h2>{t('Daily Disaster Bulletin')}</h2>
                    }
                </Translation>
                <Translation>
                    {
                        t => <h3>{t('Disaster details of the last 24 hours')}</h3>
                    }
                </Translation>
                <div className={styles.formSubContainer} style={{ flexWrap: 'unset' }}>
                    <div className={styles.formItem}>
                        <form className={_cs(
                            styles.datePickerForm,
                            bulletinEditData && bulletinEditData.language === 'nepali' && styles.nep,
                        )}
                        >
                            <label htmlFor="date">
                                {' '}
                                {language === 'np' ? 'मिती बाट' : 'Date from'}
                            </label>
                            {
                                Object.keys(bulletinEditData).length > 0
                                    ? (
                                        <h3
                                            style={{ position: 'relative', bottom: '5px' }}
                                        >
                                            {ADToBS(dateAlt)}
                                        </h3>
                                    )
                                    : (
                                        <NepaliDatePicker
                                            inputClassName="form-control"
                                            className={styles.datePick}
                                            value={ADToBS(dateAlt)}
                                            onChange={
                                                (value: string) => {
                                                    setDateAlt(BSToAD(value));
                                                    setFilterDateType('');
                                                }
                                            }
                                            options={{
                                                calenderLocale: language === 'np' ? 'ne' : 'en',
                                                valueLocale: 'en',
                                            }}
                                        />
                                    )
                            }
                        </form>

                    </div>
                    <div className={styles.formItem} style={{ marginLeft: '20px' }}>
                        <form style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="appt">{language === 'np' ? 'समय बाट' : 'Time From:'}</label>
                            <input
                                type="time"
                                id="appt"
                                name="appt"
                                value={startingTime}
                                onChange={handleStartTime}
                                className={styles.timeSelector}
                                disabled={bulletinEditData.toDateTime && bulletinEditData.fromDateTime}
                            />

                        </form>
                    </div>
                </div>
                <div className={styles.formSubContainer} style={{ flexWrap: 'unset' }}>
                    <div className={styles.formItem}>
                        <form className={_cs(
                            styles.datePickerForm,
                            bulletinEditData && bulletinEditData.language === 'nepali' && styles.nep,
                        )}
                        >
                            <label htmlFor="date">
                                {' '}
                                {language === 'np' ? 'मिती सम्म' : 'Date upto'}
                            </label>
                            {
                                Object.keys(bulletinEditData).length > 0
                                    ? (
                                        <h3
                                            style={{ position: 'relative', bottom: '5px' }}
                                        >
                                            {ADToBS(dateAltTo)}
                                        </h3>
                                    )
                                    : (
                                        <NepaliDatePicker
                                            inputClassName="form-control"
                                            className={styles.datePick}
                                            value={ADToBS(dateAltTo)}
                                            onChange={
                                                (value: string) => {
                                                    setDateAltTo(BSToAD(value));
                                                    setFilterDateType('');
                                                }}
                                            options={{
                                                calenderLocale: language === 'np' ? 'ne' : 'en',
                                                valueLocale: 'en',
                                            }}
                                        />
                                    )
                            }
                        </form>

                    </div>
                    <div className={styles.formItem} style={{ marginLeft: '20px' }}>
                        <form style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="appt">{language === 'np' ? 'समय सम्म :' : 'Time upto :'}</label>
                            <input
                                type="time"
                                id="appt"
                                name="appt"
                                value={endingTime}
                                onChange={handleEndTime}
                                className={styles.timeSelector}
                                disabled={bulletinEditData.toDateTime && bulletinEditData.fromDateTime}
                            />

                        </form>
                    </div>
                </div>
                <div className={styles.formSubContainer}>
                    <div className={styles.formItem}>
                        <FormControl style={{ margin: '15px 0' }} fullWidth>
                            <InputLabel id="hazardInput">
                                {/* <Translation>
                                    {
                                        t => <span>{t('Add New Hazard')}</span>
                                    }
                                </Translation> */}
                                {language === 'np' ? 'मिति प्रकारले फिल्टर गर्नुहोस्' : 'Filter By Date Type'}

                            </InputLabel>
                            <Select
                                // disabled={bulletinEditData.toDateTime && bulletinEditData.fromDateTime}
                                labelId="hazardLabel"
                                id="hazardInput"
                                value={filterDateType}
                                label="Filter By Date Type"
                                onChange={(e) => {
                                    setFilterDateType(e.target.value);
                                    setFilterDataTypeError(false);
                                }}
                                style={{ borderRadius: '3px', padding: '0 10px' }}
                                disableUnderline
                                error={filterDataTypeError}
                            >
                                <MenuItem value={''}>--</MenuItem>
                                <MenuItem value="reported_on">
                                    {language === 'np' ? 'रिपोर्ट गरिएको मिति बाट' : 'Reported Date'}
                                    {' '}
                                </MenuItem>
                                <MenuItem value="incident_on">
                                    {language === 'np' ? 'घटना भएको मिति बाट' : 'Incident Date'}
                                    {' '}
                                </MenuItem>

                            </Select>
                            {filterDataTypeError ? (
                                <FormHelperText style={{ color: '#f44336', marginLeft: '14px' }}>
                                    {language === 'np' ? 'कृपया मिति प्रकार फिल्टर प्रविष्ट गर्नुहोस्' : 'Please enter date type filter'}
                                </FormHelperText>
                            ) : ''}
                        </FormControl>
                    </div>
                </div>
                <div className={styles.formSubContainer}>

                    <div className={styles.formItem}>
                        <FormControl fullWidth>
                            <InputLabel>
                                {language === 'np' ? 'बुलेटिन नं:' : 'Bulletin No:'}
                            </InputLabel>
                            <Input
                                type="number"
                                value={sitRep}
                                onChange={e => handleSitRep(e.target.value)}
                                className={styles.select}
                                disableUnderline
                                inputProps={{
                                    disableUnderline: true,
                                }}
                                disabled={Object.keys(bulletinEditData).length > 0}
                                style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                                onBlur={handlesitRepBlur}
                            />
                        </FormControl>
                    </div>
                    <Translation>
                        {
                            t => <h3>{t('Disaster Hilights')}</h3>
                        }
                    </Translation>
                    <div className={styles.formItemText}>
                        <FormControl fullWidth>
                            {/* <InputLabel>
                                {language === 'np' ? 'हाइलाईट...' : 'Hilight...'}
                            </InputLabel> */}
                            <textarea
                                placeholder={language === 'np' ? 'अधिकतम ७०० अक्षरहरू' : 'Maximum 700 Characters'}
                                value={hilight}
                                onChange={e => handleHilightChange(e)}
                                maxLength="700"
                                rows={7}
                                className={styles.textArea}
                            />
                            {/* <Input
                                type="text"
                                value={hilight}
                                onChange={e => handleHilightChange(e)}
                                className={styles.select}
                                disableUnderline
                                inputProps={{
                                    disableUnderline: true,
                                }}
                                style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                            /> */}
                        </FormControl>
                    </div>

                    {Object.keys(incidentSummary).map((field, idx) => (

                        <div className={idx > 0 ? styles.formItemHalf : styles.formItem}>
                            <FormControl fullWidth>
                                <InputLabel>
                                    {language === 'np'
                                        ? nepaliRef[field]
                                        : englishRef[field]
                                    }
                                </InputLabel>
                                <Input
                                    type="number"
                                    value={incidentData[field]}
                                    onChange={e => handleIncidentChange(e.target.value, field)}
                                    className={styles.select}
                                    disableUnderline
                                    inputProps={{
                                        disableUnderline: true,
                                    }}
                                    style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                                />
                            </FormControl>
                        </div>
                    ))}
                </div>


                <Translation>
                    {
                        t => <h3>{t('Provincewise Death, Missing and Injured Counts')}</h3>
                    }
                </Translation>
                <div className={styles.formSubContainer}>
                    {Object.keys(peopleLoss).map(field => (
                        <>
                            <h3>
                                {' '}
                                {language === 'np'
                                    ? nepaliRef[field]
                                    : englishRef[field]
                                }

                            </h3>
                            {Object.keys(peopleLoss[field]).map(subField => (
                                <div className={styles.formItemThird}>
                                    <FormControl fullWidth>
                                        <InputLabel>
                                            {language === 'np'
                                                ? nepaliRef[subField]
                                                : englishRef[subField]
                                            }
                                        </InputLabel>
                                        <Input
                                            type="number"
                                            value={peopleLossData[field][subField]}
                                            onChange={e => handlePeopleLossChange(e, field, subField)}
                                            className={styles.select}
                                            disableUnderline
                                            inputProps={{
                                                disableUnderline: true,
                                            }}
                                            style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                                        />
                                    </FormControl>
                                </div>
                            ))
                            }
                        </>
                    ))}
                </div>
                <Translation>
                    {
                        t => <h3>{t('Hazardwise Breakdown of Incidents and Deaths')}</h3>
                    }
                </Translation>
                <div className={styles.formSubContainer}>
                    {hazardWiseLossData
                        && Object.keys(hazardWiseLossData).length > 0
                        && Object.keys(hazardWiseLossData).map(field => (
                            <>
                                <h3>{field}</h3>
                                {field && Object.keys(hazardWiseLossData[field]).map((subField) => {
                                    if (subField === 'hazard') {
                                        return null;
                                    }
                                    if (subField === 'coordinates') {
                                        return null;
                                    }

                                    return (
                                        <div className={styles.formItemHalf}>
                                            <FormControl fullWidth>
                                                <InputLabel>
                                                    {language === 'np'
                                                        ? nepaliRef[subField]
                                                        : englishRef[subField]
                                                    }
                                                </InputLabel>

                                                <Input
                                                    type="number"
                                                    className={styles.select}
                                                    value={hazardWiseLossData[field][subField]}
                                                    onChange={e => handlehazardwiseLoss(e.target.value, field, subField)}
                                                    disableUnderline
                                                    disabled
                                                    inputProps={{
                                                        disableUnderline: true,
                                                    }}
                                                    style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                                                />
                                            </FormControl>
                                        </div>
                                    );
                                })
                                }

                            </>
                        ))}
                    {addedHazardFields
                        && Object.keys(addedHazardFields).length > 0
                        && Object.keys(addedHazardFields).map(field => (
                            <>
                                {console.log('addedHazardFields', addedHazardFields)}
                                <h3 style={{ width: '90%' }}>
                                    {
                                        field
                                        && addedHazardFields[field].hazard}

                                </h3>
                                <button
                                    style={{ width: '10%', marginTop: '10px' }}
                                    type="button"
                                    onClick={() => handleHazardRemoveItem(addedHazardFields[field].hazard, field)}
                                    className={styles.hazardAddBtn}
                                // disabled={hazard === null}
                                >
                                    {
                                        language === 'np'
                                            ? 'Delete'
                                            : 'Delete'
                                    }
                                </button>

                                {/* <div className={styles.btnContainer}>
                                        <button
                                            type="button"
                                            onClick={handleHazardAddItem}
                                            className={styles.hazardAddBtn}
                                            disabled={hazard === null}
                                        >
                                            {
                                                language === 'np'
                                                    ? '- थप्नुहोस्'
                                                    : 'Delete'
                                            }
                                        </button>
                                    </div> */}


                                {field && Object.keys(addedHazardFields[field]).map((subField) => {
                                    if (subField === 'coordinates') {
                                        return (
                                            <div className={styles.inputContainer}>
                                                <StepwiseRegionSelectInput
                                                    className={
                                                        _cs(styles.activeView, styles.stepwiseRegionSelectInput)}
                                                    faramElementName="region"
                                                    wardsHidden
                                                    bulletin
                                                    value={getRegionValue(addedHazardFields[field])}
                                                    onChange={region => handleFormRegion(region, field, subField)}
                                                    checkProvince={handleCheckFilterDisableButtonForProvince}
                                                    checkDistrict={handleCheckFilterDisableButtonForDistrict}
                                                    checkMun={handleCheckFilterDisableButtonForMunicipality}
                                                    reset={resetFilterProps}
                                                    provinceInputClassName={styles.snprovinceinput}
                                                    districtInputClassName={styles.sndistinput}
                                                    municipalityInputClassName={styles.snmuniinput}
                                                />
                                            </div>

                                        );
                                    } if (subField === 'hazard') {
                                        return null;
                                    } if (subField === 'district') {
                                        return null;
                                    }
                                    if (subField === 'provinceId') {
                                        return null;
                                    }
                                    if (subField === 'districtId') {
                                        return null;
                                    }
                                    if (subField === 'municipalityId') {
                                        return null;
                                    }
                                    if (subField === 'description') {
                                        return null;
                                    }
                                    if (subField === 'response') {
                                        return null;
                                    }

                                    return (
                                        <div className={styles.formItemThird}>
                                            <FormControl fullWidth>
                                                <InputLabel>
                                                    {language === 'np'
                                                        ? nepaliRef[subField]
                                                        : englishRef[subField]
                                                    }
                                                </InputLabel>
                                                <Input
                                                    type="number"
                                                    className={styles.select}
                                                    value={addedHazardFields[field][subField]}
                                                    onChange={e => handleSameHazardChange(e.target.value, field, subField)}
                                                    disableUnderline
                                                    inputProps={{
                                                        disableUnderline: true,
                                                    }}
                                                    style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                                                />
                                            </FormControl>
                                        </div>
                                    );
                                })
                                }

                            </>
                        ))

                    }


                </div>


                <div className={styles.formSubContainer}>
                    <div className={styles.formItem}>
                        <FormControl style={{ margin: '15px 0' }} fullWidth>
                            <InputLabel id="hazardInput">
                                <Translation>
                                    {
                                        t => <span>{t('Add New Hazard')}</span>
                                    }
                                </Translation>
                            </InputLabel>
                            <Select
                                labelId="hazardLabel"
                                id="hazardInput"
                                value={hazard}
                                label="Add New Hazard Field"
                                onChange={e => handleHazardChange(e.target.value)}
                                style={{ borderRadius: '3px', padding: '0 10px' }}
                                disableUnderline
                            >
                                <MenuItem value={null}>--</MenuItem>
                                {
                                    hazardTypes
                                    && Object.keys(hazardTypes).map(hT => (<MenuItem value={language === 'np' ? hazardTypes[hT].titleNe : hazardTypes[hT].title}>{language === 'np' ? hazardTypes[hT].titleNe : hazardTypes[hT].title}</MenuItem>))
                                }
                            </Select>
                        </FormControl>
                    </div>

                    <div className={styles.btnContainer}>
                        <button
                            type="button"
                            onClick={handleHazardAddItem}
                            className={styles.hazardAddBtn}
                            disabled={hazard === null}
                        >
                            {
                                language === 'np'
                                    ? '+ थप्नुहोस्'
                                    : '+ Add'
                            }
                        </button>
                    </div>
                </div>
                <Translation>
                    {
                        t => <h3>{t('Genderwise Deaths')}</h3>
                    }
                </Translation>

                <div className={styles.formSubContainer}>
                    {Object.keys(genderWiseLoss).map((field, idx) => (

                        <div className={styles.formItemThird}>
                            <FormControl fullWidth>
                                <InputLabel>
                                    {language === 'np'
                                        ? nepaliRef[field]
                                        : englishRef[field]}
                                </InputLabel>
                                <Input
                                    type="number"
                                    value={genderWiseLossData[field]}
                                    onChange={e => handlegenderWiseLoss(e, field)}
                                    className={styles.select}
                                    disableUnderline
                                    inputProps={{
                                        disableUnderline: true,
                                    }}
                                    style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                                />
                            </FormControl>
                        </div>
                    ))}
                </div>
                {filterDataTypeError ? (
                    <FormHelperText style={{ color: '#f44336', marginLeft: '14px', marginTop: '20px', fontSize: '16px' }}>
                        {language === 'np' ? 'कृपया माथि मिति प्रकार फिल्टर प्रविष्ट गर्नुहोस्' : 'Please enter date type filter'}
                    </FormHelperText>
                ) : ''}
            </div>

        </>


    );
};
export default connect(mapStateToProps, mapDispatchToProps)(
    Bulletin,
);
