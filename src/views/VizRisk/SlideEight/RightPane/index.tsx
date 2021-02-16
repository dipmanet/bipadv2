import React from 'react';
import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    YAxis,
    Legend,
    Line,
    CartesianGrid,
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
                {/* <h1 > References</h1> */}
                <ol className={styles.referencesTitle}>
                    <li>
                        Modeling Exposure Through Earth Observations Routines (METEOR)
                        ,UK Space Agency, https://meteor-project.org/
                    </li>
                    <li>
                        Risk Nexus, Urgent case for recovery. What we can
                        learn from the August 2014 Karnali River floods in Nepal.
                        Zurich Insurance Group Ltd and ISET-International, 2015
                    </li>
                    <li>
                         Central Bureau of Statistics, 2011
                    </li>
                    <li>
                         Add the references that Reena used for Climate and others
                    </li>

                </ol>
            </div>
        );
    }
}

export default SlideOne;
