/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-bracket-spacing */
/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import produce from 'immer';

import memoize from 'memoize-one';
import {
    listToGroupList,
    isDefined,
    listToMap,
    _cs,
} from '@togglecorp/fujs';
import DailyLoss from './DailyLoss';
import Covid from './Covid';
import Response from './Response';
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
    bulletinEditDataSelector,
    languageSelector,
} from '#selectors';
import {
    setBulletinCovidAction, setBulletinDataTemperature, setBulletinFeedbackAction, setBulletinLossAction, setBulletinTemperatureAction, setIncidentListActionIP,
    setEventListAction, setBulletinEditDataAction,
} from '#actionCreators';
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
    { key: 'peopleMissingCount', label: 'People missing' },
    { key: 'peopleInjuredCount', label: 'People injured' },
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
    setBulletinEditData: params => dispatch(setBulletinEditDataAction(params)),
});

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    incidentList: incidentListSelectorIP(state),
    hazardTypes: hazardTypesSelector(state),
    regions: regionsSelector(state),
    filters: filtersSelector(state),
    bulletinEditData: bulletinEditDataSelector(state),
    language: languageSelector(state),
});


const selectDateForQuery = (today) => {
    // const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    const DEFAULT_START_DATE = yesterday;
    const DEFAULT_END_DATE = today;

    console.log('dateed');
    const requestQuery = ({
        params: {
            // startDate = DEFAULT_START_DATE.toISOString(),
            // endDate = DEFAULT_END_DATE.toISOString(),
            startDate = `${DEFAULT_START_DATE.toISOString().split('T')[0]}T10:00:00+05:45`,
            endDate = `${DEFAULT_END_DATE.toISOString().split('T')[0]}T10:00:00+05:45`,
        } = {},
    }) => ({
        expand: ['loss.peoples', 'wards', 'wards.municipality', 'wards.municipality.district'],
        limit: -1,
        incident_on__lt: endDate, // eslint-disable-line @typescript-eslint/camelcase
        incident_on__gt: startDate, // eslint-disable-line @typescript-eslint/camelcase
        ordering: '-incident_on',
        // lnd: true,
    });
    return requestQuery;
};

const todayDate = new Date();
const requestQueryCovidNational = ({
    params: {
        startDate = `${todayDate.toISOString().split('T')[0]}`,
    } = {},
}) => ({
    limit: -1,
    reported_on: startDate, // eslint-disable-line @typescript-eslint/camelcase
});
const requestQueryCovidQuarantine = ({
    params: {
        startDate = `${todayDate.toISOString().split('T')[0]}`,
    } = {},
}) => ({
    limit: -1,
    summary: true,
    // eslint-disable-next-line @typescript-eslint/camelcase
    summary_type: 'heoc_admin_overview_covid19_table',
});

const requests: { [key: string]: ClientAttributes<ComponentProps, Params> } = {
    incidentsGetRequest: {
        url: '/incident/',
        method: methods.GET,
        query: ({ params }) => ({
            expand: params.expand,
            limit: params.limit,
            incident_on__lt: params.incident_on__lt,
            incident_on__gt: params.incident_on__gt,
            ordering: params.ordering,
        }),
        onMount: true,
        onSuccess: ({ response, params, props: { setIncidentList } }) => {
            setIncidentList({ incidentList: response.results });
            if (params && params.setLossData) {
                params.setLossData(response.results);
            }
        },
    },
    covidNationalInfo: {
        url: '/covid19-nationalinfo/',
        method: methods.GET,
        query: requestQueryCovidNational,
        onMount: false,
        onSuccess: ({ response, params }) => {
            if (params) {
                params.setCovidNational(response.results);
            }
        },
    },
    covidQuarantine: {
        url: '/covid19-quarantineinfo/',
        method: methods.GET,
        query: requestQueryCovidQuarantine,
        onMount: false,
        onSuccess: ({ response, params }) => {
            if (params) {
                params.setCovidQurantine(response.results);
            }
        },
    },
    sitRepQuery: {
        url: '/bipad-bulletin/?ordering=-id&limit=1',
        method: methods.GET,
        onMount: false,
        onSuccess: ({ response, params: { setSitRep } }) => {
            setSitRep(response.results[0].sitrep + 1);
        },
    },
    getEditData: {
        url: '/bipad-bulletin/',
        method: methods.GET,
        query: ({ params }) => ({
            sitrep: params.sitrep,
        }),
        onMount: false,
        onSuccess: ({ response, props, params }) => {
            if (response.results.length > 0) {
                props.setBulletinEditData({ ...response.results[0], language: params.language });
            }
        },
    },
};

