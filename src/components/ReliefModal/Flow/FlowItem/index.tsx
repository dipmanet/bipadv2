import React from 'react';
import { _cs } from '@togglecorp/fujs';

import DateOutput from '#components/DateOutput';
import TextOutput from '#components/TextOutput';
import modalize from '#rscg/Modalize';
import AccentButton from '#rsca/Button/AccentButton';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';

import { Flow } from '#types';

import AddFlowForm from '../AddFlowForm';
import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import styles from './styles.scss';


const ModalAccentButton = modalize(AccentButton);

interface OwnProps{
    className?: string;
    onUpdate: () => void;
    data: Flow;
}
interface State {}

interface Params {}

type Props = NewProps<OwnProps, Params>;
const requestOptions: { [key: string]: ClientAttributes<OwnProps, Params>} = {
    reliefFlowDeleteRequest: {
        url: ({ props: { data: { id } } }) => `/relief-flow/${id}/`,
        method: methods.DELETE,
        onSuccess: ({ props }) => {
            if (props.onUpdate) {
                props.onUpdate();
            }
        },
    },
};

class FlowItem extends React.PureComponent<Props, State> {
    private handleFlowDelete = () => {
        const { requests: { reliefFlowDeleteRequest } } = this.props;
        reliefFlowDeleteRequest.do();
    }

    public render() {
        const {
            data,
            onUpdate,
            requests: {
                reliefFlowDeleteRequest: {
                    pending,
                },
            },
            className,
        } = this.props;

        const {
            type,
            amount,
            date,
            description,
            receiverOrganization,
            providerOrganization,
            event,
            fiscalYear,
        } = data;

        return (
            <div className={_cs(className, styles.flowItem)}>
                <div className={styles.basicDetails}>
                    <TextOutput
                        label="type"
                        value={type}
                    />
                    <TextOutput
                        label="Amount"
                        value={amount}
                    />
                    <TextOutput
                        label="Received By"
                        value={receiverOrganization}
                    />
                    <TextOutput
                        label="Provided By"
                        value={providerOrganization}
                    />
                </div>
                <div className={styles.eventDetails}>
                    <TextOutput
                        label="Event"
                        value={event}
                    />
                    <DateOutput
                        value={date}
                    />
                    <TextOutput
                        label="Fiscal Year"
                        value={fiscalYear}
                    />
                </div>
                <div className={styles.description}>
                    {description}
                </div>
                <div className={styles.actions}>
                    <ModalAccentButton
                        transparent
                        iconName="edit"
                        modal={(
                            <AddFlowForm
                                value={data}
                                onUpdate={onUpdate}
                            />
                        )}
                    >
                        Edit
                    </ModalAccentButton>
                    <DangerConfirmButton
                        iconName="delete"
                        confirmationMessage="Are you sure you want to delete this relief flow?"
                        onClick={this.handleFlowDelete}
                        pending={pending}
                        transparent
                    >
                        Delete
                    </DangerConfirmButton>
                </div>
            </div>
        );
    }
}

export default createRequestClient(requestOptions)(
    FlowItem,
);
