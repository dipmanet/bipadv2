/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import styles from '../styles.scss';

const CustomizedAxisTick = ({ x, y, stroke, payload }) => (
    <g className={styles.tickFormat} transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
            {payload.value}
        </text>
    </g>
);

const BarChartVisualization = (props) => {
    const { item } = props;

    const excludingZeroValueData = item.filter(itm => itm.value !== 0);
    console.log('item', item);
    console.log('excluding zero data', excludingZeroValueData);
    const BarchartHeight = (data) => {
        if (data.length === 1) {
            return 100;
        } if (data.length < 4) {
            return 150;
        }
        if (data.length < 5) {
            return data.length * 50;
        } if (data.length < 10) {
            return data.length * 45;
        } if (data.length < 20) {
            return data.length * 50;
        }

        return data.length * 60;
    };


    return (


        // <ResponsiveContainer height={(item.length === 1) ? 100 : item.length > 10
        //     ? (item.length * 30) : (item.length * 80)}
        // >
        <ResponsiveContainer height={BarchartHeight(excludingZeroValueData)}>
            <BarChart
                layout="vertical"


                data={excludingZeroValueData}
                margin={{
                    top: 20,
                    right: 60,
                    left: 30,
                    bottom: 20,
                }}
            >
                <YAxis dataKey="label" type="category" interval={0} />
                <XAxis dataKey="value" type="number" />
                <CartesianGrid strokeDasharray="3 3" />
                {/* <Tooltip /> */}
                <Bar
                    dataKey="value"
                    fill="#1A70AC"
                    barSize={20}
                    radius={[0, 0, 0, 0]}

                >
                    {excludingZeroValueData.map(hazard => (
                        <Cell key={hazard.label} fill={hazard.color} />
                    ))}
                    <LabelList
                        dataKey="value"
                        position="right"
                        angle={0}
                        className={styles.labelList}
                    />
                    {/* <LabelList dataKey="value" position="right" /> */}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};


export default BarChartVisualization;
