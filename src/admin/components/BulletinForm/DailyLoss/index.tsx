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

import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';
import { ADToBS, BSToAD } from 'bikram-sambat-js';
import {
    hazardTypesSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    languageSelector,
    bulletinEditDataSelector,
} from '#selectors';

import { setLanguageAction } from '#actionCreators';

import {
    incidentSummary,
    peopleLoss,
    genderWiseLoss,
    nepaliRef,
    englishRef,
} from '../formFields';

import styles from './styles.scss';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';


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
        } else {
            setLanguage({ language: 'en' });
        }
    }, [uri]);

    // useEffect(() => {
    //     resetFeedback();
    // }, []);

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
            return {
                centroid: municipalities.find(p => p.id === geoarea).centroid,
                district: districts.filter(d => d.id === (municipalities.find(p => p.id === geoarea).district))[0].title_ne,
            };
        }
        return '';
    };

    const handleFormRegion = (region, field, subfield) => {
        const { centroid: { coordinates }, district } = getRegionDetails(region);
        handleSameHazardChange({ district, coordinates }, field, 'location');
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
            console.log('adding hazard', hazard);
            // handlehazardAdd(hazard);
            handleSameHazardAdd(hazard);
            setHazard(null);
        }
    };

    const handleHazardChange = (e) => {
        setHazard(e);
    };

    const getRegionValue = (distCoordinate) => {
        if (distCoordinate) {
            const obj = districts.filter(item => item.centroid.coordinates[0] === distCoordinate[0] && item.centroid.coordinates[1] === distCoordinate[1]);
            if (obj.length > 0) {
                return { adminLevel: 2, geoarea: obj[0].id };
            }
            return null;
        }
        return null;
    };


    useEffect(() => {
        if (dateAlt) {
            const selectedDate = new Date(dateAlt);
            recordSelectedDate(selectedDate);
            handleBulletinDate(dateAlt);

            // if there is date in redux dont update
        } else {
            let today;
            if (bulletinEditData && Object.keys(bulletinEditData).length > 0 && bulletinEditData.bulletinDate) {
                today = new Date(bulletinEditData.bulletinDate);
            } else {
                today = new Date();
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
    return (
        <>
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
                <div className={styles.formSubContainer}>
                    <div className={styles.formItem}>
                        <form className={styles.datePickerForm}>
                            <label htmlFor="date">
                                {' '}
                                {language === 'np' ? 'मिती' : 'Date'}
                            </label>
                            <NepaliDatePicker
                                inputClassName="form-control"
                                className={styles.datePick}
                                value={ADToBS(dateAlt)}
                                onChange={(value: string) => setDateAlt(BSToAD(value))}
                                options={{ calenderLocale: language === 'np' ? 'ne' : 'en', valueLocale: 'en' }}
                            />
                        </form>

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
                                // disabled
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
                                <h3>
                                    {
                                        field
                                && addedHazardFields[field].hazard}

                                </h3>
                                {field && Object.keys(addedHazardFields[field]).map((subField) => {
                                    if (subField === 'coordinates') {
                                        return (
                                            <div className={styles.inputContainer}>
                                                <StepwiseRegionSelectInput
                                                    className={
                                                        _cs(styles.activeView, styles.stepwiseRegionSelectInput)}
                                                    faramElementName="region"
                                                    wardsHidden
                                                    value={getRegionValue(addedHazardFields[field][subField])}
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
            </div>

        </>


    );
};
export default connect(mapStateToProps, mapDispatchToProps)(
    Bulletin,
);
