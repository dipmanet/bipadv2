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

export const tooltipRenderer = (props, currentSelection) => {
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
                {feature.properties.title}

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

export const generateMapState = memoize((geoareas, groupedIncidentMapping, metricFn) => {
    const value = geoareas.map(geoarea => ({
        id: geoarea.id,
        value: groupedIncidentMapping
            ? metricFn(groupedIncidentMapping[geoarea.id])
            : 0,
    }));
    return value;
});

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
