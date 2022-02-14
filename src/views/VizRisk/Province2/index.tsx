/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable no-tabs */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import { compose } from 'redux';
import Leftpane from './LeftPane/index';
import MultiHazardMap from './MultiHazardMap/index';
import mapConstants from './Data/mapBoxConstants';
import styles from './styles.scss';
import { transformDataRangeLocaleToFilter, transformRegionToFilter } from '#utils/transformations';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
import { AppState, FiltersElement } from '#types';
import {
    regionsSelector,
    filtersSelector,
    hazardTypesSelector,
    incidentListSelectorIP,
    userSelector,
} from '#selectors';
import { setEventListAction, setIncidentListActionIP } from '#actionCreators';
import expressions from './Data/expression';

import { provincesSelector } from '../../../store/atom/page/selector';
import * as PageTypes from '#store/atom/page/types';

interface Props {
    provinces: [];
}

interface HtmlData {
    key: string;
    value: string;
}

interface JsonData {
    key: string;
    value: string;
}

interface Alerts {
    id: number;
    point: number[];
    title: string;
    layer: string;
    referenceType: string;
    referenceData: string;
    resourceType: string;
    createdOn: string;
}

interface RCPData{
    year: number;
    value: number;
}

interface TempData {
    rcp45: RCPData[];
    district: number;
}

type MainHtmlData = HtmlData[];
type MainJsonData = JsonData[];
type MainAlertsData = Alerts[];
type MainTempData = TempData[];

const {
    layers,
    mapCSS,
    zoom,
    incidentsPages,
    ciPages,
    incidentsSliderDelay,
} = mapConstants;

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setIncidentList: params => dispatch(setIncidentListActionIP(params)),
    setEventList: params => dispatch(setEventListAction(params)),
});

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    hazardTypes: hazardTypesSelector(state),
    regions: regionsSelector(state),
    filters: filtersSelector(state),
    hazards: hazardTypesSelector(state),
    incidentList: incidentListSelectorIP(state),
    user: userSelector(state),
    provinces: provincesSelector(state),

});
const transformFilters = ({
    dataDateRange,
    region,
    ...otherFilters
}: FiltersElement) => ({
    ...transformDataRangeLocaleToFilter(dataDateRange, 'incident_on'),
    ...transformRegionToFilter(region),
});


const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    htmlRequest: {
        url: '/keyvalue-html/',
        method: methods.GET,
        query: ({ params }) => ({ province: 2,
            vizrisk_theme__theme_id: 300,
            limit: -1 }),

        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: htmlData = [] } = response as Response;
            params.sethtmlData(htmlData);
            // params.setPending(false);
        },
        onMount: true,
        // extras: { schemaName: 'htmlResponse' },
    },

    jsonDataRequest: {
        url: '/keyvalue-json/',
        method: methods.GET,
        query: ({ params }) => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            province: 2,
            vizrisk_theme__theme_id: 300,
            limit: -1,

        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: jsonData = [] } = response as Response;
            params.setjsonData(jsonData);
            // params.setPending(false);
        },
        onMount: true,
        // extras: { schemaName: 'jsonResponse' },
    },

    cIGetRequest: {
        url: '/resource/',
        method: methods.GET,
        query: ({ params }) => ({
            province: 2,
            limit: -1,
        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: cI = [] } = response as Response;
            params.setCI(cI);
            // params.setPending(false);
        },
        onMount: true,
        // extras: { schemaName: 'cIResponse' },
    },

    alertsGetRequest: {
        url: '/alert/',
        method: methods.GET,
        query: ({ params }) => ({
            expand: 'event',
            province: 2,
        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: alerts = [] } = response as Response;
            params.setAlerts(alerts);
            // params.setPending(false);
        },
        onMount: true,
        // extras: { schemaName: 'cIResponse' },
    },

    vulnerabilityGetRequest: {
        url: '/vulnerability/',
        method: methods.GET,
        query: ({ params }) => ({
            province: 2,
        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: vunData = [] } = response as Response;
            params.setVunData(vunData);
            // params.setPending(false);
        },
        onMount: true,
        // extras: { schemaName: 'cIResponse' },
    },

    contactGetRequest: {
        url: '/municipality-contact/',
        method: methods.GET,
        query: ({ params }) => ({
            province: 2,
        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: contactData = [] } = response as Response;
            params.setContactData(contactData);
            // params.setPending(false);
        },
        onMount: true,
        // extras: { schemaName: 'cIResponse' },
    },

    tempDataGetRequest: {
        url: '/nap-temperature/',
        method: methods.GET,
        query: ({ params }) => ({
            province: 2,
        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: tempData = [] } = response as Response;
            params.setTempData(tempData);
        },
        onMount: true,
        // extras: { schemaName: 'cIResponse' },
    },
    precipitationDataGetRequest: {
        url: '/nap-precipitation/',
        method: methods.GET,
        query: ({ params }) => ({
            province: 2,
        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: precipitationData = [] } = response as Response;
            params.setPrecipitationData(precipitationData);
        },
        onMount: true,
        // extras: { schemaName: 'cIResponse' },
    },

    climateDataRequest: {
        url: '/weather/',
        method: methods.GET,
        query: ({ params }) => ({
            location: 'Nepalgunj',
        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: realData = [] } = response as Response;
            params.setRealTimeData(realData);
        },
        onMount: true,
        // extras: { schemaName: 'incidentResponse' },
    },
    damageandLossDataFlood: {
        url: '/loss/',
        method: methods.GET,
        query: ({ params }) => ({
            aggrigated_sum: 'district',
            province: 2,
            hazard: 11,
        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: floodData = [] } = response as Response;
            params.setlossDataFlood(floodData);
        },
        onMount: true,
        // extras: { schemaName: 'incidentResponse' },
    },
    damageandLossDataLandslide: {
        url: '/loss/',
        method: methods.GET,
        query: ({ params }) => ({
            aggrigated_sum: 'district',
            province: 2,
            hazard: 17,

        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: landslideData = [] } = response as Response;
            params.setlossDataLandslide(landslideData);
        },
        onMount: true,
        // extras: { schemaName: 'incidentResponse' },
    },
    demographyRequest: {
        url: '/demographic/',
        method: methods.GET,
        query: ({ params }) => ({
            aggrigated_sum: 'district',
            province: 2,

        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: demograohicData = [] } = response as Response;
            params.setdemographicData(demograohicData);
        },
        onMount: true,
        // extras: { schemaName: 'incidentResponse' },
    },

};


