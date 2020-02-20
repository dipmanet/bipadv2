import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';

import styles from './styles.scss';

const Report = ({
    className,
    title,
    isActive,
    onClick,
}) => (
    <button
        className={_cs(
            styles.report,
            className,
            isActive && styles.active,
        )}
        type="button"
        onClick={onClick}
    >
        {title}
    </button>
);

Report.propTypes = {
    className: PropTypes.string,
};

Report.defaultProps = {
    className: undefined,
};

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    reports: PropTypes.array,
    className: PropTypes.string,
    selectedReport: PropTypes.number,
    onSelectedReportChange: PropTypes.func.isRequired,
};

const defaultProps = {
    className: undefined,
    selectedReport: undefined,
    reports: undefined,
};

const reportKeySelector = d => d.id;

export default class SituationReportSidePane extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    reportRendererParams = (key, data) => ({
        title: data.title,
        onClick: () => this.props.onSelectedReportChange(key),
        isActive: key === this.props.selectedReport,
    });

    render() {
        const {
            className,
            reports,
        } = this.props;

        if (!reports) {
            return undefined;
        }

        return (
            <ListView
                className={_cs(styles.sidePane, className)}
                data={reports}
                keySelector={reportKeySelector}
                renderer={Report}
                rendererParams={this.reportRendererParams}
            />
        );
    }
}
