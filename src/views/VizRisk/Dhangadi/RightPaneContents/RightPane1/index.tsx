import React from 'react';
import { CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis } from 'recharts';
import VizRiskContext from '#components/VizRiskContext';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import MaxTempIcon from '#views/VizRisk/Rajapur/Icons/TempMax.svg';
import MinTempIcon from '#views/VizRisk/Rajapur/Icons/TempMin.svg';
import TempIcon from '#views/VizRisk/Dhangadi/Icons/Temp.svg';
import AvgRainFall from '#views/VizRisk/Dhangadi/Icons/RainFall.svg';
import ElevationIcon from '#views/VizRisk/Dhangadi/Icons/ElevationFromSea.svg';
import styles from './styles.scss';

interface State {
    showInfo: boolean;
}

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const lineData = [
    {
        name: 'Jan', AvgMax: 20.4, DailyAvg: 13.3, AvgMin: 6.2,
    },
    {
        name: 'Feb', AvgMax: 23.7, DailyAvg: 15.9, AvgMin: 8.1,
    },
    {
        name: 'Mar', AvgMax: 29.1, DailyAvg: 21.2, AvgMin: 13.3,
    },
    {
        name: 'Apr', AvgMax: 34.8, DailyAvg: 25.8, AvgMin: 16.8,
    },
    {
        name: 'May', AvgMax: 35.3, DailyAvg: 27.75, AvgMin: 20.2,
    },
    {
        name: 'Jun', AvgMax: 34.1, DailyAvg: 28.4, AvgMin: 22.7,
    },
    {
        name: 'Jul', AvgMax: 34, DailyAvg: 28.85, AvgMin: 23.7,
    },
    {
        name: 'Aug', AvgMax: 34.3, DailyAvg: 29.05, AvgMin: 23.8,
    },
    {
        name: 'Sep', AvgMax: 34.4, DailyAvg: 28.6, AvgMin: 22.8,
    },
    {
        name: 'Oct', AvgMax: 33.9, DailyAvg: 25.15, AvgMin: 16.4,
    },
    {
        name: 'Nov', AvgMax: 28.2, DailyAvg: 18.8, AvgMin: 9.4,
    },
    {
        name: 'Dec', AvgMax: 27.7, DailyAvg: 14.1, AvgMin: 0.5,
    },
];
const rainfallData = [
    {
        name: 'Jan', Rainfall: 124.1,
    },
    {
        name: 'Feb', Rainfall: 17.7,
    },
    {
        name: 'Mar', Rainfall: 19.1,
    },
    {
        name: 'Apr', Rainfall: 72.1,
    },
    {
        name: 'May', Rainfall: 113.2,
    },
    {
        name: 'Jun', Rainfall: 218.6,
    },
    {
        name: 'Jul', Rainfall: 532.6,
    },
    {
        name: 'Aug', Rainfall: 299,
    },
    {
        name: 'Sep', Rainfall: 108.1,
    },
    {
        name: 'Oct', Rainfall: 0,
    },
    {
        name: 'Nov', Rainfall: 0,
    },
    {
        name: 'Dec', Rainfall: 0,
    },
];
class Rajapur extends React.PureComponent<Props, State> {
    public static contextType = VizRiskContext;

    public constructor(props: Props) {
        super(props);

        this.state = {
            showInfo: false,
        };
    }

    public renderLegend = (props) => {
        const { payload } = props;
        return (
            <div className={styles.climateLegendContainer}>
                <div className={styles.climatelegend}>
                    <div className={styles.legendMax} />
                    <div className={styles.legendText}>
                       Avg Max
                    </div>
                </div>
                <div className={styles.climatelegend}>
                    <div className={styles.legendMin} />
                    <div className={styles.legendText}>
                       Avg Min
                    </div>
                </div>
                <div className={styles.climatelegend}>
                    <div className={styles.legendDaily} />
                    <div className={styles.legendText}>
                       Daily Avg
                    </div>
                </div>
            </div>
        );
    }

    public renderLegendRainfall = (props) => {
        const { payload } = props;
        return (
            <div className={styles.climateLegendContainer}>
                <div className={styles.climatelegend}>
                    <div className={styles.legendMax} />
                    <div className={styles.legendText}>
                       Avg Rainfall
                    </div>
                </div>

            </div>
        );
    }

