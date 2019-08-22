import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import { _cs, isDefined } from '@togglecorp/fujs';

import FormattedDate from '#rscv/FormattedDate';

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
            minDate,
        } = this.props;

        const summaryData = this.calculateSummary(data);

        return (
            <div className={_cs(className, styles.statsContainer)}>
                { isDefined(minDate) && (
                    <TextOutput
                        className={styles.stat}
                        label="Data available from"
                        type="block"
                        value={(
                            <FormattedDate
                                value={minDate}
                                mode="yyyy-MM-dd"
                            />
                        )}
                    />
                )}
                { lossMetrics.map(metric => (
                    <TextOutput
                        className={styles.stat}
                        key={metric.key}
                        type="block"
                        label={metric.label}
                        value={summaryData[metric.key]}
                        isNumericValue
                    />
                ))}
            </div>
        );
    }
}
