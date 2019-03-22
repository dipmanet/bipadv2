import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Faram from '@togglecorp/faram';

import Button from '#rsca/Button';
import { hazardIcons } from '#resources/data';

import {
    setFiltersActionIP,
} from '#actionCreators';
import {
    hazardTypeListIncidentsIP,
    filtersSelectorIP,
} from '#selectors';

import CollapsibleView from '#components/CollapsibleView';
import RegionSelectInput from '#components/RegionSelectInput';
import MultiListSelection from '#components/MultiListSelection';
import PastDateRangeInput from '#components/PastDateRangeInput';

import { iconNames } from '#constants';

import styles from './styles.scss';

const hazardTypeLabelSelector = d => d.title;
const hazardTypeKeySelector = d => d.id;
const hazardTypeIconSelector = d => hazardIcons[d.id];

const propTypes = {
    hazardTypeList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    setFilters: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {};

const mapStateToProps = state => ({
    hazardTypeList: hazardTypeListIncidentsIP(state),
    filters: filtersSelectorIP(state),
});

const mapDispatchToProps = dispatch => ({
    setFilters: params => dispatch(setFiltersActionIP(params)),
});

const filterSchema = {
    fields: {
        hazard: [],
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
        this.setState({ showFilters: true });
    }

    handleHideFiltersButtonClick = () => {
        this.setState({ showFilters: false });
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
                        iconName={iconNames.filter}
                        onClick={this.handleShowFiltersButtonClick}
                    />
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
                                faramElementName="hazard"
                                className={styles.listSelectionInput}
                                label="Hazard type"
                                keySelector={hazardTypeKeySelector}
                                labelSelector={hazardTypeLabelSelector}
                                iconSelector={hazardTypeIconSelector}
                                options={hazardTypeList}
                            />
                        </div>
                    </Faram>
                }
            />
        );
    }
}
