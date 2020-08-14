import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import produce from 'immer';
import memoize from 'memoize-one';
import { MapboxGeoJSONFeature } from 'mapbox-gl';
import {
    _cs,
    isDefined,
    mapToList,
} from '@togglecorp/fujs';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import { resourceTypeListSelector } from '#selectors';

import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';
import DangerButton from '#rsca/Button/DangerButton';
import AccentButton from '#rsca/Button/AccentButton';
import ListView from '#rsu/../v2/View/ListView';

import { Draw } from '#re-map/type';
import MapSource from '#re-map/MapSource';
import MapImage from '#re-map/MapImage';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';
import MapShapeEditor from '#re-map/MapShapeEditor';
import { MultiResponse } from '#store/atom/response/types';
import { MapChildContext } from '#re-map/context';

import Cloak, { getParams } from '#components/Cloak';
import TextOutput from '#components/TextOutput';
import Option from '#components/RadioInput/Option';
import Loading from '#components/Loading';

import { mapStyles } from '#constants';

import HealthIcon from '#resources/icons/Health-facility.png';
import FinanceIcon from '#resources/icons/Financing.png';
import FoodWarehouseIcon from '#resources/icons/Food-warehouse.png';

import { ResourceTypeKeys } from '#types';
import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';

import CapacityResourceTable from './CapacityResourceTable';
import InventoriesModal from './InventoriesModal';
import AddResourceForm from './AddResourceForm';
import SwitchView from './SwitchView';
import styles from './styles.scss';

const TableModalButton = modalize(Button);

const AccentModalButton = modalize(AccentButton);

const camelCaseToSentence = (text: string) => {
    const result = text.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

    return finalResult;
};

interface ResourceTooltipProps extends PageType.Resource {
    onEditClick: () => void;
    onShowInventoryClick: () => void;
}

type toggleValues = 'education' | 'health' | 'finance' | 'governance' |
'tourism' | 'cultural' | 'industry' | 'communication';

const ResourceTooltip = (props: ResourceTooltipProps) => {
    const { onEditClick, onShowInventoryClick, ...resourceDetails } = props;

    const { id, point, title, ...resource } = resourceDetails;

    const data = mapToList(
        resource,
        (value, key) => ({ label: key, value }),
    );

    const resourceKeySelector = (d: typeof data) => d.label;

    const rendererParams = (_: string, item: PageType.Resource) => ({
        className: styles.item,
        labelClassName: styles.label,
        valueClassName: styles.value,
        ...item,
        label: camelCaseToSentence(item.label),
    });

    return (
        <div className={styles.resourceTooltip}>
            <h3 className={styles.heading}>
                {title}
            </h3>
            <ListView
                className={styles.content}
                data={data}
                keySelector={resourceKeySelector}
                renderer={TextOutput}
                rendererParams={rendererParams}
            />
            <div className={styles.actions}>
                <AccentButton
                    title="Edit"
                    onClick={onEditClick}
                    transparent
                    className={styles.editButton}
                >
                    Edit data
                </AccentButton>
                <AccentButton
                    title="Show Inventory"
                    onClick={onShowInventoryClick}
                    transparent
                    className={styles.editButton}
                >
                    Show Inventory
                </AccentButton>
            </div>
        </div>
    );
};

interface ComponentProps {
    className?: string;
}

interface State {
    resourceLngLat: [number, number] | undefined;
    activeLayerKey: ResourceTypeKeys | undefined;
    resourceInfo: PageType.Resource | undefined;
    showResourceForm: boolean;
    showInventoryModal: boolean;
    selectedFeatures: MapboxGeoJSONFeature[] | undefined;
    resourceList: PageType.Resource[];
    resourceCollection: {
        education: PageType.Resource[];
        health: PageType.Resource[];
        finance: PageType.Resource[];
        governance: PageType.Resource[];
        tourism: PageType.Resource[];
        cultural: PageType.Resource[];
        industry: PageType.Resource[];
        communication: PageType.Resource[];
    };
    activeLayersIndication: {
        education: boolean;
        health: boolean;
        finance: boolean;
        governance: boolean;
        tourism: boolean;
        cultural: boolean;
        industry: boolean;
        communication: boolean;
    };
}

