import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';

import Numeral from '#rscv/Numeral';

import SegmentInput from '#rsci/SegmentInput';
import ChoroplethMap from '#components/ChoroplethMap';
import { lossMetrics } from '#utils/domain';

import styles from './styles.scss';
import Legend from '../Legend';

const colorGrade = [
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

const propTypes = {
    geoareas: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
};

export default class LossAndDamageMap extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    generateColor = memoize((maxValue, minValue, colorMapping) => {
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

    generatePaint = memoize(color => ({
        'fill-color': [
            'interpolate',
            ['linear'],
            ['feature-state', 'value'],
            ...color,
        ],
    }))

    generateMapState = memoize((geoareas, groupedIncidentMapping, metricFn) => {
        const value = geoareas.map(geoarea => ({
            id: geoarea.id,
            value: groupedIncidentMapping
                ? metricFn(groupedIncidentMapping[geoarea.id])
                : 0,
        }));
        return value;
    });

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

        const color = this.generateColor(maxValue, 0, colorGrade);
        const colorPaint = this.generatePaint(color);
        const mapState = this.generateMapState(geoareas, mapping, metric);
        console.log(sourceKey, 'map state');

        const colorUnitWidth = `${100 / colorGrade.length}%`;
        // const colorString = `linear-gradient(to right, ${pickList(color, 1, 2).join(', ')})`;

        const tooltipRenderer = (props) => {
            const { feature } = props;
            return (
                <>
                    <h3 style={{ 'font-size': '12px',
                        margin: 0,
                        padding: '10px 20px 0px 20px',
                        textTransform: 'uppercase',
                        textAlign: 'center' }}
                    >
                        {feature.properties.title}

                    </h3>
                    <p style={{ margin: 0,
                        padding: '0 20px 10px 20px',
                        fontSize: '12px',
                        textAlign: 'center' }}
                    >
                        {`No of ${currentSelection}: ${feature.state.value}`}
                    </p>

                </>
            );
        };

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
                    tooltipRenderer={tooltipRenderer}
                />
            </React.Fragment>
        );
    }
}
