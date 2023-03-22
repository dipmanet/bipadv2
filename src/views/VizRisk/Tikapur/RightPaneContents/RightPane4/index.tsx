import React from 'react';
import memoize from 'memoize-one';

import {
    Bar, BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis, YAxis, LabelList,
} from 'recharts';
import criticalInfraData from '#views/VizRisk/Tikapur/Data/criticalInfraData';
import styles from './styles.scss';

interface ComponentProps { }

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b', '#016cc3'];
const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
    const radius = 10;
    return (
        <g>
            <text x={x + width + 10} y={y + height / 2} fill="#fff" textAnchor="middle" dominantBaseline="middle">
                {value}
            </text>
        </g>
    );
};
class SlideFourPane extends React.PureComponent<Props, State> {
    public render() {
        const chartData = criticalInfraData.criticalInfraData;
        return (
            <div className={styles.vrSideBar}>
                <h1>Community Infrastructures</h1>
                <p>
                    Tikapur is surrounded by the Karnali river in the east,
                    Janaki Rural Municipality in the north, Mohana River
                    and Indian border in the south, and Bhajani Municipality
                    in the west.  The Karnali river flows to the Terai plains
                    from a narrow gorge at Chisapani, where it bifurcates into
                    Geruwa and Karnali rivers.
                </p>
                <p>
                    All of the residential and governmental buildings,
                    religious and cultural sites, banking institutions,
                    critical infrastructures such as hospitals, schools,
                    bridges in Tikapur are at constant threat of flooding every monsoon.
                </p>

                <ResponsiveContainer className={styles.respContainer} width="100%" height={600}>
                    <BarChart
                        width={300}
                        // height={600}
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 20, right: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fill: '#94bdcf' }}
                        />
                        {/* <Tooltip /> */}
                        {/* <Legend /> */}
                        <Bar
                            dataKey="Total"
                            fill="#ffbf00"
                            // barCategoryGap={30}
                            // barCategoryGap={20}
                            barSize={80}
                            label={{ position: 'insideRight' }}
                            tick={{ fill: '#94bdcf' }}
                        >
                            {/* <LabelList content={renderCustomizedLabel} /> */}
                        </Bar>
                        {/* <Bar dataKey="FemalePop" stackId="a" fill="#00d725" /> */}
                        {/* <Bar dataKey="TotalHousehold" fill="#347eff" /> */}
                        {/* <Bar background label dataKey="Total" fill="#8884d8" /> */}
                    </BarChart>
                </ResponsiveContainer>
                {/* <SourceInfo /> */}


            </div>
        );
    }
}

export default SlideFourPane;
