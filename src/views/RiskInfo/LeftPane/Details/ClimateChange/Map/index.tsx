import React from 'react';
import memoize from 'memoize-one';
import { extent } from 'd3-array';
import { isNotDefined } from '@togglecorp/fujs';

import {
    LegendItem,
    Scenario,
} from '#types';
import Legend from '#rscz/Legend';
import ChoroplethMap from '#components/ChoroplethMap';
import { generateLegendData } from '#utils/domain';

import styles from './styles.scss';

interface MapState {
    id: number;
    value: number;
}
interface Props {
    mapState: MapState[];
    measurementType: string;
    scenario: string;
    scenarioOptions: Scenario[];
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

const keySelector = (d: LegendItem) => d.label;
const labelSelector = (d: LegendItem) => d.label;
const colorSelector = (d: LegendItem) => d.color;

const Tooltip = ({ feature, scenario }: { feature: unknown; scenario: string }) => {
    const { properties: { title }, state: { value } } = feature;

    if (value) {
        const valueText = `${scenario}: ${Number(value).toFixed(2)}`;

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

export default class ClimateChangeMap extends React.PureComponent<Props, State> {
    private generateColor = memoize(
        (maxValue: number, minValue: number, measurementType: string, scenario: string) => {
            const newColor: (string | number)[] = [];
            const colorMapping = measurementType === 'temperature' ? tempColors : rainColors;
            const { length } = colorMapping;
            const range = maxValue - minValue;
            if (isNotDefined(maxValue) || isNotDefined(minValue) || maxValue === minValue) {
                return [];
            }

            const gap = range / (length);
            colorMapping.forEach((color, i) => {
                const val = minValue + (i + 1) * gap;
                newColor.push(color);
                newColor.push(val);
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
            'step',
            ['feature-state', 'value'],
            ...color.slice(0, -1),
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

    private tooltipParams = () => {
        const { scenario: key, scenarioOptions } = this.props;
        const scenario = scenarioOptions.find(sc => sc.key === key);

        return ({
            scenario: scenario ? scenario.label : '',
        });
    }

    private getLegendData = memoize(generateLegendData);

    public render() {
        const {
            mapState,
            measurementType,
            scenario,
        } = this.props;
        const [min, max] = extent(mapState, (d: MapState) => d.value);

        const color = this.generateColor(max, min, measurementType, scenario);
        const colorPaint = this.generatePaint(color);
        const legendData = this.getLegendData(color, min);

        return (
            <div className={styles.map}>
                <ChoroplethMap
                    sourceKey="risk-info-climate-change"
                    paint={colorPaint}
                    mapState={mapState}
                    regionLevel={1}
                    tooltipParams={this.tooltipParams}
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
