import React from 'react';
import { CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis, YAxis } from 'recharts';
import styles from './styles.scss';
import LineData from './data';

interface Props{
    reportData: Element[];
}

const Preview = (props: Props) => {
    const { reportData } = props;
    const { lineData } = LineData;
    return (
        <div className={styles.previewContainer}>
            {reportData.map(comp => (
                <div key={comp.name} className={styles.previewComps}>
                    {comp}
                </div>
            ))}
            <ResponsiveContainer width={'50%'} height={300}>
                <LineChart
                    margin={{ top: 0, right: 10, left: 10, bottom: 10 }}
                    data={lineData}
                >
                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                    />
                    <XAxis
                        dataKey="name"
                        interval="preserveStart"
                        tick={{ fill: '#94bdcf' }}
                    />
                    <YAxis
                        unit={'℃'}
                        axisLine={false}
                        domain={[0, 40]}
                        padding={{ top: 20 }}
                        tick={{ fill: '#94bdcf' }}
                        tickCount={10}
                        interval="preserveEnd"
                        allowDataOverflow
                    />
                    <Line type="monotone" dataKey="AvgMax" stroke="#ffbf00" />
                    <Line type="monotone" dataKey="DailyAvg" stroke="#00d725" />
                    <Line type="monotone" dataKey="AvgMin" stroke="#347eff" />
                </LineChart>
            </ResponsiveContainer>
        </div>

    );
};

export default Preview;
