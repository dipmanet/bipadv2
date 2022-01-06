
/* eslint-disable import/prefer-default-export */
import React from 'react';
import styles from '../LeftPane/styles.scss';
import { ChartData } from '../../../DataArchive/Modals/Pollution/types';

export const parseStringToNumber = (content) => {
    // const changedNumber = parseInt(content, 10);
    const str = content.toString().split('.');
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return str.join('.');
};

export function renderLegend() {
    return (
        <div className={styles.climateLegendContainer}>
            <div className={styles.climatelegend}>
                <div className={styles.legendMax} />
                <div className={styles.legendText}>Maximum</div>
            </div>
            <div className={styles.climatelegend}>
                <div className={styles.legendDaily} />
                <div className={styles.legendText}>Average</div>
            </div>
            <div className={styles.climatelegend}>
                <div className={styles.legendMin} />
                <div className={styles.legendText}>Minimum</div>
            </div>
        </div>
    );
}

export function renderLegendPopulaion() {
    return (
        <div className={styles.climateLegendContainer}>
            <div className={styles.climatelegend}>
                <div className={styles.legendMax} />
                <div className={styles.legendText}>
	  Male Pop
                    <sup>n</sup>
                </div>
            </div>
            <div className={styles.climatelegend}>
                <div className={styles.legendDaily} />
                <div className={styles.legendText}>
	  Female Pop
                    <sup>n</sup>
                </div>
            </div>
            <div className={styles.climatelegend}>
                <div className={styles.legendMin} />
                <div className={styles.legendText}>Total Household</div>
            </div>
        </div>
    );
}

export function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <div className={styles.customTooltip}>
                <h2>{payload[0].payload.name}</h2>
                <p>{`Maximum: ${payload[0].payload.Max} ℃`}</p>
                <p>{`Average: ${payload[0].payload.Avg} ℃`}</p>
                <p>{`Minimum: ${payload[0].payload.Min} ℃`}</p>
            </div>
        );
    }

    return null;
}


export function populationCustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <div className={styles.customTooltip}>
                <h2>{parseStringToNumber(payload[0].payload.name) }</h2>
                <p>{`Male: ${parseStringToNumber(payload[0].payload.MalePop)}`}</p>
                <p>{`Female: ${parseStringToNumber(payload[0].payload.FemalePop)}`}</p>
                <p>{`Household: ${parseStringToNumber(payload[0].payload.TotalHousehold)}`}</p>
            </div>
        );
    }

    return null;
}

export function landCoverCustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <div className={styles.customTooltip}>
                <h2>{payload[0].payload.name}</h2>
                <p>{`Value: ${payload[0].payload.value}`}</p>
            </div>
        );
    }

    return null;
}
export function urbanCustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <div className={styles.customTooltip}>
                <h2>{`Year: ${payload[0].payload.year}`}</h2>
                <p>{`Population: ${parseStringToNumber(payload[0].payload.pop)}`}</p>
            </div>
        );
    }

    return null;
}

export function getChartData(clickedItem, incidentFilterYear, incidentList) {
    let fullhazardTitle = [];

    if (clickedItem !== 'all') {
        fullhazardTitle = [clickedItem];
    } else {
        fullhazardTitle = [...new Set(incidentList.features.map(
            item => item.properties.hazardTitle,
        ))];
    }
    return fullhazardTitle.map(item => ({
        name: item,
        // total incidents
        value: incidentList.features
            .filter(
                ht => ht.properties.hazardTitle === item
			&& new Date(ht.properties.incidentOn).getFullYear() === Number(incidentFilterYear),
            )
            .length,
        color: (incidentList.features.filter(hcolor => hcolor.properties.hazardTitle === item)
            .map(mainColor => mainColor.properties.hazardColor))[0],

    }));
}


export function getArrforDesc(clickedItem, chartData, incidentList) {
    let fullhazardTitle = [];

    if (clickedItem !== 'all') {
        fullhazardTitle = [clickedItem];
    } else {
        fullhazardTitle = [...new Set(incidentList.features.map(
            item => item.properties.hazardTitle,
        ))];
    }
    const arr = fullhazardTitle.map((item) => {
        if (chartData.filter(n => n.name === item).length > 0) {
            if (chartData.filter(n => n.name === item)[0].Total !== 0) {
                return item;
            }
        }
        return null;
    });

    return arr.filter(n => n !== null);
}


export function getDescription(props, nonZeroArr, chartData) {
    const { clickedItem } = props;
    if (clickedItem === 'all') {
        if (nonZeroArr.length > 0) {
            return nonZeroArr.map((item, i) => {
                if (
                    i === nonZeroArr.length - 1
						&& i === 0
						// && chartData.filter(n => n.name === item)[0]
						&& chartData.filter(n => n.name === item)[0].Total !== 0) {
                    return ` ${item} `;
                }
                if (
                    i !== nonZeroArr.length - 1
						&& i === 0
						// && chartData.filter(n => n.name === item)[0]
						&& chartData.filter(n => n.name === item)[0].Total !== 0) {
                    return ` ${item} `;
                }
                if (
                    i === nonZeroArr.length - 1
						// && chartData.filter(n => n.name === item)[0]
						&& chartData.filter(n => n.name === item)[0].Total !== 0) {
                    return ` and ${item} `;
                }
                if (
                    i !== nonZeroArr.length - 1
						// && chartData.filter(n => n.name === item)[0]
						&& chartData.filter(n => n.name === item)[0].Total !== 0) {
                    return `, ${item} `;
                }
                return '';
            });
        }
    } else {
        return ` of ${clickedItem} `;
    }
    return '';
}
