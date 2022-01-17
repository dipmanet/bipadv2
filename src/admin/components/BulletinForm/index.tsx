/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import produce from 'immer';

import memoize from 'memoize-one';
import {
    listToGroupList,
    isDefined,
    listToMap,
} from '@togglecorp/fujs';
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
import {
    sum,
    saveChart,
    encodeDate,
} from '#utils/common';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    incidentListSelectorIP,
    filtersSelector,
    hazardTypesSelector,
    regionsSelector,
} from '#selectors';
import { setBulletinCovidAction, setBulletinDataTemperature, setBulletinFeedbackAction, setBulletinLossAction, setBulletinTemperatureAction, setIncidentListActionIP,
    setEventListAction } from '#actionCreators';
import styles from './styles.scss';
import { Menu } from '../ProgressMenu/utils';

const lossMetrics = [
    { key: 'count', label: 'Incidents' },
    { key: 'peopleDeathCount', label: 'People death' },
    { key: 'estimatedLoss', label: 'Estimated loss (NPR)' },
    { key: 'infrastructureDestroyedRoadCount', label: 'Road destroyed' },
    { key: 'livestockDestroyedCount', label: 'Livestock destroyed' },
    { key: 'peopleMissingCount', label: 'People missing' },
    { key: 'peopleInjuredCount', label: 'People injured' },
    { key: 'peopleDeathFemaleCount', label: 'Female death' },
    { key: 'peopleDeathMaleCount', label: 'Male death' },
    { key: 'peopleDeathOtherCount', label: 'Other death' },
];

const lossMetricsProvince = [
    { key: 'peopleDeathCount', label: 'People death' },
    { key: 'peopleMissingCount', label: 'People missing' },
    { key: 'peopleInjuredCount', label: 'People injured' },
];
const lossMetricsHazard = [
    { key: 'peopleDeathCount', label: 'People death' },
    { key: 'count', label: 'Incidents' },
];
const lossMetricsProvinceRef = [
    { peopleDeathCount: 'death' },
    { peopleMissingCount: 'missing' },
    { peopleInjuredCount: 'injured' },
];


interface Props {
    setBulletinLossAction: () => void;
}

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setBulletinLoss: params => dispatch(setBulletinLossAction(params)),
    setBulletinCovid: params => dispatch(setBulletinCovidAction(params)),
    setBulletinFeedback: params => dispatch(setBulletinFeedbackAction(params)),
    setBulletinTemperature: params => dispatch(setBulletinTemperatureAction(params)),
    setIncidentList: params => dispatch(setIncidentListActionIP(params)),
    setEventList: params => dispatch(setEventListAction(params)),
});

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    incidentList: incidentListSelectorIP(state),
    hazardTypes: hazardTypesSelector(state),
    regions: regionsSelector(state),
    filters: filtersSelector(state),
});


const today = new Date();
const yesterday = new Date(today);

yesterday.setDate(yesterday.getDate() - 1);

const DEFAULT_START_DATE = yesterday;
const DEFAULT_END_DATE = today;


const requestQuery = ({
    params: {
        // startDate = DEFAULT_START_DATE.toISOString(),
        // endDate = DEFAULT_END_DATE.toISOString(),
        startDate = `${DEFAULT_START_DATE.toISOString().split('T')[0]}T00:00:00+05:45`,
        endDate = `${DEFAULT_END_DATE.toISOString().split('T')[0]}T23:59:59+05:45`,
    } = {},
}) => ({
    expand: ['loss.peoples', 'wards', 'wards.municipality', 'wards.municipality.district'],
    limit: -1,
    incident_on__lt: endDate, // eslint-disable-line @typescript-eslint/camelcase
    incident_on__gt: startDate, // eslint-disable-line @typescript-eslint/camelcase
    ordering: '-incident_on',
    // lnd: true,
});

