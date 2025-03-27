/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable no-mixed-operators */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable max-len */
import React from 'react';
import { connect } from 'react-redux';
import {
    _cs,
    doesObjectHaveNoData,
    listToMap,
} from '@togglecorp/fujs';
import {
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Bar,
    LabelList,
    Cell,
    Tooltip,
    CartesianGrid,
    Legend,
} from 'recharts';
import { format } from 'd3-format';
import { extent } from 'd3-array';

import { ReactI18NextChild, Translation } from 'react-i18next';
import memoize from 'memoize-one';
import { compose } from 'redux';
import { navigate } from '@reach/router';
import Icon from '#rscg/Icon';
import CommonMap from '#components/CommonMap';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapState from '#re-map/MapSource/MapState';
import ListView from '#rscv/List/ListView';
import SegmentInput from '#rsci/SegmentInput';
import Button from '#rsca/Button';
import Modal from '#rscv/Modal';
import { mapStyles, mapSources } from '#constants';
import ModalHeader from '#rscv/Modal/Header';

import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import {
    generatePaint,
    generatePaintByQuantile,
    houseHoldSummaryLGProfileData,
    lgProfileAgeGroupData,
    LGProfileAgriculturePracticeData,
    LGProfileAgricultureProductData,
    LGProfileAverageMajorOccupationData,
    LGProfileAverageMonthlyIncomeData,
    LGProfileBuildingFoundationData,
    LGProfileBuildingTypeData,
    LGProfileDisabilityData,
    LGProfileDrinkingWaterData,
    LGProfileEducationLevelData,
    LGProfileHouseHoldData, LGProfileMigrationData,
    LGProfileResidentHouseholdData,
    LGProfileSocialSecurityData,
    literacyRatioLGProfileData,
    sexRatioLGProfileData,
    summationLGProfileAgriculturePracticeData,
    summationLGProfileAgricultureProductData,
    summationLGProfileAverageMonthlyIncomeData,
    summationLGProfileBuildingFoundationData,
    summationLGProfileBuildingTypeData,
    summationLGProfileDisabilityData,
    summationLGProfileDrinkingWaterData,
    SummationLGProfileEducationLevelData,
    summationLGProfileHouseHoldData,
    summationLGProfileMajorOccupationData,
    summationLGProfileMigrationData,
    summationLGProfileResidentHouseholdData,
    summationLGProfileSocialSecurityData,
} from '#utils/domain';

import {
    regionSelector,
    regionNameSelector,
    municipalitiesSelector,
    languageSelector,
    districtsSelector,
    wardsSelector,
    provincesSelector,
    filtersSelector,
} from '#selectors';
import { AppState } from '#store/types';
import {
    Region,
    Municipality,
} from '#store/atom/page/types';
import { KeyValue } from '#types';
import SummaryItem from '#components/SummaryItem';
import ChoroplethLegend from '#components/ChoroplethLegend';
import { saveChart } from '#utils/common';
import { TitleContext, Profile } from '#components/TitleContext';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';

import RadioInput from '#components/RadioInput';
import iconImage from '#resources/icons/Train.svg';
import Positive from '#resources/icons/Positive.svg';
import Negative from '#resources/icons/Negative.svg';
import Positive_Down from '#resources/icons/Positive_Down.svg';
import Positive_Up from '#resources/icons/Positive_Up.svg';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import { getPending, getResponse } from '#utils/request';

import ChoroplethMap from '#components/ChoroplethMap';
import MapTooltip from '#re-map/MapTooltip';
import BarchartVisualization from './BarchartVisualization';
import styles from './styles.scss';
import LGProfileVisualization from './LGProfileVisualization';
import TableDataLGProfile from './TableDataLGProfile';
import TableDataCensus from './TableDataCensus';

interface PropsFromState {
    municipalities: Municipality[];
    regionName: string;
    region: Region;
}
interface AgeGroup {
    '75+': number;
    '00-04': number;
    '05-09': number;
    '10-14': number;
    '15-19': number;
    '20-24': number;
    '25-29': number;
    '30-34': number;
    '35-39': number;
    '40-44': number;
    '45-49': number;
    '50-54': number;
    '55-59': number;
    '60-64': number;
    '65-69': number;
    '70-74': number;
}
interface DemographicsData {
    id: number;
    totalPopulation: number;
    malePopulation: number;
    femalePopulation: number;
    householdCount: number;
    maleLiteracyRate: number;
    femaleLiteracyRate: number;
    literacyRate: number;
    municipality: number;
    ageGroupPopulation: {
        male: AgeGroup;
        female: AgeGroup;
    };
}

interface OwnProps {
    pending: boolean;
    className?: string;
    data?: DemographicsData[];
}
type Props = OwnProps & PropsFromState;
type SummaryData = Omit<DemographicsData, 'id' | 'municipality'>;

const chartMargin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 2,
};

const yAxisWidth = 64;

const keySelector = (d: KeyValue) => d.key;
const mapStateToProps = (state: AppState): PropsFromState => ({
    municipalities: municipalitiesSelector(state),
    region: regionSelector(state),
    regionName: regionNameSelector(state),
    language: languageSelector(state),
    districts: districtsSelector(state),
    wards: wardsSelector(state),
    provinces: provincesSelector(state),
    filters: filtersSelector(state),
});

// const colorGrade = [
//     '#31ad5c',
//     '#94c475',
//     '#d3dba0',
//     '#fff5d8',
//     '#e9bf8c',
//     '#d98452',
//     '#c73c32',
// ];

const colorGrade = [
    '#E5EFFA',
    '#CBE0F6',
    '#B1D1F2',
    '#97C1EE',
    '#7DB2E9',
    '#63A3E5',
    '#4993E1',
];

const attributeList = [
    {
        key: 'totalPopulation',
        title: 'Total population',
        type: 'negative',
    },
    {
        key: 'householdCount',
        title: 'Household count',
        type: 'positive',
    },
    {
        key: 'literacyRate',
        title: 'Literacy rate',
        type: 'positive',
    },
];

const attributes = listToMap(attributeList, d => d.key, d => d);
const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {

    demographicsGetRequest: {
        url: '/demographic/',
        method: methods.GET,
        query: ({ params, props }) => ({
            census_year: params.census_year,

        }),
        onMount: true,
        onSuccess: ({ params, response }) => {
            if (params && params.onSuccess) {
                const demographyData = response as MultiResponse<PageType.Incident>;
                const { onSuccess } = params;
                onSuccess(demographyData.results);
            }
        },

    },
};
const pastDataKeySelector = (d: { key: any }) => d.key;

const pastDataLabelSelector = (d: { label: any }) => d.label;

const pastDateRangeOptions = (language: string) => ([
    {
        label: language === 'en' ? 'Census 2021' : 'जनगणना २०२१',
        key: 1,
    },
    {
        label: language === 'en' ? 'Census 2011' : 'जनगणना २०११',
        key: 2,
    },
    {
        label: language === 'en' ? 'LG Profile' : 'LG प्रोफाइल',
        key: 3,
    },

]);
const NumberWithCommas = (x: number) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const LGProfileCustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        if (payload.length === 2) {
            return (
                <Translation>
                    {
                        t => (
                            <div style={{ backgroundColor: 'white', color: 'black', padding: '8px', border: '1px solid #e1e1e1' }}>
                                <p>
                                    {t('Age Group')}
                                    {' '}
                                    {label}
                                    {' '}
                                    {t('Years')}
                                    {' '}
                                </p>
                                {
                                    payload.map((item: { name: React.Key | null | undefined; value: any }) => (
                                        <p key={item.name}>
                                            {t(item.name.charAt(0).toUpperCase() + item.name.slice(1))}
                                            {' '}
                                            :
                                            {' '}
                                            {NumberWithCommas(item.value)}
                                        </p>
                                    ))
                                }


                            </div>
                        )
                    }
                </Translation>
            );
        }
        return (
            <Translation>
                {
                    t => (
                        <div style={{ backgroundColor: 'white', color: 'black', padding: '8px', border: '1px solid #e1e1e1' }}>
                            <p>
                                {t('Age Group')}
                                {' '}
                                {label}
                                {' '}
                                {t('Years')}
                                {' '}

                            </p>
                            <p>
                                {t('Value')}
                                {' '}
                                :
                                {' '}
                                {NumberWithCommas(payload[0].value)}
                            </p>
                            {payload[0].payload.percent ? (
                                <p>
                                    {t('Percentage')}
                                    {' '}
                                    :
                                    {' '}
                                    {payload[0].payload.percent.toFixed(2)}
                                    %
                                </p>
                            ) : ''}

                        </div>
                    )
                }
            </Translation>

        );
    }


    return null;
};


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        if (payload.length === 2) {
            return (
                <Translation>
                    {
                        t => (
                            <div style={{ backgroundColor: 'white', color: 'black', padding: '8px', border: '1px solid #e1e1e1' }}>
                                <p>
                                    {t('Age Group')}
                                    {' '}
                                    {label}
                                    {' '}
                                    {t('Years')}
                                    {' '}
                                </p>
                                {
                                    payload.map((item: { name: React.Key | null | undefined; value: any }) => (
                                        <p key={item.name}>
                                            {t(item.name.charAt(0).toUpperCase() + item.name.slice(1))}
                                            {' '}
                                            :
                                            {' '}
                                            {NumberWithCommas(item.value)}
                                        </p>

                                    ))
                                }


                            </div>
                        )
                    }
                </Translation>


            );
        }
        return (
            <Translation>
                {
                    t => (
                        <div style={{ backgroundColor: 'white', color: 'black', padding: '8px', border: '1px solid #e1e1e1' }}>
                            <p>{label}</p>
                            <p>
                                {t('Value')}
                                {' '}
                                :
                                {' '}
                                {NumberWithCommas(payload[0].value)}
                            </p>
                            {payload[0].payload.percent ? (
                                <p>
                                    {t('Percentage')}
                                    {' '}
                                    :
                                    {' '}
                                    {payload[0].payload.percent.toFixed(2)}
                                    %
                                </p>
                            ) : ''}

                        </div>
                    )
                }
            </Translation>

        );
    }
    return null;
};


const CustomizedAxisTick = ({ x, y, stroke, payload }) => (
    <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
            {NumberWithCommas(Math.abs(payload.value))}
        </text>
    </g>
);
const renderLegend = (props: { payload: any }) => {
    const { payload } = props;

    return (
        <Translation>
            {
                t => (
                    <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '50px' }}>
                        {
                            payload.map((entry: { color: any; value: string }, index: any) => (
                                <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
                                    <div style={{ height: '15px', width: '15px', backgroundColor: `${entry.color}` }} />
                                    <h2 style={{ marginTop: '5px' }}>{t(entry.value.charAt(0).toUpperCase() + entry.value.slice(1))}</h2>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </Translation>

    );
};
const LGProfileRenderLegend = (props: { payload: any }) => {
    const { payload } = props;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '50px' }}>
            {
                payload.map((entry: { color: any }, index: any) => (
                    <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
                        <div style={{ height: '15px', width: '15px', backgroundColor: `${entry.color}` }} />
                        <Translation>
                            {
                                t => (
                                    <h2 style={{ marginTop: '5px' }}>{t('Age Group')}</h2>
                                )
                            }
                        </Translation>
                    </div>
                ))
            }
        </div>
    );
};
class Demographics extends React.PureComponent<Props> {
    public constructor(props: Props | Readonly<Props>) {
        super(props);
        this.state = {
            selectedAttribute: 'totalPopulation',
            demographyData: [],
            selectedDataType: 1,
            isDataSetClicked: false,
            closedVisualization: true,
            enableProvinceMapFilter: false,
            enableDistrictMapFilter: false,
            enableMunicipalityMapFilter: false,
            resourceLngLat: undefined,
            houseHoldInformation: undefined,
            enableSensitivePopulationDiv: false,
            enableBuildingStructureDiv: false,
            enableEconomicAspectDiv: false,
            selectedFederalName: '',

        };
        const {
            requests: {
                demographicsGetRequest,

            },
        } = this.props;

        demographicsGetRequest.setDefaultParams({
            census_year: '2021',
            onSuccess: this.demographicData,
        });
    }

    public componentDidUpdate(prevProps: { closedVisualization: any }) {
        const { closedVisualization, region, region: { adminLevel, geoarea }, provinces, districts, municipalities } = this.props;
        if (prevProps.closedVisualization !== closedVisualization) {
            this.setState({ closedVisualization });
        }

        if (adminLevel === 3) {
            const selectedFederal = municipalities.find(m => m.id === geoarea).title_en;
            this.setState({ selectedFederalName: selectedFederal });
        } else if (adminLevel === 2) {
            const selectedFederal = districts.find((d: { id: number | undefined }) => d.id === geoarea).title_en;
            this.setState({ selectedFederalName: selectedFederal });
        } else if (adminLevel === 1) {
            const selectedFederal = provinces.find((d: { id: number | undefined }) => d.id === geoarea).title_en;
            this.setState({ selectedFederalName: selectedFederal });
        } else {
            this.setState({ selectedFederalName: 'National' });
        }
    }

    public componentWillUnmount() {
        const { profile, setProfile } = this.context;

        if (setProfile) {
            setProfile((prevProfile: Profile) => {
                if (profile.mainModule === 'Summary' && prevProfile.subModule !== '') {
                    return { ...prevProfile, subModule: '' };
                }
                return prevProfile;
            });
        }
    }


    public static contextType = TitleContext;


    private demographicData = (data: any) => {
        const { handleStoreDemographyData } = this.props;
        handleStoreDemographyData(data);
        this.setState({ demographyData: data });
    }

