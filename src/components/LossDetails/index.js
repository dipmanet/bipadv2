import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { _cs, isDefined } from '@togglecorp/fujs';


import StatOutput from '#components/StatOutput';
import { lossMetrics } from '#utils/domain';
import { sum } from '#utils/common';

import styles from './styles.scss';

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array.isRequired,
    className: PropTypes.string,
    hideIncidentCount: PropTypes.bool,
};

const defaultProps = {
    className: undefined,
    hideIncidentCount: false,
};
const emptyList = [];
// eslint-disable-next-line space-infix-ops
let summaryData={};
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

    null_check=() => {
        const { nullCondition, data = emptyList } = this.props;
        if (nullCondition) {
            summaryData = this.calculateSummary(data);
            summaryData.estimatedLoss = '-';
            return summaryData;
        }
        summaryData = this.calculateSummary(data);
        return summaryData;
    }

    render() {
        const {
            className,
            data = emptyList,
            hideIncidentCount,
            nullCondition,
        } = this.props;
        this.null_check();

        return (
            <div className={_cs(className, styles.lossDetails)}>
                {lossMetrics.map((metric) => {
                    if (metric.key === 'count' && hideIncidentCount) {
                        return null;
                    }
                    return (
                        <StatOutput
                            key={metric.key}
                            label={metric.label}
                            value={summaryData[metric.key]}


                        />
                    );
                })}
            </div>
        );
    }
}
