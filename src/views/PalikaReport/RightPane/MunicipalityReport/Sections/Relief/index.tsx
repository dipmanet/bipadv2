/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import { BarChart,
    Bar, Cell,
    XAxis, YAxis,
    CartesianGrid, Tooltip,
    Legend, PieChart,
    Pie, Line,
    ComposedChart } from 'recharts';
import { encodeDate, _cs } from '@togglecorp/fujs';
import Loader from 'react-loader';
import { ADToBS, BSToAD } from 'bikram-sambat-js';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import styles from './styles.scss';
import programAndPolicyLogo from '#resources/palikaicons/program.svg';
import editIcon from '#resources/palikaicons/edit.svg';
import addRelief from '#resources/palikaicons/add.svg';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Gt from '../../../../utils';
import Translations from '../../../../Translations';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
import { provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    userSelector, drrmRegionSelector,
    hazardTypesSelector,
    drrmProgresSelector,
    generalDataSelector,
    palikaLanguageSelector } from '#selectors';
import NextPrevBtns from '../../NextPrevBtns';
import {
    setDrrmProgressAction,
} from '#actionCreators';
import IncidentIcon from '#resources/palikaicons/incident.svg';
import moneyBag from '#resources/palikaicons/loss.svg';
import DeathIcon from '#resources/palikaicons/death.svg';
import MissingIcon from '#resources/palikaicons/missing.svg';
import InjredIcon from '#resources/palikaicons/injured.svg';
import InfraIcon from '#resources/palikaicons/infrastructure.svg';
import LivestockIcon from '#resources/palikaicons/livestock.svg';
import HouseAffIcon from '#resources/palikaicons/house_partial.svg';
import HouseDmgIcon from '#resources/palikaicons/house_complete.svg';

import family from '#resources/palikaicons/family.svg';
import male from '#resources/palikaicons/male.svg';
import female from '#resources/palikaicons/female.svg';


interface Props{

}
const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    user: userSelector(state),
    hazardTypes: hazardTypesSelector(state),
    drrmRegion: drrmRegionSelector(state),
    drrmProgress: drrmProgresSelector(state),
    generalData: generalDataSelector(state),
    drrmLanguage: palikaLanguageSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setProgress: params => dispatch(setDrrmProgressAction(params)),
});

const COLORS = ['rgb(0,177,117)', 'rgb(198,233,232)'];
const genderWiseDeathData = [
    { name: 'DRR funding of municipality', value: 10 },
    { name: 'Other DRR related funding', value: 30 },
];


const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    PalikaReportInventoriesReport: {
        url: ({ params }) => `${params.url}`,
        query: ({ params, props }) => {
            if (params && params.municipality) {
                return {
                    province: params.province,
                    district: params.district,
                    municipality: params.municipality,
                    limit: params.Ward,
                    resource_type: params.inventories,
                    expand: params.fields,
                    incident_on__gt: params.date[0],
                    incident_on__lt: params.date[1],
                };
            }
            return { limit: params.Ward,
                resource_type: params.inventories,
                expand: params.fields };
        },
        method: methods.GET,
        onMount: false,

        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;

            if (params && params.organisation) {
                params.organisation(citizenReportList);
            }
        },
    },
    ReliefDataGet: {
        url: '/incident-relief/',
        query: ({ params, props }) => ({
            incident: params.incidentId,
            municipality: params.municipality,
            district: params.district,
            province: params.province,
            fiscalYear: params.fiscalYear,
        }),
        method: methods.GET,
        onMount: true,

        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;
            if (params && params.ReliefData) {
                params.ReliefData(citizenReportList);
            }
            if (params && params.filteredViewRelief) {
                params.filteredViewRelief(citizenReportList);
            }
        },
    },
    ReliefDataPost: {
        url: '/incident-relief/',
        method: methods.POST,
        body: ({ params }) => params && params.body,

        onSuccess: ({ response, props, params }) => {
            params.savedRelief(response);
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
            }
        },
        onFatal: ({ params }) => {
        },
    },
    ReliefDataPUT: {
        url: ({ params }) => `/incident-relief/${params.id}/`,
        method: methods.PUT,
        body: ({ params }) => params && params.body,

        onSuccess: ({ response, props, params }) => {
            params.updateAndClose(response);
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
            }
        },
        onFatal: ({ params }) => {
        },
    },
    HazardDataGet: {
        url: '/hazard/',
        query: ({ params, props }) => ({
            incident: params.incidentId,
        }),
        method: methods.GET,
        onMount: true,

        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;

            if (params && params.HazardData) {
                params.HazardData(citizenReportList);
            }
        },
    },
    NepaliFiscalYearGet: {
        url: '/nepali-fiscal-year/',
        method: methods.GET,
        onMount: true,

        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;

            if (params && params.setNepaliFiscalYear) {
                params.setNepaliFiscalYear(citizenReportList);
            }
        },
    },
};
let finalArr = [];
let province = 0;
let district = 0;
let municipality = 0;