    private handleSaveClick = (id: string) => {
        saveChart(id, id);
        // saveChart('polulation', 'population');
        // saveChart('literacy', 'literacy');
        // saveChart('agegroup', 'agegroup');
        // saveChart('household', 'household');
    }

    private getPopulationData = (data: DemographicsData[], region: Region) => {
        let filteredData = data.map(i => ({
            ...i,
            changed_malePopulation: i.changes ? i.changes.malePopulation : 0,
            changed_femalePopulation: i.changes ? i.changes.femalePopulation : 0,
            changed_literacyRate: i.changes ? i.changes.literacyRate : 0,
            changed_householdCount: i.changes ? i.changes.householdCount : 0,
        }));
        if (!doesObjectHaveNoData(region)) {
            const { adminLevel, geoarea } = region;
            const { municipalities } = this.props;
            let selectedMunicipalities: number[] = [];
            if (adminLevel === 1) {
                selectedMunicipalities = municipalities
                    .filter(v => v.province === geoarea)
                    .map(v => v.id);
            } else if (adminLevel === 2) {
                selectedMunicipalities = municipalities
                    .filter(v => v.district === geoarea)
                    .map(v => v.id);
            } else if (adminLevel === 3) {
                selectedMunicipalities = municipalities
                    .filter(v => v.id === geoarea)
                    .map(v => v.id);
            }
            filteredData = data.filter(d => selectedMunicipalities.includes(d.municipality));
        }

        const demographics = filteredData.reduce((acc, value, i) => {
            const {
                changed_malePopulation = 0,
                changed_femalePopulation = 0,
                changed_literacyRate = 0,
                changed_householdCount = 0,
                totalPopulation = 0,
                malePopulation = 0,
                femalePopulation = 0,
                householdCount = 0,
                literacyRate = 0,
                maleLiteracyRate = 0,
                femaleLiteracyRate = 0,
                ageGroupPopulation = {
                    male: {},
                    female: {},
                },
            } = value;
            acc.changed_malePopulation += changed_malePopulation;
            acc.changed_femalePopulation += changed_femalePopulation;
            acc.changed_literacyRate += changed_literacyRate;
            acc.changed_householdCount += changed_householdCount;
            acc.totalPopulation += totalPopulation;
            acc.malePopulation += malePopulation;
            acc.femalePopulation += femalePopulation;
            acc.householdCount += householdCount;
            acc.literacyRate += (literacyRate - acc.literacyRate) / (i + 1);
            acc.maleLiteracyRate += (maleLiteracyRate - acc.maleLiteracyRate) / (i + 1);
            acc.femaleLiteracyRate += (femaleLiteracyRate - acc.femaleLiteracyRate) / (i + 1);
            Object.entries(ageGroupPopulation.male).forEach(([key, count]) => {
                const { ageGroupPopulation: { male } } = acc;
                male[key as keyof AgeGroup] += count;
            });
            Object.entries(ageGroupPopulation.female).forEach(([key, count]) => {
                const { ageGroupPopulation: { female } } = acc;
                female[key as keyof AgeGroup] += count;
            });

            return acc;
        }, {
            changed_malePopulation: 0,
            changed_femalePopulation: 0,
            changed_literacyRate: 0,
            changed_householdCount: 0,
            totalPopulation: 0,
            malePopulation: 0,
            femalePopulation: 0,
            householdCount: 0,
            literacyRate: 0,
            maleLiteracyRate: 0,
            femaleLiteracyRate: 0,
            ageGroupPopulation: {
                male: {
                    '00-04': 0,
                    '05-09': 0,
                    '10-14': 0,
                    '15-19': 0,
                    '20-24': 0,
                    '25-29': 0,
                    '30-34': 0,
                    '35-39': 0,
                    '40-44': 0,
                    '45-49': 0,
                    '50-54': 0,
                    '55-59': 0,
                    '60-64': 0,
                    '65-69': 0,
                    '70-74': 0,
                    '75+': 0,
                },
                female: {
                    '00-04': 0,
                    '05-09': 0,
                    '10-14': 0,
                    '15-19': 0,
                    '20-24': 0,
                    '25-29': 0,
                    '30-34': 0,
                    '35-39': 0,
                    '40-44': 0,
                    '45-49': 0,
                    '50-54': 0,
                    '55-59': 0,
                    '60-64': 0,
                    '65-69': 0,
                    '70-74': 0,
                    '75+': 0,
                },
            },
        });

        return demographics;
    }

    private getPopulationSummary = (data: SummaryData) => {
        const { totalPopulation, malePopulation, femalePopulation, changed_malePopulation,
            changed_femalePopulation } = data;
        const { language: { language } } = this.props;
        const changed_total_population = changed_malePopulation + changed_femalePopulation;
        return ([{
            key: 'changed_total_population',
            label: language === 'en' ? 'Changed Total Population' : 'कुल जनसंख्या परिवर्तन',
            value: changed_total_population,
        },
        {
            key: 'totalPopulation',
            label: language === 'en' ? 'Total Population' : 'कुल जनसंख्या',
            value: totalPopulation,
        },
        {
            key: 'malePopulation',
            label: language === 'en' ? 'Male' : 'पुरुष',
            value: malePopulation,
            color: '#2A7BBB',
            percent: Number(((malePopulation / totalPopulation) * 100).toFixed(2)),
        },
        {
            key: 'femalePopulation',
            label: language === 'en' ? 'Female' : 'महिला',
            value: femalePopulation,
            color: '#83A4D3',
            percent: Number(((femalePopulation / totalPopulation) * 100).toFixed(2)),
        },
        ]);
    }

    private getGeojson = memoize((resourceList: PageType.Resource[]) => {
        const geojson = {
            type: 'FeatureCollection',
            features: resourceList.map(r => ({
                type: 'Feature',
                geometry: r.location,
                properties: r,
            })),
        };

        return geojson;
    })

    private getLiteracySummary = (data: SummaryData) => {
        const { literacyRate, maleLiteracyRate, femaleLiteracyRate, changed_literacyRate } = data;
        const { language: { language }, data: overallData } = this.props;
        const overall_changed_literacy_rate = changed_literacyRate / overallData.length;
        return ([
            {
                key: 'changed_literacyRate',
                label: language === 'en' ? 'Changed Literacy Rate' : 'परिबर्तन साक्षरता दर',
                value: Number(overall_changed_literacy_rate.toFixed(2)),
            },
            {
                key: 'literacyRate',
                label: language === 'en' ? 'Literacy Rate' : 'साक्षरता दर',
                value: Number(literacyRate.toFixed(2)),
            },
            {
                key: 'maleLiteracyRate',
                label: language === 'en' ? 'Male' : 'पुरुष',
                color: '#2A7BBB',
                value: Number(maleLiteracyRate.toFixed(2)),
            },
            {
                key: 'femaleLiteracyRate',
                label: language === 'en' ? 'Female' : 'महिला',
                color: '#83A4D3',
                value: Number(femaleLiteracyRate.toFixed(2)),

            },
        ]);
    }

    private getHouseholdSummary = (data: SummaryData) => {
        const { totalPopulation, householdCount, changed_householdCount } = data;
        const { language: { language } } = this.props;
        return ({
            changed_householdCount: {
                key: 'changed_householdCount',
                label: language === 'en' ? 'Changed Household Count' : 'परिवर्तन घरपरिवार गणना',
                value: changed_householdCount,
                color: '#2A7BBB',
            },
            householdSummary: [

                {
                    key: 'totalPopulation',
                    label: language === 'en' ? 'Total Population' : 'कुल जनसंख्या',
                    value: totalPopulation,
                    color: '#2A7BBB',
                },
                {
                    key: 'householdCount',
                    label: language === 'en' ? 'Household Count' : 'घरपरिवार गणना',
                    value: householdCount,
                    color: '#83A4D3',
                },
            ],
        }

        );
    }

    private getAgeGroupSummary = (data: SummaryData) => {
        const { ageGroupPopulation: { male, female } } = data;

        const keys = Object.keys(male);
        return keys.map(v => (
            {
                key: v,
                label: v,
                value: male[v as keyof AgeGroup] + female[v as keyof AgeGroup],
                male: male[v as keyof AgeGroup],
                female: (female[v as keyof AgeGroup]),
                femaleForPyramidGraphVisualization: -(female[v as keyof AgeGroup]),
                malePercentage: Number((((male[v as keyof AgeGroup]) / (male[v as keyof AgeGroup] + female[v as keyof AgeGroup])) * 100).toFixed(2)),
                femalePercentage: -(Number((((female[v as keyof AgeGroup]) / (male[v as keyof AgeGroup] + female[v as keyof AgeGroup])) * 100).toFixed(2))),
            }
        ));
    }

    private rendererParams = (_: string, data: KeyValue) => ({ data });

    private handleAttributeSelectInputChange = (selectedAttribute: any) => {
        this.setState({ selectedAttribute });
    }

    private getMapState = (data: any[], selectedAttribute: string | number) => {
        const { wards, region: { adminLevel, geoarea }, municipalities, districts, provinces } = this.props;
        if (adminLevel === 3) {
            const filteredWardList = wards.filter((i: { municipality: number | undefined }) => i.municipality === geoarea);
            const value = data.find((d: { municipality: number | undefined }) => d.municipality === geoarea);

            const mapState = filteredWardList.map((i: { id: any }) => ({
                id: i.id,
                value: value[selectedAttribute],
            }));

            return mapState;
        }
        if (adminLevel === 2) {
            const mapState = data.map((d: { [x: string]: string | number; municipality: any }) => ({
                id: d.municipality,
                value: +d[selectedAttribute] || 0,
            }));

            return mapState;
        }

        if (adminLevel === 1) {
            const selectedProvinceMunicipalities = districts.map((m: { id: number }) => {
                const filtered_municipality = municipalities.filter(d => d.district === m.id);
                return filtered_municipality;
            });
            const districtWiseMuniList = selectedProvinceMunicipalities.map((mun: any[]) => {
                const finaldata = mun.map((dat: { id: any; district: any }) => {
                    const datas = data.filter((itm: { municipality: any }) => itm.municipality === dat.id)[0];

                    return ({ ...datas, district: dat.district });
                });
                return finaldata;
            });

            const finalsummationData = districtWiseMuniList.map((mun: any[]) => {
                const femaleLiteracyRate = ((mun.reduce((acc: any, currValue: { femaleLiteracyRate: any }) => (acc + currValue.femaleLiteracyRate ? currValue.femaleLiteracyRate : 0), 0)) / mun.length).toFixed(2);
                const femalePopulation = mun.reduce((acc: any, currValue: { femalePopulation: any }) => (acc + currValue.femalePopulation ? currValue.femalePopulation : 0), 0);
                const householdCount = mun.reduce((acc: any, currValue: { householdCount: any }) => (acc + currValue.householdCount ? currValue.householdCount : 0), 0);
                const literacyRate = ((mun.reduce((acc: any, currValue: { literacyRate: any }) => (acc + currValue.literacyRate ? currValue.literacyRate : 0), 0)) / mun.length).toFixed(2);
                const maleLiteracyRate = ((mun.reduce((acc: any, currValue: { maleLiteracyRate: any }) => (acc + currValue.maleLiteracyRate ? currValue.maleLiteracyRate : 0), 0)) / mun.length).toFixed(2);
                const malePopulation = mun.reduce((acc: any, currValue: { malePopulation: any }) => (acc + currValue.malePopulation ? currValue.malePopulation : 0), 0);
                const totalPopulation = mun.reduce((acc: any, currValue: { totalPopulation: any }) => (acc + currValue.totalPopulation ? currValue.totalPopulation : 0), 0);
                const district = mun.reduce((acc: any, currValue: { district: any }) => currValue.district, 0);
                return ({
                    femaleLiteracyRate,
                    femalePopulation,
                    householdCount,
                    literacyRate,
                    maleLiteracyRate,
                    malePopulation,
                    totalPopulation,
                    district,
                });
            });


            const mapState = finalsummationData.map((d: { [x: string]: string | number; district: any }) => ({
                id: d.district,
                value: +d[selectedAttribute] || 0,
            }));

            return mapState;
        }
        const selectedProvinceMunicipalities = provinces.map((m: { id: number }) => {
            const filtered_municipality = municipalities.filter(d => d.province === m.id);
            return filtered_municipality;
        });


        const provinceWiseMuniList = selectedProvinceMunicipalities.map((mun: any[]) => {
            const finaldata = mun.map((dat) => {
                const datas = data.filter((itm: { municipality: any }) => itm.municipality === dat.id)[0];
                if (datas) {
                    return ({ ...datas, district: dat.id, province: dat.province });
                }
            });
            return finaldata;
        });
        const filtered_undefined_array = provinceWiseMuniList.map(d => d.filter(x => x !== undefined));

        const finalsummationDataProvince = filtered_undefined_array.map((mun: any[]) => {
            const femaleLiteracyRate = ((mun.reduce((acc: any, currValue: { femaleLiteracyRate: any }) => (acc + currValue.femaleLiteracyRate), 0)) / mun.length).toFixed(2);
            const femalePopulation = mun.reduce((acc: any, currValue: { femalePopulation: any }) => (acc + currValue.femalePopulation), 0);
            const householdCount = mun.reduce((acc: any, currValue: { householdCount: any }) => (acc + currValue.householdCount), 0);
            const literacyRate = ((mun.reduce((acc: any, currValue: { literacyRate: any }) => (acc + currValue.literacyRate), 0)) / mun.length).toFixed(2);
            const maleLiteracyRate = ((mun.reduce((acc: any, currValue: { maleLiteracyRate: any }) => (acc + currValue.maleLiteracyRate), 0)) / mun.length).toFixed(2);
            const malePopulation = mun.reduce((acc: any, currValue: { malePopulation: any }) => (acc + currValue.malePopulation), 0);
            const totalPopulation = mun.reduce((acc: any, currValue: { totalPopulation: any }) => (acc + currValue.totalPopulation), 0);
            const province = mun.reduce((acc: any, currValue: { province: any }) => currValue.province, 0);
            return ({
                femaleLiteracyRate,
                femalePopulation,
                householdCount,
                literacyRate,
                maleLiteracyRate,
                malePopulation,
                totalPopulation,
                province,
            });
        });

        // const finalProvinceWiseSummationData =

        const mapState = finalsummationDataProvince.map((d: { [x: string]: string | number; district: any }) => ({
            id: d.province,
            value: +d[selectedAttribute] || 0,
        }));

        return mapState;
    }

