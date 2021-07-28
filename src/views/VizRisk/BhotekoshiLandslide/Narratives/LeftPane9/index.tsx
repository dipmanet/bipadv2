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

const ciRef = {
    finance: 'Finance',
    health: 'Hospitals',
    education: 'Educational Institutions',
    helipad: 'Helipad',
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
            const hazardArr = [...new Set(drawData.map(h => h.hazardTitle))]
                .filter(i => i !== undefined);
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
            const resArr = [...new Set(ci.map(h => h.resourceType))].filter(i => i !== undefined);
            const cD = resArr.map(res => ({
                name: ciRef[res],
                Total: ci.filter(item => item.resourceType === res).length,
            }));
            setCIChartData(cD);
            setReset(true);
        }
    }, [chartReset, ci]);

    useEffect(() => {
        if (ci) {
            const resArr = [...new Set(ci.map(h => h.resourceType))].filter(i => i !== undefined);
            const cD = resArr.map(res => ({
                name: ciRef[res],
                Total: ci.filter(item => item.resourceType === res).length,
            }));
            setCIChartData(cD);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.vrSideBar}>
            <h1>Landslide Susceptibility</h1>
            <p>
            The map shows the area of Bhotekoshi Rural
            Municipality in which landslides are likely
            to occur. The red color signifies the higher
            likelihood and blue color signifies the lower
             likelihood of landslide occurrences.
            </p>

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
                    <Tooltip />
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