const requests: { [key: string]: ClientAttributes<ComponentProps, Params> } = {
    incidentsGetRequest: {
        url: '/incident/',
        method: methods.GET,
        query: requestQuery,
        onMount: true,
        onSuccess: ({ response, params }) => {
            if (params) {
                params.setLossData(response.results);
            }
        },
    },
};

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
    const [dailySummary, setDailySumamry] = useState(null);
    const [activeProgressMenu, setActive] = useState(0);
    const [progress, setProgress] = useState(0);
    const [sitRep, setSitRep] = useState(0);
    const incidentRef = useRef(null);
    const {
        setBulletinLoss,
        setBulletinCovid,
        setBulletinFeedback,
        setBulletinTemperature,
        requests: { incidentsGetRequest },
        hazardTypes,
    } = props;

    const [lossData, setLossData] = useState();

    incidentsGetRequest.setDefaultParams({ setLossData });

    const handleDailySummary = (e) => {
        setDailySumamry(e.target.value);
    };


    const handleSitRep = (num) => {
        setSitRep(num);
    };

    const handleIncidentChange = (e, field) => {
        console.log('e', e);
        console.log('field', field);
        console.log('incidentData', incidentData);
        const newState = produce(incidentData, (deferedState) => {
            // eslint-disable-next-line no-param-reassign
            deferedState[field] = e;
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
                    sitRep,
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
                    tempMin: minTemp,
                    tempMax: maxTemp,
                    dailySummary,
                });
            }
            setProgress(progress + 1);
            setActive(progress + 1);
        }
    };

    const calculateSummary = (data) => {
        const stat = lossMetrics.reduce((acc, { key }) => ({
            ...acc,
            [key]: sum(
                data
                    .filter(incident => incident.loss)
                    .map(incident => incident.loss[key])
                    .filter(isDefined),
            ),
        }), {});

        stat.count = data.length;

        return stat;
    };

    const calculateSummaryProvince = (data) => {
        const stat = lossMetricsProvince.reduce((acc, { key }) => ({
            ...acc,
            [key]: sum(
                data
                    .filter(incident => incident.loss)
                    .map(incident => incident.loss[key])
                    .filter(isDefined),
            ),
        }), {});

        stat.count = data.length;

        return stat;
    };
    const calculateSummaryHazard = (data) => {
        const stat = lossMetricsHazard.reduce((acc, { key }) => ({
            ...acc,
            [key]: sum(
                data
                    .filter(incident => incident.loss)
                    .map(incident => incident.loss[key])
                    .filter(isDefined),
            ),
        }), {});

        stat.count = data.length;

        return stat;
    };

    useEffect(() => {
        if (lossData) {
            console.log('lossData', lossData);

            const summary = calculateSummary(lossData);
            setIncidentData({
                numberOfIncidents: summary.count,
                numberOfDeath: summary.peopleDeathCount,
                numberOfMissing: summary.peopleMissingCount,
                numberOfInjured: summary.peopleInjuredCount,
                estimatedLoss: summary.estimatedLoss,
                roadBlock: summary.infrastructureDestroyedRoadCount,
                cattleLoss: summary.livestockDestroyedCount,
            });
            setgenderWiseLoss({
                male: summary.peopleDeathMaleCount,
                female: summary.peopleDeathFemaleCount,
                unknown: summary.peopleDeathOtherCount,
            });


            const p1Data = lossData.filter(lD => lD.wards[0].municipality.district.province === 1);
            const p2Data = lossData.filter(lD => lD.wards[0].municipality.district.province === 2);
            const p3Data = lossData.filter(lD => lD.wards[0].municipality.district.province === 3);
            const p4Data = lossData.filter(lD => lD.wards[0].municipality.district.province === 4);
            const p5Data = lossData.filter(lD => lD.wards[0].municipality.district.province === 5);
            const p6Data = lossData.filter(lD => lD.wards[0].municipality.district.province === 6);
            const p7Data = lossData.filter(lD => lD.wards[0].municipality.district.province === 7);
            setPeopleLoss({
                p1: {
                    death: calculateSummaryProvince(p1Data).peopleDeathCount,
                    missing: calculateSummaryProvince(p1Data).peopleMissingCount,
                    injured: calculateSummaryProvince(p1Data).peopleInjuredCount,
                },
                p2: {
                    death: calculateSummaryProvince(p2Data).peopleDeathCount,
                    missing: calculateSummaryProvince(p2Data).peopleMissingCount,
                    injured: calculateSummaryProvince(p2Data).peopleInjuredCount,
                },
                bagmati: {
                    death: calculateSummaryProvince(p3Data).peopleDeathCount,
                    missing: calculateSummaryProvince(p3Data).peopleMissingCount,
                    injured: calculateSummaryProvince(p3Data).peopleInjuredCount,
                },
                gandaki: {
                    death: calculateSummaryProvince(p4Data).peopleDeathCount,
                    missing: calculateSummaryProvince(p4Data).peopleMissingCount,
                    injured: calculateSummaryProvince(p4Data).peopleInjuredCount,
                },
                lumbini: {
                    death: calculateSummaryProvince(p5Data).peopleDeathCount,
                    missing: calculateSummaryProvince(p5Data).peopleMissingCount,
                    injured: calculateSummaryProvince(p5Data).peopleInjuredCount,
                },
                karnali: {
                    death: calculateSummaryProvince(p6Data).peopleDeathCount,
                    missing: calculateSummaryProvince(p6Data).peopleMissingCount,
                    injured: calculateSummaryProvince(p6Data).peopleInjuredCount,
                },
                sudurpaschim: {
                    death: calculateSummaryProvince(p7Data).peopleDeathCount,
                    missing: calculateSummaryProvince(p7Data).peopleMissingCount,
                    injured: calculateSummaryProvince(p7Data).peopleInjuredCount,
                },
            });
            const newhazardData = {};
            const uniqueHazards = [...new Set(lossData.map(h => h.hazard))];
            const hD = uniqueHazards.map((h) => {
                newhazardData[hazardTypes[h].titleNe] = {
                    deaths: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).peopleDeathCount,
                    incidents: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).count,
                };
                return null;
            });

            setHazardwise(newhazardData);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lossData]);

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
            handleSitRep={handleSitRep}
            sitRep={sitRep}
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
            handleDailySummary={handleDailySummary}
            dailySummary={dailySummary}
        />,
        <PDFPreview />,
    ];

    useEffect(() => {
        console.log('incidentData in parent', incidentData);
    }, [incidentData]);

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

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Bulletin,
        ),
    ),
);
