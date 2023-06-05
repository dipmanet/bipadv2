/* eslint-disable max-len */
import { populateFormat, breakFormat } from '@togglecorp/fujs';
import { PageContextProps } from '#components/PageContext';
import { TitleContextProps } from '#components/TitleContext';
import { DataDateRangeValueElement } from '#types';
import { pastDaysToDateRange } from '#utils/transformations';

import { convertDateAccToLanguage } from '#utils/common';
import {
    HAZARD_LIST,
    damageAndLossList,
    realtimeList,
    realtimeHourList,
    profileSubmoduleList,
    floodHazardList,
    vulnerabilityLayers,
    vulnerabilityCommunication,
    vulnerabilityWater,
    vulnerabilityToilet,
    vulnerabilityEducation,
} from './constants';
import { RealTimeFilters, ActiveLayer } from './types';

let calculatedSourceTitle = '';
// Util Functions

const getHazard = (id: number) => HAZARD_LIST.filter(h => h.id === id);

const setSimpleTitle = (title: string, regionName: string) => `${title}, ${regionName}`;

const formatDate = (date: Date, mode: string) => (
    populateFormat(breakFormat(mode), date)
        .map((e) => {
            if (e.type === 'date') {
                return e.value;
            }
            if (e.type === 'time') {
                return e.value;
            }
            return e.value;
        })
);

const getStartAndEndDate = (dataDateRange: DataDateRangeValueElement) => {
    let startDate;
    let endDate;
    const mode = 'yyyy-MM-dd';
    const { rangeInDays } = dataDateRange;

    if (rangeInDays !== 'custom') {
        ({ startDate, endDate } = pastDaysToDateRange(rangeInDays));
    } else {
        ({ startDate, endDate } = dataDateRange);
    }
    if (startDate) {
        [startDate] = formatDate(new Date(startDate), mode);
    }
    if (endDate) {
        [endDate] = formatDate(new Date(endDate), mode);
    }
    return [startDate, endDate];
};
/**
 * @param event Name of Damage and Loss event
 * @param multipleHazards True if multiple hazards are selected
 * @param regionName Location Name
 * @param hazardList Static lists of hazards in the filter
 * @param startDate StartDate value
 * @param endDate End Date value
 */
const damageAndLossTitleParser = (
    event: string,
    eventNe: string,
    multipleHazards: boolean,
    regionName: string,
    hazardList: number[],
    startDate: string,
    endDate: string,
    language: string,
): string => {
    const initialStringCheck = (events: string, lang: string) => {
        if (events === 'estimated Loss (NPR)') {
            if (lang === 'en') {
                return 'Total';
            }
            return 'को जम्‍मा संख्या';
        }
        if (lang === 'en') {
            return 'Total number of';
        }
        return 'को कुल संख्या';
    };
    // const initialString = event === 'estimated Loss (NPR)'
    //     ? 'Total'
    //     : 'Total number of';
    const initialString = initialStringCheck(event, language);
    let hazardName = '';

    if (!multipleHazards) {
        hazardName = `${getHazard(hazardList[0])[0].title}`;
    }
    const getHazardCheck = (hazard, lang: string) => {
        if (hazard) {
            if (lang === 'en') {
                return `${initialString} ${event} due to ${hazard} from ${startDate} to ${endDate}, ${regionName}`;
            }
            return `${convertDateAccToLanguage(startDate, lang)} देखि ${convertDateAccToLanguage(endDate, lang)} सम्‍मको ${hazard}कारण घटेको ${eventNe} ${initialString}, ${regionName} `;
        }

        if (lang === 'en') {
            return `${initialString} ${event} from ${startDate} to ${endDate}, ${regionName}`;
        }
        return `${convertDateAccToLanguage(startDate, lang)} देखि ${convertDateAccToLanguage(endDate, lang)} सम्‍मको ${eventNe} ${initialString} ,${regionName}`;
    };

    const hazardValue = getHazardCheck(hazardName, language);

    // return hazardName
    //  ? `${initialString} ${event} due to ${hazardName} from ${startDate} to ${endDate}, ${regionName}`
    //     : `${initialString} ${event} from ${startDate} to ${endDate}, ${regionName}`;
    console.log('This is hazard value', hazardValue);
    return hazardValue;
};

