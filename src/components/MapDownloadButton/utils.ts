import { PageContextProps } from '#components/PageContext';
import { TitleContextProps } from '#components/TitleContext';

interface HazardList {
    id: number;
    title: string;
    type: string;
}

export const HAZARD_LIST: HazardList[] = [
    {
        id: 1,
        title: 'Aircraft Accident',
        type: 'non natural',
    },
    {
        id: 2,
        title: 'Animal Incidents',
        type: 'natural',
    },
    {
        id: 3,
        title: 'Avalanche',
        type: 'natural',
    },
    {
        id: 4,
        title: 'Boat Capsize',
        type: 'non natural',
    },
    {
        id: 5,
        title: 'Bridge Collapse',
        type: 'non natural',
    },
    {
        id: 6,
        title: 'Cold Wave',
        type: 'natural',
    },
    {
        id: 7,
        title: 'Drowning',
        type: 'non natural',
    },
    {
        id: 8,
        title: 'Earthquake',
        type: 'natural',
    },
    {
        id: 9,
        title: 'Epidemic',
        type: 'natural',
    },
    {
        id: 10,
        title: 'Fire',
        type: 'natural',
    },
    {
        id: 11,
        title: 'Flood',
        type: 'natural',
    },
    {
        id: 12,
        title: 'Forest Fire',
        type: 'natural',
    },
    {
        id: 13,
        title: 'Hailstorm',
        type: 'natural',
    },
    {
        id: 14,
        title: 'Heavy Rainfall',
        type: 'natural',
    },
    {
        id: 15,
        title: 'Helicopter Crash',
        type: 'non natural',
    },
    {
        id: 16,
        title: 'High Altitude',
        type: 'non natural',
    },
    {
        id: 17,
        title: 'Landslide',
        type: 'natural',
    },
    {
        id: 18,
        title: 'Other (Natural)',
        type: 'natural',
    },
    {
        id: 19,
        title: 'Rainfall',
        type: 'natural',
    },
    {
        id: 20,
        title: 'Snake Bite',
        type: 'non natural',
    },
    {
        id: 21,
        title: 'Snow Storm',
        type: 'natural',
    },
    {
        id: 22,
        title: 'Storm',
        type: 'natural',
    },
    {
        id: 23,
        title: 'Thunderbolt',
        type: 'natural',
    },
    {
        id: 24,
        title: 'Wind Storm',
        type: 'natural',
    },
    {
        id: 25,
        title: 'Drought',
        type: 'natural',
    },
    {
        id: 26,
        title: 'Glacial lake outburst',
        type: 'natural',
    },
    {
        id: 27,
        title: 'Heat wave',
        type: 'natural',
    },
    {
        id: 28,
        title: 'Inundation',
        type: 'natural',
    },
    {
        id: 29,
        title: 'Soil Erosion',
        type: 'natural',
    },
    {
        id: 30,
        title: 'Volcanic eruption',
        type: 'natural',
    },
    {
        id: 31,
        title: 'Industrial disaster',
        type: 'non natural',
    },
    {
        id: 32,
        title: 'Mine disaster',
        type: 'non natural',
    },
    {
        id: 33,
        title: 'Pandemics',
        type: 'non natural',
    },
    {
        id: 34,
        title: 'Road accident',
        type: 'non natural',
    },
    {
        id: 35,
        title: 'Animal flu',
        type: 'non natural',
    },
    {
        id: 36,
        title: 'Deforestation',
        type: 'non natural',
    },
    {
        id: 37,
        title: 'Environmental pollution',
        type: 'non natural',
    },
    {
        id: 38,
        title: 'Famine',
        type: 'natural',
    },
    {
        id: 39,
        title: 'Food poisoning',
        type: 'non natural',
    },
    {
        id: 40,
        title: 'Gas explosion',
        type: 'non natural',
    },
    {
        id: 41,
        title: 'Leakage (chemical)',
        type: 'non natural',
    },
    {
        id: 42,
        title: 'Leakage (radiation)',
        type: 'non natural',
    },
    {
        id: 43,
        title: 'Leakage (toxic gas)',
        type: 'non natural',
    },
    {
        id: 44,
        title: 'Microorganism attack',
        type: 'non natural',
    },
    {
        id: 45,
        title: 'Others (Non-Natural)',
        type: 'non natural',
    },
    {
        id: 46,
        title: 'Water Accident',
        type: 'non natural',
    },
    {
        id: 47,
        title: 'Response Accident',
        type: 'non natural',
    },
];

