import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Faram from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import SelectInput from '#rsci/SelectInput';
import MultiSelectInput from '#rsci/MultiSelectInput';

import RegionSelectInput from '#components/RegionSelectInput';

import {
    setProjectsProfileFiltersAction,
} from '#actionCreators';
import {
    languageSelector,
    projectsProfileFiltersSelector,
} from '#selectors';

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
    language: languageSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setFilters: params => dispatch(setProjectsProfileFiltersAction(params)),
});

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
        },
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
            showFilterOnly,
            getSelectedOption,
            language: { language },
        } = this.props;
        return (
            <Translation>
                {
                    t => (
                        <Faram
                            className={_cs(className, styles.filterForm)}
                            onChange={this.handleFaramChange}
                            onValidationFailure={this.handleFaramFailure}
                            schema={ProjectsProfileFilter.schema}
                            value={faramValues}
                            error={faramErrors}
                        >
                            <SelectInput
                                faramElementName="priority"
                                label={t('priority area')}
                                options={priorityOptions}
                                keySelector={ndrrsapKeySelector}
                                labelSelector={ndrrsapLabelSelector}
                                getSelectedOption={getSelectedOption}
                                placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}

                            // autoFocus
                            />
                            <SelectInput
                                faramElementName="subPriority"
                                label={t('priority action')}
                                disabled={!faramValues.priority}
                                options={subPriorityOptions}
                                keySelector={ndrrsapKeySelector}
                                labelSelector={ndrrsapLabelSelector}
                                getSelectedOption={getSelectedOption}
                                placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}

                            />
                            <SelectInput
                                faramElementName="activity"
                                label={t('activities')}
                                disabled={!faramValues.subPriority}
                                options={activityOptions}
                                keySelector={ndrrsapKeySelector}
                                labelSelector={ndrrsapLabelSelector}
                                getSelectedOption={getSelectedOption}
                                placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}


                            />
                            {/* <MultiSelectInput
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
                /> */}
                            {!showFilterOnly
                                && (
                                    <MultiSelectInput
                                        label={t('Organization')}
                                        faramElementName="organizations"
                                        options={organizationOptions}
                                        keySelector={organizationKeySelector}
                                        labelSelector={organizationLabelSelector}
                                        placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}

                                    />
                                )
                            }
                            {/* <MultiSelectInput
                    label="organization"
                    faramElementName="organizations"
                    options={organizationOptions}
                    keySelector={organizationKeySelector}
                    labelSelector={organizationLabelSelector}
                /> */}

                        </Faram>
                    )
                }
            </Translation>

        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsProfileFilter);
