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

import * as PageType from '#store/atom/page/types';
import { Header } from '#store/atom/table/types';

import AddPeopleLoss from './AddPeopleLoss';
import styles from './styles.scss';

const ModalButton = modalize(Button);

interface PeopleLoss {
    id: number;
    loss: number;
    name: string;
    createdOn: string;
    modifiedOn: string;
    belowPoverty?: boolean;
    disability?: boolean;
    gender: 'male' | 'female' | 'other';
    count?: number;
    status?: 'missing' | 'dead' | 'injured' | 'affected';
    age?: number;
}

interface ExtraHeader {
    // FIXME: Not sure what to put here
    actions?: string;
}

interface State {
    list: PeopleLoss[];
}

interface OwnProps {
    className?: string;
    lossServerId: number;
}

interface Params {
    onAddFailure?: (faramErrors: object) => void;
    onListGet?: (list: [PeopleLoss]) => void;
    onListItemRemove?: (listItem: number) => void;
    itemId?: number;
}

const keySelector = (d: PageType.Field) => d.id;

type Props = NewProps<OwnProps, Params>;

const requests: { [key: string]: ClientAttributes<OwnProps, Params>} = {
    listRequest: {
        url: '/loss-people/',
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
        url: ({ params: { itemId } }) => `/loss-people/${itemId}/`,
        method: methods.DELETE,
        onSuccess: ({ params: { onListItemRemove, itemId } }) => {
            if (onListItemRemove) {
                onListItemRemove(itemId);
            }
        },
    },
};

class PeopleLossList extends React.PureComponent<Props, State> {
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
                key: 'age',
                label: 'Age',
                order: 2,
            },
            {
                key: 'gender',
                label: 'Gender',
                order: 3,
            },
            {
                key: 'disability',
                label: 'Disability',
                order: 4,
                modifier: row => (isTruthy(row.disability) ? row.disability : 'N/A'),
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
                key: 'actions',
                label: 'Actions',
                order: 7,
                modifier: (row) => {
                    const {
                        id: rowKey,
                    } = row;

                    return (
                        <div className={styles.actionButton}>
                            <DangerConfirmButton
                                iconName="delete"
                                confirmationMessage="Are you sure you want to delete this item?"
                                onClick={() => this.handleItemRemove(rowKey)}
                            />
                        </div>
                    );
                },
            },
        ];

        this.state = {
            list: [],
        };
    }

    private headers: Header<PeopleLoss & ExtraHeader>[];

    private handleListGet = (list: PeopleLoss[]) => {
        this.setState({ list });
    }

    private handleListItemAdd = (listItem: PeopleLoss) => {
        const { list } = this.state;
        const newList = [
            ...list,
            listItem,
        ];
        this.setState({ list: newList });
    }

    private handleListItemRemoveSuccess = (itemId: number) => {
        const { list } = this.state;
        const itemIndex = list.findIndex((l: PeopleLoss) => l.id === itemId);

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
                        People Loss
                    </h2>
                    <ModalButton
                        className={styles.button}
                        iconName="add"
                        modal={(
                            <AddPeopleLoss
                                lossServerId={lossServerId}
                                onAddSuccess={this.handleListItemAdd}
                            />
                        )}
                    >
                        Add People Loss
                    </ModalButton>
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

export default compose(createRequestClient(requests))(PeopleLossList);
