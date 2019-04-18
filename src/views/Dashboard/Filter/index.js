import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Faram from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import {
    setFiltersActionDP,
} from '#actionCreators';
import {
    hazardTypeListSelector,
    filtersSelectorDP,
} from '#selectors';

import HazardSelectionInput from '#components/HazardSelectionInput';
import CollapsibleView from '#components/CollapsibleView';
import RegionSelectInput from '#components/RegionSelectInput';
import PastDateRangeInput from '#components/PastDateRangeInput';
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
    filters: filtersSelectorDP(state),
});

const mapDispatchToProps = dispatch => ({
    setFilters: params => dispatch(setFiltersActionDP(params)),
});

class DashboardFilter extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

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
        console.warn('Filters', values);
    }

    render() {
        const {
            className,
            hazardTypeList,
            filters: {
                faramValues,
                faramErrors,
            },
        } = this.props;

        const { showFilters } = this.state;

        return (
            <CollapsibleView
                className={_cs(styles.filter, className)}
                expanded={showFilters}
                collapsedViewContainerClassName={styles.showFilterButtonContainer}
                collapsedView={
                    <PrimaryButton
                        onClick={this.handleShowFiltersButtonClick}
                        title="Show filters"
                    >
                        Show Filters
                    </PrimaryButton>

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
                            schema={DashboardFilter.schema}
                            value={faramValues}
                            error={faramErrors}
                            disabled={false}
                        >
                            <RegionSelectInput
                                className={styles.regionSelectInput}
                                faramElementName="region"
                            />
                            <PastDateRangeInput
                                label="Data range"
                                faramElementName="dateRange"
                                className={styles.pastDataSelectInput}
                            />
                            <HazardSelectionInput
                                faramElementName="hazard"
                            />
                        </Faram>
                    </React.Fragment>
                }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardFilter);
