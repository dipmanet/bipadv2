import React, { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Label,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';
import styles from '../../styles.scss';


interface Props{
    handleNext: () => void;
    handlePrev: () => void;
    pagenumber: number;
    totalPages: number;
    pending: boolean;

}
const generateYearsArr = () => {
    const max = new Date().getFullYear();
    const min = 2011;
    const years = [];
    // eslint-disable-next-line no-plusplus
    for (let i = max; i >= min; i--) {
        years.push(i);
    }

    return years;
};

const getTotalLoss = (year, arr) => {
    const temp = arr
        .filter((incident) => {
            const yearInt = new Date(`${year}-01-01`).getTime();
            const nextYear = new Date(`${Number(year) + 1}-01-01`).getTime();
            return incident.date > yearInt && incident.date < nextYear;
        })
        .map(l => l.loss);
    if (temp.length > 0) {
        return temp
            .reduce((a, b) => ({ peopleDeathCount:
                (Number(b.peopleDeathCount) || 0) + (Number(a.peopleDeathCount) || 0) }))
            .peopleDeathCount;
    }

    return 0;
};

const LeftPane7 = (props: Props) => {
    const [incidentChart, setIncidentChart] = useState([]);
    const [lossChart, setLossChart] = useState([]);
    const { landSlide } = props;

    useEffect(() => {
        if (landSlide) {
            const yearsArr = generateYearsArr();
            const noIncidentsChart = yearsArr.map(item => ({
                name: item,
                Total: landSlide.filter((incident) => {
                    const yearInt = new Date(`${item}-01-01`).getTime();
                    const nextYear = new Date(`${Number(item) + 1}-01-01`).getTime();
                    const inciDate = new Date(incident.date).getTime();
                    return inciDate > yearInt && inciDate < nextYear;
                }).length,
            }));

            const loss = yearsArr.map(item => ({
                name: item,
                Total: getTotalLoss(item, landSlide),
            }));
            setIncidentChart(noIncidentsChart);
            setLossChart(loss);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className={styles.vrSideBar}>
            <h1>Past Landslide Incidents</h1>
            <p className={styles.narrativeText}>
                In the year 2020, 3 landslide incidents
                have occurred in the municipality. 8 people
                lost their lives, 32 went missing and 47
                houses were destroyed.
            </p>

            <p>NO. OF INCIDENTS</p>
            <div className={styles.climateChart}>
                <ResponsiveContainer width={'100%'} height={'100%'}>
                    <BarChart
                        data={incidentChart}
                        layout="vertical"
                        margin={{ left: 20, right: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fill: '#94bdcf' }}
                        />
                        <Bar
                            dataKey="Total"
                            fill="rgb(0,219,95)"
                            barSize={20}
                            label={{ position: 'right', fill: '#ffffff' }}
                            tick={{ fill: '#94bdcf' }}
                            radius={[0, 20, 20, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p>LOSS INFORMATION</p>
            <div className={styles.climateChart}>
                <ResponsiveContainer width={'100%'} height={'100%'}>
                    <BarChart
                        width={300}
                        height={600}
                        data={lossChart}
                        layout="vertical"
                        margin={{ left: 20, right: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number">
                            <Label
                                value="No. of deaths"
                                offset={0}
                                position="insideBottom"
                                style={{
                                    textAnchor: 'middle',
                                    fill: 'rgba(255, 255, 255, 0.87)',
                                }}
                            />
                        </XAxis>
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fill: '#94bdcf' }}
                        />
                        <Label
                            value="No. of deaths"
                            offset={0}
                            position="insideBottom"
                            style={{
                                textAnchor: 'middle',
                                fill: 'rgba(255, 255, 255, 0.87)',
                            }}
                        />
                        <Bar
                            dataKey="Total"
                            fill="rgb(0,219,95)"
                            barSize={20}
                            label={{ position: 'right', fill: '#ffffff' }}
                            tick={{ fill: '#94bdcf' }}
                            radius={[0, 20, 20, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LeftPane7;
