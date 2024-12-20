/* eslint-disable max-len */
/* eslint-disable no-tabs */

/* eslint-disable import/prefer-default-export */
import React from 'react';
import RainTooltip from '#views/Dashboard/Map/Tooltips/Alerts/Rain';
import RiverTooltip from '#views/Dashboard/Map/Tooltips/Alerts/River';
import FireTooltip from '#views/Dashboard/Map/Tooltips/Alerts/Fire';
import PollutionTooltip from '#views/Dashboard/Map/Tooltips/Alerts/Pollution';
import { ChartData } from '../../../DataArchive/Modals/Pollution/types';
import styles from '../LeftPane/styles.scss';

export const parseStringToNumber = (content: string) => {
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
                <h2>{parseStringToNumber(payload[0].payload.name)}</h2>
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
                <p>{`Area in Sq Km: ${payload[0].payload.value}`}</p>
            </div>
        );
    }

    return null;
}
export function pastDisasterCustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <div className={styles.customTooltip}>
                <h2>{payload[0].payload.name}</h2>
                <p>{`Count: ${payload[0].payload.value}`}</p>
            </div>
        );
    }

    return null;
}
export function cITooltip({ active, payload, label }) {
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


export const customLableList = (props) => {
    const { x, y, width, value } = props;
    const radius = -12;
    if (value > 0) {
        return (
            <g>
                <text
                    x={x + width + 2}
                    y={y - radius}
                    fill="white"
                    textAnchor="right"
                    dominantBaseline="right"
                >
                    {value}
                </text>
            </g>
        );
    }
    return (
        <g>
            <text
                x={x + width - 25}
                y={y - radius}
                fill="white"
                textAnchor="right"
                dominantBaseline="right"
            >
                {value}
            </text>
        </g>
    );
};

export const getColor = (totalPopulationByWard, intervals, newDemoColorArray, wardId) => {
    const colorCondition1 = totalPopulationByWard.filter(item => item.totalpop <= intervals[0]);
    const colorCondition2 = totalPopulationByWard.filter(item => item.totalpop >= intervals[0] && item.totalpop <= intervals[1]);
    const colorCondition3 = totalPopulationByWard.filter(item => item.totalpop >= intervals[1] && item.totalpop <= intervals[2]);
    const colorCondition4 = totalPopulationByWard.filter(item => item.totalpop >= intervals[2] && item.totalpop <= intervals[3]);
    const colorCondition5 = totalPopulationByWard.filter(item => item.totalpop >= intervals[3]);

    const filteredWards1 = colorCondition1.map(item => item.ward);
    const filteredWards2 = colorCondition2.map(item => item.ward);
    const filteredWards3 = colorCondition3.map(item => item.ward);
    const filteredWards4 = colorCondition4.map(item => item.ward);
    const filteredWards5 = colorCondition5.map(item => item.ward);
    if (filteredWards1.includes(`Ward ${wardId}`)) {
        return newDemoColorArray[0];
    } if (filteredWards2.includes(`Ward ${wardId}`)) {
        return newDemoColorArray[1];
    } if (filteredWards3.includes(`Ward ${wardId}`)) {
        return newDemoColorArray[2];
    } if (filteredWards4.includes(`Ward ${wardId}`)) {
        return newDemoColorArray[3];
    } if (filteredWards5.includes(`Ward ${wardId}`)) {
        return newDemoColorArray[4];
    }
    return null;
};

export const alertColorIs = (type: string) => {
    if (type === 'pollution') {
        return 'purple';
    }
    if (type === 'fire') {
        return 'red';
    }
    if (type === 'rain') {
        return '#418fde';
    }
    if (type === 'river') {
        return 'rgb(0, 0, 139)';
    }
    if (type === 'earthquake') {
        return 'rgb(93, 64, 55)';
    }
    return 'black';
};


export const currentAverageTemp = (tempInString: string) => {
    let numb;
    if (tempInString) {
        numb = tempInString.match(/\d/g);
        if (tempInString.split('')[0] === '-') {
            if (numb && numb.length === 2) {
                const firstNum = parseInt(numb[0], 10);
                const secondNum = parseInt(numb[1], 10);
                return -(firstNum + secondNum) / 2;
            }
            if (numb && numb.length === 3) {
                const firstNum = parseInt(numb[0], 10);
                const secondNum = numb[1];
                const thirdNum = numb[2];
                return -(firstNum + parseInt((secondNum + thirdNum), 10)) / 2;
            }
            if (numb && numb.length === 4) {
                const firstNum = numb[0];
                const secondNum = numb[1];
                const thirdNum = numb[2];
                const fourthNum = numb[3];
                return -(parseInt((firstNum + secondNum), 10) + parseInt((thirdNum + fourthNum), 10)) / 2;
            }
        }
        if (numb && numb.length === 2) {
            const firstNum = parseInt(numb[0], 10);
            const secondNum = parseInt(numb[1], 10);
            return (firstNum + secondNum) / 2;
        }
        if (numb && numb.length === 3) {
            const firstNum = parseInt(numb[0], 10);
            const secondNum = numb[1];
            const thirdNum = numb[2];
            return (firstNum + parseInt((secondNum + thirdNum), 10)) / 2;
        }
        if (numb && numb.length === 4) {
            const firstNum = numb[0];
            const secondNum = numb[1];
            const thirdNum = numb[2];
            const fourthNum = numb[3];
            return (parseInt((firstNum + secondNum), 10) + parseInt((thirdNum + fourthNum), 10)) / 2;
        }
    }


    return '';
};


export const generatePaintByQuantile = (
    colorDomain: string[],
    minValue: number,
    maxValue: number,
    categoryData: number[],
    parts: number,
) => {
    const range = maxValue - minValue;
    const gap = range / colorDomain.length;

    const data = categoryData;
    const divider = Math.ceil(data.length / parts);
    data.sort((a, b) => a - b);
    const dividedSpecificData = new Array(Math.ceil(data.length / divider))
        .fill()
        .map(_ => data.splice(0, divider));

    const nonEmptyData = dividedSpecificData.filter(r => r.length > 0);

    const intervals: number[] = [];
    nonEmptyData.map(d => intervals.push(Math.max(...d) === 0
        ? Math.max(...d) + 1 : Math.max(...d)));

    /* Quantile Division ends */

    const countBasedIntervals = intervals;
    const colors: (string | number)[] = [];

    colorDomain.forEach((color, i) => {
        const val = +(minValue + (i + 1) * gap).toFixed(1);
        // NOTE: avoid duplicates
        if (colors.length > 0 && colors[colors.length - 1] === val) {
            return;
        }
        colors.push(color);
        colors.push(val);
    });


    if (colors.length !== 0) {
        return colors;
    }
    return null;
};


export const generatePaint = color => ({
    'fill-color': [
        'interpolate',
        ['linear'],
        ['feature-state', 'value'],
        ...color,
    ],
    'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.8,
        1,
    ],
});

