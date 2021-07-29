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

const ciRef = {
    finance: 'Finance',
    health: 'Hospitals',
    education: 'Educational Institutions',
    helipad: 'Helipad',
};

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

const wardwiseData = [
    { name: 'Ward 1', 2014: 15, 2015: 214, 2016: 235, 2017: 208, 2018: 246, 2019: 213, 2020: 236 },
    { name: 'Ward 2', 2014: 16, 2015: 208, 2016: 111, 2017: 110, 2018: 168, 2019: 152, 2020: 152 },
    { name: 'Ward 3', 2014: 3, 2015: 93, 2016: 83, 2017: 72, 2018: 91, 2019: 72, 2020: 60 },
    { name: 'Ward 4', 2014: 26, 2015: 185, 2016: 168, 2017: 170, 2018: 244, 2019: 250, 2020: 267 },
    { name: 'Ward 5', 2014: 26, 2015: 136, 2016: 107, 2017: 127, 2018: 158, 2019: 142, 2020: 183 },
];

const colorArr = [
    '#808080',
    '#3d26a6',
    '#1e96eb',
    '#80cb57',
    '#ff5500',
    '#a80000',
    '#750000',
];

const epocharr = [
    2014,
    2015,
    2016,
    2017,
    2018,
    2019,
    2020,
];


