import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Faram from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';

import {
    hazardTypeListSelector,
    filtersSelectorDP,
    setFiltersActionDP,
} from '#redux';
import CollapsibleView from '#components/CollapsibleView';
import RegionSelectInput from '#components/RegionSelectInput';
import MultiListSelection from '#components/MultiListSelection';
import PastDateRangeInput from '#components/PastDateRangeInput';
import { iconNames } from '#constants';

import styles from './styles.scss';

const hazardTypeLabelSelector = d => d.title;
const hazardTypeKeySelector = d => d.pk;

const propTypes = {
    hazardTypeList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    setFilters: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {};

const mapStateToProps = state => ({
    hazardTypeList: hazardTypeListSelector(state),
    filters: filtersSelectorDP(state),
});

const mapDispatchToProps = dispatch => ({
    setFilters: params => dispatch(setFiltersActionDP(params)),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class DashboardFilter extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps
    static schema = {
        fields: {
            dateRange: [],
            region: [],
            hazardType: [],
        },
    }

    constructor(props) {
        super(props);

        this.state = {
            showFilter: false,
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
        console.warn(values);
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
                            schema={DashboardFilter.schema}
                            value={faramValues}
                            error={faramErrors}
                            disabled={false}
                        >
                            <PastDateRangeInput
                                label="Data range"
                                faramElementName="dateRange"
                                className={styles.pastDataSelectInput}
                            />
                            <RegionSelectInput
                                faramElementName="region"
                            />
                            <MultiListSelection
                                faramElementName="hazardType"
                                className={styles.listSelectionInput}
                                keySelector={hazardTypeKeySelector}
                                labelSelector={hazardTypeLabelSelector}
                                label="Hazard type"
                                options={hazardTypeList}
                            />
                        </Faram>
                    </React.Fragment>
                }
            />
        );
    }
}
