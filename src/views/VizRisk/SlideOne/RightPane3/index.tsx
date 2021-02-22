import React from 'react';
import memoize from 'memoize-one';

import {
    Bar, BarChart,
    CartesianGrid, Legend,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import styles from './styles.scss';
import demographicsData from '../../demographicsData';
import CustomChartLegend from '#views/VizRisk/CustomChartLegend';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b', '#016cc3'];

class SlideThreePane extends React.PureComponent<Props, State> {
    public render() {
        const chartData = demographicsData.demographicsData;
        return (
            <div className={styles.vrSideBar}>
                <h1>Demography</h1>
                {/* <p>
                    {' '}
                        Rajapur has the total population of 55,584 with the
                        male and female population being 25,519 and 30,065
                        respectively. Total household number counts to 12,138.
                        Ward number 4 has the largest household number that equals to 1639
                        while ward number 7 has the least comprising of only
                        766 number of household. However, the population is highest in
                        ward number 4 and lowest in ward number 7.

                </p> */}

                {/* <ResponsiveContainer height={200} className={styles.graphContainer}>
                    <BarChart
                        width={300}
                        height={200}
                        data={chartData}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 15,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend layout="horizontal" verticalAlign="bottom" />
                        <Bar dataKey="MalePop" fill="rgb(245,87,149)" />
                        <Bar dataKey="FemalePop" fill="rgb(0,163,223)" />
                        <Bar dataKey="TotalHousehold" fill="rgb(0,172,163)" />
                    </BarChart>
                </ResponsiveContainer> */}

                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={350}
                        height={600}
                        data={chartData}
                        layout="vertical"
                        barCategoryGap={1}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="MalePop" fill="#ffbf00" />
                        <Bar dataKey="FemalePop" fill="#00d725" />
                        <Bar dataKey="TotalHousehold" fill="#347eff" />
                        {/* <Bar background label dataKey="foo" fill="#8884d8" /> */}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

export default SlideThreePane;
