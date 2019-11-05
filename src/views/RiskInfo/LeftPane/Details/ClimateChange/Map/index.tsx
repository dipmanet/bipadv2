import React from 'react';
import memoize from 'memoize-one';

import {
    District,
} from '#store/atom/page/types';

import ChoroplethMap from '#components/ChoroplethMap';

import {
    getMapPaddings,
} from '#constants';

import styles from './styles.scss';

interface Props {
    districts: District[];
}

interface State {
}

interface GeoArea {
    id: number;
}

const colorGrade = [
    '#31a354',
    '#93ce82',
    '#ddf1b3',
    '#fef6cb',
    '#f2b294',
    '#d7595d',
    '#e31a1c',
    '#bd0026',
];

export default class ClimateChangeMap extends React.PureComponent<Props, State> {
    private generateMapState = memoize((geoareas: GeoArea[]) => {
        const value = geoareas.map(geoarea => ({
            id: geoarea.id,
            value: {
                count: Math.round(Math.random() * 10),
            },
        }));

        return value;
    });

    private generateColor = memoize(
        (maxValue: number, minValue: number, colorMapping: string[]) => {
            const newColor: (string | number)[] = [];
            const { length } = colorMapping;
            const range = maxValue - minValue;
            colorMapping.forEach((color, i) => {
                const val = minValue + ((i * range) / (length - 1));
                newColor.push(val);
                newColor.push(color);
            });

            return newColor;
        },
    );

    private generatePaint = memoize(color => ({
        'fill-color': [
            'interpolate',
            ['linear'],
            ['feature-state', 'count'],
            ...color,
        ],
    }))


    public render() {
        const {
            districts,
        } = this.props;

        const mapState = this.generateMapState(districts);

        const color = this.generateColor(10, 0, colorGrade);
        const colorPaint = this.generatePaint(color);

        return (
            <ChoroplethMap
                paint={colorPaint}
                mapState={mapState}
            />
        );
    }
}
