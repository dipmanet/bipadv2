import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import ChoroplethMap from '#components/ChoroplethMap';
import { getMapPaddings } from '#constants';

import styles from './styles.scss';

const colorGrade = [
    '#ffffcc',
    '#ffeda0',
    '#fed976',
    '#feb24c',
    '#fd8d3c',
    '#fc4e2a',
    '#e31a1c',
    '#bd0026',
    '#800026',
];

const pickList = (list, start, offset) => {
    const newList = [];
    for (let i = start; i < list.length; i += offset) {
        newList.push(list[i]);
    }
    return newList;
};

const propTypes = {
    geoareas: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    geoareas: [],
};

export default class LossAndDamageMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getBoundsPadding = memoize((leftPaneExpanded, rightPaneExpanded) => {
        const mapPaddings = getMapPaddings();

        if (leftPaneExpanded && rightPaneExpanded) {
            return mapPaddings.bothPaneExpanded;
        } else if (leftPaneExpanded) {
            return mapPaddings.leftPaneExpanded;
        } else if (rightPaneExpanded) {
            return mapPaddings.rightPaneExpanded;
        }
        return mapPaddings.noPaneExpanded;
    });

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
            ['feature-state', 'count'],
            ...color,
        ],
    }))

    generateMapState = memoize((geoareas, groupedIncidentMapping, metricFn) => {
        const value = geoareas.map(geoarea => ({
            id: geoarea.id,
            value: {
                count: groupedIncidentMapping
                    ? metricFn(groupedIncidentMapping[geoarea.id])
                    : 0,
            },
        }));
        return value;
    });

    render() {
        const {
            lossAndDamageList,
            leftPaneExpanded,
            rightPaneExpanded,
            geoareas,
            mapping,
            metric,
            maxValue,
            metricName,
        } = this.props;

        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);

        const color = this.generateColor(maxValue, 0, colorGrade);
        const colorPaint = this.generatePaint(color);
        const mapState = this.generateMapState(geoareas, mapping, metric);
        const colorString = `linear-gradient(to right, ${pickList(color, 1, 2).join(', ')})`;

        return (
            <React.Fragment>
                <div className={styles.legend}>
                    <h5 className={styles.heading}>
                        {metricName}
                    </h5>
                    <div className={styles.range}>
                        <div className={styles.min}>
                            0
                        </div>
                        <div className={styles.max}>
                            { maxValue }
                        </div>
                    </div>
                    <div
                        className={styles.scale}
                        style={{
                            background: colorString,
                        }}
                    />
                </div>
                <ChoroplethMap
                    boundsPadding={boundsPadding}
                    paint={colorPaint}
                    mapState={mapState}
                />
            </React.Fragment>
        );
    }
}
