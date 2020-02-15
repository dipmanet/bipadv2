import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import { _cs } from '@togglecorp/fujs';
import Faram, {
    FaramGroup,
} from '@togglecorp/faram';

import Button from '#rsca/Button';
import Checkbox from '#rsci/Checkbox';
import ListView from '#rscv/List/ListView';
import NumberInput from '#rsci/NumberInput';
import SelectInput from '#rsci/SelectInput';
import TextInput from '#rsci/TextInput';

import healthFacilityIcon from '#resources/icons/health-facility.svg';
import educationIcon from '#resources/icons/Education.svg';
import financeIcon from '#resources/icons/University.svg';
import governanceIcon from '#resources/icons/Government-office.svg';
import groupIcon from '#resources/icons/group.svg';
import openSpaceIcon from '#resources/icons/Soap.svg';

import IncidentInfo from '#components/IncidentInfo';

import ResourceGroup from './ResourceGroup';
import resourceAttributes from '../resourceAttributes';
import { getFilterItems, getSchema } from './utils.js';

import styles from './styles.scss';

const getKey = x => x.key;

const getLabel = x => x.label;

const getFilterInputElement = (filterParam, show, elementProps = {}) => {
    const {
        key,
        type: paramType,
        label,

        filter,
    } = filterParam;

    const type = filter.type || paramType;

    const commonProps = {
        ...elementProps,
        key,
        label,
        faramElementName: key,
        disabled: !show,
    };

    if (type === 'string') {
        return (
            <TextInput
                {...commonProps}
            />
        );
    }
    if (type === 'number') {
        return (
            <NumberInput
                {...commonProps}
                title={label}
                separator=" "
            />
        );
    }
    if (type === 'boolean') {
        return (
            <Checkbox
                {...commonProps}
            />
        );
    }
    if (type === 'select') {
        return (
            <SelectInput
                {...commonProps}
                keySelector={getKey}
                labelSelector={getLabel}
                options={filter.options}
            />
        );
    }
    return (
        <TextInput
            {...commonProps}
        />
    );
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

const getResources = (resourceList) => {
    const resources = {
        health: [],
        finance: [],
        volunteer: [],
        education: [],
        openSpace: [],
        hotel: [],
        governance: [],
    };

    resourceList.forEach((r) => {
        if (resources[r.resourceType]) {
            resources[r.resourceType].push(r);
        }
    });

    return resources;
};

const propTypes = {
    className: PropTypes.string,
    // setFilter: PropTypes.func.isRequired,
    resourceList: PropTypes.arrayOf(PropTypes.object),
};

const defaultProps = {
    className: '',
    resourceList: [],
};

class LeftPane extends React.Component {
    static propTypes = propTypes

    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.schema = getSchema(resourceAttributes);

        this.state = {
        };
    }

    getResourceRendererParams = (d) => {
        const resources = this.getResources(this.props.resourceList);
        const filteredResources = this.getFilteredResources(this.props.filteredResourceList);
        return {
            ...resourceComponentsProps[d],
            type: d,
            isFilterShown: this.state.selectedFilter === d,
            onFilterShowClick: this.handleFilterClick,
            data: filteredResources[d],
            totalSize: resources[d] ? resources[d].length : 0,
        };
    };

    getResources = memoize(getResources);

    getFilteredResources = memoize(getResources);

    handleFilterClick = (resourceKey) => {
        this.setState({ selectedFilter: resourceKey });
    }

    handleFilterClose = () => {
        this.setState({ selectedFilter: undefined });
    }

    handleFaramChange = (faramValues) => {
        this.props.setFilter(faramValues);
    }

    renderFilter = () => {
        const { filter } = this.props;
        const { selectedFilter } = this.state;

        const filterItems = getFilterItems(resourceAttributes);
        const filterItem = filterItems[selectedFilter];

        if (!filterItem) {
            return null;
        }

        const {
            key,
            filterParams,
        } = filterItem;

        return (
            <div className={styles.resourceFilter}>
                <FaramGroup
                    key={key}
                    faramElementName={key}
                >
                    <header className={styles.header}>
                        <Checkbox
                            className={styles.checkbox}
                            faramElementName="show"
                            label={titles[key] || key}
                        />
                        <Button
                            className={styles.closeButton}
                            transparent
                            iconName="close"
                            onClick={this.handleFilterClose}
                        />
                    </header>
                    <div className={styles.content}>
                        {filterParams.map(param => (
                            <div className={styles.inputContainer}>
                                {getFilterInputElement(
                                    param,
                                    filter[key].show,
                                    { showHintAndError: false },
                                )}
                            </div>
                        ))}
                    </div>
                </FaramGroup>
            </div>
        );
    }

    render() {
        const {
            className,
            filter,
            resourceList,
            incident,
            wardsMap,
            provincesMap,
            districtsMap,
            municipalitiesMap,
        } = this.props;

        const {
            selectedFilter,
        } = this.state;

        const resources = this.getResources(this.props.resourceList);
        const resourceKeys = Object.keys(resources);

        return (
            <div className={_cs(className, styles.filter)}>
                <div className={styles.resourceListContainer}>
                    <IncidentInfo
                        incident={incident}
                        wardsMap={wardsMap}
                        provincesMap={provincesMap}
                        districtsMap={districtsMap}
                        municipalitiesMap={municipalitiesMap}
                        hideLink
                    />
                    <header className={styles.header}>
                        <h3 className={styles.heading}>
                            Resources
                        </h3>
                    </header>
                    <ListView
                        data={resourceKeys}
                        renderer={ResourceGroup}
                        rendererParams={this.getResourceRendererParams}
                    />
                </div>
                {selectedFilter && (
                    <Faram
                        className={styles.filterForm}
                        onChange={this.handleFaramChange}
                        schema={this.schema}
                        value={filter}
                        // error={faramErrors}
                    >
                        {this.renderFilter()}
                    </Faram>
                )}
            </div>
        );
    }
}

export default LeftPane;
