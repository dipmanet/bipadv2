import React from 'react';
import memoize from 'memoize-one';
import { extent } from 'd3-array';
import { mean, isNotDefined, isDefined } from '@togglecorp/fujs';

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
}

interface State {
}

const tempColors: string[] = [
    '#fef0d9',
    '#fdd49e',
    '#fdbb84',
    '#fc8d59',
    '#ef6548',
    '#d7301f',
    '#990000',
];

const rainColors: string[] = [
    '#f0f9e8',
    '#ccebc5',
    '#a8ddb5',
    '#7bccc4',
    '#4eb3d3',
    '#2b8cbe',
    '#08589e',
];

export default class ClimateChangeMap extends React.PureComponent<Props, State> {
    private generateMapState = memoize((data: NapData[]) => {
        const mapState = data.map(item => ({
            id: item.district,
            value: {
                value: mean(item.value.map(v => v.value).filter(isDefined)),
            },
        }));

        return mapState;
    });

    private generateColor = memoize(
        (maxValue: number, minValue: number, measurementType: string) => {
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
                'fill-color': '#ccebc5',
            };
        }

        return ({
            'fill-color': [
                'interpolate',
                ['linear'],
                ['feature-state', 'value'],
                ...color,
            ],
        });
    })

    public render() {
        const {
            data,
            measurementType,
        } = this.props;

        const mapState = this.generateMapState(data);
        const [min, max] = extent(mapState, (d: MapState) => d.value.value);

        const color = this.generateColor(max, min, measurementType);
        const colorPaint = this.generatePaint(color);
        return (
            <ChoroplethMap
                paint={colorPaint}
                mapState={mapState}
            />
        );
    }
}
