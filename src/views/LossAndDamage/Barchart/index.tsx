/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Text } from 'recharts';
import { _cs } from '@togglecorp/fujs';
import Button from '#rsca/Button';
import styles from './styles.scss';
import { nullCheck } from '#utils/common';
import { lossMetrics } from '#utils/domain';
import { estimatedLossValueFormatter } from '../utils/utils';

interface IndividualChartData {
    name: string;
    value: string;
}
type ChartData = IndividualChartData[]

const BarChartVisual = (props) => {
    const [chartData, setChartData] = useState<ChartData>([]);
    const { selectOption,
        regionRadio,
        data,
        valueOnclick,
        className,
        handleSaveClick, downloadButton } = props;

    const provinceIndex = data.map(i => ({
        name: i.provinceTitle,
        id: i.province,
    })).filter((element, index, array) => array.findIndex(newEl => (newEl.id === element.id)) === index)
        .sort((a, b) => a.id - b.id);

    const districtIndex = data.map(i => ({
        name: i.districtTitle,
        id: i.district,
    })).filter((element, index, array) => array.findIndex(newEl => (newEl.id === element.id)) === index)
        .sort((a, b) => a.id - b.id);

    const municipalityIndex = data.map(i => ({
        name: i.municipalityTitle,
        id: i.municipality,
    })).filter((element, index, array) => array.findIndex(newEl => (newEl.id === element.id)) === index)
        .sort((a, b) => a.id - b.id);

    const distributionCalculate = (typeKey, type) => {
        const key = lossMetrics.map(item => item.key);
        const filteredData = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < typeKey.length; i++) {
            const filteredRegion = data.filter(item => item[type] === typeKey[i].id);
            filteredData.push(filteredRegion);
        }
        const regiondata = [];

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < filteredData.length; i++) {
            const regionWiseData = [];
            // eslint-disable-next-line no-plusplus
            for (let j = 0; j < key.length; j++) {
                regionWiseData.push({ [key[j]]: nullCheck(false, filteredData[i], key[j]) });
            }
            regiondata.push({ [typeKey[i].name]: regionWiseData });
        }

        const finalRegionData = regiondata.map((item, index) => {
            const obj = {
                name: Object.keys(item)[0],
                value: item[Object.keys(item)[0]][valueOnclick.index][valueOnclick.value],
            };
            return obj;
        });
        return finalRegionData;
    };

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (regionRadio.adminLevel || regionRadio.name) {
            switch (true) {
                case regionRadio.adminLevel === 1 || regionRadio.name === 'province':
                    setChartData(distributionCalculate(provinceIndex, 'province')
                        .sort((a, b) => b.value - a.value));
                    break;
                case regionRadio.adminLevel === 2 || regionRadio.name === 'district':
                    setChartData(distributionCalculate(districtIndex, 'district')
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 10));
                    break;
                case regionRadio.adminLevel === 3 || regionRadio.name === 'municipality':
                    setChartData(distributionCalculate(municipalityIndex, 'municipality')
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 10));
                    break;
                default:
                    break;
            }
        }
    }, [regionRadio, valueOnclick, data]);

    function nameReturn(region: object) {
        if (region.name === 'district' || region.name === 'municipality') return `${regionRadio.name}wise distribution (Top 10)`;
        if (region.name === 'province') return `${regionRadio.name}wise distribution`;
        if (region.adminLevel === 1) return 'ProvinceWise distribution';
        if (region.adminLevel === 2) return 'DistrictWise distribution';
        return 'MunicipalityWise distribution';
    }

    function CustomTooltip({ payload, active, label }) {
        if (payload && active && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <span className={styles.label}>{payload[0].payload.name}</span>
                    <span className={styles.label}>{`${selectOption.name}:${estimatedLossValueFormatter(payload[0].payload.value)}`}</span>
                </div>
            );
        }
        return null;
    }

    const CustomizedLabel = (prop) => {
        // eslint-disable-next-line react/prop-types
        const { x, y, payload, dy, dx } = prop;
        return (

            typeof (payload.value) === 'string'
                ? (
                    <Text
                        dy={dy}
                        dx={dx}
                        x={x}
                        y={y}
                        textAnchor="end"
                        verticalAnchor="middle"
                        fontSize={12}
                        angle={-30}
                        width={100}
                    >
                        {payload.value}

                    </Text>
                ) : (
                    <Text
                        dy={dy}
                        dx={dx}
                        x={x}
                        y={y}
                    >
                        {estimatedLossValueFormatter(payload.value)}

                    </Text>
                ));
    };

    return (
        // <div className={styles.container}>
        <div className={className
            ? _cs(className, styles.wrapper)
            : styles.wrapper}
        >
            <div className={styles.firstDiv}>
                <p className={styles.text}>
                    {nameReturn(regionRadio)}
                </p>
                {
                    downloadButton && (
                        <Button
                            title="Download Chart"
                            className={styles.downloadButton}
                            transparent
                            // disabled={pending}
                            onClick={() => handleSaveClick('barChart', 'barChart')}
                            iconName="download"
                        />
                    )
                }

            </div>
            <div className={styles.barChart} id="barChart">
                {
                    chartData.length > 0
                    && (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 5,
                                    bottom: 45,
                                    left: -50,
                                }}
                                barSize={20}
                            >
                                <XAxis
                                    dy={10}
                                    dx={5}
                                    tickLine={false}
                                    dataKey="name"
                                    scale="auto"
                                    // padding={{ left: 20, right: 20 }}
                                    interval={0}
                                    tick={<CustomizedLabel />}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={<CustomizedLabel />}
                                />
                                <Tooltip
                                    cursor={false}
                                    content={<CustomTooltip />}
                                />
                                <CartesianGrid stroke="#ccc" horizontal vertical={false} />
                                <Bar dataKey="value" fill="#db6e51" minPointSize={3} />
                            </BarChart>
                        </ResponsiveContainer>
                    )

                }
            </div>

        </div>
        // </div>
    );
};

export default BarChartVisual;