const defineSource = (source: string, setSource?: Function) => {
    if (setSource) {
        setSource(source);
        calculatedSourceTitle = source;
    }
};

/* Route wise functions */

// Dashboard
/**
 * @param titleContext Context for Titles
 * @param regionName Location Name
 */
const setDashBoardTitle = (
    titleContext: TitleContextProps,
    regionName: string,
    dataDateRange: DataDateRangeValueElement,
    language: string,
) => {
    const { dashboard } = titleContext;
    const [startDate, endDate] = getStartAndEndDate(dataDateRange, language);
    const dashboardTitle = language === 'en'
        ? `${dashboard} from ${startDate} to ${endDate}`
        : `${convertDateAccToLanguage(startDate, language)} देखि ${convertDateAccToLanguage(endDate, language)} सम्‍मको ${dashboard}`;
    return dashboard ? setSimpleTitle(dashboardTitle, regionName) : '';
};
// Incidents
/**
 * @param titleContext Context for Titles
 * @param regionName Location Name
 */
const setIncidentTitle = (
    titleContext: TitleContextProps,
    regionName: string,
    dataDateRange: DataDateRangeValueElement,
    language: string,
) => {
    const { incident } = titleContext;
    const [startDate, endDate] = getStartAndEndDate(dataDateRange, language);
    const incidentTitle = language === 'en'
        ? `${incident} from ${startDate} to ${endDate}`
        : `${convertDateAccToLanguage(startDate, language)} देखि ${convertDateAccToLanguage(endDate, language)} सम्‍मको ${incident}`;
    return incident ? setSimpleTitle(incidentTitle, regionName) : '';
};

// Damage And Loss
/**
 * @param titleContext Context for Titles
 * @param hazardList List of hazards from Filter
 * @param regionName Location Name
 */
const setDamageAndLossTitle = (
    titleContext: TitleContextProps,
    hazardList: number[],
    regionName: string,
    language: string,
    dataDateRange: DataDateRangeValueElement,
) => {
    const { damageAndLoss } = titleContext;
    const multipleHazards = hazardList.length > 1 || hazardList.length === 0;
    let damageAndLossTitle = '';

    if (damageAndLoss) {
        const [startDate, endDate] = getStartAndEndDate(dataDateRange, language);
        const { mainModule } = damageAndLoss;
        const capitalizedTitle = mainModule.toUpperCase().trim();
        damageAndLossList.forEach((dll) => {
            const { key, titlePart, titlePartNe } = dll;
            if (capitalizedTitle === key) {
                damageAndLossTitle = damageAndLossTitleParser(
                    titlePart,
                    titlePartNe,
                    multipleHazards,
                    regionName,
                    hazardList,
                    startDate,
                    endDate,
                    language,
                );
            }
        });
    }
    return damageAndLossTitle;
};

// Realtime
/**
 * @param titleContext Context for Titles
 * @param realtimeFilters Realtime filters
 * @param regionName Location Name
 */
const setRealTimeTitle = (
    titleContext: TitleContextProps,
    realtimeFilters: RealTimeFilters,
    regionName: string,
    language: string,
) => {
    const { realtime, setSource } = titleContext;
    const { faramValues } = realtimeFilters;

    const { realtimeSources = [], otherSources = [] } = faramValues;
    const activeLayers = [...realtimeSources, ...otherSources];
    let realtimeTitle = '';
    let sourceTitle = '';
    if (activeLayers.length !== 1) {
        defineSource('', setSource);
        const returnText = language === 'en' ? `Realtime, ${regionName}` : `वास्तविक समय, ${regionName}`;
        return returnText;
    }

    realtimeList.forEach((singleRealtime) => {
        const { key, titlePart, source } = singleRealtime;

        if (activeLayers[0] === key) {
            realtimeTitle = `${titlePart}, ${regionName}`;
            sourceTitle = source;
        }
    });

    // Rain Watch
    if (activeLayers[0] === 3) {
        realtimeHourList.forEach((realtimeHour) => {
            const { key, titlePart } = realtimeHour;

            if (realtime === key) {
                realtimeTitle = `${titlePart}, ${regionName}`;
                sourceTitle = 'Department of Hydrology and Meteorology';
            }
        });
    }
    defineSource(sourceTitle, setSource);
    return realtimeTitle;
};

// Profile
/**
 * @param titleContext Context for Titles
 * @param regionName Location Name
 */
