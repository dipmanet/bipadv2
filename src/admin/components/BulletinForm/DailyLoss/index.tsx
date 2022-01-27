/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import Input from '@material-ui/core/Input';
import { connect } from 'react-redux';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { hazardTypesSelector } from '#selectors';


import {
    incidentSummary,
    peopleLoss,
    hazardWiseLoss,
    genderWiseLoss,
    nepaliRef,
} from '../formFields';
import styles from './styles.scss';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    hazardTypes: hazardTypesSelector(state),
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
    } = props;
    const [hazard, setHazard] = useState();
    const [hazardIncidents, setHazardIncidents] = useState();
    const [hazardDeaths, setHazardDeaths] = useState();


    const handleHazardAddItem = () => {
        handlehazardAdd(hazard);
    };

    const handleHazardChange = (e) => {
        setHazard(e);
    };


    return (
        <>
            <div className={styles.formContainer}>
                <h2>दैनिक बिपद् बुलेटिन</h2>
                <h3>२४ घण्टामा बिपद्को विवरणहरु</h3>

                <div className={styles.formSubContainer}>
                    <FormControl fullWidth>
                        <InputLabel>
                            {'Sit Rep'}
                        </InputLabel>
                        <Input
                            type="text"
                            value={sitRep}
                            // onChange={e => handleSitRep(e.target.value)}
                            className={styles.select}
                            disableUnderline
                            inputProps={{
                                disableUnderline: true,
                            }}
                            disabled
                            style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                        />
                    </FormControl>
                    { Object.keys(incidentSummary).map((field, idx) => (

                        <div className={idx > 0 ? styles.formItemHalf : styles.formItem}>
                            <FormControl fullWidth>
                                <InputLabel>
                                    {nepaliRef[field]}
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
                    { Object.keys(hazardWiseLossData).map(field => (
                        <>
                            <h3>{field}</h3>
                            { Object.keys(hazardWiseLossData[field]).map(subField => (
                                <div className={styles.formItemHalf}>
                                    <FormControl fullWidth>
                                        <InputLabel>
                                            {nepaliRef[subField]}
                                        </InputLabel>
                                        <Input
                                            type="number"
                                            className={styles.select}
                                            value={hazardWiseLossData[field][subField]}
                                            onChange={e => handlehazardwiseLoss(e.target.value, field, subField)}
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


                <div className={styles.formSubContainer}>
                    <div className={styles.formItem}>
                        <FormControl style={{ margin: '15px 0' }} fullWidth>
                            <InputLabel id="hazardInput">नयाँ प्रकोप थप्नुहोस्</InputLabel>
                            <Select
                                labelId="hazardLabel"
                                id="hazardInput"
                                value={hazard}
                                label="Add New Hazard Field"
                                onChange={e => handleHazardChange(e.target.value)}
                                style={{ borderRadius: '3px', padding: '0 10px' }}
                                disableUnderline
                            >
                                {
                                    hazardTypes
                            && Object.keys(hazardTypes).map(hT => (<MenuItem value={hazardTypes[hT].titleNe}>{hazardTypes[hT].titleNe}</MenuItem>))
                                }
                            </Select>
                        </FormControl>
                    </div>

                    <div className={styles.btnContainer}>
                        <button
                            type="button"
                            onClick={handleHazardAddItem}
                            className={styles.hazardAddBtn}
                        >
                            + थप्नुहोस्
                        </button>
                    </div>
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
export default connect(mapStateToProps)(
    Bulletin,
);
