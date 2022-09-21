/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
import React from 'react';
import { ResponsiveContainer, Treemap } from 'recharts';
import Button from '#rsca/Button';
import styles from './styles.scss';
import { estimatedLossValueFormatter } from '../utils/utils';

const HazardWise = (props) => {
    const { selectOption, data } = props;

    const hazardWiseData = Object.entries(data).map((item) => {
        const obj = {
            name: item[1].hazardDetail.title,
            value: item[1].summary[selectOption.key],
            icon: item[1].hazardDetail.icon,
        };
        return obj;
    }).sort((a, b) => b.value - a.value).slice(0, 10);

    const barColors = ['#d4543d', '#d76047', '#d96c54', '#dd7860',
        '#e49077', '#e79c83', '#e69c83',
        '#edb49a', '#f0c0a6', '#f3ccb1', '#f7d8bf',
        '#f6d8bf'];

    const totalSum = hazardWiseData.length > 0 && hazardWiseData.map(item => item.value).reduce((a, b) => a + b);
    const CustomizedContent = (prop: any) => {
        const { root, depth, x, y, width, height, index, colors, name, value, icon } = prop;
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
                                    x={x + width / 7}
                                    y={y + height / 5}
                                    textAnchor="top"
                                    fill="white"
                                    stroke="white"
                                    fontWeight={'100'}
                                    fontSize={(height + width) / 28}
                                >
                                    {(height + width) > 150 ? name : ''}
                                </text>
                                <text
                                    x={x + width / 7}
                                    y={y === 0 ? y + height / 3 : y + height / 2.5}
                                    textAnchor="top"
                                    fill="white"
                                    stroke="white"
                                    fontSize={(height + width) / 20}
                                    fontWeight={'300'}
                                >
                                    {(height + width) > 150 ? estimatedLossValueFormatter(value) : ''}
                                </text>
                                <image
                                    fill={'red'}
                                    textAnchor="top"
                                    width={(height + width) <= 150 ? '15px' : (height + width) / 14}
                                    height={(height + width) <= 150 ? '15px' : (height + width) / 14}
                                    href={icon}
                                    x={x + width / 8}
                                    y={(height + width) <= 150 ? (y + height / 7) : y + height / 1.5}
                                />
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

            {hazardWiseData.length > 0 && (
                <ResponsiveContainer height={300}>
                    <Treemap
                        width={400}
                        height={300}
                        data={hazardWiseData}
                        dataKey="value"
                        stroke="#FFFFFF"
                        fill={barColors.map(item => item)[1]}
                        content={<CustomizedContent colors={barColors} />}
                        aspectRatio={4 / 3}
                    />
                </ResponsiveContainer>
            )}

            <p className={styles.hazardText} style={{ marginTop: '45px' }}>
                Data source : nepal police,drr portal
            </p>
        </div>
    );
};

export default HazardWise;
