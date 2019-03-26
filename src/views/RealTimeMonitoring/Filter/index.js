import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Faram from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import ListSelection from '#rsci/ListSelection';

import {
    setRealTimeFiltersAction,
} from '#actionCreators';
import {
    realTimeFiltersSelector,
} from '#selectors';

import CollapsibleView from '#components/CollapsibleView';
import RegionSelectInput from '#components/RegionSelectInput';
import { iconNames } from '#constants';

import styles from './styles.scss';

const realTimeKeySelector = d => d.id;
const realTimeLabelSelector = d => d.title;

const propTypes = {
    setFilters: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
    realTimeList: PropTypes.array.isRequired,
    rainPending: PropTypes.bool,
    riverPending: PropTypes.bool,
    earthquakePending: PropTypes.bool,
};


const defaultProps = {
    className: '',
    rainPending: true,
    riverPending: true,
    earthquakePending: true,
};

const mapStateToProps = state => ({
    filters: realTimeFiltersSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setFilters: params => dispatch(setRealTimeFiltersAction(params)),
});

class RealTimeMonitoringFilter extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    static schema = {
        fields: {
            region: [],
        },
    }

    constructor(props) {
        super(props);

        this.state = {
            showFilters: true,
        };
    }

    handleShowFiltersButtonClick = () => {
        this.setState({ showFilters: true });
    }

    handleHideFiltersButtonClick = () => {
        this.setState({ showFilters: false });
    }

    handleFaramChange = (faramValues, faramErrors) => {
        this.props.setFilters({
            faramValues,
            faramErrors,
            pristine: false,
        });
    }

    handleFaramFailure = (faramErrors) => {
        this.props.setFilters({
            faramErrors,
            pristine: true,
        });
    }

    handleFaramSuccess = (_, values) => {
        // console.warn('Filters', values);
    }

    render() {
        const {
            className,
            filters: {
                faramValues,
                faramErrors,
            },
            rainPending,
            riverPending,
            earthquakePending,
            realTimeList,
        } = this.props;

        const { showFilters } = this.state;

        return (
            <CollapsibleView
                className={_cs(styles.filter, className)}
                expanded={showFilters}
                collapsedViewContainerClassName={styles.showFilterButtonContainer}
                collapsedView={
                    <Button
                        onClick={this.handleShowFiltersButtonClick}
                        iconName={iconNames.filter}
                        title="Show filters"
                    />
                }
                expandedViewContainerClassName={styles.filtersContainer}
                expandedView={
                    <React.Fragment>
                        <header className={styles.header}>
                            <h4 className={styles.heading}>
                                Filters
                            </h4>
                            <Button
                                onClick={this.handleHideFiltersButtonClick}
                                iconName={iconNames.chevronUp}
                                title="Hide Filters"
                                transparent
                            />
                        </header>
                        <Faram
                            className={styles.filterForm}
                            onChange={this.handleFaramChange}
                            onValidationFailure={this.handleFaramValidationFailure}
                            onValidationSuccess={this.handleFaramValidationSuccess}
                            schema={RealTimeMonitoringFilter.schema}
                            value={faramValues}
                            error={faramErrors}
                            disabled={false}
                        >
                            <RegionSelectInput
                                faramElementName="region"
                            />
                            <ListSelection
                                label="Realtime data"
                                className={styles.realTimeSourcesInput}
                                faramElementName="realtimeSources"
                                options={realTimeList}
                                keySelector={realTimeKeySelector}
                                labelSelector={realTimeLabelSelector}
                            />
                        </Faram>
                    </React.Fragment>
                }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RealTimeMonitoringFilter);