const Relief = (props: Props) => {
    const [fetchedData, setFetechedData] = useState([]);
    const [url, setUrl] = useState('/incident/');
    const {
        requests: {
            PalikaReportInventoriesReport,
            HazardDataGet,
            ReliefDataPost,
            ReliefDataGet,
            ReliefDataPUT,
            NepaliFiscalYearGet,
        },
        user,
        hazardTypes,
        drrmRegion,
        setProgress,
        drrmProgress,
        generalData,
        drrmLanguage,
    } = props;


    const [defaultQueryParameter, setDefaultQueryParameter] = useState('governance');
    const [fields, setfields] = useState('loss');
    const [meta, setMeta] = useState(true);
    const [showRelief, setShowRelief] = useState(false);

    const [familiesBenefited, setfamiliesBenefited] = useState();
    const [namesofBeneficiaries, setnamesofBeneficiaries] = useState('');
    const [reliefDate, setreliefDate] = useState('');
    const [reliefDateAD, setReliefDateAD] = useState('');
    const [reliefAmount, setreliefAmount] = useState();
    const [currentRelief, setCurrentRelief] = useState({});

    const [incidentCount, setIncidentsCount] = useState(0);
    const [totalEstimatedLoss, setTotalEstimatedLoss] = useState(0);

    const [deathCount, setDeathCount] = useState(0);
    const [missing, setMissing] = useState(0);
    const [injured, setInjured] = useState(0);

    const [infraDestroyed, setInfraDestroyed] = useState(0);
    const [livestockDestroyed, setLivestockDestroyed] = useState(0);
    const [hazardwiseImpact, sethazardwiseImpact] = useState([]);

    const [deathGenderChartData, setdeathGenderChartData] = useState([]);

    const [maleDeath, setMaleDeath] = useState(0);
    const [femaleDeath, setFemaleDeath] = useState(0);
    const [reliefChartData, setReliefChartData] = useState([]);

    const [houseAffected, setHouseAffected] = useState(0);
    const [houseDamaged, setHouseDamaged] = useState(0);
    const [maleBenefited, setmaleBenefited] = useState();
    const [femaleBenefited, setfemaleBenefited] = useState();
    const [miorities, setmiorities] = useState();
    const [dalits, setdalits] = useState();
    const [madhesis, setmadhesis] = useState();
    const [disabilities, setdisabilities] = useState();
    const [janajatis, setjanajatis] = useState();
    const [reliefData, setReliefData] = useState();

    const [updateButton, setUpdateButton] = useState(false);
    const [postButton, setPostButton] = useState(false);
    const [reliefId, setReliefId] = useState();
    const [modalClose, setModalClose] = useState(true);
    const [disableInput, setDisableInput] = useState(false);
    const [loader, setLoader] = useState(true);
    const [hazardDetails, setHazardDetails] = useState([]);

    const [incidentTitle, setincidentTitle] = useState('-');
    const [incidentOn, setincidentOn] = useState('-');

    const [totreliefAmt, setTotReliefAmt] = useState(0);
    const [totBenFam, setTotBenFam] = useState(0);
    const [totFemale, setTotFemale] = useState(0);
    const [totMale, setTotMale] = useState(0);
    const [totJanajatis, setTotJanajatis] = useState(0);
    const [totMadhesis, setTotMadhesis] = useState(0);
    const [totMinotiries, setTotMinorities] = useState(0);
    const [totDalits, setTotDalits] = useState(0);
    const [postErrors, setPostErrors] = useState('');

    const [fiscalYearObj, setFiscalYearObj] = useState([]);
    // const [femaleBenefited, handlefemaleBenefited] = useState(0);


    const getdateTimeFromFs = (fs: string) => {
        const fsFiltered = fiscalYearObj.filter(i => String(i.titleEn) === String(fs));
        return [
            `${fsFiltered[0].startDateAd}T00:00:00+05:45`,
            `${fsFiltered[0].endDateAd}T23:59:59+05:45`,
        ];
    };


    if (drrmRegion.municipality) {
        municipality = drrmRegion.municipality;
        district = drrmRegion.district;
        province = drrmRegion.province;
    } else {
        municipality = user.profile.municipality;
        district = user.profile.district;
        province = user.profile.province;
    }

    const handleReliefData = (response) => {
        setReliefData(response);
    };


    const handleHazardData = (response) => {
        setHazardDetails(response);
    };
    ReliefDataGet.setDefaultParams({
        ReliefData: handleReliefData,
        municipality,
        district,
        province,
        fiscalYear: generalData.fiscalYear,
    });
    HazardDataGet.setDefaultParams({
        HazardData: handleHazardData,
    });

    const [wardWiseImpact, setWardWiseImpact] = useState([]);


    const getMonthFromDate = (date: string) => {
        const dateItem = new Date(date);
        return dateItem.toLocaleString('default', { month: 'long' });
    };
    const getNpValFromDate = (date: string) => {
        console.log('va ret: ', ADToBS(date), 'date:', date, 'val clalc:', Number(ADToBS(date).split('-')[1]));
        return Number(ADToBS(date).split('-')[1]);
    };

    useEffect(() => {
        if (reliefDate) {
            const bsToAd = BSToAD(reliefDate);
            setReliefDateAD(bsToAd);
        }
    }, [reliefDate]);

    useEffect(() => {
        if (reliefData) {
            const reliefDateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const reliefDateArrNep = ['बैशाख', 'जेष्ठा', 'असार', 'श्रवण', 'भद्रा', 'अश्विन', 'कार्तिक', 'मंगसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'];
            const reliefChart = reliefDateArr.map((d, mainindex) => ({
                name: drrmLanguage.language === 'en' ? d.substring(0, 3) : reliefDateArrNep[mainindex],
                'Amount-Distributed': reliefData
                    .filter(item => getMonthFromDate(item.dateOfReliefDistribution) === d).length > 0
                    ? reliefData
                        .filter(item => getMonthFromDate(item.dateOfReliefDistribution) === d)
                        .reduce((a, b) => ({ reliefAmountNpr: a.reliefAmountNpr + b.reliefAmountNpr }))
                        .reliefAmountNpr
                    : 0,
                'रकम वितरित': reliefData
                    .filter((nep, i) => getNpValFromDate(nep.dateOfReliefDistribution) === mainindex + 1).length > 0
                    ? reliefData
                        .filter(item => getNpValFromDate(item.dateOfReliefDistribution) === mainindex + 1)
                        .reduce((a, b) => ({ reliefAmountNpr: a.reliefAmountNpr + b.reliefAmountNpr }))
                        .reliefAmountNpr
                    : 0,

                Beneficiaries: reliefData
                    .filter(item => getMonthFromDate(item.dateOfReliefDistribution) === d).length > 0
                    ? reliefData
                        .filter(item => getMonthFromDate(item.dateOfReliefDistribution) === d)
                        .reduce((a, b) => ({ numberOfBeneficiaryFamily: a.numberOfBeneficiaryFamily + b.numberOfBeneficiaryFamily }))
                        .numberOfBeneficiaryFamily
                    : 0,
                लाभार्थीहरू: reliefData
                    .filter((nep, i) => getNpValFromDate(nep.dateOfReliefDistribution) === mainindex + 1).length > 0
                    ? reliefData
                        .filter(item => getNpValFromDate(item.dateOfReliefDistribution) === mainindex + 1)
                        .reduce((a, b) => ({ numberOfBeneficiaryFamily: a.numberOfBeneficiaryFamily + b.numberOfBeneficiaryFamily }))
                        .numberOfBeneficiaryFamily
                    : 0,
            }));
            console.log('relief chart data:', reliefChart);
            setReliefChartData(reliefChart);
        }
    }, [drrmLanguage.language, reliefData]);
    const handlemaleBenefited = (data) => {
        setmaleBenefited(data.target.value);
    };
    const handlefemaleBenefited = (data) => {
        setfemaleBenefited(data.target.value);
    };

    const handleMinorities = (data) => {
        setmiorities(data.target.value);
    };
    const handleDalit = (data) => {
        setdalits(data.target.value);
    };
    const handleMadhesis = (data) => {
        setmadhesis(data.target.value);
    };
    const handleDisabilities = (data) => {
        setdisabilities(data.target.value);
    };
    const handleJanajaties = (data) => {
        setjanajatis(data.target.value);
    };

    const handleFamiliesBenefited = (data) => {
        setfamiliesBenefited(data.target.value);
    };
    const handleNameofBeneficiaries = (data) => {
        setnamesofBeneficiaries(data.target.value);
    };
    const handleReliefAmount = (data) => {
        setreliefAmount(data.target.value);
    };


    const handleFetchedData = (response) => {
        setFetechedData(response);
        setLoader(false);
    };

    const handleReliefAdd = (data) => {
        setShowRelief(true);
        setCurrentRelief(data);
        setPostButton(true);
        setUpdateButton(false);
        setModalClose(false);
    };
    const handleFilteredViewRelief = (response) => {
        console.log('response', response);
        setfamiliesBenefited(response[0].numberOfBeneficiaryFamily ? response[0].numberOfBeneficiaryFamily : '-');
        setnamesofBeneficiaries(response[0].nameOfBeneficiary ? response[0].nameOfBeneficiary : '-');
        setreliefDate(response[0].dateOfReliefDistribution ? ADToBS(response[0].dateOfReliefDistribution) : '-');
        setreliefAmount(response[0].reliefAmountNpr ? response[0].reliefAmountNpr : '-');
        setmaleBenefited(response[0].totalMaleBenefited ? response[0].totalMaleBenefited : '-');
        setfemaleBenefited(response[0].totalFemaleBenefited ? response[0].totalFemaleBenefited : '-');
        setmiorities(response[0].totalMinoritiesBenefited ? response[0].totalMinoritiesBenefited : '-');
        setdalits(response[0].totalDalitBenefited ? response[0].totalDalitBenefited : '-');
        setmadhesis(response[0].totalMadhesiBenefited ? response[0].totalMadhesiBenefited : '-');
        setdisabilities(response[0].totalDisabledBenefited ? response[0].totalDisabledBenefited : '-');
        setjanajatis(response[0].totalJanjatiBenefited ? response[0].totalJanjatiBenefited : '-');

        setShowRelief(true);
    };
    const handleCloseModal = () => {
        setModalClose(true);
        setShowRelief(false);
        setDisableInput(false);
        setfamiliesBenefited(null);
        setnamesofBeneficiaries('');
        setreliefDate('');
        setreliefAmount(null);
        setmaleBenefited(null);
        setfemaleBenefited(null);
        setmiorities(null);
        setdalits(null);
        setmadhesis(null);
        setdisabilities(null);
        setjanajatis(null);
        PalikaReportInventoriesReport.do({
            organisation: handleFetchedData,
            url,
            inventories: defaultQueryParameter,
            fields,
            province,
            district,
            municipality,
            meta,
            date: getdateTimeFromFs(generalData.fiscalYearTitle),

        });
        ReliefDataGet.do({
            ReliefData: handleReliefData,
            municipality,
            district,
            province,
            fiscalYear: generalData.fiscalYear,

        });
    };
    const handleReliefView = (data) => {
        setShowRelief(true);
        setDisableInput(true);
        setCurrentRelief(data);
        setPostButton(false);
        setUpdateButton(false);
        setModalClose(false);
        ReliefDataGet.do({
            incidentId: data.id,
            filteredViewRelief: handleFilteredViewRelief,
            municipality,
            district,
            province,
            fiscalYear: generalData.fiscalYear,

        });
    };


    useEffect(() => {
        if (fiscalYearObj && fiscalYearObj.length > 0) {
            PalikaReportInventoriesReport.setDefaultParams({
                organisation: handleFetchedData,
                url,
                inventories: defaultQueryParameter,
                fields,
                municipality,
                district,
                province,
                meta,
                date: getdateTimeFromFs(generalData.fiscalYearTitle),
            });
            PalikaReportInventoriesReport.do({
                organisation: handleFetchedData,
                url,
                inventories: defaultQueryParameter,
                fields,
                municipality,
                district,
                province,
                meta,
                date: getdateTimeFromFs(generalData.fiscalYearTitle),
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fiscalYearObj]);


    const handleReliefEdit = (data, item) => {
        console.log('This data', data);
        setLoader(false);
        setReliefId(data.id);
        setModalClose(false);
        setPostButton(false);
        setUpdateButton(true);
        setCurrentRelief(item);
        setfamiliesBenefited(data.numberOfBeneficiaryFamily);
        setnamesofBeneficiaries(data.nameOfBeneficiary);
        setreliefDate(ADToBS(data.dateOfReliefDistribution));
        setreliefAmount(data.reliefAmountNpr);
        setmaleBenefited(data.totalMaleBenefited);
        setfemaleBenefited(data.totalFemaleBenefited);
        setmiorities(data.totalMinoritiesBenefited);
        setdalits(data.totalDalitBenefited);
        setmadhesis(data.totalMadhesiBenefited);
        setdisabilities(data.totalDisabledBenefited);
        setjanajatis(data.totalJanjatiBenefited);

        setShowRelief(true);
    };


    useEffect(() => {
        if (fetchedData.length > 0) {
            setIncidentsCount(fetchedData.length);

            const estimatedLoss = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.estimatedLoss)
                .filter(item => item !== undefined);
            if (estimatedLoss.length > 0) {
                estimatedLoss.reduce((a, b) => Number(a) + Number(b));
                setTotalEstimatedLoss(estimatedLoss);
            }

            const deathTotal = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.peopleDeathCount)
                .filter(item => item !== undefined);
            if (deathTotal.length > 0) {
                deathTotal.reduce((a, b) => Number(a) + Number(b));
                setDeathCount(deathTotal);
            }


            const missingTotal = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.peopleMissingCount)
                .filter(item => item !== undefined);
            if (missingTotal.length > 0) {
                missingTotal.reduce((a, b) => Number(a) + Number(b));
                setMissing(missingTotal);
            }


            const injuredTotal = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.peopleInjuredCount)
                .filter(item => item !== undefined);
            if (injuredTotal.length > 0) {
                injuredTotal.reduce((a, b) => Number(a) + Number(b));
                setInjured(injuredTotal);
            }


            const infra = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.infrastructureDestroyedCount)
                .filter(item => item !== undefined);
            if (infra.length > 0) {
                infra.reduce((a, b) => Number(a) + Number(b));
                setInfraDestroyed(infra);
            }


            const livestock = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.livestockDestroyedCount)
                .filter(item => item !== undefined);
            if (livestock.length > 0) {
                livestock.reduce((a, b) => Number(a) + Number(b));
                setLivestockDestroyed(livestock);
            }


            const hazards = [...new Set(fetchedData.map(item => item.hazard))]
                .filter(hazar => hazar !== undefined);
            const hazardwiseImpactData = hazards.map((item) => {
                const name = hazardTypes[item].title;
                const Incidents = fetchedData.filter(inc => inc.hazard === item).length;
                const PeopleDeath = fetchedData.filter(inc => inc.hazard === item)
                    .map(losses => losses.loss)
                    .filter(a => a !== undefined)
                    .map(lose => lose.peopleDeathCount)
                    .filter(count => count !== undefined);
                if (PeopleDeath.length > 0) {
                    PeopleDeath.reduce((a, b) => Number(a) + Number(b));
                }
                return {
                    name, Incidents, PeopleDeath,
                };
            });

            const deathMaleData = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.peopleDeathMaleCount)
                .filter(item => item !== undefined);
            if (deathMaleData.length > 0) {
                deathMaleData.reduce((a, b) => Number(a) + Number(b));

                setMaleDeath(deathMaleData);
            }


            const deathFemaleData = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.peopleDeathFemaleCount)
                .filter(item => item !== undefined);
            if (deathFemaleData.length > 0) {
                deathFemaleData.reduce((a, b) => Number(a) + Number(b));
                setFemaleDeath(deathFemaleData);
            }


            const houseAffectedData = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.infrastructureAffectedHouseCount)
                .filter(item => item !== undefined);
            if (houseAffectedData.length > 0) {
                houseAffectedData.reduce((a, b) => Number(a) + Number(b));
                setHouseAffected(houseAffectedData);
            }


            const houseDamagedData = fetchedData.map(item => item.loss)
                .filter(item => item !== undefined)
                .map(item => item.infrastructureDestroyedHouseCount)
                .filter(item => item !== undefined);
            if (houseDamagedData.length > 0) {
                houseDamagedData.reduce((a, b) => Number(a) + Number(b));
                setHouseDamaged(houseDamagedData);
            }


            setdeathGenderChartData(
                [
                    { name: 'Male', value: deathMaleData },
                    { name: 'Female', value: deathFemaleData },
                ],
            );
            sethazardwiseImpact(hazardwiseImpactData);


            const wards = [...new Set(fetchedData.map(item => item.wards[0]))]
                .filter(ward => ward !== undefined);

            const wardWiseImpactData = wards.map(wardItem => fetchedData.filter(e => e.wards[0] !== undefined && e.wards[0] === wardItem)
                .map(item => item.loss)
                .filter(iitems => iitems !== undefined)
                .reduce((a, b) => ({
                    ward: wardItem,
                    Death: (Number(a.peopledeathCount) || 0) + (Number(b.peopledeathCount) || 0),
                    Injured: (Number(a.peopleInjuredCount) || 0) + (Number(b.peopledeathCount) || 0),
                    Missing: (Number(a.peopleMissingCount) || 0) + (Number(b.peopledeathCount) || 0),
                })));


            setWardWiseImpact([]);
        }
    }, [fetchedData, hazardTypes]);


    useEffect(() => {
        if (reliefData) {
            let totData = {
                numberOfBeneficiaryFamily: 0,
                nameOfBeneficiary: 0,
                dateOfReliefDistribution: 0,
                reliefAmountNpr: 0,
                totalMaleBenefited: 0,
                totalFemaleBenefited: 0,
                totalMinoritiesBenefited: 0,
                totalDalitBenefited: 0,
                totalMadhesiBenefited: 0,
                totalDisabledBenefited: 0,
                totalJanjatiBenefited: 0,
            };
            if (reliefData.length > 0) {
                totData = reliefData.reduce((a, b) => ({
                    numberOfBeneficiaryFamily: a.numberOfBeneficiaryFamily + b.numberOfBeneficiaryFamily,
                    nameOfBeneficiary: a.nameOfBeneficiary + b.nameOfBeneficiary,
                    dateOfReliefDistribution: a.dateOfReliefDistribution + b.dateOfReliefDistribution,
                    reliefAmountNpr: a.reliefAmountNpr + b.reliefAmountNpr,
                    totalMaleBenefited: a.totalMaleBenefited + b.totalMaleBenefited,
                    totalFemaleBenefited: a.totalFemaleBenefited + b.totalFemaleBenefited,
                    totalMinoritiesBenefited: a.totalMinoritiesBenefited + b.totalMinoritiesBenefited,
                    totalDalitBenefited: a.totalDalitBenefited + b.totalDalitBenefited,
                    totalMadhesiBenefited: a.totalMadhesiBenefited + b.totalMadhesiBenefited,
                    totalDisabledBenefited: a.totalDisabledBenefited + b.totalDisabledBenefited,
                    totalJanjatiBenefited: a.totalJanjatiBenefited + b.totalJanjatiBenefited,
                }));
            }

            setTotReliefAmt(totData.reliefAmountNpr);
            setTotBenFam(totData.numberOfBeneficiaryFamily);
            setTotMale(totData.totalMaleBenefited);
            setTotFemale(totData.totalFemaleBenefited);
            setTotJanajatis(totData.totalJanjatiBenefited);
            setTotMadhesis(totData.totalMadhesiBenefited);
            setTotMinorities(totData.totalMinoritiesBenefited);
            setTotDalits(totData.totalDalitBenefited);
        }
    }, [reliefData]);


    const setNepaliFiscalYear = (fiscalYearObject) => {
        setFiscalYearObj(fiscalYearObject);
    };

    NepaliFiscalYearGet.setDefaultParams({
        setNepaliFiscalYear,
    });


    const handleBackButton = () => {
        setShowRelief(false);
        setModalClose(true);
        setDisableInput(false);
        setfamiliesBenefited(null);
        setnamesofBeneficiaries('');
        setreliefDate('');
        setreliefAmount(null);
        setmaleBenefited(null);
        setfemaleBenefited(null);
        setmiorities(null);
        setdalits(null);
        setmadhesis(null);
        setdisabilities(null);
        setjanajatis(null);
        PalikaReportInventoriesReport.do({
            organisation: handleFetchedData,
            url,
            inventories: defaultQueryParameter,
            fields,
            municipality,
            district,
            province,
            meta,
            date: getdateTimeFromFs(generalData.fiscalYearTitle),
        });
        ReliefDataGet.do({
            ReliefData: handleReliefData,
            municipality,
            district,
            province,
            fiscalYear: generalData.fiscalYear,
        });
    };
    const handleSavedReliefData = (response) => {
        setShowRelief(false);
        setModalClose(true);
        setfamiliesBenefited(null);
        setnamesofBeneficiaries('');
        setreliefDate('');
        setreliefAmount(null);
        setmaleBenefited(null);
        setfemaleBenefited(null);
        setmiorities(null);
        setdalits(null);
        setmadhesis(null);
        setdisabilities(null);
        setjanajatis(null);
        PalikaReportInventoriesReport.do({
            organisation: handleFetchedData,
            url,
            inventories: defaultQueryParameter,
            fields,
            municipality,
            district,
            province,
            meta,
            date: getdateTimeFromFs(generalData.fiscalYearTitle),


        });
        ReliefDataGet.do({
            ReliefData: handleReliefData,
            municipality,
            district,
            province,
            fiscalYear: generalData.fiscalYear,
        });
    };

    useEffect(() => {
        if (Array.isArray(incidentCount) && incidentCount.length > 0) {
            setIncidentsCount(incidentCount.reduce((a, b) => a + b));
        }
        if (Array.isArray(totalEstimatedLoss) && totalEstimatedLoss.length > 0) {
            setTotalEstimatedLoss(totalEstimatedLoss.reduce((a, b) => a + b));
        }
        if (Array.isArray(deathCount) && deathCount.length > 0) {
            setDeathCount(deathCount.reduce((a, b) => a + b));
        }
        if (Array.isArray(missing) && missing.length > 0) {
            setMissing(missing.reduce((a, b) => a + b));
        }
        if (Array.isArray(injured) && injured.length > 0) {
            setInjured(injured.reduce((a, b) => a + b));
        }
        if (Array.isArray(infraDestroyed) && infraDestroyed.length > 0) {
            setInfraDestroyed(infraDestroyed.reduce((a, b) => a + b));
        }
        if (Array.isArray(livestockDestroyed) && livestockDestroyed.length > 0) {
            setLivestockDestroyed(livestockDestroyed.reduce((a, b) => a + b));
        }
        if (Array.isArray(livestockDestroyed) && livestockDestroyed.length > 0) {
            setLivestockDestroyed(livestockDestroyed.reduce((a, b) => a + b));
        }
        if (Array.isArray(houseAffected) && houseAffected.length > 0) {
            setHouseAffected(houseAffected.reduce((a, b) => a + b));
        }
        if (Array.isArray(houseDamaged) && houseDamaged.length > 0) {
            setHouseDamaged(houseDamaged.reduce((a, b) => a + b));
        }
    }, [incidentCount,
        totalEstimatedLoss,
        deathCount,
        missing,
        injured,
        infraDestroyed,
        livestockDestroyed,
        houseAffected,
        houseDamaged]);
    const handleSaveRelief = () => {
        setLoader(true);
        if (reliefAmount) {
            setPostErrors('');
            ReliefDataPost.do({
                body: {
                    numberOfBeneficiaryFamily: Number(familiesBenefited),
                    nameOfBeneficiary: namesofBeneficiaries,
                    dateOfReliefDistribution: reliefDateAD,
                    reliefAmountNpr: Number(reliefAmount),
                    totalMaleBenefited: Number(maleBenefited),
                    totalFemaleBenefited: Number(femaleBenefited),
                    totalMinoritiesBenefited: Number(miorities),
                    totalDalitBenefited: Number(dalits),
                    totalMadhesiBenefited: Number(madhesis),
                    totalDisabledBenefited: Number(disabilities),
                    totalJanjatiBenefited: Number(janajatis),
                    incident: currentRelief.id,
                    municipality,
                    district,
                    province,
                    fiscalYear: generalData.fiscalYear,


                },
                savedRelief: handleSavedReliefData,


            });
        } else {
            setPostErrors('Please Enter Relief Amount');
        }
    };

    // const handleUpdateAndClose = (response) => {
    useEffect(() => {
        if (reliefData && reliefData.length > 0) {
            const totData = reliefData.reduce((a, b) => ({
                numberOfBeneficiaryFamily: a.numberOfBeneficiaryFamily + b.numberOfBeneficiaryFamily,
                nameOfBeneficiary: a.nameOfBeneficiary + b.nameOfBeneficiary,
                dateOfReliefDistribution: a.dateOfReliefDistribution + b.dateOfReliefDistribution,
                reliefAmountNpr: a.reliefAmountNpr + b.reliefAmountNpr,
                totalMaleBenefited: a.totalMaleBenefited + b.totalMaleBenefited,
                totalFemaleBenefited: a.totalFemaleBenefited + b.totalFemaleBenefited,
                totalMinoritiesBenefited: a.totalMinoritiesBenefited + b.totalMinoritiesBenefited,
                totalDalitBenefited: a.totalDalitBenefited + b.totalDalitBenefited,
                totalMadhesiBenefited: a.totalMadhesiBenefited + b.totalMadhesiBenefited,
                totalDisabledBenefited: a.totalDisabledBenefited + b.totalDisabledBenefited,
                totalJanjatiBenefited: a.totalJanjatiBenefited + b.totalJanjatiBenefited,
            }));

            setTotReliefAmt(totData.reliefAmountNpr);
            setTotBenFam(totData.numberOfBeneficiaryFamily);
            setTotMale(totData.totalMaleBenefited);
            setTotFemale(totData.totalFemaleBenefited);
            setTotJanajatis(totData.totalJanjatiBenefited);
            setTotMadhesis(totData.totalMadhesiBenefited);
            setTotMinorities(totData.totalMinoritiesBenefited);
            setTotDalits(totData.totalDalitBenefited);
        }
    }, [reliefData]);

    const getIncidentTitle = (item) => {
        if (fetchedData.length > 0 && item.incident) {
            console.log('item', item);
            console.log('fetchedData.length ', fetchedData);
            let title = '-';
            const incident = '-';
            title = fetchedData.filter(incidentObj => incidentObj.id === item.incident)[0];

            // if (fetchedData.filter(incidentObj => incidentObj.id === item.incident)[0].title !== undefined) {
            //     title = fetchedData.filter(incidentObj => incidentObj.id === item.incident)[0].title;
            // }
            // if (fetchedData.filter(incidentObj => incidentObj.id === item.incident)[0].incidentOn) {
            //     incident = fetchedData.filter(incidentObj => incidentObj.id === item.incident)[0].incidentOn;
            // }

            return [
                title,
                incident,
            ];
        }
        return ['-', '-'];
    };
    const handleUpdateAndClose = (response) => {
        setShowRelief(false);
        setModalClose(true);
        setfamiliesBenefited(null);
        setnamesofBeneficiaries('');
        setreliefDate('');
        setreliefAmount(null);
        setmaleBenefited(null);
        setfemaleBenefited(null);
        setmiorities(null);
        setdalits(null);
        setmadhesis(null);
        setdisabilities(null);
        setjanajatis(null);
        PalikaReportInventoriesReport.do({
            organisation: handleFetchedData,
            url,
            inventories: defaultQueryParameter,
            fields,
            municipality,
            district,
            province,
            meta,
            date: getdateTimeFromFs(generalData.fiscalYearTitle),


        });
        ReliefDataGet.do({
            ReliefData: handleReliefData,
            municipality,
            district,
            province,
            fiscalYear: generalData.fiscalYear,

        });
    };
    const handleUpdateRelief = () => {
        setLoader(true);
        if (reliefAmount) {
            setPostErrors('');
            ReliefDataPUT.do({
                body: {
                    numberOfBeneficiaryFamily: Number(familiesBenefited),
                    nameOfBeneficiary: namesofBeneficiaries,
                    dateOfReliefDistribution: reliefDateAD,
                    reliefAmountNpr: Number(reliefAmount),
                    totalMaleBenefited: Number(maleBenefited),
                    totalFemaleBenefited: Number(femaleBenefited),
                    totalMinoritiesBenefited: Number(miorities),
                    totalDalitBenefited: Number(dalits),
                    totalMadhesiBenefited: Number(madhesis),
                    totalDisabledBenefited: Number(disabilities),
                    totalJanjatiBenefited: Number(janajatis),
                    incident: currentRelief.id,

                },
                id: reliefId,
                updateAndClose: handleUpdateAndClose,
            });
        } else {
            setPostErrors('Please Enter Relief Amount');
        }
    };

    useEffect(() => {
        if (fetchedData && hazardTypes) {
            const tempArr = [];
            const finalfetchedData = fetchedData.map((item, i) => {
                const hazardName = hazardDetails.find(data => data.id === item.hazard);

                if (hazardName) {
                    tempArr.push({ hazardName: hazardName.titleEn,
                        hazardNameNp: hazardName.titleNe,
                        item });

                    return { hazardName: hazardName.titleEn,
                        hazardNameNp: hazardName.titleNe,
                        item };
                }

                return tempArr;
            });

            finalArr = [...new Set(tempArr)];
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchedData, hazardTypes]);

    const handleNext = () => {
        if (drrmProgress < 8) {
            setProgress(8);
        }
        props.handleNextClick();
    };

    return (
        <div className={drrmLanguage.language === 'np' && styles.nep}>

            {!props.previewDetails && !props.hazardwiseImpact
         && (
             <div className={styles.tabsWardContainer}>
                 {!showRelief
                && (
                    <>
                        {' '}
                        {
                            !props.annex

                                ? (
                                    <h2>
                                        <Gt section={Translations.IncidentReliefHeading} />
                                    </h2>
                                )
                                : (
                                    <h2>
                                        <Gt section={Translations.IncidentHeading} />
                                    </h2>
                                )
                        }
                        <div className={styles.palikaTable}>
                            <table id="table-to-xls">
                                <tbody>
                                    <tr>
                                        <th>
                                            <Gt section={Translations.IncidentSerialNumber} />
                                        </th>
                                        <th>
                                            <Gt section={Translations.IncidentTitle} />
                                        </th>
                                        <th>
                                            <Gt section={Translations.IncidentHazard} />
                                        </th>
                                        <th>
                                            <Gt section={Translations.IncidentOn} />
                                        </th>
                                        <th>
                                            <Gt section={Translations.IncidentReportedOn} />
                                        </th>
                                        <th>
                                            <Gt section={Translations.IncidentTotalDeath} />
                                        </th>
                                        <th>
                                            <Gt section={Translations.IncidentTotalInjured} />
                                        </th>
                                        <th>
                                            <Gt section={Translations.IncidentTotalMissing} />
                                        </th>
                                        <th>
                                            <Gt section={Translations.IncidentFamilyAffected} />
                                        </th>
                                        <th>
                                            <Gt section={Translations.IncidentInfrastructureAffected} />
                                        </th>
                                        <th>
                                            <Gt section={Translations.IncidentInfrastructureDestroyed} />
                                        </th>
                                        <th>
                                            <Gt section={Translations.IncidentLiveStockLoss} />
                                        </th>
                                        { !props.annex
                                        && (
                                            <th>
                                                <Gt section={Translations.IncidentAction} />
                                            </th>
                                        )
                                        }
                                    </tr>
                                    {loader ? (
                                        <>
                                            {' '}
                                            <Loader
                                                top="50%"
                                                left="60%"
                                            />
                                            <p className={styles.loaderInfo}>Loading...Please Wait</p>
                                        </>
                                    ) : (
                                        <>
                                            {finalArr && finalArr.map((item, i) => (

                                                <tr key={item.item.id}>
                                                    <td>{i + 1}</td>
                                                    <td>{item.item.title || '-'}</td>
                                                    <td>{drrmLanguage.language === 'np' ? item.hazardNameNp : item.hazardName || '-'}</td>
                                                    <td>{ADToBS(item.item.incidentOn.split('T')[0]) || '-'}</td>
                                                    <td>{ADToBS(item.item.reportedOn.split('T')[0]) || '-'}</td>
                                                    <td>{item.item.loss ? item.item.loss.peopleDeathCount : 0}</td>
                                                    <td>{item.item.loss ? item.item.loss.peopleInjuredCount : 0}</td>
                                                    <td>{item.item.loss ? item.item.loss.peopleMissingCount : 0}</td>
                                                    <td>{item.item.loss ? item.item.loss.familyAffectedCount : 0}</td>
                                                    <td>
                                                        {Number(item.item.loss
                                                            ? item.item.loss.infrastructureAffectedBridgeCount : 0)
                                        + Number(item.item.loss
                                            ? item.item.loss.infrastructureAffectedElectricityCount : 0)
                                        + Number(item.item.loss ? item.item.loss.infrastructureAffectedHouseCount : 0)
                                        + Number(item.item.loss ? item.item.loss.infrastructureAffectedRoadCount : 0)}
                                                    </td>
                                                    <td>{item.item.loss ? item.item.loss.infrastructureDestroyedCount : 0}</td>
                                                    <td>{item.item.loss ? item.item.loss.livestockDestroyedCount : 0}</td>


                                                    {!props.annex && reliefData
                                           && reliefData.find(data => data.incident === item.item.id)
                                                        ? reliefData.filter(data => data.incident === item.item.id).map(data => (
                                                            <td>
                                                                <div className={styles.buttonDiv}>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleReliefView(item.item)}
                                                                        className={styles.reliefBtn}

                                                                        title={drrmLanguage.language === 'np' ? 'राहत हेर्नुहोस्' : 'View Relief'}
                                                                    >
                                                                        <ScalableVectorGraphics
                                                                            className={styles.bulletPoint}
                                                                            src={programAndPolicyLogo}
                                                                            alt="editPoint"
                                                                        />
                                                                    </button>

                                                                    <button
                                                                        // className={styles.editButtn}
                                                                        type="button"
                                                                        onClick={() => handleReliefEdit(data, item.item)}
                                                                        className={styles.reliefBtn}

                                                                        title={drrmLanguage.language === 'np' ? 'राहत सम्पादन गर्नुहोस्' : 'Edit Relief'}
                                                                    >
                                                                        <ScalableVectorGraphics
                                                                            className={styles.bulletPoint}
                                                                            src={editIcon}
                                                                            alt="editPoint"
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        ))


                                                        : (
                                                            <td>
                                                                { !props.annex
                                                       && (

                                                           <button
                                                               type="button"
                                                               onClick={() => handleReliefAdd(item.item)}
                                                               className={styles.addReliefBttn}
                                                               title={drrmLanguage.language === 'np' ? Translations.IncidentAddReliefTooltip.np : Translations.IncidentAddReliefTooltip.en}
                                                           >
                                                               <Gt section={Translations.IncidentAddReliefTooltip} />

                                                           </button>

                                                       )}
                                                            </td>
                                                        )

                                                    }


                                                </tr>


                                            ))}
                                        </>
                                    )}
                                </tbody>


                            </table>
                            {
                                props.annex
                                && (
                                    <>
                                        <h2>
                                            <Gt section={Translations.Relief} />
                                        </h2>
                                        <table
                                            style={{ tableLayout: 'fixed' }}
                                            id="table-to-xls"
                                        >
                                            <tbody>
                                                <tr>
                                                    <th>
                                                        <Gt section={Translations.dashboardTblHeaderSN} />
                                                    </th>
                                                    <th>
                                                        <Gt section={Translations.ReliefBeneficiary} />
                                                    </th>
                                                    <th>
                                                        <Gt section={Translations.ReliefDistributionDate} />
                                                    </th>
                                                    <th>
                                                        <Gt section={Translations.ReliefAmount} />
                                                    </th>
                                                    <th>
                                                        <Gt section={Translations.ReliefBenefitedPeopleMale} />
                                                    </th>
                                                    <th>
                                                        <Gt section={Translations.ReliefBenefitedPeopleFemale} />
                                                    </th>
                                                    <th>
                                                        <Gt section={Translations.ReliefBenefitedPeopleDalit} />
                                                    </th>
                                                    <th>
                                                        <Gt section={Translations.ReliefBenefitedPeopleMinorities} />
                                                    </th>
                                                    <th>
                                                        <Gt section={Translations.ReliefBenefitedPeopleMadhesi} />

                                                    </th>
                                                    <th>
                                                        <Gt section={Translations.ReliefBenefitedPeopleDisable} />
                                                    </th>
                                                    <th>
                                                        <Gt section={Translations.ReliefBenefitedPeopleJanajati} />
                                                    </th>
                                                    <th>
                                                        <Gt section={Translations.Incident} />
                                                    </th>
                                                    <th>
                                                        <Gt section={Translations.IncidentOn} />
                                                    </th>

                                                </tr>

                                                {reliefData && reliefData.map((item, i) => (

                                                    <tr key={item.id}>
                                                        <td>{i + 1}</td>
                                                        <td>{item.numberOfBeneficiaryFamily}</td>
                                                        <td>{ADToBS(item.dateOfReliefDistribution)}</td>
                                                        <td>{item.reliefAmountNpr}</td>
                                                        <td>{item.totalMaleBenefited}</td>
                                                        <td>{item.totalFemaleBenefited}</td>
                                                        <td>{item.totalDalitBenefited}</td>
                                                        <td>{item.totalMinoritiesBenefited}</td>
                                                        <td>{item.totalMadhesiBenefited}</td>
                                                        <td>{item.totalDisabledBenefited}</td>
                                                        <td>{item.totalJanjatiBenefited}</td>
                                                        <td>
                                                            {getIncidentTitle(item)[0]}
                                                        </td>
                                                        <td>
                                                            {getIncidentTitle(item)[1]}

                                                        </td>
                                                    </tr>


                                                ))}
                                            </tbody>


                                        </table>

                                    </>
                                )

                            }
                        </div>
                        {!loader && (
                            <>
                                {
                                    !props.annex
                            && (
                                <NextPrevBtns
                                    handlePrevClick={props.handlePrevClick}
                                    handleNextClick={handleNext}
                                />
                            )
                                }
                            </>
                        )}
                    </>
                )
                 }

                 {showRelief
                      && (
                          <>
                              {' '}
                              <h3>Incident Selected</h3>
                              <div className={styles.incidentDetails}>
                                  <table id="table-to-xls">
                                      <tbody>
                                          <tr>
                                              <th>
                                                  <Gt section={Translations.IncidentTitle} />
                                              </th>
                                              <th>
                                                  <Gt section={Translations.IncidentHazard} />
                                              </th>
                                              <th>
                                                  <Gt section={Translations.IncidentOn} />
                                              </th>
                                              <th>
                                                  <Gt section={Translations.IncidentReportedOn} />
                                              </th>
                                              <th>
                                                  <Gt section={Translations.IncidentTotalDeath} />
                                              </th>
                                              <th>
                                                  <Gt section={Translations.IncidentTotalInjured} />
                                              </th>
                                              <th>
                                                  <Gt section={Translations.IncidentTotalMissing} />
                                              </th>
                                              <th>
                                                  <Gt section={Translations.IncidentFamilyAffected} />
                                              </th>
                                              <th>
                                                  <Gt section={Translations.IncidentInfrastructureAffected} />
                                              </th>
                                              <th>
                                                  <Gt section={Translations.IncidentInfrastructureDestroyed} />
                                              </th>
                                              <th>
                                                  <Gt section={Translations.IncidentLiveStockLoss} />
                                              </th>
                                          </tr>

                                          <tr key={currentRelief.id}>
                                              <td>{currentRelief.title}</td>
                                              <td>{currentRelief.hazard}</td>
                                              <td>{ADToBS(currentRelief.incidentOn.split('T')[0])}</td>
                                              <td>{ADToBS(currentRelief.reportedOn.split('T')[0])}</td>
                                              <td>{currentRelief.loss ? currentRelief.loss.peopleDeathCount : 0}</td>
                                              <td>{currentRelief.loss ? currentRelief.loss.peopleInjuredCount : 0}</td>
                                              <td>{currentRelief.loss ? currentRelief.loss.peopleMissingCount : 0}</td>
                                              <td>{currentRelief.loss ? currentRelief.loss.familyAffectedCount : 0}</td>
                                              <td>
                                                  {Number(currentRelief.loss
                                                      ? currentRelief.loss.infrastructureAffectedBridgeCount : 0)
                                        + Number(currentRelief.loss
                                            ? currentRelief.loss.infrastructureAffectedElectricityCount : 0)
                                        + Number(currentRelief.loss ? currentRelief.loss.infrastructureAffectedHouseCount : 0)
                                        + Number(currentRelief.loss ? currentRelief.loss.infrastructureAffectedRoadCount : 0)}
                                              </td>
                                              <td>{currentRelief.loss ? currentRelief.loss.infrastructureDestroyedCount : 0}</td>
                                              <td>{currentRelief.loss ? currentRelief.loss.livestockDestroyedCount : 0}</td>
                                          </tr>

                                      </tbody>
                                  </table>
                              </div>


                              )


                          </>
                      )
                 }
             </div>
         )
            }

            {
                props.previewDetails
            && (
                <>
                    <div className={styles.budgetPreviewContainer}>
                        <h2><Gt section={Translations.DisasterIncidentSummary} /></h2>
                        <div className={styles.lossRow}>

                            <div className={styles.lossSection}>
                                <div className={styles.lossElement}>
                                    <ScalableVectorGraphics
                                        className={styles.lossIcon}
                                        src={IncidentIcon}
                                        alt="Bullet Point"
                                    />

                                    <ul>
                                        <p className={styles.darkerText}>{Number(incidentCount)}</p>
                                        <p className={styles.smallerText}>
                                            <Gt section={Translations.Incident} />
                                        </p>
                                    </ul>
                                </div>
                                <div className={styles.lossElement}>
                                    <ScalableVectorGraphics
                                        className={styles.lossIcon}
                                        src={moneyBag}
                                        alt="Bullet Point"
                                    />
                                    <ul>
                                        <p className={styles.darkerText}>{`${(Number(totalEstimatedLoss) / 1000000).toFixed(2)}m`}</p>
                                        <p className={styles.smallerText}>
                                            <Gt section={Translations.EstimatedLoss} />
                                        </p>
                                    </ul>
                                </div>
                                <div className={styles.lossElement}>
                                    <ScalableVectorGraphics
                                        className={_cs(styles.lossIcon, styles.deathL)}
                                        src={DeathIcon}
                                        alt="Bullet Point"
                                    />
                                    <ul>
                                        <p className={styles.darkerText}>{Number(deathCount)}</p>
                                        <p className={styles.smallerText}>
                                            <Gt section={Translations.Death} />

                                        </p>
                                    </ul>
                                </div>
                                <div className={styles.lossElement}>
                                    <ScalableVectorGraphics
                                        className={_cs(styles.lossIcon, styles.deathL)}
                                        src={MissingIcon}
                                        alt="Bullet Point"
                                    />
                                    <ul>
                                        <p className={styles.darkerText}>{Number(missing)}</p>
                                        <p className={styles.smallerText}>
                                            <Gt section={Translations.Missing} />

                                        </p>
                                    </ul>
                                </div>
                                <div className={styles.lossElement}>
                                    <ScalableVectorGraphics
                                        className={styles.lossIcon}
                                        src={InjredIcon}
                                        alt="Bullet Point"
                                    />
                                    <ul>
                                        <p className={styles.darkerText}>{Number(injured)}</p>
                                        <p className={styles.smallerText}>
                                            <Gt section={Translations.Injured} />

                                        </p>
                                    </ul>
                                </div>
                                <div className={styles.lossElement}>
                                    <ScalableVectorGraphics
                                        className={styles.lossIcon}
                                        src={InfraIcon}
                                        alt="Bullet Point"
                                    />
                                    <ul>
                                        <p className={styles.darkerText}>{Number(infraDestroyed)}</p>
                                        <p className={styles.smallerText}>
                                            <Gt section={Translations.IncidentInfrastructureDestroyed} />

                                        </p>
                                    </ul>
                                </div>
                                <div className={styles.lossElement}>
                                    <ScalableVectorGraphics
                                        className={_cs(styles.lossIcon, styles.deathL)}
                                        src={LivestockIcon}
                                        alt="Bullet Point"
                                    />
                                    <ul>
                                        <p className={styles.darkerText}>{Number(livestockDestroyed)}</p>
                                        <p className={styles.smallerText}>
                                            <Gt section={Translations.LiveStockLossDestroyed} />

                                        </p>
                                    </ul>
                                </div>
                            </div>

                        </div>

                    </div>
                </>
            )}

            {
                props.hazardwiseImpact
                && (
                    <div className={styles.reliefReportSection}>
                        <div className={styles.incidentImpactRow}>
                            <div className={styles.incidentSection}>
                                <h2>
                                    <Gt section={Translations.Hazardwiseimpact} />


                                </h2>
                                <BarChart
                                    width={300}
                                    height={250}
                                    data={hazardwiseImpact
                                        .sort((a, b) => b.Incidents - a.Incidents)
                                        .slice(0, 5)
                                    }
                                    margin={{ left: 0, right: 5, top: 10 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        tick={{ textAlign: 'left', fontSize: '9' }}
                                        interval={0}
                                        height={80}
                                        angle={70}
                                        textAnchor="start"
                                        dataKey="name"
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend
                                        verticalAlign="top"
                                        height={20}
                                    />
                                    <Bar
                                        fill="rgb(198,233,232)"
                                        dataKey="People Death"

                                    />
                                    <Bar
                                        dataKey="Incidents"
                                        fill="rgb(0,173,115)"

                                    />
                                </BarChart>
                            </div>

                            <div className={styles.incidentMiddleSection}>
                                <h2>

                                    <Gt section={Translations.Genderwiseimpact} />
                                </h2>
                                <div className={styles.chartandlegend}>

                                    {/* <PieChart width={200} height={175}>
                                        <Pie
                                            data={deathGenderChartData}
                                            cx={80}
                                            cy={110}
                                            innerRadius={40}
                                            outerRadius={60}
                                            fill="#8884d8"
                                            paddingAngle={1}
                                            dataKey="value"
                                            startAngle={90}
                                            endAngle={450}
                                        >
                                            {genderWiseDeathData.map((entry, index) => (
                                            // eslint-disable-next-line react/no-array-index-key
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart> */}

                                    <div className={styles.legend}>
                                        <div className={styles.legenditem}>


                                            <div className={styles.numberRow}>
                                                <ScalableVectorGraphics
                                                    className={styles.houseIcon}
                                                    src={male}
                                                    alt="Bullet Point"
                                                />
                                                <ul>
                                                    <li>

                                                        <span className={styles.bigerNum}>


                                                            {
                                                                (Number(maleDeath)
                                                / (Number(maleDeath)
                                                + Number(femaleDeath))
                                                * 100).toFixed(0)
                                                            }
                                                            {
                                                                '%'
                                                            }

                                                        </span>
                                                    </li>
                                                    <li className={styles.light}>
                                                        <span>Male</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className={_cs(styles.legenditem, styles.bottomRow)}>


                                            <div className={styles.numberRow}>
                                                <ScalableVectorGraphics
                                                    className={styles.houseIcon}
                                                    src={female}
                                                    alt="Bullet Point"
                                                />
                                                <ul>
                                                    <li>

                                                        <span className={styles.bigerNum}>

                                                            {
                                                                (Number(femaleDeath)
                                                / (Number(femaleDeath)
                                                + Number(maleDeath))
                                                * 100).toFixed(0)
                                                            }
                                                            {
                                                                '%'
                                                            }
                                                        </span>
                                                    </li>
                                                    <li className={styles.light}>
                                                        <span>Female</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className={styles.houseData}>
                                    <p>
                                        <Gt section={Translations.HouseDamaged} />


                                    </p>
                                    <div className={styles.houseRow}>
                                        <div className={styles.houseElement}>

                                            <ScalableVectorGraphics
                                                className={styles.houseIcon}
                                                src={HouseAffIcon}
                                                alt="Bullet Point"
                                            />
                                            <ul>
                                                <span className={styles.darker}>{houseAffected}</span>
                                                <li>
                                                    <Gt section={Translations.Partial} />

                                                </li>
                                            </ul>

                                        </div>
                                        <div className={styles.houseElement}>

                                            <ScalableVectorGraphics
                                                className={styles.houseIcon}
                                                src={HouseDmgIcon}
                                                alt="Bullet Point"
                                            />
                                            <ul>
                                                <li><span className={styles.darker}>{houseDamaged}</span></li>
                                                <li>
                                                    <Gt section={Translations.Fully} />
                                                </li>
                                            </ul>

                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className={styles.incidentSection}>
                                <h2>
                                    <Gt section={Translations.Wardwiseimpact} />
                                </h2>
                                <BarChart
                                    width={250}
                                    height={250}
                                    data={wardWiseImpact
                                        .sort((a, b) => -(a.Death + a.Injured + a.Missing) + (b.Death + b.Injured + b.Missing))
                                        .slice(0, 5)
                                    }
                                    margin={{ left: 0, right: 5, top: 10, bottom: 20 }}

                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dx={10} interval={0} angle={40} dataKey="ward" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend
                                        wrapperStyle={{
                                            paddingTop: '5px',
                                            paddingLeft: '5px',
                                            marginLeft: '15px',
                                        }}
                                    />
                                    <Bar
                                        dataKey="Death"
                                        stackId="a"
                                        fill="rgb(143,212,221)"
                                        barSize={10}

                                    />
                                    <Bar
                                        dataKey="Missing"
                                        stackId="a"
                                        fill="rgb(0,82,52)"
                                        barSize={10}

                                    />
                                    <Bar
                                        dataKey="Injured"
                                        stackId="a"
                                        fill="rgb(0,177,117)"
                                        barSize={10}
                                    />
                                </BarChart>
                            </div>

                        </div>
                        <div className={styles.reliefdistRow}>
                            <div className={styles.incidentSection}>
                                <h2>
                                    <Gt section={Translations.Relief} />
                                </h2>
                                <ComposedChart
                                    width={500}
                                    height={300}
                                    data={reliefChartData}
                                    margin={{
                                        top: 5,
                                        right: 5,
                                        bottom: 5,
                                        left: 5,
                                    }}
                                >
                                    <CartesianGrid stroke="#f5f5f5" />
                                    {/* <XAxis interval={0} angle={90} dataKey="name" scale="auto" /> */}
                                    {/* <YAxis scale="auto" yAxisId="left" />
                                    <YAxis width={80} yAxisId="right" orientation="right" tick={{ fontSize: 10 }} /> */}
                                    <XAxis
                                        height={35}
                                        // dy={15}
                                        interval={0}
                                        angle={50}
                                        dataKey="name"
                                        scale="auto"
                                        tick={{ textAlign: 'left', fontSize: '10' }}
                                        textAnchor="start"
                                    />
                                    <YAxis
                                        scale="auto"
                                        yAxisId="left"
                                        // label={{ value: 'No of Beneficiaries', angle: -90, position: 'insideLeft' }}
                                    />
                                    <YAxis
                                        width={80}
                                        yAxisId="right"
                                        orientation="right"
                                        tick={{ fontSize: 10 }}
                                        // label={{ value: 'Relief Distributed (NPR)', angle: -90, position: 'right' }}

                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey={drrmLanguage.language === 'en' ? 'Beneficiaries' : 'लाभार्थीहरू'}
                                        barSize={20}
                                        fill="rgb(0,177,117)"
                                        label={{ position: 'top', fill: '#777', fontSize: '10px' }}
                                        yAxisId="left"
                                    />

                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey={drrmLanguage.language === 'en' ? 'Amount-Distributed' : 'रकम वितरित'}
                                        stroke="rgb(165,0,21)"
                                        label={{ position: 'top', fill: '#777', fontSize: '10px' }}

                                    />
                                </ComposedChart>
                            </div>
                            <div className={styles.reliefDataMainContainer}>
                                <div className={styles.reliefDistribution}>

                                    <div className={styles.distItem}>
                                        <ScalableVectorGraphics
                                            className={styles.reliefIcon}
                                            src={moneyBag}
                                            alt="Relief"
                                        />

                                        <ul>
                                            <li>
                                                <span className={styles.biggerText}>
                                                    <Gt section={Translations.Rupees} />

                                                    {' '}
                                                    {totreliefAmt}
                                                </span>
                                            </li>
                                            <li>
                                                <span className={styles.smallerText}>
                                                    <Gt section={Translations.ReliefAmt} />
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className={styles.distItem}>
                                        <ScalableVectorGraphics
                                            className={styles.reliefIcon}
                                            src={family}
                                            alt="Relief"
                                        />
                                        <ul>
                                            <li>
                                                <span className={styles.biggerText}>{totBenFam}</span>
                                            </li>
                                            <li>
                                                <span className={styles.smallerText}>
                                                    <Gt section={Translations.ReliefBen} />

                                                </span>
                                            </li>
                                        </ul>
                                    </div>

                                </div>
                                <div className={styles.peopleBenefited}>

                                    <div className={styles.benefitedRow}>
                                        <div className={styles.distItem}>
                                            <ScalableVectorGraphics
                                                className={styles.reliefIcon}
                                                src={male}
                                                alt="Relief"
                                            />
                                            <ul>
                                                <li>
                                                    <span className={styles.biggerText}>{totMale}</span>

                                                </li>
                                                <li>
                                                    <span className={styles.smallerText}>
                                                        <Gt section={Translations.Male} />

                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className={styles.distItem}>
                                            <ScalableVectorGraphics
                                                className={styles.reliefIcon}
                                                src={female}
                                                alt="Relief"
                                            />
                                            <ul>
                                                <li>
                                                    <span className={styles.biggerText}>{totFemale}</span>
                                                </li>

                                                <li>
                                                    <span className={styles.smallerText}>
                                                        <Gt section={Translations.Female} />

                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className={styles.lastRow}>
                                        <ul>
                                            <li>
                                                <span className={styles.darkerSmText}>
                                                    {totJanajatis || 0}
                                                </span>
                                            </li>
                                            <li>
                                                <span className={styles.lighterSmText}>
                                                    <Gt section={Translations.ReliefBenefitedPeopleJanajati} />

                                                </span>
                                            </li>
                                        </ul>
                                        <ul>
                                            <li>
                                                <span className={styles.darkerSmText}>
                                                    {totMadhesis}
                                                </span>
                                            </li>
                                            <li>
                                                <span className={styles.lighterSmText}>
                                                    <Gt section={Translations.ReliefBenefitedPeopleMadhesi} />
                                                </span>
                                            </li>
                                        </ul>
                                        <ul>
                                            <li>
                                                <span className={styles.darkerSmText}>
                                                    {totMinotiries}
                                                </span>
                                            </li>
                                            <li>
                                                <span className={styles.lighterSmText}>

                                                    <Gt section={Translations.ReliefBenefitedPeopleMinorities} />

                                                </span>
                                            </li>
                                        </ul>
                                        <ul>
                                            <li>
                                                <span className={styles.darkerSmText}>
                                                    {totDalits}
                                                </span>
                                            </li>
                                            <li>
                                                <span className={styles.lighterSmText}>
                                                    <Gt section={Translations.ReliefBenefitedPeopleDalit} />

                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            }
            {modalClose ? ''
                : (
                    <Modal>
                        <ModalHeader

                            rightComponent={(
                                <DangerButton
                                    transparent
                                    iconName="close"
                                    title="Close Modal"
                                    onClick={handleCloseModal}
                                />
                            )}
                        />
                        <ModalBody>
                            <h3>
                                {' '}
                                <Gt section={Translations.ReliefHeading} />
                            </h3>
                            <div className={styles.inputContainer}>
                                <span className={styles.dpText}><Gt section={Translations.ReliefBeneficiary} /></span>
                                <input
                                    type="number"
                                    className={styles.inputElement}
                                    onChange={handleFamiliesBenefited}
                                    value={familiesBenefited}
                                    placeholder={drrmLanguage.language === 'np' ? 'कृपया लाभान्वित भएका परिवारहरूको संख्या निर्दिष्ट गर्नुहोस्' : 'Kindly specify number of families benefited'}
                                    disabled={disableInput}
                                />
                            </div>
                            <div className={styles.inputContainer}>
                                <span className={styles.dpText}><Gt section={Translations.ReliefBeneficiaryName} /></span>
                                <textarea
                                    className={styles.inputElement}
                                    onChange={handleNameofBeneficiaries}
                                    value={namesofBeneficiaries}

                                    placeholder={drrmLanguage.language === 'np' ? 'कृपया लाभार्थीहरूको नाम निर्दिष्ट गर्नुहोस्' : 'Kindly specify the names of beneficiaries'}
                                    rows={3}
                                    // cols={7}
                                    disabled={disableInput}
                                />
                            </div>
                            <div className={styles.inputContainer}>
                                <span className={styles.dpText}><Gt section={Translations.ReliefDistributionDate} /></span>
                                {disableInput ? (
                                    <input
                                        type="text"
                                        className={styles.inputElement}
                                        onChange={handleReliefAmount}
                                        value={reliefDate}

                                        disabled={disableInput}
                                    />
                                ) : (
                                    <NepaliDatePicker
                                        inputClassName="form-control"
                                        className={styles.datepicker}
                                        value={reliefDate}
                                        onChange={date => setreliefDate(date)}
                                        options={{ calenderLocale: drrmLanguage.language === 'np' ? 'ne' : 'en', valueLocale: 'en' }}
                                    />
                                )

                                }


                            </div>
                            <div className={styles.inputContainer}>
                                <span className={styles.dpText}><Gt section={Translations.ReliefAmount} /></span>
                                <input
                                    type="number"
                                    className={styles.inputElement}
                                    onChange={handleReliefAmount}
                                    value={reliefAmount}

                                    placeholder={drrmLanguage.language === 'np' ? 'कृपया राहत राशि निर्दिष्ट गर्नुहोस्' : 'Kindly specify Relief amount'}
                                    disabled={disableInput}
                                />
                            </div>


                            <h3><strong><Gt section={Translations.ReliefBenefitedPeopleHeading} /></strong></h3>
                            <div className={styles.inputContainer}>
                                <span className={styles.dpText}><Gt section={Translations.ReliefBenefitedPeopleMale} /></span>
                                <input
                                    type="number"
                                    className={styles.inputElement}
                                    onChange={handlemaleBenefited}
                                    value={maleBenefited}

                                    placeholder={drrmLanguage.language === 'np' ? 'कृपया नम्बर निर्दिष्ट गर्नुहोस्' : 'Kindly specify number'}
                                    disabled={disableInput}
                                />
                            </div>
                            <div className={styles.inputContainer}>
                                <span className={styles.dpText}><Gt section={Translations.ReliefBenefitedPeopleFemale} /></span>
                                <input
                                    type="number"
                                    className={styles.inputElement}
                                    onChange={handlefemaleBenefited}
                                    value={femaleBenefited}

                                    placeholder={drrmLanguage.language === 'np' ? 'कृपया नम्बर निर्दिष्ट गर्नुहोस्' : 'Kindly specify number'}
                                    disabled={disableInput}
                                />
                            </div>
                            <div className={styles.inputContainer}>
                                <span className={styles.dpText}><Gt section={Translations.ReliefBenefitedPeopleMinorities} /></span>
                                <input
                                    type="number"
                                    className={styles.inputElement}
                                    onChange={handleMinorities}
                                    value={miorities}

                                    placeholder={drrmLanguage.language === 'np' ? 'कृपया नम्बर निर्दिष्ट गर्नुहोस्' : 'Kindly specify number'}
                                    disabled={disableInput}
                                />
                            </div>
                            <div className={styles.inputContainer}>
                                <span className={styles.dpText}><Gt section={Translations.ReliefBenefitedPeopleDalit} /></span>
                                <input
                                    type="number"
                                    className={styles.inputElement}
                                    onChange={handleDalit}
                                    value={dalits}

                                    placeholder={drrmLanguage.language === 'np' ? 'कृपया नम्बर निर्दिष्ट गर्नुहोस्' : 'Kindly specify number'}
                                    disabled={disableInput}
                                />
                            </div>
                            <div className={styles.inputContainer}>
                                <span className={styles.dpText}><Gt section={Translations.ReliefBenefitedPeopleMadhesi} /></span>
                                <input
                                    type="number"
                                    className={styles.inputElement}
                                    onChange={handleMadhesis}
                                    value={madhesis}

                                    placeholder={drrmLanguage.language === 'np' ? 'कृपया नम्बर निर्दिष्ट गर्नुहोस्' : 'Kindly specify number'}
                                    disabled={disableInput}
                                />
                            </div>
                            <div className={styles.inputContainer}>
                                <span className={styles.dpText}><Gt section={Translations.ReliefBenefitedPeopleDisable} /></span>
                                <input
                                    type="number"
                                    className={styles.inputElement}
                                    onChange={handleDisabilities}
                                    value={disabilities}

                                    placeholder={drrmLanguage.language === 'np' ? 'कृपया नम्बर निर्दिष्ट गर्नुहोस्' : 'Kindly specify number'}
                                    disabled={disableInput}
                                />
                            </div>
                            {/* <div className={styles.inputContainer}>
                                <span className={styles.dpText}>Relief Amount (NPR)</span>
                                <input
                                    type="number"
                                    className={styles.inputElement}
                                    onChange={handleJanajaties}
                                    value={janajatis}
                                    placeholder={'Kindly specify a number'}
                                    disabled={disableInput}
                                />
                            </div> */}
                            {
                                (postErrors)
                            && (
                                <ul>


                                    <li>
                                        {postErrors}
                                    </li>


                                </ul>
                            )
                            }

                            <button
                                type="button"
                                className={styles.savebtn}
                                onClick={handleBackButton}

                            >
                                <Gt section={Translations.ReliefDataBackButton} />
                            </button>
                            {postButton && (
                                <button
                                    type="button"
                                    className={styles.savebtn}
                            // onClick={() => setShowRelief(false)}
                                    onClick={handleSaveRelief}
                                >
                                    <Gt section={Translations.ReliefDataSaveButton} />
                                </button>
                            )
                            }

                            {updateButton && (
                                <button
                                    type="button"
                                    className={styles.savebtn}
                            // onClick={() => setShowRelief(false)}
                                    onClick={handleUpdateRelief}
                                >
                                    <Gt section={Translations.ReliefDataUpdateButton} />
                                </button>
                            )}
                        </ModalBody>

                    </Modal>
                )
            }
        </div>

    );
};


export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Relief,
        ),
    ),
);
