import React from 'react';
import memoize from 'memoize-one';
import { extent } from 'd3-array';
import { isNotDefined } from '@togglecorp/fujs';

import { NapValue, MapState } from '#types';
import ChoroplethMap from '#components/ChoroplethMap';

import styles from './styles.scss';

interface NapData {
    district: number;
    value: NapValue[];
}
interface Props {
    data: NapData[];
    measurementType: string;
    scenario: string;
}

interface State {
}

const tempColors: string[] = [
    '#31a354',
    '#93ce82',
    '#ddf1b3',
    '#fef6cb',
    '#f2b294',
    '#d7595d',
    '#bd0026',
];

const rainColors: string[] = [
    '#ffffcc',
    '#c7e4b9',
    '#7fcdbb',
    '#41b6c4',
    '#1d91c0',
    '#225ea8',
    '#0c2c84',
];

const getItemValueDifference = (item) => {
    const {
        district,
        value,
    } = item;

    const filteredList = value.filter(d => d && d.value);
    const diff = Math.abs(filteredList[0].value - filteredList[filteredList.length - 1].value);

    return diff;
};

const generateMapLegend = (colorPaint) => {
    // console.warn(colorPaint);
};

export default class ClimateChangeMap extends React.PureComponent<Props, State> {
    private generateMapState = memoize((data: NapData[]) => {
        const mapState = data.map(item => ({
            id: item.district,
            value: {
                value: getItemValueDifference(item),
                // value: mean(item.value.map(v => v.value).filter(isDefined)),
            },
        }));

        return mapState;
    });

    private generateColor = memoize(
        (maxValue: number, minValue: number, measurementType: string, scenario: string) => {
            const newColor: (string | number)[] = [];
            const colorMapping = measurementType === 'temperature' ? tempColors : rainColors;
            const { length } = colorMapping;
            const range = maxValue - minValue;
            if (isNotDefined(maxValue) || isNotDefined(minValue) || maxValue === minValue) {
                return [];
            }

            colorMapping.forEach((color, i) => {
                const val = minValue + ((i * range) / (length - 1));
                newColor.push(val);
                newColor.push(color);
            });

            return newColor;
        },
    )

    private generatePaint = memoize((color: (string | number)[]) => {
        if (color.length <= 0) {
            return {
                'fill-color': 'white',
                'fill-opacity': 0.1,
            };
        }

        const fillColor = [
            'case',
            ['==', ['feature-state', 'value'], null],
            'white',
            [
                'interpolate',
                ['linear'],
                ['feature-state', 'value'],
                ...color,
            ],
        ];

        const fillOpacity = [
            'case',
            ['==', ['feature-state', 'value'], null],
            0.1,
            1,
        ];

        return ({
            'fill-color': fillColor,
            'fill-opacity': fillOpacity,
        });
    })

    public render() {
        const {
            data,
            measurementType,
            scenario,
        } = this.props;

        const mapState = this.generateMapState(data);
        const [min, max] = extent(mapState, (d: MapState) => d.value.value);

        const color = this.generateColor(max, min, measurementType, scenario);
        const colorPaint = this.generatePaint(color);

        generateMapLegend(color);

        return (
            <ChoroplethMap
                paint={colorPaint}
                mapState={mapState}
            />
        );
    }
}
