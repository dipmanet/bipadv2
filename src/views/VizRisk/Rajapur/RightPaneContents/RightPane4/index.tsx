import React from 'react';
import {
    Bar, BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis, YAxis,
} from 'recharts';
import styles from './styles.scss';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

class SlideFourPane extends React.PureComponent<Props, State> {
    public constructor(p) {
        super(p);
        this.state = {
            chartData: [],
        };
    }

    public componentDidMount() {
        const { criticalInfraData } = this.props;
        const ciTypes = [...new Set(criticalInfraData
            .features.map(ciType => ciType.properties.Type))];
        const chartData = ciTypes.map(item => ({
            name: item,
            Total: criticalInfraData.features.filter(i => i.properties.Type === item).length,
        }));
        this.setState({ chartData });
    }

    public render() {
        const { chartData } = this.state;
        return (
            <div className={styles.vrSideBar}>
                <h1>Community Infrastructures</h1>
                <p>
                Rajapur lies in the inland delta surrounded by two
                tributaries of the Karnali River,one of the largest
                rivers of Nepal. The river splits into Karnali on the
                western side and Geruwa on the eastern side. These two
                tributaries flow past the Nepal-India border and converge
                again as Ghangra river.
                </p>
                <p>
                All of the residential and governmental buildings, religious
                and cultural sites, banking institutions,critical infrastructures
                such as hospitals, schools, bridges, etc. are built near or between
                Karnali and Geruwa river. These infrastructures are at a constant
                threat of flooding every monsoon.
                </p>

                <ResponsiveContainer className={styles.respContainer} width="90%" height={450}>
                    <BarChart
                        width={250}
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 40, right: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fill: '#94bdcf' }}
                        />
                        <Bar
                            dataKey="Total"
                            fill="#ffbf00"
                            barSize={20}
                            radius={[0, 20, 20, 0]}
                            label={{ position: 'right', fill: '#ffffff' }}
                            tick={{ fill: '#94bdcf' }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

export default SlideFourPane;
