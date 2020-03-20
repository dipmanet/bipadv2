import React from 'react';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import LoadingAnimation from '#rscv/LoadingAnimation';
import ListView from '#rscv/List/ListView';
import Button from '#rsca/Button';
import modalize from '#rscg/Modalize';

import { Flow } from '#types';
import { MultiResponse } from '#store/atom/response/types';

import FlowItem from './FlowItem';
import AddFlowForm from './AddFlowForm';

import styles from './styles.scss';

interface OwnProps {
    onUpdate?: () => void;
}

interface State {
}

interface Params {
    body?: object;
}
const ModalButton = modalize(Button);

const requestOptions: { [key: string]: ClientAttributes<OwnProps, Params>} = {
    reliefFlowGetRequest: {
        url: '/relief-flow',
        method: methods.GET,
        onMount: true,
    },
};

type Props = NewProps<OwnProps, Params>;
const flowKeySelector = (flow: Flow) => flow.id;

class ReliefFlow extends React.PureComponent<Props, State> {
    private getFlowRendererParams = (_: number, flow: Flow) => ({
        data: flow,
        onUpdate: this.handleReliefFlowChange,
    });

    private handleReliefFlowChange = () => {
        const { requests: { reliefFlowGetRequest } } = this.props;
        reliefFlowGetRequest.do();
    }

    public render() {
        const {
            requests: {
                reliefFlowGetRequest: {
                    response,
                    pending,
                },
            },
        } = this.props;

        let flowList: Flow[] = [];
        if (!pending && response) {
            const flowResponse = response as MultiResponse<Flow>;
            flowList = flowResponse.results;
        }

        return (
            <div>
                <div>
                    <header>
                        <h3>Flows</h3>
                        <ModalButton
                            title="Add Flow"
                            iconName="add"
                            transparent
                            modal={(
                                <AddFlowForm
                                    onUpdate={this.handleReliefFlowChange}
                                />
                            )}
                        >
                            Add Flow
                        </ModalButton>
                    </header>
                </div>
                { pending && <LoadingAnimation />}
                <ListView
                    data={flowList}
                    keySelector={flowKeySelector}
                    renderer={FlowItem}
                    rendererParams={this.getFlowRendererParams}
                />
            </div>
        );
    }
}

export default createRequestClient(requestOptions)(ReliefFlow);
