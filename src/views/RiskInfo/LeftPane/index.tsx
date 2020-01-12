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

import Button from '#rsca/Button';

import Loading from '#components/Loading';
import { getHashFromBrowser } from '#rscg/HashManager';

import { MultiResponse } from '#store/atom/response/types';
import { AttributeKey } from '#types';
import { Layer, LayerMap, LayerGroup } from '#store/atom/page/types';
import Overview from './Overview';
import Details from './Details';

import styles from './styles.scss';

interface OwnProps {
    className?: string;
    onViewChange: (key: AttributeKey | undefined) => void;
}

interface Params {
    setLayerMap?: (layerMap: LayerMap) => void;
    setLayerGroup?: (layerGroupList: LayerGroup[]) => void;
}

interface State {
    layerMap: LayerMap | {};
    layerGroupList: LayerGroup[];
    activeAttribute: AttributeKey | undefined;
}

type Props = NewProps<OwnProps, Params>;

const requests: { [key: string]: ClientAttributes<OwnProps, Params>} = {
    layersGetRequest: {
        url: '/layer/?expand=group',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params: { setLayerMap } = { setLayerMap: undefined } }) => {
            const { results } = response as MultiResponse<Layer>;
            if (setLayerMap) {
                setLayerMap(listToGroupList(results, d => d.category));
            }
        },
    },
    layerGroupGetRequest: {
        url: '/layer-group/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params: { setLayerGroup } = { setLayerGroup: undefined } }) => {
            const { results } = response as MultiResponse<LayerGroup>;
            if (setLayerGroup) {
                setLayerGroup(results);
            }
        },
    },
};

const attributeNames = {
    hazard: 'Hazard',
    exposure: 'Exposure',
    vulnerability: 'Vulnerability',
    risk: 'Risk',
    'capacity-and-resources': 'Capacity & resources',
    'climate-change': 'Climate change',
};

class RiskInfoLeftPane extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            layerMap: {},
            layerGroupList: [],
            activeAttribute: getHashFromBrowser(),
        };

        const {
            requests: {
                layersGetRequest,
                layerGroupGetRequest,
            },
        } = this.props;

        layersGetRequest.setDefaultParams({
            setLayerMap: (layerMap: LayerMap) => {
                this.setState({
                    layerMap,
                });
            },
        });

        layerGroupGetRequest.setDefaultParams({
            setLayerGroup: (layerGroupList: LayerGroup[]) => {
                this.setState({
                    layerGroupList,
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
            layerGroupList,
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
                <header className={styles.header}>
                    {activeAttribute ? (
                        <>
                            <Button
                                className={styles.backButton}
                                onClick={this.handleDetailsBackButtonClick}
                                iconName="back"
                                transparent
                            />
                            <h2 className={styles.heading}>
                                { attributeNames[activeAttribute] }
                            </h2>
                        </>
                    ) : (
                        <h2 className={styles.heading}>
                            Select an attribute to get started
                        </h2>
                    )}
                </header>
                <div className={styles.content}>
                    <Overview
                        titleShown={!activeAttribute}
                        className={styles.overview}
                        onAttributeClick={this.handleAttributeClick}
                        activeAttribute={activeAttribute}
                    />
                    {activeAttribute && (
                        <Details
                            className={styles.detail}
                            attribute={activeAttribute}
                            layerMap={layerMap}
                            layerGroupList={layerGroupList}
                            activeView={activeAttribute}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default createConnectedRequestCoordinator<OwnProps>()(
    createRequestClient(requests)(RiskInfoLeftPane),
);
