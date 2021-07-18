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


const LeftPane7 = (props: Props) => {
    const { ci } = props;
    console.log('ci in left pane', ci);


    return (
        <div className={styles.vrSideBar}>
            <h1>Past Landslide Incidents</h1>
            <p>
                In the year 2020, 3 landslides have
               occurred in the municipality. 8 people lost
               their lives, 32 went missing and 47 infrastructures
               were destroyed due to the incidents.
            </p>

        </div>
    );
};

export default LeftPane7;
