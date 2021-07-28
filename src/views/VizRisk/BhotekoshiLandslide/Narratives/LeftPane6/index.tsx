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
import styles from './styles.scss';
import Demo from '../../Data/demographicsData';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import ManWoman from '#views/VizRisk/Tikapur/Icons/ManWoman.svg';
import Male from '#views/VizRisk/Tikapur/Icons/male.svg';
import Female from '#views/VizRisk/Tikapur/Icons/female.svg';
import Home from '#views/VizRisk/Tikapur/Icons/home.svg';


const demoChartdata = Demo.demographicsData;

interface Props{
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
    helipad: 'Helipad',
};

const LeftPane6 = (props: Props) => {
    const { ci } = props;
    console.log('ci in left pane', ci);
    const [ciGeoJson, setCiGeo] = useState([]);

    useEffect(() => {
        if (ci.length > 0) {
            const features = ci.map(f => ({
                properties: {
                    resourceType: f.resourceType,
                    title: f.title,
                    id: f.id,
                },
                geometry: f.point,
            }));
            const geoArr = {
                type: 'FeatureCollection',
                features,
            };
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
            <p>
            Critical Infrastructures are crucial even during the
            time of crisis. The residential and governmental buildings,
            religious and cultural sites, banking institutions, as well
            as critical infrastructures such as hospitals, schools,
            bridges in the municipality are at constant threat of landslide
            every year.
            </p>
            <ResponsiveContainer className={styles.respContainer} width="100%" height={300}>
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
                    <Tooltip />
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
    );
};

export default LeftPane6;
