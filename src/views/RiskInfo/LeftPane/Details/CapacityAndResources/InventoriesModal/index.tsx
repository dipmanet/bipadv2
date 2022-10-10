/* eslint-disable max-len */
import React from 'react';
import { _cs, Obj, isDefined } from '@togglecorp/fujs';

import { connect } from 'react-redux';
import * as ReachRouter from '@reach/router';
import { Translation } from 'react-i18next';
import modalize from '#rscg/Modalize';
import TextOutput from '#components/TextOutput';
import FormattedDate from '#rscv/FormattedDate';
import Button from '#rsca/Button';
import DangerButton from '#rsca/Button/DangerButton';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';
import ListView from '#rscv/List/ListView';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import Numeral from '#rscv/Numeral';
import ModalHeader from '#rscv/Modal/Header';
import Cloak from '#components/Cloak';

import * as PageType from '#store/atom/page/types';
import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
    createConnectedRequestCoordinator,
} from '#request';

import {
    setPalikaRedirectAction,
} from '#actionCreators';
import { hazardTypesSelector, languageSelector, palikaRedirectSelector } from '#selectors';


import { MultiResponse } from '#store/atom/response/types';


import AddInventoryForm from './AddInventoryForm';
import styles from './styles.scss';
import TableDataList from './TableDataList';
import AddClusterForm from './AddClusterForm';
import AddCategoryForm from './AddCategoryForm';
import AddUnitForm from './AddUnitForm';
import AddItemForm from './AddItemForm';
import AddOrganizationForm from './AddOrganizationForm';

const mapStateToProps = (state, props) => ({
    palikaRedirect: palikaRedirectSelector(state),
    language: languageSelector(state),
    hazard: hazardTypesSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setPalikaRedirect: params => dispatch(setPalikaRedirectAction(params)),
});

const ModalButton = modalize(Button);

interface InventoryItemProps {
    className?: string;
    data: PageType.Inventory;
    onUpdate?: () => void;
    onDelete?: (itemId: number) => void;
    disabled?: boolean;
    resourceId: number;
}

const InventoryItem = (props: InventoryItemProps) => {
    const {
        className,
        data,
        onUpdate,
        onDelete,
        disabled,
        resourceId,
        palikaRedirect,
        setPalikaRedirect,


    } = props;

    const {
        item,
        quantity,
        description,
        createdOn,
        id,
    } = data;

    const handleDelete = () => {
        if (onDelete) {
            onDelete(id);
        }
    };

    return (
        <div className={_cs(className, styles.inventory)}>
            <TextOutput
                label="Title"
                value={item.title}
            />
            <TextOutput
                label="Category"
                value={item.category}
            />
            {isDefined(quantity) && (
                <TextOutput
                    label="Quantity"
                    value={(
                        <Numeral
                            className={styles.quantity}
                            value={quantity}
                            suffix={item.unit}
                        />
                    )}
                />
            )}
            <TextOutput
                label="Created On"
                value={(
                    <FormattedDate
                        className={styles.createdOn}
                        value={createdOn}
                        mode="yyyy-MM-dd"
                    />
                )}
            />
            <TextOutput
                label="Description"
                value={description || 'No description'}
            />
            <div className={styles.actionButtons}>
                <Cloak hiddenIf={p => !p.change_inventory}>
                    <ModalButton
                        className={styles.button}
                        modal={(
                            <AddInventoryForm
                                onUpdate={onUpdate}
                                value={data}
                                resourceId={resourceId}
                            />
                        )}
                        disabled={disabled}
                        iconName="edit"
                        transparent
                    >
                        Edit
                    </ModalButton>
                </Cloak>
                <Cloak hiddenIf={p => !p.delete_inventory}>
                    <DangerConfirmButton
                        className={styles.button}
                        onClick={handleDelete}
                        disabled={disabled}
                        iconName="delete"
                        transparent
                        confirmationMessage="Are you sure you want to delete this inventory?"
                    >
                        Delete
                    </DangerConfirmButton>
                </Cloak>
            </div>
        </div>
    );
};

const keySelector = (c: PageType.Inventory) => c.id;

interface OwnProps {
    className?: string;
    resourceId: number;
    closeModal?: () => void;
}

interface StateProps {
    hazardTypes: Obj<PageType.HazardType>;
}

interface State {
}

interface Params {
    inventoryId?: number;
}

type Props = NewProps<OwnProps, Params>;

