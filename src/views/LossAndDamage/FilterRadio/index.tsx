/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { lossMetrics } from '#utils/domain';
import { nullCheck } from '../../../utils/common';
import styles from './styles.scss';

const FilterRadio = (props) => {
    const { regionRadio, setRegionRadio, data, valueOnclick, setRegionWiseBarChartData } = props;
    const filter = [
        { id: 1, name: 'province' },
        { id: 2, name: 'district' },
        { id: 3, name: 'municipality' },
    ];

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
        for (let i = 0; i < typeKey.length; i++) {
            const filteredRegion = data.filter(item => item[type] === typeKey[i].id);
            filteredData.push(filteredRegion);
        }
        const regiondata = [];

        for (let i = 0; i < filteredData.length; i++) {
            const regionWiseData = [];
            for (let j = 0; j < key.length; j++) {
                regionWiseData.push({ [key[j]]: nullCheck(false, filteredData[i], key[j]) });
            }
            regiondata.push({ [typeKey[i].name]: regionWiseData });
        }
        const finalRegionData = regiondata.map((item, index) => {
            const obj = { name: Object.keys(item)[0],
                value: item[Object.keys(item)[0]][valueOnclick.index][valueOnclick.value] };
            return obj;
        });
        return finalRegionData;
    };


    const clickHandler = (e) => {
        setRegionRadio(e.target.value);
        switch (e.target.value) {
            case 'province':
                setRegionWiseBarChartData(distributionCalculate(provinceIndex, 'province'));
                break;
            case 'district':
                setRegionWiseBarChartData(distributionCalculate(districtIndex, 'district')
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 10));
                break;
            case 'municipality':
                setRegionWiseBarChartData(distributionCalculate(municipalityIndex, 'municipality')
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 10));
                break;
            default:
                return null;
        }
        return null;
    };

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (regionRadio) {
            switch (regionRadio) {
                case 'province':
                    setRegionWiseBarChartData(distributionCalculate(provinceIndex, 'province'));
                    break;
                case 'district':
                    setRegionWiseBarChartData(distributionCalculate(districtIndex, 'district')
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 10));
                    break;
                case 'municipality':
                    setRegionWiseBarChartData(distributionCalculate(municipalityIndex, 'municipality')
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 10));
                    break;
                default:
                    break;
            }
        }
    }, [valueOnclick]);

    return (
        <div className={styles.container}>
            {filter.map(item => (
                <>
                    <label className={styles.radioItems}>
                        <input
                            className={styles.radioInput}
                            type="radio"
                            name="filter"
                            value={item.name}
                            onClick={clickHandler}
                            checked={regionRadio === item.name}
                        />
                        {item.name}
                    </label>

                </>
            ))}
        </div>
    );
};

export default FilterRadio;
