import React, { useState } from 'react';
import {
    CartesianGrid,
    Cell,
    Label,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import styles from './styles.scss';
import CustomLabel from '#views/VizRisk/Common/ChartComps/CustomLabel';
import CustomChartLegend from '#views/VizRisk/Common/ChartComps/CustomChartLegend';
import LandCover from '../../Data/LandCoverChartData';

const demoChartdata = LandCover.chartData;

interface Props{
    handleNext: () => void;
    handlePrev: () => void;
    pagenumber: number;
    totalPages: number;
    pending: boolean;

}


const LeftPane4 = (props: Props) => {
    const { data: {
        renderActiveShape,
        onPieEnter,
        customTooltip,
        activeIndex,
    } } = props;

    return (
        <div className={styles.vrSideBar}>
            <h1>Demography</h1>
            <p>
            Barhabise municipality has a total population of 26,114
            with 13257 males and 12853 females residing in a total
            of 7660 households. Ward 3 has the largest number of
            households (1195) while ward 1 has the least number of
            households (310).
            </p>


        </div>


    );
};

export default LeftPane4;
