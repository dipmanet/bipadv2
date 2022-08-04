/* eslint-disable no-plusplus */
import React from 'react';
import { ResponsiveContainer, Treemap } from 'recharts';
import Button from '#rsca/Button';
import styles from './styles.scss';

const HazardWise = (props) => {
    const { selectOption, data } = props;

    const barColors = ['#d3e878', '#00a811', '#e9e1d8', '#0b71bd', '#E2CF45', 'grey', 'green'];

    const datas = [
        { name: 'CartesianAxes', size: 67 },
        { name: 'TooltipControl', size: 8435 },
        { name: 'NodeSprite', size: 1938 },
        { name: 'TooltipEvent', size: 3701 },
        { name: 'LegendRange', size: 10530 },
    ];

    const provinceData = data.filter(item => item.province === 4);
    const hazardData = provinceData.map(item => ({
        name: item.hazardInfo.title,
        size: item.hazardInfo.id,
    }));

    const hazardTypes = [...new Set([...hazardData.map(i => i.name)])];

    const testData = [];

    for (let i = 0; i < hazardTypes.length; i++) {
        const totalData = hazardData.filter(dat => dat.name === hazardTypes[i]);
        const totalSum = totalData.map(idata => idata.size).reduce((a, b) => a + b);
        testData.push({ name: hazardTypes[i], size: totalSum });
    }

    console.log(testData, 'data');

    const CustomizedContent = (prop: any) => {
        const { root, depth, x, y, width, height, index, colors, name, size } = prop;

        return (
            <g>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    style={{
                        fill: depth < 2 ? colors[Math.floor(index / root.children.length * 6)] : 'none',
                        stroke: '#FFFFFF',
                        strokeWidth: 2.5 / (depth + 1e-10),
                        strokeOpacity: 1 / (depth + 1e-10),
                    }}
                />
                {
                    depth === 1
                        ? (
                            <>
                                <text
                                    x={x + width / 2}
                                    y={y + height / 2.2}
                                    textAnchor="middle"
                                    fill="white"
                                    stroke="white"
                                    fontSize={size < 10 ? 10 : 14}
                                    fontWeight={300}
                                >
                                    {name}
                                </text>
                                <text
                                    x={x + width / 2}
                                    y={y + height / 2 + 15}
                                    textAnchor="middle"
                                    fill="white"
                                    stroke="white"
                                    fontSize={18}
                                    fontWeight={300}
                                >
                                    {size}
                                    %
                                </text>
                            </>
                        )
                        : null
                }
            </g>
        );
    };


    return (
        <div className={styles.wrapper}>
            <div className={styles.hazardHead}>
                <p className={styles.hazardText}>
                    Hazardwise distribution of
                    {' '}
                    {selectOption.name}
                    {' '}
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

            <ResponsiveContainer height={400}>
                <Treemap
                    width={400}
                    height={200}
                    data={datas}
                    dataKey="size"
                    stroke="#FFFFFF"
                    fill={barColors.map(item => item)[1]}
                    content={<CustomizedContent colors={barColors} />}
                />
            </ResponsiveContainer>

            <p className={styles.hazardText}>
                Data source:nepal police,drr portal
            </p>
        </div>
    );
};

export default HazardWise;
