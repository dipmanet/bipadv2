/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from '#rsca/Button';
import styles from './styles.scss';
import { lossMetrics } from '#utils/domain';
import { nullCheck } from '../../../utils/common';

const BarChartVisual = ({ filter, data, valueOnclick }) => {
    const key = lossMetrics.map(item => item.key);
    const filterProvinceData = [];
    const province = [1, 2, 3, 4, 5, 6, 7];
    for (let i = 0; i < province.length; i++) {
        const filteredProvince = data.filter(item => item.province === province[i]);
        filterProvinceData.push(filteredProvince);
    }

    const provinceChartData = [];

    for (let i = 0; i < filterProvinceData.length; i++) {
        const provinceWiseData = [];
        for (let j = 0; j < key.length; j++) {
            provinceWiseData.push({ [key[j]]: nullCheck(false, filterProvinceData[i], key[j]) });
        }
        provinceChartData.push(provinceWiseData);
    }

    const provinceWiseData = provinceChartData.map((item, index) => ({ name: `Province ${index + 1}`, value: item[valueOnclick.index][valueOnclick.value] }));


    const distributionType = (type) => {
        switch (type.adminLevel) {
            case 1:
                return 'PROVINCE';
            case 2:
                return 'DISTRICT';
            case 3:
                return 'MUNICIPALITY';
            default:
                return 'PROVINCE';
        }
    };


    return (
        // <div className={styles.container}>
        <div className={styles.wrapper}>

            <div className={styles.firstDiv}>
                <p className={styles.text}>{`${distributionType(filter)}WISE DISTRIBUTION`}</p>
                <Button
                    title="Download Chart"
                    className={styles.downloadButton}
                    transparent
                    // disabled={pending}
                    // onClick={this.handleSaveClick}
                    iconName="download"
                />
            </div>
            <div className={styles.barChart}>
                {
                    provinceWiseData
                    && (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart
                                data={provinceWiseData}
                                margin={{
                                    top: 5,
                                    bottom: 20,
                                    right: 20,
                                }}
                                barSize={20}
                                barCategoryGap={0}
                            >
                                <XAxis
                                    tickLine={false}
                                    dataKey="name"
                                    scale="point"
                                    padding={{ left: 25, right: 0 }}
                                    dy={15}
                                    angle={-30}
                                />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <CartesianGrid stroke="#ccc" horizontal vertical={false} />
                                <Bar dataKey="value" fill="#db6e51" />
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
