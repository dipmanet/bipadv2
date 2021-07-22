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

const LeftPane8 = (props: Props) => {
    const [incidentChart, setIncidentChart] = useState([]);
    const [lossChart, setLossChart] = useState([]);
    const [cichartData, setCIChartData] = useState([]);
    const [reset, setReset] = useState(true);
    const [lschartData, setLschartData] = useState(true);
    const { drawData, landSlide, chartReset, ci } = props;

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

    useEffect(() => {
        if (drawData) {
            const hazardArr = [...new Set(drawData.map(h => h.hazardTitle))];
            const cD = hazardArr.map(hazard => ({
                name: hazard,
                Total: drawData.filter(item => item.hazardTitle === hazard).length,
            }));
            setCIChartData(cD);
            setReset(false);
        }
    }, [drawData]);

    useEffect(() => {
        if (ci) {
            const resArr = [...new Set(ci.map(h => h.resourceType))];
            const cD = resArr.map(res => ({
                name: res,
                Total: ci.filter(item => item.resourceType === res).length,
            }));
            setCIChartData(cD);
            setReset(true);
        }
    }, [chartReset, ci]);

    useEffect(() => {
        if (ci) {
            const resArr = [...new Set(ci.map(h => h.resourceType))];
            const cD = resArr.map(res => ({
                name: res,
                Total: ci.filter(item => item.resourceType === res).length,
            }));
            setCIChartData(cD);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.vrSideBar}>
            <h1>Landslide Inventory</h1>
            <p>
                The map shows the distribution of landslides that
                occurred in the past. The landslide inventory data
                of the year 2014 to 2020 has been visualized in the map.
                It is known that a significant proportion of landslide
                risk in the earthquake affected areas comes from the
                reactivation of existing landslides, so this map is
                useful for identifying landslides even high on the
                mountainsides above, and for visualising if and how they have changed.
            </p>
            <p>
                After Gorkha Earthquake 2015, 451 landslide incidents were
                seen in the post monsoon season. Likewise,  the higher number
                of post monsoon landslide incidents till date occurred in the
                year 2020 i.e. 543.
            </p>

            <p>
              NO. OF LANDSLIDES

                {reset ? ' (Municipality) ' : ' (Selected Area) '}


            </p>
            <ResponsiveContainer className={styles.respContainer} width="100%" height={350}>
                <BarChart
                    width={300}
                    height={600}
                    data={lschartData}
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
            <p>
               COMMUNITY INFRASTRUCTURE

                {reset ? ' (Municipality) ' : ' (Selected Area) '}


            </p>
            <ResponsiveContainer className={styles.respContainer} width="100%" height={250}>
                <BarChart
                    width={300}
                    height={600}
                    data={cichartData}
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
    );
};

export default LeftPane8;
