import React, { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import styles from './styles.scss';
import Demo from '../../Data/demographicsData';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import ManWoman from '#views/VizRisk/Tikapur/Icons/ManWoman.svg';
import Male from '#views/VizRisk/Tikapur/Icons/male.svg';
import Female from '#views/VizRisk/Tikapur/Icons/female.svg';
import Home from '#views/VizRisk/Tikapur/Icons/home.svg';


const demoChartdata = Demo.demographicsData;

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
    console.log('temp', temp);
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
    const { incidentFilterYear, bahrabiseLandSlide, landSlide } = props;

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
            console.log('loss chart', loss);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className={styles.vrSideBar}>
            <h1>Past Landslide Incidents</h1>
            <p>
                In the year 2020, 3 landslides have
               occurred in the municipality. 18 people lost
               their lives, 32 went missing and 47 infrastructures
               were destroyed due to the incidents.
            </p>

            <p>NO. OF INCIDENTS</p>
            <ResponsiveContainer className={styles.respContainer} width="100%" height={350}>
                <BarChart
                    width={300}
                    height={600}
                    data={incidentChart}
                    layout="vertical"
                    margin={{ left: 20, right: 20 }}
                >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
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

            <p>LOSS INFORMATION</p>
            <ResponsiveContainer className={styles.respContainer} width="100%" height={350}>
                <BarChart
                    width={300}
                    height={600}
                    data={lossChart}
                    layout="vertical"
                    margin={{ left: 20, right: 20 }}
                >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
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
    );
};

export default LeftPane7;