export const generatePaintQuantile = color => ({
    'fill-color': [
        'interpolate',
        ['linear'],
        ['feature-state', 'value'],
        0,
        ...color.slice(0, -1),
    ],
    'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.8,
        1,
    ],
});


function EarthquakeTooltip(title: any, description: any, createdDate: any, referenceData: any) {
    throw new Error('Function not implemented.');
}


export const AlertTooltip = ({ title, description, referenceType, referenceData, createdDate }) => {
    if (referenceType && referenceType === 'rain') {
        return RainTooltip(title, description, createdDate, referenceData);
    }
    if (referenceType && referenceType === 'river') {
        return RiverTooltip(title, description, createdDate, referenceData);
    }
    if (title.toUpperCase().includes('EARTH') && referenceData) {
        return EarthquakeTooltip(title, description, createdDate, referenceData);
    }
    if (referenceType && referenceType === 'fire') {
        return FireTooltip(title, description, createdDate, referenceData);
    }
    if (referenceType && referenceType === 'pollution') {
        return PollutionTooltip(title, description, createdDate, referenceData);
    }
    if (title) {
        return (
            <div className={styles.alertTooltip}>
                <h3 className={styles.heading}>
                    {title}
                </h3>
                <div className={styles.description}>
                    {description}
                </div>
            </div>
        );
    } return null;
};
