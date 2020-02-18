import React from 'react';
import { connect } from 'react-redux';
import {
    _cs,
    doesObjectHaveNoData,
} from '@togglecorp/fujs';
import {
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Bar,
    LabelList,
    Cell,
} from 'recharts';
import { format } from 'd3-format';
import {
    regionSelector,
    regionNameSelector,
    municipalitiesSelector,
} from '#selectors';
import {
    AppState,
} from '#store/types';
import {
    Region,
    Municipality,
} from '#store/atom/page/types';
import ListView from '#rscv/List/ListView';

import styles from './styles.scss';

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
interface Attribute {
    key: string;
    label: string;
    value: number;
}

const chartMargin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

const yAxisWidth = 64;

const SummaryValue = (props: { data: Attribute }) => {
    const {
        data: {
            label,
            value,
        },
    } = props;

    return (
        <div className={styles.summary}>
            <div className={styles.value}>
                {value}
            </div>
            <div className={styles.label}>
                {label}
            </div>
        </div>
    );
};

const keySelector = (d: Attribute) => d.key;
const mapStateToProps = (state: AppState): PropsFromState => ({
    municipalities: municipalitiesSelector(state),
    region: regionSelector(state),
    regionName: regionNameSelector(state),
});
class Demographics extends React.PureComponent<Props> {
    private getPopulationData = (data: DemographicsData[], region: Region) => {
        let filteredData = data;
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
        const { totalPopulation, malePopulation, femalePopulation } = data;
        return ([
            { key: 'totalPopulation', label: 'Total Population', value: totalPopulation },
            {
                key: 'malePopulation',
                label: 'Male',
                value: malePopulation,
                color: '#64b5f6',
                percent: ((malePopulation / totalPopulation) * 100).toFixed(2),
            },
            {
                key: 'femalePopulation',
                label: 'Female',
                value: femalePopulation,
                color: '#f06292',
                percent: ((femalePopulation / totalPopulation) * 100).toFixed(2),
            },
        ]);
    }

    private getLiteracySummary = (data: SummaryData) => {
        const { literacyRate, maleLiteracyRate, femaleLiteracyRate } = data;
        return ([
            {
                key: 'literacyRate',
                label: 'Literacy Rate',
                value: literacyRate.toFixed(2),
            },
            {
                key: 'maleLiteracyRate',
                label: 'Male',
                color: '#64b5f6',
                value: maleLiteracyRate.toFixed(2),
            },
            {
                key: 'femaleLiteracyRate',
                label: 'Female',
                color: '#f06292',
                value: femaleLiteracyRate.toFixed(2),
            },
        ]);
    }

