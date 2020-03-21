import React from 'react';

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


const ModalAccentButton = modalize(AccentButton);

interface OwnProps{
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
            <div>
                <div>
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
                <div>
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
                <div>
                    {description}
                </div>
                <div>
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
