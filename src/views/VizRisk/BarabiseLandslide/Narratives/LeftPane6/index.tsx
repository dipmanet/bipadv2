import React, { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import styles from '../../styles.scss';

interface Props {
    handleNext: () => void;
    handlePrev: () => void;
    pagenumber: number;
    totalPages: number;
    pending: boolean;

}

const ciRef = {
    finance: 'Finance',
    health: 'Hospitals',
    education: 'Educational Institutions',
};

const LeftPane6 = (props: Props) => {
    const { ci } = props;
    const [ciGeoJson, setCiGeo] = useState([]);

    useEffect(() => {
        if (ci.length > 0) {
            const resourceArr = [...new Set(ci.map(c => c.resourceType))];
            const chartData = resourceArr.map(res => ({
                name: ciRef[res],
                Total: ci.filter(f => f.resourceType === res).length,
            }));

            setCiGeo(chartData);
        }
    }, [ci]);

    return (
        <div className={styles.vrSideBar}>
            <h1>Community Infrastructure</h1>
            <p className={styles.narrativeText}>
                Community Infrastructures are socially, economically or
                operationally essential to the functioning of a society
                or community, both in routine circumstances and in the
                extreme events of an emergency.
                The residential and governmental buildings, religious and cultural
                sites, banking institutions, as well as critical infrastructures
                such as hospitals, schools, bridges in the municipality are at
                constant threat of landslides every year.
            </p>
            <div className={styles.climateChart}>
                <ResponsiveContainer width={'100%'} height={'100%'}>
                    <BarChart
                        width={300}
                        height={600}
                        data={ciGeoJson}
                        layout="vertical"
                        margin={{ left: 20, right: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fill: '#94bdcf' }}
                        />
                        <Bar
                            dataKey="Total"
                            fill="rgb(0,219,95)"
                            barSize={20}
                            label={{ position: 'right', fill: '#ffffff' }}
                            tick={{ fill: '#94bdcf' }}
                            radius={[0, 20, 20, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>

            </div>
        </div>
    );
};

export default LeftPane6;
