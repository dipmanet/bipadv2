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
import Icon from '#rscg/Icon';

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
        console.log('vul data in left pane:', drawChartData);

        const chartDataTitlesuf = [...new Set(drawChartData.map(item => item.hazardTitle))];
        const chartDataTitles = chartDataTitlesuf.filter(item => item !== undefined);
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
        const voBChartData = [
            {
                name: 'Category R3 Flat Roof',
                Total: drawChartData[drawChartData.length - 1]
                    ? Math.round(drawChartData[drawChartData.length - 1].buildings / 3)
                    : 0,
            },
            {
                name: 'Category R2 Heavy Weight',
                Total: drawChartData[drawChartData.length - 1]
                    ? Math.round(drawChartData[drawChartData.length - 1].buildings / 2)
                    : 0,
            },
            {
                name: 'Category R1 Light Wight',
                Total: drawChartData[drawChartData.length - 1]
                    ? Math.round(drawChartData[drawChartData.length - 1].buildings / 6)
                    : 0,
            },
        ];

        const vgofChartData = [
            {
                name: 'Woman Headed',
                Total: 25000,
            },
            {
                name: 'PWD',
                Total: 1500,
            },
            {
                name: 'Lactating',
                Total: 9000,
            },
            {
                name: 'Female',
                Total: 7500,
            },
            {
                name: 'Male',
                Total: 6400,
            },
        ];

        const ageGrpChartData = [
            {
                name: '>71',
                Total: 3500,
            },
            {
                name: '31-50',
                Total: 5500,
            },
            {
                name: '13-18',
                Total: 6300,
            },
            {
                name: '<5',
                Total: 2567,
            },

        ];

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
                            {/* <ScalableVectorGraphics
                                className={styles.high}
                                src={Home}
                            /> */}
                            <Icon
                                name="home"
                                className={styles.high}
                            />
                            <span className={styles.number}>
                                {'> '}
                                10
                            </span>
                        </div>
                    </div>
                    <div className={styles.levelContainer}>
                        <span>
                            Medium
                        </span>
                        <div className={styles.iconLevel}>
                            {/* <ScalableVectorGraphics
                                className={styles.med}
                                src={Home}
                            /> */}
                            <Icon
                                name="home"
                                className={styles.med}
                            />
                            <span className={styles.number}>5 - 10</span>
                        </div>
                    </div>
                    <div className={styles.levelContainer}>
                        <span>
                            Low
                        </span>
                        <div className={styles.iconLevel}>
                            {/* <ScalableVectorGraphics
                                className={styles.low}
                                src={Home}
                            /> */}
                            <Icon
                                name="home"
                                className={styles.low}
                            />
                            <span className={styles.number}>
                                {' '}
                                {'< '}
                                    5
                            </span>
                        </div>
                    </div>
                </div>

                <p>
                    VULNERABILITY OF BUILDINGS
                </p>

                <ResponsiveContainer className={styles.respContainer} width="100%" height={250}>
                    <BarChart
                        width={350}
                        height={600}
                        data={voBChartData}
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

                <ResponsiveContainer className={styles.respContainer} width="100%" height={250}>
                    <BarChart
                        width={350}
                        height={600}
                        data={vgofChartData}
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
                            fill="rgb(0,149,215)"
                            barSize={15}
                            label={{ position: 'right', fill: '#ffffff' }}
                            radius={[0, 15, 15, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>

                <p>
                     AGE GROUPS
                </p>

                <ResponsiveContainer className={styles.respContainer} width="100%" height={250}>
                    <BarChart
                        width={350}
                        height={600}
                        data={ageGrpChartData}
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
                            fill="rgb(213,81,76)"
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
