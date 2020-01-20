import React from 'react';
import memoize from 'memoize-one';
import { extent } from 'd3-array';
import { isNotDefined } from '@togglecorp/fujs';

import { generateLegendData } from '#utils/domain';

import Legend from '#rscz/Legend';
import ChoroplethMap from '#components/ChoroplethMap';

import {
    LegendItem,
    RiskData,
    MapState,
} from '#types';

import styles from './styles.scss';

interface Props {
    data: RiskData[];
}

interface State {
}

const YlOrRd = [
    '#ffffb2',
    '#fed976',
    '#feb24c',
    '#fd8d3c',
    '#fc4e2a',
    '#e31a1c',
    '#b10026',
];

const keySelector = (d: LegendItem) => d.label;
const labelSelector = (d: LegendItem) => d.label;
const colorSelector = (d: LegendItem) => d.color;

const Tooltip = ({ feature }: { feature: unknown }) => {
    const { properties: { title }, state: { value } } = feature;

    if (value) {
        const valueText = `Risk Score: ${Number(value).toFixed(2)}`;

        return (
            <div className={styles.tooltip}>
                <div className={styles.title}>{title}</div>
                <div className={styles.value}>{valueText}</div>
            </div>
        );
    }

    return (
        <div className={styles.tooltip}>
            <div className={styles.title}>{title}</div>
        </div>
    );
};


export default class RiskMap extends React.PureComponent<Props, State> {
    private generateMapState = memoize((data: RiskData[]) => {
        const mapState = data.map(item => ({
            id: item.district,
            value: item.data.riskScore,
        }));

        return mapState;
    });

    private generateColor = memoize((maxValue: number, minValue: number, colors: string[]) => {
        const newColor: (string | number)[] = [];
        const range = maxValue - minValue;
        if (isNotDefined(maxValue) || isNotDefined(minValue) || minValue === maxValue) {
            return [];
        }

        const { length } = colors;
        colors.forEach((color, i) => {
            const val = minValue + ((i * range) / (length - 1));
            newColor.push(val);
            newColor.push(color);
        });

        return newColor;
    })

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

    private getLegendData = memoize(generateLegendData);

    public render() {
        const {
            data,
        } = this.props;

        const mapState = this.generateMapState(data);

        const [min, max] = extent(mapState, (d: MapState) => d.value);
        const color = this.generateColor(max, min, YlOrRd);
        const colorPaint = this.generatePaint(color);

        const legendData = this.getLegendData(color);

        return (
            <div className={styles.map}>
                <ChoroplethMap
                    sourceKey="risk-info-risk-map"
                    paint={colorPaint}
                    mapState={mapState}
                    regionLevel={1}
                    tooltipRenderer={Tooltip}
                />
                { legendData.length > 0 && (
                    <div className={styles.legendContainer}>
                        <h4 className={styles.heading}>
                            Legend
                        </h4>
                        <Legend
                            className={styles.legend}
                            data={legendData}
                            itemClassName={styles.legendItem}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            colorSelector={colorSelector}
                            emptyComponent={null}
                        />
                    </div>
                )}
            </div>
        );
    }
}