    private handleCloseVisualization = () => {
        const { handleCloseVisualizationOnModalCloseClick } = this.props;
        this.setState({ closedVisualization: true });
        handleCloseVisualizationOnModalCloseClick(true);
    }

    private handleResourceClick = (feature: unknown, lngLat: [number, number]) => {
        const { properties } = feature;
        this.setState({ resourceLngLat: lngLat });
        this.setState({
            houseHoldInformation: properties,
        });
        // const { properties: { id, title, description, ward, resourceType, point } } = feature;
        // const { coordinates } = JSON.parse(point);
        // const { map } = this.context;

        // if (coordinates && map) {
        //     map.flyTo({
        //         center: coordinates,
        //         // zoom: 10,
        //     });
        // }

        // const {
        //     requests: {
        //         resourceDetailGetRequest,
        //     }, setResourceId,
        // } = this.props;

        // if (!id) {
        //     return;
        // }
        // setResourceId(id);
        // resourceDetailGetRequest.do({
        //     resourceId: id,
        // });

        // this.setState({
        //     resourceLngLat: coordinates,
        //     resourceInfo: {
        //         id,
        //         title,
        //         description,
        //         ward,
        //         resourceType,
        //         point,
        //     },
        // });
    }

    private handleTooltipClose = () => {
        this.setState({
            resourceLngLat: undefined,

        });
    }

    private handleRadioButtonClick = (e: any) => {
        const { requests: { demographicsGetRequest } } = this.props;

        this.setState({ selectedDataType: e });
        if (e === 1 || e === 2) {
            demographicsGetRequest.do({
                census_year: e === 1 ? '2021' : '2011',
                onSuccess: this.demographicData,
            });
        }
    }


    public render() {
        const {
            pending,
            className,
            data = [],
            regionName,
            region,
            language: { language },
            region: {
                adminLevel, geoarea,
            },
            requests,
            lgProfileData,
            enableProvinceMapFilter,
            enableDistrictMapFilter,
            enableMunicipalityMapFilter,
            districts,
            municipalities,
            LGProfilehouseHoldData,
            lgProfileWardLevelData, filters,

        } = this.props;

        const { demographyData, resourceLngLat, houseHoldInformation } = this.state;


        const { selectedAttribute, selectedDataType,
            isDataSetClicked, closedVisualization,
            enableEconomicAspectDiv,
            enableBuildingStructureDiv,
            enableSensitivePopulationDiv,
            selectedFederalName } = this.state;


        const mapState = this.getMapState(data, selectedAttribute);

        const [min, max] = extent(mapState, d => d.value);
        const colors = attributes[selectedAttribute].type === 'positive' ? [...colorGrade].reverse() : [...colorGrade];
        const specificData: number[] = mapState.map((d: { value: any }) => d.value || 0);

        // const { paint, legend } = generatePaint(colors, min, max);
        const { paint, legend, legendPaint } = generatePaintByQuantile(
            colors, min, max, specificData, colorGrade.length, adminLevel,
        );

        const demographics = this.getPopulationData(data, region);


        const populationSummary = this.getPopulationSummary(demographics);

        const sexRatio = populationSummary
            .filter(v => ['malePopulation', 'femalePopulation'].includes(v.key));
        const sexRatioTotalPopulationLGProfile = lgProfileData.gender.male + lgProfileData.gender.female + lgProfileData.gender.other;
        const sexRatioLGProfile = sexRatioLGProfileData(lgProfileData, sexRatioTotalPopulationLGProfile, language);
        const literatePeopleTotalPopulationLGProfile = lgProfileData.literacyRate.male + lgProfileData.literacyRate.female + lgProfileData.literacyRate.other;
        const literacyRateLGProfile = (literatePeopleTotalPopulationLGProfile / sexRatioTotalPopulationLGProfile) * 100;
        const literacyRatioLGProfile = literacyRatioLGProfileData(lgProfileData, literatePeopleTotalPopulationLGProfile, language);
        const houseHoldSummaryLGProfile = houseHoldSummaryLGProfileData(lgProfileData, sexRatioTotalPopulationLGProfile, language);

        const finalSexRatio = [{ label: 'genderRatio', male: sexRatio.find(d => d.label === 'Male' || d.label === 'पुरुष').value, female: sexRatio.find(d => d.label === 'Female' || d.label === 'महिला').value }];
        const finalSexRatioPercentage = [{ male: sexRatio.find(d => d.label === 'Male' || d.label === 'पुरुष').percent, female: sexRatio.find(d => d.label === 'Female' || d.label === 'महिला').percent }];
        const literacySummary = this.getLiteracySummary(demographics);
        const literacyRatio = literacySummary
            .filter(v => ['maleLiteracyRate', 'femaleLiteracyRate'].includes(v.key));
        const finalLiteracyRate = [{ label: 'literacyRate', male: literacyRatio.find(d => d.label === 'Male' || d.label === 'पुरुष').value, female: literacyRatio.find(d => d.label === 'Female' || d.label === 'महिला').value }];

        const householdSummary = this.getHouseholdSummary(demographics);

        const finalHouseholdSummary = [{ label: 'houseHoldInfo', totalPopulation: householdSummary.householdSummary.find(d => d.key === 'totalPopulation').value, householdCount: householdSummary.householdSummary.find(d => d.key === 'householdCount').value }];
        const ageGroupSummary = this.getAgeGroupSummary(demographics);
        const title = `${regionName}`;

        const { profile, setProfile } = this.context;
        const visibleLayout = {
            visibility: 'visible',
        };
        const noneLayout = {
            visibility: 'none',
        };

        const LGProfilehouseHold = this.getGeojson(LGProfilehouseHoldData);

        const Tool = (datas: any) => (
            <>
                <h3 style={{
                    fontSize: '12px',
                    margin: 0,
                    padding: '10px 20px 0px 20px',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                }}
                >
                    {`${language === 'en' ? datas.feature.properties.title_en : datas.feature.properties.title_ne}`}

                </h3>

                <p style={{
                    margin: 0,
                    padding: '0 20px 10px 20px',
                    fontSize: '12px',
                    textAlign: 'center',
                }}
                >
                    {
                        language === 'en'
                            ? `Population: ${NumberWithCommas(datas.feature.state.value)}`
                            : `जनसंख्या: ${NumberWithCommas(datas.feature.state.value)}`
                    }
                </p>


            </>

        );
        const dateRangeOption = region && region.adminLevel === 3 ? pastDateRangeOptions(language) : pastDateRangeOptions(language).filter(i => i.key !== 3);
        if (setProfile) {
            setProfile((prevProfile: Profile) => {
                if (profile.mainModule === 'Summary' && prevProfile.subModule !== selectedAttribute) {
                    return { ...prevProfile, subModule: selectedAttribute };
                }
                return prevProfile;
            });
        }
        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 10,
        };
        const majorOccupationList = houseHoldInformation && houseHoldInformation.majorOccupations && JSON.parse(houseHoldInformation.majorOccupations);
        const supportingOccupationList = houseHoldInformation && houseHoldInformation.supportingOccupations && JSON.parse(houseHoldInformation.supportingOccupations);
        const lgProfileAgeGroup = lgProfileData && lgProfileAgeGroupData(lgProfileData);

        const filteredLGProfileAgeGroup = lgProfileAgeGroup && lgProfileAgeGroup.filter(i => i.value !== 0);
        const SummationLGProfileEducationLevel = lgProfileData && SummationLGProfileEducationLevelData(lgProfileData);

        const LGProfileEducationLevel = lgProfileData && LGProfileEducationLevelData(lgProfileData, SummationLGProfileEducationLevel, language);
        const filteredLGProfileEducationLevel = LGProfileEducationLevel.filter(i => i.value !== 0);
        const summationLGProfileMigration = summationLGProfileMigrationData(lgProfileData);

        const LGProfileMigration = LGProfileMigrationData(lgProfileData, summationLGProfileMigration, language);
        const filteredLGProfileMigration = LGProfileMigration.filter(i => i.value !== 0);


        const summationLGProfileSocialSecurity = summationLGProfileSocialSecurityData(lgProfileData);

        const LGProfileSocialSecurity = LGProfileSocialSecurityData(lgProfileData, summationLGProfileSocialSecurity, language);
        const filteredLGProfileSocialSecurity = LGProfileSocialSecurity.filter(i => i.value !== 0);


        const summationLGProfileDisability = summationLGProfileDisabilityData(lgProfileData);
        const LGProfileDisability = LGProfileDisabilityData(lgProfileData, summationLGProfileDisability, language);
        const filteredLGProfileDisability = LGProfileDisability.filter(i => i.value !== 0);
        const summationLGProfileHouseHold = summationLGProfileHouseHoldData(lgProfileData);

        const LGProfileHouseHold = LGProfileHouseHoldData(lgProfileData, summationLGProfileHouseHold, language);
        const filteredLGProfileHouseHold = LGProfileHouseHold.filter(i => i.value !== 0);

        const summationLGProfileAverageMonthlyIncome = summationLGProfileAverageMonthlyIncomeData(lgProfileData);

        const LGProfileAverageMonthlyIncome = LGProfileAverageMonthlyIncomeData(lgProfileData, summationLGProfileAverageMonthlyIncome, language);
        const filteredLGProfileAverageMonthlyIncome = LGProfileAverageMonthlyIncome.filter(i => i.value !== 0);

        const summationLGProfileMajorOccupation = summationLGProfileMajorOccupationData(lgProfileData);

        const LGProfileAverageMajorOccupation = LGProfileAverageMajorOccupationData(lgProfileData, summationLGProfileMajorOccupation, language);
        const filteredLGProfileAverageMajorOccupation = LGProfileAverageMajorOccupation.filter(i => i.value !== 0);
        const summationLGProfileDrinkingWater = summationLGProfileDrinkingWaterData(lgProfileData);


        const LGProfileDrinkingWater = LGProfileDrinkingWaterData(lgProfileData, summationLGProfileDrinkingWater, language);
        const filteredLGProfileDrinkingWater = LGProfileDrinkingWater.filter(i => i.value !== 0);
        const summationLGProfileResidentHousehold = summationLGProfileResidentHouseholdData(lgProfileData);

        const LGProfileResidentHousehold = LGProfileResidentHouseholdData(lgProfileData, summationLGProfileResidentHousehold);
        const filteredLGProfileResidentHousehold = LGProfileResidentHousehold.filter(i => i.value !== 0);
        const summationLGProfileAgriculturePractice = summationLGProfileAgriculturePracticeData(lgProfileData);
        const LGProfileAgriculturePractice = LGProfileAgriculturePracticeData(lgProfileData, summationLGProfileAgriculturePractice, language);
        const filteredLGProfileAgriculturePractice = LGProfileAgriculturePractice.filter(i => i.value !== 0);
        const summationLGProfileAgricultureProduct = summationLGProfileAgricultureProductData(lgProfileData);
        const LGProfileAgricultureProduct = LGProfileAgricultureProductData(lgProfileData, summationLGProfileAgricultureProduct, language);
        const filteredLGProfileAgricultureProduct = LGProfileAgricultureProduct.filter(i => i.value !== 0);
        const summationLGProfileBuildingType = summationLGProfileBuildingTypeData(lgProfileData);
        const LGProfileBuildingType = LGProfileBuildingTypeData(lgProfileData, summationLGProfileBuildingType, language);
        const filteredLGProfileBuildingType = LGProfileBuildingType.filter(i => i.value !== 0);
        const summationLGProfileBuildingFoundation = summationLGProfileBuildingFoundationData(lgProfileData);
        const LGProfileBuildingFoundation = LGProfileBuildingFoundationData(lgProfileData, summationLGProfileBuildingFoundation, language);
        const filteredLGProfileBuildingFoundation = LGProfileBuildingFoundation.filter(i => i.value !== 0);
        const disablestats = houseHoldInformation && JSON.parse(houseHoldInformation.disabilityStat);
        const totalDisableCount = disablestats && disablestats.length ? disablestats.reduce((total: any, currentValue: { totalPeople: any }) => total + currentValue.totalPeople || 0, 0) : '-';


