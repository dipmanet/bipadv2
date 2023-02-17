/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';
import { _cs, isDefined } from '@togglecorp/fujs';
import StatOutput from '#components/StatOutput';
import { lossMetrics } from '#utils/domain';
import { sum, nullCheck } from '#utils/common';
import { languageSelector } from '#selectors';


import styles from './styles.scss';

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array.isRequired,
    className: PropTypes.string,
    hideIncidentCount: PropTypes.bool,
};
const mapStateToProps = state => ({
    language: languageSelector(state),
});
const defaultProps = {
    className: undefined,
    hideIncidentCount: false,
};
const emptyList = [];
// eslint-disable-next-line space-infix-ops

class LossDetails extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    // calculateSummary = memoize((lossAndDamageList) => {
    //     const stat = lossMetrics.reduce((acc, { key }) => ({
    //         ...acc,
    //         [key]: sum(
    //             lossAndDamageList
    //                 .filter(incident => incident.loss)
    //                 .map(incident => incident.loss[key])
    //                 .filter(isDefined),
    //         ),
    //     }), {});
    //     stat.count = lossAndDamageList.length;
    //     return stat;
    // });

    // null_check = (m) => {
    //     const { nullCondition, data = emptyList } = this.props;
    //     if (nullCondition) {
    //         const summaryData = this.calculateSummary(data);
    //         summaryData.estimatedLoss = '-';

    //         return summaryData[m];
    //     }
    //     const summaryData = this.calculateSummary(data);

    //     return summaryData[m];
    // }

    render() {
        const {
            className,
            hideIncidentCount,
            language: { language },
            nullCondition,
            data,
        } = this.props;

        return (
            <div className={_cs(className, styles.lossDetails)}>
                {lossMetrics.map((metric) => {
                    if (metric.key === 'count' && hideIncidentCount) {
                        return null;
                    }
                    return (

                        <StatOutput
                            key={metric.key}
                            label={language === 'en' ? metric.label : metric.labelNe}
                            // value={summaryData[metric.key]}
                            // label={metric.label}
                            language={language}
                            value={nullCheck(nullCondition, data, metric.key)}
                        />


                    );
                })}
            </div>
        );
    }
}
export default connect(mapStateToProps)(LossDetails);
