import React from 'react';
import { connect } from 'react-redux';
import Faram from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import { iconNames } from '#constants';

import {
    setFiltersActionIP,
} from '#actionCreators';
import {
    hazardTypesSelector,
    filtersSelectorIP,
    resourceTypeListSelector,
} from '#selectors';

import RegionSelectInput from '#components/RegionSelectInput';
import MultiListSelection from '#components/MultiListSelection';
import ListSelection from '#components/ListSelection';
import CollapsibleView from '#components/CollapsibleView';
import PastDateRangeInput from '#components/PastDateRangeInput';

import styles from './styles.scss';

const mapStateToProps = state => ({
    hazardTypeList: hazardTypesSelector(state),
    resourceTypeList: resourceTypeListSelector(state),
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
        resources: [],
    },
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Filter extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showFilters: false,
        };
    }

    handleShowFiltersButtonClick = () => {
        this.setState({ showFilters: true });
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
            resourceTypeList,
            filters: {
                faramValues,
                faramErrors,
            },
        } = this.props;

        const {
            showFilters,
        } = this.state;

        return (
            <CollapsibleView
                className={_cs(className, styles.filter)}
                expanded={showFilters}
                collapsedViewContainerClassName={styles.showFiltersButtonContainer}
                collapsedView={
                    <Button
                        className={styles.showFiltersButton}
                        iconName={iconNames.filter}
                        onClick={this.handleShowFiltersButtonClick}
                    />
                }
                expandedViewContainerClassName={styles.container}
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
                                faramElementName="resources"
                                className={styles.resourceTypeSelection}
                                label="Resources"
                                options={resourceTypeList}
                            />
                            <ListSelection
                                faramElementName="hazardType"
                                label="Hazard type"
                                className={styles.hazardTypeSelection}
                                name="Hazard type"
                                options={hazardTypeList}
                            />
                        </div>
                    </Faram>
                }
            />
        );
    }
}
