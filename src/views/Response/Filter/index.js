import React from 'react';
import PropTypes from 'prop-types';
import Faram, {
    FaramGroup,
    // FaramInputElement,
} from '@togglecorp/faram';

import { _cs, listToMap } from '@togglecorp/fujs';

import Checkbox from '#rsci/Checkbox';

import Button from '#rsca/Button';

import CollapsibleView from '#components/CollapsibleView';
import { iconNames } from '#constants';

import styles from './styles.scss';

import resourceAttributes from '../resourceAttributes';

import {
    getFilterItems,
    getSchema,
    getFilterInputElement,
} from './utils';


const propTypes = {
    className: PropTypes.string,
    setFilter: PropTypes.func.isRequired,
};

const checkFilters = (obj, attrVals) =>
    Object.entries(attrVals).reduce(
        (a, [k, v]) => a && (v === undefined || obj[k] === v),
        true,
    );

const defaultProps = {
    className: '',
};

const titles = {
    health: 'Health facilities',
    finance: 'Finance Institutes',
    volunteer: 'Volunteers',
    education: 'Education',
    openSpace: 'Open spaces',
    hotel: 'Hotel',
};

export default class ResponseFilter extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.filterItems = getFilterItems(resourceAttributes);
        this.schema = getSchema(resourceAttributes);

        // Set show = true for each resource filter
        const defaultFaramValues = listToMap(
            Object.keys(this.schema.fields),
            x => x,
            () => ({ show: true }),
        );

        this.state = {
            showFilters: true,
            faramValues: defaultFaramValues,
            faramErrors: {},
        };
    }

    createFilter = (faramValues) => {
        // Only show types whose show attribute is true
        const showTypes = Object.entries(faramValues).filter(([_, data]) => data.show);

        const filterFunc = x => showTypes.reduce(
            (currFilterStat, [type, { show, ...attrVals }]) =>
                currFilterStat || (x.resourceType === type && checkFilters(x, attrVals)),
            false,
        );
        return filterFunc;
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

    handleFaramChange = (faramValues) => {
        this.setState({ faramValues });
        const filterFunction = this.createFilter(faramValues);
        this.props.setFilter(filterFunction);
    }

    handleFaramFailure = (faramErrors) => {
    }

    handleFaramSuccess = (_, values) => {
        console.warn('Filters', values);
    }

    render() {
        const {
            className,
        } = this.props;

        const { showFilters, faramValues, faramErrors } = this.state;

        return (
            <CollapsibleView
                className={_cs(styles.filter, className)}
                expanded={showFilters}
                collapsedViewContainerClassName={styles.showFilterButtonContainer}
                collapsedView={
                    <Button
                        onClick={this.handleShowFiltersButtonClick}
                        iconName={iconNames.filter}
                        title="Show filters"
                    />
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
                            onValidationFailure={this.handleFaramValidationFailure}
                            onValidationSuccess={this.handleFaramValidationSuccess}
                            schema={this.schema}
                            value={faramValues}
                            error={faramErrors}
                            disabled={false}
                        >
                            {
                                this.filterItems.map(filterItem => (
                                    <div className={styles.group}>
                                        <FaramGroup
                                            key={filterItem.key}
                                            faramElementName={filterItem.key}
                                        >
                                            <Checkbox
                                                className={styles.checkbox}
                                                faramElementName="show"
                                                label={titles[filterItem.key] || filterItem.key}
                                            />
                                            <div className={styles.filters}>
                                                {
                                                    filterItem.filterParams.map(param => (
                                                        faramValues[filterItem.key].show &&
                                                            getFilterInputElement(param)
                                                    ))
                                                }
                                            </div>
                                        </FaramGroup>
                                    </div>
                                ))
                            }
                        </Faram>
                    </React.Fragment>
                }
            />
        );
    }
}