    public CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <h2>{payload[0].payload.name}</h2>
                    <p>{`Avg Max: ${payload[0].payload.AvgMax} ℃`}</p>
                    <p>{`Avg Min: ${payload[0].payload.AvgMin} ℃`}</p>
                    <p>{`Daily Avg: ${payload[0].payload.DailyAvg} ℃`}</p>
                </div>
            );
        }

        return null;
    };

    public CustomTooltipRain = ({ active, payload, label }) => {
        console.log('Payload', payload);
        if (active && payload && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <h2>{payload[0].payload.name}</h2>
                    <p>{`Avg Rainfall: ${payload[0].payload.Rainfall} mm`}</p>

                </div>
            );
        }

        return null;
    };

    public render() {
        const { currentPage } = this.context;

        const {
            municipalities,
        } = this.props;

        const {
            showInfo,
        } = this.state;

        return (
            <div className={styles.vrSideBar}>
                <h1> Dhangadhi Sub-Metropolitan City  </h1>
                <p>
                Dhangadhi Sub-Metropolitan City is in the Kailali district of Sudurpaschim province.
                It covers a total area of 260.92 sq. km and is located at an altitude of 109 MASL.
                </p>
                <h2>Climate</h2>
                <p>
                Summer starts in March and lasts till June. Winter begins in November (Mangsir) and
                lasts till February. Dhangadhi faces heavy downpours during the monsoon, from June
                to October.

                </p>
                <div className={styles.iconRow}>
                    <div className={styles.infoIconsContainer}>
                        <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={TempIcon}
                        />
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>35.3℃</div>
                            <div className={styles.iconText}>
                            Maximum
                                <br />
                            Temperature in
                                <br />
                            Summer
                            </div>

                        </div>
                    </div>
                    <div className={styles.infoIconsContainer}>
                        {/* <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={TempIcon}
                        /> */}
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>0.5℃</div>
                            <div className={styles.iconText}>
                            Minimum
                                <br />
                            Temeperature in
                                <br />
                            Winter
                            </div>

                        </div>
                    </div>
                </div>
                <div className={styles.iconRow}>
                    <div className={styles.infoIconsContainer}>
                        <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={AvgRainFall}
                        />
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>1504.5 mm</div>
                            <div className={styles.iconText}>
                             Annual
                            Rainfall
                            </div>

                        </div>
                    </div>

                    <div className={styles.infoIconsContainerHidden}>
                        <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={ElevationIcon}
                        />
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>142m - 154m</div>
                            <div className={styles.iconText}>
                            Elevation from Sea Level
                            </div>

                        </div>
                    </div>
                </div>
                <div className={styles.source}>Source: DHM, 2020 Data </div>
                <p style={{ marginBottom: '0px', marginTop: '30px', fontWeight: 'bold' }}>Temperature</p>
                <ResponsiveContainer className={styles.chartContainer} height={300}>
                    <LineChart
                        margin={{ top: 0, right: 10, left: 10, bottom: 10 }}
                        data={lineData}
                    >
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                        />
                        <XAxis
                            dataKey="name"
                            interval="preserveStart"
                            tick={{ fill: '#94bdcf' }}
                        />
                        <YAxis
                            unit={'℃'}
                            axisLine={false}
                            domain={[0, 40]}
                            padding={{ top: 20 }}
                            tick={{ fill: '#94bdcf' }}
                            tickCount={10}
                            interval="preserveEnd"
                            allowDataOverflow
                        />
                        <Legend iconType="square" iconSize={10} align="center" content={this.renderLegend} />
                        <Tooltip
                            content={this.CustomTooltip}
                        />
                        <Line type="monotone" dataKey="AvgMax" stroke="#ffbf00" />
                        <Line type="monotone" dataKey="DailyAvg" stroke="#00d725" />
                        <Line type="monotone" dataKey="AvgMin" stroke="#347eff" />
                    </LineChart>
                </ResponsiveContainer>
                <p style={{ marginBottom: '0px', marginTop: '30px', fontWeight: 'bold' }}> Rainfall</p>
                <ResponsiveContainer className={styles.chartContainer} height={300}>
                    <LineChart
                        margin={{ top: 0, right: 10, left: 10, bottom: 10 }}
                        data={rainfallData}
                    >
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                        />
                        <XAxis
                            dataKey="name"
                            interval="preserveStart"
                            tick={{ fill: '#94bdcf' }}
                        />
                        <YAxis
                            unit={'mm'}
                            axisLine={false}
                            domain={[0, 700]}
                            padding={{ top: 20 }}
                            tick={{ fill: '#94bdcf' }}
                            tickCount={10}
                            interval="preserveEnd"
                            allowDataOverflow
                        />
                        <Legend iconType="square" iconSize={10} align="center" content={this.renderLegendRainfall} />
                        <Tooltip
                            content={this.CustomTooltipRain}
                        />
                        <Line type="monotone" dataKey="Rainfall" stroke="#ffbf00" />

                    </LineChart>
                </ResponsiveContainer>
                {/* <SourceInfo /> */}


            </div>
        );
    }
}

export default Rajapur;
