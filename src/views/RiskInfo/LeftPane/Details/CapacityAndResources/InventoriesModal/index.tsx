/* eslint-disable max-len */
import React from 'react';
import { _cs, Obj, isDefined } from '@togglecorp/fujs';

import { connect } from 'react-redux';
import * as ReachRouter from '@reach/router';
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
import { Translation } from 'react-i18next';
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
import { languageSelector, palikaRedirectSelector } from '#selectors';


import { MultiResponse } from '#store/atom/response/types';


import AddInventoryForm from './AddInventoryForm';
import styles from './styles.scss';
import TableDataList from './TableDataList';

const mapStateToProps = (state, props) => ({
    palikaRedirect: palikaRedirectSelector(state),
    language: languageSelector(state),
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
            },
            resourceId,
            palikaRedirect,
            filterPermissionGranted,
            language: { language },
        } = this.props;
        const { selectedCategory, selectedCategoryName } = this.state;
        let inventoryList: PageType.Inventory[] = [];
        if (!pending && response) {
            const inventoriesResponse = response as MultiResponse<PageType.Inventory>;
            inventoryList = inventoriesResponse.results;
        }

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
                                            onClick={() => this.handleClickedDataset(2, 'Items')}
                                        >
                                            {t('Items')}

                                        </Button>
                                        <Button
                                            className={selectedCategory === 3 ? styles.active : ''}
                                            onClick={() => this.handleClickedDataset(3, 'Clusters')}
                                        >
                                            {t('Clusters')}

                                        </Button>
                                        <Button
                                            className={selectedCategory === 4 ? styles.active : ''}
                                            onClick={() => this.handleClickedDataset(4, 'Categories')}
                                        >
                                            {t('Categories')}

                                        </Button>
                                        <Button
                                            className={selectedCategory === 5 ? styles.active : ''}
                                            onClick={() => this.handleClickedDataset(5, 'Organization')}
                                        >
                                            {t('Organization')}

                                        </Button>
                                        {filterPermissionGranted
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
                                            : ''}


                                        <TableDataList
                                            selectedCategory={selectedCategory}
                                            language={language}
                                            inventoryList={inventoryList}
                                            onUpdate={this.handleRefresh}
                                            disable={pending}
                                            onDelete={this.handleInventoryDelete}
                                            resourceId={resourceId}

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
