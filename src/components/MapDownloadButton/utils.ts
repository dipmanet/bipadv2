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
): string => {
    if (pageContext && pageContext.activeRouteDetails) {
        const { name: routeName } = pageContext.activeRouteDetails;
        // dashboard
        if (routeName === 'dashboard') {
            const { dashboard } = titleContext;
            if (dashboard) {
                return `${dashboard}, ${regionName}`;
            }
        }

        // incident
        if (routeName === 'incident') {
            const { incident } = titleContext;
            if (incident) {
                return `${incident}, ${regionName}`;
            }
        }

        // damageAndLoss
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
    }
    return `${pageTitle} for ${regionName}`;
};
