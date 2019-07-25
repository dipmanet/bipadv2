import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Faram from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import SelectInput from '#rsci/SelectInput';
import Checkbox from '#rsci/Checkbox';

import CollapsibleView from '#components/CollapsibleView';
import RegionSelectInput from '#components/RegionSelectInput';

import {
    setProfileContactFiltersAction,
} from '#actionCreators';
import {
    profileContactFiltersSelector,
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
    filters: profileContactFiltersSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setFilters: params => dispatch(setProfileContactFiltersAction(params)),
});

const emptyList = [];
const emptyObject = {};

class ProfileContactFilter extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    static schema = {
        fields: {
            region: [],
            committee: [],
            position: [],
            training: [],
            drrFocalPerson: [],
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

            committeeValueList,
            trainingValueList,
            positionValueList,
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
                            schema={ProfileContactFilter.schema}
                            value={faramValues}
                            error={faramErrors}
                        >
                            <RegionSelectInput
                                className={styles.regionSelectInput}
                                faramElementName="region"
                            />
                            <Checkbox
                                className={styles.drrFocalPersonCheckbox}
                                label="Show DRR Focal Person"
                                faramElementName="drrFocalPerson"
                            />
                            <SelectInput
                                label="Committee"
                                faramElementName="committee"
                                options={committeeValueList}
                            />
                            <SelectInput
                                label="Training"
                                faramElementName="training"
                                options={trainingValueList}
                            />
                            <SelectInput
                                label="Position"
                                faramElementName="position"
                                options={positionValueList}
                            />
                        </Faram>
                    </React.Fragment>
                }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContactFilter);
