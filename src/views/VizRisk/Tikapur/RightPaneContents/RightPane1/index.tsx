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


const lineData = [{
    name: 'Jan',
    max: 20.4,
    min: 6.2,
},
{
    name: 'Feb',
    max: 23.7,
    min: 8.1,
},
{
    name: 'Mar',
    max: 29.1,
    min: 13.3,
},
{
    name: 'Apr',
    max: 34.8,
    min: 16.8,
},
{
    name: 'May',
    max: 35.3,
    min: 20.2,
},
{
    name: 'Jun',
    max: 34.1,
    min: 22.7,
},
{
    name: 'Jul',
    max: 34,
    min: 23.7,
},
{
    name: 'Aug',
    max: 34.3,
    min: 23.8,
},
{
    name: 'Sep',
    max: 34.4,
    min: 22.8,
},
{
    name: 'Oct',
    max: 33.9,
    min: 16.4,
},
{
    name: 'Nov',
    max: 28.2,
    min: 9.4,
},
{
    name: 'Dec',
    max: 27.7,
    min: 0.5,
}];

const rainfallData = [{
    name: 'Jan',
    Rainfall: 153.6,
},
{
    name: 'Feb',
    Rainfall: 37.9,
},
{
    name: 'Mar',
    Rainfall: 33.4,
},
{
    name: 'Apr',
    Rainfall: 23.1,
},
{
    name: 'May',
    Rainfall: 97.4,
},
{
    name: 'Jun',
    Rainfall: 343.7,
},
{
    name: 'Jul',
    Rainfall: 209.4,
},
{
    name: 'Aug',
    Rainfall: 570.3,
},
{
    name: 'Sep',
    Rainfall: 172.2,
},
{
    name: 'Oct',
    Rainfall: 0,
},
{
    name: 'Nov',
    Rainfall: 2.6,
},
{
    name: 'Dec',
    Rainfall: 0,
}];


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
                    <p>{`Max: ${payload[0].payload.max} ℃`}</p>
                    <p>{`Min: ${payload[0].payload.min} ℃`}</p>
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
                <h1> Tikapur Municipality  </h1>
                <p>
                Tikapur Municipality is located in Kailali district of Sudurpaschim province.
                Tikapur municipality has a total area of 118 sq.km and is situated
                at an elevation of 145m to 161m AMSL.

                </p>
                <h2>Climate</h2>
                <p>
                Summer starts from March and lasts till June. Winter begins in November
                and lasts till February. Tikapur faces heavy downpours during the monsoon,
                from June to October.

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
                            Temperature in
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
                            <div className={styles.iconTitle}>1643.6mm</div>
                            <div className={styles.iconText}>
                            Annual Rainfall
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
                        <Line type="monotone" dataKey="max" stroke="#ffbf00" />
                        <Line type="monotone" dataKey="min" stroke="#347eff" />
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

                </div>

            </div>
        );
    }
}

export default Rajapur;
