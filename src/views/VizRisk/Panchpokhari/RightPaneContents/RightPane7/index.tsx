/* eslint-disable react/no-did-update-set-state */
import React from 'react';

import {
    Bar, BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import styles from './styles.scss';
import NavButtons from '../../Components/NavButtons';
import Icon from '#rscg/Icon';
import {
    getbuildingVul,
    getfoundationTypeChartData,
    getsocialFactorChartData,
} from '../../utils';

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
            buildingVulnerability: { low: '-', medium: '-', high: '-' },
            foundationTypeChartData: [],
            socialFactorChartData: [],
        };
    }


    public componentDidMount() {
        const { vulData } = this.props;
        if (vulData.length > 0) {
            this.setState({ buildingVulnerability: getbuildingVul(vulData) });
            this.setState({ foundationTypeChartData: getfoundationTypeChartData(vulData) });
            this.setState({ socialFactorChartData: getsocialFactorChartData(vulData) });
        }
    }

    public componentDidUpdate(prevProps) {
        const { vulData } = this.props;
        if (vulData !== prevProps.vulData) {
            if (vulData.length > 0) {
                this.setState({ buildingVulnerability: getbuildingVul(vulData) });
                this.setState({ foundationTypeChartData: getfoundationTypeChartData(vulData) });
            }
        }
    }


    public handleRefClick = () => {
        this.setState(prevState => ({
            showReferences: !prevState.showReferences,
        }));
    }

    public handleBackBtn = () => {
        this.props.setSingularBuilding(false);
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
            vulData,
        } = this.props;

        const {
            buildingVulnerability,
            foundationTypeChartData,
            socialFactorChartData,
        } = this.state;
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
        console.log('vul data', this.state.buildingVulnerability);


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
                <h1>Vulnerability of People and Households </h1>
                { this.props.singularBuilding
                    ? (
                        <>
                            <p>
                        Showing the elements that are vulnerable to multiple
                        hazards and showing the data in terms of Vulnerability
                        Score of the building.
                            </p>
                            <h1>
                       Vulnerability:
                                {' '}
                                Medium
                            </h1>
                            <p>
                        Age Groups
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
                                        fill="rgb(0,219,95)"
                                        barSize={15}
                                        label={{ position: 'right', fill: '#ffffff' }}
                                        radius={[0, 15, 15, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>

                            <button
                                onClick={this.handleBackBtn}
                                type="button"
                                className={styles.backButton}
                            >
                                Back
                            </button>
                        </>
                    )

                    : (
                        <>
                            <p>
                                Vulnerability is the conditions which increase
                                the susceptibility
                                of an individual, household or community to
                                the impact of hazards.
                                The vulnerability level of each household has
                                been visualized in the
                                map in 3 different colors. Red siginifies the
                                high vulnerability level,
                                orange denotes moderate and yellow denotes the
                                low vulnerability level.
                                Physical, social and economic facors were considered to identify the
                                vulnerability of each household.
                            </p>
                            <p>Vulnerability of Buildings </p>
                            <div className={styles.buildingClassContainer}>
                                <div className={styles.levelContainer}>
                                    <span>
                                         High
                                    </span>
                                    <div className={styles.iconLevel}>

                                        <Icon
                                            name="home"
                                            className={styles.high}
                                        />
                                        <span className={styles.number}>
                                            {' '}
                                            {buildingVulnerability.high}
                                            {' '}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.levelContainer}>
                                    <span>
                            Medium
                                    </span>
                                    <div className={styles.iconLevel}>
                                        <Icon
                                            name="home"
                                            className={styles.med}
                                        />
                                        <span className={styles.number}>
                                            {' '}
                                            {buildingVulnerability.medium}
                                            {' '}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.levelContainer}>
                                    <span>
                            Low
                                    </span>
                                    <div className={styles.iconLevel}>
                                        <Icon
                                            name="home"
                                            className={styles.low}
                                        />
                                        <span className={styles.number}>
                                            {' '}
                                            {buildingVulnerability.low}
                                            {' '}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p>
                                PHYSICAL, SOCIAL AND ECONOMIC FACTORS
                            </p>
                            <p>
                                Physical: Foundation Type
                            </p>

                            <ResponsiveContainer className={styles.respContainer} width="100%" height={250}>
                                <BarChart
                                    width={350}
                                    height={600}
                                    data={foundationTypeChartData}
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
                                Social Factors
                            </p>

                            <ResponsiveContainer className={styles.respContainer} width="100%" height={250}>
                                <BarChart
                                    width={350}
                                    height={600}
                                    data={socialFactorChartData}
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
                        </>
                    )
                }
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