const setProfileTitle = (titleContext: TitleContextProps, regionName: string, language: string) => {
    const { profile, setSource } = titleContext;
    let profileTitle = '';
    if (profile && profile.mainModule) {
        const { mainModule, subModule } = profile;
        if (mainModule === 'Projects') {
            const projectText = language === 'en' ? `Number of Projects, ${regionName}` : `परियोजनाहरूको संख्या, ${regionName}`;
            return projectText;
        }

        if (mainModule === 'Contacts') {
            const contactText = language === 'en' ? `Number of DRR focal person, ${regionName}` : `DRR फोकल व्यक्तिको संख्या, ${regionName}`;
            return contactText;
        }

        if (mainModule === 'Summary' && subModule) {
            profileSubmoduleList.forEach((profileSubmodule) => {
                const { key, titlePart } = profileSubmodule;
                if (subModule === key) {
                    defineSource('CBS, 2011', setSource);
                    profileTitle = `${titlePart}, ${regionName}`;
                }
            });
        }
    }
    return profileTitle;
};

/* Risk Info Submodules */

// Capacity and Resourecs
/**
 * @param titleContext Context for Titles
 * @param regionName Location Name
 */
const setCapacityAndResourcesTitle = (titleContext: TitleContextProps, regionName: string) => {
    const { capacityAndResources: activeResource, setSource } = titleContext;
    if (activeResource) {
        defineSource('OpenStreetMap', setSource);
        return `${activeResource}, ${regionName}`;
    }
    return `Capacity and Resources, ${regionName}`;
};

// Hazard
/**
 *
 * @param activeLayer Currently active riskinfo Layer
 * @param regionName Location Name
 * @param setSource Function to set source
 */
const setRiskInfoHazardTitle = (
    activeLayer: ActiveLayer,
    regionName: string,
    setSource?: Function,
) => {
    // Risk Info - Hazard
    if (activeLayer.category === 'hazard'
        && activeLayer.fullName
        && activeLayer.layername
    ) {
        const { floodDowri,
            floodMeteor,
            floodWfp,
            earthquakeSeismic,
            earthquakeTriggeredLandlsideDurham,
            nationwiseLandslideDurham } = floodHazardList;

        const { fullName, layername } = activeLayer;

        const layerNameUpperCase = layername.toUpperCase();
        const fullNameUpperCase = fullName.toUpperCase();

        // Flood

        // Flood Hazard - Source: Department of Water Resources and Irrigation (DoWRI)
        if (layerNameUpperCase.includes(floodDowri)) {
            const [region, period] = fullName.split('/');
            defineSource('Department of Water Resources and Irrigation (DoWRI)', setSource);
            return `Flood Hazard ${period.trim()}, ${region.trim()} River Basin`;
        }

        // Flood Hazard - Source: METEOR project
        if (layerNameUpperCase.includes(floodMeteor)) {
            const [hazard, period] = fullName.split('/');
            defineSource('METEOR project', setSource);
            return `${hazard.trim()} ${period.trim()}, ${regionName}`;
        }

        // Flood Inundation - Source: World Food Programme (WFP) 2019 & 2017
        if (fullNameUpperCase.includes(floodWfp)) {
            const period = fullName.split('/')[1];
            defineSource('World Food Programme (WFP)', setSource);
            return `Flood inundated areas in ${period.trim()}, ${regionName}`;
        }

        // Earthquake

        // Seismic Hazard - Source: METEOR project
        if (fullNameUpperCase.includes(earthquakeSeismic)) {
            const pga = fullName.split('/')[1];
            defineSource('METEOR project', setSource);
            return `${pga.trim()}, ${regionName}`;
        }

        // Landslide

        // Earthquake-triggered Landslide - Source: Durham University
        if (fullNameUpperCase.includes(earthquakeTriggeredLandlsideDurham)) {
            const landslideType = fullName.split('/')[1];
            defineSource('Durham University', setSource);
            return `${landslideType.trim()}, ${regionName}`;
        }

        // Nationwide Landslide Hazard - Source: Durham University
        if (fullNameUpperCase.includes(nationwiseLandslideDurham)) {
            const landslideType = fullName.split('/')[1];
            defineSource('Durham University', setSource);
            return `${landslideType.trim().replace('Level', 'Landslide').replace('level', 'Landslide')}, ${regionName}`;
        }
    }
    return '';
};

