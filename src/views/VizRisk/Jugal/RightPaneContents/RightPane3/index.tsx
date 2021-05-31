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
                    Located in the Hilly region, Jugal has total area of
                    596.5 square kilometers. Out of total area, 81.24% of
                    land is used for agriculture. Major crops grown in this
                    rural municipality are rice, maize, and wheat. Built-in
                    area covers 7.66 % of land while water bodies occupy 3.29%
                    of total land in Jugal.
                </p>
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={'100%'}>
                        <BarChart
                            width={350}
                            height={700}
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
                            <Bar
                                dataKey="MalePop"
                                fill="#ffbf00"
                                radius={[0, 10, 10, 0]}
                                barSize={10}
                            />
                            <Bar
                                dataKey="FemalePop"
                                radius={[0, 10, 10, 0]}
                                fill="#00d725"
                                barSize={10}

                            />
                            <Bar
                                dataKey="TotalHousehold"
                                radius={[0, 10, 10, 0]}
                                fill="#347eff"
                                barSize={10}

                            />
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
