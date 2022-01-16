/* eslint-disable max-len */
import React, { useState } from 'react';
import Input from '@material-ui/core/Input';
import { connect } from 'react-redux';
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
} from '../formFields';
import styles from './styles.scss';


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
    } = props;


    return (
        <>
            <div className={styles.formContainer}>
                <h2>दैनिक बिपद् बुलेटिन</h2>
                <h3>२४ घण्टामा बिपद्को विवरणहरु</h3>

                <div className={styles.formSubContainer}>
                    { Object.keys(incidentSummary).map((field, idx) => (

                        <div className={idx > 0 ? styles.formItemHalf : styles.formItem}>
                            <FormControl fullWidth>
                                <InputLabel>
                                    {nepaliRef[field]}
                                </InputLabel>
                                <Input
                                    type="number"
                                    value={incidentData[field]}
                                    onChange={e => handleIncidentChange(e, field)}
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
                <h3>प्रदेश अनुसार मृत्यू, बेपत्ता र घाइते संन्ख्याको बर्गिकरण</h3>
                <div className={styles.formSubContainer}>
                    { Object.keys(peopleLoss).map(field => (
                        <>
                            <h3>{nepaliRef[field]}</h3>
                            { Object.keys(peopleLoss[field]).map(subField => (
                                <div className={styles.formItemThird}>
                                    <FormControl fullWidth>
                                        <InputLabel>
                                            {nepaliRef[subField]}
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
                <h3>प्रकोप अनुसार मृत्यू, बेपत्ता र घाइते संन्ख्याको बर्गिकरण</h3>
                <div className={styles.formSubContainer}>
                    { Object.keys(hazardWiseLoss).map(field => (
                        <>
                            <h3>{field}</h3>
                            { Object.keys(hazardWiseLoss[field]).map(subField => (
                                <div className={styles.formItemHalf}>
                                    <FormControl fullWidth>
                                        <InputLabel>
                                            {nepaliRef[subField]}
                                        </InputLabel>
                                        <Input
                                            type="number"
                                            className={styles.select}
                                            value={hazardWiseLossData[field][subField]}
                                            onChange={e => handlehazardwiseLoss(e, field, subField)}
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
                <h3>लिङ्ग अनुसार मृत्यूको बर्गिकरण</h3>

                <div className={styles.formSubContainer}>
                    { Object.keys(genderWiseLoss).map((field, idx) => (

                        <div className={styles.formItemThird}>
                            <FormControl fullWidth>
                                <InputLabel>
                                    {nepaliRef[field]}
                                </InputLabel>
                                <Input
                                    type="text"
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

export default Bulletin;
