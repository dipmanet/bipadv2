/* eslint-disable react/no-did-update-set-state */
/* eslint-disable max-len */
import React from 'react';

import {
    Bar, BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import { isDefined } from '@togglecorp/fujs';
import styles from './styles.scss';

import criticalInfraData from '#views/VizRisk/Rajapur/Data/criticalInfraData';
import NavButtons from '../../Components/NavButtons';

// const chartData = criticalInfraData.safeShelterData;

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b', '#016cc3'];

const ciRef = {
    'Water sources': 'Water Source',
    'Trade and business (groceries, meat, textiles)': 'Trade and business',
    'Industry/ hydropower': 'Industry',
    'Hotel/resort/homestay': 'Hotel or Restaurant',
    Health: 'Hospital',
    'Government Buildings': 'Government Building',
    Bridge: 'Bridge',
    'Community buildings': 'Community Building',
    'Cultural heritage sites': 'Cultural Heritage',
    Finance: 'Financial Institution',
    Education: 'Education Institution',
};

class SlideFivePane extends React.PureComponent<Props, State> {
    public constructor(props) {
        super();
        this.state = {
            showReferences: true,
            areaSelected: 'MUNICIPALITY',
            chartData: [],
        };
    }

    public handleRefClick = () => {
        this.setState(prevState => ({
            showReferences: !prevState.showReferences,
        }));
    }

    public componentDidMount() {
        const { CIData, buildings } = this.props;
        if (isDefined(CIData.features) && CIData.features.length > 0) {
            const chartDataTitlesUf = [...new Set(CIData
                .features.map(item => item.properties.CI))];
            const chartDataTitles = chartDataTitlesUf.filter(item => item !== undefined);
            const temp = chartDataTitles.map(h => ({
                name: ciRef[h],
                Total: CIData.features.filter(i => i.properties.CI === h).length,
            }));
            temp.push({
                name: 'Buildings',
                Total: buildings.features ? buildings.features.length : 0,
            });
            this.setState({ chartData: temp });
        }
    }

    public componentDidUpdate(prevProps) {
        const {
            CIData,
            drawChartData,
            buildings,
            resetDrawData,
            handleDrawResetData,
        } = this.props;
        if (drawChartData !== prevProps.drawChartData) {
            if (drawChartData.length > 0) {
                // if (resetDrawData && CIData.features && CIData.features.length > 0) {
                const chartDataTitlesUf = [...new Set(drawChartData
                    .map(item => item.hazardTitle))];
                const chartDataTitles = chartDataTitlesUf.filter(item => item !== undefined);
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
                this.setState({ chartData });
                this.setState({ areaSelected: 'THE AREA SELECTED' });
                handleDrawResetData(false);
            }
        }

        if (resetDrawData !== prevProps.resetDrawData) {
            if (isDefined(CIData.features)
            && CIData.features.length > 0
            && buildings.features
            && resetDrawData === true
            ) {
                const chartDataTitlesUf = [...new Set(CIData
                    .features.map(item => item.properties.CI))];
                const chartDataTitles = chartDataTitlesUf.filter(item => item !== undefined);
                const temp = chartDataTitles.map(h => ({
                    name: h,
                    Total: CIData.features.filter(i => i.properties.CI === h).length,
                }));
                temp.push({
                    name: 'Buildings',
                    Total: buildings.features ? buildings.features.length : 0,
                });
                this.setState({ chartData: temp });
            }
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
        } = this.props;

        const { chartData } = this.state;

        return (
            <div className={styles.vrSideBar}>

                {
                    this.props.sesmicLayer === 'ses'
                        ? (
                            <>
                                <h1>Earthquake Exposure in Jugal </h1>
                                <p>The map shows the exposure of critical infrastructures and assets to earthquake.This visualization allows the super imposition of the seimic hazard map with details of landuse and critical infrastructures. The map shows the peak ground acceleration values due to earthquake ground shaking with 10% probability of exceedance in 50 years. </p>

                                <p>This visualization helps understand the population, critical infrastructures and assets that are at threat to earthquake hazard in the region. </p>

                                <p>Its impacts can be reduced through risk-sensitive land use planning and this visualization allows re-thinking long term spatial planning in the region. </p>
                                <p>
                                ELEMENTS THAT ARE EXPOSED TO EARTHQUAKE WITHIN
                                    {' '}
                                    {this.state.areaSelected}
                                </p>
                            </>
                        ) : (
                            <>
                                <h1>Landslide Exposure in Jugal </h1>
                                <p>The map shows the exposure of critical infrastructures and assets to landslide.  This visualization allows the super imposition of the landslide susceptibility map with details of landuse and critical infrastructures. The map shows the relative indication of the probability of rainfall triggered landslides.</p>

                                <p>This visualization helps understand the population, critical infrastructures and assets that are at threat to earthquake hazard in the region. </p>

                                <p>Its impacts can be reduced through risk-sensitive land use planning and this visualization allows re-thinking long term spatial planning in the region.</p>
                                <p>
                                ELEMENTS THAT ARE EXPOSED TO EARTHQUAKE WITHIN
                                    {' '}
                                    {this.state.areaSelected}
                                </p>
                            </>
                        )}

                {
                    chartData.length > 0
                        ? (
                            <ResponsiveContainer className={styles.respContainer} width="100%" height={500}>
                                <BarChart
                                    width={350}
                                    height={600}
                                    data={chartData}
                                    layout="vertical"
                                    margin={{ top: 10, bottom: 10, right: 30, left: 20 }}
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
                        )
                        : <p>Please select a region using a draw tool to see the data</p>
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