const requests: { [key: string]: ClientAttributes<OwnProps, Params> } = {
    inventoriesGetRequest: {
        url: '/inventory/',
        query: ({ props }) => ({
            resource: props.resourceId,
        }),
        method: methods.GET,
        onMount: true,
    },
    clusterGetRequest: {
        url: '/inventory-cluster/',
        query: ({ props }) => ({
            resource: props.resourceId,
        }),
        method: methods.GET,
        onMount: true,
    },
    categoryGetRequest: {
        url: '/inventory-category/',
        query: ({ props }) => ({
            resource: props.resourceId,
        }),
        method: methods.GET,
        onMount: true,
    },
    unitGetRequest: {
        url: '/inventory-item-unit/',
        query: ({ props }) => ({
            resource: props.resourceId,
        }),
        method: methods.GET,
        onMount: true,
    },
    itemGetRequest: {
        url: '/inventory-item/',
        query: ({ props }) => ({
            resource: props.resourceId,
        }),
        method: methods.GET,
        onMount: true,
    },
    organizationGetRequest: {
        url: '/organization/',
        query: ({ props }) => ({
            resource: props.resourceId,
        }),
        method: methods.GET,
        onMount: true,
    },
    hazardGetRequest: {
        url: '/hazard/',
        query: ({ props }) => ({
            resource: props.resourceId,
        }),
        method: methods.GET,
        onMount: true,
    },
    inventoryDeleteRequest: {
        url: ({ params }) => `/inventory/${params && params.inventoryId}/`,
        method: methods.DELETE,
        onSuccess: ({ props }) => {
            props.requests.inventoriesGetRequest.do();
        },
    },
};

