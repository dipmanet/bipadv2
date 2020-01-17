import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import { _cs, isDefined } from '@togglecorp/fujs';


import TextOutput from '#components/TextOutput';
import { lossMetrics } from '#utils/domain';
import { sum } from '#utils/common';

import styles from './styles.scss';

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array.isRequired,
    className: PropTypes.string,
};

const defaultProps = {
    className: undefined,
};
const emptyList = [];

export default class LossDetails extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    calculateSummary = memoize((lossAndDamageList) => {
        const stat = lossMetrics.reduce((acc, { key }) => ({
            ...acc,
            [key]: sum(
                lossAndDamageList
                    .filter(incident => incident.loss)
                    .map(incident => incident.loss[key])
                    .filter(isDefined),
            ),
        }), {});
        stat.count = lossAndDamageList.length;
        return stat;
    });

    render() {
        const {
            className,
            data = emptyList,
        } = this.props;

        const summaryData = this.calculateSummary(data);

        return (
            <div className={_cs(className, styles.lossDetails)}>
                { lossMetrics.map(metric => (
                    <TextOutput
                        className={styles.stat}
                        isNumericValue
                        key={metric.key}
                        label={metric.label}
                        labelClassName={styles.label}
                        normal
                        type="block"
                        value={summaryData[metric.key]}
                        valueClassName={styles.value}
                        lang="ne"
                    />
                ))}
            </div>
        );
    }
}