export const ProvinceTwo = (props: Props) => {
    const { provinces } = props;
    const [pending, setpending] = useState<boolean>(true);
    const leftelements = [1, 2, 3, 4, 5, 6, 7, 8];
    const [leftElement, setleftElement] = useState(0);
    const [legendElement, setlegendElement] = useState('Adminstrative Map');
    const [cI, setCI] = useState([]);
    const [alerts, setAlerts] = useState<MainAlertsData>([]);
    const [htmlData, sethtmlData] = useState<MainHtmlData>([]);
    const [jsonData, setjsonData] = useState<MainJsonData>([]);
    const [criticalElement, setcriticalElement] = useState('all');
    const [showPopulation, setshowPopulation] = useState('popdensity');
    const [clickedItemMultiple, setclickedItemMultiple] = useState('');
    const [clicked, setclicked] = useState([1, 0, 0, 0]);
    const [hazardLegendClickedArr, sethazardLegendClickedArr] = useState([1, 0, 0]);
    const [exposureElementsArr, setexposureElementsArr] = useState([0, 0, 0, 0]);
    const [clickedHazardItem, setclickedHazardItem] = useState('Flood Hazard');
    const [exposureElement, setexposureElement] = useState('');
    const [showCritical, setshowCritical] = useState(false);
    const [active, setactive] = useState(1);
    const [floodLayer, setfloodLayer] = useState('5');
    const [realTimeData, setRealTimeData] = useState([]);
    const [disableNavRightBtn, setdisableNavRightBtn] = useState(false);
    const [disableNavLeftBtn, setdisableNavLeftBtn] = useState(false);
    const [satelliteYearDisabled, setsatelliteYearDisabled] = useState(false);
    const [legentItemDisabled, setlegentItemDisabled] = useState(false);
    const [CIState, setCIState] = useState(false);
    const [selectedYear, setSelectedYear] = useState(2014);
    const [vunData, setVunData] = useState([]);
    const [contactData, setContactData] = useState([]);
    const [tempData, setTempData] = useState<MainTempData>([]);
    const [clickedFatalityInfraDamage, setClickedFatalityInfraDamage] = useState('Fatality');
    const [tempSelectedData, settempSelectedData] = useState('');
    const [prepSelectedData, setprepSelectedData] = useState('prep2010');
    const [precipitationData, setPrecipitationData] = useState<MainTempData>([]);
    const [climateDataType, setclimateDataType] = useState('Precipitation');
    const [climateLineChartData, setclimateLineChartData] = useState([]);
    const [districtIdIs, setdistrictIdIs] = useState(0);
    const [vulnerability, setVulnerability] = useState('Human Poverty Index');
    const [lossDataFlood, setlossDataFlood] = useState([]);
    const [lossDataLandslide, setlossDataLandslide] = useState([]);
    const [demographicData, setdemographicData] = useState([]);


    const municipalityInfo = provinces.filter(item => item.id === 2);
    const bbox = municipalityInfo.map(item => item.bbox)[0];
    const lng = municipalityInfo.map(item => item.centroid.coordinates[0])[0];
    const lat = municipalityInfo.map(item => item.centroid.coordinates[1])[0];

    const meanValueCalculator = (array) => {
        if (array.length > 0) {
            const obtVal = array.map(item => item.value).reduce((a, b) => a + b);
            const num = (obtVal / array.length).toFixed(2);
            return num;
        }
        return null;
    };

    const tempDataTo2010 = tempData.map(item => item.rcp45.filter(obtVal => obtVal.year <= 2010));

    const tempDataForMapUpto2010 = tempData.map((item, i) => ({ value: meanValueCalculator(tempDataTo2010[i]), id: item.district }));

    const tempDataTo2045 = tempData.map(item => item.rcp45.filter(obtVal => obtVal.year <= 2045 && obtVal.year >= 2010));

    const tempDataForMapUpto2045 = tempData.map((item, i) => ({ value: meanValueCalculator(tempDataTo2045[i]), id: item.district }));

    const tempDataTo2065 = tempData.map(item => item.rcp45.filter(obtVal => obtVal.year >= 2036 && obtVal.year <= 2065));

    const tempDataForMapUpto2065 = tempData.map((item, i) => ({ value: meanValueCalculator(tempDataTo2065[i]), id: item.district }));

    const prepDataTo2010 = precipitationData.map(item => item.rcp45.filter(obtVal => obtVal.year <= 2010));

    const prepDataForMapUpto2010 = precipitationData.map((item, i) => ({ value: meanValueCalculator(prepDataTo2010[i]), id: item.district }));

    const prepDataTo2045 = precipitationData.map(item => item.rcp45.filter(obtVal => obtVal.year <= 2045 && obtVal.year >= 2010));

    const prepDataForMapUpto2045 = precipitationData.map((item, i) => ({ value: meanValueCalculator(prepDataTo2045[i]), id: item.district }));

    const prepDataTo2065 = precipitationData.map(item => item.rcp45.filter(obtVal => obtVal.year >= 2036 && obtVal.year <= 2065));

    const prepDataForMapUpto2065 = precipitationData.map((item, i) => ({ value: meanValueCalculator(prepDataTo2065[i]), id: item.district }));


    const climateDataYearWise = {
        tempDataForMapUpto2010,
        tempDataForMapUpto2045,
        tempDataForMapUpto2065,
        prepDataForMapUpto2010,
	   prepDataForMapUpto2045,
	   prepDataForMapUpto2065,
    };

    const handleNext = () => {
        setCIState(true);
        if (
            leftElement < leftelements.length) {
            setleftElement(state => state + 1);
            setactive(leftElement + 2);
            disableNavBtns('both');
        }
    };


    const handlePrev = () => {
        setCIState(true);
        if (leftElement > 0) {
            setleftElement(state => state - 1);
            setactive(leftElement);
            disableNavBtns('both');
        }
    };


    const enableNavBtns = (val: string) => {
        if (val === 'Right') {
            setdisableNavRightBtn(false);
        } else if (val === 'Left') {
            setdisableNavLeftBtn(false);
        }
        setdisableNavLeftBtn(false);
        setdisableNavRightBtn(false);
    };


    const disableNavBtns = (val: string) => {
        if (val === 'Right') {
            setdisableNavRightBtn(true);
        } else if (val === 'Left') {
            setdisableNavLeftBtn(true);
        }
        setdisableNavLeftBtn(true);
        setdisableNavRightBtn(true);
    };

    const setActivePage = (item: number) => {
        setactive(item);
        setleftElement(item - 1);
        // disableNavBtns('both');
    };


    const handleClimateTemp = (item: string) => {
        setclimateDataType('Temperature');
        settempSelectedData(item);
    };
    const handleClimatePrep = (item: string) => {
        setclimateDataType('Precipitation');
        setprepSelectedData(item);
    };

    const handleyearClick = (year: number) => {
        setSelectedYear(year);
        setsatelliteYearDisabled(true);
    };


    const handleLegendClicked = (legendName: string) => {
        setlegentItemDisabled(true);
        if (legendName) {
            setlegendElement(legendName);
        }
    };

    const handlePopulationChange = (showPop: string) => {
        setshowPopulation(showPop);
    };


    const handleMultipeLegendClicked = (legendClicked: string, i: number) => {
        setlegentItemDisabled(true);
        setclickedItemMultiple(legendClicked);

        let clickedCur = [...clicked];
        clickedCur[i] = (clickedCur[i] === 1) ? 0 : 1;
        if (legendClicked === 'Population Density' && clickedCur[3] === 1) {
            clickedCur = [0, 0, 0, 1];
            setclicked(clickedCur);
        } else if (clickedCur[3] === 1 && (clickedCur[0] === 1
    || clickedCur[2] === 1 || clickedCur[1] === 1)) {
            clickedCur[3] = 0;
            setclicked(clickedCur);
        } else {
            setclicked(clickedCur);
        }
        if (clickedCur[0] === 1) {
            setCIState(true);
        }
    };

    const handleMultipleHazardLayer = (hazardItem, i) => {
        setlegentItemDisabled(true);
        setclickedHazardItem(hazardItem);
        const curLegend = [...hazardLegendClickedArr];
        if (i === 0) {
            curLegend[0] = 1;
            curLegend[1] = 0;
            curLegend[2] = 0;
            sethazardLegendClickedArr(curLegend);
        }
        if (i === 1) {
            curLegend[1] = 1;
            curLegend[0] = 0;
            curLegend[2] = 0;
            sethazardLegendClickedArr(curLegend);
        }
        if (i === 2) {
            curLegend[2] = 1;
            curLegend[0] = 0;
            curLegend[1] = 0;
            sethazardLegendClickedArr(curLegend);
        }
    };
    const handleMultipleHazardLayerDamageLoss = (hazardItem: string, i: number) => {
        setlegentItemDisabled(true);
        setclickedHazardItem(hazardItem);
    };

    const handleFatalityInfraLayer = (layerName: string, i: number) => {
        setClickedFatalityInfraDamage(layerName);
    };


    const handleMultipleExposure = (exposureItem: string, i: number) => {
        setlegentItemDisabled(true);
        setexposureElement(exposureItem);
        let curExposure = [...exposureElementsArr];
        curExposure[i] = curExposure[i] === 1 ? 0 : 1;

        if (exposureItem === 'Population Density' && curExposure[1] === 1
        && curExposure[2] === 1 && curExposure[3] === 1 && curExposure[4] === 1) {
            curExposure = [1, 0, 0, 0];
            setexposureElementsArr(curExposure);
        } else if (exposureItem === 'Population Density' && curExposure[0] === 1) {
            curExposure = [1, 0, 0, 0];
            setexposureElementsArr(curExposure);
        } else if (curExposure[0] === 1 || curExposure[1] === 1
|| curExposure[3] === 1) {
            curExposure[0] = 0;
            setexposureElementsArr(curExposure);
        }
        setexposureElementsArr(curExposure);
        if (curExposure[1] === 1) {
            setCIState(true);
        }
    };


    const handleCriticalInfra = (criticalElementName: string) => {
        setCIState(false);
        setcriticalElement(criticalElementName);
    };


    const { requests:
{
    htmlRequest,
    jsonDataRequest,
    cIGetRequest,
    buildingsGetRequest,
    climateDataRequest,
    alertsGetRequest,
    vulnerabilityGetRequest,
    demographyRequest,
    contactGetRequest,
    tempDataGetRequest,
    precipitationDataGetRequest,
    enumData,
    damageandLossDataFlood,
    damageandLossDataLandslide,

} } = props;


    const THEME_ID = 300;
    const pickKeyName = 'vizrisk_province2';
    const KEYNAME = 'vizrisk_province2';
    const MAINKEYNAME = String(pickKeyName).slice(8, -35);
    const PROVINCEID = String(htmlData.map(item => item.province)[0]);


    const SUFFIXID = '2';

    useEffect(() => {
        htmlRequest.setDefaultParams({
            sethtmlData,
        });
        htmlRequest.do();

        alertsGetRequest.setDefaultParams({
            setAlerts,
        });
        alertsGetRequest.do();

        tempDataGetRequest.setDefaultParams({
            setTempData,
        });
        tempDataGetRequest.do();
        precipitationDataGetRequest
            .setDefaultParams({
                setPrecipitationData,
            });
        precipitationDataGetRequest
            .do();

        vulnerabilityGetRequest.setDefaultParams({
            setVunData,
        });
        vulnerabilityGetRequest.do();

        contactGetRequest.setDefaultParams({
            setContactData,
        });
        contactGetRequest.do();

        jsonDataRequest.setDefaultParams({ setjsonData });
        jsonDataRequest.do();


        cIGetRequest.setDefaultParams({
            setCI,
        });
        cIGetRequest.do();

        climateDataRequest.setDefaultParams({
            setRealTimeData,
        });
        climateDataRequest.do();

        damageandLossDataFlood.setDefaultParams({
            setlossDataFlood,
        });
        damageandLossDataFlood.do();

        damageandLossDataLandslide.setDefaultParams({
            setlossDataLandslide,
        });
        damageandLossDataLandslide.do();

        demographyRequest.setDefaultParams({
            setdemographicData,
        });
        demographyRequest.do();
    }, []);


    const alertColorIs = (type: string) => {
        if (type === 'pollution') {
            return 'purple';
        }
        if (type === 'fire') {
            return 'red';
        }
        if (type === 'rain') {
            return '#418fde';
        }
        if (type === 'river') {
            return 'rgb(0, 0, 139)';
        }
        if (type === 'earthquake') {
            return 'rgb(93, 64, 55)';
        }
        return 'black';
    };


    const geoJsonCI = {
        type: 'FeatureCollection',
        features: cI.map(item => ({
            type: 'Feature',
            id: item.id,
            geometry: item.point,
            properties: {
                Name: item.title,
                layer: item.resourceType,
                Type: item.resourceType,
            },
        })),
    };


    const alertsGeoJson = {
        type: 'FeatureCollection',
        features: alerts.map(item => ({
            type: 'Feature',
            id: item.id,
            geometry: item.point,
            properties: {
                Name: item.title,
                layer: item.resourceType,
                Type: item.referenceType,
                alertsColor: alertColorIs(item.referenceType),
                referenceData: item.referenceData,
                createdDate: item.createdOn,
            },
        })),
    };


    const contactGeoJson = {
        type: 'FeatureCollection',
        features: contactData.map(item => ({
            type: 'Feature',
            id: item.id,
            geometry: item.point,
            properties: {
                name: item.name,
                mobileNumber: item.mobileNumber,
                communityAddress: item.communityAddress,
            },
        })),
    };

    const page1TopIntrohtml = htmlData.filter(item => item.key
		=== `${KEYNAME}_page1_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page1Legend1TopIntrohtml = htmlData.filter(item => item.key
		=== `${KEYNAME}_page1_legend1_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page1Legend2TopIntrohtml = htmlData.filter(item => item.key
		=== `${KEYNAME}_page1_legend2_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page1Legend3TopIntrohtml = htmlData.filter(item => item.key
		=== `${KEYNAME}_page1_legend3_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page2TopIntrohtml = htmlData.filter(item => item.key
		=== `${KEYNAME}_page2_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page3TopIntrohtml = htmlData.filter(item => item.key
		=== `${KEYNAME}_page3_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page3Legend1Introhtml = htmlData.filter(item => item.key
		=== `${KEYNAME}_page3_legend1_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page3Legend2Introhtml = htmlData.filter(item => item.key
		=== `${KEYNAME}_page3_legend2_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page3Legend3Introhtml = htmlData.filter(item => item.key
		=== `${KEYNAME}_page3_legend3_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page3Legend4Introhtml = htmlData.filter(item => item.key
		=== `${KEYNAME}_page3_legend4_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page4TopIntrohtml = htmlData.filter(item => item.key
		 === `${KEYNAME}_page4_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page4Legend1Introhtml = htmlData.filter(item => item.key
		 === `${KEYNAME}_page4_legend1_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page4Legend2Introhtml = htmlData.filter(item => item.key
		 === `${KEYNAME}_page4_legend2_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page4Legend3Introhtml = htmlData.filter(item => item.key
		 === `${KEYNAME}_page4_legend3_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page5TopIntrohtml = htmlData.filter(item => item.key
		=== `${KEYNAME}_page5_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page6TopIntrohtml = htmlData.filter(item => item.key
		=== `${KEYNAME}_page6_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page7TopIntrohtml = htmlData.filter(item => item.key
		=== `${KEYNAME}_page7_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page8TopIntrohtml = htmlData.filter(item => item.key
		=== `${KEYNAME}_page8_top_introhtml_${THEME_ID}_${SUFFIXID}`).map(item => item.value);


    const page1Legend1MidClimateData = jsonData.filter(item => item.key
		=== `${KEYNAME}_page1_legend1_mid_climatedata_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page1Legend1BottomTempData = jsonData.filter(item => item.key
		 === `${KEYNAME}_page1_legend1_bottom_temperaturedata_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page1Legend2MidLandcoverData = jsonData.filter(item => item.key
		 === `${KEYNAME}_page1_legend2_mid_landcoverdata_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page1Legend3MidPopulationData = jsonData.filter(item => item.key
		 === `${KEYNAME}_page1_legend3_mid_populationdata_${THEME_ID}_${SUFFIXID}`).map(item => item.value);


    const page3MidLandcoverData = jsonData.filter(item => item.key
		 === `${KEYNAME}_page3_mid_landcoverdata_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const page5MidUrbanData = jsonData.filter(item => item.key
		 === `${KEYNAME}_page5_mid_urbandata_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const populationGridData = jsonData.filter(item => item.key
		 === `${KEYNAME}_population_grid_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const populationDensityRange = jsonData.filter(item => item.key
		 === `${KEYNAME}_population_density_range_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const satelliteImageYears = jsonData.filter(item => item.key
			=== `${KEYNAME}_satellite_image_year_layer_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const floodHazardLayers = jsonData.filter(item => item.key
			=== `${KEYNAME}_flood_hazard_layers_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const buildingCountData = jsonData.filter(item => item.key
			=== `${KEYNAME}_building_count_${THEME_ID}_${SUFFIXID}`).map(item => item.value);

    const mapBoxStyle = jsonData.filter(item => item.key
		 === `${KEYNAME}_mapbox_layer_${THEME_ID}_${SUFFIXID}`).map(item => item.value.layername);


    const realTimeDataStationName = String(jsonData.filter(item => item.key
		=== `${KEYNAME}_realtime_datasource_${THEME_ID}_${SUFFIXID}`).map(item => item.value.stationName)[0]);


    useEffect(() => {
        climateDataRequest.setDefaultParams({
            setRealTimeData,
            realTimeDataStationName,
        });
        climateDataRequest.do();
    }, [realTimeDataStationName]);


    useEffect(() => {
        if (pending) {
            setTimeout(() => {
                setpending(false);
            }, 45000);
            if (cI.length > 0 && htmlData.length > 0
				&& jsonData.length > 0 && alerts.length > 0
				&& contactData.length > 0 && tempData.length > 0
				&& lossDataFlood.length > 0 && lossDataLandslide.length > 0 && demographicData.length > 0) {
                setpending(false);
            }
        }
    }, [cI, htmlData, jsonData, alerts, contactData, tempData, pending]);

    const validAlerts = alerts.filter(item => item.referenceType !== null);
    const alertsName = [...new Set(validAlerts.map(item => item.referenceType))];


    const populationData = demographicData.map(item => ({ id: item.district.id,
        name: item.district.title,
        MalePop: item.data.malePopulationSum,
        FemalePop: item.data.femalePopulationSum,
        TotalHousehold: item.data.householdCountSum }));


    const alertsChartData = [];
    // eslint-disable-next-line no-plusplus

    if (alertsName && alertsName.length > 0) {
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < alertsName.length; index++) {
            const realData = alerts.filter(item => item.referenceType === alertsName[index]).length;
            const mainAlert = {
                name: alertsName[index],
                count: realData,
                color: alertColorIs(alertsName[index]),
            };
            alertsChartData.push(mainAlert);
        }
    }


    const totalFloodLossData = lossDataFlood.map(item => ({
		   id: item.district.id,
		   name: item.district.title,
		   totalPeopleDeath: item.data.peopleDeathCountSum,
		   totalInfraDamage: item.data.infrastructureAffectedCountSum,
		   totalEstimatedLoss: item.data.estimatedLoss,
		 }));


    const totalLandslideLossData = lossDataLandslide.map(item => ({
		   id: item.district.id,
		   name: item.district.title,
		   totalPeopleDeath: isNaN(item.data.peopleDeathCountSum) ? 0 : item.data.peopleDeathCountSum,
		   totalInfraDamage: isNaN(item.data.infrastructureAffectedCountSum) ? 0 : item.data.infrastructureAffectedCountSum,
		   totalEstimatedLoss: item.data.estimatedLoss,
		 }));


    return (
        <>
            {
                pending
                    ? (
                        <div className={styles.loaderInfo}>
                            <Loader color="#fff" className={styles.loader} />
                            <p className={styles.loaderText}>
                            Loading Data...
                            </p>
                        </div>
                    )
                    : (
                        leftElement < 8
                            && (
                                <>
                                    <MultiHazardMap
                                        MAINKEYNAME={MAINKEYNAME}
                                        populationDensityRange={populationDensityRange[0]}
                                        rightElement={leftElement}
                                        selectedYear={selectedYear}
                                        handleyearClick={handleyearClick}
                                        tempDataForMapUpto2010={tempDataForMapUpto2010}
                                        tempDataForMapUpto2045={tempDataForMapUpto2045}
                                        tempDataForMapUpto2065={tempDataForMapUpto2065}
                                        prepDataForMapUpto2010={prepDataForMapUpto2010}
                                        prepDataForMapUpto2045={prepDataForMapUpto2045}
                                        prepDataForMapUpto2065={prepDataForMapUpto2065}
                                        totalFloodLossData={totalFloodLossData}
                                        totalLandslideLossData={totalLandslideLossData}
                                        setclimateLineChartData={setclimateLineChartData}
                                        clickedHazardItem={clickedHazardItem}
                                        clickedFatalityInfraDamage={clickedFatalityInfraDamage}
                                        mapConstants={mapConstants}
                                        expressions={expressions}
                                        vulnerability={vulnerability}
                                        mapboxStyle={mapBoxStyle[0]}
                                        floodHazardLayersArr={floodHazardLayers[0]}
                                        leftElement={leftElement}
                                        CIData={geoJsonCI}
                                        climateTempData={tempData}
                                        precipitationData={precipitationData}
                                        prepSelectedData={prepSelectedData}
                                        alerts={alertsGeoJson}
                                        contactGeoJson={contactGeoJson}
                                        criticalElement={criticalElement}
                                        satelliteImageYears={satelliteImageYears[0]}
                                        boundingBox={bbox}
                                        tempSelectedData={tempSelectedData}
                                        climateDataType={climateDataType}
                                        setdistrictIdIs={setdistrictIdIs}
                                        lng={lng}
                                        lat={lat}
                                        municipalityId={49001}
                                        provinceId={PROVINCEID}
                                        legendElement={legendElement}
                                        demographicsData={populationData}
                                        clickedArr={clicked}
                                        showCritical={showCritical}
                                        exposureElementsArr={exposureElementsArr}
                                        popdensitygeojson={populationGridData[0]}
                                        floodLayer={floodLayer}
                                        hazardLegendClickedArr={hazardLegendClickedArr}
                                        setpending={setpending}
                                        satelliteYearDisabled={satelliteYearDisabled}
                                        setsatelliteYearDisabled={setsatelliteYearDisabled}
                                        setlegentItemDisabled={setlegentItemDisabled}
                                        exposureElement={exposureElement}
                                        enableNavBtns={enableNavBtns}
                                        disableNavBtns={disableNavBtns}

                                    />

                                </>
                            )
                    )

            }
            {
                pending
                    ? (
                        <div className={styles.loaderInfo}>
                            <Loader color="#fff" className={styles.loader} />
                            <p className={styles.loaderText}>
                            Loading Data...
                            </p>
                        </div>
                    ) : (

                        (leftElement === 0 && legendElement === 'Adminstrative Map') && (
                        // The real html data is started from Array's third element
                            <Leftpane
                                introHtml={page1TopIntrohtml[0]}
                                page1Legend1InroHtml={page1Legend1TopIntrohtml[0]}
                                leftElement={leftElement}
                                legendElement={legendElement}
                                tempData={page1Legend1MidClimateData[0]}
                                tempChartData={page1Legend1BottomTempData[0]}
                                handleLegendClicked={handleLegendClicked}
                                handleNext={handleNext}
                                handlePrev={handlePrev}
                                totalPages={leftelements.length}
                                pagenumber={leftElement + 1}
                                pending={pending}
                                setActivePage={setActivePage}
                                active={active}
                                realTimeData={realTimeData[0]}
                                disableNavLeftBtn={disableNavLeftBtn}
                                disableNavRightBtn={disableNavRightBtn}
                                legentItemDisabled={legentItemDisabled}
                                CIState={CIState}
                            />
                        )

                    )}


            {
                (leftElement === 0 && legendElement === 'Landcover') && (

                    <Leftpane
                        introHtml={page1TopIntrohtml[0]}
                        page1Legend2InroHtml={page1Legend2TopIntrohtml[0]}
                        handleLegendClicked={handleLegendClicked}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        landCoverData={page1Legend2MidLandcoverData[0]}
                        leftElement={leftElement}
                        legendElement={legendElement}
                        totalPages={leftelements.length}
                        pagenumber={leftElement + 1}
                        setActivePage={setActivePage}
                        active={active}
                        exposureElementArr={exposureElementsArr}
                        disableNavLeftBtn={disableNavLeftBtn}
                        disableNavRightBtn={disableNavRightBtn}
                        legentItemDisabled={legentItemDisabled}
                    />
                )
            }
            {
                (leftElement === 0 && legendElement === 'Population By District') && (

                    <Leftpane
                        introHtml={page1TopIntrohtml[0]}
                        page1Legend3InroHtml={page1Legend3TopIntrohtml[0]}
                        populationData={populationData}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        handleLegendClicked={handleLegendClicked}
                        leftElement={leftElement}
                        legendElement={legendElement}
                        totalPages={leftelements.length}
                        pagenumber={leftElement + 1}
                        handlePopulationChange={handlePopulationChange}
                        setActivePage={setActivePage}
                        active={active}
                        disableNavLeftBtn={disableNavLeftBtn}
                        disableNavRightBtn={disableNavRightBtn}
                        legentItemDisabled={legentItemDisabled}

                    />
                )
            }
            {
                leftElement === 1 && (

                    <Leftpane
                        introHtml={page2TopIntrohtml[0]}
                        leftElement={leftElement}
                        handleMultipeLegendClicked={handleMultipeLegendClicked}
                        handleMultipleHazardLayerDamageLoss={handleMultipleHazardLayerDamageLoss}
                        clickedFatalityInfraDamage={clickedFatalityInfraDamage}
                        handleFatalityInfraLayer={handleFatalityInfraLayer}
                        totalFloodLossData={totalFloodLossData}
                        totalLandslideLossData={totalLandslideLossData}
                        clickedHazardItem={clickedHazardItem}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        totalPages={leftelements.length}
                        pagenumber={leftElement + 1}
                        setActivePage={setActivePage}
                        active={active}
                        disableNavLeftBtn={disableNavLeftBtn}
                        disableNavRightBtn={disableNavRightBtn}

                    />
                )
            }
            {
                leftElement === 2 && (

                    <Leftpane
                        alertsChartData={alertsChartData}
                        introHtml={page3TopIntrohtml[0]}
                        exposureElementArr={exposureElementsArr}
                        handleCriticalInfra={handleCriticalInfra}
                        leftElement={leftElement}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        totalPages={leftelements.length}
                        pagenumber={leftElement + 1}
                        criticalElement={criticalElement}
                        handleMultipeLegendClicked={handleMultipeLegendClicked}
                        clickedArr={clicked}
                        setActivePage={setActivePage}
                        active={active}
                        popdensitygeojson={populationGridData[0]}
                        buildingsChartData={buildingCountData}
                        landCoverDataInKm={page3MidLandcoverData[0]}
                        disableNavLeftBtn={disableNavLeftBtn}
                        disableNavRightBtn={disableNavRightBtn}
                        legentItemDisabled={legentItemDisabled}
                        CIState={CIState}


                    />
                )
            }
            {
                leftElement === 3 && (

                    <Leftpane

                        introHtml={page4TopIntrohtml[0]}

                        page4Legend1InroHtml={page4Legend1Introhtml[0]}
                        page4Legend2InroHtml={page4Legend2Introhtml[0]}
                        page4Legend3InroHtml={page4Legend3Introhtml[0]}
                        populationDensityRange={populationDensityRange[0]}
                        vulnrerability={vulnerability}
                        setVulnerability={setVulnerability}
                        cI={cI}
                        criticalElement={criticalElement}
                        handleCriticalInfra={handleCriticalInfra}
                        exposureElementArr={exposureElementsArr}
                        clickedArr={clicked}
                        leftElement={leftElement}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        totalPages={leftelements.length}
                        pagenumber={leftElement + 1}
                        handleExposure={handleMultipleExposure}
                        exposureElement={exposureElement}
                        hazardLegendClicked={hazardLegendClickedArr}
                        setActivePage={setActivePage}
                        active={active}
                        hazardLegendClickedArr={hazardLegendClickedArr}
                        popdensitygeojson={populationGridData[0]}
                        disableNavLeftBtn={disableNavLeftBtn}
                        disableNavRightBtn={disableNavRightBtn}
                        legentItemDisabled={legentItemDisabled}
                        CIState={CIState}


                    />
                )
            }
            {
                leftElement === 4 && (

                    <Leftpane
                        introHtml={page5TopIntrohtml[0]}
                        urbanData={page5MidUrbanData[0]}
                        setfloodLayer={setfloodLayer}
                        handleMultipleHazardLayer={handleMultipleHazardLayer}
                        hazardLegendClickedArr={hazardLegendClickedArr}
                        leftElement={leftElement}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        totalPages={leftelements.length}
                        pagenumber={leftElement + 1}
                        setActivePage={setActivePage}
                        active={active}
                        disableNavLeftBtn={disableNavLeftBtn}
                        disableNavRightBtn={disableNavRightBtn}
                    />
                )
            }
            {
                leftElement === 5 && (

                    <Leftpane
                        introHtml={page6TopIntrohtml[0]}
                        urbanData={page5MidUrbanData[0]}
                        leftElement={leftElement}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        totalPages={leftelements.length}
                        climateLineChartData={climateLineChartData}
                        climateDataYearWise={climateDataYearWise}
                        climateDataType={climateDataType}
                        districtIdIs={districtIdIs}
                        handleClimateTemp={handleClimateTemp}
                        handleClimatePrep={handleClimatePrep}
                        tempSelectedData={tempSelectedData}
                        prepSelectedData={prepSelectedData}
                        pagenumber={leftElement + 1}
                        setActivePage={setActivePage}
                        active={active}
                        disableNavLeftBtn={disableNavLeftBtn}
                        disableNavRightBtn={disableNavRightBtn}
                    />
                )
            }
            {
                leftElement === 6 && (

                    <Leftpane
                        introHtml={page7TopIntrohtml[0]}
                        urbanData={page5MidUrbanData[0]}
                        leftElement={leftElement}
                        handleNext={handleNext}
                        setfloodLayer={setfloodLayer}
                        handleMultipleHazardLayer={handleMultipleHazardLayer}
                        hazardLegendClickedArr={hazardLegendClickedArr}
                        handlePrev={handlePrev}
                        totalPages={leftelements.length}
                        pagenumber={leftElement + 1}
                        setActivePage={setActivePage}
                        active={active}
                        disableNavLeftBtn={disableNavLeftBtn}
                        disableNavRightBtn={disableNavRightBtn}
                        cI={cI}
                        CIState={CIState}
                        criticalElement={criticalElement}
                        handleCriticalInfra={handleCriticalInfra}
                        exposureElementArr={exposureElementsArr}
                    />
                )
            }
            {
                leftElement === 7 && (

                    <Leftpane
                        introHtml={page8TopIntrohtml[0]}
                        urbanData={page5MidUrbanData[0]}
                        leftElement={leftElement}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        totalPages={leftelements.length}
                        pagenumber={leftElement + 1}
                        setActivePage={setActivePage}
                        active={active}
                        disableNavLeftBtn={disableNavLeftBtn}
                        disableNavRightBtn={disableNavRightBtn}
                    />
                )
            }
            <div />


        </>
    );
};


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(ProvinceTwo);
