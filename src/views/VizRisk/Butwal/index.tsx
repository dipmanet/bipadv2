/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import { compose } from 'redux';
import memoize from 'memoize-one';
import { Item } from 'semantic-ui-react';
import { centroid } from '@turf/turf';
import NavButtons from './Components/NavButtons';
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
import { getSanitizedIncidents } from '#views/LossAndDamage/common';

import { incidentPointToGeojson } from '#utils/domain';
import expressions from './Data/expression';

import { municipalitiesSelector } from '../../../store/atom/page/selector';
import * as PageTypes from '#store/atom/page/types';


const {
    layers,
    mapCSS,
    zoom,
    hillshadeLayerName,
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
    municipalities: municipalitiesSelector(state),

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
    incidentsGetRequest: {
        url: '/incident/',
        method: methods.GET,

        query: ({ params }) => {
            const filters = {
                region: { adminLevel: 3, geoarea: params.municipalityId },
                hazard: [],
                dataDateRange: {
                    rangeInDays: 'custom',
                    startDate: '2011-01-01',
                    // endDate: '2021-05-01',
                    endDate: new Date().toISOString().substring(0, 10),
                },
            };
            return ({
                ...transformFilters(filters),
                expand: ['loss', 'event', 'wards'],
                ordering: '-incident_on',
                limit: -1,
            });
        },
        onSuccess: ({ params, response, props: { setIncidentList } }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: incidentList = [] } = response as Response;

            setIncidentList({ incidentList });
            params.setIncidentList(incidentList);
        },
        onMount: false,
        // onPropsChanged: {
        //     filters: ({
        //         props: { filters },
        //         prevProps: { filters: prevFilters },
        //     }) => {
        //         const shouldRequest = filters !== prevFilters;

        //         return shouldRequest;
        //     },
        // },
        extras: { schemaName: 'incidentResponse' },
    },
    htmlRequest: {
        url: '/keyvalue-html/',
        method: methods.GET,
        query: ({ params }) => ({ municipality: params.municipalityId,
			    limit: -1 }),

        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.HtmlData[] }
            const { results: htmlData = [] } = response as Response;
            params.sethtmlData(htmlData);
            // params.setPending(false);
        },
        onMount: false,
        // extras: { schemaName: 'htmlResponse' },
    },
    jsonDataRequest: {
        url: '/keyvalue-json/',
        method: methods.GET,
        query: ({ params }) => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            municipality: params.municipalityId,
            limit: -1,

        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: jsonData = [] } = response as Response;
            params.setjsonData(jsonData);
            // params.setPending(false);
        },
        onMount: false,
        // extras: { schemaName: 'jsonResponse' },
    },


    cIGetRequest: {
        url: '/resource/',
        method: methods.GET,
        query: ({ params }) => ({
            municipality: params.municipalityId,
            limit: -1,
        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageTypes.Incident[] }
            const { results: cI = [] } = response as Response;
            params.setCI(cI);
            // params.setPending(false);
        },
        onMount: false,
        // extras: { schemaName: 'cIResponse' },
    },

    climateDataRequest: {
        url: '/weather/',
        method: methods.GET,
        query: ({ params }) => ({
            location: params.realTimeDataStationName,
        }),
        onSuccess: ({ params, response }) => {
            // interface Response { results: PageType.Incident[] }
            const { results: realData = [] } = response as Response;
            params.setRealTimeData(realData);
        },
        onMount: false,
        // extras: { schemaName: 'incidentResponse' },
    },

    // vulnerabilityData: {
    //     url: '/vizrisk-building/',
    //     method: methods.GET,
    //     query: () => ({
    //         municipality: params.municipalityId,
    //         limit: -1,
    //     }),
    //     onSuccess: ({ params, response }) => {
    //         const { results: vulData = [] } = response;
    //         params.setVulData(vulData);
    //     },
    //     onMount: true,

    // },
    // enumData: {
    //     url: '/enum-choice/',
    //     method: methods.GET,
    //     onSuccess: ({ params, response }) => {
    //         params.setEnum(response);
    //     },
    //     onMount: true,

    // },
};


