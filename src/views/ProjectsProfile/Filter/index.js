import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Faram from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import SelectInput from '#rsci/SelectInput';
import MultiSelectInput from '#rsci/MultiSelectInput';

import CollapsibleView from '#components/CollapsibleView';
import RegionSelectInput from '#components/RegionSelectInput';

import {
    setProjectsProfileFiltersAction,
} from '#actionCreators';
import {
    projectsProfileFiltersSelector,
} from '#selectors';
import { iconNames } from '#constants';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    setFilters: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    className: '',
};

const mapStateToProps = state => ({
    filters: projectsProfileFiltersSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setFilters: params => dispatch(setProjectsProfileFiltersAction(params)),
});
class ProjectsProfileFilter extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    static schema = {
        fields: {
            region: [],
            priority: [],
            subPriority: [],
            activities: [],
            drrCycle: [],
            elements: [],
            organization: [],
            status: [],
        },
    }

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
            className,
            filters: {
                faramValues = {},
                faramErrors = {},
            } = {},
            priorityOptions = [],
            subPriorityOptions = [],
            activitiesOptions = [],
            drrCycleOptions = [],
            elementsOptions = [],
            organizationOptions = [],
            projectStatusOptions = [],
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
                            onValidationFailure={this.handleFaramFailure}
                            onValidationSuccess={this.handleFaramSuccess}
                            schema={ProjectsProfileFilter.schema}
                            value={faramValues}
                            error={faramErrors}
                        >
                            <RegionSelectInput
                                faramElementName="region"
                            />
                            <SelectInput
                                faramElementName="priority"
                                label="priority"
                                options={priorityOptions}
                            />
                            <SelectInput
                                faramElementName="subPriority"
                                label="sub priority"
                                options={subPriorityOptions}
                            />
                            <SelectInput
                                faramElementName="activities"
                                label="activities"
                                options={activitiesOptions}
                            />
                            <MultiSelectInput
                                label="drr cycle"
                                faramElementName="drrCycle"
                                options={drrCycleOptions}
                            />
                            <MultiSelectInput
                                label="elements"
                                faramElementName="elements"
                                options={elementsOptions}
                            />
                            <MultiSelectInput
                                label="organization"
                                faramElementName="organization"
                                options={organizationOptions}
                            />
                            <SelectInput
                                faramElementName="status"
                                label="project status"
                                options={projectStatusOptions}
                            />
                        </Faram>
                    </React.Fragment>
                }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsProfileFilter);
