/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import { ResponsiveContainer, Treemap } from 'recharts';

import styles from './styles.scss';

const LeftpaneSlide2 = () => {
    const data = [
        { name: 'Agricultural Land', size: 45.24 },
        { name: 'Forest', size: 4.74 },
        { name: 'Sand', size: 2 },
        { name: 'Water Bodies', size: 25.55 },
        { name: 'Built up', size: 4.74 },
        { name: 'Residential', size: 10.74 },
        { name: 'Grassland', size: 14.74 },
	  ];
	  const barColors = ['#19a79d', '#8b71dc', '#8DC77B', '#0b71bd', '#E2CF45', 'grey', 'green'];


    const CustomizedContent = (props: any) => {
        const { root, depth, x, y, width, height, index, colors, name, size } = props;

        return (
            <g>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    style={{
                        fill: depth < 2 ? colors[Math.floor(index / root.children.length * 6)] : 'none',
                        stroke: '#0c2432',
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
                                    fontSize={14}
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
        <div className={styles.vrSideBar}>
            <h1>Landcover</h1>
            <p>
                Ratnanagar  Municipality is located in Sindhupalchok
                district of Bagmati province. The rural municipality
                has 7 wards covering a total area of 592 sq. km and
                is situated at an elevation of 800 m to 7000m AMSL.

            </p>
            <p>
                Ratnanagar  Municipality is located in Sindhupalchok
                district of Bagmati province. The rural municipality
                has 7 wards covering a total area of 592 sq. km and
                is situated at an elevation of 800 m to 7000m AMSL.

            </p>
            <p>
                Ratnanagar  Municipality is located in Sindhupalchok
                district of Bagmati province. The rural municipality
                has 7 wards covering a total area of 592 sq. km and
                is situated at an elevation of 800 m to 7000m AMSL.

            </p>
            <ResponsiveContainer height={400}>
                <Treemap
                    width={400}
                    height={200}
                    data={data}
                    dataKey="size"
                    stroke="#0c2432"
                    fill={barColors.map(item => item)[1]}
                    content={<CustomizedContent colors={barColors} />}
                />
            </ResponsiveContainer>
        </div>
    );
};


export default LeftpaneSlide2;
