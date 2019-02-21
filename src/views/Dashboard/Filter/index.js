import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    hazardTypeListSelector,
    filtersSelectorDP,
    setFiltersActionDP,
} from '#redux';

import Faram from '#rscg/Faram';
import RegionSelectInput from '#components/RegionSelectInput';
import MultiListSelection from '#components/MultiListSelection';
import PastDateRangeInput from '#components/PastDateRangeInput';

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
            hazardTypeList,
            filters: {
                faramValues,
                faramErrors,
            },
        } = this.props;

        return (
            <Faram
                className={styles.filter}
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
        );
    }
}
