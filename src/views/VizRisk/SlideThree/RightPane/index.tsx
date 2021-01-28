import React from 'react';
import memoize from 'memoize-one';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import styles from './styles.scss';
import Demographics from '#views/Profile/DisasterProfile/Demographics';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

const demographicsData = [
    {
        name: 'Ward 1', MalePopulation: 2357, FemalePopulation: 3040, TotalHousehold: 1283,
    },
    {
        name: 'Ward 2', MalePopulation: 2729, FemalePopulation: 3012, TotalHousehold: 1251,
    },
    {
        name: 'Ward 3', MalePopulation: 2499, FemalePopulation: 3195, TotalHousehold: 1255,
    },
    {
        name: 'Ward 4', MalePopulation: 3300, FemalePopulation: 3779, TotalHousehold: 1693,
    },
    {
        name: 'Ward 5', MalePopulation: 2938, FemalePopulation: 3373, TotalHousehold: 1360,
    },
    {
        name: 'Ward 6', MalePopulation: 2583, FemalePopulation: 3034, TotalHousehold: 1185,
    },
    {
        name: 'Ward 7', MalePopulation: 1505, FemalePopulation: 1867, TotalHousehold: 766,
    },
    {
        name: 'Ward 8', MalePopulation: 2339, FemalePopulation: 2815, TotalHousehold: 1059,
    },
    {
        name: 'Ward 9', MalePopulation: 2056, FemalePopulation: 2607, TotalHousehold: 1018,
    },
    {
        name: 'Ward 10', MalePopulation: 3213, FemalePopulation: 3343, TotalHousehold: 1268,
    },
];

class SlideThreePane extends React.PureComponent<Props, State> {
    public render() {
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
                        data={demographicsData}
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
