import React from 'react';
import memoize from 'memoize-one';
import {
    _cs,
    mapToList,
} from '@togglecorp/fujs';

import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

import {
    methods,
    NewProps,
    ClientAttributes,
    createRequestClient,
} from '@togglecorp/react-rest-request';

import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import ListView from '#rscv/List/ListView';

import MapSource from '#re-map/MapSource';
import MapImage from '#re-map/MapImage';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';
import MapShapeEditor from '#re-map/MapShapeEditor';
import { MapChildContext } from '#re-map/context';

import CommonMap from '#components/CommonMap';
import TextOutput from '#components/TextOutput';
import Option from '#components/RadioInput/Option';
import Loading from '#components/Loading';

import {
    getResults,
    isAnyRequestPending,
} from '#utils/request';
import { mapStyles } from '#constants';

import HealthIcon from '#resources/icons/Health-facility.png';
import FinanceIcon from '#resources/icons/Financing.png';
import FoodWarehouseIcon from '#resources/icons/Food-warehouse.png';
// import EducationIcon from '#resources/icons/Education.png';

import {
    ResourceType,
} from '#types';

import {
    Resource,
} from '#store/atom/page/types';

import EditResourceModal from './EditResourceModal';

import styles from './styles.scss';

interface ComponentProps {
    className?: string;
}

interface State {
    resourceLngLat: [number, number] | undefined;
    activeLayerKey: ResourceType | undefined;
    resourceInfo: Resource | undefined;
    openEditModal: boolean;
}

interface ResourceElement {
    key: ResourceType;
    title: string;
}

interface Params {
    resourceId: number;
}

type Props = NewProps<ComponentProps, Params>

const resourceLayerList: ResourceElement[] = [
    // { key: 'education', title: 'Education' },
    { key: 'finance', title: 'Finance' },
    { key: 'health', title: 'Health' },
    { key: 'governance', title: 'Governance' },
];

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
    },
    resourceDetailGetRequest: {
        url: ({ params: { resourceId } }) => `/resource/${resourceId}/`,
        method: methods.GET,
        onMount: false,
    },
};

interface ResourceResponseElement {
    id: number;
    resourceType: ResourceType;
    title: string;
    description?: string;
    point: {
        type: 'string';
        coordinates: [number, number];
        ward: number;
    };
}

const emptyResourceList: ResourceResponseElement[] = [];

interface ResourceTooltipParams extends Resource {
    onEditClick: () => void;
}

const ResourceTooltip = (params: ResourceTooltipParams) => {
    const { onEditClick, ...resourceDetails } = params;

    const { id, point, title, ...resource } = resourceDetails;

    const data = mapToList(resource, (value, key) => ({ label: key, value }));
    const resourceKeySelector = (d: typeof data) => d.label;

    const rendererParams = (_: string, item: Resource) => ({
        className: styles.item,
        labelClassName: styles.label,
        valueClassName: styles.value,
        ...item,
    });

    return (
        <div className={styles.resourceTooltip}>
            <h3 className={styles.heading}>
                {title}
            </h3>
            <ListView
                data={data}
                keySelector={resourceKeySelector}
                renderer={TextOutput}
                rendererParams={rendererParams}
            />
            <PrimaryButton
                title="Edit"
                onClick={onEditClick}
            >
                Edit
            </PrimaryButton>
        </div>
    );
};