    private getHouseholdSummary = (data: SummaryData) => {
        const { totalPopulation, householdCount } = data;
        return ([
            { key: 'totalPopulation', label: 'Total Population', value: totalPopulation },
            { key: 'householdCount', label: 'Household Count', value: householdCount },
        ]);
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
                female: female[v as keyof AgeGroup],
            }
        ));
    }

    private rendererParams = (_: string, data: Attribute) => ({ data });

    public render() {
        const {
            pending,
            className,
            data = [],
            regionName,
            region,
        } = this.props;

        const demographics = this.getPopulationData(data, region);
        const populationSummary = this.getPopulationSummary(demographics);
        const sexRatio = populationSummary
            .filter(v => ['malePopulation', 'femalePopulation'].includes(v.key));
        const literacySummary = this.getLiteracySummary(demographics);
        const literacyRatio = literacySummary
            .filter(v => ['maleLiteracyRate', 'femaleLiteracyRate'].includes(v.key));
        const householdSummary = this.getHouseholdSummary(demographics);
        const ageGroupSummary = this.getAgeGroupSummary(demographics);
        const title = `Demographics of ${regionName}`;

        return (
            <div className={_cs(styles.demographics, className)}>
                <header className={styles.header}>
                    <h2 className={styles.heading}>
                        {title}
                    </h2>
                </header>
                { !pending && (
                    <div className={styles.content}>
                        <div className={styles.demographyContainer}>
                            <header className={styles.header}>
                                <h3 className={styles.heading}>
                                    Population
                                </h3>
                            </header>
                            <ListView
                                className={styles.info}
                                data={populationSummary}
                                renderer={SummaryValue}
                                keySelector={keySelector}
                                rendererParams={this.rendererParams}
                            />
                            <div className={styles.chartContainer}>
                                <ResponsiveContainer>
                                    <BarChart
                                        data={sexRatio}
                                        layout="vertical"
                                        margin={chartMargin}
                                    >
                                        <XAxis type="number" />
                                        <YAxis
                                            width={yAxisWidth}
                                            dataKey="label"
                                            type="category"
                                        />
                                        <Bar
                                            dataKey="value"
                                            fill="#dcdcde"
                                        >
                                            { sexRatio.map(v => (
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
                        </div>
                        <div className={styles.demographyContainer}>
                            <header className={styles.header}>
                                <h3 className={styles.heading}>
                                    Literacy
                                </h3>
                            </header>
                            <ListView
                                className={styles.info}
                                data={literacySummary}
                                renderer={SummaryValue}
                                keySelector={keySelector}
                                rendererParams={this.rendererParams}
                            />
                            <div className={styles.chartContainer}>
                                <ResponsiveContainer>
                                    <BarChart
                                        data={literacyRatio}
                                        layout="vertical"
                                        margin={chartMargin}
                                    >
                                        <XAxis type="number" />
                                        <YAxis
                                            width={yAxisWidth}
                                            dataKey="label"
                                            type="category"
                                        />
                                        <Bar
                                            dataKey="value"
                                        >
                                            { literacyRatio.map(v => (
                                                <Cell
                                                    key={v.key}
                                                    fill={v.color}
                                                />
                                            ))}
                                            <LabelList
                                                className={styles.label}
                                                dataKey="value"
                                                position="insideRight"
                                                formatter={value => `${Number(value).toFixed(2)} %`}
                                            />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className={styles.demographyContainer}>
                            <header className={styles.header}>
                                <h3 className={styles.heading}>
                                    Household
                                </h3>
                            </header>
                            <ListView
                                className={styles.info}
                                data={householdSummary}
                                renderer={SummaryValue}
                                keySelector={keySelector}
                                rendererParams={this.rendererParams}
                            />
                            <div className={styles.chartContainer}>
                                <ResponsiveContainer>
                                    <BarChart
                                        margin={chartMargin}
                                        data={householdSummary}
                                        layout="vertical"
                                    >
                                        <XAxis type="number" />
                                        <YAxis
                                            width={yAxisWidth}
                                            dataKey="label"
                                            type="category"
                                        />
                                        <Bar
                                            dataKey="value"
                                            fill="#e35163"
                                        >
                                            <LabelList
                                                className={styles.label}
                                                dataKey="value"
                                                position="insideRight"
                                                formatter={value => format('.2s')(value)}
                                            />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className={_cs(styles.demographyContainer, styles.ageGroup)}>
                            <header className={styles.header}>
                                <h3 className={styles.heading}>
                                    Age Group
                                </h3>
                            </header>
                            <div className={styles.chartContainer}>
                                <ResponsiveContainer>
                                    <BarChart
                                        margin={chartMargin}
                                        data={ageGroupSummary}
                                        layout="vertical"
                                    >
                                        <XAxis type="number" />
                                        <YAxis
                                            width={yAxisWidth}
                                            dataKey="label"
                                            type="category"
                                        />
                                        <Bar
                                            dataKey="male"
                                            fill="#64b5f6"
                                            stackId="a"
                                        />
                                        <Bar
                                            dataKey="female"
                                            fill="#f06292"
                                            stackId="a"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default connect(mapStateToProps)(Demographics);
