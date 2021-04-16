import React from 'react';
import { ComposedChart,
    Line,
    Area,
    Bar,
    YAxis,
    XAxis,
    CartesianGrid,
    Legend,
    Scatter,
    ResponsiveContainer,
    BarChart } from 'recharts';
import styles from './styles.scss';
import LineData from './data';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import DamageAndLoss from '../../DamageAndLoss';
import Inventory from '../../Inventory';

interface Props{
    reportData: Element[];
}

const Preview = (props: Props) => {
    const { reportData } = props;
    const {
        lineData,
        composedChart,
        scatterChart,
        barChart,
    } = LineData;
    return (
        <div className={styles.previewContainer}>
            {/* {reportData.map(comp => (
                <div key={comp.name} className={styles.previewComps}>

                    {comp}
                </div>
            ))} */}
            <div className={styles.rowOne}>
                <DamageAndLoss />
            </div>
            <div className={styles.rowTwo}>
                <div className={styles.columnTwoOne}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            width={500}
                            height={400}
                            data={scatterChart}
                            margin={{
                                top: 20,
                                right: 80,
                                bottom: 20,
                                left: 20,
                            }}
                        >
                            <CartesianGrid stroke="#f5f5f5" />
                            <Legend />
                            <XAxis dataKey="index" type="number" label={{ value: 'Index', position: 'insideBottomRight', offset: 0 }} />
                            <YAxis unit="ms" type="number" label={{ value: 'Time', angle: -90, position: 'insideLeft' }} />
                            <Scatter name="red" dataKey="red" fill="red" />
                            <Scatter name="blue" dataKey="blue" fill="blue" />
                            <Line dataKey="blueLine" stroke="blue" dot={false} activeDot={false} legendType="none" />
                            <Line dataKey="redLine" stroke="red" dot={false} activeDot={false} legendType="none" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.columnTwoTwo}>
                    <div className={styles.title}>
                        <h3>Table 2</h3>
                        <p>Something or the other</p>
                    </div>
                    {reportData[1]}
                </div>
            </div>
            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                    <Inventory width={'100%'} />
                </div>
                <div className={styles.columnThreeTwo}>
                    <Inventory width={'100%'} />

                </div>
            </div>
            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                    <div className={styles.title}>
                        <h3>Table 3</h3>
                        <p>Something or the other</p>
                    </div>
                    {reportData[0]}
                </div>
                <div className={styles.columnThreeTwo}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={barChart}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Legend />
                            <Bar dataKey="pv" fill="#8884d8" />
                            <Bar dataKey="uv" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                    <div className={styles.title}>
                        <h3>Table 3</h3>
                        <p>Something or the other</p>
                    </div>
                    {reportData[0]}
                </div>
                <div className={styles.columnThreeTwo}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={barChart}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Legend />
                            <Bar dataKey="pv" fill="#8884d8" />
                            <Bar dataKey="uv" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                    <div className={styles.title}>
                        <h3>Table 3</h3>
                        <p>Something or the other</p>
                    </div>
                    {reportData[0]}
                </div>
                <div className={styles.columnThreeTwo}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={barChart}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Legend />
                            <Bar dataKey="pv" fill="#8884d8" />
                            <Bar dataKey="uv" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>


    );
};

export default Preview;
