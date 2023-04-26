/* eslint-disable max-len */
/* eslint-disable react/no-did-update-set-state */
import React from 'react';

import {
    Bar, BarChart,
    CartesianGrid,
    Label,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import { isDefined } from '@togglecorp/fujs';
import Loader from 'react-loader';
import NoData from '#views/VizRisk/Common/NoData';
import Icon from '#rscg/Icon';
import HouseholdForm from '#views/VizRisk/Common/HouseholdForm';
import styles from '../styles.scss';
import NavButtons from '../../Components/NavButtons';
import {
    getbuildingVul,
    getfoundationTypeChartData,
    getsocialFactorChartData,
    getageGroupChartData,
    getsingularAgeGroupsChart,
    getownershipChartData,
    getsourceofIncomeChartData,
    getaverageAnnualincomeChartData,
} from '../../utils';


// const chartData = criticalInfraData.safeShelterData;

interface ComponentProps { }

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b', '#016cc3'];

class SlideFivePane extends React.Component<Props, State> {
    public constructor(props) {
        super();
        this.state = {
            showReferences: true,
            buildingVulnerability: { low: '-', medium: '-', high: '-' },
            foundationTypeChartData: [],
            socialFactorChartData: [],
            ageGroupChartData: [],
            foundationChartData: [],
            ownershipChartData: [],
            sourceofIncomeChartData: [],
            averageAnnualincomeChartData: [],
            singularAgeGroupsChart: [],
            individualResponse: undefined,
            showGetData: false,
        };
    }


    public componentDidMount() {
        const { vulData } = this.props;
        if (vulData.length > 0) {
            this.setState({ buildingVulnerability: getbuildingVul(vulData) });
            this.setState({ foundationTypeChartData: getfoundationTypeChartData(vulData) });
            this.setState({ socialFactorChartData: getsocialFactorChartData(vulData) });
            this.setState({ ageGroupChartData: getageGroupChartData(vulData) });
            this.setState({ ownershipChartData: getownershipChartData(vulData) });
            this.setState({ sourceofIncomeChartData: getsourceofIncomeChartData(vulData) });
            this.setState({
                averageAnnualincomeChartData: getaverageAnnualincomeChartData(vulData),
            });
        }
    }

    public componentDidUpdate(prevProps) {
        const {
            vulData,
            drawChartData,
            singularBuldingData,
            singularBuilding,
            resetDrawData,
            indexArray,
            handleDrawResetData,
            showAddForm,
            handleShowAddForm,
        } = this.props;
        if (vulData !== prevProps.vulData) {
            if (vulData.length > 0) {
                this.setState({ buildingVulnerability: getbuildingVul(vulData) });
                this.setState({ foundationTypeChartData: getfoundationTypeChartData(vulData) });
                this.setState({ socialFactorChartData: getsocialFactorChartData(vulData) });
                this.setState({ ageGroupChartData: getageGroupChartData(vulData) });
                this.setState({ ownershipChartData: getownershipChartData(vulData) });
                this.setState({ sourceofIncomeChartData: getsourceofIncomeChartData(vulData) });
                this.setState({
                    averageAnnualincomeChartData: getaverageAnnualincomeChartData(vulData),
                });
            }
        }
        if (singularBuldingData !== prevProps.singularBuldingData) {
            this.setState({
                singularAgeGroupsChart: getsingularAgeGroupsChart(singularBuldingData),
            });

            // this.setState({ showAddForm: false });
            handleShowAddForm(false);
            this.setState({ individualResponse: {} });
        }
        if (drawChartData !== prevProps.drawChartData) {
            if (drawChartData.length > 0) {
                const selectedPoints = drawChartData[drawChartData.length - 1].bPoints;
                const selected = selectedPoints
                    .map(sp => this.getPtSelectedData(sp, indexArray));
                const finalArr = selected.filter(f => f !== null);
                this.setState({ buildingVulnerability: getbuildingVul(finalArr) });
                this.setState({ foundationTypeChartData: getfoundationTypeChartData(finalArr) });
                this.setState({ socialFactorChartData: getsocialFactorChartData(finalArr) });
                this.setState({ ageGroupChartData: getageGroupChartData(finalArr) });
                this.setState({ ownershipChartData: getownershipChartData(finalArr) });
                this.setState({ sourceofIncomeChartData: getsourceofIncomeChartData(finalArr) });
                this.setState({
                    averageAnnualincomeChartData: getaverageAnnualincomeChartData(finalArr),
                });
            }
        }
        if (resetDrawData !== prevProps.resetDrawData) {
            if (vulData.length > 0 && resetDrawData === true) {
                this.setState({ buildingVulnerability: getbuildingVul(vulData) });
                this.setState({ foundationTypeChartData: getfoundationTypeChartData(vulData) });
                this.setState({ socialFactorChartData: getsocialFactorChartData(vulData) });
                this.setState({ ageGroupChartData: getageGroupChartData(vulData) });
                this.setState({ ownershipChartData: getownershipChartData(vulData) });
                this.setState({ sourceofIncomeChartData: getsourceofIncomeChartData(vulData) });
                this.setState({
                    averageAnnualincomeChartData: getaverageAnnualincomeChartData(vulData),
                });
                handleDrawResetData(false);
            }
        }
    }

    public componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.warn(error, errorInfo);
    }

    public handleRefClick = () => {
        this.setState(prevState => ({
            showReferences: !prevState.showReferences,
        }));
    }

    public getPtSelectedData = (s, iA) => {
        const idx = String(s);
        if (isDefined(iA[idx])) {
            return iA[idx];
        }
        return null;
    }

    public handleBackBtn = () => {
        this.props.setSingularBuilding(false);
    }

    public getVulnerabilityLvl = (v) => {
        if (typeof v === 'number') {
            if (v < 50) {
                return 'Low';
            } if (v >= 50 && v <= 60) {
                return 'Medium';
            } if (v > 60) {
                return 'High';
            }
        }
        return '-';
    }

    public handleShowForm = (showAddForm: boolean, individualResponse: array) => {
        // this.setState({ showAddForm });
        this.props.handleShowAddForm(showAddForm);
        this.setState({ showGetData: true });
        if (individualResponse) {
            this.props.appendBuildingData(individualResponse);
        }
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
            singularBuldingData,
            showAddForm,
        } = this.props;

        const {
            buildingVulnerability,
            foundationTypeChartData,
            socialFactorChartData,
            ageGroupChartData,
            singularAgeGroupsChart,
            ownershipChartData,
            sourceofIncomeChartData,
            averageAnnualincomeChartData,
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
                {/* { singularBuilding
                    && (
                        <div className={styles.backBtnContainer}>
                            <button
                                onClick={this.handleBackBtn}
                                type="button"
                                className={styles.backButton}
                            >
                                    Back
                            </button>
                        </div>
                    )
                } */}


                {/* {singularBuilding
                && singularBuldingData
                && Object.keys(singularBuldingData).length === 0
                    && (
                        <>
                            <p>
                                There is no data for the selected building at present.
                            </p>
                            <div className={styles.backBtnContainer}>
                                <button
                                    onClick={this.handleBackBtn}
                                    type="button"
                                    className={styles.backButton}
                                >
                              Back
                                </button>
                            </div>
                        </>
                    )
                } */}
                {singularBuilding
                    && (
                        <>
                            {
                                showAddForm
                                    ? (
                                        <HouseholdForm
                                            buildingData={singularBuldingData}
                                            enumData={this.props.enumData}
                                            osmId={singularBuldingData && singularBuldingData.osmId}
                                            handleShowForm={this.handleShowForm}
                                            updateMap={this.props.updateMap}
                                        />
                                    )
                                    : (
                                        <>
                                            <h1>
                                                Vulnerability of People and Households
                                                <button
                                                    type="button"
                                                    onClick={e => e.preventDefault()}
                                                    title="Vulnerability is the conditions which increase
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
                     vulnerability of each household. The vulnerability level has been calculated for
                     buildings that have complete data on all the physical,
                     social, and economic parameters used for the
                     vulnerability score calculation. Buildings for which the
                     score was not calculated are being displayed in black."
                                                >

                                                    <Icon
                                                        name="info"
                                                        className={styles.infoIcon}
                                                    />
                                                </button>

                                            </h1>
                                            {/* { this.props.buildingdataAddPermission
                                            && (
                                                <button
                                                    type="button"
                                                    onClick={() => this.handleShowForm(true)}
                                                    className={styles.showBtn}
                                                >
                                            Add/Edit Details
                                                </button>
                                            )
                                            } */}
                                            <p>
                                                House ID No:
                                                {' '}
                                                {singularBuldingData && isDefined(singularBuldingData.houseOwnerId)
                                                    ? singularBuldingData.houseOwnerId
                                                    : '-'
                                                }
                                                {' '}
                                            </p>
                                            <div className={styles.vulScoreRow}>
                                                <span>VULNERABILITY OF THE HOUSEHOLD</span>
                                                {singularBuldingData
                                                    && isDefined(singularBuldingData.vulnerabilityScore)
                                                    ? this.getVulnerabilityLvl(singularBuldingData.vulnerabilityScore)
                                                    : '-'
                                                }
                                            </div>

                                            <p>
                                                The physical, social and economic fators were
                                                considered to identify the vulnerability of
                                                the household
                                            </p>
                                            <p>
                                                PHYSICAL FACTORS
                                            </p>

                                            <table className={styles.singularPaneTable}>
                                                <tr>
                                                    <td>
                                                        Foundation Type
                                                    </td>
                                                    <td>
                                                        {(singularBuldingData && singularBuldingData.foundationType) || '-'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Roof Type
                                                    </td>
                                                    <td>
                                                        {(singularBuldingData && singularBuldingData.roofType) || '-'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Storey
                                                    </td>
                                                    <td>
                                                        {(singularBuldingData && singularBuldingData.storeys) || '-'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Ground surface
                                                    </td>
                                                    <td>
                                                        {(singularBuldingData && singularBuldingData.groundSurface) || '-'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Building condition
                                                    </td>
                                                    <td>
                                                        {(singularBuldingData && singularBuldingData.buildingCondition) || '-'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Damage Grade
                                                    </td>
                                                    <td>
                                                        {(singularBuldingData && singularBuldingData.damageGrade) || '-'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Distance from road (meter)
                                                    </td>
                                                    <td>
                                                        {(singularBuldingData && singularBuldingData.roadDistance) || '-'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Drinking water distance (minutes)
                                                    </td>
                                                    <td>
                                                        {(singularBuldingData && singularBuldingData.drinkingWaterDistance) || '-'}
                                                    </td>
                                                </tr>
                                            </table>
                                            <p>
                                                Social Factors
                                            </p>
                                            <table className={styles.singularPaneTable}>
                                                <tr>
                                                    <td>Number of people</td>
                                                    <td>{(singularBuldingData && singularBuldingData.totalPopulation) || '-'}</td>
                                                </tr>
                                                <tr>
                                                    <td>Ownership of house</td>
                                                    <td>
                                                        {(singularBuldingData && singularBuldingData.ownership) || '-'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>People with disability</td>
                                                    <td>{(singularBuldingData && singularBuldingData.peopleWithDisability) || '-'}</td>
                                                </tr>
                                                <tr>
                                                    <td>Distance from Medical centers (minutes)</td>
                                                    <td>{(singularBuldingData && singularBuldingData.healthPostDistance) || '-'}</td>
                                                </tr>
                                                <tr>
                                                    <td>Distance from Security centers (minutes)</td>
                                                    <td>{(singularBuldingData && singularBuldingData.policeStationDistance) || '-'}</td>
                                                </tr>
                                                <tr>
                                                    <td>Distance from Schools (minutes)</td>
                                                    <td>{(singularBuldingData && singularBuldingData.schoolDistance) || '-'}</td>
                                                </tr>
                                                <tr>
                                                    <td>Distance from open space (minutes)</td>
                                                    <td>{(singularBuldingData && singularBuldingData.openSafeSpaceDistance) || '-'}</td>
                                                </tr>
                                            </table>
                                            <p>
                                                Agewise Population Distribution
                                            </p>
                                            {
                                                singularAgeGroupsChart.length > 0
                                                    ? (
                                                        <ResponsiveContainer
                                                            className={styles.respContainer}
                                                            width="100%"
                                                            height={250}
                                                        >
                                                            <BarChart
                                                                width={350}
                                                                height={600}
                                                                data={singularAgeGroupsChart}
                                                                layout="vertical"
                                                                margin={{ top: 10, bottom: 10, right: 25, left: 10 }}
                                                            >
                                                                <CartesianGrid strokeDasharray="3 3" />
                                                                <XAxis type="number" tick={{ fill: '#94bdcf' }}>
                                                                    <Label
                                                                        value="Age in Years"
                                                                        offset={0}
                                                                        position="insideBottom"
                                                                        style={{
                                                                            textAnchor: 'middle',
                                                                            fill: 'rgba(255, 255, 255, 0.87)',
                                                                        }}
                                                                    />
                                                                </XAxis>
                                                                <YAxis
                                                                    type="category"
                                                                    dataKey="name"
                                                                    tick={{ fill: '#94bdcf' }}
                                                                />
                                                                <Tooltip
                                                                    cursor={{ fill: '#1c333f' }}
                                                                />
                                                                <Bar
                                                                    dataKey="Total"
                                                                    fill="rgb(0,219,95)"
                                                                    barSize={15}
                                                                    // label={{ position: 'right', fill: '#ffffff' }}
                                                                    radius={[0, 15, 15, 0]}
                                                                />
                                                            </BarChart>
                                                        </ResponsiveContainer>
                                                    )
                                                    : <NoData />
                                            }

                                            <p>
                                                Economic Factors
                                            </p>

                                            <table className={styles.singularPaneTable}>
                                                <tr>
                                                    <td>Main source of income</td>
                                                    <td>
                                                        {' '}
                                                        {(singularBuldingData && singularBuldingData.majorOccupation) || '-'}
                                                        {' '}

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Average yearly income (NPR)</td>
                                                    <td>
                                                        {' '}
                                                        {(singularBuldingData && singularBuldingData.averageAnnualIncome) || '-'}
                                                        {' '}
                                                    </td>
                                                </tr>
                                            </table>

                                            <div className={styles.backBtnContainer}>
                                                <button
                                                    onClick={this.handleBackBtn}
                                                    type="button"
                                                    className={styles.backButton}
                                                >
                                                    Back
                                                </button>
                                            </div>

                                        </>
                                    )
                            }
                        </>
                    )
                }
                {!singularBuilding
                    && (
                        <>
                            <h1>
                                Vulnerability of People and Households
                                <button
                                    type="button"
                                    onClick={e => e.preventDefault()}
                                    title="Vulnerability is the conditions which increase
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
                                            vulnerability of each household. The vulnerability level has been calculated for
                                            buildings that have complete data on all the physical,
                                            social, and economic parameters used for the
                                            vulnerability score calculation. Buildings for which the
                                            score was not calculated are being displayed in black."
                                >

                                    <Icon
                                        name="info"
                                        className={styles.infoIcon}
                                    />
                                </button>

                            </h1>
                            <p>Vulnerability of Buildings </p>
                            <div className={styles.buildingClassContainer}>
                                <div className={styles.levelContainer}>
                                    <span>
                                        High
                                    </span>
                                    <div className={styles.iconLevel}>

                                        <Icon
                                            name="circle"
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
                                            name="circle"
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
                                            name="circle"
                                            className={styles.low}
                                        />
                                        <span className={styles.number}>
                                            {' '}
                                            {buildingVulnerability.low}
                                            {' '}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.levelContainer}>
                                    <span>
                                        No Score
                                    </span>
                                    <div className={styles.iconLevel}>
                                        <Icon
                                            name="circle"
                                            className={styles.noscore}
                                        />
                                        <span className={styles.number}>
                                            {' '}
                                            {buildingVulnerability.noscore}
                                            {' '}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p>
                                PHYSICAL, SOCIAL AND ECONOMIC FACTORS
                            </p>
                            <p>
                                Foundation type of the buildings
                            </p>
                            {
                                foundationTypeChartData.length > 0
                                    ? (
                                        <ResponsiveContainer className={styles.respContainer} width="100%" height={400}>
                                            <BarChart
                                                width={350}
                                                height={600}
                                                data={foundationTypeChartData}
                                                layout="vertical"
                                                margin={{ top: 10, bottom: 10, right: 25, left: 30 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" tick={{ fill: '#94bdcf' }} />

                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    tick={{ fill: '#94bdcf' }}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: '#1c333f' }}
                                                />
                                                <Bar
                                                    dataKey="Total"
                                                    fill="rgb(0,219,95)"
                                                    barSize={15}
                                                    // label={{ position: 'right', fill: '#ffffff' }}
                                                    radius={[0, 15, 15, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )
                                    : <NoData />
                            }


                            <p>
                                Population distribution in the households
                            </p>
                            {
                                socialFactorChartData.length > 0
                                    ? (
                                        <ResponsiveContainer className={styles.respContainer} width="100%" height={350}>
                                            <BarChart
                                                width={350}
                                                height={600}
                                                data={socialFactorChartData}
                                                layout="vertical"
                                                margin={{ top: 10, bottom: 10, right: 25, left: 15 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" tick={{ fill: '#94bdcf' }} />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    tick={{ fill: '#94bdcf' }}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: '#1c333f' }}
                                                />
                                                <Bar
                                                    dataKey="Total"
                                                    fill="rgb(0,219,95)"
                                                    barSize={15}
                                                    // label={{ position: 'right', fill: '#ffffff' }}
                                                    radius={[0, 15, 15, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )
                                    : <NoData />
                            }


                            <p>
                                Agewise Population Distribution
                            </p>

                            {
                                ageGroupChartData.length > 0
                                    ? (
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
                                                <Tooltip
                                                    cursor={{ fill: '#1c333f' }}
                                                />
                                                <Bar
                                                    dataKey="Total"
                                                    fill="rgb(0,219,95)"
                                                    barSize={15}
                                                    label={{ position: 'right', fill: '#ffffff' }}
                                                    radius={[0, 15, 15, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )
                                    : <NoData />
                            }

                            <p>
                                Ownership of the houses
                            </p>

                            {
                                ownershipChartData.length > 0

                                    ? (
                                        <ResponsiveContainer className={styles.respContainer} width="100%" height={250}>
                                            <BarChart
                                                width={350}
                                                height={600}
                                                data={ownershipChartData}
                                                layout="vertical"
                                                margin={{ top: 10, bottom: 10, right: 25, left: 10 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" tick={{ fill: '#94bdcf' }}>
                                                    <Label
                                                        value="No. of households"
                                                        offset={0}
                                                        position="insideBottom"
                                                        style={{
                                                            textAnchor: 'middle',
                                                            fill: 'rgba(255, 255, 255, 0.87)',
                                                        }}
                                                    />
                                                </XAxis>
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    tick={{ fill: '#94bdcf' }}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: '#1c333f' }}
                                                />
                                                <Bar
                                                    dataKey="Total"
                                                    fill="rgb(0,219,95)"
                                                    barSize={15}
                                                    // label={{ position: 'right', fill: '#ffffff' }}
                                                    radius={[0, 15, 15, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )
                                    : <NoData />
                            }

                            <p>
                                Major source of income
                            </p>

                            {
                                sourceofIncomeChartData.length > 0
                                    ? (
                                        <ResponsiveContainer className={styles.respContainer} width="100%" height={250}>
                                            <BarChart
                                                width={360}
                                                height={600}
                                                data={sourceofIncomeChartData}
                                                layout="vertical"
                                                margin={{ top: 10, bottom: 10, right: 25, left: 20 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" tick={{ fill: '#94bdcf' }}>
                                                    <Label
                                                        value="No. of households"
                                                        offset={0}
                                                        position="insideBottom"
                                                        style={{
                                                            textAnchor: 'middle',
                                                            fill: 'rgba(255, 255, 255, 0.87)',
                                                        }}
                                                    />
                                                </XAxis>
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    tick={{ fill: '#94bdcf' }}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: '#1c333f' }}
                                                />
                                                <Bar
                                                    dataKey="Total"
                                                    fill="rgb(0,219,95)"
                                                    barSize={15}
                                                    // label={{ position: 'right', fill: '#ffffff' }}
                                                    radius={[0, 15, 15, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )
                                    : <NoData />
                            }
                            <p>
                                Average Annual Income
                            </p>

                            {
                                averageAnnualincomeChartData.length > 0
                                    ? (
                                        <ResponsiveContainer className={styles.respContainer} width="100%" height={300}>
                                            <BarChart
                                                width={340}
                                                height={600}
                                                data={averageAnnualincomeChartData}
                                                layout="vertical"
                                                margin={{ top: 10, bottom: 10, right: 25, left: 40 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis interval={0} type="number" tick={{ fill: '#94bdcf' }}>
                                                    <Label
                                                        value="No. of households"
                                                        offset={0}
                                                        position="insideBottom"
                                                        style={{
                                                            textAnchor: 'middle',
                                                            fill: 'rgba(255, 255, 255, 0.87)',
                                                        }}
                                                    />
                                                </XAxis>
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    tick={{ fill: '#94bdcf' }}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: '#1c333f' }}
                                                />
                                                <Bar
                                                    dataKey="Total"
                                                    fill="rgb(0,219,95)"
                                                    barSize={15}
                                                    // label={{ position: 'right', fill: '#ffffff' }}
                                                    radius={[0, 15, 15, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )
                                    : <NoData />
                            }


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
