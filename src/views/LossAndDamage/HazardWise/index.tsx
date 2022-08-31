/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
import React, {} from 'react';
import { ResponsiveContainer, Treemap } from 'recharts';
import Icon from '#resources/icons/Alert.svg';
import Button from '#rsca/Button';
import styles from './styles.scss';

const HazardWise = (props) => {
    const { selectOption, data } = props;

    const hazardWiseData = Object.entries(data).map((item) => {
        const obj = {
            name: item[1].hazardDetail.title,
            value: item[1].summary[selectOption.key],
            icon: item[1].hazardDetail.icon,
        };
        return obj;
    }).sort((a, b) => b.value - a.value);

    console.log(hazardWiseData, 'data ');


    const testData = [
        {
            name: 'Thunderbolt',
            value: 123,
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>,
        },
        {
            name: 'Wind Storm',
            value: 124,

            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>,
        },
        {
            name: 'Landslide',
            value: 1235,
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>,
        },
    ];

    // const hazardTypeIconSelector = d => d.icon || hazardIcons.unknown;

    const barColors = ['#d4543d', '#d76047', '#d96c54', '#dd7860',
        '#e49077', '#e79c83', '#e69c83',
        '#edb49a', '#f0c0a6', '#f3ccb1', '#f7d8bf',
        '#f6d8bf', 'green', 'yellow', 'white', 'red'];

    // const key = [...new Set([...data.map(item => item.hazardInfo.title)])];

    const icons = [
        {
            name: 'Thunderbolt',
            icon: Icon,
        },
        {
            name: 'Wind Storm',
            icon: Icon,
        },
        {
            name: 'Landslide',
            icon: Icon,
        },
        {
            name: 'Heavy Rainfall',
            icon: Icon,
        },
        {
            name: 'Forest Fire',
            icon: Icon,
        },
        {
            name: 'Snake Bite',
            icon: Icon,
        },
        {
            name: 'Flood',
            icon: Icon,
        },
        {
            name: 'Animal Incidents',
            icon: Icon,
        },
        {
            name: 'Earthquake',
            icon: Icon,
        },
        {
            name: 'Others (Non-Natural)',
            icon: Icon,
        },
        {
            name: 'Helicopter Crash',
            icon: Icon,
        },
        {
            name: 'Drowning',
            icon: Icon,
        },
        {
            name: 'Cold Wave',
            icon: Icon,
        },
        {
            name: 'Boat Capsize',
            icon: Icon,
        },
        {
            name: 'Avalanche',
            icon: Icon,
        },
        {
            name: 'Fire',
            icon: Icon,
        },

    ];


    // const hazardData = [];

    // for (let i = 0; i < key.length; i++) {
    //     const dataAccordingHazard = data.filter(item => item.hazardInfo.title === key[i]);
    //     const hazards = dataAccordingHazard.map(item => item.hazardInfo.id).reduce((a, b) => a + b);
    //     hazardData.push({ name: key[i], value: hazards });
    // }

    // const finalHazardData = [];

    // if (hazardData.length > 0) {
    //     for (let i = 0; i < icons.length; i++) {
    //         for (let j = 0; j < hazardData.length; j++) {
    //             if (icons[i].name === hazardData[j].name) {
    //                 finalHazardData.push({ name: hazardData[j].name, value: hazardData[j].value, icon: icons[i].icon });
    //             }
    //         }
    //     }
    // }

    console.log(data, 'data');

    // const sortedHazardData = finalHazardData.sort((a, b) => b.value - a.value);


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
                                    x={x + width / 5}
                                    y={y + height / 8}
                                    textAnchor="middle"
                                    fill="white"
                                    stroke="white"
                                    fontSize={value < 10 ? 10 : 14}
                                    fontWeight={300}
                                >
                                    {name}
                                </text>

                                <text
                                    x={x + width / 5}
                                    y={y + height / 4.5}
                                    textAnchor="middle"
                                    fill="white"
                                    stroke="white"
                                    fontSize={value < 10 ? 10 : 14}
                                    fontWeight={300}
                                >
                                    {value}
                                </text>

                                <image
                                    width={value > 10 ? '30px' : '15px'}
                                    height={value > 10 ? '30px' : '15px'}
                                    href={icon}
                                    x={x + width / 6}
                                    y={y - height / 3.5}
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
                <ResponsiveContainer height={400}>
                    <Treemap
                        width={400}
                        height={200}
                        data={hazardWiseData}
                        dataKey="value"
                        stroke="#FFFFFF"
                        fill={barColors.map(item => item)[1]}
                        content={<CustomizedContent colors={barColors} />}
                        aspectRatio={1 / 3}
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
