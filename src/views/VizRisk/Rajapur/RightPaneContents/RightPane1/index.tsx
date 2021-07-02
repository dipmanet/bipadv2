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
        name: 'Jan', AvgMax: 23, DailyAvg: 15, AvgMin: 7,
    },
    {
        name: 'Feb', AvgMax: 30, DailyAvg: 19, AvgMin: 9,
    },
    {
        name: 'Mar', AvgMax: 35, DailyAvg: 23, AvgMin: 11,
    },
    {
        name: 'Apr', AvgMax: 40, DailyAvg: 28, AvgMin: 16,
    },
    {
        name: 'May', AvgMax: 41, DailyAvg: 32, AvgMin: 23,
    },
    {
        name: 'Jun', AvgMax: 40, DailyAvg: 33, AvgMin: 26,
    },
    {
        name: 'Jul', AvgMax: 37, DailyAvg: 31.5, AvgMin: 26,
    },
    {
        name: 'Aug', AvgMax: 33, DailyAvg: 29, AvgMin: 25,
    },
    {
        name: 'Sep', AvgMax: 33, DailyAvg: 27.5, AvgMin: 22,
    },
    {
        name: 'Oct', AvgMax: 33, DailyAvg: 23.5, AvgMin: 14,
    },
    {
        name: 'Nov', AvgMax: 31, DailyAvg: 20, AvgMin: 9,
    },
    {
        name: 'Dec', AvgMax: 27, DailyAvg: 17, AvgMin: 7,
    },
];


const rainfallData = [
    {
        name: 'Jan', Rainfall: 86.4,
    },
    {
        name: 'Feb', Rainfall: 26,
    },
    {
        name: 'Mar', Rainfall: 6,
    },
    {
        name: 'Apr', Rainfall: 26,
    },
    {
        name: 'May', Rainfall: 64.3,
    },
    {
        name: 'Jun', Rainfall: 125.5,
    },
    {
        name: 'Jul', Rainfall: 451.1,
    },
    {
        name: 'Aug', Rainfall: 1146.4,
    },
    {
        name: 'Sep', Rainfall: 199.9,
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
                    Max
                    </div>
                </div>
                <div className={styles.climatelegend}>
                    <div className={styles.legendMin} />
                    <div className={styles.legendText}>
                    Min
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
                    Rainfall
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
                    <p>{`Max: ${payload[0].payload.AvgMax} ℃`}</p>
                    <p>{`Min: ${payload[0].payload.AvgMin} ℃`}</p>
                    <p>{`Avg: ${payload[0].payload.DailyAvg} ℃`}</p>
                </div>
            );
        }

        return null;
    };

    public CustomTooltipRain = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <h2>{payload[0].payload.name}</h2>
                    <p>{`Rainfall: ${payload[0].payload.Rainfall} mm`}</p>

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
                <h1> Rajapur Municipality </h1>
                {/* <p>
                         Rajapur municipality lies in the Terai region of Bardiya
                        district in Province five. It covers a total area of 127.08
                        square km, and is situated at an elevation of 142 m to 154 m from sea level.
                </p> */}
                <p>
                    Rajapur municipality lies in the Terai region of Bardiya
                    district in Lumbini Province. It covers a  total area of
                    127.08 square km, and is situated at an elevation of
                    142 m to 154 m from sea level.

                </p>
                <h2>Climate</h2>
                <p>
                    {' '}
                    Rajapur experiences a lower tropical climate.  Summer
                    starts from March and lasts till June. Winter begins
                    in November and lasts till February. Rajapur faces heavy
                    downpours during the monsoon, from June to October.

                </p>
                <div className={styles.iconRow}>
                    <div className={styles.infoIconsContainer}>
                        <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={TempIcon}
                        />
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>41℃</div>
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
                            <div className={styles.iconTitle}>7℃</div>
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
                            <div className={styles.iconTitle}>1900mm</div>
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

                {/* <SourceInfo /> */}
                <div className={styles.climateChart}>
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
                                domain={[0, 1150]}
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

                </div>


            </div>
        );
    }
}

export default Rajapur;
