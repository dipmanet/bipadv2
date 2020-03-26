import React from 'react';
import { compose } from 'redux';
import {
    _cs,
    isTruthy,
} from '@togglecorp/fujs';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import Button from '#rsca/Button';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';
import LoadingAnimation from '#rscv/LoadingAnimation';
import Table from '#rscv/Table';
import modalize from '#rscg/Modalize';
import Cloak from '#components/Cloak';

import * as PageType from '#store/atom/page/types';
import { Header } from '#store/atom/table/types';

import AddFamilyLossModal from './AddFamilyLossModal';
import styles from './styles.scss';

const ModalButton = modalize(Button);

interface FamilyLoss {
    id: number;
    loss: number;
    name: string;
    createdOn: string;
    modifiedOn: string;
    belowPoverty?: boolean;
    phoneNumber?: number;
    verified?: number;
    count?: number;
    status?: 'missing' | 'dead' | 'injured' | 'affected';
}

interface ExtraHeader {
    // FIXME: Not sure what to put here
    actions?: string;
}

interface State {
    list: FamilyLoss[];
}

interface OwnProps {
    className?: string;
    lossServerId: number;
}

interface Params {
    onAddFailure?: (faramErrors: object) => void;
    onListGet?: (list: [FamilyLoss]) => void;
    onListItemRemove?: (listItem: number) => void;
    itemId?: number;
}

const keySelector = (d: PageType.Field) => d.id;

type Props = NewProps<OwnProps, Params>;

const requests: { [key: string]: ClientAttributes<OwnProps, Params>} = {
    listRequest: {
        url: '/loss-family/',
        query: ({ props: { lossServerId } }) => ({
            loss: lossServerId,
        }),
        onMount: true,
        method: methods.GET,
        onSuccess: ({ params: { onListGet }, response }) => {
            if (onListGet) {
                onListGet(response.results);
            }
        },
    },
    listItemRemoveRequest: {
        url: ({ params: { itemId } }) => `/loss-family/${itemId}/`,
        method: methods.DELETE,
        onSuccess: ({ params: { onListItemRemove, itemId } }) => {
            if (onListItemRemove) {
                onListItemRemove(itemId);
            }
        },
    },
};

class FamilyLossList extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const {
            requests: {
                listRequest,
            },
        } = this.props;

        listRequest.setDefaultParams({
            onListGet: this.handleListGet,
        });

        this.headers = [
            {
                key: 'name',
                label: 'Name',
                order: 1,
            },
            {
                key: 'phoneNumber',
                label: 'Phone Number',
                order: 3,
            },
            {
                key: 'belowPoverty',
                label: 'Below Poverty',
                order: 5,
                modifier: row => (row.belowPoverty ? 'Yes' : 'No'),
            },
            {
                key: 'status',
                label: 'Status',
                order: 6,
            },
            {
                key: 'verified',
                label: 'Verified',
                order: 5,
                modifier: row => (isTruthy(row.verified) ? String(row.verified) : 'N/A'),
            },
            {
                key: 'actions',
                label: 'Actions',
                order: 7,
                modifier: (row) => {
                    const {
                        id: rowKey,
                    } = row;

                    return (
                        <div className={styles.actionButton}>
                            <Cloak hiddenIf={p => !p.delete_family}>
                                <DangerConfirmButton
                                    iconName="delete"
                                    confirmationMessage="Are you sure you want to delete this item?"
                                    onClick={() => this.handleItemRemove(rowKey)}
                                />
                            </Cloak>
                        </div>
                    );
                },
            },
        ];

        this.state = {
            list: [],
        };
    }

    private headers: Header<FamilyLoss & ExtraHeader>[];

    private handleListGet = (list: FamilyLoss[]) => {
        this.setState({ list });
    }

    private handleListItemAdd = (listItem: FamilyLoss) => {
        const { list } = this.state;
        const newList = [
            ...list,
            listItem,
        ];
        this.setState({ list: newList });
    }

    private handleListItemRemoveSuccess = (itemId: number) => {
        const { list } = this.state;
        const itemIndex = list.findIndex((l: FamilyLoss) => l.id === itemId);

        if (itemIndex === -1) {
            return;
        }

        const newList = [...list];
        newList.splice(itemIndex, 1);

        this.setState({ list: newList });
    }

    private handleItemRemove = (rowKey: number) => {
        const { requests: { listItemRemoveRequest } } = this.props;

        listItemRemoveRequest.do({
            itemId: rowKey,
            onListItemRemove: this.handleListItemRemoveSuccess,
        });
    }

    public render() {
        const {
            className,
            lossServerId,
            requests: {
                listRequest: {
                    pending: listPending,
                },
                listItemRemoveRequest: {
                    pending: itemRemovePending,
                },
            },
        } = this.props;

        const { list } = this.state;
        const pending = listPending || itemRemovePending;

        return (
            <div className={_cs(styles.listContainer, className)}>
                {pending && <LoadingAnimation />}
                <header className={styles.header}>
                    <h2 className={styles.heading}>
                        Family Loss
                    </h2>
                    <Cloak hiddenIf={p => !p.add_family}>
                        <ModalButton
                            className={styles.button}
                            iconName="add"
                            modal={(
                                <AddFamilyLossModal
                                    lossServerId={lossServerId}
                                    onAddSuccess={this.handleListItemAdd}
                                />
                            )}
                        >
                            Add Family Loss
                        </ModalButton>
                    </Cloak>
                </header>
                <Table
                    className={styles.table}
                    headers={this.headers}
                    data={list}
                    keySelector={keySelector}
                />
            </div>
        );
    }
}

export default compose(createRequestClient(requests))(FamilyLossList);
