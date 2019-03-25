import React from 'react';
import PropTypes from 'prop-types';
import Faram, {
    FaramGroup,
//    FaramInputElement
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
    setFilters: PropTypes.func.isRequired,
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
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

    handleShowFiltersButtonClick = () => {
        this.setState({ showFilters: true });
    }

    handleHideFiltersButtonClick = () => {
        this.setState({ showFilters: false });
    }

    handleFaramChange = (faramValues, faramErrors) => {
        this.setState({ faramValues, faramErrors });
    }

    handleFaramFailure = (faramErrors) => {
        this.props.setFilters({
            faramErrors,
            pristine: true,
        });
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
                                    <FaramGroup
                                        key={filterItem.key}
                                        faramElementName={filterItem.key}
                                    >
                                        <Checkbox
                                            faramElementName="show"
                                            label={filterItem.key}
                                        />
                                        <div>
                                            {
                                                filterItem.filterParams.map(param => (
                                                    faramValues[filterItem.key].show &&
                                                        getFilterInputElement(param)
                                                ))
                                            }
                                        </div>
                                    </FaramGroup>
                                ))
                            }
                        </Faram>
                    </React.Fragment>
                }
            />
        );
    }
}
