/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import React from 'react';
import {
    Sankey,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Legend,
    Tooltip,
} from 'recharts';
import styles from './styles.scss';

interface Props {
    barTitle?: string;
    barData: object[];
}

const SankeyChart = (props: Props) => {
    const { barTitle, barData } = props;
    const data0 = {
        nodes: [
		  {
                name: 'Visit',
		  },
		  {
                name: 'Direct-Favourite',
		  },
		  {
                name: 'Page-Click',
		  },
		  {
                name: 'Detail-Favourite',
		  },
		  {
                name: 'Lost',
		  },
        ],
        links: [
		  {
                source: 0,
                target: 1,
                value: 3728.3,
		  },
		  {
                source: 0,
                target: 2,
                value: 354170,
		  },
		  {
                source: 2,
                target: 3,
                value: 62429,
		  },
		  {
                source: 2,
                target: 4,
                value: 291741,
		  },
        ],
	  };
    return (
        <div className={styles.mainBarChart}>
            <h3 className={styles.barTitle}>{barTitle}</h3>
            <ResponsiveContainer
                height={300}
            >
                <Sankey
                    width={200}
                    height={200}
                    data={data0}
                    // node={<MyCustomNode />}
                    // nodePadding={50}
                    margin={{ left: 15, right: 25 }}

                    link={{ stroke: '#77c878' }}
                >
                    <Tooltip />
                </Sankey>
            </ResponsiveContainer>
        </div>
    );
};

export default SankeyChart;
