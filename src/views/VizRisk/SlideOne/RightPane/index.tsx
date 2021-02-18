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
        name: 'Dev', AvgMax: 27, DailyAvg: 17, AvgMin: 7,
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
                <h1> Rajpur Municipality </h1>
                <p>
                    {' '}
                         Rajapur municipality lies in the Terai region of Bardiya
                        district in Province five. It covers a total area of 127.08
                        square km, and is situated at an elevation of 142 m to 154 m from sea level.

                </p>
                <h2>Climate</h2>
                <p className={styles.lastPara}>
                    {' '}
                        Rajapur experiences a lower tropical climate with an average
                        maximum temperature of 41 degree celcius in winter. Summer starts from
                        Chaitra till Jestha while there is an
                        extreme winter in Mangshir, Poush and Magh.
                        Monsoon starts here a bit early from the last week of Jestha till Ashwin
                        bringing the heavy downpours. Overall in a year, Rajapur experiences
                        average annual rainfall of 1900 mm.
                </p>
                {/* <div className={styles.chartsContainer}> */}
                <ResponsiveContainer height={250}>
                    <LineChart
                        margin={{ top: 0, right: 25, left: 0, bottom: 0 }}
                        data={lineData}
                    >
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                        />
                        <XAxis dataKey="name" />
                        <YAxis unit={'℃'} dataKey="AvgMax" domain={[0, 45]} />
                        <Legend iconType="square" iconSize={10} align="center" />
                        <Tooltip />
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
