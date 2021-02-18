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


            </div>
        );
    }
}

export default SlideOne;