export const Butwal = (props) => {
    const { municipalities, municipalityId } = props;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [pending, setpending] = useState<boolean>(true);
    const [clickedIncidentItem, setclickedIncidentItem] = useState('all');
    const leftelements = [1, 2, 3, 4, 5];
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [leftElement, setleftElement] = useState(0);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [legendElement, setlegendElement] = useState('Admin Boundary');
    const [incidentFilterYear, setincidentFilterYear] = useState('2011');
    const [cI, setCI] = useState([]);
    const [htmlData, sethtmlData] = useState([]);
    const [jsonData, setjsonData] = useState([]);
    const [criticalElement, setcriticalElement] = useState('all');
    const [showPopulation, setshowPopulation] = useState('ward');
    const [showCritical, setshowCritical] = useState(false);
    const [clickedItemMultiple, setclickedItemMultiple] = useState('');
    const [clicked, setclicked] = useState([1, 0, 0, 0]);
    const [hazardLegendClickedArr, sethazardLegendClickedArr] = useState([1, 0, 0]);
    const [exposureElementsArr, setexposureElementsArr] = useState([0, 0, 0, 0]);
    const [clickedHazardItem, setclickedHazardItem] = useState('');
    const [exposureElement, setexposureElement] = useState('');
    const [active, setactive] = useState(1);
    const [floodLayer, setfloodLayer] = useState('5');
    const [realTimeData, setRealTimeData] = useState([]);
    const [disableNavRightBtn, setdisableNavRightBtn] = useState(false);
    const [disableNavLeftBtn, setdisableNavLeftBtn] = useState(false);
    const [satelliteYearDisabled, setsatelliteYearDisabled] = useState(false);
    const [legentItemDisabled, setlegentItemDisabled] = useState(false);
    const [CIState, setCIState] = useState(false);

    const municipalityInfo = municipalities.filter(item => item.id === municipalityId);
    const [selectedYear, setSelectedYear] = useState(2014);
    const bbox = municipalityInfo.map(item => item.bbox)[0];
    const lng = municipalityInfo.map(item => item.centroid.coordinates[0])[0];
    const lat = municipalityInfo.map(item => item.centroid.coordinates[1])[0];


    const [incidentDetailsData, setincidentDetailsData] = useState({
        peopleDeathCount: 0,
        infrastructureDestroyedHouseCount: 0,
        infrastructureAffectedHouseCount: 0,
        peopleMissingCount: 0,
        infrastructureEconomicLoss: 0,
        agricultureEconomicLoss: 0,
        totalAnnualincidents: 0,
    });
    const { requests:
		{

		    incidentsGetRequest,

		} } = props;
    const { incidentList } = props;
    useEffect(() => {
        incidentsGetRequest.setDefaultParams({
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            setIncidentList,
            municipalityId,

        });
        incidentsGetRequest.do();
    }, [municipalityId, incidentList]);


    const handleNext = () => {
        setCIState(true);
        if (
            leftElement < leftelements.length) {
            setleftElement(state => state + 1);
            // this.disableNavBtns('both');
            setactive(leftElement + 2);
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            disableNavBtns('both');
        }
    };


    const handlePrev = () => {
        setCIState(true);
        if (leftElement > 0) {
            setleftElement(state => state - 1);
            setactive(leftElement);
            // this.disableNavBtns('both');
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            disableNavBtns('both');
        }
        // if (leftElement === 3) {
        //     setcriticalElement('all');
        // }
    };


    const enableNavBtns = (val) => {
        if (val === 'Right') {
            setdisableNavRightBtn(false);
        } else if (val === 'Left') {
            setdisableNavLeftBtn(false);
        }
        setdisableNavLeftBtn(false);
        setdisableNavRightBtn(false);
    };


    const disableNavBtns = (val) => {
        if (val === 'Right') {
            setdisableNavRightBtn(true);
        } else if (val === 'Left') {
            setdisableNavLeftBtn(true);
        }
        setdisableNavLeftBtn(true);
        setdisableNavRightBtn(true);
    };

    const setActivePage = (item) => {
        setactive(item);
        setleftElement(item - 1);
        // disableNavBtns('both');
    };


    const handleIncidentChange = (incidentYear) => {
        const y = `${Number(incidentYear) + 2011}`;
        setincidentFilterYear(y);
    };


    const handleyearClick = (year) => {
        setSelectedYear(year);
        setsatelliteYearDisabled(true);
    };


    const handleLegendClicked = (legendName: string) => {
        setlegentItemDisabled(true);
        if (legendName) {
            setlegendElement(legendName);
        }
    };
    const handleIncidentItemClick = ((clickedIncidentTerm) => {
        setclickedIncidentItem(clickedIncidentTerm);
    });

    const handlePopulationChange = (showPop) => {
        setshowPopulation(showPop);
    };

    const handleMultipeLegendClicked = (legendClicked, i) => {
        setlegentItemDisabled(true);
        setclickedItemMultiple(legendClicked);

        let clickedCur = [...clicked];
        clickedCur[i] = (clickedCur[i] === 1) ? 0 : 1;
        if (legendClicked === 'Population Density' && clickedCur[1] === 1) {
            clickedCur = [0, 1, 0, 0];
            setclicked(clickedCur);
        } else if (clickedCur[1] === 1 && (clickedCur[0] === 1
			|| clickedCur[2] === 1 || clickedCur[3] === 1)) {
            clickedCur[1] = 0;
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
            curLegend[0] = curLegend[0] === 1 ? 0 : 1;
            curLegend[1] = 0;
            curLegend[2] = 0;
            sethazardLegendClickedArr(curLegend);
        }
        if (i === 1) {
            curLegend[1] = curLegend[1] === 1 ? 0 : 1;
            curLegend[0] = 0;
            curLegend[2] = 0;
            sethazardLegendClickedArr(curLegend);
        }
        if (i === 2) {
            curLegend[2] = curLegend[2] === 1 ? 0 : 1;
            curLegend[0] = 0;
            curLegend[1] = 0;
            sethazardLegendClickedArr(curLegend);
        }
    };


    const handleMultipleExposure = (exposureItem, i) => {
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


    const getIncidentYear = (incidentOn: string) => {
        if (incidentOn) {
            const date = incidentOn.split('T')[0];
            return date.split('-')[0];
        }
        return 0;
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
		    vulnerabilityData,
		    enumData,
		} } = props;


    const setIncidentList = (year: string, hazard) => {
        let filteredIL;

        if (hazard !== 'all') {
            filteredIL = incidentList.filter(item => item.hazardInfo.title === hazard);
        } else {
            filteredIL = incidentList;
        }
        if (filteredIL.length > 0) {
            const inciTotal = filteredIL
                .filter(y => getIncidentYear(y.incidentOn) === year)
                .map(item => item.loss)
                .filter(f => f !== undefined);

            if (inciTotal.length > 0) {
                const incidentDetails = inciTotal.reduce((a, b) => ({
                    peopleDeathCount: (a.peopleDeathCount || 0) + (b.peopleDeathCount || 0),
                    infrastructureDestroyedHouseCount:
                    (a.infrastructureDestroyedHouseCount || 0)
					 + (b.infrastructureDestroyedHouseCount || 0),
                    infrastructureAffectedHouseCount:
                    (a.infrastructureAffectedHouseCount || 0)
					+ (b.infrastructureAffectedHouseCount || 0),
                    peopleMissingCount:
                    (a.peopleMissingCount || 0) + (b.peopleMissingCount || 0),
                    infrastructureEconomicLoss:
                    (a.infrastructureEconomicLoss || 0) + (b.infrastructureEconomicLoss || 0),
                    agricultureEconomicLoss:
                    (a.agricultureEconomicLoss || 0) + (b.agricultureEconomicLoss || 0),
                    totalAnnualincidents: inciTotal.length || 0,
                }));
                setincidentDetailsData(incidentDetails);
            }
        }
    };


    const THEME_ID = 101;
    const pickKeyName = htmlData.filter(item => item.key.includes('page3_top_introhtml')).map(item => item.key)[0];
    const KEYNAME = String(pickKeyName).slice(0, -35);
    const MAINKEYNAME = String(pickKeyName).slice(8, -35);
    const MUNICIPALITYID = String(htmlData.map(item => item.municipality)[0]);
    const PROVINCEID = String(htmlData.map(item => item.province)[0]);
    const DISTRICTID = String(htmlData.map(item => item.district)[0]);


    console.log('main key name is', MAINKEYNAME);


    const SUFFIXID = `${PROVINCEID}_${DISTRICTID}_${MUNICIPALITYID}`;
    const {
        regions,
        hazardTypes,
        hazards,
    } = props;
    useEffect(() => {
        htmlRequest.setDefaultParams({
            sethtmlData,
            municipalityId,
        });
        htmlRequest.do();
        jsonDataRequest.setDefaultParams({ setjsonData, municipalityId });
        jsonDataRequest.do();


        cIGetRequest.setDefaultParams({
            setCI,
            municipalityId,
        });
        cIGetRequest.do();
        climateDataRequest.setDefaultParams({
            setRealTimeData,
        });
        climateDataRequest.do();
    }, [municipalityId]);


    const sanitizedIncidentList = getSanitizedIncidents(
        incidentList,
        regions,
        hazardTypes,
    );
    const pointFeatureCollectionButwal = incidentPointToGeojson(
        sanitizedIncidentList,
        hazards,
    );


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
            if (incidentList.length > 0
				&& cI.length > 0 && htmlData.length > 0
					 && jsonData.length > 0) {
							 setpending(false);
            }
        }
    }, [cI, htmlData, incidentList, jsonData, pending]);


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
                        leftElement < 5
                            && (
                                <>
                                    <MultiHazardMap
                                        MAINKEYNAME={MAINKEYNAME}

                                        incidentList={pointFeatureCollectionButwal}
                                        populationDensityRange={populationDensityRange[0]}
                                        rightElement={leftElement}
                                        selectedYear={selectedYear}
                                        handleyearClick={handleyearClick}
                                        mapConstants={mapConstants}
                                        expressions={expressions}
                                        clickedItem={clickedIncidentItem}
                                        mapboxStyle={mapBoxStyle[0]}
                                        incidentFilterYear={incidentFilterYear}
                                        handleIncidentChange={handleIncidentChange}
                                        floodHazardLayersArr={floodHazardLayers[0]}
                                        leftElement={leftElement}
                                        CIData={geoJsonCI}
                                        criticalElement={criticalElement}
                                        satelliteImageYears={satelliteImageYears[0]}
                                        boundingBox={bbox}
                                        lng={lng}
                                        lat={lat}
                                        municipalityId={municipalityId}
                                        provinceId={PROVINCEID}
                                        districtId={DISTRICTID}
                                        legendElement={legendElement}
                                        demographicsData={page1Legend3MidPopulationData[0]}
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

                        (leftElement === 0 && legendElement === 'Admin Boundary') && (
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
                (leftElement === 0 && legendElement === 'Population By Ward') && (

                    <Leftpane
                        introHtml={page1TopIntrohtml[0]}
                        page1Legend3InroHtml={page1Legend3TopIntrohtml[0]}
                        populationData={page1Legend3MidPopulationData[0]}
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
                        leftElement={leftElement}
                        incidentData={incidentList}
                        handleIncidentItemClick={handleIncidentItemClick}
                        incidentList={pointFeatureCollectionButwal}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        totalPages={leftelements.length}
                        pagenumber={leftElement + 1}
                        clickedItem={clickedIncidentItem}
                        incidentFilterYear={incidentFilterYear}
                        getIncidentData={setIncidentList}
                        incidentDetailsData={incidentDetailsData}
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
                        introHtml={page3TopIntrohtml[0]}
                        page3Legend1InroHtml={page3Legend1Introhtml[0]}
                        page3Legend2InroHtml={page3Legend2Introhtml[0]}
                        page3Legend3InroHtml={page3Legend3Introhtml[0]}
                        page3Legend4InroHtml={page3Legend4Introhtml[0]}
                        populationDensityRange={populationDensityRange[0]}
                        exposureElementArr={exposureElementsArr}
                        handleCriticalInfra={handleCriticalInfra}
                        leftElement={leftElement}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        totalPages={leftelements.length}
                        pagenumber={leftElement + 1}
                        cI={cI}
                        criticalElement={criticalElement}
                        handleMultipeLegendClicked={handleMultipeLegendClicked}
                        // multipleLegendItem={multipleLegendItem}
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
                        clickedHazardItem={clickedHazardItem}
                        handleMultipleHazardLayer={handleMultipleHazardLayer}
                        handleExposure={handleMultipleExposure}
                        exposureElement={exposureElement}
                        hazardLegendClicked={hazardLegendClickedArr}
                        setActivePage={setActivePage}
                        active={active}
                        hazardLegendClickedArr={hazardLegendClickedArr}
                        setfloodLayer={setfloodLayer}
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
)(Butwal);