        return (
            <>
                {!closedVisualization
                    ? (
                        <Modal className={styles.contactFormModal}>

                            <Translation>
                                {
                                    t => (
                                        <ModalBody className={
                                            _cs(styles.modalBody, language === 'np' && styles.languageFont)
                                        }
                                        >


                                            <div className={styles.header}>
                                                <div className={styles.headingCategories}>
                                                    <div
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={undefined}
                                                        className={!isDataSetClicked ? styles.visualization : ''}
                                                        onClick={() => this.setState({ isDataSetClicked: false })}
                                                    >
                                                        <h2>{t('VISUALIZATION')}</h2>
                                                    </div>
                                                    <div
                                                        style={{ marginLeft: '30px' }}
                                                        role="button"
                                                        tabIndex={0}
                                                        className={isDataSetClicked ? styles.visualization : ''}
                                                        onKeyDown={undefined}
                                                        onClick={() => this.setState({ isDataSetClicked: true })}
                                                    >
                                                        <h2>{t('DATASET')}</h2>
                                                    </div>

                                                </div>

                                                <DangerButton
                                                    transparent
                                                    iconName="close"
                                                    // onClick={() => closeVisualization(false,
                                                    //                 checkedCategory, resourceType, level, lvl2catName, typeName)}
                                                    onClick={this.handleCloseVisualization}
                                                    title={t('Close Modal')}
                                                    className={styles.closeButton}
                                                />
                                                {' '}

                                            </div>
                                            <div className={styles.categoryName}>
                                                <div className={styles.categoryLogo}>
                                                    {selectedDataType !== 3 ? (
                                                        <ScalableVectorGraphics
                                                            className={styles.categoryLogoIcon}

                                                            src={iconImage}
                                                        />
                                                    ) : ''
                                                    }

                                                    <h3>{selectedDataType === 1 ? t('Demography (Census 2021)') : selectedDataType === 2 ? t('Demography (Census 2011)') : ''}</h3>
                                                </div>

                                            </div>
                                            {selectedDataType !== 3 ? isDataSetClicked
                                                ? (
                                                    <TableDataCensus
                                                        population={sexRatio}
                                                        literacy={literacyRatio}
                                                        ageGroup={ageGroupSummary}
                                                        householdSummary={householdSummary.householdSummary}
                                                        selectedFederalName={selectedFederalName}
                                                        language={language}
                                                    />
                                                )
                                                : (
                                                    <div>
                                                        <div className={styles.barChartSection}>

                                                            <div className={styles.percentageValue}>
                                                                {/* <h1>Education Institution</h1> */}

                                                                {
                                                                    language === 'en'
                                                                        ? (
                                                                            <h1>
                                                                                {sexRatio.sort((a, b) => b.percent - a.percent)[0].percent}
                                                                                %
                                                                            </h1>
                                                                        )
                                                                        : (
                                                                            <h1>
                                                                                कुल जनसंख्यामा
                                                                                {' '}
                                                                                {sexRatio.sort((a, b) => b.percent - a.percent)[0].percent}
                                                                                %
                                                                            </h1>
                                                                        )

                                                                }


                                                                <>
                                                                    {
                                                                        language === 'en'
                                                                            ? (
                                                                                <span>
                                                                                    of total population are
                                                                                    {' '}
                                                                                    {sexRatio.sort((a, b) => b.percent - a.percent)[0].label}
                                                                                </span>
                                                                            )
                                                                            : (
                                                                                <span>
                                                                                    {sexRatio.sort((a, b) => b.percent - a.percent)[0].label}
                                                                                    {' '}
                                                                                    छन्
                                                                                </span>
                                                                            )
                                                                    }

                                                                </>


                                                            </div>


                                                            <div style={{ flex: '4' }}>

                                                                <div className={styles.graphicalVisualization}>


                                                                    <div id="genderBreakdown">
                                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                            <h3>{t('Gender Breakdown')}</h3>
                                                                            <Button
                                                                                title={t('Download Chart')}
                                                                                className={styles.chartDownload}
                                                                                transparent
                                                                                onClick={() => this.handleSaveClick('genderBreakdown')}
                                                                                iconName="download"
                                                                            />
                                                                        </div>
                                                                        <BarchartVisualization item={sexRatio} language={language} />
                                                                    </div>


                                                                </div>

                                                            </div>


                                                        </div>
                                                        <div className={styles.barChartSection}>

                                                            <div className={styles.percentageValue}>
                                                                {/* <h1>Education Institution</h1> */}
                                                                <h1>
                                                                    {literacyRatio.sort((a, b) => b.value - a.value)[0].value}
                                                                    %
                                                                </h1>


                                                                <>
                                                                    {
                                                                        language === 'en'
                                                                            ? (
                                                                                <span>
                                                                                    {literacyRatio.sort((a, b) => b.value - a.value)[0].label}
                                                                                    {' '}
                                                                                    are literate
                                                                                </span>
                                                                            )
                                                                            : (
                                                                                <span>
                                                                                    {literacyRatio.sort((a, b) => b.value - a.value)[0].label}
                                                                                    {' '}
                                                                                    साक्षर  छन्
                                                                                </span>
                                                                            )
                                                                    }

                                                                </>


                                                            </div>


                                                            <div style={{ flex: '4' }}>

                                                                <div className={styles.graphicalVisualization}>

                                                                    {/* <div style={{ display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        fontSize: '25px' }}
                                                         /> */}
                                                                    <div id="literacyRate">
                                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                            <h3>{t('Literacy Rate (%)')}</h3>
                                                                            <Button
                                                                                title={t('Download Chart')}
                                                                                className={styles.chartDownload}
                                                                                transparent
                                                                                onClick={() => this.handleSaveClick('literacyRate')}
                                                                                iconName="download"
                                                                            />
                                                                        </div>
                                                                        <BarchartVisualization item={literacyRatio} percentage language={language} />
                                                                    </div>


                                                                </div>

                                                            </div>


                                                        </div>
                                                        <div className={styles.barChartSection}>

                                                            <div className={styles.percentageValue}>
                                                                {/* <h1>Education Institution</h1> */}
                                                                <h1>
                                                                    {NumberWithCommas(householdSummary.householdSummary.find(i => i.key === 'householdCount').value)}
                                                                </h1>


                                                                <>
                                                                    <span>
                                                                        {
                                                                            language === 'en'
                                                                                ? 'Number of Household are present'
                                                                                : 'परिवार संख्या उपस्थित  छन् '
                                                                        }
                                                                    </span>

                                                                </>


                                                            </div>


                                                            <div style={{ flex: '4' }}>

                                                                <div className={styles.graphicalVisualization}>

                                                                    {/* <div style={{ display: 'flex',
                                                         justifyContent: 'flex-end',
                                                        fontSize: '25px' }}
                                                         /> */}
                                                                    <div id="houseHold">
                                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                            <h3>{t('Household Statistics')}</h3>
                                                                            <Button
                                                                                title={t('Download Chart')}
                                                                                className={styles.chartDownload}
                                                                                transparent
                                                                                onClick={() => this.handleSaveClick('houseHold')}
                                                                                iconName="download"
                                                                            />
                                                                        </div>
                                                                        <BarchartVisualization item={householdSummary.householdSummary} language={language} />
                                                                    </div>


                                                                </div>

                                                            </div>


                                                        </div>
                                                        <div className={styles.barChartSection}>

                                                            <div className={styles.percentageValue}>

                                                                {/* <h1>
                                                        {ageGroupSummary.sort((a, b) => b.value - a.value)[0].value}
                                                        1
                                                    </h1>


                                                    <>
                                                        <span>
                                                            Test are Data
                                                        </span>

                                                    </> */}


                                                            </div>


                                                            <div style={{ flex: '4' }}>

                                                                <div className={styles.graphicalVisualization}>

                                                                    {/* <div style={{ display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        fontSize: '25px' }}
                                                        /> */}
                                                                    <div id="ageGroup">
                                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                            <h3>{t('Age Group')}</h3>
                                                                            <Button
                                                                                title={t('Download Chart')}
                                                                                className={styles.chartDownload}
                                                                                transparent
                                                                                onClick={() => this.handleSaveClick('ageGroup')}
                                                                                iconName="download"
                                                                            />
                                                                        </div>
                                                                        <BarchartVisualization item={ageGroupSummary} category language={language} />
                                                                    </div>


                                                                </div>

                                                            </div>


                                                        </div>
                                                    </div>
                                                ) : isDataSetClicked
                                                ? (
                                                    <TableDataLGProfile
                                                        selectedFederalName={selectedFederalName}
                                                        lgProfileWardLevelData={lgProfileWardLevelData}
                                                        language={language}
                                                    />
                                                )
                                                : (
                                                    <div>
                                                        <h3 style={{ marginBottom: '30px', color: '#4785DE', fontSize: '20px' }}>{t('Demographics')}</h3>
                                                        {filteredLGProfileEducationLevel.length
                                                            ? (
                                                                <div className={styles.barChartSection}>

                                                                    <div className={styles.percentageValue}>
                                                                        {/* <h1>Education Institution</h1> */}
                                                                        <h1>
                                                                            {t('Education Attainment')}
                                                                        </h1>
                                                                        <h2 style={{ fontSize: '22px', color: 'black' }}>
                                                                            {(filteredLGProfileEducationLevel.sort((a, b) => b.percentage - a.percentage))[0].percentage}
                                                                            %
                                                                        </h2>

                                                                        <>
                                                                            {
                                                                                language === 'en'
                                                                                    ? (
                                                                                        <span>
                                                                                            of the population has received
                                                                                            {' '}
                                                                                            {(filteredLGProfileEducationLevel.sort((a, b) => b.percentage - a.percentage))[0].label}
                                                                                            {' '}
                                                                                            education
                                                                                        </span>
                                                                                    )
                                                                                    : (
                                                                                        <span>
                                                                                            जनसंख्याले
                                                                                            {' '}
                                                                                            {(filteredLGProfileEducationLevel.sort((a, b) => b.percentage - a.percentage))[0].label}
                                                                                            {' '}
                                                                                            शिक्षा प्राप्‍त गरेको छन्
                                                                                        </span>
                                                                                    )

                                                                            }


                                                                        </>


                                                                    </div>


                                                                    <div style={{ flex: '4' }}>

                                                                        <div className={styles.graphicalVisualization}>

                                                                            {/* <div style={{ display: 'flex',
                                                                        justifyContent: 'flex-end',
                                                                fontSize: '25px' }}
                                                            /> */}
                                                                            <div id="filteredLGProfileEducationLevel">
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                    <h3>
                                                                                        {language === 'en'
                                                                                            ? 'Population by highest level of education completion'
                                                                                            : 'शिक्षा पूरा गरेको उच्चतम स्तर'}

                                                                                    </h3>
                                                                                    <Button
                                                                                        title={t('Download Chart')}
                                                                                        className={styles.chartDownload}
                                                                                        transparent
                                                                                        onClick={() => this.handleSaveClick('filteredLGProfileEducationLevel')}
                                                                                        iconName="download"
                                                                                    />
                                                                                </div>

                                                                                <LGProfileVisualization language={language} percentage item={filteredLGProfileEducationLevel} />
                                                                            </div>


                                                                        </div>

                                                                    </div>


                                                                </div>
                                                            ) : ''}
                                                        {filteredLGProfileMigration.length
                                                            ? (
                                                                <div className={styles.barChartSection}>

                                                                    <div className={styles.percentageValue}>
                                                                        <h1>
                                                                            {t('Migration')}
                                                                        </h1>
                                                                        <h2 style={{ fontSize: '22px', color: 'black' }}>
                                                                            {(filteredLGProfileMigration.sort((a, b) => b.percentage - a.percentage))[0].percentage}
                                                                            %
                                                                        </h2>

                                                                        <>
                                                                            {
                                                                                language === 'en'
                                                                                    ? (
                                                                                        <span>
                                                                                            of the population
                                                                                            {' '}
                                                                                            {(filteredLGProfileMigration.sort((a, b) => b.percentage - a.percentage))[0].label}

                                                                                        </span>
                                                                                    )
                                                                                    : (
                                                                                        <span>
                                                                                            जनसंख्या
                                                                                            {' '}
                                                                                            {(filteredLGProfileMigration.sort((a, b) => b.percentage - a.percentage))[0].label}
                                                                                            {''}
                                                                                            छन्


                                                                                        </span>
                                                                                    )
                                                                            }

                                                                        </>


                                                                    </div>


                                                                    <div style={{ flex: '4' }}>

                                                                        <div className={styles.graphicalVisualization}>

                                                                            {/* <div style={{ display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        fontSize: '25px' }}
                                                         /> */}
                                                                            <div id="filteredLGProfileMigration">
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                    <h3>
                                                                                        {
                                                                                            language === 'en'
                                                                                                ? 'Population by Presence in Household'
                                                                                                : 'घरपरिवारमा उपस्थिति द्वारा जनसंख्या'
                                                                                        }

                                                                                    </h3>
                                                                                    <Button
                                                                                        title={t('Download Chart')}
                                                                                        className={styles.chartDownload}
                                                                                        transparent
                                                                                        onClick={() => this.handleSaveClick('filteredLGProfileMigration')}
                                                                                        iconName="download"
                                                                                    />
                                                                                </div>
                                                                                <LGProfileVisualization language={language} percentage item={filteredLGProfileMigration} />

                                                                            </div>


                                                                        </div>

                                                                    </div>


                                                                </div>
                                                            ) : ''}
                                                        {filteredLGProfileSocialSecurity.length
                                                            ? (
                                                                <div className={styles.barChartSection}>
                                                                    <div className={styles.percentageValue}>
                                                                        <h1>
                                                                            {t('Social Security')}
                                                                        </h1>
                                                                        <h2 style={{ fontSize: '22px', color: 'black' }}>
                                                                            {summationLGProfileSocialSecurity}

                                                                        </h2>

                                                                        <>
                                                                            <span>
                                                                                {
                                                                                    language === 'en'
                                                                                        ? 'people make use of social security benefits'
                                                                                        : 'मानिसहरूले सामाजिक सुरक्षा लाभहरू प्रयोग गर्छन्'
                                                                                }

                                                                            </span>

                                                                        </>


                                                                    </div>


                                                                    <div style={{ flex: '4' }}>

                                                                        <div className={styles.graphicalVisualization}>

                                                                            {/* <div style={{ display: 'flex',
                                                         justifyContent: 'flex-end',
                                                        fontSize: '25px' }}
                                                         /> */}
                                                                            <div id="filteredLGProfileSocialSecurity">
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                    <h3>
                                                                                        {
                                                                                            language === 'en'
                                                                                                ? 'Population by type of social security benefit'
                                                                                                : 'सामाजिक सुरक्षा लाभ को प्रकार द्वारा जनसंख्या'
                                                                                        }

                                                                                    </h3>
                                                                                    <Button
                                                                                        title={t('Download Chart')}
                                                                                        className={styles.chartDownload}
                                                                                        transparent
                                                                                        onClick={() => this.handleSaveClick('filteredLGProfileSocialSecurity')}
                                                                                        iconName="download"
                                                                                    />
                                                                                </div>
                                                                                <LGProfileVisualization language={language} percentage item={filteredLGProfileSocialSecurity} />

                                                                            </div>

                                                                        </div>

                                                                    </div>


                                                                </div>
                                                            ) : ''}
                                                        {filteredLGProfileDisability.length
                                                            ? (
                                                                <div className={styles.barChartSection}>

                                                                    <div className={styles.percentageValue}>
                                                                        <h1>
                                                                            {language === 'en'
                                                                                ? 'People with Disability'
                                                                                : 'अपाङ्गता भएका व्यक्तिहरू'}
                                                                        </h1>
                                                                        <h2 style={{ fontSize: '22px', color: 'black' }}>
                                                                            {summationLGProfileDisability}

                                                                        </h2>


                                                                    </div>


                                                                    <div style={{ flex: '4' }}>

                                                                        <div className={styles.graphicalVisualization}>

                                                                            {/* <div style={{ display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        fontSize: '25px' }}
                                                        /> */}
                                                                            <div id="filteredLGProfileDisability">
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                    <h3>
                                                                                        {
                                                                                            language === 'en'
                                                                                                ? 'Population by Disability'
                                                                                                : 'अपाङ्गता द्वारा जनसंख्या'
                                                                                        }

                                                                                    </h3>
                                                                                    <Button
                                                                                        title={t('Download Chart')}
                                                                                        className={styles.chartDownload}
                                                                                        transparent
                                                                                        onClick={() => this.handleSaveClick('filteredLGProfileDisability')}
                                                                                        iconName="download"
                                                                                    />

                                                                                </div>
                                                                                <LGProfileVisualization language={language} percentage item={filteredLGProfileDisability} />

                                                                            </div>


                                                                        </div>

                                                                    </div>


                                                                </div>
                                                            ) : ''}
                                                        <h3 style={{ marginBottom: '30px', color: '#4785DE', fontSize: '20px' }}>{t('Household Statistics')}</h3>
                                                        {filteredLGProfileHouseHold.length
                                                            ? (
                                                                <div className={styles.barChartSection}>

                                                                    <div className={styles.percentageValue}>
                                                                        {/* <h1>Education Institution</h1> */}
                                                                        <h1>
                                                                            {t('Number of households')}
                                                                        </h1>
                                                                        <h2 style={{ fontSize: '22px', color: 'black' }}>
                                                                            {summationLGProfileHouseHold}

                                                                        </h2>


                                                                    </div>


                                                                    <div style={{ flex: '4' }}>

                                                                        <div className={styles.graphicalVisualization}>

                                                                            {/* <div style={{ display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        fontSize: '25px' }}
                                                        /> */}
                                                                            <div id="filteredLGProfileHouseHold">
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                    <h3>
                                                                                        {
                                                                                            language === 'en'
                                                                                                ? 'Breakdown of household heads'
                                                                                                : 'घरमुलिको ब्रेकडाउन'
                                                                                        }

                                                                                    </h3>
                                                                                    <Button
                                                                                        title={t('Download Chart')}
                                                                                        className={styles.chartDownload}
                                                                                        transparent
                                                                                        onClick={() => this.handleSaveClick('filteredLGProfileHouseHold')}
                                                                                        iconName="download"
                                                                                    />

                                                                                </div>
                                                                                <LGProfileVisualization language={language} percentage item={filteredLGProfileHouseHold} />

                                                                            </div>


                                                                        </div>

                                                                    </div>


                                                                </div>
                                                            ) : ''}
                                                        {filteredLGProfileAverageMonthlyIncome.length
                                                            ? (
                                                                <div className={styles.barChartSection}>

                                                                    <div className={styles.percentageValue}>
                                                                        {/* <h1>Education Institution</h1> */}
                                                                        {/* <h1>
                                                            Maximum household income
                                                            </h1>
                                                            <h1>
                                                                {summationLGProfileSocialSecurity}

                                                            </h1>

                                                            <>
                                                                <span>
                                                                    people make use of social security benefits

                                                                </span>

                                                            </> */}
                                                                        <h1>
                                                                            {
                                                                                language === 'en'
                                                                                    ? 'Maximum household income Range'
                                                                                    : 'अधिकतम पारिवारिक आय दायरा'
                                                                            }
                                                                        </h1>
                                                                        <h2 style={{ fontSize: '22px', color: 'black' }}>
                                                                            {(filteredLGProfileAverageMonthlyIncome.sort((a, b) => b.percentage - a.percentage))[0].label}

                                                                        </h2>

                                                                        <>
                                                                            <span>
                                                                                {
                                                                                    language === 'en'
                                                                                        ? 'on average per month'
                                                                                        : 'औसत प्रति महिना'
                                                                                }

                                                                            </span>

                                                                        </>


                                                                    </div>


                                                                    <div style={{ flex: '4' }}>

                                                                        <div className={styles.graphicalVisualization}>

                                                                            {/* <div style={{ display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        fontSize: '25px' }}
                                                        /> */}
                                                                            <div id="filteredLGProfileAverageMonthlyIncome">
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                    <h3>
                                                                                        {
                                                                                            language === 'en'
                                                                                                ? 'Household by average monthly income'
                                                                                                : 'औसत मासिक आम्दानी द्वारा घरपरिवार'
                                                                                        }
                                                                                    </h3>
                                                                                    <Button
                                                                                        title={t('Download Chart')}
                                                                                        className={styles.chartDownload}
                                                                                        transparent
                                                                                        onClick={() => this.handleSaveClick('filteredLGProfileAverageMonthlyIncome')}
                                                                                        iconName="download"
                                                                                    />

                                                                                </div>
                                                                                <LGProfileVisualization language={language} percentage item={filteredLGProfileAverageMonthlyIncome} />

                                                                            </div>


                                                                        </div>

                                                                    </div>


                                                                </div>
                                                            ) : ''}
                                                        {filteredLGProfileAverageMajorOccupation.length
                                                            ? (
                                                                <div className={styles.barChartSection}>

                                                                    <div className={styles.percentageValue}>
                                                                        {/* <h1>Education Institution</h1> */}

                                                                        <h1>
                                                                            {t('Occupation')}
                                                                        </h1>
                                                                        <h2 style={{ fontSize: '22px', color: 'black' }}>
                                                                            {(filteredLGProfileAverageMajorOccupation.sort((a, b) => b.percentage - a.percentage))[0].value}

                                                                        </h2>

                                                                        <>
                                                                            {
                                                                                language === 'en'
                                                                                    ? (
                                                                                        <span>
                                                                                            Household are engaged in
                                                                                            {' '}
                                                                                            {(filteredLGProfileAverageMajorOccupation.sort((a, b) => b.percentage - a.percentage))[0].label}

                                                                                        </span>
                                                                                    )

                                                                                    : (
                                                                                        <span>
                                                                                            घरपरिवार
                                                                                            {' '}
                                                                                            {(filteredLGProfileAverageMajorOccupation.sort((a, b) => b.percentage - a.percentage))[0].label}
                                                                                            {''}
                                                                                            छन्

                                                                                        </span>
                                                                                    )
                                                                            }
                                                                        </>

                                                                    </div>


                                                                    <div style={{ flex: '4' }}>

                                                                        <div className={styles.graphicalVisualization}>

                                                                            {/* <div style={{ display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        fontSize: '25px' }}
                                                        /> */}
                                                                            <div id="filteredLGProfileAverageMajorOccupation">
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                    <h3>
                                                                                        {
                                                                                            language === 'en'
                                                                                                ? 'Major occupation'
                                                                                                : 'प्रमुख पेशा'
                                                                                        }
                                                                                        {' '}

                                                                                    </h3>
                                                                                    <Button
                                                                                        title={t('Download Chart')}
                                                                                        className={styles.chartDownload}
                                                                                        transparent
                                                                                        onClick={() => this.handleSaveClick('filteredLGProfileAverageMajorOccupation')}
                                                                                        iconName="download"
                                                                                    />

                                                                                </div>
                                                                                <LGProfileVisualization language={language} percentage item={filteredLGProfileAverageMajorOccupation} />

                                                                            </div>


                                                                        </div>

                                                                    </div>


                                                                </div>
                                                            ) : ''}
                                                        {filteredLGProfileDrinkingWater.length
                                                            ? (
                                                                <div className={styles.barChartSection}>

                                                                    <div className={styles.percentageValue}>
                                                                        {/* <h1>Education Institution</h1> */}
                                                                        <h1>
                                                                            {t('Drinking Water')}
                                                                        </h1>
                                                                        <h2 style={{ fontSize: '22px', color: 'black' }}>
                                                                            {(filteredLGProfileDrinkingWater.sort((a, b) => b.percentage - a.percentage))[0].value}

                                                                        </h2>

                                                                        <>
                                                                            {
                                                                                language === 'en'
                                                                                    ? (
                                                                                        <span>
                                                                                            households use
                                                                                            {' '}
                                                                                            {(filteredLGProfileDrinkingWater.sort((a, b) => b.percentage - a.percentage))[0].label}

                                                                                        </span>
                                                                                    )
                                                                                    : (
                                                                                        <span>
                                                                                            घरपरिवारहरू
                                                                                            {' '}
                                                                                            {(filteredLGProfileDrinkingWater.sort((a, b) => b.percentage - a.percentage))[0].label}
                                                                                            {' '}
                                                                                            प्रयोग गर्छन्
                                                                                        </span>
                                                                                    )
                                                                            }

                                                                        </>


                                                                    </div>


                                                                    <div style={{ flex: '4' }}>

                                                                        <div className={styles.graphicalVisualization}>

                                                                            {/* <div style={{ display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        fontSize: '25px' }}
                                                        /> */}
                                                                            <div id="filteredLGProfileDrinkingWater">
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                    <h3>
                                                                                        {
                                                                                            language === 'en'
                                                                                                ? 'Source of Drinking water by Household'
                                                                                                : 'घरायसी पिउने पानीको स्रोत'
                                                                                        }
                                                                                    </h3>
                                                                                    <Button
                                                                                        title={t('Download Chart')}
                                                                                        className={styles.chartDownload}
                                                                                        transparent
                                                                                        onClick={() => this.handleSaveClick('filteredLGProfileDrinkingWater')}
                                                                                        iconName="download"
                                                                                    />

                                                                                </div>
                                                                                <LGProfileVisualization language={language} percentage item={filteredLGProfileDrinkingWater} />

                                                                            </div>


                                                                        </div>

                                                                    </div>


                                                                </div>
                                                            ) : ''}
                                                        {filteredLGProfileResidentHousehold.length
                                                            ? (
                                                                <div className={styles.barChartSection}>

                                                                    <div className={styles.percentageValue}>
                                                                        {/* <h1>Education Institution</h1> */}
                                                                        <h1>
                                                                            {t('Number of buildings')}
                                                                        </h1>
                                                                        <h2 style={{ fontSize: '22px', color: 'black' }}>
                                                                            {summationLGProfileResidentHousehold}

                                                                        </h2>


                                                                    </div>


                                                                    <div style={{ flex: '4' }}>

                                                                        <div className={styles.graphicalVisualization}>

                                                                            {/* <div style={{ display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        fontSize: '25px' }}
                                                        /> */}
                                                                            <div id="filteredLGProfileResidentHousehold">
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                    <h3>
                                                                                        {
                                                                                            language === 'en'
                                                                                                ? 'Building by number of resident households'
                                                                                                : 'आवासीय घरपरिवारको संख्या अनुसार निर्माण'
                                                                                        }
                                                                                    </h3>
                                                                                    <Button
                                                                                        title={t('Download Chart')}
                                                                                        className={styles.chartDownload}
                                                                                        transparent
                                                                                        onClick={() => this.handleSaveClick('filteredLGProfileResidentHousehold')}
                                                                                        iconName="download"
                                                                                    />

                                                                                </div>
                                                                                <LGProfileVisualization language={language} percentage item={filteredLGProfileResidentHousehold} />

                                                                            </div>


                                                                        </div>

                                                                    </div>


                                                                </div>
                                                            ) : ''}
                                                        <h3 style={{ marginBottom: '30px', color: '#4785DE', fontSize: '20px' }}>{t('Agriculture and Livestock')}</h3>
                                                        {filteredLGProfileAgriculturePractice.length
                                                            ? (
                                                                <div className={styles.barChartSection}>

                                                                    <div className={styles.percentageValue}>
                                                                        {/* <h1>Education Institution</h1> */}
                                                                        <h1>
                                                                            {t('Agriculture')}
                                                                        </h1>
                                                                        <h2 style={{ fontSize: '22px', color: 'black' }}>
                                                                            {(filteredLGProfileAgriculturePractice.sort((a, b) => b.percentage - a.percentage))[0].percentage}
                                                                            %

                                                                        </h2>

                                                                        <>
                                                                            {
                                                                                language === 'en'
                                                                                    ? (
                                                                                        <span>
                                                                                            of households are
                                                                                            {' '}
                                                                                            {(filteredLGProfileAgriculturePractice.sort((a, b) => b.percentage - a.percentage))[0].label}

                                                                                        </span>
                                                                                    )
                                                                                    : (
                                                                                        <span>
                                                                                            घरपरिवार
                                                                                            {' '}
                                                                                            {(filteredLGProfileAgriculturePractice.sort((a, b) => b.percentage - a.percentage))[0].label}
                                                                                            {' '}
                                                                                            छन्
                                                                                        </span>
                                                                                    )
                                                                            }

                                                                        </>


                                                                    </div>


                                                                    <div style={{ flex: '4' }}>

                                                                        <div className={styles.graphicalVisualization}>

                                                                            {/* <div style={{ display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        fontSize: '25px' }}
                                                        /> */}
                                                                            <div id="filteredLGProfileAgriculturePractice">
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                    <h3>{t('Agriculture Practice')}</h3>
                                                                                    <Button
                                                                                        title={t('Download Chart')}
                                                                                        className={styles.chartDownload}
                                                                                        transparent
                                                                                        onClick={() => this.handleSaveClick('filteredLGProfileAgriculturePractice')}
                                                                                        iconName="download"
                                                                                    />

                                                                                </div>
                                                                                <LGProfileVisualization language={language} percentage item={filteredLGProfileAgriculturePractice} />

                                                                            </div>


                                                                        </div>

                                                                    </div>


                                                                </div>
                                                            ) : ''}
                                                        {filteredLGProfileAgricultureProduct.length
                                                            ? (
                                                                <div className={styles.barChartSection}>

                                                                    <div className={styles.percentageValue}>
                                                                        {/* <h1>Education Institution</h1> */}
                                                                        <h1>
                                                                            {t('Agricultural Products')}
                                                                        </h1>
                                                                        <>
                                                                            {
                                                                                language === 'en'
                                                                                    ? (
                                                                                        <span>
                                                                                            {(filteredLGProfileAgricultureProduct.sort((a, b) => b.percentage - a.percentage))[0].label}
                                                                                            {' '}
                                                                                            is major Agricultural product
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span>
                                                                                            {(filteredLGProfileAgricultureProduct.sort((a, b) => b.percentage - a.percentage))[0].label}
                                                                                            {' '}
                                                                                            प्रमुख कृषि उत्पादन हो
                                                                                        </span>
                                                                                    )}

                                                                        </>


                                                                    </div>


                                                                    <div style={{ flex: '4' }}>

                                                                        <div className={styles.graphicalVisualization}>

                                                                            {/* <div style={{ display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        fontSize: '25px' }}
                                                        /> */}
                                                                            <div id="filteredLGProfileAgricultureProduct">
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                    <h3>
                                                                                        {t('Major Agricultural products')}
                                                                                        {' '}
                                                                                    </h3>
                                                                                    <Button
                                                                                        title={t('Download Chart')}
                                                                                        className={styles.chartDownload}
                                                                                        transparent
                                                                                        onClick={() => this.handleSaveClick('filteredLGProfileAgricultureProduct')}
                                                                                        iconName="download"
                                                                                    />

                                                                                </div>
                                                                                <LGProfileVisualization language={language} percentage item={filteredLGProfileAgricultureProduct} />

                                                                            </div>


                                                                        </div>

                                                                    </div>


                                                                </div>
                                                            ) : ''}
                                                        <h3 style={{ marginBottom: '30px', color: '#4785DE', fontSize: '20px' }}>{t('Physical Structure of House')}</h3>
                                                        {filteredLGProfileBuildingType.length
                                                            ? (
                                                                <div className={styles.barChartSection}>

                                                                    <div className={styles.percentageValue}>
                                                                        {/* <h1>Education Institution</h1> */}
                                                                        <h1>
                                                                            {t('Majority of building type')}
                                                                        </h1>
                                                                        <h2 style={{ fontSize: '22px', color: 'black' }}>
                                                                            {(filteredLGProfileBuildingType.sort((a, b) => b.percentage - a.percentage))[0].percentage}
                                                                            %

                                                                        </h2>

                                                                        <>
                                                                            {
                                                                                language === 'en'
                                                                                    ? (
                                                                                        <span>
                                                                                            are
                                                                                            {' '}
                                                                                            {(filteredLGProfileBuildingType.sort((a, b) => b.percentage - a.percentage))[0].label}
                                                                                            {' '}
                                                                                            house

                                                                                        </span>
                                                                                    )
                                                                                    : (
                                                                                        <span>
                                                                                            {' '}
                                                                                            {(filteredLGProfileBuildingType.sort((a, b) => b.percentage - a.percentage))[0].label}
                                                                                            {' '}
                                                                                            घर छन्

                                                                                        </span>
                                                                                    )
                                                                            }

                                                                        </>


                                                                    </div>


                                                                    <div style={{ flex: '4' }}>

                                                                        <div className={styles.graphicalVisualization}>

                                                                            {/* <div style={{ display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        fontSize: '25px' }}
                                                        /> */}
                                                                            <div id="filteredLGProfileBuildingType">
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                    <h3>{t('Building by Type of Superstructure')}</h3>
                                                                                    <Button
                                                                                        title={t('Download Chart')}
                                                                                        className={styles.chartDownload}
                                                                                        transparent
                                                                                        onClick={() => this.handleSaveClick('filteredLGProfileBuildingType')}
                                                                                        iconName="download"
                                                                                    />

                                                                                </div>
                                                                                <LGProfileVisualization language={language} percentage item={filteredLGProfileBuildingType} />

                                                                            </div>


                                                                        </div>

                                                                    </div>


                                                                </div>
                                                            ) : ''}
                                                        {filteredLGProfileBuildingFoundation.length
                                                            ? (
                                                                <div className={styles.barChartSection}>

                                                                    <div className={styles.percentageValue}>
                                                                        {/* <h1>Education Institution</h1> */}
                                                                        <h1>
                                                                            {t('Majority of building')}
                                                                        </h1>
                                                                        <h2 style={{ fontSize: '22px', color: 'black' }}>
                                                                            {(filteredLGProfileBuildingFoundation.sort((a, b) => b.percentage - a.percentage))[0].percentage}
                                                                            %

                                                                        </h2>

                                                                        <>
                                                                            {
                                                                                language === 'en'
                                                                                    ? (
                                                                                        <span>
                                                                                            have
                                                                                            {' '}
                                                                                            {(filteredLGProfileBuildingFoundation.sort((a, b) => b.percentage - a.percentage))[0].label}
                                                                                            {' '}
                                                                                            foundation

                                                                                        </span>
                                                                                    )
                                                                                    : (
                                                                                        <span>
                                                                                            {' '}
                                                                                            {(filteredLGProfileBuildingFoundation.sort((a, b) => b.percentage - a.percentage))[0].label}
                                                                                            {' '}
                                                                                            आधार छन्

                                                                                        </span>
                                                                                    )
                                                                            }

                                                                        </>


                                                                    </div>


                                                                    <div style={{ flex: '4' }}>

                                                                        <div className={styles.graphicalVisualization}>

                                                                            {/* <div style={{ display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        fontSize: '25px' }}
                                                        /> */}
                                                                            <div id="filteredLGProfileBuildingFoundation">
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                    <h3>{t('Buildings by Type of Foundation')}</h3>
                                                                                    <Button
                                                                                        title={t('Download Chart')}
                                                                                        className={styles.chartDownload}
                                                                                        transparent
                                                                                        onClick={() => this.handleSaveClick('filteredLGProfileBuildingFoundation')}
                                                                                        iconName="download"
                                                                                    />

                                                                                </div>
                                                                                <LGProfileVisualization language={language} percentage item={filteredLGProfileBuildingFoundation} />

                                                                            </div>


                                                                        </div>

                                                                    </div>


                                                                </div>
                                                            ) : ''}
                                                    </div>
                                                )

                                            }


                                            {/* </div> */}


                                        </ModalBody>
                                    )
                                }
                            </Translation>

                        </Modal>
                    ) : ''
                }
                <Translation>
                    {
                        t => (
                            <div className={_cs(styles.demographics, className)}>

                                <div className={styles.radioInputDiv}>
                                    <div className={styles.radioInputHeading}><h1>{t('Select Data Format')}</h1></div>
                                    <div>
                                        <RadioInput
                                            keySelector={pastDataKeySelector}
                                            labelSelector={pastDataLabelSelector}
                                            options={dateRangeOption}
                                            onChange={this.handleRadioButtonClick}
                                            value={selectedDataType}
                                            contentClassName={styles.dateRanges}
                                        />

                                    </div>
                                </div>


                                <div className={styles.dataDisplayDiv}>
                                    {selectedDataType === 1 || selectedDataType === 2
                                        ? (
                                            <div>
                                                <div className={styles.dataDetails}>
                                                    <div style={{ padding: '10px' }}>
                                                        {/* <h1>Individual Characteristics</h1> */}
                                                        <div
                                                            className={selectedAttribute === 'totalPopulation' ? styles.demographyHeading : ''}
                                                            style={{ cursor: 'pointer' }}
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={() => this.setState({ selectedAttribute: 'totalPopulation' })}
                                                            onKeyDown={undefined}
                                                        >
                                                            <h2>{t('Population')}</h2>

                                                        </div>

                                                        {sexRatio && sexRatio.length ? (
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <h2 style={{
                                                                    fontSize: '30px',
                                                                    paddingLeft: '10px',
                                                                    paddingRight: '10px',
                                                                    paddingTop: '0px',
                                                                    paddingBottom: '0px',
                                                                }}
                                                                >
                                                                    {NumberWithCommas(populationSummary
                                                                        .find(i => i.key === 'totalPopulation').value)}
                                                                </h2>
                                                                {
                                                                    selectedDataType === 1

                                                                        ? ((populationSummary
                                                                            .find(i => i.key === 'changed_total_population').value) > 0
                                                                            ? (
                                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                    <img src={Positive} alt="positive" style={{ height: '50px', width: '50px' }} />

                                                                                    <img src={Positive_Up} alt="positive" style={{ height: '20px', width: '20px' }} />

                                                                                    <h2 style={{ fontWeight: '300', fontSize: '12px', paddingLeft: '2px' }}>
                                                                                        {NumberWithCommas(populationSummary
                                                                                            .find(i => i.key === 'changed_total_population').value)}
                                                                                        {' '}
                                                                                        Since 2011
                                                                                    </h2>
                                                                                </div>
                                                                            )
                                                                            : (
                                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                    <img src={Negative} alt="Negative" style={{ height: '50px', width: '50px' }} />
                                                                                    <img src={Positive_Down} alt="Positive_Down" style={{ height: '20px', width: '20px' }} />

                                                                                    <h2 style={{ fontWeight: '300', fontSize: '12px', paddingLeft: '2px' }}>
                                                                                        {NumberWithCommas(populationSummary
                                                                                            .find(i => i.key === 'changed_total_population').value)}
                                                                                        {' '}
                                                                                        Since 2011
                                                                                    </h2>
                                                                                </div>
                                                                            )
                                                                        ) : ''}
                                                            </div>
                                                        ) : ''}
                                                    </div>
                                                    <h3 style={{ marginLeft: '20px' }}>{t('Gender Breakdown')}</h3>
                                                    {sexRatio && sexRatio.length
                                                        ? (
                                                            <div style={{ height: '90px', width: '100%', paddingRight: '10px', paddingLeft: '10px' }}>
                                                                <ResponsiveContainer>

                                                                    <BarChart
                                                                        data={sexRatio}
                                                                        layout="vertical"
                                                                        // margin={chartMargin}
                                                                        margin={{
                                                                            top: 0,
                                                                            right: 30,
                                                                            bottom: 0,
                                                                            left: 2,
                                                                        }

                                                                        }
                                                                        width={600}
                                                                        height={50}
                                                                    >
                                                                        <XAxis
                                                                            type="number"
                                                                            tick={<CustomizedAxisTick />}
                                                                        />
                                                                        <YAxis
                                                                            width={yAxisWidth}
                                                                            dataKey="label"
                                                                            type="category"
                                                                        />
                                                                        <Tooltip content={<CustomTooltip />} />
                                                                        <Bar
                                                                            dataKey="value"
                                                                            fill="#dcdcde"
                                                                            barSize={25}
                                                                        >
                                                                            {sexRatio.map(v => (
                                                                                <Cell
                                                                                    key={v.key}
                                                                                    fill={v.color}
                                                                                />
                                                                            ))}

                                                                        </Bar>
                                                                    </BarChart>
                                                                </ResponsiveContainer>
                                                            </div>
                                                        ) : <h2>{t('No Data Available')}</h2>}
                                                </div>


                                                <div className={styles.dataDetails}>
                                                    <div style={{ padding: '10px' }}>
                                                        <div
                                                            className={selectedAttribute === 'literacyRate' ? styles.demographyHeading : ''}
                                                            style={{ cursor: 'pointer' }}
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={() => this.setState({ selectedAttribute: 'literacyRate' })}
                                                            onKeyDown={undefined}
                                                        >
                                                            <h2>{t('Literacy Rate')}</h2>
                                                        </div>
                                                        {literacyRatio && literacyRatio.length
                                                            ? (
                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <h2 style={{ fontSize: '30px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '0px', paddingBottom: '0px' }}>
                                                                        {NumberWithCommas(literacySummary.find(i => i.key === 'literacyRate').value)}
                                                                        %
                                                                    </h2>
                                                                    {
                                                                        selectedDataType === 1

                                                                            ? ((literacySummary
                                                                                .find(i => i.key === 'changed_literacyRate').value) > 0
                                                                                ? (
                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <img src={Positive} alt="positive" style={{ height: '50px', width: '50px' }} />

                                                                                        <img src={Positive_Up} alt="positive" style={{ height: '20px', width: '20px' }} />

                                                                                        <h2 style={{ fontWeight: '300', fontSize: '12px', paddingLeft: '2px' }}>
                                                                                            {NumberWithCommas(literacySummary
                                                                                                .find(i => i.key === 'changed_literacyRate').value)}
                                                                                            %
                                                                                            {' '}
                                                                                            Since 2011
                                                                                        </h2>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>

                                                                                        <img src={Negative} alt="Negative" style={{ height: '50px', width: '50px' }} />

                                                                                        <img src={Positive_Down} alt="Positive_Down" style={{ height: '20px', width: '20px' }} />

                                                                                        <h2 style={{ fontWeight: '300', fontSize: '12px', paddingLeft: '2px' }}>
                                                                                            {NumberWithCommas(literacySummary
                                                                                                .find(i => i.key === 'changed_literacyRate').value)}
                                                                                            %
                                                                                            {' '}
                                                                                            Since 2011
                                                                                        </h2>
                                                                                    </div>
                                                                                )) : ''}
                                                                </div>
                                                            ) : ''}
                                                    </div>
                                                    <h3 style={{ marginLeft: '20px' }}>{t('Gender Breakdown')}</h3>
                                                    {literacyRatio && literacyRatio.length
                                                        ? (
                                                            <div style={{ height: '90px', width: '100%', paddingRight: '10px', paddingLeft: '10px' }}>
                                                                <ResponsiveContainer>
                                                                    <BarChart
                                                                        data={literacyRatio}
                                                                        layout="vertical"
                                                                        // margin={chartMargin}
                                                                        margin={{
                                                                            top: 0,
                                                                            right: 30,
                                                                            bottom: 0,
                                                                            left: 2,
                                                                        }}
                                                                        width={500}
                                                                        height={50}
                                                                    >
                                                                        <XAxis type="number" />
                                                                        <YAxis
                                                                            width={yAxisWidth}
                                                                            dataKey="label"
                                                                            type="category"
                                                                        />
                                                                        <Tooltip content={<CustomTooltip />} />
                                                                        <Bar
                                                                            dataKey="value"
                                                                            fill="#dcdcde"
                                                                            barSize={25}
                                                                        >
                                                                            {literacyRatio.map(v => (
                                                                                <Cell
                                                                                    key={v.key}
                                                                                    fill={v.color}
                                                                                />
                                                                            ))}

                                                                        </Bar>
                                                                    </BarChart>

                                                                </ResponsiveContainer>
                                                            </div>
                                                        ) : <h2>{t('No Data Available')}</h2>}


                                                </div>


                                                <div className={styles.dataDetails}>
                                                    <div style={{ padding: '10px' }}>
                                                        <div
                                                            className={selectedAttribute === 'householdCount' ? styles.demographyHeading : ''}
                                                            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={() => this.setState({ selectedAttribute: 'householdCount' })}
                                                            onKeyDown={undefined}
                                                        >
                                                            <h2>{language === 'en' ? 'Household' : 'घरायसी विवरण'}</h2>
                                                            {
                                                                selectedDataType === 1

                                                                    ? (householdSummary.changed_householdCount.value > 0
                                                                        ? (
                                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                <img src={Positive} alt="Positive" style={{ height: '50px', width: '50px' }} />

                                                                                <img src={Positive_Up} alt="Positive_Up" style={{ height: '20px', width: '20px' }} />

                                                                                <h2 style={{ fontWeight: '300', fontSize: '12px', paddingLeft: '2px' }}>
                                                                                    {NumberWithCommas(householdSummary.changed_householdCount.value)}
                                                                                    {' '}
                                                                                    Since 2011
                                                                                </h2>
                                                                            </div>
                                                                        )
                                                                        : (
                                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                <img src={Negative} alt="Negative" style={{ height: '50px', width: '50px' }} />

                                                                                <img src={Positive_Down} alt="Positive_Down" style={{ height: '20px', width: '20px' }} />

                                                                                <h2 style={{ fontWeight: '300', fontSize: '12px', paddingLeft: '2px' }}>
                                                                                    {NumberWithCommas(householdSummary.changed_householdCount.value)}
                                                                                    {' '}
                                                                                    Since 2011
                                                                                </h2>
                                                                            </div>
                                                                        )
                                                                    ) : ''}
                                                        </div>

                                                    </div>
                                                    {/* <h3 style={{ marginLeft: '20px' }}>Gender Breakdown</h3> */}
                                                    {householdSummary && householdSummary.householdSummary.length
                                                        ? (
                                                            <div style={{ height: '90px', width: '100%', paddingRight: '10px', paddingLeft: '10px' }}>
                                                                <ResponsiveContainer>
                                                                    <BarChart
                                                                        data={householdSummary.householdSummary}
                                                                        layout="vertical"
                                                                        // margin={chartMargin}
                                                                        margin={{
                                                                            top: 0,
                                                                            right: 30,
                                                                            bottom: 0,
                                                                            left: 2,
                                                                        }}
                                                                        width={500}
                                                                        height={50}
                                                                    >
                                                                        <XAxis
                                                                            type="number"
                                                                            tick={<CustomizedAxisTick />}
                                                                        />
                                                                        <YAxis
                                                                            width={yAxisWidth}
                                                                            dataKey="label"
                                                                            type="category"
                                                                        />
                                                                        <Tooltip content={<CustomTooltip />} />
                                                                        <Bar
                                                                            dataKey="value"
                                                                            fill="#dcdcde"
                                                                            barSize={25}
                                                                        >
                                                                            {householdSummary.householdSummary.map(v => (
                                                                                <Cell
                                                                                    key={v.key}
                                                                                    fill={v.color}
                                                                                />
                                                                            ))}
                                                                            <LabelList
                                                                                className={styles.label}
                                                                                dataKey="percent"
                                                                                position="insideRight"
                                                                                formatter={value => `${value} %`}
                                                                            />
                                                                        </Bar>
                                                                    </BarChart>


                                                                </ResponsiveContainer>
                                                            </div>
                                                        ) : <h2>{t('No Data Available')}</h2>}


                                                </div>


                                                <div className={styles.dataDetails}>
                                                    <div style={{ padding: '10px' }}>

                                                        <h2>{t('Age Group')}</h2>

                                                    </div>
                                                    {/* <h3 style={{ marginLeft: '20px' }}>Gender Breakdown</h3> */}
                                                    {ageGroupSummary && ageGroupSummary.length
                                                        ? (
                                                            <div style={{ height: '590px', width: '100%', paddingRight: '10px', paddingLeft: '10px' }}>
                                                                <ResponsiveContainer>
                                                                    <BarChart
                                                                        width={500}
                                                                        height={300}
                                                                        data={ageGroupSummary}
                                                                        layout="vertical"
                                                                        margin={{
                                                                            top: 5,
                                                                            right: 30,
                                                                            left: 2,
                                                                            bottom: 5,
                                                                        }}
                                                                    >

                                                                        <XAxis
                                                                            type="number"
                                                                            tick={<CustomizedAxisTick />}
                                                                        />
                                                                        <YAxis
                                                                            width={yAxisWidth}
                                                                            dataKey="label"
                                                                            type="category"
                                                                        />
                                                                        <Tooltip content={<CustomTooltip />} />
                                                                        {/* <Tooltip /> */}
                                                                        <Legend align="center" content={renderLegend} />
                                                                        <Bar
                                                                            dataKey="male"
                                                                            fill="#2A7BBB"
                                                                            stackId="a"
                                                                            barSize={25}
                                                                        />
                                                                        <Bar
                                                                            dataKey="female"
                                                                            fill="#83A4D3"
                                                                            stackId="a"
                                                                            barSize={25}
                                                                        />
                                                                    </BarChart>


                                                                </ResponsiveContainer>
                                                            </div>
                                                        ) : <h2>{t('No Data Available')}</h2>}


                                                </div>


                                            </div>
                                        )
                                        : (
                                            <div>

                                                <div className={styles.dataDetails}>
                                                    <div style={{ padding: '10px' }}>
                                                        {/* <h1>Individual Characteristics</h1> */}
                                                        <div
                                                            className={selectedAttribute === 'totalPopulation' ? styles.demographyHeading : ''}
                                                            style={{ cursor: 'pointer' }}
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={() => this.setState({ selectedAttribute: 'totalPopulation' })}
                                                            onKeyDown={undefined}
                                                        >
                                                            <h2>{t('Population')}</h2>
                                                        </div>
                                                        {sexRatioTotalPopulationLGProfile

                                                            ? (
                                                                <h2 style={{
                                                                    fontSize: '30px',
                                                                    paddingLeft: '10px',
                                                                    paddingRight: '10px',
                                                                    paddingTop: '0px',
                                                                    paddingBottom: '0px',
                                                                }}
                                                                >
                                                                    {NumberWithCommas(sexRatioTotalPopulationLGProfile)}

                                                                </h2>
                                                            ) : ''}

                                                    </div>
                                                    {sexRatioTotalPopulationLGProfile
                                                        ? (
                                                            <>
                                                                <h3 style={{ marginLeft: '20px' }}>{t('Gender Breakdown')}</h3>

                                                                <div style={{ height: '90px', width: '100%', paddingRight: '10px', paddingLeft: '10px' }}>
                                                                    <ResponsiveContainer>

                                                                        <BarChart
                                                                            data={sexRatioLGProfile}
                                                                            layout="vertical"
                                                                            // margin={chartMargin}
                                                                            margin={{
                                                                                top: 0,
                                                                                right: 30,
                                                                                bottom: 0,
                                                                                left: 2,
                                                                            }

                                                                            }
                                                                            width={600}
                                                                            height={50}
                                                                        >
                                                                            <XAxis
                                                                                type="number"
                                                                                tick={<CustomizedAxisTick />}
                                                                            />
                                                                            <YAxis
                                                                                width={yAxisWidth}
                                                                                dataKey="label"
                                                                                type="category"
                                                                                interval={0}
                                                                            />
                                                                            <Tooltip content={<CustomTooltip />} />
                                                                            <Bar
                                                                                dataKey="value"
                                                                                fill="#dcdcde"
                                                                                barSize={25}
                                                                            >
                                                                                {sexRatioLGProfile.map(v => (
                                                                                    <Cell
                                                                                        key={v.key}
                                                                                        fill={v.color}
                                                                                    />
                                                                                ))}

                                                                            </Bar>
                                                                        </BarChart>
                                                                    </ResponsiveContainer>
                                                                </div>
                                                            </>
                                                        ) : <h3 style={{ textAlign: 'center' }}>{t('No Data Available')}</h3>}
                                                </div>


                                                <div className={styles.dataDetails}>
                                                    <div style={{ padding: '10px' }}>
                                                        <div
                                                            className={selectedAttribute === 'literacyRate' ? styles.demographyHeading : ''}
                                                            style={{ cursor: 'pointer' }}
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={() => this.setState({ selectedAttribute: 'literacyRate' })}
                                                            onKeyDown={undefined}
                                                        >
                                                            <h2>{t('Literacy Rate')}</h2>
                                                        </div>
                                                        {literatePeopleTotalPopulationLGProfile
                                                            ? (
                                                                <h2 style={{ fontSize: '30px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '0px', paddingBottom: '0px' }}>
                                                                    {literacyRateLGProfile.toFixed(2)}
                                                                    %
                                                                </h2>
                                                            ) : ''}
                                                    </div>
                                                    {literatePeopleTotalPopulationLGProfile
                                                        ? (
                                                            <>
                                                                <h3 style={{ marginLeft: '20px' }}>{t('Gender Breakdown')}</h3>

                                                                <div style={{ height: '90px', width: '100%', paddingRight: '10px', paddingLeft: '10px' }}>
                                                                    <ResponsiveContainer>
                                                                        <BarChart
                                                                            data={literacyRatioLGProfile}
                                                                            layout="vertical"
                                                                            // margin={chartMargin}
                                                                            margin={{
                                                                                top: 0,
                                                                                right: 30,
                                                                                bottom: 0,
                                                                                left: 2,
                                                                            }}
                                                                            width={500}
                                                                            height={50}
                                                                        >
                                                                            <XAxis type="number" />
                                                                            <YAxis
                                                                                width={yAxisWidth}
                                                                                dataKey="label"
                                                                                type="category"
                                                                            />
                                                                            <Tooltip content={<CustomTooltip />} />
                                                                            <Bar
                                                                                dataKey="value"
                                                                                fill="#dcdcde"
                                                                                barSize={25}
                                                                            >
                                                                                {literacyRatioLGProfile.map(v => (
                                                                                    <Cell
                                                                                        key={v.key}
                                                                                        fill={v.color}
                                                                                    />
                                                                                ))}

                                                                            </Bar>
                                                                        </BarChart>

                                                                    </ResponsiveContainer>
                                                                </div>
                                                            </>
                                                        ) : <h3 style={{ textAlign: 'center' }}>{t('No Data Available')}</h3>}


                                                </div>


                                                <div className={styles.dataDetails}>
                                                    <div style={{ padding: '10px' }}>
                                                        <div
                                                            className={selectedAttribute === 'householdCount' ? styles.demographyHeading : ''}
                                                            style={{ cursor: 'pointer' }}
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={() => this.setState({ selectedAttribute: 'householdCount' })}
                                                            onKeyDown={undefined}
                                                        >
                                                            <h2>
                                                                {language === 'en'
                                                                    ? 'Household' : 'घरायसी विवरण'}
                                                            </h2>
                                                        </div>

                                                    </div>
                                                    {/* <h3 style={{ marginLeft: '20px' }}>Gender Breakdown</h3> */}
                                                    {sexRatioTotalPopulationLGProfile ? (
                                                        <div style={{ height: '90px', width: '100%', paddingRight: '10px', paddingLeft: '10px' }}>
                                                            <ResponsiveContainer>
                                                                <BarChart
                                                                    data={houseHoldSummaryLGProfile}
                                                                    layout="vertical"
                                                                    // margin={chartMargin}
                                                                    margin={{
                                                                        top: 0,
                                                                        right: 30,
                                                                        bottom: 0,
                                                                        left: 2,
                                                                    }}
                                                                    width={500}
                                                                    height={50}
                                                                >
                                                                    <XAxis
                                                                        type="number"
                                                                        tick={<CustomizedAxisTick />}
                                                                    />
                                                                    <YAxis
                                                                        width={yAxisWidth}
                                                                        dataKey="label"
                                                                        type="category"
                                                                    />
                                                                    <Tooltip content={<CustomTooltip />} />
                                                                    <Bar
                                                                        dataKey="value"
                                                                        fill="#dcdcde"
                                                                        barSize={25}
                                                                    >
                                                                        {houseHoldSummaryLGProfile.map(v => (
                                                                            <Cell
                                                                                key={v.key}
                                                                                fill={v.color}
                                                                            />
                                                                        ))}
                                                                        <LabelList
                                                                            className={styles.label}
                                                                            dataKey="percent"
                                                                            position="insideRight"
                                                                            formatter={value => `${value} %`}
                                                                        />
                                                                    </Bar>
                                                                </BarChart>


                                                            </ResponsiveContainer>
                                                        </div>
                                                    )
                                                        : <h3 style={{ textAlign: 'center' }}>{t('No Data Available')}</h3>}


                                                </div>


                                                <div className={styles.dataDetails}>
                                                    <div style={{ padding: '10px' }}>

                                                        <h2>{t('Age Group')}</h2>

                                                    </div>
                                                    {/* <h3 style={{ marginLeft: '20px' }}>Gender Breakdown</h3> */}
                                                    {filteredLGProfileAgeGroup && filteredLGProfileAgeGroup.length
                                                        ? (
                                                            <div style={{ height: '590px', width: '100%', paddingRight: '10px', paddingLeft: '10px' }}>
                                                                <ResponsiveContainer>
                                                                    <BarChart
                                                                        width={500}
                                                                        height={300}
                                                                        data={filteredLGProfileAgeGroup}
                                                                        layout="vertical"
                                                                        margin={{
                                                                            top: 5,
                                                                            right: 30,
                                                                            left: 2,
                                                                            bottom: 5,
                                                                        }}
                                                                    >

                                                                        <XAxis
                                                                            type="number"
                                                                            tick={<CustomizedAxisTick />}
                                                                        />
                                                                        <YAxis
                                                                            width={yAxisWidth}
                                                                            dataKey="label"
                                                                            type="category"
                                                                        />
                                                                        <Tooltip content={<LGProfileCustomTooltip />} />
                                                                        {/* <Tooltip /> */}
                                                                        <Legend align="center" content={LGProfileRenderLegend} />
                                                                        <Bar
                                                                            dataKey="value"
                                                                            fill="#2A7BBB"
                                                                            stackId="a"
                                                                            barSize={25}
                                                                        />
                                                                    </BarChart>
                                                                </ResponsiveContainer>
                                                            </div>
                                                        ) : <h3 style={{ textAlign: 'center' }}>{t('No Data Available')}</h3>}


                                                </div>


                                            </div>
                                        )
                                    }

                                </div>

                            </div>
                        )
                    }
                </Translation>


                {
                    selectedDataType === 1 || selectedDataType === 2 ? (
                        <>
                            <ChoroplethMap
                                sourceKey={'demographics-profile'}
                                paint={legendPaint}
                                mapState={mapState}
                                tooltipRenderer={(prop: any) => Tool(prop)}
                                isDamageAndLoss
                                regionLevel={filters && filters.region && filters.region.adminLevel + 1 || 1}
                            />

                            {/* <CommonMap
                            sourceKey="profile-demographics"
                        /> */}
                            <div className={_cs('map-legend-container', styles.legendContainer)}>
                                <ChoroplethLegend
                                    className={styles.legend}
                                    legend={legend}
                                    minValue={min}
                                />
                            </div>

                        </>

                    )
                        : (
                            <>
                                {/* <MapSource
                                    sourceKey="lg-profile-data"
                                    sourceOptions={{
                                        type: 'vector',
                                        url: mapSources.nepal.url,
                                    }}
                                >
                                    <MapLayer
                                        layerKey="choropleth-layer-22"
                                        layerOptions={{
                                            type: 'fill',
                                            'source-layer': mapSources.nepal.layers.municipality,
                                            paint: { 'fill-color': '#F6F6F4' },

                                        }}
                                    />
                                </MapSource> */}
                                <CommonMap sourceKey="lg-profile" />
                                <MapSource
                                    sourceKey="resource-symbol-education"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: false,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={LGProfilehouseHold}
                                >
                                    <MapLayer
                                        layerKey="cluster-education"
                                        // onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.education,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-education"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['has', 'point_count'],
                                            layout: {
                                                'text-field': '{point_count_abbreviated}',
                                                'text-size': 12,
                                            },
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="resource-symbol-background-education"
                                        onClick={this.handleResourceClick}
                                        // onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],

                                            paint: mapStyles.resourcePoint.education,
                                        }}
                                    />
                                    {resourceLngLat && houseHoldInformation && (
                                        <MapTooltip
                                            coordinates={resourceLngLat}
                                            tooltipOptions={tooltipOptions}
                                            onHide={this.handleTooltipClose}

                                        >
                                            <Translation>
                                                {
                                                    t => (
                                                        <div style={{ margin: '10px' }}>
                                                            <div style={{ marginTop: '20px', marginBottom: '20px' }}>

                                                                <h1>
                                                                    {t('Household ID')}
                                                                    :
                                                                    {' '}
                                                                    {houseHoldInformation.houseNo}
                                                                </h1>
                                                                <table id={styles.customers}>

                                                                    <tr>
                                                                        <td>{t('Total Number of family members')}</td>

                                                                        <td><b>{houseHoldInformation.totalFamilyMembers}</b></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>{t('Ethinicity')}</td>

                                                                        <td><b>{houseHoldInformation.ethnicity}</b></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>{t('Religion')}</td>

                                                                        <td><b>{houseHoldInformation.religion}</b></td>
                                                                    </tr>


                                                                </table>
                                                            </div>
                                                            <div style={{ height: '200px', overflowY: 'scroll' }}>
                                                                <div

                                                                    role="button"
                                                                    tabIndex={0}
                                                                    onClick={() => this.setState({ enableSensitivePopulationDiv: !enableSensitivePopulationDiv })}
                                                                    onKeyDown={undefined}

                                                                    style={{
                                                                        marginTop: '10px',
                                                                        marginBottom: '10px',
                                                                        cursor: 'pointer',
                                                                        borderBottom: '1px solid #AEAEAE',
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        paddingTop: '10px',
                                                                        paddingBottom: '10px',
                                                                        marginRight: '5px',
                                                                    }}
                                                                >
                                                                    <h3>{t('Sensative Populations')}</h3>
                                                                    <Icon
                                                                        name={enableSensitivePopulationDiv
                                                                            ? 'lgprofilePopupUpArrow'
                                                                            : 'lgprofilePopupDownArrow'}
                                                                    />
                                                                </div>
                                                                {enableSensitivePopulationDiv
                                                                    ? (
                                                                        <div>
                                                                            <table id={styles.customers}>

                                                                                <tr>
                                                                                    <td>{t('Above 60 years old')}</td>

                                                                                    <td><b>{houseHoldInformation.peopleAboveSixty || '-'}</b></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>{t('Pregnant Women')}</td>

                                                                                    <td><b>{houseHoldInformation.totalPregnantAndLactatingWomen || '-'}</b></td>
                                                                                </tr>
                                                                                {/* <tr>
                                                                        <td>Lactating Mother</td>

                                                                        <td><b>5</b></td>
                                                                    </tr> */}
                                                                                <tr>
                                                                                    <td>{t('People With Disability')}</td>

                                                                                    <td><b>{totalDisableCount}</b></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>{t('Children Below 5 Years old')}</td>

                                                                                    <td><b>{houseHoldInformation.peopleBelowFive || '-'}</b></td>
                                                                                </tr>

                                                                            </table>
                                                                        </div>
                                                                    ) : ''}
                                                                <div

                                                                    role="button"
                                                                    tabIndex={0}
                                                                    onClick={() => this.setState({ enableBuildingStructureDiv: !enableBuildingStructureDiv })}
                                                                    onKeyDown={undefined}

                                                                    style={{
                                                                        marginTop: '10px',
                                                                        marginBottom: '10px',
                                                                        cursor: 'pointer',
                                                                        borderBottom: '1px solid #AEAEAE',
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        paddingTop: '10px',
                                                                        paddingBottom: '10px',
                                                                        marginRight: '5px',
                                                                    }}
                                                                >
                                                                    <h3>{t('Building Structure')}</h3>
                                                                    <Icon

                                                                        name={enableBuildingStructureDiv
                                                                            ? 'lgprofilePopupUpArrow'
                                                                            : 'lgprofilePopupDownArrow'}
                                                                    />
                                                                </div>
                                                                {enableBuildingStructureDiv
                                                                    ? (
                                                                        <div>
                                                                            <table id={styles.customers}>

                                                                                <tr>
                                                                                    <td>{t('Age of Building')}</td>

                                                                                    <td>
                                                                                        <b>
                                                                                            {houseHoldInformation.buildingAge}
                                                                                            {' '}
                                                                                            {t('Years')}
                                                                                        </b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>{t('Number of Stories')}</td>

                                                                                    <td><b>{houseHoldInformation.numberOfStory}</b></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>{t('Roof Type')}</td>

                                                                                    <td><b>{houseHoldInformation.materialUsedForRoof}</b></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>{t('Building Foundation')}</td>

                                                                                    <td><b>{houseHoldInformation.foundationType}</b></td>
                                                                                </tr>


                                                                            </table>
                                                                        </div>
                                                                    ) : ''}

                                                                <div

                                                                    role="button"
                                                                    tabIndex={0}
                                                                    onClick={() => this.setState({ enableEconomicAspectDiv: !enableEconomicAspectDiv })}
                                                                    onKeyDown={undefined}

                                                                    style={{
                                                                        marginTop: '10px',
                                                                        marginBottom: '10px',
                                                                        cursor: 'pointer',
                                                                        borderBottom: '1px solid #AEAEAE',
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        paddingTop: '10px',
                                                                        paddingBottom: '10px',
                                                                        marginRight: '5px',
                                                                    }}
                                                                >
                                                                    <h3>{t('Economic Aspects')}</h3>
                                                                    <Icon

                                                                        name={enableEconomicAspectDiv
                                                                            ? 'lgprofilePopupUpArrow'
                                                                            : 'lgprofilePopupDownArrow'}
                                                                    />
                                                                </div>
                                                                {enableEconomicAspectDiv
                                                                    ? (
                                                                        <div>
                                                                            <table id={styles.customers}>

                                                                                <tr>
                                                                                    <td>{t('Major Occupation')}</td>

                                                                                    <td>
                                                                                        {majorOccupationList && majorOccupationList.length ? majorOccupationList.map((i: string | number | boolean | {} | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactNodeArray | React.ReactPortal | Iterable<ReactI18NextChild> | null | undefined, index: React.Key | null | undefined) => (
                                                                                            <b key={index}>
                                                                                                {i}
                                                                                                {index === majorOccupationList.length - 1 ? '' : ','}
                                                                                            </b>
                                                                                        )) : '-'}
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>{t('Supporting Occupation')}</td>

                                                                                    <td>
                                                                                        {supportingOccupationList && supportingOccupationList.length ? supportingOccupationList.map((i: string | number | boolean | {} | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactNodeArray | React.ReactPortal | Iterable<ReactI18NextChild> | null | undefined, index: React.Key | null | undefined) => (
                                                                                            <b key={index}>
                                                                                                {i}
                                                                                                {index === supportingOccupationList.length - 1 ? '' : ','}
                                                                                            </b>
                                                                                        )) : '-'}
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>{t('Annual Income')}</td>

                                                                                    <td><b>{houseHoldInformation.annualIncome}</b></td>
                                                                                </tr>


                                                                            </table>
                                                                        </div>
                                                                    ) : ''}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </Translation>
                                        </MapTooltip>
                                    )}
                                </MapSource>
                                <CommonMap sourceKey="lg-profile" />
                            </>
                        )

                }
            </>
        );
    }
}

export default compose(connect(mapStateToProps),
    createRequestClient(requestOptions))(Demographics);
