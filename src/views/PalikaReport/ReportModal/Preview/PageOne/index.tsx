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
import Logo from '../../../govtLogo.svg';

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

            <div className={styles.header}>
                {/* <img
                    className={styles.logo}
                    src={'https://upload.wikimedia.org/wikipedia/commons/2/23/Emblem_of_Nepal.svg'}
                    alt="Nepal Government Logo"
                /> */}
                <ScalableVectorGraphics
                    className={styles.logo}
                    src={Logo}
                    // src={BulletIcon}
                    alt="Nepal Government Logo"
                />
                <div className={styles.location}>
                    <h1>Rajapur Municipality</h1>
                    <p>Bardiya District, Lumbini Province</p>
                </div>
                <div className={styles.title}>
                    <h3>Disaster Risk Reduction and Management Report </h3>
                    <p>2077/01/12 Lorem Ipsum dolor femet graphics</p>
                </div>

            </div>
            <div className={styles.rowOne}>
                <div className={styles.columnOneOne}>
                    {/* <div className={styles.title}>
                        <h3>Table 1</h3>
                        <p>Something or the other</p>
                    </div> */}
                    <ul className={styles.rolesDesc}>
                        <li>
                            <h2>Palika Pramukh:</h2>
                            {' '}
                            Mr. John Doe
                        </li>
                        <li>
                            <h2>Pramukh Prasasakiya Adhikrit:</h2>
                            {' '}
                            Mr Hari Bahadur
                        </li>
                        <li>
                            <h2>Disaster focal person:</h2>
                            {' '}
                            Mr Ram Bahadur
                        </li>
                    </ul>
                    <div className={styles.subTitle}>
                        <h3>Local Disaster Management Commitee</h3>
                        <div className={styles.dates}>
                            Gathan Samiti: Lorem Ipsum
                            <br />
                            Sadasya Sankhya: 12
                        </div>
                    </div>

                    <h4>Members</h4>
                    <ol className={styles.members}>
                        <li>Nabanit ji , Mob: 98376437647, Nepal </li>
                        <li>Arun ji, Mob: 98376437647, Nepal </li>
                        <li>Biplab ji, Mob: 98376437647, Nepal </li>
                    </ol>
                    {/* {reportData[0]} */}
                </div>
                <div className={styles.columnOneTwo}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            width={500}
                            height={400}
                            data={composedChart}
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 20,
                            }}
                        >
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis dataKey="name" scale="band" />
                            <YAxis />
                            <Legend />
                            <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
                            <Bar dataKey="pv" barSize={20} fill="#413ea0" />
                            <Line type="monotone" dataKey="uv" stroke="#ff7300" />
                            <Scatter dataKey="cnt" fill="red" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
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
            <div className={styles.rowFour}>
                <div className={styles.columnFourOne}>
                    <div className={styles.title}>
                        <h3>Table 3</h3>
                        <p>Something or the other</p>
                    </div>
                    {reportData[0]}
                </div>
                <div className={styles.columnFourTwo}>
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
