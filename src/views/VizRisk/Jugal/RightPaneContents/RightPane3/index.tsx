import React from 'react';
import {
    Bar, BarChart,
    CartesianGrid, Legend,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import DemographyData from '../../Data/demographyChartData';
import styles from '../styles.scss';

// import NavButtons from '#views/VizRisk/Common/NavButtons';
import NavButtons from '../../Components/NavButtons';


const demoChartdata = DemographyData.chartData;

interface Props {
    handleNext: () => void;
    handlePrev: () => void;
    disableNavLeftBtn: boolean;
    disableNavRightBtn: boolean;
    pagenumber: number;
    totalPages: number;
}

class SlideThreePane extends React.PureComponent<Props, State> {
    public renderLegend = () => (
        <div className={styles.climateLegendContainer}>
            <div className={styles.climatelegend}>
                <div className={styles.legendMax} />
                <div className={styles.legendText}>
                       Male Pop
                    <sup>n</sup>
                </div>
            </div>
            <div className={styles.climatelegend}>
                <div className={styles.legendDaily} />
                <div className={styles.legendText}>
                    Female Pop
                    <sup>n</sup>
                </div>
            </div>
            <div className={styles.climatelegend}>
                <div className={styles.legendMin} />
                <div className={styles.legendText}>
                       Total Household
                </div>
            </div>
        </div>
    )

    public render() {
        const {
            handleNext,
            handlePrev,
            disableNavLeftBtn,
            disableNavRightBtn,
            pagenumber,
            totalPages,
        } = this.props;

        return (
            <div className={styles.vrSideBar}>
                <h1>Demography</h1>
                <p>
                Population distribution in Jugal Rural Municipality is largely
                uneven with some pockets of dense settlements. The rural municipality
                has total population of 19,231 with 9581 male and 9650 female population
                residing in total 3941 households. Ward 2 has the largest household number
                with 731 households while ward 6 has the least number of households comprising
                of 378 households.
                </p>
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={500}>
                        <BarChart
                            // width={330}
                            // height={700}
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
