import React from 'react';
import memoize from 'memoize-one';

import {
    Bar, BarChart,
    CartesianGrid, Legend,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import styles from './styles.scss';
import demographicsData from '#views/VizRisk/Rajapur/Data/demographicsData';
import DemographyData from './DemographyChartData';

import Disclaimer from '../../Components/Disclaimer';
import NavButtons from '../../Components/NavButtons';

const demoChartdata = DemographyData.chartData;

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = [
    'rgb(0,177,0)',
    'rgb(181,209,122)',
    'rgb(241,238,150)',
    'rgb(245,219,131)',
    'rgb(255,240,255)',
    'rgb(207,144,119)',
];

class SlideThreePane extends React.PureComponent<Props, State> {
    public renderLegend = props => (
        <div className={styles.climateLegendContainer}>
            <div className={styles.climatelegend}>
                <div className={styles.legendMax} />
                <div className={styles.legendText}>
                       Male Pop
                    <sup>n</sup>
                </div>
            </div>
            <div className={styles.climatelegend}>
                <div className={styles.legendMin} />
                <div className={styles.legendText}>
                    Female Pop
                    <sup>n</sup>
                </div>
            </div>
            <div className={styles.climatelegend}>
                <div className={styles.legendDaily} />
                <div className={styles.legendText}>
                       Total Household
                </div>
            </div>
        </div>
    )

    public render() {
        const {
            payload,
            handleNext,
            handlePrev,
            disableNavLeftBtn,
            disableNavRightBtn,
            disableNav,
            RightBtn,
            pagenumber,
            totalPages,
        } = this.props;

        return (
            <div className={styles.vrSideBar}>
                <h1>Demography</h1>
                <p>
                Jugal Rural Municipality has the total population of
                19,231 with the male and female population being
                9,581 and 9,650 respectively. Total household number
                counts to 3,941. Ward number 2 has the largest household
                number that equals to 731, while ward number 6 has the
                least comprising of only 378 number of household.
                </p>
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={'100%'}>
                        <BarChart
                            width={350}
                            height={600}
                            data={demoChartdata.filter(item => item.name !== 'Ward 99')}
                            layout="vertical"
                            margin={{ top: 30, bottom: 10, right: 20, left: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tick={{ fill: '#94bdcf' }} />
                            <YAxis type="category" dataKey="name" tick={{ fill: '#94bdcf' }} />
                            <Tooltip />
                            {/* <Legend /> */}
                            <Legend iconType="square" iconSize={10} align="center" content={this.renderLegend} />
                            <Bar dataKey="MalePop" fill="#ffbf00" />
                            <Bar dataKey="FemalePop" fill="#00d725" />
                            <Bar dataKey="TotalHousehold" fill="#347eff" />
                            {/* <Bar background label dataKey="foo" fill="#8884d8" /> */}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
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

export default SlideThreePane;
