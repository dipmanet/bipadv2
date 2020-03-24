import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { MapboxGeoJSONFeature } from 'mapbox-gl';
import {
    _cs,
    mapToList,
} from '@togglecorp/fujs';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    resourceTypeListSelector,
} from '#selectors';

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
import { MapChildContext } from '#re-map/context';

import Cloak from '#components/Cloak';
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

import { ResourceTypeKeys } from '#types';
import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';

import EditResourceForm from './EditResourceForm';

// import Summary from './Summary';
import CapacityResourceTable from './CapacityResourceTable';
import AddResourceForm from './AddResourceForm';
import styles from './styles.scss';

// const SummaryButton = modalize(AccentButton);
const TableModalButton = modalize(Button);

const AccentModalButton = modalize(AccentButton);

const camelCaseToSentence = (text: string) => {
    const result = text.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

    return finalResult;
};

const emptyResourceList: PageType.Resource[] = [];

interface ResourceTooltipProps extends PageType.Resource {
    onEditClick: () => void;
}

const ResourceTooltip = (props: ResourceTooltipProps) => {
    const { onEditClick, ...resourceDetails } = props;

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
            </div>
        </div>
    );
};


/*
const resourceLayerList: ResourceElement[] = [
    // { key: 'education', title: 'Education' },
    { key: 'finance', title: 'Finance' },
    { key: 'health', title: 'Health' },
    { key: 'governance', title: 'Governance' },
];

interface ResourceElement {
    key: ResourceTypeKeys;
    title: string;
}
*/

interface ComponentProps {
    className?: string;
}

interface State {
    resourceLngLat: [number, number] | undefined;
    activeLayerKey: ResourceTypeKeys | undefined;
    resourceInfo: PageType.Resource | undefined;
    showResourceForm: boolean;
    selectedFeatures: MapboxGeoJSONFeature[] | undefined;
}

interface PropsFromState {
    resourceTypeList: PageType.ResourceType[];
}

interface Params {
    resourceType?: string;
    resourceId?: number;
    coordinates?: [number, number][];
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

        this.state = {
            activeLayerKey: undefined,
            resourceLngLat: undefined,
            resourceInfo: undefined,
            showResourceForm: false,
            selectedFeatures: undefined,
        };
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
        this.setState({ activeLayerKey: undefined });
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

    private handleEditResourceFormCloseButtonClick = () => {
        this.setState({
            showResourceForm: false,
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
            resourceLngLat,
            resourceInfo,
            selectedFeatures,
        } = this.state;

        const resourceList = getResults(
            requests,
            'resourceGetRequest',
            emptyResourceList,
        ) as PageType.Resource[];

        /*
        const polygonResources = getResults(
            requests,
            'polygonResourceDetailGetRequest',
            emptyResourceList,
        ) as PageType.Resource[];
         */

        let resourceDetails: PageType.Resource | undefined;
        const {
            resourceDetailGetRequest: {
                response,
            },
        } = requests;
        if (response) {
            resourceDetails = response as PageType.Resource;
        }

        const pending = isAnyRequestPending(requests);

        const geojson = this.getGeojson(resourceList);

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
                                        <AddResourceForm />
                                    )}
                                >
                                    Add Resource
                                </AccentModalButton>
                            </Cloak>
                            <DangerButton
                                disabled={!activeLayerKey}
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
                    { activeLayerKey && (
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
                { showResourceForm && resourceDetails && (
                    <EditResourceForm
                        resourceId={resourceDetails.id}
                        resourceType={activeLayerKey}
                        resourceDetails={resourceDetails}
                        onCloseButtonClick={this.handleEditResourceFormCloseButtonClick}
                    />
                )}
            </>
        );
    }
}

CapacityAndResources.contextType = MapChildContext;
export default compose(
    connect(mapStateToProps),
    createRequestClient(requestOptions),
)(CapacityAndResources);
