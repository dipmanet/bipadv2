import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';
import Button from '#rsca/Button';
import TextOutput from '#components/TextOutput';
import { groupList } from '#utils/common';

import ResourceItem from '../../ResourceItem';
import resourceAttributes from '../../resourceAttributes';

import styles from './styles.scss';

const propTypes = {
    heading: PropTypes.string.isRequired,
    className: PropTypes.string,
    icon: PropTypes.string.isRequired,
    showSummary: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    // itemRenderer: PropTypes.object,
    data: PropTypes.arrayOf(PropTypes.object),
    type: PropTypes.string.isRequired,
    totalSize: PropTypes.number.isRequired,
    isFilterShown: PropTypes.bool.isRequired,
    onFilterShowClick: PropTypes.func.isRequired,
};

const defaultProps = {
    className: undefined,
    // itemRenderer: null,
    data: [],
    showSummary: true,
};


const keySelector = (d, id) => `${d.title}-${id}`;

export default class ResourceGroup extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    constructor(props) {
        super(props);
        this.state = { showResources: true };
    }

    getResourceElementRendererParams = (_, d) => d

    handleExpandToggleClick = () => {
        const { showResources } = this.state;
        this.setState({ showResources: !showResources });
    }

    handleFilterButtonClick = () => {
        const {
            type,
            isFilterShown,
            onFilterShowClick,
        } = this.props;

        if (isFilterShown) {
            onFilterShowClick(undefined);
        } else {
            onFilterShowClick(type);
        }
    }

    renderSummary = () => {
        const { showSummary } = this.props;

        if (!showSummary) {
            return null;
        }

        const { data, type } = this.props;

        // Aggregate type of resources
        const groupedTypes = groupList(data, item => item.type);

        // Aggregate some of the aggregatable attributes(other than inventories)
        const aggregatableAttributes = (resourceAttributes[type] || [])
            .filter(x => x.aggregate)
            .map(({ key, label }) => ({ key, label }));

        const aggregatedAttributes = {};
        const inventories = [];
        data.forEach((resource) => {
            inventories.push(...(resource.inventories || []));
            aggregatableAttributes.forEach(({ key, label }) => {
                aggregatedAttributes[label] = (aggregatedAttributes[label] || 0) + resource[key];
            });
        });

        const inventoryUnits = {};
        const inventoriesSummary = {};
        inventories.forEach((inventory) => {
            const key = inventory.item.title;
            inventoryUnits[key] = inventory.item.unit;
            inventoriesSummary[key] = (inventoriesSummary[key] || 0) + inventory.quantity;
        });

        return (
            <div className={styles.summary}>
                {
                    // Aggregation of types
                    groupedTypes.map(group => (group.key && (
                        <TextOutput
                            key={group.key}
                            label={group.key}
                            value={group.value.length}
                            isNumericValue
                        />
                    )))
                }
                {
                    // Aggregation of resource attributes
                    Object.keys(aggregatedAttributes).sort().map(label => (
                        <TextOutput
                            key={label}
                            label={label}
                            value={aggregatedAttributes[label]}
                            isNumericValue
                        />
                    ))
                }
                {
                    // Aggregation of inventories
                    Object.keys(inventoriesSummary).sort().map(itemName => (
                        <TextOutput
                            key={itemName}
                            label={itemName}
                            isNumericValue
                            value={inventoriesSummary[itemName]}
                            suffix={` ${inventoryUnits[itemName]}`}
                        />
                    ))
                }
            </div>
        );
    }

    render() {
        const {
            heading,
            data,
            className,
            icon,
            totalSize,
            // itemRenderer,
        } = this.props;

        const { showResources } = this.state;

        if (!data || totalSize <= 0) {
            return null;
        }

        const itemsCount = data.length;
        const buttonIcon = showResources ? 'chevronUp' : 'chevronDown';

        const Summary = this.renderSummary;

        return (
            <div className={_cs(className, styles.resourceGroup)}>
                <div className={styles.header}>
                    <img
                        className={styles.icon}
                        src={icon}
                        alt={heading}
                    />
                    <h3 className={styles.heading}>
                        <div className={styles.resourceName}>
                            { heading }
                        </div>
                        <div className={styles.countDetails}>
                            <div className={styles.numItems}>
                                { itemsCount }
                            </div>
                            <div className={styles.separator}>
                                /
                            </div>
                            <div className={styles.total}>
                                { totalSize }
                            </div>
                        </div>
                    </h3>
                    <div className={styles.actions}>
                        <Button
                            className={styles.filterButton}
                            onClick={this.handleFilterButtonClick}
                            iconName="filter"
                            type="button"
                        />
                        <Button
                            className={styles.expandButton}
                            onClick={this.handleExpandToggleClick}
                            iconName={buttonIcon}
                            type="button"
                        />
                    </div>
                </div>
                <Summary />
                {showResources && (
                    <ListView
                        className={styles.content}
                        data={data}
                        renderer={ResourceItem}
                        rendererParams={this.getResourceElementRendererParams}
                        keySelector={keySelector}
                    />
                )}
            </div>
        );
    }
}
