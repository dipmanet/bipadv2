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
                <div className={styles.legendMale} />
                <div className={styles.legendText}>
                       Male Pop
                    <sup>n</sup>
                </div>
            </div>
            <div className={styles.climatelegend}>
                <div className={styles.legendFemale} />
                <div className={styles.legendText}>
                    Female Pop
                    <sup>n</sup>
                </div>
            </div>
            <div className={styles.climatelegend}>
                <div className={styles.legendTotHH} />
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
                Population distribution in the region is largely uneven
                 with some pockets of dense settlements. This map allows
                 viewing the population distribution within each ward and
                 helps to locate the region of dense and sparse settlements.
                </p>
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={'100%'}>
                        <BarChart
                            // width={350}
                            // height={600}
                            data={demoChartdata.filter(item => item.name !== 'Ward 99')}
                            layout="vertical"
                            margin={{ top: 30, bottom: 10, right: 20, left: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tick={{ fill: '#94bdcf' }} />
                            <YAxis type="category" dataKey="name" tick={{ fill: '#94bdcf' }} />
                            <Tooltip />
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
