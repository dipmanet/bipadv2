import React from 'react';
import {
    _cs,
    listToGroupList,
} from '@togglecorp/fujs';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
    createConnectedRequestCoordinator,
} from '#request';

import Loading from '#components/Loading';

import { MultiResponse } from '#store/atom/response/types';
import { AttributeKey } from '#types';
import { Layer, LayerMap } from '#store/atom/page/types';
import Overview from './Overview';
import Details from './Details';

import styles from './styles.scss';

interface OwnProps {
    className?: string;
    onViewChange: (key: AttributeKey | undefined) => void;
}

interface Params {
    setLayerMap: (layerMap: LayerMap) => void;
}

interface State {
    layerMap: LayerMap | {};
    activeAttribute: AttributeKey | undefined;
}

type Props = NewProps<OwnProps, Params>;

const requests: { [key: string]: ClientAttributes<OwnProps, Params>} = {
    layersGetRequest: {
        url: '/layer/?expand=group',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params: { setLayerMap } = { setLayerList: undefined } }) => {
            const { results } = response as MultiResponse<Layer>;
            if (setLayerMap) {
                setLayerMap(listToGroupList(results, d => d.category));
            }
        },
    },
};

class RiskInfoLeftPane extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            layerMap: {},
            activeAttribute: 'hazard',
        };

        const {
            requests: {
                layersGetRequest,
            },
        } = this.props;

        layersGetRequest.setDefaultParams({
            setLayerMap: (layerMap: LayerMap) => {
                this.setState({
                    layerMap,
                });
            },
        });
    }

    private handleAttributeClick = (key: AttributeKey) => {
        const {
            onViewChange,
        } = this.props;

        this.setState({ activeAttribute: key });
        onViewChange(key);
    }

    private handleDetailsBackButtonClick = () => {
        const {
            onViewChange,
        } = this.props;

        this.setState({ activeAttribute: undefined });
        onViewChange(undefined);
    }

    public render() {
        const {
            className,
            requests: {
                layersGetRequest: {
                    pending,
                },
            },
        } = this.props;

        const {
            layerMap,
            activeAttribute,
        } = this.state;

        return (
            <div className={
                _cs(
                    styles.leftPane,
                    className,
                    activeAttribute && styles.hasActiveAttribute,
                )}
            >
                <Loading pending={pending} />
                <Overview
                    titleShown={!activeAttribute}
                    className={styles.overview}
                    onAttributeClick={this.handleAttributeClick}
                />
                {activeAttribute && (
                    <Details
                        className={styles.content}
                        attribute={activeAttribute}
                        layerMap={layerMap}
                        onBackButtonClick={this.handleDetailsBackButtonClick}
                    />
                )}
            </div>
        );
    }
}

export default createConnectedRequestCoordinator<OwnProps>()(
    createRequestClient(requests)(RiskInfoLeftPane),
);
