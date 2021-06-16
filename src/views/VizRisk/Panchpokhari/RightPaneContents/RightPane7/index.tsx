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
    getageGroupChartData,
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
            ageGroupChartData: [],
        };
    }


    public componentDidMount() {
        const { vulData } = this.props;
        if (vulData.length > 0) {
            this.setState({ buildingVulnerability: getbuildingVul(vulData) });
            this.setState({ foundationTypeChartData: getfoundationTypeChartData(vulData) });
            this.setState({ socialFactorChartData: getsocialFactorChartData(vulData) });
            this.setState({ ageGroupChartData: getageGroupChartData(vulData) });
        }
    }

    public componentDidUpdate(prevProps) {
        const {
            vulData,
            drawChartData,
            singularBuldingData,
            singularBuilding,
        } = this.props;
        if (vulData !== prevProps.vulData) {
            if (vulData.length > 0) {
                this.setState({ buildingVulnerability: getbuildingVul(vulData) });
                this.setState({ foundationTypeChartData: getfoundationTypeChartData(vulData) });
                this.setState({ socialFactorChartData: getsocialFactorChartData(vulData) });
                this.setState({ ageGroupChartData: getageGroupChartData(vulData) });
            }
        }
        if (drawChartData !== prevProps.drawChartData) {
            if (drawChartData.length > 0) {
                const selectedPoints = drawChartData[drawChartData.length - 1].bPoints;
                const selected = selectedPoints.map(sp => this.getPtSelectedData(sp, vulData));
                const finalArr = selected.filter(f => f !== null);
                this.setState({ buildingVulnerability: getbuildingVul(finalArr) });
                this.setState({ foundationTypeChartData: getfoundationTypeChartData(finalArr) });
                this.setState({ socialFactorChartData: getsocialFactorChartData(finalArr) });
                this.setState({ ageGroupChartData: getageGroupChartData(finalArr) });
            }
        }
    }


    public handleRefClick = () => {
        this.setState(prevState => ({
            showReferences: !prevState.showReferences,
        }));
    }

    public getPtSelectedData = (s, vd) => {
        const pointsUF = vd.filter(f => f.point !== undefined);
        const points = pointsUF.map(p => p.point);

        const a = vd.filter(v => v.point !== undefined
            && String(v.point.coordinates[0]) === s[0].toFixed(6)
            && String(v.point.coordinates[1]) === s[1].toFixed(6));

        if (a.length > 0) {
            return a[0];
        }
        return null;
    }

    public handleBackBtn = () => {
        this.props.setSingularBuilding(false);
    }

    public getVulnerabilityLvl = (v) => {
        if (v) {
            if (v < 50) {
                return 'Low';
            } if (v >= 50 && v < 60) {
                return 'Medium';
            }
            return 'High';
        }
        return '-';
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
            singularBuilding,
        } = this.props;

        const {
            buildingVulnerability,
            foundationTypeChartData,
            socialFactorChartData,
            ageGroupChartData,
            singularAgeGroupsChart,
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

        return (
            <div className={styles.vrSideBar}>
                <h1>Vulnerability of People and Households </h1>
                { singularBuilding
                    ? (
                        <>
                            <p>
                            House ID No:
                                {' '}
                                {singularBuilding.houseOwnerId || '-'}
                                {' '}
                            </p>
                            <div className={styles.vulScoreRow}>
                                <span>VULNERABILITY OF THE HOUSEHOLD</span>
                                {this.getVulnerabilityLvl(singularBuilding.vulnerabilityScore)}
                            </div>

                            <p>
                                The physical, social and economic fators were
                                considered to identify the vulnerability of
                                the household
                            </p>
                            <p>
                                Physical Factors
                            </p>
                            <table className={styles.singularPaneTable}>
                                <tr>
                                    <td>
                                        Roof Type
                                    </td>
                                    <td>
                                        {singularBuilding.foundationType || '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                    Storey
                                    </td>
                                    <td>
                                        {singularBuilding.storeys || '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                    Ground surface
                                    </td>
                                    <td>
                                        {singularBuilding.groundSurface || '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                    Building condition
                                    </td>
                                    <td>
                                        {singularBuilding.buildingCondition || '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                    Damage Grade
                                    </td>
                                    <td>
                                        {singularBuilding.buildingCondition || '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                    Distance from road (m)
                                    </td>
                                    <td>
                                        {singularBuilding.roadDistance || '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                    Drinking water distance (m)
                                    </td>
                                    <td>
                                        {singularBuilding.drinkingWaterDistance || '-'}
                                    </td>
                                </tr>
                            </table>

                            <p>
                                Social Factors
                            </p>
                            <table className={styles.singularPaneTable}>
                                <tr>
                                    <td>Number of people</td>
                                    {singularBuilding.totalPopulation || '-'}
                                </tr>
                                <tr>
                                    <td>Ownership of house</td>
                                    {singularBuilding.ownership || '-'}
                                </tr>
                                <tr>
                                    <td>People with disability</td>
                                    {singularBuilding.peopleWithDisability || '-'}
                                </tr>
                                <tr>
                                    <td>Medical centers</td>
                                    {singularBuilding.medicalCenter || '-'}
                                </tr>
                                <tr>
                                    <td>Distance from Security centers</td>
                                    {singularBuilding.policeStationDistance || '-'}
                                </tr>
                                <tr>
                                    <td>Distance from Schools</td>
                                    {singularBuilding.schoolDistance || '-'}
                                </tr>
                                <tr>
                                    <td>Distance from open space</td>
                                    {singularBuilding.openSafeSpaceDistance || '-'}
                                </tr>
                            </table>

                            <ResponsiveContainer className={styles.respContainer} width="100%" height={250}>
                                <BarChart
                                    width={350}
                                    height={600}
                                    data={getageGroupChartData(singularBuilding)}
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
                                Economic Factors
                                <ul>
                                    <li>
Main source of income:
                                        {' '}
                                        {singularBuilding.majorOccupation || '-'}
                                        {' '}
                                    </li>
                                    <li>
Average yearly income:
                                        {' '}
                                        {singularBuilding.averageAnnualIncome || '-'}
                                        {' '}
                                    </li>

                                </ul>
                            </p>
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
                                    data={ageGroupChartData}
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
                        </>
                    )
                }


                {/* <SourceInfo /> */}
            </div>
        );
    }
}

export default SlideFivePane;
