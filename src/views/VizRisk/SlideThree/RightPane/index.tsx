import React from 'react';
import memoize from 'memoize-one';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import styles from './styles.scss';
import demographicsData from '../../demographicsData';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

class SlideThreePane extends React.PureComponent<Props, State> {
    public render() {
        const chartData = demographicsData.demographicsData;
        return (
            <div className={styles.vrSideBar}>

                <h1>Municipality Profile</h1>
                <ul className={styles.profileList}>
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
                </ul>

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
