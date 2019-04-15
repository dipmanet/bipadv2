import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Faram from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import HazardSelectionInput from '#components/HazardSelectionInput';
import SelectInput from '#rsci/SelectInput';

import {
    setLossAndDamageFiltersAction,
} from '#actionCreators';
import {
    hazardTypeListSelector,
    lossAndDamageFiltersSelector,
} from '#selectors';

import { hazardIcons } from '#resources/data';
import CollapsibleView from '#components/CollapsibleView';
import RegionSelectInput from '#components/RegionSelectInput';
import { iconNames } from '#constants';

import styles from './styles.scss';

const propTypes = {
    hazardTypeList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    setFilters: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

const mapStateToProps = state => ({
    hazardTypeList: hazardTypeListSelector(state),
    filters: lossAndDamageFiltersSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setFilters: params => dispatch(setLossAndDamageFiltersAction(params)),
});

class LossAndDamageFilter extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    static schema = {
        fields: {
            dateRange: [],
            region: [],
            hazard: [],
        },
    }

    constructor(props) {
        super(props);

        this.state = {
            showFilters: true,
        };
    }

    handleShowFiltersButtonClick = () => {
        const { onExpandChange } = this.props;
        this.setState({ showFilters: true });

        if (onExpandChange) {
            onExpandChange(true);
        }
    }

    handleHideFiltersButtonClick = () => {
        const { onExpandChange } = this.props;
        this.setState({ showFilters: false });

        if (onExpandChange) {
            onExpandChange(false);
        }
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
            hazardTypeList,
            filters: {
                faramValues,
                faramErrors,
            },
            metricType,
            onMetricChange,
            metricOptions,
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
                            schema={LossAndDamageFilter.schema}
                            value={faramValues}
                            error={faramErrors}
                            disabled={false}
                        >
                            <RegionSelectInput
                                faramElementName="region"
                            />
                            <HazardSelectionInput
                                faramElementName="hazard"
                            />
                            <SelectInput
                                label="Metric"
                                onChange={onMetricChange}
                                value={metricType}
                                options={metricOptions}
                            />
                        </Faram>
                    </React.Fragment>
                }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LossAndDamageFilter);
