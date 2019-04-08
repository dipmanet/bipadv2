import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';
import { listToMap } from '@togglecorp/fujs';

import ChoroplethMap from '#components/ChoroplethMap';
import { districtsSelector } from '#selectors';
import { getMapPaddings } from '#constants';
import { groupList, sum } from '#utils/common';

import styles from './styles.scss';

const colorGrade = [
    '#fee5d9',
    '#fcbba1',
    '#fc9272',
    '#fb6a4a',
    '#ef3b2c',
    '#cb181d',
    '#99000d',
];


const pickList = (list, start, offset) => {
    const newList = [];
    for (let i = start; i < list.length; i += offset) {
        newList.push(list[i]);
    }
    return newList;
};

const propTypes = {
    districts: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
};

const mapStateToProps = state => ({
    districts: districtsSelector(state),
});

class LossAndDamageMap extends React.PureComponent {
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

    generateMapState = memoize((districts, groupedIncidentMapping, metricFn) => {
        const value = districts.map(district => ({
            id: district.id,
            value: {
                count: groupedIncidentMapping
                    ? metricFn(groupedIncidentMapping[district.id])
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
            districts,
            mapping,
            metric,
            maxValue,
            metricName,
        } = this.props;

        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);

        const color = this.generateColor(maxValue, 0, colorGrade);
        const colorPaint = this.generatePaint(color);
        const mapState = this.generateMapState(districts, mapping, metric);
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

export default connect(mapStateToProps)(LossAndDamageMap);
