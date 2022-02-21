import { PageState } from './types';

// const maptilerAccessToken = process.env.REACT_APP_MAPTILER_ACCESS_TOKEN;

const getInitialStartDate = (rangeInDays: number) => {
    const today = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - rangeInDays);

    return threeDaysAgo.toISOString();
};

const state: PageState = {
    eventTypes: {},

    hidePopup: false,

    region: {
        adminLevel: undefined,
    },

    filters: {
        region: {},
        hazard: [],
        dataDateRange: {
            rangeInDays: 7,
            startDate: undefined,
            endDate: undefined,
        },
    },

    adminLevelList: [
        {
            id: 0,
            title: 'national',
        },
        {
            id: 1,
            title: 'province',
        },
        {
            id: 2,
            title: 'district',
        },
        {
            id: 3,
            title: 'municipality',
        },
    ],

    provinces: [],
    districts: [],
    municipalities: [],
    wards: [],

    documentCategoryList: [],

    selectedMapStyle: 'mapbox://styles/adityakhatri/cjuck3jrk1gyt1fprrcz8z4f0',
    hazardTypes: {},
    resourceTypeList: [
        {
            id: 1,
            title: 'education',
        },
        {
            id: 2,
            title: 'health',
        },
        {
            id: 3,
            title: 'finance',
        },
        {
            id: 4,
            title: 'governance',
        },
        {
            id: 5,
            title: 'tourism',
        },
        {
            id: 6,
            title: 'cultural',
        },
        {
            id: 7,
            title: 'industry',
        },
        {
            id: 8,
            title: 'communication',
        },
        {
            id: 9,
            title: 'openspace',
        },
        {
            id: 10,
            title: 'communityspace',
        },
        {
            id: 11,
            title: 'helipad',
        },
    ],
    carKeys: [],
    lossList: [],
    countryList: [],

    // Page related

    dashboardPage: {
        eventList: [],
        alertList: [],
        filters: {
            faramValues: {
                dateRange: 7,
            },
            faramErrors: {},
            pristine: true,
        },
    },

    incidentPage: {
        incidentList: [],
        filters: {
            faramValues: {
                dateRange: 7,
            },
            faramErrors: {},
            pristine: true,
        },
    },

    responsePage: {
        resourceList: [],
        inventoryCategoryList: [],
        inventoryItemList: [],
    },

    realTimeMonitoringPage: {
        realTimeRainList: [],
        realTimeRiverList: [],
        realTimeEarthquakeList: [],
        realTimeFireList: [],
        realTimePollutionList: [],
        realTimeSourceList: [
            { id: 3, title: 'Rain' },
            { id: 2, title: 'River' },
        ],
        otherSourceList: [
            { id: 1, title: 'Earthquake' },
            { id: 5, title: 'Air pollution' },
            { id: 4, title: 'Forest Fire' },
            { id: 6, title: 'Streamflow' },
        ],
        filters: {
            faramValues: {
                realtimeSources: [3, 2],
            },
            faramErrors: {},
            pristine: true,
        },
    },

    lossAndDamagePage: {
        lossAndDamageList: [],
        filters: {
            faramValues: {
                metric: 'count',
            },
            faramErrors: {},
            pristine: true,
        },
    },

    projectsProfilePage: {
        filters: {
            faramValues: {
            },
            faramErrors: {},
            pristine: true,
        },
    },

    disasterProfilePage: {
        riskList: [],
        lpGasCookList: [],
    },

    profileContactPage: {
        contactList: [],
        filters: {
            faramValues: {
                drrFocalPersonOnly: false,
            },
            faramErrors: {},
            pristine: true,
        },
    },
    bulletinEditData: {},
    bulletinPage: {
        sitRep: 123,
        incidentSummary: {
            numberOfIncidents: 1,
            numberOfDeath: 5,
            numberOfMissing: 6,
            numberOfInjured: 12,
            estimatedLoss: 50,
            roadBlock: 1,
            cattleLoss: 0,
        },
        peopleLoss: {
            p1: {
                death: 5,
                missing: 6,
                injured: 12,
            },
            p2: {
                death: 0,
                missing: 0,
                injured: 0,
            },
            bagmati: {
                death: 0,
                missing: 0,
                injured: 0,
            },
            gandaki: {
                death: 0,
                missing: 0,
                injured: 0,
            },
            lumbini: {
                death: 0,
                missing: 0,
                injured: 0,
            },
            karnali: {
                death: 0,
                missing: 0,
                injured: 0,
            },
            sudurpaschim: {
                death: 0,
                missing: 0,
                injured: 0,
            },
        },
        hazardWiseLoss: {
            पहिरो: {
                deaths: 0,
                incidents: 0,
            },
            'हुरी बतास': {
                deaths: 0,
                incidents: 0,
            },
            भूकम्प: {
                deaths: 0,
                incidents: 0,
            },
            'हेलिकप्टर दुर्घटना': {
                deaths: 0,
                incidents: 0,
            },
            डढेलो: {
                deaths: 0,
                incidents: 0,
            },
        },
        genderWiseLoss: {
            male: 2,
            female: 3,
            unknown: 0,
        },
        covid24hrsStat: {
            affected: 0,
            femaleAffected: 0,
            maleAffected: 0,
            deaths: 0,
            recovered: 0,
        },
        covidTotalStat: {
            totalAffected: 0,
            totalActive: 0,
            totalRecovered: 0,
            totalDeaths: 0,
        },
        vaccineStat: {
            firstDosage: 0,
            secondDosage: 0,
        },
        covidProvinceWiseTotal: {
            p1: {
                totalAffected: 0,
                totalActive: 0,
                totalDeaths: 0,
            },
            p2: {
                totalAffected: 0,
                totalActive: 0,
                totalDeaths: 0,
            },
            bagmati: {
                totalAffected: 0,
                totalActive: 0,
                totalDeaths: 0,
            },
            gandaki: {
                totalAffected: 0,
                totalActive: 0,
                totalDeaths: 0,
            },
            lumbini: {
                totalAffected: 0,
                totalActive: 0,
                totalDeaths: 0,
            },
            karnali: {
                totalAffected: 0,
                totalActive: 0,
                totalDeaths: 0,
            },
            sudurpaschim: {
                totalAffected: 0,
                totalActive: 0,
                totalDeaths: 0,
            },
        },
        tempMin: 'http://bipaddev.yilab.org.np/media/bulletin/min/sdN1tB.webp',
        tempMax: 'http://bipaddev.yilab.org.np/media/bulletin/max/sdN1tB.webp',
        rainSummaryPic: null,
        maxTempFooter: null,
        minTempFooter: null,
        dailySummary: '',
        feedback: [],
        province: 3,
        district: 27,
        municipality: 27006,
        ward: null,
    },

    epidemicsPage: {
        lossID: null,
        loader: false,
        lossError: '',
        incidentError: '',
        lossPeopleError: '',
        successMessage: '',
        incidentData: [],
        incidentEditData: {},
        incidentUpdateError: '',
        epidemicChartHourlyLoading: false,
        epidemicChartHourlyData: [],
        epidemicChartHourlyError: {},
        epidemicChartDailyLoading: false,
        epidemicChartDailyData: [],
        epidemicChartDailyError: {},
        epidemicChartWeeklyLoading: false,
        epidemicChartWeeklyData: [],
        epidemicChartWeeklyError: {},
        epidemicChartYearlyLoading: false,
        epidemicChartYearlyData: [],
        epidemicChartYearlyError: {},
        epidemicChartMonthlyLoading: false,
        epidemicChartMonthlyData: [],
        epidemicChartMonthlyError: {},
        epidemicTableLoading: false,
        epidemicTableData: [],
        epidemicTableError: {},
        epidemicTotalLoading: false,
        epidemicTotalData: [],
        epidemicTotalError: {},
        incidentCount: null,
    },
};
export default state;
