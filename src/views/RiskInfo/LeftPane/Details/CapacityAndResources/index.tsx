/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-nested-ternary */
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
import {
    // setRegionAction,
    setFiltersAction,
    setCarKeysAction,
} from '#actionCreators';
import {
    // pastDaysToDateRange,
    transformRegionToFilter,
} from '#utils/transformations';

import {
    resourceTypeListSelector,
    authStateSelector,
    filtersSelectorDP,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    carKeysSelector,
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
import OpenspaceMetaDataModal from './OpenspaceModals/OpenspaceMetaDataModal';
import CommunityMetaDataModal from './OpenspaceModals/CommunityMetaDataModal';
import AllOpenspacesModal from './OpenspaceModals/AllOpenspacesModal';
import AllCommunitySpaceModal from './OpenspaceModals/AllCommunitySpaceModal';
import SingleOpenspaceDetails from './OpenspaceModals/OpenspaceDetailsModal/index';
import CommunityOpenspaceDetails from './OpenspaceModals/CommunitySpaceDetails';
import PolygonBoundaryCommunity from './OpenspaceModals/PolygonCommunitySpace/main';
import PolygonBoundary from './OpenspaceModals/PolygonOpenSpace/main';
import styles from './styles.scss';
import '#resources/openspace-resources/humanitarian-fonts.css';


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
    handleShowOpenspaceDetailsClick: () => void;
    handleShowCommunitypaceDetails: () => void;
    authenticated: boolean;
}

type toggleValues =
    | 'education'
    | 'health'
    | 'finance'
    | 'governance'
    | 'tourism'
    | 'cultural'
    | 'industry'
    | 'communication'
    | 'openspace'
    | 'communityspace';

const initialActiveLayersIndication = {
    education: false,
    health: false,
    finance: false,
    governance: false,
    tourism: false,
    cultural: false,
    industry: false,
    communication: false,
    openspace: false,
    communityspace: false,
};

const ResourceTooltip = (props: ResourceTooltipProps) => {
    const { onEditClick, onShowInventoryClick, ...resourceDetails } = props;

    const { id, point, title, ...resource } = resourceDetails;


    const data = mapToList(
        resource,
        (value, key) => ({ label: key, value }),
    );

    const rendererParams = (_: string, item: PageType.Resource) => ({
        className: styles.item,
        labelClassName: styles.label,
        valueClassName: styles.value,
        ...item,
        label: camelCaseToSentence(item.label),
    });

    let filtered = data;

    // showing only some specific fields on openspace popup
    if (resourceDetails.resourceType === 'openspace' || resourceDetails.resourceType === 'communityspace') {
        filtered = data.filter(x => x.label === 'resourceType'
            || x.label === 'address'
            || x.label === 'currentLandUse'
            || x.label === 'usableArea'
            || x.label === 'totalArea');

        // appending units of area
        const totalAreaInfo = filtered && filtered.find(el => el.label === 'totalArea');
        const capacity = totalAreaInfo && totalAreaInfo.value
            && `${parseInt((totalAreaInfo.value / 5).toFixed(0), 10)} persons`;
        filtered.push({ label: 'capacity', value: capacity });

        const totalAreaKey = filtered && filtered.find(el => el.label === 'totalArea');
        if (totalAreaKey) { totalAreaKey.value = totalAreaKey && totalAreaKey.value && `${totalAreaKey.value} sq.m`; }

        const usableAreaKey = filtered && filtered.find(el => el.label === 'usableArea');
        if (usableAreaKey) { usableAreaKey.value = usableAreaKey && usableAreaKey.value && `${usableAreaKey.value} sq.m`; }

        // adding elevation to list if communityspace
        if (resourceDetails.resourceType === 'communityspace') {
            const elevantionInfo = data.find(el => el.label === 'elevation');
            if (elevantionInfo) {
                filtered.push(elevantionInfo);
            }
        }

        // shuffling array positions
        if (filtered) {
            const element = filtered[1];
            filtered.splice(1, 1);
            filtered.splice(2, 0, element);
        }
    }

    const resourceKeySelector = (d: typeof filtered) => d.label;
    return (
        <div className={styles.resourceTooltip}>
            <h3 className={styles.heading}>
                {title}
            </h3>
            <ListView
                className={styles.content}
                data={filtered}
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
                    title={
                        resourceDetails.resourceType === 'openspace'
                       || resourceDetails.resourceType === 'communityspace'
                            ? 'View Details'
                            : 'Show Inventory'
                    }
                    onClick={onShowInventoryClick}
                    transparent
                    className={styles.editButton}
                >
                    { resourceDetails.resourceType === 'openspace'
                     || resourceDetails.resourceType === 'communityspace'
                        ? 'View Details'
                        : 'Show Inventory'}
                </AccentButton>
            </div>
        </div>
    );
};

