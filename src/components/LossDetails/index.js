import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';
import { _cs, isDefined } from '@togglecorp/fujs';
import StatOutput from '#components/StatOutput';
import { lossMetrics } from '#utils/domain';
import { sum } from '#utils/common';
import styles from './styles.scss';
import { languageSelector } from '#selectors';

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

class LossDetails extends React.PureComponent {
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
            hideIncidentCount,
            language: { language },
        } = this.props;

        const summaryData = this.calculateSummary(data);

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
                            value={summaryData[metric.key]}
                        />


                    );
                })}
            </div>
        );
    }
}
export default connect(mapStateToProps)(LossDetails);
