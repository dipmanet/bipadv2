/* eslint-disable max-len */
/* eslint-disable no-plusplus */
import React from 'react';
import { ResponsiveContainer, Treemap } from 'recharts';
import Button from '#rsca/Button';
import styles from './styles.scss';

const HazardWise = (props) => {
    const { selectOption, data } = props;

    const barColors = ['#d3e878', '#00a811', '#e9e1d8', '#0b71bd', '#E2CF45', 'grey',
        'green', 'black', 'blue', 'red', 'yellow', 'white', 'cyan', 'purple',
        'indigo', 'gray', 'violet', 'white'];

    const key = [...new Set([...data.map(item => item.hazardInfo.title)])];

    const hazardData = [];

    for (let i = 0; i < key.length; i++) {
        const dataAccordingHazard = data.filter(item => item.hazardInfo.title === key[i]);
        const hazards = dataAccordingHazard.map(item => item.hazardInfo.id).reduce((a, b) => a + b);
        hazardData.push({ name: key[i], value: hazards });
    }

    console.log(hazardData, 'province');


    const CustomizedContent = (prop: any) => {
        const { root, depth, x, y, width, height, index, colors, name, value } = prop;


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
                                    fontSize={value < 10 ? 10 : 14}
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
                                    {value}
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

            {hazardData.length > 0 && (
                <ResponsiveContainer height={400}>
                    <Treemap
                        width={400}
                        height={200}
                        data={hazardData}
                        dataKey="value"
                        stroke="#FFFFFF"
                        fill={barColors.map(item => item)[1]}
                        content={<CustomizedContent colors={barColors} />}
                    />
                </ResponsiveContainer>
            )}

            <p className={styles.hazardText}>
                Data source : nepal police,drr portal
            </p>
        </div>
    );
};

export default HazardWise;
