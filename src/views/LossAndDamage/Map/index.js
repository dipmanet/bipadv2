import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';
import ChoroplethMap from '#components/ChoroplethMap';

import styles from './styles.scss';
import Legend, { legendItems } from '../Legend';
import { generateColor,
    generatePaint,
    generateMapState,
    colorGrade,
    tooltipRenderer } from '../utils/utils';


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
        } = this.props;

        const mapState = generateMapState(geoareas, mapping, metric);
        // const color = generateColor(maxValue, 0, colorGrade);
        const colorRange = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const items of legendItems) {
            colorRange.push(items.value, items.color);
        }
        const colorPaint = generatePaint(colorRange);
        const colorUnitWidth = `${100 / colorGrade.length}%`;
        // const colorString = `linear-gradient(to right, ${pickList(color, 1, 2).join(', ')})`;

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
                        mapState={mapState}
                    />
                </div>
                <ChoroplethMap
                    sourceKey={sourceKey}
                    paint={colorPaint}
                    mapState={mapState}
                    regionLevel={radioSelect}
                    tooltipRenderer={prop => tooltipRenderer(prop, currentSelection, radioSelect)}
                    isDamageAndLoss
                />
            </React.Fragment>
        );
    }
}
