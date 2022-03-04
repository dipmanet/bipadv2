/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styles from '../styles.scss';

const NumberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const CustomizedAxisTick = ({ x, y, stroke, payload }) => (
    <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
            {NumberWithCommas(Math.abs(payload.value))}
        </text>
    </g>
);
const CustomizedLabelMale = ({ x, y, fill, value, width, height }) => (
    <text
        x={x + width - 39}
        y={y + 22}
        dy={-4}
        fontSize="14"
        fontFamily="sans-serif"
        fill={'#ffffff'}
        textAnchor="middle"


    >
        {NumberWithCommas(Math.abs(value))}
    </text>
);
const CustomizedLabelFemale = ({ x, y, fill, value, width, height }) => (
    <text
        x={x + width + 39}
        y={y + 22}
        dy={-4}
        fontSize="14"
        fontFamily="sans-serif"
        fill={'#ffffff'}
        textAnchor="middle"


    >
        {NumberWithCommas(Math.abs(value))}
    </text>
);
const CustomizedLabel = ({ x, y, fill, value, width, height }) => (
    <text
        x={x + width - 45}
        y={y + 21}
        dy={-4}
        fontSize="14"
        fontFamily="sans-serif"
        fill={'#ffffff'}
        textAnchor="middle"


    >
        {NumberWithCommas(Math.abs(value).toFixed(2))}
    </text>
);
const CustomizedLabelLiteracyRate = ({ x, y, fill, value, width, height }) => (
    <text
        x={x + width - 35}
        y={y + 21}
        dy={-4}
        fontSize="14"
        fontFamily="sans-serif"
        fill={'#ffffff'}
        textAnchor="middle"


    >
        {(Math.abs(value).toFixed(2))}
        %
    </text>
);
const renderLegend = (props) => {
    const { payload } = props;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '50px' }}>
            {
                payload.map((entry, index) => (
                    <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
                        <div style={{ height: '15px', width: '15px', backgroundColor: `${entry.color}`, marginRight: '10px' }} />
                        <h2>{entry.value.charAt(0).toUpperCase() + entry.value.slice(1)}</h2>
                    </div>
                ))
            }
        </div>
    );
};
const BarchartVisualization = ({ item, category, percentage }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        if (category) {
            const finalData = item.map(d => (
                { ...d, female: d.femaleForPyramidGraphVisualization }
            ));

            setData(finalData);
        } else {
            setData(item);
        }
    }, [item, category]);

    return (
        data.length
            ? !category ? (
                <ResponsiveContainer height={item.length * 85} width={'100%'}>

                    <BarChart
                        layout="vertical"
                        width={500}
                        height={50}

                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 40,
                            bottom: 5,
                        }}
                    // margin={{ top: 20,
                    //     right: 60,
                    //     left: 20,
                    //     bottom: 20 }}
                    >
                        <YAxis dataKey="label" type="category" interval={0} width={64} />
                        <XAxis
                            dataKey="percentage"
                            type="number"
                            tick={<CustomizedAxisTick />}
                        />
                        {/* <CartesianGrid strokeDasharray="3 3" /> */}
                        {/* <Tooltip /> */}
                        <Bar
                            dataKey="percentage"
                            fill="#1A70AC"
                            barSize={25}
                            radius={[0, 0, 0, 0]}
                            // label={{ position: 'insideRight', fill: '#ffffff', fontSize: '16px' }}
                            label={percentage ? <CustomizedLabelLiteracyRate /> : <CustomizedLabel />}

                        >
                            {data.map(hazard => (
                                <Cell key={hazard.label} />
                            ))}
                            {/* <LabelList
                                dataKey="value"
                                position="insideRight"
                                angle={0}
                                className={styles.labelList}
                            /> */}

                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )

                : (
                    <ResponsiveContainer height={510} width={'100%'}>

                        <BarChart
                            width={500}
                            height={300}
                            data={data}
                            stackOffset="sign"
                            layout="vertical"
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >

                            <XAxis
                                type="number"
                                tick={<CustomizedAxisTick />}
                            />
                            <YAxis
                                width={64}
                                dataKey="label"
                                type="category"
                            />

                            <Legend align="center" content={renderLegend} />
                            <ReferenceLine x={0} stroke="#000" />

                            <Bar
                                dataKey="female"
                                fill="#83A4D3"

                                barSize={25}
                                stackId="stack"
                                label={<CustomizedLabelFemale />}
                                // label={{ position: 'right', fill: '#ffffff', fontSize: '16px' }}
                                minPointSize={70}
                            />
                            <Bar
                                dataKey="male"
                                fill="#2A7BBB"
                                stackId="stack"
                                barSize={25}
                                label={<CustomizedLabelMale />}
                                // label={{ position: 'insideRight', fill: '#ffffff', fontSize: '16px' }}
                                minPointSize={70}
                            />
                        </BarChart>

                    </ResponsiveContainer>
                ) : ''

    );
};

export default BarchartVisualization;