// Vulnerability
/**
 * @param activeLayer Currently active RiskInfo Layer
 * @param regionName Location Name
 * @param setSource Function to set source
 */
const setRiskInfoVulnerabilityTitle = (
    activeLayer: ActiveLayer,
    regionName: string,
    setSource?: Function,
) => {
    let vulnerabilityTitle = '';
    const { id, layername } = activeLayer;
    // Layers
    vulnerabilityLayers.forEach((v) => {
        if (id === 'remoteness') {
            defineSource('Government of Nepal, USAID / Nepal, SEDAC at Columbia University', setSource);
        } else {
            defineSource('National Planning Commission (NPC)', setSource);
        }
        if (id === v) {
            vulnerabilityTitle = layername || '';
        }
    });

    // Access to Communication
    vulnerabilityCommunication.forEach((v) => {
        if (activeLayer.id === v) {
            defineSource('Central Bureau of Statistics (CBS)', setSource);
            vulnerabilityTitle = `Access to communication (${activeLayer.layername})`;
        }
    });

    // Access to Water
    vulnerabilityWater.forEach((v) => {
        if (activeLayer.id === v) {
            defineSource('Central Bureau of Statistics (CBS)', setSource);
            vulnerabilityTitle = `Access to water (${activeLayer.layername})`;
        }
    });

    // Access to Toilet
    vulnerabilityToilet.forEach((v) => {
        if (activeLayer.id === v) {
            defineSource('Central Bureau of Statistics (CBS)', setSource);
            vulnerabilityTitle = `Access to toilet (${activeLayer.layername})`;
        }
    });

    // Education
    vulnerabilityEducation.forEach((v) => {
        if (activeLayer.id === v) {
            defineSource('Central Bureau of Statistics (CBS)', setSource);
            vulnerabilityTitle = `Education (${activeLayer.layername})`;
        }
    });

    if (vulnerabilityTitle) {
        return `${vulnerabilityTitle}, ${regionName}`;
    }
    return '';
};

// Risk
/**
 * @param activeLayer Currently active RiskInfo Layer
 * @param regionName Location name
 * @param setSource Function to set source
 */
const setRiskInfoRiskTitle = (
    activeLayer: ActiveLayer,
    regionName: string,
    setSource?: Function,
) => {
    const { title } = activeLayer;
    // Earthquake
    if (title === 'Earthquake') {
        defineSource('Durham University', setSource);
        return `Earthquake Risk, ${regionName}`;
    }

    // Landslide
    if (title && title.toUpperCase().includes('WARD')) {
        defineSource('Durham University', setSource);
        return `${title}, ${regionName}`;
    }
    if (title && title.toUpperCase().includes('LANDSLIDE')) {
        defineSource('Durham University', setSource);
        return `${title.replace(' level', '')}, ${regionName}`;
    }
    return '';
};

// Climate Change
/**
 * @param activeLayer currently active RiskInfo layer
 * @param regionName Location Name
 * @param setSource Function to set soruce
 */
const setRiskInfoClimateChangeTitle = (
    activeLayer: ActiveLayer,
    regionName: string,
    setSource?: Function,
) => {
    const { title, scenarioName, legendTitle } = activeLayer;
    if (title && scenarioName && legendTitle) {
        let measurement = title.split('/')[1].trim();
        measurement = measurement.charAt(0).toUpperCase() + measurement.slice(1);
        const timePeriod = legendTitle.split('\n')[4].trim();

        defineSource('National Adaptation Plan (NAP) process', setSource);

        if (!timePeriod.includes('Reference period')) {
            measurement = `Change in ${measurement}`;
        }
        return `${measurement} for ${timePeriod} [${scenarioName}], ${regionName}`;
    }
    return '';
};

/* Risk Info Submodules ends */

// DataArchive
/**
 * @param titleContext Context for Titles
 */
