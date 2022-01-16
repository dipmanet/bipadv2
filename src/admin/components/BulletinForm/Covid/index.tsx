/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import produce from 'immer';
import {
    incidentSummary,
    peopleLoss,
    hazardWiseLoss,
    genderWiseLoss,
    nepaliRef,
    covid24hrsStat,
    covidTotalStat,
    vaccineStat,
    covidProvinceWiseTotal,
} from '../formFields';
import styles from './styles.scss';
import FileUploader from '#components/NewLoginModal/FileUploader';

interface Props {

}

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
    } = props;


    return (
        <>
            <div className={styles.formContainer}>
                <h2>COVID-19 बुलेटिन</h2>
                <h3>२४ घण्टामा COVID-19 को विवरण</h3>
                <div className={styles.formSubContainer}>
                    { Object.keys(covid24hrsStat).map((field, idx) => (

                        <div className={idx > 0 ? styles.formItemHalf : styles.formItem}>
                            <FormControl fullWidth>
                                <InputLabel>
                                    {nepaliRef[field]}
                                </InputLabel>
                                <Input
                                    type="text"
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
                <h3>हालसम्मको कुल तथ्याङ्क</h3>
                <div className={styles.formSubContainer}>
                    { Object.keys(covidTotalStat).map((field, idx) => (

                        <div className={styles.formItemHalf}>
                            <FormControl fullWidth>
                                <InputLabel>
                                    {nepaliRef[field]}
                                </InputLabel>
                                <Input
                                    type="text"
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
                <h3>हालसम्मको कुल तथ्याङ्क</h3>
                <div className={styles.formSubContainer}>
                    { Object.keys(vaccineStat).map((field, idx) => (

                        <div className={styles.formItemHalf}>
                            <FormControl fullWidth>
                                <InputLabel>
                                    {nepaliRef[field]}
                                </InputLabel>
                                <Input
                                    type="text"
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
                <h3>प्रदेश अनुसार हालसम्मको कुल तथ्याङ्क</h3>
                <div className={styles.formSubContainer}>
                    { Object.keys(covidProvinceWiseTotal).map(field => (
                        <>
                            <h3>{nepaliRef[field]}</h3>
                            { Object.keys(covidProvinceWiseTotal[field]).map(subField => (
                                <div className={styles.formItemThird}>
                                    <FormControl fullWidth>
                                        <InputLabel>
                                            {nepaliRef[subField]}
                                        </InputLabel>
                                        <Input
                                            type="text"
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

export default Bulletin;
