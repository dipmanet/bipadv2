/* eslint-disable max-len */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import produce from 'immer';
import DailyLoss from './DailyLoss';
import Covid from './Covid';
import Feedback from './Feedback';
import Temperatures from './Temperatures';
import PDFPreview from './PDFPreview';
import ProgressMenu from '../ProgressMenu';
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

import { setBulletinCovidAction, setBulletinDataTemperature, setBulletinFeedbackAction, setBulletinLossAction, setBulletinTemperatureAction } from '#actionCreators';
import styles from './styles.scss';
import { Menu } from '../ProgressMenu/utils';

interface Props {
    setBulletinLossAction: () => void;
}

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setBulletinLoss: params => dispatch(setBulletinLossAction(params)),
    setBulletinCovid: params => dispatch(setBulletinCovidAction(params)),
    setBulletinFeedback: params => dispatch(setBulletinFeedbackAction(params)),
    setBulletinTemperature: params => dispatch(setBulletinTemperatureAction(params)),
});

const Bulletin = (props: Props) => {
    const [incidentData, setIncidentData] = useState(incidentSummary);
    const [peopleLossData, setPeopleLoss] = useState(peopleLoss);
    const [hazardWiseLossData, setHazardwise] = useState(hazardWiseLoss);
    const [genderWiseLossData, setgenderWiseLoss] = useState(genderWiseLoss);
    const [covid24hrsStatData, setcovid24hrsStat] = useState(covid24hrsStat);
    const [covidTotalStatData, setcovidTotalStat] = useState(covidTotalStat);
    const [vaccineStatData, setvaccineStat] = useState(vaccineStat);
    const [covidProvinceWiseData, setcovidProvinceWiseTotal] = useState(covidProvinceWiseTotal);
    const [feedback, setFeedback] = useState([]);
    const [maxTemp, setMaxTemp] = useState(null);
    const [minTemp, setMinTemp] = useState(null);
    const [showPdf, setshowPdf] = useState(false);
    const [activeProgressMenu, setActive] = useState(0);
    const [progress, setProgress] = useState(0);
    const {
        setBulletinLoss,
        setBulletinCovid,
        setBulletinFeedback,
        setBulletinTemperature,
    } = props;


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

    const handleFeedbackChange = (e) => {
        setFeedback([...feedback, e]);
    };

    const handleMaxTemp = (e) => {
        setMaxTemp(e);
    };

    const handleMinTemp = (e) => {
        setMinTemp(e);
    };

    const deleteFeedbackChange = (d) => {
        const n = [...feedback];
        setFeedback(n.filter(item => item !== d));
    };

    const handlePrevBtn = () => {
        if (progress > 0) {
            setProgress(progress - 1);
            setActive(progress - 1);
        }
    };

    const handleNextBtn = () => {
        if (progress < Menu.bulletinProgressMenu.length - 1) {
            if (progress === 0) {
                setBulletinLoss({
                    incidentSummary: incidentData,
                    peopleLoss: peopleLossData,
                    hazardWiseLoss: hazardWiseLossData,
                    genderWiseLoss: genderWiseLossData,
                });
            }
            if (progress === 1) {
                setBulletinCovid({
                    covid24hrsStat: covid24hrsStatData,
                    covidProvinceWiseTotal: covidProvinceWiseData,
                    covidTotalStat: covidTotalStatData,
                    vaccineStat: vaccineStatData,
                });
            }
            if (progress === 2) {
                setBulletinFeedback({
                    feedback,
                });
            }
            if (progress === 3) {
                setBulletinTemperature({
                    tempMin: null,
                    tempMax: null,
                });
            }
            setProgress(progress + 1);
            setActive(progress + 1);
        }
    };


    const formSections = [
        <DailyLoss
            handleIncidentChange={handleIncidentChange}
            handlePeopleLossChange={handlePeopleLossChange}
            handlehazardwiseLoss={handlehazardwiseLoss}
            handlegenderWiseLoss={handlegenderWiseLoss}
            incidentData={incidentData}
            peopleLossData={peopleLossData}
            hazardWiseLossData={hazardWiseLossData}
            genderWiseLossData={genderWiseLossData}
        />,
        <Covid
            covid24hrsStatData={covid24hrsStatData}
            covidTotalStatData={covidTotalStatData}
            vaccineStatData={vaccineStatData}
            covidProvinceWiseData={covidProvinceWiseData}
            handleCovidTotalStat={handleCovidTotalStat}
            handleCovid24hrStat={handleCovid24hrStat}
            handleVaccineStat={handleVaccineStat}
            handleprovincewiseTotal={handleprovincewiseTotal}
        />,
        <Feedback
            handleFeedbackChange={handleFeedbackChange}
            feedback={feedback}
            deleteFeedbackChange={deleteFeedbackChange}
        />,
        <Temperatures
            minTemp={minTemp}
            maxTemp={maxTemp}
            handleMaxTemp={handleMaxTemp}
            handleMinTemp={handleMinTemp}

        />,
        <PDFPreview />,
    ];

    return (

        <div className={styles.mainSection}>
            <div className={styles.leftMenuSection}>
                <ProgressMenu
                    menuKey="bulletinProgressMenu"
                    activeMenu={activeProgressMenu}
                    progress={progress}
                />
            </div>

            <div className={styles.rightFormSection}>
                {formSections[activeProgressMenu]}
                <div className={styles.buttonsContainer}>
                    <button
                        type="button"
                        onClick={handlePrevBtn}
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        onClick={handleNextBtn}
                    >
                        Next
                    </button>
                </div>
            </div>


        </div>
    );
};

export default connect(undefined, mapDispatchToProps)(
    // createConnectedRequestCoordinator<ReduxProps>()(
    // createRequestClient(requests)(
    Bulletin,
    // ),
    // ),
);