const setDataArchiveTitle = (
    titleContext: TitleContextProps,
) => {
    const { dataArchive, setSource } = titleContext;
    if (dataArchive) {
        const { mainModule, location, startDate, endDate } = dataArchive;

        // Earthquake
        if (mainModule === 'Earthquake') {
            defineSource('Department of Mines and Geology', setSource);
            return `Historical Earthquake Data (${startDate} to ${endDate}), ${location}`;
        }
        // Pollution
        if (mainModule === 'Pollution') {
            defineSource('Ministry of Forests and Environment', setSource);
            return `Air Quality Index (AQI), ${location || 'Nepal'}`;
        }
        // Rain
        if (mainModule === 'Rain') {
            defineSource('Department of Hydrology and Meteorology', setSource);
            return `Rain Watch, ${location || 'Nepal'}`;
        }
        // River
        if (mainModule === 'River') {
            defineSource('Department of Hydrology and Meteorology', setSource);
            return `River Watch, ${location || 'Nepal'}`;
        }
    }
    return '';
};

/**
 * @param pageTitle Default Page title
 * @param pageContext Context for the page
 * @param titleContext Context for Titles
 * @param regionName Location Name
 * @param hazardList Selected Hazard List from filters
 * @param realtimeFilters Selected Realtime filters
 * @param riskInfoActiveLayers List of active riskinfo Layers
 */
export const getRouteWiseTitleAndSource = (
    pageTitle: string,
    pageContext: PageContextProps,
    titleContext: TitleContextProps,
    regionName: string,
    hazardList: number[],
    realtimeFilters: {
        faramValues: {
            realtimeSources?: number[];
            otherSources?: number[];
        };
        faramErrors: object;
    },
    riskInfoActiveLayers: any[],
    dataDateRange: DataDateRangeValueElement,
    language: string,
): [string, string] => {
    if (pageContext && pageContext.activeRouteDetails) {
        const { name: routeName } = pageContext.activeRouteDetails;
        const { setSource } = titleContext;
        let title = '';
        // Dashboard
        if (routeName === 'dashboard') {
            defineSource('Realtime Module', setSource);
            title = setDashBoardTitle(titleContext, regionName, dataDateRange, language);
        }

        // Incident
        if (routeName === 'incident') {
            defineSource('Nepal Police, DRR Portal', setSource);
            title = setIncidentTitle(titleContext, regionName, dataDateRange, language);
        }

        // Damage and Loss
        if (routeName === 'lossAndDamage') {
            defineSource('Nepal Police, DRR Portal', setSource);
            title = setDamageAndLossTitle(titleContext, hazardList, regionName, language, dataDateRange);
        }

        // RealTime
        if (routeName === 'realtime') {
            title = setRealTimeTitle(titleContext, realtimeFilters, regionName, language);
        }

        // Profile
        if (routeName === 'profile') {
            title = setProfileTitle(titleContext, regionName, language);
        }

        // Risk Info
        if (routeName === 'riskInfo') {
            const activeLayer = riskInfoActiveLayers[0];
            const appURL = window.location.href;
            const hashIndex = appURL.indexOf('#') + 2;
            const riskInfoSubModule = appURL.substring(hashIndex);

            // RiskInfo Capacity and Resources
            /*
                Since capacity and resource does not use ActiveLayers array,
                it is checked first.
            */
            if (riskInfoSubModule === 'capacity-and-resources') {
                title = setCapacityAndResourcesTitle(titleContext, regionName);
            }

            if (riskInfoActiveLayers.length !== 1
                && riskInfoSubModule !== 'capacity-and-resources'
            ) {
                defineSource('', setSource);
                title = `RiskInfo, ${regionName}`;
                return [title, ''];
            }

            // RiskInfo - Hazard
            if (riskInfoSubModule === 'hazard') {
                title = setRiskInfoHazardTitle(activeLayer, regionName, setSource);
            }

            // Risk Info - Vulnerability
            if (riskInfoSubModule === 'vulnerability') {
                title = setRiskInfoVulnerabilityTitle(activeLayer, regionName, setSource);
            }

            // RiskInfo Risk
            if (riskInfoSubModule === 'risk') {
                title = setRiskInfoRiskTitle(activeLayer, regionName, setSource);
            }

            // RiskInfo Climate change
            if (riskInfoSubModule === 'climate-change') {
                title = setRiskInfoClimateChangeTitle(activeLayer, regionName, setSource);
            }
        }

        if (routeName === 'dataArchive') {
            title = setDataArchiveTitle(titleContext);
        }
        const tempSource = calculatedSourceTitle;
        calculatedSourceTitle = '';
        return [title, tempSource];
    }
    return [`${pageTitle} for ${regionName}`, ''];
};

export const later = 'later';
