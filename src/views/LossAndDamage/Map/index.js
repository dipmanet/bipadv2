import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';
import ChoroplethMap from '#components/ChoroplethMap';
import { generatePaintByQuantile } from '#utils/domain';
import styles from './styles.scss';
import Legend, { legendItems } from '../Legend';
import { generateMapState, tooltipRenderer, estimatedLossValueFormatter } from '../utils/utils';


const propTypes = {
    geoareas: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
};

export default class LossAndDamageMap extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    render() {
        const {
            geoareas,
            mapping,
            metric,
            isTimeline,
            sourceKey,
            maxValue,
            metricName,
            metricKey,
            onMetricChange,
            radioSelect,
            currentSelection,
            pending,
        } = this.props;


        const mapState = generateMapState(geoareas, mapping, metric);
        const colors = legendItems.map(item => item.color);
        const returnDataInterval = (data, parts, color) => {
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
                    colorLegend.push({ name: `${min} - ${dat}`, color: color[index - 1] });
                } else if (dat <= max) {
                    colorInterval.push(color[index - 1]);
                    colorInterval.push(dat + interval + 1);
                    dat += 1;
                    colorLegend.push({ name: `${dat} - ${dat + interval > max ? max : dat + interval}`, color: color[index - 1] });
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
            console.log(paintColor, colorLegend, 'paint');
            console.log(arrayData, 'data');
            return { paintColor, colorLegend };
        };

        const mapColor = {
            'fill-color': [
                'step',
                ['feature-state', 'value'],
                0,
                '#F2F12D',
                20,
                '#EED322',
                100,
                '#E6B71E',
                200,
                '#DA9C20',
                300,
                '#CA8323',
                400,
                '#B86B25',
                500,
                '#A25626',
                600,
                '#8B4225',
            ],
        };

        const { paintColor, colorLegend } = returnDataInterval(mapState, colors.length, colors);
        return (
            <React.Fragment>
                <div
                    className={_cs(
                        'map-legend-container',
                        styles.legend,
                        isTimeline && styles.timeline,
                    )}
                >
                    <Legend
                        currentSelection={currentSelection}
                        legend={colorLegend}
                        pending={pending}
                    />
                </div>
                <ChoroplethMap
                    sourceKey={sourceKey}
                    paint={paintColor}
                    mapState={mapState}
                    regionLevel={radioSelect}
                    tooltipRenderer={prop => tooltipRenderer(prop, currentSelection, radioSelect)}
                    isDamageAndLoss
                />
            </React.Fragment>
        );
    }
}
