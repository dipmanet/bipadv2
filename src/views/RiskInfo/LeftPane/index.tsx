import React from 'react';
import {
    _cs,
    listToGroupList,
    listToMap,
} from '@togglecorp/fujs';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
    createConnectedRequestCoordinator,
} from '#request';

import Button from '#rsca/Button';

import CommonMap from '#components/CommonMap';
import Loading from '#components/Loading';
import {
    setHashToBrowser,
    getHashFromBrowser,
} from '#rscg/HashManager';

import { MultiResponse } from '#store/atom/response/types';
import { AttributeKey } from '#types';
import { Layer, LayerMap, LayerGroup } from '#store/atom/page/types';
import {
    getResults,
    isAnyRequestPending,
} from '#utils/request';

import Overview from './Overview';
import Details from './Details';

import styles from './styles.scss';

interface OwnProps {
    className?: string;
}

interface Params {
    setLayerMap?: (layerMap: LayerMap) => void;
    setLayerGroup?: (layerGroupList: LayerGroup[]) => void;
}

interface State {
    activeAttribute: AttributeKey | undefined;
}

type Props = NewProps<OwnProps, Params>;

const requestOptions: { [key: string]: ClientAttributes<OwnProps, Params>} = {
    layerGetRequest: {
        url: '/layer/',
        method: methods.GET,
        onMount: true,
    },
    layerGroupGetRequest: {
        url: '/layer-group/',
        method: methods.GET,
        onMount: true,
        query: {
            expand: [
                'metadata',
            ],
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
            activeAttribute: getHashFromBrowser() as AttributeKey,
        };
    }

    private getGroupedLayers = (layerList: Layer[], layerGroupList: LayerGroup[]) => {
        if (layerList.length === 0 || layerGroupList.length === 0) {
            return {};
        }

        const layerGroupMap = listToMap(layerGroupList, d => d.id, d => d);
        const groupExpandedLayerList = layerList.map((d) => {
            const group = d.group ? layerGroupMap[d.group] : undefined;
            const fullName = (group && group.title) ? `${group.title} / ${d.title}` : undefined;

            return {
                ...d,
                group,
                fullName,
            };
        });

        const groupedLayerList = listToGroupList(
            groupExpandedLayerList,
            d => d.category,
        );

        return groupedLayerList;
    }

    private handleAttributeClick = (key: AttributeKey) => {
        this.setState({ activeAttribute: key });
        setHashToBrowser(key);
    }

    private handleDetailsBackButtonClick = () => {
        this.setState({ activeAttribute: undefined });
        setHashToBrowser(undefined);
    }

    public render() {
        const {
            className,
            requests,
        } = this.props;

        const { activeAttribute } = this.state;

        const layerList = getResults(requests, 'layerGetRequest');
        const layerGroupList = getResults(requests, 'layerGroupGetRequest');
        const pending = isAnyRequestPending(requests);

        const groupedLayers = this.getGroupedLayers(layerList, layerGroupList);

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
                                Risk info / &nbsp;
                                { attributeNames[activeAttribute] }
                            </h2>
                        </>
                    ) : (
                        <>
                            <h2 className={styles.heading}>
                                Risk info
                            </h2>
                            <CommonMap sourceKey="risk-info" />
                        </>
                    )}
                </header>
                <div className={styles.content}>
                    {activeAttribute && (
                        <Details
                            className={styles.detail}
                            attribute={activeAttribute}
                            layerMap={groupedLayers}
                            layerGroupList={layerGroupList}
                            activeView={activeAttribute}
                        />
                    )}
                    <Overview
                        titleShown={!activeAttribute}
                        className={styles.overview}
                        onAttributeClick={this.handleAttributeClick}
                        activeAttribute={activeAttribute}
                    />
                </div>
            </div>
        );
    }
}

export default createConnectedRequestCoordinator<OwnProps>()(
    createRequestClient(requestOptions)(RiskInfoLeftPane),
);