const getHazard = (id: number) => HAZARD_LIST.filter(h => h.id === id);

const damageAndLossTitleParser = (
    event: string,
    multipleHazards: boolean,
    regionName: string,
    hazardList: number[],
    startDate: string,
    endDate: string,
): string => {
    const initialString = event === 'estimated Loss (NPR)'
        ? 'Total'
        : 'Total number of';

    let hazardName = '';

    if (!multipleHazards) {
        hazardName = `${getHazard(hazardList[0])[0].title}`;
    }

    return hazardName
        ? `${initialString} ${event} due to ${hazardName} from ${startDate} to ${endDate}, ${regionName}`
        : `${initialString} ${event} from ${startDate} to ${endDate}, ${regionName}`;
};

export const getRouteWiseTitle = (
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
): string => {
    if (pageContext && pageContext.activeRouteDetails) {
        const { name: routeName } = pageContext.activeRouteDetails;

        // Dashboard
        if (routeName === 'dashboard') {
            const { dashboard } = titleContext;
            if (dashboard) {
                return `${dashboard}, ${regionName}`;
            }
        }

        // Incident
        if (routeName === 'incident') {
            const { incident } = titleContext;
            if (incident) {
                return `${incident}, ${regionName}`;
            }
        }

        // Damage and Loss
        if (routeName === 'lossAndDamage') {
            const { damageAndLoss } = titleContext;
            const multipleHazards = hazardList.length > 1 || hazardList.length === 0;
            if (damageAndLoss) {
                const { mainModule, startDate, endDate } = damageAndLoss;
                const capitalizedTitle = mainModule.toUpperCase().trim();
                if (capitalizedTitle === 'INCIDENTS') {
                    // return `Total number of incidents, ${regionName}`;
                    return damageAndLossTitleParser('incidents', multipleHazards, regionName, hazardList, startDate, endDate);
                }
                if (capitalizedTitle === 'PEOPLE DEATH') {
                    return damageAndLossTitleParser('deaths', multipleHazards, regionName, hazardList, startDate, endDate);
                }
                if (capitalizedTitle === 'ESTIMATED LOSS (NPR)') {
                    return damageAndLossTitleParser('estimated Loss (NPR)', multipleHazards, regionName, hazardList, startDate, endDate);
                }
                if (capitalizedTitle === 'INFRASTRUCTURE DESTROYED') {
                    return damageAndLossTitleParser('infrastructure(s) destroyed', multipleHazards, regionName, hazardList, startDate, endDate);
                }
                if (capitalizedTitle === 'LIVESTOCK DESTROYED') {
                    return damageAndLossTitleParser('livestock destroyed', multipleHazards, regionName, hazardList, startDate, endDate);
                }
            }
        }

        // RealTime
        if (routeName === 'realtime') {
            const { realtime } = titleContext;
            const { faramValues } = realtimeFilters;

            const { realtimeSources = [], otherSources = [] } = faramValues;
            const activeLayers = [...realtimeSources, ...otherSources];

            if (activeLayers.length !== 1) {
                return `Realtime, ${regionName}`;
            }

            if (activeLayers[0] === 1) {
                return `Earthquake, ${regionName}`;
            }

            if (activeLayers[0] === 2) {
                return `River Watch, ${regionName}`;
            }

            if (activeLayers[0] === 4) {
                return `Forest Fire, ${regionName}`;
            }

            if (activeLayers[0] === 5) {
                return `Air Quality Index, ${regionName}`;
            }

            if (activeLayers[0] === 6) {
                return `Stream Flow Prediction, ${regionName}`;
            }

            if (activeLayers[0] === 3) {
                if (realtime === 1) {
                    return `1 hour Rain Watch, ${regionName}`;
                }
                if (realtime === 3) {
                    return `3 hours Rain Watch, ${regionName}`;
                }
                if (realtime === 6) {
                    return `6 hours Rain Watch, ${regionName}`;
                }
                if (realtime === 12) {
                    return `12 hours Rain Watch, ${regionName}`;
                }
                if (realtime === 24) {
                    return `24 hours Rain Watch, ${regionName}`;
                }
            }
        }

        // Profile
        if (routeName === 'profile') {
            const { profile } = titleContext;

            if (profile && profile.mainModule) {
                const { mainModule, subModule } = profile;
                if (mainModule === 'Projects') {
                    return `Map showing number of projects in ${regionName}`;
                }
                if (mainModule === 'Summary' && subModule) {
                    if (subModule === 'totalPopulation') {
                        return `Population Distribution Map of ${regionName}`;
                    }
                    if (subModule === 'householdCount') {
                        return `Household Distribution Map of ${regionName}`;
                    }
                    if (subModule === 'literacyRate') {
                        return `Map showing Literacy Rate of ${regionName}`;
                    }
                }
            }
        }

        // Risk Info
        if (routeName === 'riskInfo') {
            const activeLayer = riskInfoActiveLayers[0];
            const appURL = window.location.href;
            const hashIndex = appURL.indexOf('#') + 2;
            const riskInfoSubModule = appURL.substring(hashIndex);

            // RiskInfo Capacity and Resources
            /*
                Since capacity and resource has differenct structure
                compoared to other modules, it is checked first.
            */
            if (riskInfoSubModule === 'capacity-and-resources') {
                const { capacityAndResources: activeResource } = titleContext;
                if (activeResource) {
                    return `Capacity and Resources (${activeResource}), ${regionName}`;
                }
            }

            if (riskInfoActiveLayers.length !== 1) {
                return `RiskInfo, ${regionName}`;
            }

            // RiskInfo - Hazard
            if (riskInfoSubModule === 'hazard') {
                // Risk Info - Hazard
                if (activeLayer.category === 'hazard'
                    && activeLayer.fullName
                    && activeLayer.layername
                ) {
                    const subStringFloodDowri = 'FLOOD_DEPTH';
                    const subStringFloodMeteor = 'FLUVIAL_DEFENDED';
                    const subStringFloodWfp = 'FLOOD INUNDATION';
                    const subStringEarthquakeSeismic = 'SEISMIC HAZARD';
                    const earthquakeTriggeredLandlsideDurham = 'EARTHQUAKE-TRIGGERED LANDSLIDE';
                    const nationwiseLandslideDurham = 'NATIONWIDE LANDSLIDE HAZARD';

                    const layerNameUpperCase = activeLayer.layername.toUpperCase();
                    const fullNameUpperCase = activeLayer.fullName.toUpperCase();

                    // Flood

                    // Flood Hazard - Source: Department of Water Resources and Irrigation (DoWRI)
                    if (layerNameUpperCase.includes(subStringFloodDowri)) {
                        const { fullName } = activeLayer;
                        const [region, period] = fullName.split('/');
                        return `Flood Hazard ${period.trim()} return period, ${region.trim()} River Basin`;
                    }

                    // Flood Hazard - Source: METEOR project
                    if (layerNameUpperCase.includes(subStringFloodMeteor)) {
                        const { fullName } = activeLayer;
                        const [hazard, period] = fullName.split('/');
                        return `${hazard.trim()} ${period.trim()} return period, ${regionName}`;
                    }

                    // Flood Inundation - Source: World Food Programme (WFP) 2019 & 2017
                    if (fullNameUpperCase.includes(subStringFloodWfp)) {
                        const { fullName } = activeLayer;
                        const period = fullName.split('/')[1];
                        return `Flood inundated areas in ${period.trim()}, ${regionName}`;
                    }

                    // Earthquake

                    // Seismic Hazard - Source: METEOR project
                    if (fullNameUpperCase.includes(subStringEarthquakeSeismic)) {
                        const { fullName } = activeLayer;
                        const pga = fullName.split('/')[1];
                        return `${pga.trim()}, ${regionName}`;
                    }

                    // Landslide

                    // Earthquake-triggered Landslide - Source: Durham University
                    if (fullNameUpperCase.includes(earthquakeTriggeredLandlsideDurham)) {
                        const { fullName } = activeLayer;
                        const landslideType = fullName.split('/')[1];
                        return `${landslideType.trim()}, ${regionName}`;
                    }

                    // Nationwide Landslide Hazard - Source: Durham University
                    if (fullNameUpperCase.includes(nationwiseLandslideDurham)) {
                        const { fullName } = activeLayer;
                        const landslideType = fullName.split('/')[1];
                        return `${landslideType.trim().replace('Level', 'Landslide')}, ${regionName}`;
                    }
                }
            }

            // Risk Info - Vulnerability
            if (riskInfoSubModule === 'vulnerability') {
                let vulnerabilityTitle = '';

                // Layers
                const vulnerabilityLayers = [
                    'HDI',
                    'lifeExpectancy',
                    'hpi',
                    'percapita',
                    'remoteness',
                ];
                vulnerabilityLayers.forEach((v) => {
                    if (activeLayer.id === v) {
                        vulnerabilityTitle = activeLayer.layername;
                    }
                });

                // Access to Communication
                const vulnerabilityCommunication = [
                    'radio',
                    'computer',
                    'internet',
                    'telephone',
                    'television',
                    'mobilePhone',
                    'cableTelevision',
                ];

                vulnerabilityCommunication.forEach((v) => {
                    if (activeLayer.id === v) {
                        vulnerabilityTitle = `Access to communication (${activeLayer.layername})`;
                    }
                });

                // Access to Water
                const vulnerabilityWater = [
                    'tapWater',
                    'wellWater',
                    'riverWater',
                    'spoutWater',
                    'othersWater',
                    'coveredWellKuwaWater',
                    'uncoveredWellKuwaWater',
                    'notStatedWater',
                ];

                vulnerabilityWater.forEach((v) => {
                    if (activeLayer.id === v) {
                        vulnerabilityTitle = `Access to water (${activeLayer.layername})`;
                    }
                });

                // Access to Toilet
                const vulnerabilityToilet = [
                    'ordinaryToilet',
                    'flushToilet',
                    'noToiletFacility',
                    'toiletFacilityNotStated',
                ];

                vulnerabilityToilet.forEach((v) => {
                    if (activeLayer.id === v) {
                        vulnerabilityTitle = `Access to toilet (${activeLayer.layername})`;
                    }
                });

                // Education
                const vulnerabilityEducation = [
                    'boysStudent',
                    'totalSchool',
                    'girlsStudent',
                    'totalStudent',
                    'communitySchool',
                    'institutionalSchool',
                ];

                vulnerabilityEducation.forEach((v) => {
                    if (activeLayer.id === v) {
                        vulnerabilityTitle = `Education (${activeLayer.layername})`;
                    }
                });

                if (vulnerabilityTitle) {
                    return `${vulnerabilityTitle}, ${regionName}`;
                }
            }

            // RiskInfo Risk
            if (riskInfoSubModule === 'risk') {
                const { title } = activeLayer;
                // Earthquake
                if (title === 'Earthquake') {
                    return `Earthquake Risk, ${regionName}`;
                }

                // Landslide
                if (title.includes('Landslide')) {
                    return `${title.replace(' level', '')}, ${regionName}`;
                }
            }

            // RiskInfo Climate change
            if (riskInfoSubModule === 'climate-change') {
                const { title, scenarioName, legendTitle } = activeLayer;
                if (title && scenarioName && legendTitle) {
                    let measurement = title.split('/')[1].trim();
                    measurement = measurement.charAt(0).toUpperCase() + measurement.slice(1);
                    const timePeriod = legendTitle.split('\n')[4].trim();

                    if (!timePeriod.includes('Reference period')) {
                        measurement = `Change in ${measurement}`;
                    }
                    return `${measurement} for ${timePeriod} [${scenarioName}], ${regionName}`;
                }
            }
        }
    }
    return `${pageTitle} for ${regionName}`;
};
