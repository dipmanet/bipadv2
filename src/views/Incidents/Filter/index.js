import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    hazardTypeListSelector,
    setFiltersActionIP,
    filtersSelectorIP,
} from '#redux';

import RegionSelectInput from '#components/RegionSelectInput';
import MultiListSelection from '#components/MultiListSelection';
import PastDateRangeInput from '#components/PastDateRangeInput';
import Faram from '#rscg/Faram';

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
    filters: filtersSelectorIP(state),
});

const mapDispatchToProps = dispatch => ({
    setFilters: params => dispatch(setFiltersActionIP(params)),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class IncidentsFilter extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.schema = {
            fields: {
                hazardType: [],
                region: [],
                dateRange: [],
            },
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
                onChange={this.handleFaramChange}
                onValidationFailure={this.handleFaramFailure}
                onValidationSuccess={this.handleFaramSuccess}
                schema={this.schema}
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
                    />
                    <RegionSelectInput
                        faramElementName="region"
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
        );
    }
}
