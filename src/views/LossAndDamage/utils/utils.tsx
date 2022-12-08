import React from 'react';
import memoize from 'memoize-one';
import { listToMap } from '@togglecorp/fujs';
import Numeral from '#rscv/Numeral';
import {
    getGroupMethod,
    getGroupedIncidents,
    getAggregatedStats,
} from '../common';

export const estimatedLossValueFormatter = (d) => {
    const { number, normalizeSuffix } = Numeral.getNormalizedNumber({
        value: d,
        normal: true,
        precision: 0,
    });
    if (normalizeSuffix) {
        return `${number}${normalizeSuffix}`;
    }
    return number;
};

export const tooltipRenderer = (props, currentSelection, radioSelect) => {
    const { feature } = props;
    return (
        <>
            <h3 style={{
                fontSize: '12px',
                margin: 0,
                padding: '10px 20px 0px 20px',
                textTransform: 'uppercase',
                textAlign: 'center',
            }}
            >
                {radioSelect === 4
                    ? `Ward No : ${feature.properties.title}`
                    : feature.properties.title}

            </h3>
            <p style={{
                margin: 0,
                padding: '0 20px 10px 20px',
                fontSize: '12px',
                textAlign: 'center',
            }}
            >
                {`No of ${currentSelection}: ${estimatedLossValueFormatter(feature.state.value)}`}
            </p>

        </>
    );
};

export const generateOverallDataset = memoize((incidents, regionLevel) => {
    if (!incidents || incidents.length <= 0) {
        return {
            mapping: [],
            aggregatedStat: {},
        };
    }

    const groupFn = getGroupMethod(regionLevel);
    const regionGroupedIncidents = getGroupedIncidents(incidents, groupFn);
    const aggregatedStat = getAggregatedStats(regionGroupedIncidents.flat());

    const listToMapGroupedItem = groupedIncidents => (
        listToMap(
            groupedIncidents,
            incident => incident.key,
            incident => incident,
        )
    );
    const mapping = listToMapGroupedItem(regionGroupedIncidents);
    return {
        mapping,
        aggregatedStat,
    };
});

export const generateMapState = memoize((geoareas, groupedIncidentMapping, metricFn) => {
    const value = geoareas.map(geoarea => ({
        id: geoarea.id,
        value: groupedIncidentMapping
            ? metricFn(groupedIncidentMapping[geoarea.id])
            : 0,
    }));
    return value;
});

export const generateColor = memoize((maxValue, minValue, colorMapping) => {
    const newColor = [];
    const { length } = colorMapping;
    const range = maxValue - minValue;
    colorMapping.forEach((color, i) => {
        const val = minValue + ((i * range) / (length - 1));
        newColor.push(val);
        newColor.push(color);
    });
    return newColor;
});

export const generatePaint = memoize(color => ({
    'fill-color': [
        'interpolate',
        ['linear'],
        ['feature-state', 'value'],
        ...color,
    ],
}));

export const colorGrade = [
    '#ffe5d4',
    '#f9d0b8',
    '#f2bb9e',
    '#eca685',
    '#e4906e',
    '#dd7a59',
    '#d46246',
    '#cb4836',
    '#c22727',
];

export const returnValueByDropdown = (name, val) => {
    if (name === 'Estimated loss (NPR)') return estimatedLossValueFormatter(val);
    return val;
};

export const generatePaintLegendByInterval = (data, parts, color) => {
    const newData = [...data];
    const arrayData = [...new Set(newData.map(item => item.value).sort((a, b) => a - b))];
    const max = Math.floor(arrayData.reduce((a, b) => (a > b ? a : b)));
    const min = Math.floor(arrayData.reduce((a, b) => (a < b ? a : b)));
    const interval = Math.floor(max / parts);
    const colorInterval = [];
    const colorLegend = [];
    let dat = interval < min ? min + interval : interval;
    // eslint-disable-next-line no-plusplus
    for (let index = 1; index <= parts; index++) {
        if (index === 1) {
            colorInterval.push(color[index - 1]);
            colorInterval.push(dat);
            colorLegend.push({ name: `${estimatedLossValueFormatter(min)} - ${estimatedLossValueFormatter(dat)}`, range: [min, dat], color: color[index - 1] });
        } else if (dat <= max) {
            colorInterval.push(color[index - 1]);
            colorInterval.push(dat + interval + 1);
            dat += 1;
            colorLegend.push({ name: `${estimatedLossValueFormatter(dat)} - ${dat + interval > max
                ? estimatedLossValueFormatter(max)
                : estimatedLossValueFormatter(dat + interval)}`,
            color: color[index - 1],
            range: [dat, dat + interval > max ? max : dat + interval] });
            dat += interval;
        }
    }

    const paintColor = {
        'fill-color': [
            'step',
            ['feature-state', 'value'],
            ...colorInterval.slice(0, -1),
        ],
        'fill-opacity': [
            'case',
            ['==', ['feature-state', 'value'], null],
            0,
            ['==', ['feature-state', 'hovered'], true],
            0.5,
            1,
        ],
    };
    return { paintColor, colorLegend };
};
