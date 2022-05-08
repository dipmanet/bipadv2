import React from 'react';
import { compose } from 'redux';
import {
    _cs,
    isTruthy,
} from '@togglecorp/fujs';

import { connect } from 'react-redux';
import { Translation } from 'react-i18next';
import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import ModalBody from '#rscv/Modal/Body';
import Button from '#rsca/Button';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';
import LoadingAnimation from '#rscv/LoadingAnimation';
import Table from '#rscv/Table';
import modalize from '#rscg/Modalize';
import Cloak from '#components/Cloak';

import * as PageType from '#store/atom/page/types';
import { Header } from '#store/atom/table/types';

import AddPeopleLoss from './AddPeopleLoss';
import styles from './styles.scss';
import { languageSelector } from '#selectors';

const mapStateToProps = state => ({
    language: languageSelector(state),
});

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
            language: { language },
        } = this.props;

        listRequest.setDefaultParams({
            onListGet: this.handleListGet,
        });

        this.headers = [
            {
                key: 'name',
                label: language === 'en' ? 'Name' : 'नाम',
                order: 1,
            },
            {
                key: 'age',
                label: language === 'en' ? 'Age' : 'उमेर',
                order: 2,
            },
            {
                key: 'gender',
                label: language === 'en' ? 'Gender' : 'लिङ्ग',
                order: 3,
            },
            {
                key: 'disability',
                label: language === 'en' ? 'Disability' : 'असक्षमता',
                order: 4,
                modifier: row => (isTruthy(row.disability) ? String(row.disability) : 'N/A'),
            },
            {
                key: 'belowPoverty',
                label: language === 'en' ? 'Below Poverty' : 'गरिबी मुनि',
                order: 5,
                modifier: row => (row.belowPoverty ? 'Yes' : 'No'),
            },
            {
                key: 'status',
                label: language === 'en' ? 'Status' : 'स्थिति',
                order: 6,
            },
            {
                key: 'actions',
                label: language === 'en' ? 'Actions' : 'कार्यहरू',
                order: 7,
                modifier: (row) => {
                    const {
                        id: rowKey,
                    } = row;

                    return (
                        <Translation>
                            {
                                t => (
                                    <div className={styles.actionButton}>
                                        <Cloak hiddenIf={p => !p.delete_people}>
                                            <DangerConfirmButton
                                                iconName="delete"
                                                confirmationMessage={t('Are you sure you want to delete this item?')}
                                                onClick={() => this.handleItemRemove(rowKey)}
                                            />
                                        </Cloak>
                                    </div>
                                )
                            }
                        </Translation>

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
            <Translation>
                {
                    t => (
                        <ModalBody className={_cs(styles.listContainer, className)}>
                            {pending && <LoadingAnimation />}
                            <header className={styles.header}>
                                <div className={styles.heading} />
                                <Cloak hiddenIf={p => !p.add_people}>
                                    <ModalButton
                                        className={styles.button}
                                        iconName="add"
                                        transparent
                                        modal={(
                                            <AddPeopleLoss
                                                lossServerId={lossServerId}
                                                onAddSuccess={this.handleListItemAdd}
                                            />
                                        )}
                                    >
                                        {t('Add People Loss')}
                                    </ModalButton>
                                </Cloak>
                            </header>
                            <Table
                                className={styles.table}
                                headers={this.headers}
                                data={list}
                                keySelector={keySelector}
                            />
                        </ModalBody>
                    )
                }
            </Translation>

        );
    }
}

export default connect(mapStateToProps)(compose(createRequestClient(requests))(PeopleLossList));
