import React from 'react';
import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    YAxis,
    Legend,
    Line,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import VizRiskContext from '#components/VizRiskContext';
import Icon from '#rscg/Icon';

import styles from './styles.scss';

interface State {
    showInfo: boolean;
}

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

// const lineData = [
//     {
//         name: 'Jan', AvgMax: 23, DailyAvg: 15, AvgMin: 7,
//     },
//     {
//         name: 'Feb', AvgMax: 30, DailyAvg: 19, AvgMin: 9,
//     },
//     {
//         name: 'Mar', AvgMax: 35, DailyAvg: 23, AvgMin: 11,
//     },
//     {
//         name: 'Apr', AvgMax: 40, DailyAvg: 28, AvgMin: 16,
//     },
//     {
//         name: 'May', AvgMax: 41, DailyAvg: 32, AvgMin: 23,
//     },
//     {
//         name: 'Jun', AvgMax: 40, DailyAvg: 33, AvgMin: 26,
//     },
//     {
//         name: 'Jul', AvgMax: 37, DailyAvg: 31.5, AvgMin: 26,
//     },
//     {
//         name: 'Aug', AvgMax: 33, DailyAvg: 29, AvgMin: 25,
//     },
//     {
//         name: 'Sep', AvgMax: 33, DailyAvg: 27.5, AvgMin: 22,
//     },
//     {
//         name: 'Oct', AvgMax: 33, DailyAvg: 23.5, AvgMin: 14,
//     },
//     {
//         name: 'Nov', AvgMax: 31, DailyAvg: 20, AvgMin: 9,
//     },
//     {
//         name: 'Dev', AvgMax: 27, DailyAvg: 17, AvgMin: 7,
//     },
// ];
const lineData = [
    {
        name: 'Poush', AvgMax: 23, DailyAvg: 15, AvgMin: 7,
    },
    {
        name: 'Magh', AvgMax: 30, DailyAvg: 19, AvgMin: 9,
    },
    {
        name: 'Falgun', AvgMax: 35, DailyAvg: 23, AvgMin: 11,
    },
    {
        name: 'Chaitra', AvgMax: 40, DailyAvg: 28, AvgMin: 16,
    },
    {
        name: 'Baisakh', AvgMax: 41, DailyAvg: 32, AvgMin: 23,
    },
    {
        name: 'Jestha', AvgMax: 40, DailyAvg: 33, AvgMin: 26,
    },
    {
        name: 'Ashar', AvgMax: 37, DailyAvg: 31.5, AvgMin: 26,
    },
    {
        name: 'Shrawan', AvgMax: 33, DailyAvg: 29, AvgMin: 25,
    },
    {
        name: 'Bhadra', AvgMax: 33, DailyAvg: 27.5, AvgMin: 22,
    },
    {
        name: 'Ashwin', AvgMax: 33, DailyAvg: 23.5, AvgMin: 14,
    },
    {
        name: 'Kartik', AvgMax: 31, DailyAvg: 20, AvgMin: 9,
    },
    {
        name: 'Mangshir', AvgMax: 27, DailyAvg: 17, AvgMin: 7,
    },
];
class SlideOne extends React.PureComponent<Props, State> {
    public static contextType = VizRiskContext;

    public constructor(props: Props) {
        super(props);

        this.state = {
            showInfo: false,
        };
    }

    public handleInfoClick = () => {
        console.log(this.state.showInfo);
        const { showInfo } = this.state;
        if (showInfo) {
            this.setState({ showInfo: false });
        } else {
            this.setState({ showInfo: true });
        }
    };

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
                <h1>Climate</h1>
                <p className={styles.lastPara}>
                    {' '}
                        Rajapur experiences a lower tropical climate with an average
                        maximum temperature of 41 degree celcius in winter. Summer starts from
                        Chaitra till Jestha while there is an
                        extreme winter in Mangshir, Poush and Magh.
                        Monsoon starts here a bit early from the last week of Jestha till Ashwin
                        bringing the heavy downpours.
                </p>
                <ResponsiveContainer className={styles.chartContainer} height={300}>
                    <LineChart
                        margin={{ top: 0, right: 35, left: 0, bottom: 10 }}
                        data={lineData}
                    >
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                        />
                        <XAxis
                            dataKey="name"
                            interval="preserveStart"
                            tick={{ fill: '#6490a4' }}
                        />
                        <YAxis
                            unit={'℃'}
                            axisLine={false}
                            domain={[0, 40]}
                            padding={{ top: 20 }}
                            tick={{ fill: '#6490a4' }}
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

                {/* </div> */}
                <div className={styles.iconContainer}>
                    <div
                        className={showInfo ? styles.bottomInfo : styles.bottomInfoHide}
                    >
                            Source: Rajapur Municipality Profile
                    </div>
                    <button type="button" className={styles.infoContainerBtn} onClick={this.handleInfoClick}>
                        <Icon
                            name="info"
                            className={styles.closeIcon}
                        />
                    </button>
                </div>

            </div>
        );
    }
}

export default SlideOne;
