import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Faram, {
    FaramGroup,
    // FaramInputElement,
} from '@togglecorp/faram';

import { _cs, listToMap, isNotDefined } from '@togglecorp/fujs';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import {
    setInventoryCategoryListActionRP,
} from '#actionCreators';

import {
    inventoryCategoryListSelectorRP,
} from '#selectors';

import Checkbox from '#rsci/Checkbox';

import SelectInput from '#rsci/SelectInput';
import NumberInput from '#rsci/NumberInput';

import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import CollapsibleView from '#components/CollapsibleView';
import RangeInput from '#components/RangeInput';
import { iconNames } from '#constants';

import styles from './styles.scss';

import resourceAttributes, { operatorOptions } from '../resourceAttributes';

import {
    getFilterItems,
    getSchema,
    getFilterInputElement,
} from './utils';


const propTypes = {
    className: PropTypes.string,
    setFilter: PropTypes.func.isRequired,
    setDistanceFilter: PropTypes.func.isRequired,
    inventoryCategoryList: PropTypes.arrayOf(PropTypes.object),
    distance: PropTypes.number.isRequired,
    // setInventoryCategories: PropTypes.func.isRequired,
};

const checkFilters = (obj, attrVals) =>
    Object.entries(attrVals).reduce(
        (a, [k, v]) => a && (
            v === undefined ||
            (v === false && !obj[k]) || // if compare value is false, show null values
            obj[k] === v
        ),
        true,
    );

const defaultProps = {
    className: '',
    inventoryCategoryList: [],
};

const titles = {
    health: 'Health facilities',
    finance: 'Finance Institutes',
    volunteer: 'Volunteers',
    education: 'Education',
    openSpace: 'Open spaces',
    hotel: 'Hotel',
    governance: 'Governance',
};

const requests = {
    getInventoryCagetoriesRequest: {
        url: '/inventory-category/',
        onSuccess: ({ response, props: { setInventoryCategories } }) => {
            setInventoryCategories({ inventoryCategoryList: response.results });
        },
        onMount: true,
        extras: {
            // schemaName:
        },
    },
};

const mapStateToProps = state => ({
    inventoryCategoryList: inventoryCategoryListSelectorRP(state),
});

const mapDispatchToProps = dispatch => ({
    setInventoryCategories: params => dispatch(setInventoryCategoryListActionRP(params)),
});

class ResponseFilter extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.filterItems = getFilterItems(resourceAttributes);
        this.schema = getSchema(resourceAttributes);
        this.schema.fields.inventory = {
            fields: {
                quantity: [],
                category: [],
                operatorType: [],
            },
        };

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

    createResourceFilter = (faramValues) => {
        // Only show types whose show attribute is true
        const showTypes = Object.entries(faramValues).filter(([_, data]) => data.show);

        const filterFunc = x => showTypes.reduce(
            (currFilterStat, [type, { show, ...attrVals }]) =>
                currFilterStat || (x.resourceType === type && checkFilters(x, attrVals)),
            false,
        );
        return filterFunc;
    }

    createStockPileFilter = (filter) => {
        const { operatorType, category, quantity } = filter;
        const filterFunc = resource =>
            (!operatorType || resource.operatorType === operatorType) &&
            (!category || (resource.inventories && (
                !!resource.inventories.find(inv => inv.item.category === category)))
            ) &&
            (!quantity || (resource.inventories && (
                !!resource.inventories.find(inv => inv.quantity === quantity)))
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
        // This should do two things, call api when distance changes and set
        // local filter when other params change
        const {
            faramValues: {
                distance: { min: currMin, max: currMax } = {},
            },
        } = this.state;

        const {
            distance: { min, max } = {},
            inventory,
            ...otherFilters
        } = faramValues;

        // if distance changes, call distance filter
        if (min !== currMin || max !== currMax) {
            this.props.setDistanceFilter({ min, max });
        }
        this.setState({ faramValues });
        const stockpileFilter = this.createStockPileFilter(inventory) || (() => true);
        const resourceFilter = this.createResourceFilter(otherFilters);
        const combinedFilter = x => stockpileFilter(x) && resourceFilter(x);
        this.props.setFilter(combinedFilter);
    }

    handleFaramFailure = (faramErrors) => {
    }

    handleFaramSuccess = (_, values) => {
        console.warn('Filters', values);
    }

    render() {
        const {
            className,
            setDistanceFilter,
            inventoryCategoryList,
            distance,
        } = this.props;

        const { showFilters, faramValues, faramErrors } = this.state;

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
                            onValidationFailure={this.handleFaramValidationFailure}
                            onValidationSuccess={this.handleFaramValidationSuccess}
                            schema={this.schema}
                            value={faramValues}
                            error={faramErrors}
                            disabled={false}
                        >
                            <RangeInput
                                label=""
                                key="distance"
                                onChange={setDistanceFilter}
                                minLimit={1}
                                maxLimit={100}
                                value={{ max: distance }}
                                noMin
                                maxLabel="Resources Within(Km)"
                            />
                            <FaramGroup
                                key="inventory"
                                faramElementName="inventory"
                            >
                                <h3> Stockpile </h3>
                                <SelectInput
                                    key="operatorType"
                                    label="Operator"
                                    faramElementName="operatorType"
                                    keySelector={x => x.key}
                                    labelSelector={x => x.label}
                                    options={operatorOptions}
                                />
                                <SelectInput
                                    key="category"
                                    label="Category"
                                    faramElementName="category"
                                    keySelector={x => x.title}
                                    labelSelector={x => x.title}
                                    options={inventoryCategoryList}
                                />
                                <NumberInput
                                    key="quantity"
                                    faramElementName="quantity"
                                    label="Quantity"
                                    title="Quantity"
                                    separator=" "
                                />
                            </FaramGroup>
                            {
                                this.filterItems.map(filterItem => (
                                    <div key={filterItem.key} className={styles.group}>
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

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator()(
        createRequestClient(requests)(ResponseFilter),
    ),
);
