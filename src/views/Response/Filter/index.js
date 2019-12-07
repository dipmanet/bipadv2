import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import { _cs, listToMap } from '@togglecorp/fujs';
import Faram, {
    FaramGroup,
} from '@togglecorp/faram';

import Checkbox from '#rsci/Checkbox';
import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import ListView from '#rscv/List/ListView';
import FloatingContainer from '#rscv/FloatingContainer';

import CollapsibleView from '#components/CollapsibleView';
import { iconNames } from '#constants';

import healthFacilityIcon from '#resources/icons/health-facility.svg';
import educationIcon from '#resources/icons/Education.svg';
import financeIcon from '#resources/icons/University.svg';
import governanceIcon from '#resources/icons/Government-office.svg';
import groupIcon from '#resources/icons/group.svg';
import openSpaceIcon from '#resources/icons/Soap.svg';

import ResourceGroup from '../ResourceGroup';
import resourceAttributes from '../resourceAttributes';
import {
    getFilterItems,
    getSchema,
    getFilterOperations,
    getFilterInputElement,
} from './utils';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    setFilter: PropTypes.func.isRequired,
    resourceList: PropTypes.arrayOf(PropTypes.object),
    filteredList: PropTypes.arrayOf(PropTypes.object),
};

const equalityOperator = (x, y) => x === y;

const checkFilters = (
    obj,
    attrVals,
    filterOperations = {},
) => (
    Object
        .entries(attrVals)
        .reduce((a, [k, v]) => (
            a && (
                v === undefined
                    || (v === false && !obj[k])
                    || (filterOperations[k] || equalityOperator)(obj[k], v)
            )
        ),
        true)
);

const defaultProps = {
    className: '',
    resourceList: [],
    filteredList: [],
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

const resourceComponentsProps = {
    health: {
        heading: 'Health facilities',
        icon: healthFacilityIcon,
    },
    volunteer: {
        heading: 'Volunteers',
        icon: groupIcon,
    },
    education: {
        heading: 'Schools',
        icon: educationIcon,
    },
    finance: {
        heading: 'Financial institutes',
        icon: financeIcon,
    },
    governance: {
        heading: 'Governance',
        icon: governanceIcon,
    },
    openSpace: {
        heading: 'Open space',
        icon: openSpaceIcon,
    },
};

const Resource = ({ type, ...otherProps }) => (
    <ResourceGroup
        type={type}
        {...resourceComponentsProps[type] || {}}
        {...otherProps}
    />
);

Resource.propTypes = {
    type: PropTypes.string.isRequired,
};

class ResponseFilter extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.filterItems = getFilterItems(resourceAttributes);
        // The operations for filtering attributes
        this.filterOperations = getFilterOperations(resourceAttributes);

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

    getResourceRendererParams = d => ({
        type: d,
        isFilterShown: this.state.selectedFilter === d,
        onFilterShowClick: this.handleFilterClick,
        data: this.filteredResources[d],
        totalSize: this.resources[d].length,
    })

    getResources = memoize((resourceList) => {
        const resources = {
            health: [],
            volunteer: [],
            education: [],
            finance: [],
            governance: [],
            openSpace: [],
        };

        resourceList.forEach((r) => {
            if (resources[r.resourceType]) {
                resources[r.resourceType].push(r);
            }
        });

        return resources;
    });

    createResourceFilter = (faramValues) => {
        // Only show types whose show attribute is true
        const showTypes = Object.entries(faramValues).filter(([_, data]) => data.show);

        const filterFunc = x => showTypes.reduce(
            (currFilterStat, [type, { show, ...attrVals }]) => currFilterStat || (
                x.resourceType === type && checkFilters(x, attrVals, this.filterOperations[type])
            ),
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

    handleFilterClick = (resourceKey) => {
        this.setState({ selectedFilter: resourceKey });
    }

    handleFilterClose = () => {
        this.setState({ selectedFilter: undefined });
    }

    handleHideFiltersButtonClick = () => {
        const { onExpandChange } = this.props;
        this.setState({
            showFilters: false,
            selectedFilter: undefined,
        });

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
            ...otherFilters
        } = faramValues;

        this.setState({ faramValues });
        const resourceFilter = this.createResourceFilter(otherFilters);
        // const combinedFilter = x => stockpileFilter(x) && resourceFilter(x);
        // TODO: don't pass function to parent
        this.props.setFilter(resourceFilter);
    }

    handleInvalidate = () => {
        const parent = document.getElementsByClassName(styles.filtersContainer);

        if (!parent) {
            return undefined;
        }

        const parentRect = parent[0].getBoundingClientRect();

        const optionsContainerPosition = {
            top: `${parentRect.top}px`,
            left: `${parentRect.left - 246}px`,
        };

        return optionsContainerPosition;
    }

    renderFilter = () => {
        const {
            faramValues,
            selectedFilter,
        } = this.state;

        const filterItem = this.filterItems.find(f => f.key === selectedFilter);

        return (
            <div className={styles.resourceFilter}>
                <FaramGroup
                    key={filterItem.key}
                    faramElementName={filterItem.key}
                >
                    <header className={styles.header}>
                        <Checkbox
                            className={styles.checkbox}
                            faramElementName="show"
                            label={titles[filterItem.key] || filterItem.key}
                        />
                        <Button
                            className={styles.closeButton}
                            transparent
                            iconName="close"
                            onClick={this.handleFilterClose}
                        />
                    </header>
                    <div className={styles.content}>
                        {
                            filterItem.filterParams.map(
                                param => (
                                    <div className={styles.inputContainer}>
                                        {
                                            getFilterInputElement(
                                                param,
                                                faramValues[filterItem.key].show,
                                                { showHintAndError: false },
                                            )
                                        }
                                    </div>
                                ),
                            )
                        }
                    </div>
                </FaramGroup>
            </div>
        );
    }

    render() {
        const {
            className,
            resourceList,
            filteredList,
            // distance,
        } = this.props;

        const {
            showFilters,
            faramValues,
            faramErrors,
            selectedFilter,
        } = this.state;

        this.resources = this.getResources(resourceList);
        // FIXME: using same method on two different list will cause cache miss everytime
        this.filteredResources = this.getResources(filteredList);
        // TODO: memoize
        const resourceKeys = Object.keys(this.resources);

        const Filter = this.renderFilter;

        return (
            <div className={_cs(className, styles.filter)}>
                <header className={styles.header}>
                    <h3 className={styles.heading}>
                        Resources
                    </h3>
                </header>
                { selectedFilter && <Filter /> }
                <Faram
                    className={styles.filterForm}
                    onChange={this.handleFaramChange}
                    schema={this.schema}
                    value={faramValues}
                    error={faramErrors}
                >
                    <div className={styles.resourceListContainer}>
                        <ListView
                            data={resourceKeys}
                            renderer={Resource}
                            rendererParams={this.getResourceRendererParams}
                        />
                    </div>
                </Faram>
            </div>
        );
    }
}

export default ResponseFilter;
