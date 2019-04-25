import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import {
    listToMap,
    isFalsy,
} from '@togglecorp/fujs';
import Faram, {
    FaramGroup,
} from '@togglecorp/faram';

import SelectInput from '#rsci/SelectInput';
import NumberInput from '#rsci/NumberInput';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import {
    setInventoryCategoryListActionRP,
    setInventoryItemListActionRP,
} from '#actionCreators';

import {
    inventoryCategoryListSelectorRP,
    inventoryItemListSelectorRP,
} from '#selectors';

import { operatorOptions } from '../../resourceAttributes';
import styles from './styles.scss';

const requests = {
    getInventoryCagetoriesRequest: {
        url: '/inventory-category/',
        onSuccess: ({ response, props: { setInventoryCategories } }) => {
            setInventoryCategories({ inventoryCategoryList: response.results });
        },
        onMount: true,
        // TODO: write schema
    },

    getInventoryItemsRequest: {
        url: '/inventory-item/',
        onSuccess: ({ response, props: { setInventoryItems } }) => {
            setInventoryItems({ inventoryItemList: response.results });
        },
        onMount: true,
        // TODO: write schema
    },
};

const propTypes = {};
const defaultProps = {};

const labelSelector = x => x.label;
const titleSelector = x => x.title;
const keySelector = x => x.key;
const idSelector = x => x.id;

const mapStateToProps = state => ({
    inventoryCategoryList: inventoryCategoryListSelectorRP(state),
    inventoryItemList: inventoryItemListSelectorRP(state),
});

const mapDispatchToProps = dispatch => ({
    setInventoryCategories: params => dispatch(setInventoryCategoryListActionRP(params)),
    setInventoryItems: params => dispatch(setInventoryItemListActionRP(params)),
});

class StockPileFilter extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            faramValues: {},
        };

        this.schema = {
            fields: {
                quantity: [],
                item: [],
                operatorType: [],
            },
        };
    }

    getItemsUnits = memoize(inventoryItemList => listToMap(
        inventoryItemList,
        item => item.id,
        item => item.unit,
    ))

    handleFaramChange = (faramValues) => {
        if (!faramValues.item) {
            this.setState({
                faramValues: {
                    ...faramValues,
                    quantity: undefined,
                },
            });
        } else {
            this.setState({ faramValues });
        }
    }

    handleFaramValidationSuccess = (_, faramValues) => {
        this.props.setStockPileFilter(faramValues);
    }

    render() {
        const {
            faramValues,
            faramErrors,
        } = this.state;

        const {
            filteredList,
            inventoryItemList,
        } = this.props;

        const itemUnits = this.getItemsUnits(inventoryItemList);

        const { inventory: { item } = {} } = faramValues;
        const unit = itemUnits[item];
        const unitText = unit ? `(${unit})` : '';
        const quantityDisabled = !faramValues.item;

        return (
            <Faram
                className={styles.filterForm}
                onChange={this.handleFaramChange}
                onValidationSuccess={this.handleFaramValidationSuccess}
                schema={this.schema}
                value={faramValues}
                error={faramErrors}
            >
                <h2 className={styles.heading}>
                    Stockpile Items
                </h2>
                <SelectInput
                    key="item"
                    label="Item"
                    faramElementName="item"
                    keySelector={idSelector}
                    labelSelector={titleSelector}
                    options={inventoryItemList}
                />
                <NumberInput
                    key="quantity"
                    faramElementName="quantity"
                    label={`Quantity${unitText}`}
                    title="Quantity"
                    disabled={quantityDisabled}
                    separator=" "
                />
                <SelectInput
                    key="operatorType"
                    label="Operator"
                    faramElementName="operatorType"
                    keySelector={keySelector}
                    labelSelector={labelSelector}
                    options={operatorOptions}
                />
                <div className={styles.bottomContainer}>
                    <PrimaryButton
                        type="submit"
                    >
                        Search
                    </PrimaryButton>
                </div>
            </Faram>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator()(
        createRequestClient(requests)(StockPileFilter),
    ),
);