class CapacityAndResources extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            activeLayerKey: undefined,
            resourceLngLat: undefined,
            resourceInfo: undefined,
            openEditModal: false,
            resourceListInsidePolygon: [],
        };
    }

    private getGeojson = memoize((resourceList: ResourceResponseElement[]) => {
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

    private getLayerRendererParams = (key, layer) => ({
        optionKey: key,
        label: layer.title,
        onClick: this.handleLayerClick,
        isActive: this.state.activeLayerKey === key,
    })

    private handleClusterClick = (feature: unknown, lngLat: [number, number]) => {
        const { properties: { cluster_id: clusterId }, source } = feature;
        const { map } = this.context;

        if (source) {
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
            resourceLngLat: lngLat,
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

    private handleLayerClick = (layerKey) => {
        this.setState({ activeLayerKey: layerKey });

        this.props.requests.resourceGetRequest.do({
            resourceType: layerKey,
        });
    }

    private handleLayerUnselect = () => {
        this.setState({ activeLayerKey: undefined });
    }

    private handlePolygonCreate = (features) => {
        const { requests } = this.props;
        const resourceList = getResults(requests, 'resourceGetRequest', emptyResourceList) as ResourceResponseElement[];

        const resourceListInsidePolygon = resourceList.filter(
            (d => booleanPointInPolygon(d.point, features[0].geometry)),
        );

        this.setState({ resourceListInsidePolygon });
    }

    private handlePolygonUpdate = (features) => {
        const { requests } = this.props;
        const resourceList = getResults(requests, 'resourceGetRequest', emptyResourceList) as ResourceResponseElement[];
        // console.warn('Create', features, resourceList);

        const resourceListInsidePolygon = resourceList.filter(
            (d => booleanPointInPolygon(d.point, features[0].geometry)),
        );

        this.setState({ resourceListInsidePolygon });
    }

    private handleEditClick = () => {
        this.setState({
            openEditModal: true,
            resourceLngLat: undefined,
        });
    }

    private handleCloseModal = () => {
        this.setState({
            openEditModal: false,
        });
    }

    public render() {
        const {
            className,
            requests,
        } = this.props;

        const { activeLayerKey } = this.state;
        const resourceList = getResults(requests, 'resourceGetRequest', emptyResourceList) as ResourceResponseElement[];
        const {
            resourceDetailGetRequest: {
                response,
            },
        } = requests;
        const geojson = this.getGeojson(resourceList);

        const pending = isAnyRequestPending(requests);
        const {
            openEditModal,
            resourceLngLat,
            resourceInfo,
            resourceListInsidePolygon,
        } = this.state;

        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 20,
        };

        let resourceDetails: Resource | undefined;
        if (response) {
            resourceDetails = response as Resource;
        }

        return (
            <>
                <Loading pending={pending} />
                <div className={_cs(styles.capacityAndResources, className)}>
                    <header className={styles.header}>
                        <h2 className={styles.heading}>
                            Layers
                        </h2>
                        <DangerButton
                            disabled={!activeLayerKey}
                            onClick={this.handleLayerUnselect}
                            className={styles.clearButton}
                            transparent
                        >
                            Clear
                        </DangerButton>
                    </header>
                    <div className={styles.content}>
                        <ListView
                            data={resourceLayerList}
                            keySelector={d => d.key}
                            renderer={Option}
                            rendererParams={this.getLayerRendererParams}
                        />
                        { resourceListInsidePolygon.length !== 0 && (
                            <div className={styles.polygonSelectedLayerInfo}>
                                { resourceListInsidePolygon.length }
                            </div>
                        )}
                    </div>
                    { openEditModal && resourceDetails && (
                        <EditResourceModal
                            resourceId={resourceDetails.id}
                            resourceType={activeLayerKey}
                            resourceDetails={resourceDetails}
                            closeModal={this.handleCloseModal}
                        />
                    )}
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
                    { activeLayerKey && (
                        <>
                            <MapShapeEditor
                                onCreate={this.handlePolygonCreate}
                                onUpdate={this.handlePolygonUpdate}
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
                                            {...resourceInfo}
                                            {...resourceDetails}
                                            onEditClick={this.handleEditClick}
                                        />
                                    </MapTooltip>
                                )}
                            </MapSource>
                        </>
                    )}
                </div>
            </>
        );
    }
}

CapacityAndResources.contextType = MapChildContext;
export default createRequestClient(requestOptions)(CapacityAndResources);
