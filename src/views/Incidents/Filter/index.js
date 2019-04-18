import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Faram from '@togglecorp/faram';

import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import { hazardIcons } from '#resources/data';

import {
    setFiltersActionIP,
} from '#actionCreators';
import {
    hazardTypeListSelector,
    eventListSelector,
    filtersSelectorIP,
} from '#selectors';

import SelectInput from '#rsci/SelectInput';
import CollapsibleView from '#components/CollapsibleView';
import RegionSelectInput from '#components/RegionSelectInput';
import HazardSelectionInput from '#components/HazardSelectionInput';
import PastDateRangeInput from '#components/PastDateRangeInput';

import { iconNames } from '#constants';

import styles from './styles.scss';

const eventKeySelector = d => d.id;
const eventLabelSelector = d => d.title;

const propTypes = {
    hazardTypeList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    setFilters: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {};

const mapStateToProps = state => ({
    hazardTypeList: hazardTypeListSelector(state),
    filters: filtersSelectorIP(state),
    eventList: eventListSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setFilters: params => dispatch(setFiltersActionIP(params)),
});

const filterSchema = {
    fields: {
        hazard: [],
        region: [],
        dateRange: [],
        event: [],
    },
};


@connect(mapStateToProps, mapDispatchToProps)
export default class IncidentsFilter extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showFilters: true,
        };
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

    render() {
        const {
            hazardTypeList,
            eventList,
            filters: {
                faramValues,
                faramErrors,
            },
        } = this.props;

        const { showFilters } = this.state;

        return (
            <CollapsibleView
                className={styles.filter}
                expanded={showFilters}
                collapsedViewContainerClassName={styles.showFiltersButtonContainer}
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
                    <Faram
                        onChange={this.handleFaramChange}
                        onValidationFailure={this.handleFaramFailure}
                        onValidationSuccess={this.handleFaramSuccess}
                        schema={filterSchema}
                        value={faramValues}
                        error={faramErrors}
                    >
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
                        <div className={styles.content}>
                            <RegionSelectInput
                                faramElementName="region"
                            />
                            <PastDateRangeInput
                                className={styles.pastDataSelectInput}
                                label="Data range"
                                faramElementName="dateRange"
                            />
                            <HazardSelectionInput
                                faramElementName="hazard"
                            />
                            <SelectInput
                                faramElementName="event"
                                className={styles.eventSelectInput}
                                label="event"
                                options={eventList}
                                keySelector={eventKeySelector}
                                labelSelector={eventLabelSelector}
                            />
                        </div>
                    </Faram>
                }
            />
        );
    }
}