const LeftPane8 = (props: Props) => {
    const [incidentChart, setIncidentChart] = useState([]);
    const [lossChart, setLossChart] = useState([]);
    const [cichartData, setCIChartData] = useState([]);
    const [reset, setReset] = useState(true);
    const [lschartData, setLschartData] = useState([]);
    const [wardwiseChartData, setwardwiseChartData] = useState([]);
    const {
        drawData,
        landSlide,
        chartReset,
        ci,
        polygonResponse,
        landslideYear,
    } = props;

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
        setwardwiseChartData(wardwiseData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (landslideYear.length > 1) {
            const arr = landslideYear.map(l => String(l));
            arr.push('name');
            const wwcD = wardwiseData.map(ward => Object.keys(ward)
                .filter(key => arr.includes(key))
                .reduce((obj, key) => {
                    // eslint-disable-next-line no-param-reassign
                    obj[key] = ward[key];
                    return obj;
                }, {}));

            console.log('landslideYear', landslideYear);
            console.log('...', [...landslideYear]);
            setwardwiseChartData(wwcD);
        } else {
            setwardwiseChartData(wardwiseData);
        }
    }, [landslideYear]);

    useEffect(() => {
        console.log('draw data', drawData);
        let polyArr = [];
        if (drawData.length > 0) {
            const hazardArr = [...new Set(drawData.map(h => h.hazardTitle))];
            if (landslideYear.length > 1) {
                polyArr = landslideYear;
            } else {
                polyArr = [...new Set(drawData.map(h => h.landslideYear))];
            }

            const filteredHArr = hazardArr.filter(item => item !== undefined);
            const filteredPolyArr = polyArr.filter(item => item !== undefined);

            console.log('filteredPolyArr', filteredHArr);

            const cD = filteredHArr.map(hazard => ({
                name: hazard,
                Total: drawData.filter(item => item.hazardTitle === hazard).length,
            }));

            const pcD = filteredPolyArr.map(poly => ({
                name: poly,
                Total: drawData.filter(item => item.landslideYear === String(poly)).length,
            }));

            setCIChartData(cD);
            setLschartData(pcD);
            setReset(false);
        } else {
            if (landslideYear.length > 1) {
                polyArr = landslideYear;
            } else {
                const yearArr = polygonResponse.features.map((poly) => {
                    const e = poly.properties.Epoch;
                    return e.substr(e.length - 4);
                });
                polyArr = [...new Set(yearArr)];
            }

            const pcD = polyArr.map(year => ({
                name: year,
                Total: polygonResponse.features.filter((polygon) => {
                    const f = polygon.properties.Epoch;
                    return f.substr(f.length - 4) === String(year);
                }).length,
            }));

            setLschartData(pcD);
            setReset(false);
        }
    }, [drawData, landslideYear, polygonResponse.features]);

    useEffect(() => {
        let polyArr = [];
        if (ci) {
            const resArr = [...new Set(ci.map(h => h.resourceType))];
            const filteredArr = resArr.filter(item => item !== undefined);
            const cD = filteredArr.map(res => ({
                name: ciRef[res],
                Total: ci.filter(item => item.resourceType === res).length,
            }));
            setCIChartData(cD);
            setReset(true);
        }
        if (polygonResponse) {
            if (landslideYear.length > 1) {
                polyArr = landslideYear;
            } else {
                const yearArr = polygonResponse.features.map((poly) => {
                    const e = poly.properties.Epoch;
                    return e.substr(e.length - 4);
                });
                polyArr = [...new Set(yearArr)];
            }

            const pcD = polyArr.map(year => ({
                name: year,
                Total: polygonResponse.features.filter((polygon) => {
                    const f = polygon.properties.Epoch;
                    return f.substr(f.length - 4) === String(year);
                }).length,
            }));

            setLschartData(pcD);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartReset, ci, polygonResponse]);


    useEffect(() => {
        if (ci) {
            const resArr = [...new Set(ci.map(h => h.resourceType))];
            const cD = resArr.map(res => ({
                name: ciRef[res],
                Total: ci.filter(item => item.resourceType === res).length,
            }));
            setCIChartData(cD);
        }

        if (polygonResponse) {
            const yearArr = polygonResponse.features.map((poly) => {
                const e = poly.properties.Epoch;
                return e.substr(e.length - 4);
            });
            const uniqueArr = [...new Set(yearArr)];
            const pcD = uniqueArr.map(year => ({
                name: year,
                Total: polygonResponse.features.filter((polygon) => {
                    const f = polygon.properties.Epoch;
                    return f.substr(f.length - 4) === year;
                }).length,
            }));

            setLschartData(pcD);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.vrSideBar}>
            <h1>Landslide Inventory</h1>
            <p>
            The map shows the distribution of landslides that
            occurred in the past. The landslide inventory data
            of the year 2014 to 2020 has been visualized in the
            map. It is known that a significant proportion of
            landslide risk in the earthquake affected areas comes
            from the reactivation of existing landslides, so this
            map is useful for identifying landslides even high on
            the mountainsides above, and for visualising if and how they have changed.

            </p>
            <p>
            After Gorkha Earthquake 2015, 836 landslide incidents
            were seen in the post monsoon season. Likewise,  the
            higher number of post monsoon landslide incidents till
            date occurred in the year 2018 i.e. 907.

            </p>
            <p>
            Source: Durham University
            </p>
            <p>
              NO. OF LANDSLIDES

                {/* {reset ? ' (Municipality) ' : ' (Selected Area) '} */}


            </p>

            {
                lschartData.length > 0
                    ? (
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
                    )
                    : <p>No landslide has occured in the selected area from 2014 to 2020</p>
            }

            <p>
               COMMUNITY INFRASTRUCTURE

                {/* {reset ? ' (Municipality) ' : ' (Selected Area) '} */}


            </p>
            {
                cichartData.length > 0
                    ? (
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
                    ) : <p>No Community Infrastructure exists in the selected area</p>
            }

            <p>NO. OF LANDSLIDE INVENTORY (YEAR WISE)</p>
            <ResponsiveContainer className={styles.respContainer} width="100%" height={600}>
                <BarChart
                    // width={300}
                    // height={600}
                    data={wardwiseChartData}
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
                    <Legend iconType="square" iconSize={10} align="center" height={10} />
                    {
                        epocharr.map((e, i) => (
                            <Bar
                                dataKey={e}
                                fill={colorArr[i]}
                                barSize={20}
                                // label={{ position: 'right', fill: '#ffffff' }}
                                tick={{ fill: '#94bdcf' }}
                                // radius={[0, 20, 20, 0]}
                                stackId="a"
                            />
                        ))
                    }
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LeftPane8;
