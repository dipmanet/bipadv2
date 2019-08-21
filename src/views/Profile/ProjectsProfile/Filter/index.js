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

const emptyList = [];
const emptyObject = {};

const ndrrsapLabelSelector = item => item.title;
const ndrrsapKeySelector = item => item.ndrrsapid;

const drrCyclesLabelSelector = item => item.title;
const drrCyclesKeySelector = item => item.drrcycleid;

const elementsLabelSelector = item => item.title;
const elementsKeySelector = item => item.categoryid;

const organizationLabelSelector = item => item.oname;
const organizationKeySelector = item => item.oid;

class ProjectsProfileFilter extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    static schema = {
        fields: {
            region: [],
            priority: [],
            subPriority: [],
            activity: [],

            drrCycles: [],
            elements: [],
            organizations: [],
            // status: [],
        },
    }

    constructor(props) {
        super(props);

        this.state = {
            showFilters: true,
        };
    }

    handleFaramChange = (faramValues, faramErrors) => {
        const {
            filters: {
                faramValues: oldFaramValues = emptyObject,
            } = {},
        } = this.props;
        let newFaramValues = faramValues;

        if (oldFaramValues.priority !== faramValues.priority) {
            newFaramValues = {
                ...faramValues,
                subPriority: undefined,
                activity: undefined,
            };
        } else if (oldFaramValues.subPriority !== faramValues.subPriority) {
            newFaramValues = {
                ...faramValues,
                activity: undefined,
            };
        }

        this.props.setFilters({
            faramValues: newFaramValues,
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
                faramValues = emptyObject,
                faramErrors = emptyObject,
            } = {},

            priorityOptions,
            subPriorityOptions,
            activityOptions,

            drrCycleOptions,
            elementsOptions,
            organizationOptions,
            // projectStatusOptions = [],
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
                                className={styles.regionSelectInput}
                                faramElementName="region"
                            />
                            <SelectInput
                                faramElementName="priority"
                                label="priority"
                                options={priorityOptions}
                                keySelector={ndrrsapKeySelector}
                                labelSelector={ndrrsapLabelSelector}
                            />
                            <SelectInput
                                faramElementName="subPriority"
                                label="sub priority"
                                disabled={!faramValues.priority}
                                options={subPriorityOptions}
                                keySelector={ndrrsapKeySelector}
                                labelSelector={ndrrsapLabelSelector}
                            />
                            <SelectInput
                                faramElementName="activity"
                                label="activity"
                                disabled={!faramValues.subPriority}
                                options={activityOptions}
                                keySelector={ndrrsapKeySelector}
                                labelSelector={ndrrsapLabelSelector}
                            />
                            <MultiSelectInput
                                label="drr cycles"
                                faramElementName="drrCycles"
                                keySelector={drrCyclesKeySelector}
                                labelSelector={drrCyclesLabelSelector}
                                options={drrCycleOptions}
                            />
                            <MultiSelectInput
                                label="elements"
                                faramElementName="elements"
                                options={elementsOptions}
                                keySelector={elementsKeySelector}
                                labelSelector={elementsLabelSelector}
                            />
                            <MultiSelectInput
                                label="organization"
                                faramElementName="organizations"
                                options={organizationOptions}
                                keySelector={organizationKeySelector}
                                labelSelector={organizationLabelSelector}
                            />
                            {/*
                            <SelectInput
                                faramElementName="status"
                                label="project status"
                                options={projectStatusOptions}
                            />
                            */}
                        </Faram>
                    </React.Fragment>
                }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsProfileFilter);
