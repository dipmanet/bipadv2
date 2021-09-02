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
    { name: 'Ward 1', 2014: 7, 2015: 48, 2016: 47, 2017: 23, 2018: 47, 2019: 57, 2020: 57 },
    { name: 'Ward 2', 2014: 21, 2015: 114, 2016: 110, 2017: 91, 2018: 107, 2019: 105, 2020: 122 },
    { name: 'Ward 3', 2014: 0, 2015: 14, 2016: 7, 2017: 13, 2018: 17, 2019: 17, 2020: 17 },
    { name: 'Ward 4', 2014: 1, 2015: 5, 2016: 4, 2017: 7, 2018: 8, 2019: 8, 2020: 7 },
    { name: 'Ward 5', 2014: 2, 2015: 35, 2016: 37, 2017: 41, 2018: 56, 2019: 52, 2020: 88 },
    { name: 'Ward 6', 2014: 9, 2015: 48, 2016: 37, 2017: 40, 2018: 50, 2019: 53, 2020: 64 },
    { name: 'Ward 7', 2014: 14, 2015: 154, 2016: 132, 2017: 105, 2018: 147, 2019: 131, 2020: 166 },
    { name: 'Ward 8', 2014: 1, 2015: 28, 2016: 5, 2017: 13, 2018: 15, 2019: 15, 2020: 18 },
    { name: 'Ward 9', 2014: 1, 2015: 5, 2016: 8, 2017: 6, 2018: 6, 2019: 4, 2020: 4 },
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
        setReset(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.vrSideBar}>
            <h1>Landslide Inventory</h1>
            <p>
            The map shows the spatial distribution of landslides
            that occurred from 2014 to 2020.  Research suggests that
            a significant proportion of landslide risk in the earthquake
            affected areas comes from the reactivation of existing
            landslides, so this map is useful for visualizing if and how they have changed.
            </p>
            After Gorkha Earthquake 2015, 451 landslide incidents were
            observed in the post monsoon season. Likewise, the higher
             number of post monsoon landslide incidents until date
             occurred in 2020 i.e. 543.
            <p />
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