interface PropsFromState {
    resourceTypeList: PageType.ResourceType[];
}

interface Params {
    resourceType?: string;
    resourceId?: number;
    coordinates?: [number, number][];
    setResourceList?: (resources: PageType.Resource[]) => void;
    setIndividualResourceList?: (key: toggleValues, resources: PageType.Resource[]) => void;
}

type Props = NewProps<ComponentProps & PropsFromState, Params>

const mapStateToProps = (state: AppState): PropsFromState => ({
    resourceTypeList: resourceTypeListSelector(state),
});

const requestOptions: { [key: string]: ClientAttributes<Props, Params>} = {
    resourceGetRequest: {
        url: '/resource/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => {
            if (!params || !params.resourceType) {
                return undefined;
            }

            return {
                // eslint-disable-next-line @typescript-eslint/camelcase
                resource_type: params.resourceType,
                limit: 99999,
            };
        },
        onSuccess: ({ params, response }) => {
            const resources = response as MultiResponse<PageType.Resource>;
            if (params && params.setResourceList && params.setIndividualResourceList) {
                params.setResourceList(resources.results);
                if (params.resourceType) {
                    params.setIndividualResourceList(params.resourceType, resources.results);
                }
            }
        },
    },
    resourceDetailGetRequest: {
        url: ({ params }) => {
            if (!params || !params.resourceId) {
                return '';
            }
            return `/resource/${params.resourceId}/`;
        },
        method: methods.GET,
        onMount: false,
    },
    polygonResourceDetailGetRequest: {
        url: '/resource/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => {
            if (!params || !params.coordinates || !params.resourceType) {
                return undefined;
            }

            return {
                format: 'json',
                // eslint-disable-next-line @typescript-eslint/camelcase
                resource_type: params.resourceType,
                meta: true,
                boundary: JSON.stringify({
                    type: 'Polygon',
                    coordinates: params.coordinates,
                }),
            };
        },
    },
};