interface ComponentProps {
    className?: string;
    handleCarActive: Function;
    handleActiveLayerIndication: Function;
    handleDroneImage: Function;
    setResourceId: Function;
    droneImagePending: boolean;
}

interface ResourceColletion {
    education: PageType.Resource[];
    health: PageType.Resource[];
    finance: PageType.Resource[];
    governance: PageType.Resource[];
    tourism: PageType.Resource[];
    cultural: PageType.Resource[];
    industry: PageType.Resource[];
    communication: PageType.Resource[];
    openspace: PageType.Resource[];
    communityspace: PageType.Resource[];
}

interface State {
    resourceLngLat: [number, number] | undefined;
    activeLayerKey: ResourceTypeKeys | undefined;
    resourceInfo: PageType.Resource | undefined;
    showResourceForm: boolean;
    showInventoryModal: boolean;
    selectedFeatures: MapboxGeoJSONFeature[] | undefined;
    resourceList: PageType.Resource[];
    resourceCollection: ResourceColletion;
    activeModal: string | undefined;
    singleOpenspaceDetailsModal: boolean;
    CommunitySpaceDetailsModal: boolean;
    modalPosTop: number;
    modalPosLeft: number;
    activeLayersIndication: {
        education: boolean;
        health: boolean;
        finance: boolean;
        governance: boolean;
        tourism: boolean;
        cultural: boolean;
        industry: boolean;
        communication: boolean;
        openspace: boolean;
        communityspace: boolean;
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
    closeModal?: (key?: boolean) => void;
}

type Props = NewProps<ComponentProps & PropsFromState, Params>

const mapStateToProps = (state: AppState): PropsFromState => ({
    resourceTypeList: resourceTypeListSelector(state),
    authState: authStateSelector(state),
    filters: filtersSelectorDP(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    carKeys: carKeysSelector(state),

});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setFilters: params => dispatch(setFiltersAction(params)),
    setCarKeys: params => dispatch(setCarKeysAction(params)),
});

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    resourceGetRequest: {
        url: ({ params }) => {
            const region = params.getRegionDetails(params.region);
            const resource_type = params.resourceType;

            // const region = {municipality: 5002, province: 1, district: 3};
            const regionArr = Object.keys(region);
            const b = [];
            let a = [];
            if (regionArr) {
                a = regionArr.map(item => `${item}=${region[item]}`);
            } else {
                a = '';
            }
            const result1 = a.join('&');

            const result2 = resource_type.map(item => `resource_type=${item}`);

            return `/resource/?${result1}&${`${result2.join('&')}`}&limit=-1`;
        },
        method: methods.GET,
        onMount: false,
        onSuccess: ({ params, response }) => {
            const resources = response as MultiResponse<PageType.Resource>;
            if (params && params.setResourceList && params.setIndividualResourceList) {
                params.setResourceList(resources.results);
                if (params.resourceType) {
                    params.resourceType
                        .map(item => params.setIndividualResourceList(
                            item, resources.results.filter(r => r.resourceType === item),
                        ));
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
    openspaceDeleteRequest: {
        url: ({ params }) => `/resource/${params.id}/`,
        method: methods.DELETE,
        onSuccess: ({ params }) => {
            if (params && params.closeModal) {
                params.closeModal(true);
            }
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
                console.warn('failure', error);
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
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
            filters,
        } = this.props;

        this.state = {
            faramValues: undefined,
            activeLayerKey: undefined,
            resourceLngLat: undefined,
            resourceInfo: undefined,
            // showResourceForm: false,
            showResourceForm: true,
            testVal: true,
            showInventoryModal: false,
            selectedFeatures: undefined,
            resourceList: [],
            activeModal: undefined,
            modalPosTop: '50%',
            modalPosLeft: '50%',
            singleOpenspaceDetailsModal: false,
            CommunitySpaceDetailsModal: false,
            resourceCollection: {
                education: [],
                health: [],
                finance: [],
                governance: [],
                tourism: [],
                cultural: [],
                industry: [],
                communication: [],
                openspace: [],
                communityspace: [],
            },
            activeLayersIndication: { ...initialActiveLayersIndication },
        };

        const { faramValues: { region } } = filters;
        resourceGetRequest.setDefaultParams(
            {
                setResourceList: this.setResourceList,
                setIndividualResourceList: this.setIndividualResourceList,
                getRegionDetails: this.getRegionDetails,
                region,
            },
        );
    }

    public componentDidMount() {
        const {
            handleCarActive,
            filters,
            setFilters,
        } = this.props;
        handleCarActive(true);
        const { filters: faramValues } = this.props;
        this.setState({ faramValues });
        // checking if its loaded by report module
        const reportWindowSize = () => {
            const addResBtnElement = document.getElementById('addResourceButton');
            if (addResBtnElement) {
                const position = addResBtnElement.getBoundingClientRect();
                this.setState({
                    modalPosTop: position.top,
                    modalPosLeft: position.left,
                });
                console.log('in CAR page: ', position);
                console.log('in CAR page, element: ', addResBtnElement);
            }
        };
        window.addEventListener('resize', reportWindowSize);
    }

    public componentDidUpdate(prevProps, prevState, snapshot) {
        const { faramValues: { region } } = this.props.filters;
        if (prevProps.filters.faramValues.region !== this.props.filters.faramValues.region) {
            this.props.requests.resourceGetRequest.do(
                {
                    region,
                    resourceType: this.props.carKeys,
                },
            );
        }
    }

    public componentWillUnmount() {
        const { handleCarActive, handleActiveLayerIndication } = this.props;
        handleCarActive(false);
        handleActiveLayerIndication(initialActiveLayersIndication);
    }

    public getRegionDetails = ({ adminLevel, geoarea } = {}) => {
        const {
            provinces,
            districts,
            municipalities,
            filters: { faramValues: { region } },
        } = this.props;

        if (Object.keys(region).length === 0) {
            return '';
        }
        if (adminLevel === 1) {
            return { province: provinces.find(p => p.id === geoarea).id };
        }

        if (adminLevel === 2) {
            return { district: districts.find(p => p.id === geoarea).id };
        }

        if (adminLevel === 3) {
            return { municipality: municipalities.find(p => p.id === geoarea).id };
        }
        return '';
    }

    private handleToggleClick = (key: toggleValues, value: boolean) => {
        const { activeLayersIndication, resourceCollection } = this.state;
        const temp = { ...activeLayersIndication };
        const { setCarKeys, carKeys } = this.props;
        temp[key] = value;
        this.setState({ activeLayersIndication: temp });
        const { handleActiveLayerIndication } = this.props;
        handleActiveLayerIndication(temp);
        if (temp[key] && resourceCollection[key].length === 0) {
            const newArr = [];
            newArr.push(key);
            if (carKeys.length === 1) {
                newArr.push(carKeys[0]);
            } else {
                newArr.push(...carKeys);
            }
            setCarKeys(newArr);

            this.props.requests.resourceGetRequest.do({
                resourceType: newArr,
                region: this.props.filters.faramValues.region,
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
    }

    private getNewResourceCollection = (
        resource: PageType.Resource,
        resourceCollection: ResourceColletion,
    ): ResourceColletion => {
        let newResourceCollection: ResourceColletion = {
            education: [],
            health: [],
            finance: [],
            governance: [],
            tourism: [],
            cultural: [],
            industry: [],
            communication: [],
            openspace: [],
            communityspace: [],
        };
        const { resourceType } = resource;
        const { [resourceType]: singleResource } = resourceCollection;

        const newSingleResource = [
            ...singleResource,
            resource,
        ];
        newResourceCollection = {
            ...resourceCollection,
            [resourceType]: newSingleResource,
        };

        return newResourceCollection;
    }

    private handleResourceAdd = (resource: PageType.Resource) => {
        const {
            resourceList,
            resourceCollection,
        } = this.state;
        const newResourceList = [
            resource,
            ...resourceList,
        ];
        const newResourceCollection: ResourceColletion = this.getNewResourceCollection(
            resource, resourceCollection,
        );
        this.setState({ resourceList: newResourceList, resourceCollection: newResourceCollection });
    }

    private handleResourceEdit = (resourceId: PageType.Resource['id'], resource: PageType.Resource) => {
        const {
            resourceList,
            resourceCollection,
        } = this.state;

        const { resourceType } = resource;
        const { [resourceType]: singleResource } = resourceCollection;
        const newResourceList = produce(resourceList, (safeResourceList) => {
            const index = resourceList.findIndex(r => r.id === resourceId);
            if (index !== -1) {
                // eslint-disable-next-line no-param-reassign
                safeResourceList[index] = resource;
            }
        });

        const newSingleResource = produce(singleResource, (safeSingleResource) => {
            const index = singleResource.findIndex(r => r.id === resourceId);
            if (index !== -1) {
                // eslint-disable-next-line no-param-reassign
                safeSingleResource[index] = resource;
            }
        });

        const newResourceCollection = {
            ...resourceCollection,
            [resourceType]: newSingleResource,
        };

        // this.setState({ resourceList: newResourceList });
        this.setState({ resourceList: newResourceList, resourceCollection: newResourceCollection });
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

    private handleResourceMouseEnter = () => { }

    private handleResourceClick = (feature: unknown, lngLat: [number, number]) => {
        const { properties: { id, title, description, ward, resourceType, point } } = feature;
        const { coordinates } = JSON.parse(point);
        const { map } = this.context;

        if (coordinates && map) {
            map.flyTo({
                center: coordinates,
                // zoom: 10,
            });
        }

        const {
            requests: {
                resourceDetailGetRequest,
            }, setResourceId,
        } = this.props;

        if (!id) {
            return;
        }
        setResourceId(id);
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
        const { setResourceId, handleDroneImage } = this.props;
        const { map } = this.context;
        this.setState({
            resourceLngLat: undefined,
            resourceInfo: undefined,
        });

        // removing drone image after tooltip close
        setResourceId(undefined);
        handleDroneImage(false);
        if (map.getLayer('wms-openspace-layer')) {
            map.removeLayer('wms-openspace-layer');
        }
        if (map.getSource('wms-openspace-source')) {
            map.removeSource('wms-openspace-source');
        }
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
                openspace: false,
                communityspace: false,
            },
        });
        const { handleActiveLayerIndication } = this.props;
        handleActiveLayerIndication(initialActiveLayersIndication);
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

    private handleIconClick = (key: string) => {
        this.setState({
            activeModal: key,
        });
    };

    private handleShowOpenspaceDetailsClick = (openspaceDeleted?: boolean) => {
        this.setState(prevState => ({
            singleOpenspaceDetailsModal: !prevState.singleOpenspaceDetailsModal,
        }));
        if (openspaceDeleted) {
            this.setState({
                resourceLngLat: undefined,
                resourceInfo: undefined,
            });
        }
    };

    private handleShowCommunitypaceDetails = (
        communityspaceDeleted?: boolean,
    ) => {
        this.setState(prevState => ({
            CommunitySpaceDetailsModal: !prevState.CommunitySpaceDetailsModal,
        }));
        if (communityspaceDeleted) {
            this.setState({
                resourceLngLat: undefined,
                resourceInfo: undefined,
            });
        }
    };

    private routeToOpenspace = (point) => {
        if (window.navigator.geolocation) {
            // Geolocation available
            const { coordinates } = point;
            window.navigator.geolocation.getCurrentPosition((position) => {
                const directionsUrl = `https://www.google.com/maps/dir/'${position.coords.latitude},${position.coords.longitude}'/${coordinates[1]},${coordinates[0]}`;

                window.open(directionsUrl, '_blank');
            }, console.log('please provide location access'));
        }
    };

    private handelListClick = (features: any, resourceType: string) => {
        const { map } = this.context;
        const {
            id,
            title,
            ward,
            point: { coordinates },
            point,
        } = features;

        if (coordinates && map) {
            map.flyTo({
                center: coordinates,
                zoom: 16,
            });
        }

        const {
            requests: { resourceDetailGetRequest },
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
                ward,
                resourceType,
                point,
            },
        });
    };

    public render() {
        const {
            className,
            requests,
            resourceTypeList,
            droneImagePending,
            requests: { openspaceDeleteRequest },
            authState: { authenticated },
            // setCarKeys,
        } = this.props;
        // setCarKeys(1);

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
            activeModal,
            singleOpenspaceDetailsModal,
            CommunitySpaceDetailsModal,
            modalPosTop,
            modalPosLeft,
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
            || polygonResourceGetPending
            || droneImagePending;

        // const geojson = this.getGeojson(resourceList);
        const educationGeoJson = this.getGeojson(resourceCollection.education);
        const healthGeoJson = this.getGeojson(resourceCollection.health);
        const financeGeoJson = this.getGeojson(resourceCollection.finance);
        const governanceGeoJson = this.getGeojson(resourceCollection.governance);
        const tourismGeoJson = this.getGeojson(resourceCollection.tourism);
        const culturalGeoJson = this.getGeojson(resourceCollection.cultural);
        const industryGeoJson = this.getGeojson(resourceCollection.industry);
        const communicationGeoJson = this.getGeojson(resourceCollection.communication);
        const openspaceGeoJson = this.getGeojson(resourceCollection.openspace);
        const communityspaceGeoJson = this.getGeojson(
            resourceCollection.communityspace,
        );
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
                                            modalPos={{
                                                top: modalPosTop,
                                                left: modalPosLeft,
                                            }}
                                        />
                                    )}
                                >
                                    <span>
                                        Add Resource
                                    </span>
                                </AccentModalButton>
                            </Cloak>
                            <DangerButton
                                // disabled={!activeLayerKey}
                                disabled={!Object.values(activeLayersIndication).some(Boolean)
                                    && !activeLayerKey}
                                onClick={this.handleLayerUnselect}
                                className={styles.clearButton}
                                transparent
                                id={'addResourceButton'}
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
                        handleIconClick={this.handleIconClick}
                        disabled={pending}
                    />
                    {/* for previous radio buttons structure starts */}
                    {/* <ListView
                        className={styles.content}
                        data={resourceTypeList}
                        keySelector={d => d.title}
                        renderer={Option}
                        rendererParams={this.getLayerRendererParams}
                    /> */}
                    {/* for previous radio buttons structure ends */}
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
                    {Object.values(activeLayersIndication).some(Boolean) && (
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
                            {/* previously implemented logic */}
                            {/* <MapSource
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
                            </MapSource> */}
                            {/* new structure starts */}
                            {/* Education */}
                            {activeLayersIndication.education && (
                                <MapSource
                                    sourceKey="resource-symbol-education"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={educationGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-education"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.education,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-education"
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
                                        layerKey="resource-symbol-background-education"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.education,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-education"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'education',
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
                            )}
                            {/* Health */}
                            {activeLayersIndication.health && (
                                <MapSource
                                    sourceKey="resource-symbol-health"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={healthGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-health"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.health,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-health"
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
                                        layerKey="resource-symbol-background-health"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.health,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-health"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'health',
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
                            )}
                            {/* Finance */}
                            {activeLayersIndication.finance && (
                                <MapSource
                                    sourceKey="resource-symbol-finance"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={financeGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-finance"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.finance,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-finance"
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
                                        layerKey="resource-symbol-background-finance"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.finance,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-finance"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'finance',
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
                            )}
                            {/* Governance */}
                            {activeLayersIndication.governance && (
                                <MapSource
                                    sourceKey="resource-symbol-governance"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={governanceGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-governance"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.governance,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-governance"
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
                                        layerKey="resource-symbol-background-governance"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.governance,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-governance"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'governance',
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
                            )}
                            {/* Tourism */}
                            {activeLayersIndication.tourism && (
                                <MapSource
                                    sourceKey="resource-symbol-tourism"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={tourismGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-tourism"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.tourism,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-tourism"
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
                                        layerKey="resource-symbol-background-tourism"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.tourism,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-tourism"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'tourism',
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
                            )}
                            {/* Cultural */}
                            {activeLayersIndication.cultural && (
                                <MapSource
                                    sourceKey="resource-symbol-cultural"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={culturalGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-cultural"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.cultural,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-cultural"
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
                                        layerKey="resource-symbol-background-cultural"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.cultural,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-cultural"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'cultural',
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
                            )}
                            {/* Industry */}
                            {activeLayersIndication.industry && (
                                <MapSource
                                    sourceKey="resource-symbol-industry"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={industryGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-industry"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.industry,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-industry"
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
                                        layerKey="resource-symbol-background-industry"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.industry,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-industry"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'industry',
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
                            )}
                            {/* Communication */}
                            {activeLayersIndication.communication && (
                                <MapSource
                                    sourceKey="resource-symbol-communication"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={communicationGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-communication"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.communication,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-communication"
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
                                        layerKey="resource-symbol-background-communication"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.communication,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-communication"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'communication',
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
                            )}
                            {/* communityspace */}
                            {activeLayersIndication.communityspace && (
                                <>
                                    <MapSource
                                        sourceKey="resource-symbol-communityspace"
                                        sourceOptions={{
                                            type: 'geojson',
                                            cluster: true,
                                            clusterMaxZoom: 10,
                                        }}
                                        geoJson={communityspaceGeoJson}
                                    >
                                        <MapLayer
                                            layerKey="cluster-communityspace"
                                            onClick={this.handleClusterClick}
                                            layerOptions={{
                                                type: 'circle',
                                                paint:
                                                    mapStyles.resourceCluster
                                                        .communityspace,
                                                filter: ['has', 'point_count'],
                                            }}
                                        />
                                        <MapLayer
                                            layerKey="cluster-count-communityspace"
                                            layerOptions={{
                                                type: 'symbol',
                                                filter: ['has', 'point_count'],
                                                layout: {
                                                    'text-field':
                                                        '{point_count_abbreviated}',
                                                    'text-size': 12,
                                                },
                                            }}
                                        />
                                        <MapLayer
                                            layerKey="resource-symbol-background-community"
                                            onClick={this.handleResourceClick}
                                            onMouserEnter={
                                                this.handleResourceMouseEnter
                                            }
                                            layerOptions={{
                                                type: 'circle',
                                                filter: [
                                                    '!',
                                                    ['has', 'point_count'],
                                                ],
                                                paint:
                                                    mapStyles.resourcePoint
                                                        .communityspace,
                                            }}
                                        />
                                        <MapLayer
                                            layerKey="-resourece-symbol-icon-communityspace"
                                            layerOptions={{
                                                type: 'symbol',
                                                filter: [
                                                    '!',
                                                    ['has', 'point_count'],
                                                ],
                                                layout: {
                                                    'icon-image': 'communityspace',
                                                    'icon-size': 0.03,
                                                },
                                            }}
                                        />

                                        {resourceLngLat && resourceInfo && (
                                            <MapTooltip
                                                coordinates={resourceLngLat}
                                                tooltipOptions={tooltipOptions}
                                                onHide={this.handleTooltipClose}
                                            >
                                                <ResourceTooltip
                                                // FIXME:hide tooltip edit if there is no permission
                                                    {...resourceInfo}
                                                    {...resourceDetails}
                                                    onEditClick={
                                                        this.handleEditClick
                                                    }
                                                    onShowInventoryClick={
                                                        () => this.handleShowCommunitypaceDetails()
                                                    }
                                                    authenticated={authenticated}
                                                />
                                            </MapTooltip>
                                        )}
                                    </MapSource>
                                    {resourceInfo && (
                                        <PolygonBoundaryCommunity
                                            resourceInfo={resourceInfo}
                                        />
                                    )}
                                </>
                            )}
                            {/* openspace */}
                            {activeLayersIndication.openspace && (
                                <>
                                    <MapSource
                                        sourceKey="resource-symbol-openspace"
                                        sourceOptions={{
                                            type: 'geojson',
                                            cluster: true,
                                            clusterMaxZoom: 10,
                                        }}
                                        geoJson={openspaceGeoJson}
                                    >
                                        <MapLayer
                                            layerKey="cluster-openspace"
                                            onClick={this.handleClusterClick}
                                            layerOptions={{
                                                type: 'circle',
                                                paint:
                                                    mapStyles.resourceCluster
                                                        .openspace,
                                                filter: ['has', 'point_count'],
                                            }}
                                        />
                                        <MapLayer
                                            layerKey="cluster-count-openspace"
                                            layerOptions={{
                                                type: 'symbol',
                                                filter: ['has', 'point_count'],
                                                layout: {
                                                    'text-field':
                                                        '{point_count_abbreviated}',
                                                    'text-size': 12,
                                                },
                                            }}
                                        />
                                        <MapLayer
                                            layerKey="resource-symbol-background-openspace"
                                            onClick={this.handleResourceClick}
                                            onMouserEnter={
                                                this.handleResourceMouseEnter
                                            }
                                            layerOptions={{
                                                type: 'circle',
                                                filter: [
                                                    '!',
                                                    ['has', 'point_count'],
                                                ],
                                                paint:
                                                    mapStyles.resourcePoint
                                                        .openspace,
                                            }}
                                        />
                                        <MapLayer
                                            layerKey="-resourece-symbol-icon-openspace"
                                            layerOptions={{
                                                type: 'symbol',
                                                filter: [
                                                    '!',
                                                    ['has', 'point_count'],
                                                ],
                                                layout: {
                                                    'icon-image': 'openspace',
                                                    'icon-size': 0.03,
                                                },
                                            }}
                                        />

                                        {resourceLngLat && resourceInfo && (
                                            <MapTooltip
                                                coordinates={resourceLngLat}
                                                tooltipOptions={tooltipOptions}
                                                onHide={this.handleTooltipClose}
                                            >
                                                <ResourceTooltip
                                                // FIXME:hide tooltip edit if there is no permission
                                                    {...resourceInfo}
                                                    {...resourceDetails}
                                                    onEditClick={
                                                        this.handleEditClick
                                                    }
                                                    onShowInventoryClick={
                                                        () => this.handleShowOpenspaceDetailsClick()
                                                    }
                                                    authenticated={authenticated}
                                                />
                                            </MapTooltip>
                                        )}
                                    </MapSource>
                                    {resourceInfo && (
                                        <>
                                            <PolygonBoundary
                                                resourceInfo={resourceInfo}
                                            />
                                        </>
                                    )}
                                </>
                            )}
                            {/* new structure ends */}
                        </>
                    )}
                </div>
                { }

                { }
                {activeModal === 'showOpenSpaceInfoModal' ? (
                    <OpenspaceMetaDataModal closeModal={this.handleIconClick} />
                ) : activeModal === 'communityMetaModal' ? (
                    <CommunityMetaDataModal closeModal={this.handleIconClick} />
                ) : activeModal === 'showAllOpenspacesModal' ? (
                    <AllOpenspacesModal
                        closeModal={this.handleIconClick}
                        handelListClick={this.handelListClick}
                    />
                ) : activeModal === 'showAllCommunityModal' ? (
                    <AllCommunitySpaceModal
                        closeModal={this.handleIconClick}
                        handelListClick={this.handelListClick}
                    />
                ) : null}
                {singleOpenspaceDetailsModal && (
                    <SingleOpenspaceDetails
                        {...resourceDetails}
                        closeModal={this.handleShowOpenspaceDetailsClick}
                        openspaceDeleteRequest={openspaceDeleteRequest}
                        onEdit={this.handleEditClick}
                        routeToOpenspace={this.routeToOpenspace}
                        type={resourceDetails && resourceDetails.resourceType}
                    />
                )}
                {CommunitySpaceDetailsModal && (
                    <CommunityOpenspaceDetails
                        {...resourceDetails}
                        closeModal={this.handleShowCommunitypaceDetails}
                        onEdit={this.handleEditClick}
                        routeToOpenspace={this.routeToOpenspace}
                        openspaceDeleteRequest={openspaceDeleteRequest}
                    />
                )}
            </>
        );
    }
}

CapacityAndResources.contextType = MapChildContext;
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createRequestClient(requestOptions),
)(CapacityAndResources);
