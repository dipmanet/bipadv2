import React from 'react';
import memoize from 'memoize-one';

import {
    Bar, BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis, YAxis,
} from 'recharts';
import styles from './styles.scss';
import criticalInfraData from '#views/VizRisk/Gulariya/Data/criticalInfraData';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b', '#016cc3'];

class SlideFourPane extends React.PureComponent<Props, State> {
    public render() {
        const chartData = criticalInfraData.criticalInfraData;
        return (
            <div className={styles.vrSideBar}>
                <h1>Community Infrastructures</h1>
                <p>
                Flood exposure in Gulariya is due to its proximity to the Babai River,
                which is locally called Sarju Nadi. The Babai River originates from the
                low mountains in the Mahabharat Hills and flows in the northwest,
                enclosed by these hills on either side and then exits onto the Terai
                plain and flows southwards into India. As the river enters the Terai,
                its straight path changes to numerous ox-bow formations leading downstream.
                </p>
                <p>
                All of the residential and governmental buildings, religious and cultural sites,
                banking institutions, critical infrastructures such as hospitals, schools,
                bridges in Gulariya are at constant threat of flooding every monsoon.
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
                            barCategoryGap={20}
                            label={{ position: 'insideRight' }}
                            tick={{ fill: '#94bdcf' }}
                        />
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
