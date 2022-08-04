import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '#rsca/Button';
import styles from './styles.scss';


const AreaChartVisual = (props) => {
    const { selectOption: { name, key } } = props;

    const data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];
    return (

        // <div className={styles.container}>
        <div className={styles.wrapper}>
            <div className={styles.firstDiv}>
                <p className={styles.text}>
                    Temporal distribution of
                    {' '}
                    {name}
                </p>
                <Button
                    title="Download Chart"
                    className={styles.downloadButton}
                    transparent
                    // disabled={pending}
                    // onClick={this.handleSaveClick}
                    iconName="download"
                />

            </div>
            <div className={styles.areaChart}>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart
                        width={500}
                        height={200}
                        data={data}
                        margin={{
                            top: 5,
                            bottom: 20,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#db6e51" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#db6e51" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid stroke="#ccc" horizontal vertical={false} />
                        <XAxis
                            tickLine={false}
                            dataKey="name"
                            dy={15}
                            angle={-30}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="uv" stroke="#db6e51" fillOpacity={1} fill="url(#colorUv)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
        // </div>
    );
};

export default AreaChartVisual;
