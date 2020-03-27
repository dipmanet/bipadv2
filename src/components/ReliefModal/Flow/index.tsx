import React from 'react';
import { _cs } from '@togglecorp/fujs';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import Cloak from '#components/Cloak';
import LoadingAnimation from '#rscv/LoadingAnimation';
import ListView from '#rscv/List/ListView';
import AccentButton from '#rsca/Button/AccentButton';
import modalize from '#rscg/Modalize';

import { Flow } from '#types';
import { MultiResponse } from '#store/atom/response/types';

import FlowItem from './FlowItem';
import AddFlowForm from './AddFlowForm';

import styles from './styles.scss';

interface OwnProps {
    onUpdate?: () => void;
    className?: string;
}

interface State {
}

interface Params {
    body?: object;
}
const ModalAccentButton = modalize(AccentButton);

const requestOptions: { [key: string]: ClientAttributes<OwnProps, Params>} = {
    reliefFlowGetRequest: {
        url: '/relief-flow/',
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
            className,
        } = this.props;

        let flowList: Flow[] = [];
        if (!pending && response) {
            const flowResponse = response as MultiResponse<Flow>;
            flowList = flowResponse.results;
        }

        return (
            <div className={_cs(className, styles.flow)}>
                { pending && <LoadingAnimation />}
                <header className={styles.header}>
                    <h3 className={styles.heading}>
                        Flows
                    </h3>
                    <Cloak hiddenIf={p => !p.add_flow}>
                        <ModalAccentButton
                            className={styles.addFlowButton}
                            title="Add Flow"
                            iconName="add"
                            transparent
                            modal={(
                                <AddFlowForm
                                    onUpdate={this.handleReliefFlowChange}
                                />
                            )}
                        >
                            New Flow
                        </ModalAccentButton>
                    </Cloak>
                </header>
                <ListView
                    className={styles.content}
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
