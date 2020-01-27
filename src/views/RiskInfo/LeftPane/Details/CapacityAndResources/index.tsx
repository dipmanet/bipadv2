import React from 'react';
import memoize from 'memoize-one';
import {
    _cs,
    mapToList,
} from '@togglecorp/fujs';

import {
    methods,
    NewProps,
    ClientAttributes,
    createRequestClient,
} from '@togglecorp/react-rest-request';

import DangerButton from '#rsca/Button/DangerButton';
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

import styles from './styles.scss';

interface ComponentProps {
    className?: string;
}

interface ResourceDetails {
    id: number;
    title: string;
    ['string']: string | object | number;
}

interface State {
    resourceLngLat: [number, number] | undefined;
    activeLayerKey: ResourceType | undefined;
    resourceInfo: ResourceDetails | undefined;
}

interface ResourceElement {
    key: ResourceType;
    title: string;
}

interface Params {
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
interface Resource {
    label: string;
    value: number | string | object;
}

const emptyResourceList: ResourceResponseElement[] = [];
const resourceKeySelector = (d: Resource) => d.label;

const ResourceTooltip = (resourceDetails: ResourceDetails) => {
    const { id, point, title, ...resource } = resourceDetails;
    const data = mapToList(resource, (value, key) => ({ label: key, value }));

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

    private handleResourceClick = (feature: unknown, lngLat: [number, number]) => {
        const { properties: { id, title, description, ward } } = feature;

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
                title,
                description,
                ward,
            },
        });
    }

    private handleTooltipClose = () => {
        this.setState({
            resourceLngLat: undefined,
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

    public render() {
        const {
            className,
            requests,
        } = this.props;

        const { activeLayerKey } = this.state;
        const sourceList = getResults(requests, 'resourceGetRequest', emptyResourceList) as ResourceResponseElement[];
        const {
            resourceDetailGetRequest: {
                response: resourceDetails,
            },
        } = requests;
        const geojson = this.getGeojson(sourceList);

        const pending = isAnyRequestPending(requests);
        const {
            resourceLngLat,
            resourceInfo,
        } = this.state;

        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 20,
        };

        return (
            <>
                <Loading pending={pending} />
                <div className={_cs(styles.capacityAndResources, className)}>
                    <CommonMap sourceKey="capacity-and-resources" />
                    <header className={styles.header}>
                        <h4 className={styles.heading}>
                            Layers
                        </h4>
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
                    </div>
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
                    <MapShapeEditor />
                    { activeLayerKey && (
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
                            { resourceLngLat && (
                                <MapTooltip
                                    coordinates={resourceLngLat}
                                    tooltipOptions={tooltipOptions}
                                    onHide={this.handleTooltipClose}
                                >
                                    <ResourceTooltip
                                        {...resourceInfo}
                                        {...resourceDetails}
                                    />
                                </MapTooltip>
                            )}
                        </MapSource>
                    )}
                </div>
            </>
        );
    }
}
CapacityAndResources.contextType = MapChildContext;
export default createRequestClient(requestOptions)(CapacityAndResources);
