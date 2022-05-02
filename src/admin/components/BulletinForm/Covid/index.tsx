/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { Translation } from 'react-i18next';
import { languageSelector } from '#selectors';

import {
    nepaliRef,
    englishRef,
    covid24hrsStat,
    covidTotalStat,
    vaccineStat,
    covidProvinceWiseTotal,
} from '../formFields';
import styles from './styles.scss';

interface Props {

}
const mapStateToProps = (state: AppState): PropsFromAppState => ({
    language: languageSelector(state),
});

const Bulletin = (props: Props) => {
    const {
        covid24hrsStatData,
        covidTotalStatData,
        vaccineStatData,
        covidProvinceWiseData,
        handleCovidTotalStat,
        handleCovid24hrStat,
        handleVaccineStat,
        handleprovincewiseTotal,
        language: { language },
    } = props;

    useEffect(() => {
        console.log('covidProvinceWiseTotal', covidProvinceWiseTotal, 'covidProvinceWiseData', covidProvinceWiseData);
    }, [covidProvinceWiseData]);

    return (
        <>
            <div className={styles.formContainer}>

                <Translation>
                    {
                        t => <h2>{t('COVID-19 Bulletin')}</h2>
                    }
                </Translation>
                <Translation>
                    {
                        t => <h3>{t('COVID-19 details of the last 24 hrs')}</h3>
                    }
                </Translation>
                <div className={styles.formSubContainer}>
                    { Object.keys(covid24hrsStat).map((field, idx) => (

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
                                    value={covid24hrsStatData[field]}
                                    onChange={e => handleCovid24hrStat(e, field)}
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
                        t => <h3>{t('Stats till date')}</h3>
                    }
                </Translation>
                <div className={styles.formSubContainer}>
                    { Object.keys(covidTotalStat).map((field, idx) => (

                        <div className={styles.formItemHalf}>
                            <FormControl fullWidth>
                                <InputLabel>
                                    {language === 'np'
                                        ? nepaliRef[field]
                                        : englishRef[field]
                                    }
                                </InputLabel>
                                <Input
                                    type="number"
                                    value={covidTotalStatData[field]}
                                    onChange={e => handleCovidTotalStat(e, field)}
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
                        t => <h3>{t('Vaccine Stats')}</h3>
                    }
                </Translation>
                <div className={styles.formSubContainer}>
                    { Object.keys(vaccineStat).map((field, idx) => (

                        <div className={styles.formItemHalf}>
                            <FormControl fullWidth>
                                <InputLabel>
                                    {language === 'np'
                                        ? nepaliRef[field]
                                        : englishRef[field]
                                    }
                                </InputLabel>
                                <Input
                                    type="number"
                                    value={vaccineStatData[field]}
                                    onChange={e => handleVaccineStat(e, field)}
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
                        t => <h3>{t('Provincewise stats till date')}</h3>
                    }
                </Translation>
                <div className={styles.formSubContainer}>
                    { Object.keys(covidProvinceWiseTotal).map(field => (
                        <>
                            <h3>
                                {' '}
                                {language === 'np'
                                    ? nepaliRef[field]
                                    : englishRef[field]
                                }

                            </h3>
                            { Object.keys(covidProvinceWiseTotal[field]).map(subField => (
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
                                            value={covidProvinceWiseData[field][subField]}
                                            onChange={e => handleprovincewiseTotal(e, field, subField)}
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
            </div>

        </>


    );
};

export default connect(mapStateToProps)(Bulletin);
