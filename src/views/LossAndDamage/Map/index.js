import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';
import memoize from 'memoize-one';
import Numeral from '#rscv/Numeral';

import SegmentInput from '#rsci/SegmentInput';
import ChoroplethMap from '#components/ChoroplethMap';
import { lossMetrics } from '#utils/domain';

import styles from './styles.scss';
import Legend, { legentItemsTest } from '../Legend';
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
        const mapStateValue = mapState.map(i => i.value);

        const generateColorTest = memoize((valueFromData, valueToBeCompared) => {
            const color = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const element of valueToBeCompared) {
                // eslint-disable-next-line no-restricted-syntax
                for (const valueOfData of valueFromData) {
                    // eslint-disable-next-line no-eval
                    if (eval(`${valueOfData}${element.value[0]}`)
                    // eslint-disable-next-line no-eval
                    && eval(`${valueOfData}${element.value[1]}`)) {
                        const colorFromElement = element.color;
                        color.push(valueOfData, colorFromElement);
                    }
                }
            }
            return color;
        });
        const valueToBeCompared = legentItemsTest.map(i => (
            {
                value: i.value,
                color: i.color,
            }
        ));
        const color = generateColorTest(mapStateValue, valueToBeCompared);
        // const color = generateColor(maxValue, 0, colorGrade);
        const colorPaint = color.length > 0 && generatePaint(color);
        console.log(colorPaint, 'color');


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
                    <Legend />

                    {/* <SegmentInput
                        options={lossMetrics}
                        keySelector={d => d.key}
                        labelSelector={d => d.label}
                        value={metricKey}
                        onChange={onMetricChange}
                        showLabel={false}
                        showHintAndError={false}
                    /> */}

                    {/*
                    <h5 className={styles.heading}>
                        {metricName}
                    </h5>
                    <div className={styles.range}>
                        <Numeral
                            className={styles.min}
                            value={0}
                            precision={0}
                        />
                        <Numeral
                            className={styles.max}
                            value={maxValue}
                            precision={0}
                        />
                    </div>
                    */}

                    {/* <div className={styles.scale}>
                        {color.map((c, i) => {
                            if (i % 2 === 0) {
                                return null;
                            }

                            return (
                                <div className={styles.scaleElement} key={c}>
                                    <div
                                        key={c}
                                        className={styles.colorUnit}
                                        style={{
                                            // width: colorUnitWidth,
                                            backgroundColor: c,
                                        }}
                                    />
                                    <div className={styles.value}>
                                        {Math.round(color[i - 1])}
                                    </div>
                                </div>
                            );
                        })}
                    </div> */}

                </div>
                <ChoroplethMap
                    sourceKey={sourceKey}
                    paint={colorPaint}
                    mapState={mapState}
                    regionLevel={radioSelect}
                    tooltipRenderer={prop => tooltipRenderer(prop, currentSelection)}
                    isDamageAndLoss
                />
            </React.Fragment>
        );
    }
}
