import React from 'react';

import {
    Bar, BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import styles from './styles.scss';
import Home from '#resources/icons/homeNew.svg';
import criticalInfraData from '#views/VizRisk/Rajapur/Data/criticalInfraData';
import NavButtons from '../../Components/NavButtons';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';

// const chartData = criticalInfraData.safeShelterData;

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b', '#016cc3'];

class SlideFivePane extends React.PureComponent<Props, State> {
    public constructor(props) {
        super();
        this.state = {
            showReferences: true,
        };
    }

    public handleRefClick = () => {
        this.setState(prevState => ({
            showReferences: !prevState.showReferences,
        }));
    }

    public render() {
        const {
            handleNext,
            handlePrev,
            disableNavLeftBtn,
            disableNavRightBtn,
            pagenumber,
            totalPages,
            drawChartData,
        } = this.props;
        const chartDataTitles = [...new Set(drawChartData.map(item => item.hazardTitle))];
        const chartData = chartDataTitles.map(h => ({
            name: h,
            Total: drawChartData.filter(i => i.hazardTitle === h).length,
        }));
        chartData.push({
            name: 'Buildings',
            Total: drawChartData[drawChartData.length - 1]
                ? drawChartData[drawChartData.length - 1].buildings
                : 0,
        });

        console.log('chartdata:', chartData);

        return (
            <div className={styles.vrSideBar}>
                <h1>Vulnerability of people and infrastructures </h1>
                <p>
                Vulnerability is the conditions which increase the
                susceptibility of a community to the impact of hazards.
                The vulnerability level of each household has been visualized
                in the map in 3 different colors. Red siginifies the high
                vulnerability level, blue denotes moderate and gray
                denotes the low vulnerability level. Physical, social and
                economic factors were considered to identify the vulnerability
                of each household.
                </p>
                <p>
                CLASSIFICATION OF BUILDINGS BASED ON THE VULNERABILITY
                </p>
                <div className={styles.buildingClassContainer}>
                    <div className={styles.levelContainer}>
                        <span>
                            High
                        </span>
                        <div className={styles.iconLevel}>
                            <ScalableVectorGraphics
                                className={styles.high}
                                src={Home}
                            />
                            <span className={styles.number}>55</span>
                        </div>
                    </div>
                    <div className={styles.levelContainer}>
                        <span>
                            Medium
                        </span>
                        <div className={styles.iconLevel}>
                            <ScalableVectorGraphics
                                className={styles.med}
                                src={Home}
                            />
                            <span className={styles.number}>22</span>
                        </div>
                    </div>
                    <div className={styles.levelContainer}>
                        <span>
                            Low
                        </span>
                        <div className={styles.iconLevel}>
                            <ScalableVectorGraphics
                                className={styles.low}
                                src={Home}
                            />
                            <span className={styles.number}>10</span>
                        </div>
                    </div>
                </div>
                <p>
                    VULNERABILITY OF BUILDINGS
                </p>

                <ResponsiveContainer className={styles.respContainer} width="100%" height={'50%'}>
                    <BarChart
                        width={350}
                        height={600}
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 10, bottom: 10, right: 25, left: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fill: '#94bdcf' }} />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fill: '#94bdcf' }}
                        />
                        <Tooltip />
                        <Bar
                            dataKey="Total"
                            fill="rgb(0,219,95)"
                            barSize={15}
                            label={{ position: 'right', fill: '#ffffff' }}
                            radius={[0, 15, 15, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>

                <p>
                     VULNERABLE GROUPS OF PEOPLE
                </p>

                <ResponsiveContainer className={styles.respContainer} width="100%" height={'50%'}>
                    <BarChart
                        width={350}
                        height={600}
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 10, bottom: 10, right: 25, left: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fill: '#94bdcf' }} />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fill: '#94bdcf' }}
                        />
                        <Tooltip />
                        <Bar
                            dataKey="Total"
                            fill="rgb(0,219,95)"
                            barSize={15}
                            label={{ position: 'right', fill: '#ffffff' }}
                            radius={[0, 15, 15, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>

                <p>
                     AGE GROUPS
                </p>

                <ResponsiveContainer className={styles.respContainer} width="100%" height={'50%'}>
                    <BarChart
                        width={350}
                        height={600}
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 10, bottom: 10, right: 25, left: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fill: '#94bdcf' }} />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fill: '#94bdcf' }}
                        />
                        <Tooltip />
                        <Bar
                            dataKey="Total"
                            fill="rgb(0,219,95)"
                            barSize={15}
                            label={{ position: 'right', fill: '#ffffff' }}
                            radius={[0, 15, 15, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>

                <NavButtons
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                    disableNavLeftBtn={disableNavLeftBtn}
                    disableNavRightBtn={disableNavRightBtn}
                    pagenumber={pagenumber}
                    totalPages={totalPages}
                />

                {/* <SourceInfo /> */}
            </div>
        );
    }
}

export default SlideFivePane;
