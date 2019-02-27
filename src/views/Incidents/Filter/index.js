import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Faram from '@togglecorp/faram';

import Button from '#rsca/Button';

import {
    hazardTypeListSelector,
    setFiltersActionIP,
    filtersSelectorIP,
} from '#redux';

import CollapsibleView from '#components/CollapsibleView';
import RegionSelectInput from '#components/RegionSelectInput';
import MultiListSelection from '#components/MultiListSelection';
import PastDateRangeInput from '#components/PastDateRangeInput';

import { iconNames } from '#constants';

import styles from './styles.scss';

const hazardTypeLabelSelector = d => d.title;
const hazardTypeKeySelector = d => d.id;

const propTypes = {
    hazardTypeList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    setFilters: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {};

const mapStateToProps = state => ({
    hazardTypeList: hazardTypeListSelector(state),
    filters: filtersSelectorIP(state),
});

const mapDispatchToProps = dispatch => ({
    setFilters: params => dispatch(setFiltersActionIP(params)),
});

const filterSchema = {
    fields: {
        hazardType: [],
        region: [],
        dateRange: [],
    },
};


@connect(mapStateToProps, mapDispatchToProps)
export default class IncidentsFilter extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showFilters: false,
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
        this.setState({ showFilters: true });
    }

    render() {
        const {
            hazardTypeList,
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
                    <Button
                        className={styles.showFiltersButton}
                        iconName={iconNames.filter}
                        onClick={this.handleShowFiltersButtonClick}
                    />
                }
                expandedViewContainerClassName={styles.filtersContainer}
                expandedView={
                    <Faram
                        className={styles.filtersFaram}
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
                        </header>
                        <div className={styles.content}>
                            <PastDateRangeInput
                                className={styles.pastDataSelectInput}
                                label="Data range"
                                faramElementName="dateRange"
                                showHintAndError={false}
                            />
                            <RegionSelectInput
                                faramElementName="region"
                                showHintAndError={false}
                            />
                            <MultiListSelection
                                faramElementName="hazardType"
                                className={styles.listSelectionInput}
                                label="Hazard type"
                                keySelector={hazardTypeKeySelector}
                                labelSelector={hazardTypeLabelSelector}
                                options={hazardTypeList}
                            />
                        </div>
                    </Faram>
                }
            />
        );
    }
}
