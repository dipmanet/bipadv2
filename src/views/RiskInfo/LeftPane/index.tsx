import React from 'react';
import {
    _cs,
    listToGroupList,
    listToMap,
} from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
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
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import { AttributeKey } from '#types';
import { Layer, LayerMap, LayerGroup } from '#store/atom/page/types';
import {
    getResults,
    isAnyRequestPending,
} from '#utils/request';
import {
    generatePaint,
    getLayerHierarchy,
} from '#utils/domain';
import {
    incidentListSelectorIP,
    filtersSelector,
    hazardTypesSelector,
    regionsSelector,
} from '#selectors';
import {
    setIncidentListActionIP,
    setEventListAction,
    SetLayersAction,
    SetLayerGroupsAction,
} from '#actionCreators';
import { AppState } from '#store/types';
import styles from './styles.scss';
import Details from './Details';
import Overview from './Overview';

interface PropsFromDispatch {
    setIncidentList: typeof setIncidentListActionIP;
    setEventList: typeof setEventListAction;
}
interface PropsFromAppState {
    incidentList: PageType.Incident[];
    filters: FiltersElement;
    hazardTypes: Obj<PageType.HazardType>;
    regions: {
        provinces: object;
        districts: object;
        municipalities: object;
        wards: object;
    };
}
interface OwnProps {
    className?: string;
    handleCarActive: Function;
    handleActiveLayerIndication: Function;
    handleDroneImage: Function;
    setResourceId: Function;
    droneImagePending: boolean;
}

interface Params {
    setLayerMap?: (layerMap: LayerMap) => void;
    setLayerGroup?: (layerGroupList: LayerGroup[]) => void;
}

interface State {
    activeAttribute: AttributeKey | undefined;
}

type Props = NewProps<OwnProps, Params>;
const mapStateToProps = (state: AppState): PropsFromAppState => ({
    incidentList: incidentListSelectorIP(state),
    hazardTypes: hazardTypesSelector(state),
    regions: regionsSelector(state),
    filters: filtersSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setIncidentList: params => dispatch(setIncidentListActionIP(params)),
    setEventList: params => dispatch(setEventListAction(params)),
    setLayers: params => dispatch(SetLayersAction(params)),
    setLayerGroup: params => dispatch(SetLayerGroupsAction(params)),

});
const requestOptions: { [key: string]: ClientAttributes<OwnProps, Params> } = {
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
    'capacity-and-resources': 'Capacity and Resources',
    'climate-change': 'Climate change',
};
let layerGroupListRedux;
let layerListRedux;

class RiskInfoLeftPane extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            activeAttribute: getHashFromBrowser() as AttributeKey,
        };
    }

    public componentDidUpdate() {
        const { setLayers, setLayerGroup } = this.props;

        setLayers(layerListRedux);
        setLayerGroup(layerGroupListRedux);
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
        const { setAddResource, addResource } = this.context;
        if (addResource) {
            setAddResource(false);
        } else {
            this.setState({ activeAttribute: undefined });
            setHashToBrowser(undefined);
        }
    }

    public render() {
        const {
            className,
            requests,
            handleCarActive,
            handleActiveLayerIndication,
            handleDroneImage,
            setResourceId,
            droneImagePending,
        } = this.props;

        const { activeAttribute } = this.state;


        const layerGroupList = getResults(requests, 'layerGroupGetRequest');
        const pending = isAnyRequestPending(requests);

        const layerList = getResults(requests, 'layerGetRequest');
        const groupedLayers = this.getGroupedLayers(layerList, layerGroupList);
        layerGroupListRedux = layerGroupList;
        layerListRedux = layerList;
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
                            <Translation>
                                {
                                    t => (
                                        <h2 className={styles.heading}>
                                            {t(`Risk Info / ${attributeNames[activeAttribute]}`)}
                                        </h2>
                                    )
                                }
                            </Translation>

                        </>
                    ) : (
                        <>
                            <Translation>
                                {
                                    t => (
                                        <h2 className={styles.heading}>
                                            {t('Risk Info')}
                                        </h2>
                                    )
                                }
                            </Translation>

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
                            handleCarActive={handleCarActive}
                            handleActiveLayerIndication={handleActiveLayerIndication}
                            handleDroneImage={handleDroneImage}
                            setResourceId={setResourceId}
                            droneImagePending={droneImagePending}
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
RiskInfoLeftPane.contextType = RiskInfoLayerContext;

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<OwnProps>(),
    createRequestClient(requestOptions),
)(RiskInfoLeftPane);
