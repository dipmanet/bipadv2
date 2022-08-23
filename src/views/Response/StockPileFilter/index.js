import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import {
    _cs,
    listToMap,
} from '@togglecorp/fujs';

import Faram from '@togglecorp/faram';

import { Translation } from 'react-i18next';
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
    // inventoryCategoryListSelectorRP,
    inventoryItemListSelectorRP,
    languageSelector,
} from '#selectors';

import { operatorOptions } from '../resourceAttributes';
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

const labelSelector = (x, language) => (language === 'en' ? x.label : x.labelNe);
const titleSelector = x => x.title;
const keySelector = x => x.key;
const idSelector = x => x.id;

const mapStateToProps = state => ({
    // inventoryCategoryList: inventoryCategoryListSelectorRP(state),
    inventoryItemList: inventoryItemListSelectorRP(state),
    language: languageSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setInventoryCategories: params => dispatch(setInventoryCategoryListActionRP(params)),
    setInventoryItems: params => dispatch(setInventoryItemListActionRP(params)),
});

const propTypes = {
};
const defaultProps = {
};

class StockPileFilter extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        const { stockPileFilter } = this.props;

        this.state = {
            faramValues: stockPileFilter,
            faramErrors: {},
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

    handleFaramValidationFailure = (faramErrors) => {
        this.setState({ faramErrors });
    }

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
        const { setStockPileFilter } = this.props;
        setStockPileFilter(faramValues);
    }

    render() {
        const {
            faramValues,
            faramErrors,
        } = this.state;

        const {
            inventoryItemList,
            className,
            language: { language },
        } = this.props;

        const itemUnits = this.getItemsUnits(inventoryItemList);
        const { inventory: { item } = {} } = faramValues;
        const unit = itemUnits[item];
        const unitText = unit ? `(${unit})` : '';

        const quantityDisabled = !faramValues.item;

        return (
            <Translation>
                {
                    t => (
                        <Faram
                            className={_cs(className, styles.filterForm)}
                            onChange={this.handleFaramChange}
                            onValidationFailure={this.hanndleValidationFailure}
                            onValidationSuccess={this.handleFaramValidationSuccess}
                            schema={this.schema}
                            value={faramValues}
                            error={faramErrors}
                        >
                            <h3 className={styles.heading}>
                                {t('Stockpile Items')}
                            </h3>
                            <SelectInput
                                key="item"
                                label={t('Item')}
                                faramElementName="item"
                                keySelector={idSelector}
                                labelSelector={titleSelector}
                                options={inventoryItemList}
                                showHintAndError={false}
                                className={styles.input}
                                placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            // autoFocus
                            />
                            <NumberInput
                                key="quantity"
                                faramElementName="quantity"
                                label={t(`Quantity${unitText}`)}
                                title={'Quantity'}
                                disabled={quantityDisabled}
                                separator=" "
                                showHintAndError={false}
                                className={styles.input}
                            />
                            <SelectInput
                                key="operatorType"
                                label={t('Operator')}
                                faramElementName="operatorType"
                                keySelector={keySelector}
                                labelSelector={x => labelSelector(x, language)}
                                options={operatorOptions}
                                showHintAndError={false}
                                className={styles.input}
                                placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            />
                            <div className={styles.actions}>
                                <PrimaryButton
                                    type="submit"
                                >
                                    {t('Search')}
                                </PrimaryButton>
                            </div>
                        </Faram>

                    )
                }
            </Translation>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator()(
        createRequestClient(requests)(StockPileFilter),
    ),
);