const Bulletin = (props: Props) => {
    const [incidentData, setIncidentData] = useState(incidentSummary);
    const [peopleLossData, setPeopleLoss] = useState(peopleLoss);
    const [hazardWiseLossData, setHazardwise] = useState(hazardWiseLoss);
    const [addedHazardFields, setAddedData] = useState({});
    const [genderWiseLossData, setgenderWiseLoss] = useState(genderWiseLoss);
    const [covid24hrsStatData, setcovid24hrsStat] = useState(covid24hrsStat);
    const [covidTotalStatData, setcovidTotalStat] = useState(covidTotalStat);
    const [vaccineStatData, setvaccineStat] = useState(vaccineStat);
    const [covidProvinceWiseData, setcovidProvinceWiseTotal] = useState(covidProvinceWiseTotal);
    const [feedback, setFeedback] = useState({});
    const [maxTemp, setMaxTemp] = useState(null);
    const [minTemp, setMinTemp] = useState(null);
    const [rainSummaryPic, setRainSummaryPic] = useState(null);
    const [maxTempFooter, setMaxTempFooter] = useState(null);
    const [minTempFooter, setMinTempFooter] = useState(null);
    const [showPdf, setshowPdf] = useState(false);
    const [hilight, setHilight] = useState('');
    const [dailySummary, setDailySumamry] = useState(null);
    const [activeProgressMenu, setActive] = useState(0);
    const [progress, setProgress] = useState(0);
    const [sitRep, setSitRep] = useState(0);
    const [selectedDate, setSelectedate] = useState();
    const [rainSummaryFooter, setRainSummaryFooter] = useState('');
    // const [bulletinDate, setBulletinDate] = useState();
    const [date, setDate] = useState();
    const countId = useRef(0);
    const {
        setBulletinLoss,
        setBulletinCovid,
        setBulletinFeedback,
        setBulletinTemperature,
        bulletinEditData,
        requests: {
            incidentsGetRequest,
            covidNationalInfo,
            covidQuarantine,
            sitRepQuery,
            getEditData,
        },
        hazardTypes,
        language: { language },
        uri,
    } = props;


    const [lossData, setLossData] = useState();
    const [covidNational, setCovidNational] = useState([]);
    const [covidQuaratine, setCovidQurantine] = useState([]);


    covidNationalInfo.setDefaultParams({ setCovidNational });
    covidQuarantine.setDefaultParams({ setCovidQurantine });
    sitRepQuery.setDefaultParams({ setSitRep });

    const hazardDatafromFeedback = (feedbackData, lang) => {
        const newObj = {};
        console.log('feedbackData', feedbackData);
        console.log('lang', lang);
        if (feedbackData && Object.keys(feedbackData).length > 0) {
            Object.values(feedbackData).map((item) => {
                if (lang === 'nepali') {
                    newObj[item.hazardNp] = { ...item };
                } else {
                    newObj[item.hazardEn] = { ...item };
                } return null;
            });
        }
        return newObj;
    };

    useEffect(() => {
        console.log('Enter Wait', selectedDate);
        if (selectedDate) {
            const today = selectedDate;
            const yesterday = new Date(today);

            yesterday.setDate(yesterday.getDate() - 1);

            const DEFAULT_START_DATE = yesterday;
            const DEFAULT_END_DATE = today;
            const startDate = `${DEFAULT_START_DATE.toISOString().split('T')[0]}T10:00:00+05:45`;
            const endDate = `${DEFAULT_END_DATE.toISOString().split('T')[0]}T10:00:00+05:45`;
            const expand = ['loss.peoples', 'wards', 'wards.municipality', 'wards.municipality.district'];
            const limit = -1;
            const incident_on__lt = endDate; // eslint-disable-line @typescript-eslint/camelcase
            const incident_on__gt = startDate; // eslint-disable-line @typescript-eslint/camelcase
            const ordering = '-incident_on';

            // const requestQuery = ({
            //     params: {
            //         // startDate = DEFAULT_START_DATE.toISOString(),
            //         // endDate = DEFAULT_END_DATE.toISOString(),
            //         startDate = `${DEFAULT_START_DATE.toISOString().split('T')[0]}T10:00:00+05:45`,
            //         endDate = `${DEFAULT_END_DATE.toISOString().split('T')[0]}T10:00:00+05:45`,
            //     } = {},
            // }) => ({
            //     expand: ['loss.peoples', 'wards', 'wards.municipality', 'wards.municipality.district'],
            //     limit: -1,
            //     incident_on__lt: endDate, // eslint-disable-line @typescript-eslint/camelcase
            //     incident_on__gt: startDate, // eslint-disable-line @typescript-eslint/camelcase
            //     ordering: '-incident_on',
            //     // lnd: true,
            // });


            console.log('Enter', selectedDate);
            const test = selectDateForQuery(selectedDate);
            console.log('data function', test);
            incidentsGetRequest.do({
                expand,
                limit,
                incident_on__lt,
                incident_on__gt,
                ordering,
                setLossData,
            });
        }
    }, [selectedDate]);


    useEffect(() => {
        if (bulletinEditData && Object.keys(bulletinEditData).length > 0) {
            setSitRep(bulletinEditData.sitrep);
            setIncidentData(bulletinEditData.incidentSummary);
            setPeopleLoss(bulletinEditData.peopleLoss);
            setgenderWiseLoss(bulletinEditData.genderWiseLoss);
            setcovid24hrsStat(bulletinEditData.covidTwentyfourHrsStat);
            setcovidTotalStat(bulletinEditData.covidTotalStat);
            setvaccineStat(bulletinEditData.vaccineStat);
            setcovidProvinceWiseTotal(bulletinEditData.covidProvinceWiseTotal);

            if (bulletinEditData.language === 'nepali') {
                setHazardwise(hazardDatafromFeedback(bulletinEditData.feedbackNe, 'nepali'));
                setMinTemp(bulletinEditData.tempMinNe);
                setMinTempFooter(bulletinEditData.tempMinFooterNe);
                setMaxTemp(bulletinEditData.tempMaxNe);
                setMaxTempFooter(bulletinEditData.tempMaxFooterNe);
                setFeedback(bulletinEditData.feedbackNe);
                setDailySumamry(bulletinEditData.dailySummaryNe);
                setRainSummaryPic(bulletinEditData.rainSummaryPictureNe);
                setRainSummaryFooter(bulletinEditData.rainSummaryPictureFooterNe);
                setHilight(bulletinEditData.highlightNe);
            } else {
                setHazardwise(hazardDatafromFeedback(bulletinEditData.feedback, 'english'));
                setMinTemp(bulletinEditData.tempMin);
                setMinTempFooter(bulletinEditData.tempMinFooter);
                setMaxTemp(bulletinEditData.tempMax);
                setMaxTempFooter(bulletinEditData.tempMaxFooter);
                setFeedback(bulletinEditData.feedback);
                setDailySumamry(bulletinEditData.dailySummary);
                setRainSummaryPic(bulletinEditData.rainSummaryPicture);
                setRainSummaryFooter(bulletinEditData.rainSummaryPictureFooter);
                setHilight(bulletinEditData.highlight);
            }
        } else {
            // incidentsGetRequest.do();
            covidNationalInfo.do();
            covidQuarantine.do();
            sitRepQuery.do();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bulletinEditData]);


    const handleSitRep = (num) => {
        setSitRep(num);
    };

    const handlesitRepBlur = (e) => {
        console.log('on blur event', e.target.value);
        getEditData.do({ sitrep: e.target.value, language: language === 'np' ? 'nepali' : 'english' });
    };


    const handleHilightChange = (e) => {
        setHilight(e.target.value);
    };

    const handleIncidentChange = (e, field) => {
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
        const newSubData = { ...newFieldData, [subfield]: e };
        setHazardwise({ ...newData, [field]: newSubData });
    };

    const handleSameHazardChange = (e, field, subfield) => {
        const newData = { ...addedHazardFields };
        const newFieldData = newData[field];
        if (subfield === 'location') {
            const newSubData = { ...newFieldData, coordinates: e.coordinates, district: e.district };
            setAddedData({ ...feedback, ...newData, [field]: newSubData });
            setFeedback({ ...feedback, ...newData, [field]: newSubData });
        } else {
            const newSubData = { ...newFieldData, [subfield]: e };
            setAddedData({ ...feedback, ...newData, [field]: newSubData });
            setFeedback({ ...feedback, ...newData, [field]: newSubData });
        }
    };

    const resetFeedback = () => {
        setFeedback({});
    };

    const handlehazardAdd = (hazard) => {
        console.log('hazard', hazard);
        const newData = { ...addedHazardFields };
        setAddedData({ ...newData, [Math.random()]: { hazard, deaths: 0, injured: 0, missing: 0, coordinates: [0, 0] } });
        // add it to hazard too
        const hazardData = { ...hazardWiseLossData };
    };
    // this runs when button is clicked
    const handleSameHazardAdd = (hazard) => {
        console.log('hazard', hazard);

        const newData = { ...addedHazardFields };
        setAddedData({ ...newData, [countId.current]: { hazard, deaths: 0, injured: 0, missing: 0, coordinates: [0, 0] } });
        console.log('feedback appended', feedback);
        setFeedback({ ...feedback, [countId.current]: { hazard, deaths: 0, injured: 0, missing: 0, coordinates: [0, 0] } });
        countId.current += 1;
    };


    const handlegenderWiseLoss = (e, field) => {
        const newState = produce(genderWiseLossData, (deferedState) => {
            // eslint-disable-next-line no-param-reassign
            deferedState[field] = e.target.value;
        });
        setgenderWiseLoss(newState);
    };

    useEffect(() => {
        console.log('feedback main obj', feedback);
    }, [feedback]);
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
        setFeedback(Object.assign({}, feedback, e));
    };

    const handleSubFieldChange = (e, field, subfield) => {
        const newObj = { ...feedback[field] };
        newObj[subfield] = e;
        setFeedback(Object.assign({}, feedback, { [field]: newObj }));
    };

    const handleMaxTemp = (e) => {
        setMaxTemp(e);
    };

    const handleMinTemp = (e) => {
        setMinTemp(e);
    };

    const handleDailySummary = (e) => {
        setDailySumamry(e.target.value);
    };


    const handleFooterMax = (e) => {
        setMaxTempFooter(e.target.value);
    };

    const handleFooterMin = (e) => {
        setMinTempFooter(e.target.value);
    };

    const handleRainSummaryPic = (e) => {
        setRainSummaryPic(e);
    };


    const deleteFeedbackChange = (idx) => {
        const n = [...feedback];
        setFeedback(n.filter((item, i) => i !== idx));
    };
    const handleRainSummaryFooter = (e) => {
        setRainSummaryFooter(e.target.value);
    };
    const handlePrevBtn = () => {
        if (progress > 0) {
            setProgress(progress - 1);
            setActive(progress - 1);
        }
    };
    useEffect(() => {
        console.log('hazardwise loss data', hazardWiseLossData);
    }, [feedback]);
    const handleNextBtn = () => {
        if (progress < Menu.bulletinProgressMenu.length - 1) {
            if (progress === 0) {
                setBulletinLoss({
                    incidentSummary: incidentData,
                    peopleLoss: peopleLossData,
                    hazardWiseLoss: hazardWiseLossData,
                    genderWiseLoss: genderWiseLossData,
                    sitRep,
                    hilight,
                    bulletinDate: date,
                    feedback,
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
                console.log('feedback being saved', feedback);
                setBulletinFeedback({
                    feedback,
                });
            }
            if (progress === 3) {
                console.log('rainSummaryFooter', rainSummaryFooter);
                setBulletinTemperature({
                    tempMin: minTemp,
                    tempMax: maxTemp,
                    dailySummary,
                    rainSummaryPic,
                    maxTempFooter,
                    minTempFooter,
                    rainSummaryFooter,
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
    const handleBulletinDate = (bulletinDate) => {
        setDate(bulletinDate);
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
    const recordSelectedDate = (dat) => {
        setSelectedate(dat);
    };

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (lossData && lossData.length > 0) {
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

            const p1Data = lossData.filter(lD => lD.wards[0] && lD.wards[0].municipality.district.province === 1);
            const p2Data = lossData.filter(lD => lD.wards[0] && lD.wards[0].municipality.district.province === 2);
            const p3Data = lossData.filter(lD => lD.wards[0] && lD.wards[0].municipality.district.province === 3);
            const p4Data = lossData.filter(lD => lD.wards[0] && lD.wards[0].municipality.district.province === 4);
            const p5Data = lossData.filter(lD => lD.wards[0] && lD.wards[0].municipality.district.province === 5);
            const p6Data = lossData.filter(lD => lD.wards[0] && lD.wards[0].municipality.district.province === 6);
            const p7Data = lossData.filter(lD => lD.wards[0] && lD.wards[0].municipality.district.province === 7);
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
            if (language === 'np') {
                const hD = uniqueHazards.map((h) => {
                    newhazardData[hazardTypes[h].titleNe] = {
                        deaths: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).peopleDeathCount,
                        incidents: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).count,
                        missing: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).peopleMissingCount || 0,
                        injured: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).peopleInjuredCount || 0,
                        coordinates: [0, 0],

                    };
                    return null;
                });
            } else {
                const hD = uniqueHazards.map((h) => {
                    newhazardData[hazardTypes[h].title] = {
                        deaths: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).peopleDeathCount,
                        incidents: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).count,
                        missing: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).peopleMissingCount || 0,
                        injured: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).peopleInjuredCount || 0,
                        coordinates: [0, 0],

                    };
                    return null;
                });
            }


            // const hD = lossData.map((h) => {
            //     newhazardData[h.id] = {
            //         hazard: hazardTypes[h.hazard].titleNe,
            //         deaths: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).peopleDeathCount,
            //         incidents: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).count,
            //         missing: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).peopleMissingCount,
            //         injured: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).peopleInjuredCount,
            //         district: lossData.filter(l => l.hazard === h).peopleInjuredCount,
            //     };
            //     return null;
            // });

            setHazardwise(newhazardData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lossData, language]);


    useEffect(() => {
        if (covidNational.length > 0) {
            setcovid24hrsStat({
                affected: covidNational[0].newCases || 0,
                femaleAffected: covidNational[0].newCasesFemale || 0,
                maleAffected: covidNational[0].newCasesMale || 0,
                deaths: covidNational[0].newDeath || 0,
                recovered: covidNational[0].newRecovered || 0,
            });
            setcovidTotalStat({
                totalAffected: covidNational[0].totalInfected || 0,
                // totalActive: covidNational[0]
                totalRecovered: covidNational[0].totalRecovered || 0,
                totalDeaths: covidNational[0].totalDeath || 0,
            });
        }
    }, [covidNational]);


    useEffect(() => {
        if (covidQuaratine.length > 0) {
            const p1Data = covidQuaratine.filter(p => p.provinceName === 'Province 1')[0];
            const p2Data = covidQuaratine.filter(p => p.provinceName === 'Province 2')[0];
            const p3Data = covidQuaratine.filter(p => p.provinceName === 'Bagmati')[0];
            const p4Data = covidQuaratine.filter(p => p.provinceName === 'Gandaki')[0];
            const p5Data = covidQuaratine.filter(p => p.provinceName === 'Lumbini')[0];
            const p6Data = covidQuaratine.filter(p => p.provinceName === 'Karnali')[0];
            const p7Data = covidQuaratine.filter(p => p.provinceName === 'Sudurpashchim')[0];
            setcovidProvinceWiseTotal({
                p1: {
                    totalAffected: p1Data ? p1Data.totalPositive : 0,
                    totalActive: p1Data
                        ? (p1Data.totalPositive - p1Data.totalDeath - p1Data.totalRecovered)
                        : 0,
                    totalDeaths: p1Data ? p1Data.totalDeath : 0,
                },
                p2: {
                    totalAffected: p2Data ? p2Data.totalPositive : 0,
                    totalActive: p2Data
                        ? (p2Data.totalPositive - p2Data.totalDeath - p2Data.totalRecovered)
                        : 0,
                    totalDeaths: p2Data ? p2Data.totalDeath : 0,
                },
                bagmati: {
                    totalAffected: p3Data ? p3Data.totalPositive : 0,
                    totalActive: p3Data
                        ? (p3Data.totalPositive - p3Data.totalDeath - p3Data.totalRecovered)
                        : 0,
                    totalDeaths: p3Data ? p3Data.totalDeath : 0,
                },
                gandaki: {
                    totalAffected: p4Data ? p4Data.totalPositive : 0,
                    totalActive: p4Data
                        ? (p4Data.totalPositive - p4Data.totalDeath - p4Data.totalRecovered)
                        : 0,
                    totalDeaths: p4Data ? p4Data.totalDeath : 0,
                },
                lumbini: {
                    totalAffected: p5Data ? p5Data.totalPositive : 0,
                    totalActive: p5Data
                        ? (p5Data.totalPositive - p5Data.totalDeath - p5Data.totalRecovered)
                        : 0,
                    totalDeaths: p5Data ? p5Data.totalDeath : 0,
                },
                karnali: {
                    totalAffected: p6Data ? p6Data.totalPositive : 0,
                    totalActive: p6Data
                        ? (p6Data.totalPositive - p6Data.totalDeath - p6Data.totalRecovered)
                        : 0,
                    totalDeaths: p6Data ? p6Data.totalDeath : 0,
                },
                sudurpaschim: {
                    totalAffected: p7Data ? p7Data.totalPositive : 0,
                    totalActive: p7Data
                        ? (p7Data.totalPositive - p7Data.totalDeath - p7Data.totalRecovered)
                        : 0,
                    totalDeaths: p7Data ? p7Data.totalDeath : 0,
                },
            });
        }
    }, [covidQuaratine]);
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
            handlehazardAdd={handlehazardAdd}
            handleHilightChange={handleHilightChange}
            hilight={hilight}
            handleSameHazardAdd={handleSameHazardAdd}
            addedHazardFields={addedHazardFields}
            handleSameHazardChange={handleSameHazardChange}
            recordSelectedDate={recordSelectedDate}
            handleBulletinDate={handleBulletinDate}
            uri={uri}
            resetFeedback={resetFeedback}
            handlesitRepBlur={handlesitRepBlur}
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
        <Response
            handleFeedbackChange={handleFeedbackChange}
            feedback={feedback}
            deleteFeedbackChange={deleteFeedbackChange}
            hazardWiseLossData={hazardWiseLossData}
            handleSubFieldChange={handleSubFieldChange}
        />,
        <Temperatures
            minTemp={minTemp}
            maxTemp={maxTemp}
            handleMaxTemp={handleMaxTemp}
            handleMinTemp={handleMinTemp}
            handleDailySummary={handleDailySummary}
            dailySummary={dailySummary}
            rainSummaryPic={rainSummaryPic}
            handleRainSummaryPic={handleRainSummaryPic}
            maxTempFooter={maxTempFooter}
            minTempFooter={minTempFooter}
            handleFooterMax={handleFooterMax}
            handleFooterMin={handleFooterMin}
            handleRainSummaryFooter={handleRainSummaryFooter}
            rainSummaryFooter={rainSummaryFooter}
        />,
        <PDFPreview
            handlePrevBtn={handlePrevBtn}
            handleFeedbackChange={handleFeedbackChange}
            feedback={feedback}
            deleteFeedbackChange={deleteFeedbackChange}
            hazardWiseLossData={hazardWiseLossData}
            handleSubFieldChange={handleSubFieldChange}
            // bulletinData={
            //     {
            //         incidentSummary: incidentData,
            //         peopleLoss: peopleLossData,
            //         hazardWiseLoss: hazardWiseLossData,
            //         genderWiseLoss: genderWiseLossData,
            //         covidTwentyfourHrsStat: covid24hrsStatData,
            //         covidTotalStat: covidTotalStatData,
            //         vaccineStat: vaccineStatData,
            //         covidProvinceWiseTotal: covidProvinceWiseData,
            //         feedback,
            //         tempMax: maxTemp,
            //         tempMin: minTemp,
            //         dailySummary,
            //         sitrep: sitRep,
            //         rainSummaryFooter,
            //         bulletinDate: date,
            //     }
            // }
        />,
    ];


    return (

        <div className={_cs(styles.mainSection, language === 'np' ? styles.formContainerNepali : styles.formContainerEnglish)}>
            <div className={styles.leftMenuSection}>
                <ProgressMenu
                    menuKey="bulletinProgressMenu"
                    activeMenu={activeProgressMenu}
                    progress={progress}
                />
            </div>

            <div className={styles.rightFormSection}>
                {formSections[activeProgressMenu]}
                {
                    progress < 4
                    && (
                        <div className={styles.buttonsContainer}>
                            <button
                                type="button"
                                onClick={handlePrevBtn}
                                className={styles.prevBtn}
                            >
                                Previous
                            </button>

                            <button
                                type="button"
                                onClick={handleNextBtn}
                                className={progress !== 4 ? styles.nextBtn : styles.disabledBtn}
                            >
                                Next
                            </button>
                        </div>
                    )
                }
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
