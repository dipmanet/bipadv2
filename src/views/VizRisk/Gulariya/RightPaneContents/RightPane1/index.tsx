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
import TempIcon from '#views/VizRisk/Rajapur/Icons/Temp.svg';
import AvgRainFall from '#views/VizRisk/Rajapur/Icons/RainFall.svg';
import ElevationIcon from '#views/VizRisk/Rajapur/Icons/ElevationFromSea.svg';
import styles from './styles.scss';

interface State {
    showInfo: boolean;
}

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const lineData = [
    {
        name: 'Jan', AvgMax: 18.9, DailyAvg: 14.1, AvgMin: 9.3,
    },
    {
        name: 'Feb', AvgMax: 23.7, DailyAvg: 16.55, AvgMin: 9.4,
    },
    {
        name: 'Mar', AvgMax: 28.1, DailyAvg: 21.05, AvgMin: 14,
    },
    {
        name: 'Apr', AvgMax: 34.3, DailyAvg: 26.85, AvgMin: 19.4,
    },
    {
        name: 'May', AvgMax: 34.8, DailyAvg: 28.35, AvgMin: 21.9,
    },
    {
        name: 'Jun', AvgMax: 33.8, DailyAvg: 29.65, AvgMin: 25.5,
    },
    {
        name: 'Jul', AvgMax: 32.9, DailyAvg: 29.85, AvgMin: 26.8,
    },
    {
        name: 'Aug', AvgMax: 33.8, DailyAvg: 30.25, AvgMin: 26.7,
    },
    {
        name: 'Sep', AvgMax: 33.7, DailyAvg: 29.9, AvgMin: 26.1,
    },
    {
        name: 'Oct', AvgMax: 33.6, DailyAvg: 26.55, AvgMin: 19.5,
    },
    {
        name: 'Nov', AvgMax: 27.1, DailyAvg: 19.6, AvgMin: 12.1,
    },
    {
        name: 'Dec', AvgMax: 22.2, DailyAvg: 15.2, AvgMin: 8.2,
    },
];
const rainfallData = [
    {
        name: 'Jan', Rainfall: 59.6,
    },
    {
        name: 'Feb', Rainfall: 32.2,
    },
    {
        name: 'Mar', Rainfall: 31.9,
    },
    {
        name: 'Apr', Rainfall: 31.8,
    },
    {
        name: 'May', Rainfall: 89.9,
    },
    {
        name: 'Jun', Rainfall: 246.4,
    },
    {
        name: 'Jul', Rainfall: 528.6,
    },
    {
        name: 'Aug', Rainfall: 470.7,
    },
    {
        name: 'Sep', Rainfall: 90.9,
    },
    {
        name: 'Oct', Rainfall: 0,
    },
    {
        name: 'Nov', Rainfall: 3.5,
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
        console.log('Payload', payload);
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
                <h1> Gulariya Municipality  </h1>
                <p>
                    Gulariya municipality lies in the Terai region of Bardiya district in
                    Lumbini Province. It covers a total area of 118 sq.km, and is situated
                    at an elevation of 145m from sea level.
                </p>
                <h2>Climate</h2>
                <p>
                    Gulariya experiences a sub tropical climate. Summer starts from March
                    and lasts till June. Winter begins in November (Mangsir) and lasts till
                    February. Gulariya faces heavy downpours during the monsoon, from June
                    to October.

                </p>
                <div className={styles.iconRow}>
                    <div className={styles.infoIconsContainer}>
                        <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={TempIcon}
                        />
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>34.8℃</div>
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
                            <div className={styles.iconTitle}>8.2℃</div>
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
                            <div className={styles.iconTitle}>1585.5 mm</div>
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
                            domain={[0, 600]}
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
