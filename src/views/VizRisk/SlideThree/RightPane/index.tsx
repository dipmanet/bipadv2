import React from 'react';
import memoize from 'memoize-one';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import styles from './styles.scss';
import demographicsData from '../../demographicsData';
import CustomChartLegend from '#views/VizRisk/CustomChartLegend';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b', '#016cc3'];
const data = [
    { name: 'HDI', value: 0.446 },
    { name: 'Life Expectancy', value: 67.26 },
    { name: 'HPI', value: 32.3 },
    { name: 'PCI', value: 1086 },
    { name: 'Households with mobile phone', value: 6794 },
    { name: 'Households with television', value: 5860 },
];

class SlideThreePane extends React.PureComponent<Props, State> {
    public render() {
        const chartData = demographicsData.demographicsData;
        return (
            <div className={styles.vrSideBar}>

                <h1>Municipality Profile</h1>
                <div className={styles.customChartLegend}>
                    <CustomChartLegend
                        text={data[0].name}
                        barColor={COLORS[0]}
                        background={'rgb(167,225,248)'}
                        data={0.446}
                    />
                    <CustomChartLegend
                        text={data[1].name}
                        barColor={COLORS[1]}
                        background={'rgb(149,198,229)'}
                        data={67.26}
                    />
                    <CustomChartLegend
                        text={data[2].name}
                        barColor={COLORS[2]}
                        background={'rgb(0,101,119)'}
                        data={32.3}
                    />
                    <CustomChartLegend
                        text={data[3].name}
                        barColor={COLORS[3]}
                        background={'rgb(245, 175, 212)'}
                        data={1086}
                    />
                    <CustomChartLegend
                        text={data[4].name}
                        barColor={COLORS[4]}
                        background={'rgb(247, 197, 181)'}
                        data={6794}
                    />
                    <CustomChartLegend
                        text={data[5].name}
                        barColor={COLORS[5]}
                        background={'rgb(149,198,229)'}
                        data={5860}
                    />
                </div>
                {/* <ul className={styles.profileList}>
                    <li>
                            HDI
                        <sup>1</sup>
                            : 0.446
                    </li>
                    <li>
                            Life Expectancy
                        <sup>1</sup>
                            : 67.26
                    </li>
                    <li>
                            HPI
                        <sup>1</sup>
                            : 32.3
                    </li>
                    <li>
                            PCI
                        <sup>1</sup>
                            : 1086
                    </li>
                    <li>
                            Household with mobile phone
                        <sup>2</sup>
                            : 6794
                    </li>
                    <li>
                        Household with television
                        <sup>2</sup>
                            : 5860
                    </li>
                </ul> */}

                <h1>Demography</h1>
                <p>
                    {' '}
                        Rajapur has the total population of 55,584 with the
                        male and female population eing 25,519 and 30,065
                        respectively. Total household number counts to 12,138.
                        Ward number 4 has the largest household number that equals to 1639
                        while ward number 7 has the least comprising of only
                        766 number of household.

                </p>
                <ResponsiveContainer>
                    <BarChart
                        width={500}
                        height={300}
                        data={chartData}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <XAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="MalePopulation" fill="rgb(245,87,149)" />
                        <Bar dataKey="FemalePopulation" fill="rgb(0,163,223)" />
                        <Bar dataKey="TotalHousehold" fill="rgb(0,172,163)" />
                    </BarChart>
                </ResponsiveContainer>

            </div>
        );
    }
}

export default SlideThreePane;
