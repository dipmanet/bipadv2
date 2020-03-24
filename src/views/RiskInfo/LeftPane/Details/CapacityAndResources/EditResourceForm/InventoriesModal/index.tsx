import React from 'react';
import { _cs, Obj, isDefined } from '@togglecorp/fujs';
// import { connect } from 'react-redux';

import modalize from '#rscg/Modalize';
import FormattedDate from '#rscv/FormattedDate';
import Button from '#rsca/Button';
import ListView from '#rscv/List/ListView';
// import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import Numeral from '#rscv/Numeral';
import ModalHeader from '#rscv/Modal/Header';

import Cloak from '#components/Cloak';

import * as PageType from '#store/atom/page/types';
// import { AppState } from '#store/types';
import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
/*
import {
    hazardTypesSelector,
} from '#selectors';
 */

// import alertIcon from '#resources/icons/Alert.svg';

import { MultiResponse } from '#store/atom/response/types';


import AddInventoryForm from './AddInventoryForm';
import styles from './styles.scss';

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


    /*
            <ModalButton
                modal={(
                    AddInventoryForm
                        value={data}
                    />
                )}
            >
                Edit
            </ModalButton>
    */

    return (
        <div className={_cs(className, styles.inventory)}>
            <div className={styles.title}>
                {item.title}
            </div>
            <div className={styles.category}>
                {item.category}
            </div>
            {isDefined(quantity) && (
                <Numeral
                    className={styles.quantity}
                    value={quantity}
                    suffix={item.unit}
                />
            )}
            <div className={styles.description}>
                {description || 'No description'}
            </div>
            <FormattedDate
                className={styles.createdOn}
                value={createdOn}
                mode="yyyy-MM-dd"
            />
            <Cloak hiddenIf={p => !p.change_inventory}>
                <ModalButton
                    modal={(
                        <AddInventoryForm
                            onUpdate={onUpdate}
                            value={data}
                            resourceId={resourceId}
                        />
                    )}
                    disabled={disabled}
                >
                    Edit
                </ModalButton>
            </Cloak>
            <Cloak hiddenIf={p => !p.delete_inventory}>
                <Button
                    onClick={handleDelete}
                    disabled={disabled}
                >
                    Delete
                </Button>
            </Cloak>
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

// type ReduxProps = OwnProps & StateProps;

interface State {
}

interface Params {
    inventoryId?: number;
}

type Props = NewProps<OwnProps, Params>;

const requests: { [key: string]: ClientAttributes<OwnProps, Params>} = {
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
    /*
    public constructor(props: Props) {
        super(props);
        this.state = {};
    }
    */

    private rendererParams = (key: number, data: PageType.Inventory) => ({
        data,
        onUpdate: this.handleRefresh,
        onDelete: this.handleInventoryDelete,
        disabled: this.props.requests.inventoriesGetRequest.pending,
        resourceId: this.props.resourceId,
        // hazardTypes: this.props.hazardTypes,
    })

    private handleRefresh = () => {
        this.props.requests.inventoriesGetRequest.do();
    }

    private handleInventoryDelete = (id: number) => {
        this.props.requests.inventoryDeleteRequest.do({
            inventoryId: id,
        });
    }

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
        } = this.props;

        let inventoryList: PageType.Inventory[] = [];
        if (!pending && response) {
            const inventoriesResponse = response as MultiResponse<PageType.Inventory>;
            inventoryList = inventoriesResponse.results;
        }

        return (
            <Modal className={_cs(styles.inventoriesModal, className)}>
                <ModalHeader
                    title="Inventories"
                    rightComponent={(
                        <Button
                            iconName="close"
                            onClick={closeModal}
                            title="Close modal"
                            transparent
                        />
                    )}
                />
                <ModalBody className={styles.modalBody}>
                    <Cloak hiddenIf={p => !p.add_inventory}>
                        <ModalButton
                            modal={(
                                <AddInventoryForm
                                    onUpdate={this.handleRefresh}
                                    // value={data}
                                    resourceId={resourceId}
                                />
                            )}
                            disabled={pending}
                        >
                            Add
                        </ModalButton>
                    </Cloak>
                    <ListView
                        className={styles.inventoryList}
                        data={inventoryList}
                        keySelector={keySelector}
                        renderer={InventoryItem}
                        rendererParams={this.rendererParams}
                        pending={pending}
                    />
                </ModalBody>
            </Modal>
        );
    }
}

/*
const mapStateToProps = (state: AppState): StateProps => ({
    hazardTypes: hazardTypesSelector(state),
});
*/


export default createRequestClient(requests)(
    InventoriesModal,
);

/*
export default connect(mapStateToProps)(
    createRequestClient(requests)(
        InventoriesModal,
    ),
);
*/
