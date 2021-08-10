import React from 'react';

import {
    Bar, BarChart,
    CartesianGrid, Legend,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import DemographyData from '../../Data/demographyChartData';

import NavButtons from '../../Components/NavButtons';
import styles from '../styles.scss';

const demoChartdata = DemographyData.chartData;


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
                Panchpokhari Thangpal Rural Municipality has the
                total population of 34,697 with 17,733 males and
                16,964 females. Total household number counts to 7,803.
                Ward number 7 has the largest household number of 1414,
                while ward number 5 has the least comprising of only 690
                number of household.
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
