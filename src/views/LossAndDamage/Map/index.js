import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';

import Numeral from '#rscv/Numeral';

import ChoroplethMap from '#components/ChoroplethMap';

import styles from './styles.scss';


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
            maxValue,
            metricName,
            isTimeline,
            sourceKey,
        } = this.props;

        const color = this.generateColor(maxValue, 0, colorGrade);
        const colorPaint = this.generatePaint(color);
        const mapState = this.generateMapState(geoareas, mapping, metric);

        const colorUnitWidth = `${100 / colorGrade.length}%`;
        // const colorString = `linear-gradient(to right, ${pickList(color, 1, 2).join(', ')})`;

        return (
            <React.Fragment>
                <div
                    className={_cs(
                        styles.legend,
                        isTimeline && styles.timeline,
                    )}
                >
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
                    <div className={styles.scale}>
                        { colorGrade.map(c => (
                            <div
                                key={c}
                                className={styles.colorUnit}
                                style={{
                                    width: colorUnitWidth,
                                    backgroundColor: c,
                                }}
                            />
                        ))}
                    </div>
                </div>
                <ChoroplethMap
                    sourceKey={sourceKey}
                    paint={colorPaint}
                    mapState={mapState}
                />
            </React.Fragment>
        );
    }
}
