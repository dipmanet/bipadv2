import React from 'react';
import memoize from 'memoize-one';

import {
    Bar, BarChart,
    CartesianGrid, Label, Legend,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import styles from './styles.scss';
import criticalInfraData from '../../criticalInfraData';
import CustomChartLegend from '#views/VizRisk/CustomChartLegend';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import ManWoman from '#views/VizRisk/SlideOne/Icons/ManWoman.svg';

import ElevationIcon from '#views/VizRisk/SlideOne/Icons/ElevationFromSea.svg';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b', '#016cc3'];

class SlideFourPane extends React.PureComponent<Props, State> {
    public render() {
        const chartData = criticalInfraData.criticalInfraData;
        return (
            <div className={styles.vrSideBar}>
                <h1>Critical Infrastrcutures</h1>
                <p>
                    Rajapur is an island surrounded by two branches of the Karnali River,
                    one of the largest rivers of Nepal. The Karnali River enters the
                    Terai plains from a narrow gorge at Chisapani. About 1 km downstream,
                    the river splits into the westernmost Karnali
                    branches and an eastern Geruwa branch.
                </p>

                <p>
                    Many of Rajapur’s residential and commercial buildings, critical health and
                    education facilities have been built near and between the two river branches.
                </p>


                <ResponsiveContainer className={styles.respContainer} width="100%" height={'45%'}>
                    <BarChart
                        width={350}
                        height={600}
                        data={chartData}
                        layout="vertical"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                            type="category"
                            dataKey="name"
                        />
                        <Tooltip />
                        {/* <Legend /> */}
                        <Bar
                            dataKey="Total"
                            fill="#ffbf00"
                            // barCategoryGap={30}
                            barCategoryGap={20}
                            label={{ position: 'insideRight' }}
                        />
                        {/* <Bar dataKey="FemalePop" stackId="a" fill="#00d725" /> */}
                        {/* <Bar dataKey="TotalHousehold" fill="#347eff" /> */}
                        {/* <Bar background label dataKey="Total" fill="#8884d8" /> */}
                    </BarChart>
                </ResponsiveContainer>


            </div>
        );
    }
}

export default SlideFourPane;