class CapacityAndResources extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        const {
            requests: {
                resourceGetRequest,
            },
        } = this.props;
        resourceGetRequest.setDefaultParams(
            { setResourceList: this.setResourceList,
                setIndividualResourceList: this.setIndividualResourceList },
        );

        this.state = {
            activeLayerKey: undefined,
            resourceLngLat: undefined,
            resourceInfo: undefined,
            showResourceForm: false,
            showInventoryModal: false,
            selectedFeatures: undefined,
            resourceList: [],
            resourceCollection: {
                education: [],
                health: [],
                finance: [],
                governance: [],
                tourism: [],
                cultural: [],
                industry: [],
                communication: [],
            },
            activeLayersIndication: {
                education: false,
                health: false,
                finance: false,
                governance: false,
                tourism: false,
                cultural: false,
                industry: false,
                communication: false,
            },
        };
    }

    private handleToggleClick = (key: toggleValues, value: boolean) => {
        const { activeLayersIndication, resourceCollection } = this.state;
        const temp = { ...activeLayersIndication };
        temp[key] = value;
        this.setState({ activeLayersIndication: temp });
        console.log(`${key}: ${temp[key]}`);
        if (temp[key] && resourceCollection[key].length === 0) {
            this.props.requests.resourceGetRequest.do({
                resourceType: key,
            });
        }
    }

    private getUserParams = memoize(getParams);

    private setResourceList = (resourceList: PageType.Resource[]) => {
        this.setState({ resourceList });
    }

    private setIndividualResourceList = (key: toggleValues, resourceList: PageType.Resource[]) => {
        const { resourceCollection } = this.state;
        const temp = { ...resourceCollection };
        temp[key] = resourceList;
        this.setState({ resourceCollection: temp });
        console.log(this.state.resourceCollection);
    }

    private handleResourceAdd = (resource: PageType.Resource) => {
        const {
            resourceList,
        } = this.state;
        const newResourceList = [
            resource,
            ...resourceList,
        ];
        this.setState({ resourceList: newResourceList });
    }

    private handleResourceEdit = (resourceId: PageType.Resource['id'], resource: PageType.Resource) => {
        const {
            resourceList,
        } = this.state;

        const newResourceList = produce(resourceList, (safeResourceList) => {
            const index = resourceList.findIndex(r => r.id === resourceId);
            if (index !== -1) {
                // eslint-disable-next-line no-param-reassign
                safeResourceList[index] = resource;
            }
        });

        this.setState({ resourceList: newResourceList });
    }

    private getGeojson = memoize((resourceList: PageType.Resource[]) => {
        const geojson = {
            type: 'FeatureCollection',
            features: resourceList.map(r => ({
                type: 'Feature',
                geometry: r.point,
                properties: r,
            })),
        };

        return geojson;
    })

    private getLayerRendererParams = (key: ResourceTypeKeys, layer: PageType.ResourceType) => ({
        optionKey: key,
        label: key,
        onClick: this.handleLayerClick,
        isActive: this.state.activeLayerKey === key,
    })

    private handleClusterClick = (feature: unknown, lngLat: [number, number]) => {
        const { properties: { cluster_id: clusterId }, source } = feature;
        const { map } = this.context;

        if (source && map && clusterId) {
            map
                .getSource(source)
                .getClusterExpansionZoom(clusterId, (error: string, zoom: number) => {
                    if (!error) {
                        map.flyTo({ center: lngLat, zoom });
                    }
                });
        }
    }

    private handleResourceMouseEnter = () => {}

    private handleResourceClick = (feature: unknown, lngLat: [number, number]) => {
        const { properties: { id, title, description, ward, resourceType, point } } = feature;
        const { coordinates } = JSON.parse(point);
        const { map } = this.context;

        if (coordinates && map) {
            map.flyTo({
                center: coordinates,
                zoom: 10,
            });
        }

        const {
            requests: {
                resourceDetailGetRequest,
            },
        } = this.props;

        if (!id) {
            return;
        }

        resourceDetailGetRequest.do({
            resourceId: id,
        });

        this.setState({
            resourceLngLat: coordinates,
            resourceInfo: {
                id,
                title,
                description,
                ward,
                resourceType,
                point,
            },
        });
    }

    private handleTooltipClose = () => {
        this.setState({
            resourceLngLat: undefined,
            resourceInfo: undefined,
        });
    }

    private handleLayerClick = (layerKey: ResourceTypeKeys) => {
        this.setState({
            activeLayerKey: layerKey,
            showResourceForm: false,
            showInventoryModal: false,
        });

        this.props.requests.resourceGetRequest.do({
            resourceType: layerKey,
        });
    }

    private handleLayerUnselect = () => {
        const { map } = this.context;
        const nepalBounds = [
            80.05858661752784, 26.347836996368667,
            88.20166918432409, 30.44702867091792,
        ];
        map.fitBounds(nepalBounds);
        // this.setState({ activeLayerKey: undefined });
        this.setState({
            activeLayerKey: undefined,
            activeLayersIndication: {
                education: false,
                health: false,
                finance: false,
                governance: false,
                tourism: false,
                cultural: false,
                industry: false,
                communication: false,
            },
        });
    }

    private handlePolygonCreate = (features: MapboxGeoJSONFeature[], draw: Draw) => {
        const {
            requests: {
                polygonResourceDetailGetRequest,
            },
        } = this.props;

        const { activeLayerKey, selectedFeatures } = this.state;

        if (selectedFeatures && selectedFeatures[0].id) {
            draw.delete(selectedFeatures[0].id);
        }

        polygonResourceDetailGetRequest.do({
            coordinates: features[0].geometry.coordinates,
            resourceType: activeLayerKey,
        });

        this.setState({
            selectedFeatures: features,
        });
    }

    private handlePolygonUpdate = (features: MapboxGeoJSONFeature[], draw: Draw) => {
        const {
            requests: {
                polygonResourceDetailGetRequest,
            },
        } = this.props;

        const { activeLayerKey, selectedFeatures } = this.state;

        if (selectedFeatures && selectedFeatures[0].id) {
            draw.delete(selectedFeatures[0].id);
        }

        polygonResourceDetailGetRequest.do({
            coordinates: features[0].geometry.coordinates,
            resourceType: activeLayerKey,
        });

        this.setState({
            selectedFeatures: features,
        });
    }

    private handlePolygonDelete = (_: MapboxGeoJSONFeature[]) => {
        this.setState({
            selectedFeatures: undefined,
        });
    }

    private handleEditClick = () => {
        this.setState({
            showResourceForm: true,
            resourceLngLat: undefined,
        });
    }

    private handleShowInventoryClick = () => {
        this.setState({
            showInventoryModal: true,
            resourceLngLat: undefined,
        });
    }

    private handleEditResourceFormCloseButtonClick = () => {
        this.setState({
            showResourceForm: false,
        });
    }

    private handleInventoryModalClose = () => {
        this.setState({
            showInventoryModal: false,
        });
    }

    public render() {
        const {
            className,
            requests,
            resourceTypeList,
        } = this.props;
        const {
            activeLayerKey,
            showResourceForm,
            showInventoryModal,
            resourceLngLat,
            resourceInfo,
            selectedFeatures,
            resourceList,
            activeLayersIndication,
            resourceCollection,
        } = this.state;

        const {
            resourceDetailGetRequest: {
                response,
                pending: resourceDetailPending,
            },
            resourceGetRequest: {
                pending: resourceGetPending,
            },
            polygonResourceDetailGetRequest: {
                pending: polygonResourceGetPending,
            },
        } = requests;

        let resourceDetails: PageType.Resource | undefined;
        if (response) {
            resourceDetails = response as PageType.Resource;
        }

        const pending = resourceDetailPending
            || resourceGetPending
            || polygonResourceGetPending;

        // const geojson = this.getGeojson(resourceList);
        const geojson = this.getGeojson(resourceCollection.education);
        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 10,
        };
        return (
            <>
                <Loading pending={pending} />
                <div className={_cs(styles.capacityAndResources, className)}>
                    <header className={styles.header}>
                        <h2 className={styles.heading}>
                            Layers
                        </h2>
                        <div className={styles.actions}>
                            <Cloak hiddenIf={p => !p.add_resource}>
                                <AccentModalButton
                                    iconName="add"
                                    title="Add New Resource"
                                    transparent
                                    modal={(
                                        <AddResourceForm
                                            onAddSuccess={this.handleResourceAdd}
                                            onEditSuccess={this.handleResourceEdit}
                                        />
                                    )}
                                >
                                    Add Resource
                                </AccentModalButton>
                            </Cloak>
                            <DangerButton
                                // disabled={!activeLayerKey}
                                disabled={!Object.values(activeLayersIndication).some(Boolean)
                                    && !activeLayerKey}
                                onClick={this.handleLayerUnselect}
                                className={styles.clearButton}
                                transparent
                            >
                                Clear
                            </DangerButton>
                            {/*
                            <SummaryButton
                                transparent
                                className={styles.summaryButton}
                                disabled={!(isTruthy(activeLayerKey) && !polygonSelectPending)}
                                modal={(
                                    <Summary
                                        data={polygonResources}
                                        resourceType={activeLayerKey}
                                    />
                                )}
                            >
                                Show summary
                            </SummaryButton>
                            */}
                            <TableModalButton
                                modal={(
                                    <CapacityResourceTable
                                        data={resourceList}
                                        name={activeLayerKey}
                                    />
                                )}
                                initialShowModal={false}
                                iconName="table"
                                transparent
                                disabled={pending || !activeLayerKey}
                            />
                        </div>
                    </header>
                    <SwitchView
                        activeLayersIndication={activeLayersIndication}
                        handleToggleClick={this.handleToggleClick}
                    />
                    <ListView
                        className={styles.content}
                        data={resourceTypeList}
                        keySelector={d => d.title}
                        renderer={Option}
                        rendererParams={this.getLayerRendererParams}
                    />
                    {/* resourceListInsidePolygon.length !== 0 && (
                        <div className={styles.polygonSelectedLayerInfo}>
                            { resourceListInsidePolygon.length }
                        </div>
                    ) */}
                    <MapImage
                        url={HealthIcon}
                        name="health"
                    />
                    <MapImage
                        url={FinanceIcon}
                        name="finance"
                    />
                    <MapImage
                        url={FoodWarehouseIcon}
                        name="governance"
                    />
                    { Object.values(activeLayersIndication).some(Boolean) && (
                        <>
                            <MapShapeEditor
                                geoJsons={selectedFeatures}
                                onCreate={this.handlePolygonCreate}
                                onUpdate={this.handlePolygonUpdate}
                                onDelete={this.handlePolygonDelete}
                                drawOptions={{
                                    displayControlsDefault: false,
                                    controls: {
                                        polygon: true,
                                        trash: true,
                                    },
                                }}
                            />
                            <MapSource
                                sourceKey="resource-symbol"
                                sourceOptions={{
                                    type: 'geojson',
                                    cluster: true,
                                    clusterMaxZoom: 10,
                                }}
                                geoJson={geojson}
                            >
                                <MapLayer
                                    layerKey="cluster"
                                    onClick={this.handleClusterClick}
                                    layerOptions={{
                                        type: 'circle',
                                        paint: mapStyles.resourceCluster.circle,
                                        filter: ['has', 'point_count'],
                                    }}
                                />
                                <MapLayer
                                    layerKey="cluster-count"
                                    layerOptions={{
                                        type: 'symbol',
                                        filter: ['has', 'point_count'],
                                        layout: {
                                            'text-field': '{point_count_abbreviated}',
                                            'text-size': 12,
                                        },
                                    }}
                                />
                                <MapLayer
                                    layerKey="resource-symbol-background"
                                    onClick={this.handleResourceClick}
                                    onMouserEnter={this.handleResourceMouseEnter}
                                    layerOptions={{
                                        type: 'circle',
                                        filter: ['!', ['has', 'point_count']],
                                        paint: mapStyles.resourcePoint.circle,
                                    }}
                                />
                                <MapLayer
                                    layerKey="-resourece-symbol-icon"
                                    layerOptions={{
                                        type: 'symbol',
                                        filter: ['!', ['has', 'point_count']],
                                        layout: {
                                            'icon-image': activeLayerKey,
                                            'icon-size': 0.03,
                                        },
                                    }}
                                />
                                { resourceLngLat && resourceInfo && (
                                    <MapTooltip
                                        coordinates={resourceLngLat}
                                        tooltipOptions={tooltipOptions}
                                        onHide={this.handleTooltipClose}
                                    >
                                        <ResourceTooltip
                                            // FIXME: hide tooltip edit if there is no permission
                                            {...resourceInfo}
                                            {...resourceDetails}
                                            onEditClick={this.handleEditClick}
                                            onShowInventoryClick={this.handleShowInventoryClick}
                                        />
                                    </MapTooltip>
                                )}
                            </MapSource>
                        </>
                    )}
                </div>
                { showResourceForm && resourceDetails && (
                    <AddResourceForm
                        resourceId={resourceDetails.id}
                        resourceDetails={resourceDetails}
                        onEditSuccess={this.handleResourceEdit}
                        closeModal={this.handleEditResourceFormCloseButtonClick}
                    />
                )}
                {showInventoryModal
                    && isDefined(resourceDetails)
                    && isDefined(resourceDetails.id)
                    && (
                        <InventoriesModal
                            resourceId={resourceDetails.id}
                            closeModal={this.handleInventoryModalClose}
                        />
                    )
                }
            </>
        );
    }
}

CapacityAndResources.contextType = MapChildContext;
export default compose(
    connect(mapStateToProps),
    createRequestClient(requestOptions),
)(CapacityAndResources);
