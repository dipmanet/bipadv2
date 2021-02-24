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
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import ManWoman from '#views/VizRisk/SlideOne/Icons/ManWoman.svg';

import ElevationIcon from '#views/VizRisk/SlideOne/Icons/ElevationFromSea.svg';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b', '#016cc3'];

class SlideFourPane extends React.PureComponent<Props, State> {
    public render() {
        const chartData = demographicsData.demographicsData;
        return (
            <div className={styles.vrSideBar}>
                <h1>Flood Exposure </h1>

                <p>
                Rajapur usually experiences frequent floods often with high intensity.
                    <br />
                The map shows the exposure data together with the flood hazard maps.
                    <br />
                The exposure layer shows the critical infrastructures in Rajapur.
                    <br />
                The flood hazard map of either 5 years, 10 years,
                20 years, 50 years, 100 years, or 1000 years return
                period can be overlayed over the exposure layer.
                The data represents the water depth for floods of a
                certain year return period or recurrence interval.
                    <br />
                Return period indicates the average interval of time
                within which the flood of that magnitude will occur.
                Another way of expressing this is to say that the data
                show the probability of experiencing a given water depth
                within a single year; i.e. depths shown by the ‘1-in-100
                year’ layer have a 1-in-100 (or 1%) chance of occurrence in any given year.
                    <br />
                An understanding of the critical infrastructures exposed
                to floods can be developed with the help of the map.
                </p>

                <ResponsiveContainer width="100%" height={'50%'}>
                    <BarChart
                        width={350}
                        height={600}
                        data={chartData}
                        layout="vertical"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="MalePop" stackId="a" fill="#ffbf00" />
                        <Bar dataKey="FemalePop" stackId="a" fill="#00d725" />
                        <Bar dataKey="TotalHousehold" fill="#347eff" />
                        {/* <Bar background label dataKey="foo" fill="#8884d8" /> */}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

export default SlideFourPane;
