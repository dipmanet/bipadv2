import React from 'react';
import memoize from 'memoize-one';
import { extent } from 'd3-array';
import { isNotDefined } from '@togglecorp/fujs';

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
    '#e1e1e1',
    '#47a3bc',
    '#53ab82',
    '#fd8d3c',
    '#7ff200',
    '#fbf731',
    '#f6b633',
    '#e93f34',
];

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
            rank: item.rank,
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

    private getLegendData = memoize((colorPaint: (string | number)[]) => {
        const legendData = colorPaint.reduce((acc: LegendItem[], _, index, array) => {
            if (index % 2 === 0) {
                const [value, colorValue] = array.slice(index, index + 2);
                const label = Number(value).toFixed(1).replace(/\.00$/, '');
                const color = `${colorValue}`;

                acc.push({ label, color });
            }
            return acc;
        }, []);

        return legendData;
    });

    public render() {
        const { data } = this.props;
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
                        <div className={styles.legend}>
                            {legendData.map((item) => {
                                const style = {
                                    backgroundColor: item.color,
                                };

                                return (
                                    <div className={styles.legendItem}>
                                        <div className={styles.valueTop}>{item.label}</div>
                                        <div
                                            className={styles.block}
                                            style={style}
                                        />
                                        <div className={styles.valueBottom}>{item.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
