import React from 'react';
import PropTypes from 'prop-types';

import { _cs } from '@togglecorp/fujs';
import ListView from '#rscv/List/ListView';

import TextOutput from '#components/TextOutput';

import Button from '#rsca/Button';

import { groupList } from '#utils/common';

import ResourceItem from '../resources/ResourceItem';
import resourceAttributes from '../resourceAttributes';

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
};

const defaultProps = {
    className: undefined,
    // itemRenderer: null,
    data: [],
    showSummary: true,
};

export default class ResourceGroup extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    static keySelector = (d, id) => `${d.title}-${id}`;

    constructor(props) {
        super(props);
        this.state = {
            showResources: false,
            showMore: true,
        };
    }

    getResourceElementRendererParams = (_, d) => d

    handleExpandToggleClick = () => {
        const { showResources } = this.state;
        this.setState({ showResources: !showResources });
    }

    handleShowMoreToggle = () => {
        const { showMore } = this.state;
        this.setState({ showMore: !showMore });
    }

    renderSummary = () => {
        const { data: temp, type } = this.props;
        const data = temp.map(x => ({ ...x, bedCount: 5 }));

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

        const itemsSorted = Object.keys(inventoriesSummary).sort();
        return (
            <div>
                {
                    // Aggregation of types
                    groupedTypes.map(group => (group.key &&
                        <TextOutput
                            key={group.key}
                            label={group.key}
                            value={group.value.length}
                            isNumericValue
                        />
                    ))
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
                    itemsSorted.map(itemName => (
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
            showSummary,
            // itemRenderer,
        } = this.props;

        const { showResources, showMore } = this.state;

        if (!data || data.length <= 0) {
            return null;
        }

        const displayData = showMore ? data.slice(0, 5) : data;

        const itemsCount = data.length;

        const buttonText = showResources ? 'Hide' : 'Expand';
        const showMoreText = showMore ? 'Show All' : 'Show Fewer';

        return (
            <div className={_cs(className, styles.resources)}>
                <div className={styles.header}>
                    <img
                        className={styles.icon}
                        src={icon}
                        alt={heading}
                    />
                    <h3 className={styles.heading}>
                        { heading } ({ itemsCount })
                    </h3>
                    <Button
                        onClick={this.handleExpandToggleClick}
                        type="button"
                    >
                        { buttonText }
                    </Button>
                </div>
                { showSummary && this.renderSummary() }
                { showResources && (
                    <React.Fragment>
                        <ListView
                            className={styles.content}
                            data={displayData}
                            renderer={ResourceItem}
                            rendererParams={this.getResourceElementRendererParams}
                            keySelector={ResourceGroup.keySelector}
                        />
                        <Button
                            onClick={this.handleShowMoreToggle}
                            type="button"
                        >
                            { showMoreText }
                        </Button>
                    </React.Fragment>
                )
                }
            </div>
        );
    }
}
