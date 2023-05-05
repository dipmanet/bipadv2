/* eslint-disable no-nested-ternary */
import React from 'react';
import memoize from 'memoize-one';
import { listToMap } from '@togglecorp/fujs';
import { Translation } from 'react-i18next';
import Numeral from '#rscv/Numeral';
import { DataFormater } from '#utils/common';
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


export const formatNumeralAccLang = (value, language) => {
    const { number, normalizeSuffix } = DataFormater(value, language);
    return `${number}${normalizeSuffix}`;
};


export const tooltipRenderer = (props, currentSelection, radioSelect, language) => {
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
                    ? language === 'en'
                        ? `Ward No : ${feature.properties.title}`
                        : `वार्ड नं : ${feature.properties.title}`
                    : language === 'np'
                        ? feature.properties.title_ne
                        : feature.properties.title
                }

            </h3>
            <Translation>
                {
                    t => (
                        <p style={{
                            margin: 0,
                            padding: '0 20px 10px 20px',
                            fontSize: '12px',
                            textAlign: 'center',
                        }}
                        >
                            {
                                language === 'en'
                                    ? `No of ${t(currentSelection)}: ${formatNumeralAccLang(feature.state.value, language)}`
                                    : `${t(currentSelection)}: ${formatNumeralAccLang(feature.state.value, language)}`
                            }
                        </p>

                    )
                }
            </Translation>

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
    console.log('This is group incident mapping', groupedIncidentMapping);
    console.log('This is group incident mapping geoarea', geoareas);
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

export const generatePaintLegendByInterval = (data, parts, color, language) => {
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
            colorLegend.push({ name: `${formatNumeralAccLang(min, language)} - ${formatNumeralAccLang(dat, language)}`, range: [min, dat], color: color[index - 1] });
        } else if (dat <= max) {
            colorInterval.push(color[index - 1]);
            colorInterval.push(dat + interval + 1);
            dat += 1;
            colorLegend.push({
                name: `${formatNumeralAccLang(dat, language)} - ${dat + interval > max
                    ? formatNumeralAccLang(max, language)
                    : formatNumeralAccLang(dat + interval, language)}`,
                color: color[index - 1],
                range: [dat, dat + interval > max ? max : dat + interval],
            });
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