class InventoriesModal extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            selectedCategory: 1,
            selectedCategoryName: 'Inventories',
        };
    }


    private rendererParams = (key: number, data: PageType.Inventory) => ({
        data,
        onUpdate: this.handleRefresh,
        onDelete: this.handleInventoryDelete,
        disabled: this.props.requests.inventoriesGetRequest.pending,
        resourceId: this.props.resourceId,
    })

    private handleRefresh = () => {
        this.props.requests.inventoriesGetRequest.do();
    }

    private handleRefreshCluster = () => {
        this.props.requests.clusterGetRequest.do();
    }

    private handleRefreshCategory = () => {
        this.props.requests.categoryGetRequest.do();
    }

    private handleRefreshUnit = () => {
        this.props.requests.unitGetRequest.do();
    }

    private handleRefreshItem = () => {
        this.props.requests.itemGetRequest.do();
    }

    private handleRefreshOrganization = () => {
        this.props.requests.organizationGetRequest.do();
    }

    private handleInventoryDelete = (id: number) => {
        this.props.requests.inventoryDeleteRequest.do({
            inventoryId: id,
        });
    }

    private handleReturnToPalika = () => {
        const { setPalikaRedirect, palikaRedirect } = this.props;

        setPalikaRedirect({
            showForm: false,
            redirectTo: palikaRedirect.redirectTo,
        });
        ReachRouter.navigate('/drrm-report/',
            { state: { showForm: true }, replace: true });
    };

    private handleClickedDataset = (id, name) => {
        this.setState({
            selectedCategory: id,
            selectedCategoryName: name,
        });
    };

    public render() {
        const {
            className,
            closeModal,
            requests: {
                inventoriesGetRequest: {
                    pending,
                    response,
                },
                clusterGetRequest: {
                    pending: clusterPending,
                    response: clusterResponse,
                },
                categoryGetRequest: {
                    pending: categoryPending,
                    response: categoryResponse,
                },
                unitGetRequest: {
                    pending: unitPending,
                    response: unitResponse,
                },
                itemGetRequest: {
                    pending: itemPending,
                    response: itemResponse,
                },
                hazardGetRequest: {
                    pending: hazardPending,
                    response: hazardResponse,
                },
                organizationGetRequest: {
                    pending: organizationPending,
                    response: organizationResponse,
                },
            },
            resourceId,
            palikaRedirect,
            filterPermissionGranted,
            language: { language },
            hazard,
        } = this.props;
        const { selectedCategory, selectedCategoryName } = this.state;
        let inventoryList: PageType.Inventory[] = [];
        let clusterList = [];
        let categoryList = [];
        let unitList = [];
        // eslint-disable-next-line prefer-const
        let itemList = [];
        let hazardList = [];
        let organizationList = [];
        if (!pending && response) {
            const inventoriesResponse = response as MultiResponse<PageType.Inventory>;
            inventoryList = inventoriesResponse.results;
        }
        if (!clusterPending && clusterResponse) {
            clusterList = clusterResponse.results;
            console.log('This is final cluster pending', clusterList);
        }
        if (!categoryPending && categoryResponse) {
            categoryList = categoryResponse.results;
            console.log('This is final cluster pending', clusterList);
        }
        if (!unitPending && unitResponse) {
            unitList = unitResponse.results;
            console.log('This is final cluster pending', clusterList);
        }
        if (!itemPending && itemResponse) {
            itemList = itemResponse.results;
            console.log('This is final cluster pending', clusterList);
        }
        if (!hazardPending && hazardResponse) {
            hazardList = hazardResponse.results;
        }
        if (!organizationPending && organizationResponse) {
            organizationList = organizationResponse.results;
        }
        console.log('This is inventory', inventoryList);
        console.log('This is cluster list', clusterList);
        console.log('This is categories', categoryList);
        console.log('This is unit list', unitList);
        console.log('This is item list', itemList);
        console.log('This is hazard list', hazardList);
        console.log('This is organization list', organizationList);

        return (
            <Modal className={_cs(styles.inventoriesModal, className)}>
                <ModalHeader
                    title="Inventory Details"
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            onClick={closeModal}
                            title="Close Modal"
                        />
                    )}
                />
                <ModalBody className={styles.modalBody}>
                    <>

                        {/* <ListView
                            className={styles.inventoryList}
                            data={inventoryList}
                            keySelector={keySelector}
                            renderer={InventoryItem}
                            rendererParams={this.rendererParams}
                            pending={pending}
                        /> */}
                        <Translation>
                            {
                                t => (


                                    <div className={styles.buttonGroup}>
                                        <Button
                                            className={selectedCategory === 1 ? styles.active : ''}
                                            onClick={() => this.handleClickedDataset(1, 'Inventories')}
                                        >
                                            {t('Inventories')}

                                        </Button>
                                        <Button
                                            className={selectedCategory === 2 ? styles.active : ''}
                                            onClick={() => this.handleClickedDataset(2, 'StockIn')}
                                        >
                                            {t('StockIn')}

                                        </Button>
                                        <Button
                                            className={selectedCategory === 3 ? styles.active : ''}
                                            onClick={() => this.handleClickedDataset(3, 'StockOut')}
                                        >
                                            {t('StockOut')}

                                        </Button>
                                        <Button
                                            className={selectedCategory === 4 ? styles.active : ''}
                                            onClick={() => this.handleClickedDataset(4, 'Organization')}
                                        >
                                            {t('Organization')}

                                        </Button>
                                        <Button
                                            className={selectedCategory === 5 ? styles.active : ''}
                                            onClick={() => this.handleClickedDataset(5, 'Items')}
                                        >
                                            {t('Items')}

                                        </Button>
                                        <Button
                                            className={selectedCategory === 6 ? styles.active : ''}
                                            onClick={() => this.handleClickedDataset(6, 'Unit')}
                                        >
                                            {t('Unit')}

                                        </Button>
                                        <Button
                                            className={selectedCategory === 7 ? styles.active : ''}
                                            onClick={() => this.handleClickedDataset(7, 'Categories')}
                                        >
                                            {t('Categories')}

                                        </Button>
                                        <Button
                                            className={selectedCategory === 8 ? styles.active : ''}
                                            onClick={() => this.handleClickedDataset(8, 'Clusters')}
                                        >
                                            {t('Clusters')}

                                        </Button>
                                        {/* {selectedCategory !== 1 && filterPermissionGranted
                                            ? (
                                                <Cloak
                                                    hiddenIf={p => !p.add_inventory}
                                                >
                                                    <div className={styles.header}>
                                                        <ModalButton
                                                            className={styles.addButton}
                                                            modal={(
                                                                <AddInventoryForm
                                                                    onUpdate={this.handleRefresh}
                                                                    resourceId={resourceId}
                                                                />
                                                            )}
                                                            iconName="add"
                                                            transparent
                                                            disabled={pending}
                                                        >
                                                            {` New ${selectedCategoryName}`}
                                                        </ModalButton>
                                                    </div>
                                                </Cloak>
                                            )
                                            : ''} */}
                                        {selectedCategory === 4 && filterPermissionGranted
                                            ? (
                                                <Cloak
                                                    hiddenIf={p => !p.add_inventory}
                                                >
                                                    <div className={styles.header}>
                                                        <ModalButton
                                                            className={styles.addButton}
                                                            modal={(
                                                                <AddOrganizationForm
                                                                    onUpdate={this.handleRefreshOrganization}
                                                                    resourceId={resourceId}
                                                                />
                                                            )}
                                                            iconName="add"
                                                            transparent
                                                            disabled={pending}
                                                        >
                                                            {` New ${selectedCategoryName}`}
                                                        </ModalButton>
                                                    </div>
                                                </Cloak>
                                            )
                                            : ''}
                                        {selectedCategory === 5 && filterPermissionGranted
                                            ? (
                                                <Cloak
                                                    hiddenIf={p => !p.add_inventory}
                                                >
                                                    <div className={styles.header}>
                                                        <ModalButton
                                                            className={styles.addButton}
                                                            modal={(
                                                                <AddItemForm
                                                                    onUpdate={this.handleRefreshItem}
                                                                    resourceId={resourceId}
                                                                    unitList={unitList}
                                                                    categoriesList={categoryList}
                                                                    clustersList={clusterList}
                                                                    language={language}
                                                                    hazard={hazardList}
                                                                />
                                                            )}
                                                            iconName="add"
                                                            transparent
                                                            disabled={pending}
                                                        >
                                                            {` New ${selectedCategoryName}`}
                                                        </ModalButton>
                                                    </div>
                                                </Cloak>
                                            )
                                            : ''}
                                        {selectedCategory === 6 && filterPermissionGranted
                                            ? (
                                                <Cloak
                                                    hiddenIf={p => !p.add_inventory}
                                                >
                                                    <div className={styles.header}>
                                                        <ModalButton
                                                            className={styles.addButton}
                                                            modal={(
                                                                <AddUnitForm
                                                                    onUpdate={this.handleRefreshUnit}
                                                                    resourceId={resourceId}
                                                                />
                                                            )}
                                                            iconName="add"
                                                            transparent
                                                            disabled={pending}
                                                        >
                                                            {` New ${selectedCategoryName}`}
                                                        </ModalButton>
                                                    </div>
                                                </Cloak>
                                            )
                                            : ''}
                                        {selectedCategory === 7 && filterPermissionGranted
                                            ? (
                                                <Cloak
                                                    hiddenIf={p => !p.add_inventory}
                                                >
                                                    <div className={styles.header}>
                                                        <ModalButton
                                                            className={styles.addButton}
                                                            modal={(
                                                                <AddCategoryForm
                                                                    onUpdate={this.handleRefreshCategory}
                                                                    resourceId={resourceId}
                                                                />
                                                            )}
                                                            iconName="add"
                                                            transparent
                                                            disabled={pending}
                                                        >
                                                            {` New ${selectedCategoryName}`}
                                                        </ModalButton>
                                                    </div>
                                                </Cloak>
                                            )
                                            : ''}
                                        {selectedCategory === 8 && filterPermissionGranted
                                            ? (
                                                <Cloak
                                                    hiddenIf={p => !p.add_inventory}
                                                >
                                                    <div className={styles.header}>
                                                        <ModalButton
                                                            className={styles.addButton}
                                                            modal={(
                                                                <AddClusterForm
                                                                    onUpdate={this.handleRefreshCluster}
                                                                    resourceId={resourceId}
                                                                />
                                                            )}
                                                            iconName="add"
                                                            transparent
                                                            disabled={pending}
                                                        >
                                                            {` New ${selectedCategoryName}`}
                                                        </ModalButton>
                                                    </div>
                                                </Cloak>
                                            )
                                            : ''}


                                        <TableDataList
                                            selectedCategory={selectedCategory}
                                            language={language}
                                            inventoryList={inventoryList}
                                            onUpdate={this.handleRefresh}
                                            disable={pending}
                                            onDelete={this.handleInventoryDelete}
                                            resourceId={resourceId}
                                            clusterList={clusterList}
                                            categoryList={categoryList}
                                            unitList={unitList}
                                            itemList={itemList}
                                            hazard={hazardList}
                                            organizationList={organizationList}


                                        />

                                    </div>
                                )
                            }
                        </Translation>
                    </>
                    {isDefined(palikaRedirect.inventoryItem)

                        && (
                            <button
                                onClick={this.handleReturnToPalika}
                                type="button"
                            >
                                Close and return to DRRM Report

                            </button>
                        )
                    }


                </ModalBody>
            </Modal>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            InventoriesModal,
        ),
    ),
);
