import React from 'react';
import { CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis } from 'recharts';
import VizRiskContext from '#components/VizRiskContext';
import styles from './styles.scss';
import NavButtons from '../../Components/NavButtons';

interface State {
    showInfo: boolean;
}

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

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

    public render() {
        const { currentPage } = this.context;

        const {
            municipalities,
            handleNext,
            handlePrev,
            disableNavLeftBtn,
            disableNavRightBtn,
            pagenumber,
            totalPages,
        } = this.props;

        const {
            showInfo,
        } = this.state;

        return (
            <div className={styles.vrSideBar}>
                <h1> Panchpokhari Thangpal Rural Municipality</h1>
                <p>
                Panchpokhari Thangpal Rural Municipality is
                located in the Sindhupalchok district of Bagmati Province.
                </p>
                <p>
                It covers a total area of 436.09 square km and
                is situated at an elevation of 145m to 161m AMSL.
                </p>
                {/* <h2>Climate</h2>
                <p>
                    Winter is from November-March, summer is from April-May and
                    rainy is from May to October with mean annual temperature of
                    18°C, and maximum temperature of 32.5°C and minimum of 5°C and
                </p> */}

                <NavButtons
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                    disableNavLeftBtn={disableNavLeftBtn}
                    disableNavRightBtn={disableNavRightBtn}
                    pagenumber={pagenumber}
                    totalPages={totalPages}
                />
            </div>
        );
    }
}

export default Rajapur;
