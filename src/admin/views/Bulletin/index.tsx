/* eslint-disable max-len */
import React, { useState } from 'react';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import produce from 'immer';
import BulletinPDFLoss from 'src/admin/components/BulletinPDFLoss';
import BulletinPDFCovid from 'src/admin/components//BulletinPDFCovid';
import BulletinPDFFooter from 'src/admin/components//BulletinPDFFooter';
import MenuCommon from 'src/admin/components/MenuCommon';
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
} from './formFields';
import styles from './styles.scss';
import FileUploader from '#components/NewLoginModal/FileUploader';

interface Props {

}

const Bulletin = (props: Props) => {
    const [incidentData, setIncidentData] = useState(incidentSummary);
    const [peopleLossData, setPeopleLoss] = useState(peopleLoss);
    const [hazardWiseLossData, setHazardwise] = useState(hazardWiseLoss);
    const [genderWiseLossData, setgenderWiseLoss] = useState(genderWiseLoss);
    const [covid24hrsStatData, setcovid24hrsStat] = useState(covid24hrsStat);
    const [covidTotalStatData, setcovidTotalStat] = useState(covidTotalStat);
    const [vaccineStatData, setvaccineStat] = useState(vaccineStat);
    const [covidProvinceWiseData, setcovidProvinceWiseTotal] = useState(covidProvinceWiseTotal);
    const [remarks, setRemarks] = useState('');
    const [showPdf, setshowPdf] = useState(false);

    const handleSubmitButton = () => {
        // handle submit
        setshowPdf(!showPdf);
    };

    const handleIncidentChange = (e, field) => {
        const newState = produce(incidentData, (deferedState) => {
            // eslint-disable-next-line no-param-reassign
            deferedState[field] = e.target.value;
        });
        setIncidentData(newState);
    };

    const handlePeopleLossChange = (e, field, subfield) => {
        const newData = { ...peopleLossData };
        const newFieldData = newData[field];
        const newSubData = { ...newFieldData, [subfield]: e.target.value };
        setPeopleLoss({ ...newData, [field]: newSubData });
    };

    const handlehazardwiseLoss = (e, field, subfield) => {
        const newData = { ...hazardWiseLossData };
        const newFieldData = newData[field];
        const newSubData = { ...newFieldData, [subfield]: e.target.value };
        setHazardwise({ ...newData, [field]: newSubData });
    };

    const handlegenderWiseLoss = (e, field) => {
        const newState = produce(genderWiseLossData, (deferedState) => {
            // eslint-disable-next-line no-param-reassign
            deferedState[field] = e.target.value;
        });
        setgenderWiseLoss(newState);
    };

    const handleCovidTotalStat = (e, field) => {
        const newState = produce(covidTotalStatData, (deferedState) => {
            // eslint-disable-next-line no-param-reassign
            deferedState[field] = e.target.value;
        });
        setcovidTotalStat(newState);
    };

    const handleCovid24hrStat = (e, field) => {
        const newState = produce(covid24hrsStatData, (deferedState) => {
            // eslint-disable-next-line no-param-reassign
            deferedState[field] = e.target.value;
        });
        setcovid24hrsStat(newState);
    };

    const handleVaccineStat = (e, field) => {
        const newState = produce(vaccineStatData, (deferedState) => {
            // eslint-disable-next-line no-param-reassign
            deferedState[field] = e.target.value;
        });
        setvaccineStat(newState);
    };

    const handleprovincewiseTotal = (e, field, subfield) => {
        const newData = { ...covidProvinceWiseData };
        const newFieldData = newData[field];
        const newSubData = { ...newFieldData, [subfield]: e.target.value };
        setcovidProvinceWiseTotal({ ...newData, [field]: newSubData });
    };

    return (
        <>
            <MenuCommon currentPage="Health Infrastructure" layout="landing" />
            {
                showPdf
                    ? (
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
                                                        onChange={e => handleprovincewiseTotal(e, field)}
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
                            <h3>२४ घण्टामा बिपद्का घटनाहरुमा भएको प्रतिकृया</h3>
                            <div className={styles.formSubContainer}>
                                <div className={styles.formItem}>
                                    <FormControl fullWidth>
                                        <InputLabel>
                                            {'प्रतिकृया दिनुहोस्...'}
                                        </InputLabel>
                                        <Input
                                            type="text"
                                            value={remarks}
                                            onChange={e => setRemarks(e.target.value)}
                                            rows={5}
                                            className={styles.select}
                                            disableUnderline
                                            inputProps={{
                                                disableUnderline: true,
                                            }}
                                            style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                                        />
                                    </FormControl>
                                </div>
                            </div>
                            <h3>दैनिक अधिकतम तापक्रम</h3>
                            <FileUploader
                                onFileSelectSuccess={() => console.log('filed upload success...')}
                                disable={false}
                            />
                            <h3>दैनिक न्यूनतम तापक्रम</h3>
                            <FileUploader
                                onFileSelectSuccess={() => console.log('filed upload success...')}
                                disable={false}
                            />
                            <div className={styles.submitButtonContainer}>
                                <button
                                    type="button"
                                    onClick={handleSubmitButton}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    )
                    : (
                        <>
                            <BulletinPDFLoss />
                            <BulletinPDFCovid />
                            <BulletinPDFFooter />
                            <div className={styles.submitButtonContainer}>
                                <button
                                    type="button"
                                    onClick={handleSubmitButton}
                                >
                                    Edit
                                </button>
                            </div>
                        </>
                    )
            }
        </>


    );
};

export default Bulletin;
