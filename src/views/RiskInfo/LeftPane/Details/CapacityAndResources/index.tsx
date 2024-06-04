/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable react/sort-comp */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable space-infix-ops */
/* eslint-disable no-param-reassign */
/* eslint-disable no-self-assign */
/* eslint-disable no-return-assign */
/* eslint-disable no-plusplus */
/* eslint-disable comma-spacing */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import produce from 'immer';
import memoize from 'memoize-one';
import * as ReachRouter from '@reach/router';

import { MapboxGeoJSONFeature } from 'mapbox-gl';
import {
    _cs,
    isDefined,
    mapToList,
} from '@togglecorp/fujs';
import { ReactI18NextChild, Translation } from 'react-i18next';
import Icon from '#rscg/Icon';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import {
    // setRegionAction,
    setFiltersAction,
    setPalikaRedirectAction,
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
    palikaRedirectSelector,
    userSelector,
    wardsSelector,
    enumOptionsSelector,
    regionSelector,
    languageSelector,
    filtersSelector,
} from '#selectors';

import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';
import DangerButton from '#rsca/Button/DangerButton';
import AccentButton from '#rsca/Button/AccentButton';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import ListView from '#rsu/../v2/View/ListView';
import { checkSameRegionPermission, checkPermission, convertDateAccToLanguage } from '#utils/common';
import { Draw } from '#re-map/type';
import MapSource from '#re-map/MapSource';
import MapImage from '#re-map/MapImage';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';
import MapShapeEditor from '#re-map/MapShapeEditor';
import { MultiResponse } from '#store/atom/response/types';

import Cloak, { getParams } from '#components/Cloak';
import TextOutput from '#components/TextOutput';
import Option from '#components/RadioInput/Option';
import Loading from '#components/Loading';
import { mapStyles } from '#constants';
import HealthIcon from '#resources/icons/Health-facility.png';
import FinanceIcon from '#resources/icons/Financing.png';
import FoodWarehouseIcon from '#resources/icons/Food-warehouse.png';
import { FiltersElement, ResourceTypeKeys } from '#types';
import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';
import { capacityResource } from '#utils/domain';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import finance from '#resources/icons/newCapResBanking.svg';
import cultural from '#resources/icons/newCapResCulture.svg';
import education from '#resources/icons/newCapResEducation.svg';
import governance from '#resources/icons/newCapResGovernment.svg';
import health from '#resources/icons/newCapResHealth.svg';
import industry from '#resources/icons/newCapResIndustry.svg';
import hotelandrestaurant from '#resources/icons/newCapResHotel&Restaurant.svg';
import transportation from '#resources/icons/newCapResTransportation.svg';
import communication from '#resources/icons/newCapResCommunication.svg';
import bridge from '#resources/icons/newCapResBridge.svg';
import electricity from '#resources/icons/newCapResElectricity.svg';
import firefightingApp from '#resources/icons/newCapResFireFightingApparatus.svg';
import sanitationService from '#resources/icons/newCapResSanitationService.svg';
import watersupply from '#resources/icons/newCapResWaterSupplyInfrastructure.svg';
import openspace from '#resources/icons/newCapResOpenSpace.svg';
import evacuationCentre from '#resources/icons/newCapResEvacuationcenter.svg';
import airway from '#resources/icons/airway.svg';
import roadway from '#resources/icons/roadway.svg';
import waterway from '#resources/icons/waterway.svg';
import visualization from '#resources/icons/visualization.svg';
import helipad from '#resources/icons/heli.svg';
import search from '#resources/icons/search-manual.svg';
import { OpenSeaDragonViewer } from '#views/RiskInfo/OpenSeaDragonImageViewer';
import Checkbox from './Checkbox/index';
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

import DataVisualisation from './DataVisualisation';
import SearchModal from './SearchModal';
import Tooltip from './Tooltip';


const TableModalButton = modalize(Button);

const AccentModalButton = modalize(AccentButton);

const camelCaseToSentence = (text: string) => {
    const result = text.replace(/([A-Z])/g, '$1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

    return finalResult;
};

interface ResourceTooltipProps extends PageType.Resource {
    onEditClick: () => void;
    onShowInventoryClick: () => void;
    handleShowOpenspaceDetailsClick: () => void;
    handleShowCommunitypaceDetails: () => void;
    authenticated: boolean;
    language: string;
}

type toggleValues =
    | 'education'
    | 'health'
    | 'finance'
    | 'governance'
    | 'hotelandrestaurant'
    | 'cultural'
    | 'industry'
    | 'communication'
    | 'openspace'
    | 'communityspace'
    | 'firefightingapparatus'
    | 'fireengine'
    | 'helipad'
    | 'bridge'
    | 'roadway'
    | 'waterway'
    | 'airway'
    | 'helipad'
    | 'electricity'
    | 'fire fighting apparatus'
    | 'sanitation'
    | 'watersupply'
    | 'evacuationcentre'
    | 'warehouse';

const initialActiveLayersIndication = {
    education: false,
    health: false,
    finance: false,
    governance: false,
    hotelandrestaurant: false,
    cultural: false,
    industry: false,
    communication: false,
    openspace: false,
    communityspace: false,
    firefightingapparatus: false,
    fireengine: false,
    helipad: false,
    bridge: false,
    roadway: false,
    waterway: false,
    airway: false,
    electricity: false,
    sanitation: false,
    watersupply: false,
    evacuationcentre: false,
    warehouse: false,


};

const ResourceTooltip = (props: ResourceTooltipProps) => {
    const { onEditClick,
        onShowInventoryClick,
        isLoggedInUser,
        wardsRef,
        language,
        filterPermissionGranted,
        ...resourceDetails } = props;

    const { id, point, title, picture, ...resource } = resourceDetails;

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

    const oldfiltered = data;


    let filtered = oldfiltered.map((r) => {
        if (r.label === 'ward') {
            return {
                label: language === 'en' ? 'ward' : 'वार्ड',
                value: wardsRef[r.value],
            };
        }

        if (r.label === 'lastModifiedDate') {
            return {
                label: language === 'en' ? 'lastModifiedDate' : 'पछिल्‍लो परिमार्जित मिति',
                value: convertDateAccToLanguage(`${r.value.split('T')[0]}`, language),
            };
        }
        return r;
    });

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
            filtered.splice(1, 0, { label: 'Data Source', value: resource.dataSource || null });
        }
    }

    const resourceKeySelector = (d: typeof filtered) => d.label;


    return (
        <Translation>
            {
                t => (
                    <div className={styles.resourceTooltip}>

                        <h3 className={styles.heading}>
                            {title}
                        </h3>
                        <div className={styles.content}>
                            {picture ? <img src={picture} alt="" style={{ maxHeight: '150px', width: '100%' }} /> : ''}
                            <table>
                                {filtered.map(item => (

                                    item.value && (item.value !== true) && (item.value !== false)
                                        ? (
                                            <tr key={item.label}>
                                                <td>{camelCaseToSentence(item.label)}</td>
                                                <td>{item.value && (typeof (item.value) === 'string') ? camelCaseToSentence(item.value) : item.value}</td>

                                            </tr>
                                        ) : ''


                                ))}


                            </table>
                        </div>

                        {/* <ListView
                className={styles.content}
                data={filtered}
                keySelector={resourceKeySelector}
                renderer={TextOutput}
                rendererParams={rendererParams}
            /> */}
                        <div className={styles.actions}>

                            {isLoggedInUser && filterPermissionGranted
                                ? (
                                    <AccentButton
                                        title={t('Edit')}
                                        onClick={onEditClick}
                                        transparent
                                        className={styles.editButton}
                                    >
                                        {t('Edit data')}
                                    </AccentButton>
                                ) : ''}


                            <AccentButton
                                title={
                                    resourceDetails.resourceType === 'openspace'
                                        || resourceDetails.resourceType === 'communityspace'
                                        ? t('View Details')
                                        : t('Inventories')
                                }
                                onClick={onShowInventoryClick}
                                transparent
                                className={styles.editButton}
                            >
                                {resourceDetails.resourceType === 'openspace'
                                    || resourceDetails.resourceType === 'communityspace'
                                    ? t('View Details')
                                    : t('Inventories')
                                }
                            </AccentButton>
                        </div>
                    </div>
                )
            }
        </Translation>


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
    hotelandrestaurant: PageType.Resource[];
    cultural: PageType.Resource[];
    industry: PageType.Resource[];
    communication: PageType.Resource[];
    openspace: PageType.Resource[];
    communityspace: PageType.Resource[];
    firefightingapparatus: PageType.Resource[];
    fireengine: PageType.Resource[];
    helipad: PageType.Resource[];
    bridge: PageType.Resource[];
    airway: PageType.Resource[];
    roadway: PageType.Resource[];
    waterway: PageType.Resource[];
    electricity: PageType.Resource[];
    sanitation: PageType.Resource[];
    watersupply: PageType.Resource[];
    evacuationcentre: PageType.Resource[];
    warehouse: PageType.Resource[];
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
        hotelandrestaurant: boolean;
        cultural: boolean;
        industry: boolean;
        communication: boolean;
        openspace: boolean;
        communityspace: boolean;
        firefightingapparatus: boolean;
        fireengine: boolean;
        helipad: boolean;
        bridge: boolean;
        airway: boolean;
        roadway: boolean;
        waterway: boolean;
        electricity: boolean;
        sanitation: boolean;
        watersupply: boolean;
        evacuationcentre: boolean;
        warehouse: boolean;

    };
}

interface WardRef {
    wardId: number;
}
interface PropsFromState {
    resourceTypeList: PageType.ResourceType[];
}

interface Params {
    ErrorData: Params | undefined;
    DeletedResourceApiRecall(): unknown;
    setFaramErrors: Params | undefined;
    getWarehouseData: Params | undefined;
    resourceType?: string;
    resourceId?: number;
    coordinates?: [number, number][];
    setResourceList?: (resources: PageType.Resource[]) => void;
    setIndividualResourceList?: (key: toggleValues, resources: PageType.Resource[]) => void;
    closeModal?: (key?: boolean) => void;
}

interface PositionModal {
    top: string | number;
    left: string | number;
}

type Props = NewProps<ComponentProps & PropsFromState, Params>

const mapStateToProps = (state: AppState): PropsFromState => ({
    resourceTypeList: resourceTypeListSelector(state),
    authState: authStateSelector(state),
    filterss: filtersSelector(state),
    filters: filtersSelectorDP(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    carKeys: carKeysSelector(state),
    palikaRedirect: palikaRedirectSelector(state),
    user: userSelector(state),
    wards: wardsSelector(state),
    region: regionSelector(state),
    language: languageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setFilters: (params: { filters: FiltersElement }) => dispatch(setFiltersAction(params)),
    setPalikaRedirect: (params: any) => dispatch(setPalikaRedirectAction(params)),
    setCarKeys: (params: any) => dispatch(setCarKeysAction(params)),


});

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    resourceGetRequest: {
        url: ({ params }) => {
            const region = params.getRegionDetails(params.region);
            const resource_type = params.resourceType;
            const finalInventoryItems = params.inventoryItems && params.inventoryItems.map(i => `inventory_item=${i}`).join('&');

            // const region = {municipality: 5002, province: 1, district: 3};
            const regionArr = Object.keys(region);
            let a = [];
            if (regionArr) {
                a = regionArr.map(item => `${item}=${region[item]}`);
            } else {
                a = '';
            }
            const result1 = a.join('&');
            const result2 = resource_type.map((item: any) => `resource_type=${item}`);

            return params.filterClickCheckCondition
                ? `/resource/?${result1}&${`${result2.join('&')}`}${finalInventoryItems?result2.length?`&${finalInventoryItems}`:finalInventoryItems:''}&limit=-1&meta=true`
                : `/resource/?resource_type=${resource_type[0]}${finalInventoryItems?result2.length?`&${finalInventoryItems}`:finalInventoryItems:''}&${a.length ? a[0] : ''}&limit=-1&meta=true`;
            // return `/resource/?${result1}&${`${result2.join('&')}`}&limit=-1&meta=true`;
        },
        method: methods.GET,
        onMount: false,
        onSuccess: ({ params, response }) => {
            const resources = response as MultiResponse<PageType.Resource>;

            if (params && params.setResourceList && params.setIndividualResourceList) {
                params.setResourceList(resources.results);
                if (params.resourceType) {
                    params.setIndividualResourceList(params.resourceType, resources.results, params.resourceType, resources.results);
                    // params.resourceType
                    //     .map(item => params.setIndividualResourceList(
                    //         item, resources.results.filter(r => r.resourceType === item), params.resourceType, resources.results,
                    //     ));
                }
            }
        },
        onFailure: ({ error, params }) => {
            if (params && params.ErrorData) {
                params.ErrorData(error);
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
                params.DeletedResourceApiRecall();
            }
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
    },
    warehouseSubCategoryGet: {
        url: ({ params }) => '/inventory-category/?count=true',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ params, response }) => {
            const resources = response as MultiResponse<PageType.Resource>;


            if (params && params.getWarehouseData) {
                params.getWarehouseData(resources.results);
            }
        },
        onFailure: ({ error, params }) => {
            // if (params && params.ErrorData) {
            //     params.ErrorData(error);
            // }
            console.log('This is error',error);
        },
    },
};

const positionModal: PositionModal = {
    top: '50%',
    left: '50%',
};
const tempHelipad = [];
const CHECKBOX_STATES = {
    Checked: 'Checked',
    Indeterminate: 'Indeterminate',
    Empty: 'Empty',
};
const sidepanelLogo = [
    {
        name: 'Education',
        image: education,
    },
    {
        name: 'Banking & Finance',
        image: finance,
    },
    {
        name: 'Culture',
        image: cultural,
    },
    {
        name: 'Hotel & Restaurant',
        image: hotelandrestaurant,
    },
    {
        name: 'Governance',
        image: governance,
    },
    {
        name: 'Health',
        image: health,
    },
    {
        name: 'Transportation',
        image: transportation,
    },
    {
        name: 'Airway',
        image: airway,
    },
    {
        name: 'Waterway',
        image: waterway,
    },
    {
        name: 'Roadway',
        image: roadway,
    },
    {
        name: 'Industry',
        image: industry,
    },
    {
        name: 'Communication',
        image: communication,
    },
    {
        name: 'Bridge',
        image: bridge,
    },
    {
        name: 'Roadway',
        image: bridge,
    },
    {
        name: 'Waterway',
        image: bridge,
    },
    {
        name: 'Airway',
        image: bridge,
    },
    {
        name: 'Helipad',
        image: helipad,
    },
    {
        name: 'Electricity',
        image: electricity,
    },
    {
        name: 'Fire Fighting Apparatus',
        image: firefightingApp,
    },
    {
        name: 'Fire Engine',
        image: firefightingApp,
    },
    {
        name: 'Sanitation Service',
        image: sanitationService,
    },
    {
        name: 'Water Supply Infrastructure',
        image: watersupply,
    },
    // {
    //     name: 'Open Space',
    //     image: openspace,
    // },
    {
        name: 'Humanitarian Open Space',
        image: openspace,
    },
    {
        name: 'Community Space',
        image: openspace,
    },
    {
        name: 'Evacuation Centre',
        image: evacuationCentre,
    },
    {
        name: 'Godam',
        image: evacuationCentre,
    },
];


// let selectedCategory = [];

// let selectedSubCategorynameList = [];

// // eslint-disable-next-line prefer-const
// let resourceTypeName = '';
let editResources = false;
let ResourceType = '';
const stopLoop = true;
class CapacityAndResources extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        const {
            requests: {
                resourceGetRequest,
            },
            filters,
            palikaRedirect,
            filterss,
        } = this.props;
        // const { isFilterClicked, FilterClickedStatus } = this.context;
        this.state = {
            faramValues: undefined,
            activeLayerKey: undefined,
            resourceLngLat: undefined,
            resourceInfo: undefined,
            showResourceForm: false,
            showInventoryModal: false,
            selectedFeatures: undefined,
            resourceList: [],
            activeModal: undefined,
            singleOpenspaceDetailsModal: false,
            CommunitySpaceDetailsModal: false,
            showSubCategory: false,
            mainCheckbox: false,
            subMainCheckbox: false,
            selectedResource: '',
            resourceCategory: [],
            mainCategoryCheckboxChecked: [],
            subCategoryCheckboxChecked: [],
            selectedCategoryName: '',
            selectedSubCategoryName: '',
            enableCategoryCheckbox: false,
            checked: CHECKBOX_STATES.Empty,
            filterSubCategory: [],
            indeterminantConditionArray: [],
            selectCategoryForinitialFilter: [],
            selectedSubCategorynameList: [],
            reserveListForOtherFilter: {},
            categoryLevel: null,
            lvl2catName: '',
            filteredSubCategoriesLvl2ResourceType: [],
            lvl2TypeName: '',
            lvl2UncheckCondition: false,
            openVisualization: false,
            disableCheckbox: false,
            resourceCollection: {
                education: [],
                health: [],
                finance: [],
                governance: [],
                hotelandrestaurant: [],
                cultural: [],
                industry: [],
                communication: [],
                openspace: [],
                communityspace: [],
                firefightingapparatus: [],
                fireengine: [],
                helipad: [],
                bridge: [],
                roadway: [],
                waterway: [],
                airway: [],
                electricity: [],
                sanitation: [],
                watersupply: [],
                evacuationcentre: [],
                warehouse: [],


            },
            PreserveresourceCollection: {
                education: [],
                health: [],
                finance: [],
                governance: [],
                hotelandrestaurant: [],
                cultural: [],
                industry: [],
                communication: [],
                openspace: [],
                communityspace: [],
                firefightingapparatus: [],
                fireengine: [],
                helipad: [],
                bridge: [],
                roadway: [],
                waterway: [],
                airway: [],
                electricity: [],
                sanitation: [],
                watersupply: [],
                evacuationcentre: [],
                warehouse: [],

            },
            ErrorData: '',
            activeLayersIndication: { ...initialActiveLayersIndication },
            palikaRedirectState: false,
            isLoggedInUser: false,
            wardsRef: {},
            showSearchModal: false,
            filteredSearchResource: [],
            showTooltip: false,
            selectedCategoryId: null,
            warehouseSubCategory: [],
            capacity_resource: [
                {
                    id: 1,
                    name: 'Education',
                    nameNe: 'शैक्षिक संस्था',
                    resourceType: 'education',
                    attribute: 'type',
                    level: 1,
                    subCategory: [
                        {
                            id: 1,
                            name: 'Preprimary',
                            nameNe: 'पूर्व-प्राथमिक',
                            type: 'Preprimary',
                        },
                        {
                            id: 2,
                            name: 'Basic Education',
                            nameNe: 'आधारभूत शिक्षा',
                            type: 'Basic Education',
                        },
                        {
                            id: 3,
                            name: 'High School',
                            nameNe: 'उच्च माध्यमिक विद्यालय',
                            type: 'High School',
                        },
                        {
                            id: 4,
                            name: 'College',
                            nameNe: 'कलेज',
                            type: 'College',
                        },
                        {
                            id: 5,
                            name: 'University',
                            nameNe: 'विश्वविद्यालय',
                            type: 'University',
                        },
                        {
                            id: 6,
                            name: 'Traditional Education',
                            nameNe: 'परम्परागत शिक्षा',
                            type: 'Traditional Education',
                        },
                        {
                            id: 7,
                            name: 'Library',
                            nameNe: 'पुस्तकालय',
                            type: 'Library',
                        },
                        {
                            id: 8,
                            name: 'Other',
                            nameNe: 'अन्य',
                            type: 'Other',
                        },
                    ],
                },
                {
                    id: 2,
                    name: 'Health',
                    nameNe: 'स्वास्थ्य संस्था',
                    resourceType: 'health',
                    attribute: 'type',
                    level: 1,
                    subCategory: [
                        {
                            id: 9,
                            name: 'Specialized Hospital',
                            nameNe: 'विशेष अस्पताल',
                            type: 'Specialized Hospital',
                        },
                        {
                            id: 10,
                            name: 'Center Hospital',
                            nameNe: 'केन्द्र अस्पताल',
                            type: 'Center Hospital',
                        },
                        {
                            id: 11,
                            name: 'Teaching Hospital',
                            nameNe: 'शिक्षण अस्पताल',
                            type: 'Teaching Hospital',
                        },
                        {
                            id: 12,
                            name: 'Regional Hospital',
                            nameNe: 'क्षेत्रीय अस्पताल',
                            type: 'Regional Hospital',
                        },
                        {
                            id: 13,
                            name: 'Sub Regional Hospital',
                            nameNe: 'उपक्षेत्रीय अस्पताल',
                            type: 'Sub Regional Hospital',
                        },
                        {
                            id: 14,
                            name: 'Zonal Hospital',
                            nameNe: 'अञ्चल अस्पताल',
                            type: 'Zonal Hospital',
                        },
                        {
                            id: 15,
                            name: 'District Hospital',
                            nameNe: 'जिल्ला अस्पताल',
                            type: 'District Hospital',
                        },
                        {
                            id: 16,
                            name: 'Basic Hospital',
                            nameNe: 'आधारभूत अस्पताल',
                            type: 'Basic Hospital',
                        },
                        {
                            id: 17,
                            name: 'General Hospital',
                            nameNe: 'सामान्य अस्पताल',
                            type: 'General Hospital',
                        },
                        {
                            id: 18,
                            name: 'Primary Health Care Center',
                            nameNe: 'प्राथमिक स्वास्थ्य सेवा केन्द्र',
                            type: 'Primary Health Care Center',
                        },
                        {
                            id: 19,
                            name: 'Health Post',
                            nameNe: 'स्वास्थ्य चौकी ',
                            type: 'Health Post',
                        },
                        {
                            id: 20,
                            name: 'District Clinic (Including Institutional)',
                            nameNe: 'जिल्ला क्लिनिक ',
                            type: 'District Clinic (Including Institutional)',

                        },
                        {
                            id: 21,
                            name: 'Urban Health Center',
                            nameNe: 'शहरी स्वास्थ्य केन्द्र',
                            type: 'Urban Health Center',

                        },
                        {
                            id: 22,
                            name: 'Community Health Unit',
                            nameNe: 'सामुदायिक स्वास्थ्य इकाई',
                            type: 'Community Health Unit',

                        },
                        {
                            id: 23,
                            name: 'Poly Clinic',
                            nameNe: 'पोली क्लिनिक',
                            type: 'Poly Clinic',

                        },
                        {
                            id: 24,
                            name: 'Clinic',
                            nameNe: 'क्लिनिक',
                            type: 'Clinic',

                        },
                        {
                            id: 25,
                            name: 'Dental Clinic',
                            nameNe: 'दन्त चिकित्सा क्लिनिक',
                            type: 'Dental Clinic',

                        },
                        {
                            id: 26,
                            name: 'Diagnostic Center',
                            nameNe: 'निदान केन्द्र',
                            type: 'Diagnostic Center',

                        },
                        {
                            id: 27,
                            name: 'Nursing Home',
                            nameNe: 'नर्सिंग होम',
                            type: 'Nursing Home',

                        },
                        {
                            id: 28,
                            name: 'Rehabilitation',
                            nameNe: 'पुनर्स्थापना केन्द्र',
                            type: 'Rehabilitation',

                        },
                        {
                            id: 29,
                            name: 'Ayurveda Hospital',
                            nameNe: 'आयुर्वेदिक अस्पताल',
                            type: 'Ayurveda Hospital',

                        },
                        {
                            id: 30,
                            name: 'Zonal Ayurveda Aushadhalaya',
                            nameNe: 'अञ्चल आयुर्वेद औषधालय',
                            type: 'Zonal Ayurveda Aushadhalaya',

                        },
                        {
                            id: 31,
                            name: 'District Ayurveda Health Center',
                            nameNe: 'जिल्ला आयुर्वेद स्वास्थ्य केन्द्र',
                            type: 'District Ayurveda Health Center',

                        },
                        {
                            id: 32,
                            name: 'Ayurveda Aushadhalaya',
                            nameNe: 'आयुर्वेद औषधालय',
                            type: 'Ayurveda Aushadhalaya',

                        },
                        {
                            id: 33,
                            name: 'Homeopathy Hospital',
                            nameNe: 'होमियोप्याथी अस्पताल',
                            type: 'Homeopathy Hospital',

                        },
                        {
                            id: 34,
                            name: 'Unani Hospital',
                            nameNe: 'युनानी अस्पताल',
                            type: 'Unani Hospital',

                        },
                        {
                            id: 35,
                            name: 'Primary Hospital',
                            nameNe: 'प्राथमिक अस्पताल',
                            type: 'Primary Hospital',

                        },
                        {
                            id: 36,
                            name: 'Secondary A Hospital',
                            nameNe: 'माध्यमिक ए अस्पताल',
                            type: 'Secondary A Hospital',

                        },
                        {
                            id: 37,
                            name: 'Secondary B Hospital',
                            nameNe: 'माध्यमिक बी अस्पताल',
                            type: 'Secondary B Hospital',

                        },
                        {
                            id: 38,
                            name: 'Tertiary Hospital',
                            nameNe: 'Tertiary अस्पताल',
                            type: 'Tertiary Hospital',

                        },
                        {
                            id: 39,
                            name: 'Super Specialized Hospital',
                            nameNe: 'सुपर स्पेशलाइज्ड अस्पताल',
                            type: 'Super Specialized Hospital',

                        },
                        {
                            id: 40,
                            name: 'Basic Health Care Center',
                            nameNe: 'आधारभूत स्वास्थ्य सेवा केन्द्र',
                            type: 'Basic Health Care Center',

                        },
                        {
                            id: 41,
                            name: 'Veterinary',
                            nameNe: 'पशु चिकित्सा',
                            type: 'Veterinary',

                        },
                        {
                            id: 42,
                            name: 'Pathology',
                            nameNe: 'रोगविज्ञान',
                            type: 'Pathology',

                        },
                        {
                            id: 43,
                            name: 'Pharmacy',
                            nameNe: 'फार्मेसी',
                            type: 'Pharmacy',

                        },
                    ],
                },
                {
                    id: 3,
                    name: 'Banking & Finance',
                    nameNe: 'बैंकिङ तथा वित्त संस्था ',
                    resourceType: 'finance',
                    attribute: 'type',
                    level: 1,
                    subCategory: [
                        {
                            id: 44,
                            name: 'Commercial',
                            nameNe: 'वाणिज्यि बैंक',
                            type: 'Commercial',
                        },
                        {
                            id: 45,
                            name: 'Micro Credit Development',
                            nameNe: 'माइक्रो क्रेडिट विकास बैंक',
                            type: 'Micro Credit Development',
                        },
                        {
                            id: 46,
                            name: 'Finance',
                            nameNe: 'वित्त संस्था ',
                            type: 'Finance',
                        },
                        {
                            id: 47,
                            name: 'Development Bank',
                            nameNe: 'विकास बैंक',
                            type: 'Development Bank',
                        },
                        {
                            id: 48,
                            name: 'Cooperative',
                            nameNe: 'सहकारीसंस्था ',
                            type: 'Cooperative',
                        },
                        {
                            id: 49,
                            name: 'Money Exchange',
                            nameNe: 'मनी एक्सचेन्ज',
                            type: 'Money Exchange',
                        },
                        {
                            id: 50,
                            name: 'ATM',
                            nameNe: 'एटीएम',
                            type: 'ATM',
                        },

                    ],
                },
                {
                    id: 4,
                    name: 'Communication',
                    nameNe: 'सञ्चार सुबिधा',
                    resourceType: 'communication',
                    attribute: 'type',
                    level: 1,
                    subCategory: [
                        {
                            id: 51,
                            name: 'FM Radio',
                            nameNe: 'एफएम रेडियो',
                            type: 'FM Radio',
                        },
                        {
                            id: 52,
                            name: 'TV Station',
                            nameNe: 'टिभी स्टेशन',
                            type: 'TV Station',
                        },
                        {
                            id: 53,
                            name: 'Newspapers',
                            nameNe: 'पत्रपत्रिकाहरू',
                            type: 'Newspapers',
                        },
                        {
                            id: 54,
                            name: 'Phone Service',
                            nameNe: 'मोबाइल फोन',
                            type: 'Phone Service',
                        },
                        {
                            id: 55,
                            name: 'Cable',
                            nameNe: 'केबल',
                            type: 'Cable',
                        },
                        {
                            id: 56,
                            name: 'Online Media',
                            nameNe: 'अनलाइन मिडिया',
                            type: 'Online Media',
                        },
                        {
                            id: 57,
                            name: 'Internet Service Provider',
                            nameNe: 'इन्टरनेट सेवा प्रदायक',
                            type: 'Internet Service Provider',
                        },

                    ],
                },
                {
                    id: 5,
                    name: 'Governance',
                    nameNe: 'संस्थागत विवरण',
                    resourceType: 'governance',
                    attribute: 'type',
                    level: 1,
                    subCategory: [
                        {
                            id: 58,
                            name: 'Government',
                            nameNe: 'सरकारी',
                            type: 'Government',
                        },
                        {
                            id: 59,
                            name: 'INGO',
                            nameNe: 'अन्तर्राष्ट्रिय गैर सरकारी संस्था',
                            type: 'INGO',
                        },
                        {
                            id: 60,
                            name: 'NGO',
                            nameNe: 'गैर सरकारी संस्था',
                            type: 'NGO',
                        },
                        {
                            id: 61,
                            name: 'CSO',
                            nameNe: 'सामुदायीक संस्था',
                            type: 'CSO',
                        },
                        {
                            id: 62,
                            name: 'Other',
                            nameNe: 'अन्‍य',
                            type: 'Other',
                        },

                    ],
                },
                {
                    id: 6,
                    name: 'Hotel & Restaurant',
                    nameNe: 'होटल तथा रेस्टुरेन्ट',
                    resourceType: 'hotelandrestaurant',
                    level: 1,
                    attribute: 'type',
                    subCategory: [
                        {
                            id: 63,
                            name: 'Hotel',
                            nameNe: 'होटल',
                            type: 'Hotel',
                        },
                        {
                            id: 64,
                            name: 'Restaurant',
                            nameNe: 'रेष्‍टुरेन्‍ट',
                            type: 'Restaurant',
                        },
                        {
                            id: 65,
                            name: 'Lodge',
                            nameNe: 'लज',
                            type: 'Lodge',
                        },
                        {
                            id: 66,
                            name: 'Resort',
                            nameNe: 'रिसोर्ट',
                            type: 'Resort',
                        },
                        {
                            id: 67,
                            name: 'Homestay',
                            nameNe: 'होमस्टे',
                            type: 'Homestay',
                        },


                    ],
                },
                {
                    id: 7,
                    name: 'Culture',
                    nameNe: 'धार्मिक स्थान',
                    resourceType: 'cultural',
                    attribute: 'religion',
                    level: 1,
                    subCategory: [
                        {
                            id: 68,
                            name: 'Hindu',
                            nameNe: 'हिन्दू धर्म',
                            type: 'Hindu',
                        },
                        {
                            id: 69,
                            name: 'Islam',
                            nameNe: 'इस्लाम धर्म',
                            type: 'Islam',
                        },
                        {
                            id: 70,
                            name: 'Christian',
                            nameNe: 'क्रिस्चियन धर्म',
                            type: 'Christian',
                        },
                        {
                            id: 71,
                            name: 'Buddhist',
                            nameNe: 'बौद्ध',
                            type: 'Buddhist',
                        },
                        {
                            id: 72,
                            name: 'Kirat',
                            nameNe: 'किरात',
                            type: 'Kirat',
                        },
                        {
                            id: 73,
                            name: 'Sikhism',
                            nameNe: 'सिख धर्म',
                            type: 'Sikhism',
                        },
                        {
                            id: 74,
                            name: 'Judaism',
                            nameNe: 'यहूदी धर्म',
                            type: 'Judaism',
                        },
                        {
                            id: 75,
                            name: 'Other',
                            nameNe: 'अन्य',
                            type: 'Other',
                        },

                    ],
                },
                {
                    id: 8,
                    name: 'Industry',
                    nameNe: 'उद्योग',
                    resourceType: 'industry',
                    attribute: 'subtype',
                    level: 1,
                    subCategory: [
                        {
                            id: 76,
                            name: 'Cottage Industry',
                            nameNe: 'घरेलु उद्योग',
                            type: 'Cottage Industry',
                        },
                        {
                            id: 77,
                            name: 'Micro Industry',
                            nameNe: 'माइक्रो उद्योग',
                            type: 'Micro Industry',
                        },
                        {
                            id: 78,
                            name: 'Small Industry',
                            nameNe: 'साना उद्योग',
                            type: 'Small Industry',
                        },
                        {
                            id: 79,
                            name: 'Medium Industry',
                            nameNe: 'मध्यम उद्योग',
                            type: 'Medium Industry',
                        },
                        {
                            id: 80,
                            name: 'Large Industry',
                            nameNe: 'ठूला उद्योग',
                            type: 'Large Industry',
                        },
                        {
                            id: 999,
                            name: 'Other',
                            nameNe: 'अन्‍य',
                            type: 'Other',
                        },
                    ],
                },
                {
                    id: 9,
                    name: 'Bridge',
                    nameNe: 'पुल',
                    resourceType: 'bridge',
                    level: 1,
                    attribute: 'type',
                    subCategory: [
                        {
                            id: 81,
                            name: 'Arch Bridge',
                            nameNe: 'आर्क पुल',
                            type: 'Arch',
                        },
                        {
                            id: 82,
                            name: 'Beam Bridge',
                            nameNe: 'बिम पुल',
                            type: 'Beam',
                        },
                        {
                            id: 83,
                            name: 'Cantilever Bridge',
                            nameNe: 'क्यान्टिलिभर पुल',
                            type: 'Cantilever',
                        },
                        {
                            id: 84,
                            name: 'Wooden Bridge',
                            nameNe: 'काठको पुल',
                            type: 'Wooden',
                        },
                        {
                            id: 85,
                            name: 'Suspension Bridge',
                            nameNe: 'सस्पेंशन पुल',
                            type: 'Suspension',
                        },
                        {
                            id: 86,
                            name: 'Cable-stayed Bridge',
                            nameNe: 'केबल रहेको पुल',
                            type: 'Cable-stayed',
                        },
                        {
                            id: 87,
                            name: 'Culvert Bridge',
                            nameNe: 'कल्भर्ट पुल',
                            type: 'Culvert',
                        },
                        {
                            id: 88,
                            name: 'Bailey Bridge',
                            nameNe: 'बेली पुल',
                            type: 'Bailey',
                        },
                        {
                            id: 89,
                            name: 'Truss Bridge',
                            nameNe: 'ट्रस पुल',
                            type: 'Truss',
                        },
                        {
                            id: 90,
                            name: 'Other',
                            nameNe: 'अन्‍य',
                            type: 'Other',

                        },


                    ],
                },
                // {
                //     // id: 10,
                //     name: 'Transportation',
                //     // resourceType: 'transportation',
                //     typeName: 'transportation',
                //     level: 2,
                //     // attribute: 'type',
                //     Category: [
                //         {
                //             id: 10,
                //             name: 'Roadway',
                //             resourceType: 'roadway',
                //             attribute: 'kindOfVehicle',
                //             subCategory: [
                //                 {
                //                     id: 91,
                //                     name: 'Bus',
                //                     type: 'Bus',
                //                 },
                //                 {
                //                     id: 92,
                //                     name: 'Micro',
                //                     type: 'Micro',
                //                 },
                //                 {
                //                     id: 93,
                //                     name: 'Van',
                //                     type: 'Van',
                //                 },
                //                 {
                //                     id: 94,
                //                     name: 'Other',
                //                     type: 'Other',
                //                 },

                //             ],
                //         },
                //         {
                //             id: 11,
                //             name: 'Waterway',
                //             resourceType: 'waterway',
                //             attribute: 'type',
                //             subCategory: [
                //                 {
                //                     id: 95,
                //                     name: 'General Boat',
                //                     type: 'General Boat',
                //                 },
                //                 {
                //                     id: 96,
                //                     name: 'Electrical Boat',
                //                     type: 'Electrical Boat',
                //                 },
                //                 {
                //                     id: 97,
                //                     name: 'Other',
                //                     type: 'Other',
                //                 },

                //             ],
                //         },
                //         {
                //             id: 12,
                //             name: 'Airway',
                //             resourceType: 'airway',
                //             attribute: 'type',
                //             subCategory: [
                //                 {
                //                     id: 98,
                //                     name: 'National',
                //                     type: 'National',
                //                 },
                //                 {
                //                     id: 99,
                //                     name: 'International',
                //                     type: 'International',
                //                 },


                //             ],
                //         },
                //         {
                //             id: 13,
                //             name: 'Helipad',
                //             resourceType: 'helipad',
                //             attribute: '',
                //             subCategory: [],
                //         },


                //     ],
                // },

                {
                    id: 14,
                    name: 'Electricity',
                    nameNe: 'ऊर्जा सेवा',
                    resourceType: 'electricity',
                    attribute: 'components',
                    level: 1,
                    subCategory: [
                        {
                            id: 100,
                            name: 'Hydropower',
                            nameNe: 'जलविद्युत',
                            type: 'Hydropower',
                        },
                        {
                            id: 101,
                            name: 'Substation',
                            nameNe: 'सब स्टेशन',
                            type: 'Substation',
                        },
                        {
                            id: 102,
                            name: 'Dam',
                            nameNe: 'बाँध',
                            type: 'Dam',
                        },
                        {
                            id: 103,
                            name: 'Transmission Pole',
                            nameNe: 'प्रसारण लाइन',
                            type: 'Transmission Pole',
                        },
                        {
                            id: 104,
                            name: 'Other',
                            nameNe: 'अन्‍य',
                            type: 'Other',

                        },


                    ],
                },


                // {

                //     name: 'Fire Fighting Apparatus',

                //     typeName: 'Fire Fighting Apparatus',
                //     level: 2,

                //     Category: [
                //         {
                //             id: 15,
                //             name: 'Fire Engine',
                //             resourceType: 'fireengine',
                //             attribute: 'type',
                //             subCategory: [],
                //         },


                //     ],
                // },


                // {
                //     id: 15,
                //     name: 'Fire Fighting Apparatus',
                //     resourceType: 'firefightingapparatus',
                //     attribute: 'type',
                //     level: 1,
                //     subCategory: [
                //         {
                //             id: 86,
                //             name: 'Fire Engine',
                //             type: 'Fire Engine',
                //         },
                //         {
                //             id: 87,
                //             name: 'Fire Bike',
                //             type: 'Fire Bike',
                //         },
                //         {
                //             id: 88,
                //             name: 'Other',
                //             type: 'Other',
                //         },


                //     ],
                // },
                {
                    id: 16,
                    name: 'Sanitation Service',
                    nameNe: 'सरसफाई सेवा',
                    resourceType: 'sanitation',
                    attribute: 'type',
                    level: 1,
                    subCategory: [
                        {
                            id: 105,
                            name: 'Landfill',
                            nameNe: 'ल्यान्डफिल',
                            type: 'Landfill',
                        },
                        {
                            id: 106,
                            name: 'Dumping Site',
                            nameNe: 'डम्पिङ साइट',
                            type: 'Dumping Site',
                        },
                        {
                            id: 107,
                            name: 'Public Toilet',
                            nameNe: 'सार्वजनिक शौचालय',
                            type: 'Public Toilet',
                        },


                    ],
                },
                {
                    id: 17,
                    name: 'Water Supply Infrastructure',
                    nameNe: 'पानी आपूर्ति आयोजना',
                    resourceType: 'watersupply',
                    attribute: 'scale',
                    level: 1,
                    subCategory: [
                        {
                            id: 108,
                            name: 'Small',
                            nameNe: 'सानो आयोजना ',
                            type: 'Small',
                        },
                        {
                            id: 109,
                            name: 'Medium',
                            nameNe: 'मध्यम आयोजन ',
                            type: 'Medium',
                        },
                        {
                            id: 110,
                            name: 'Large',
                            nameNe: 'ठूला आयोजन',
                            type: 'Large',
                        },


                    ],
                },
                {
                    id: 24,
                    name: 'Roadway',
                    nameNe: 'स्थलमार्ग सुबिधा',
                    resourceType: 'roadway',
                    level: 1,
                    attribute: 'kindOfVehicle',
                    subCategory: [
                        {
                            id: 91,
                            name: 'Bus',
                            nameNe: 'बस',
                            type: 'Bus',
                        },
                        {
                            id: 92,
                            name: 'Micro',
                            nameNe: 'माइक्रो  बस',
                            type: 'Micro',
                        },
                        {
                            id: 93,
                            name: 'Van',
                            nameNe: 'भ्यान',
                            type: 'Van',
                        },
                        {
                            id: 94,
                            name: 'Other',
                            nameNe: 'अन्‍य',
                            type: 'Other',
                        },

                    ],
                },
                {
                    id: 25,
                    name: 'Waterway',
                    nameNe: 'जलमार्ग',
                    resourceType: 'waterway',
                    level: 1,
                    attribute: 'type',
                    subCategory: [
                        {
                            id: 95,
                            name: 'General Boat',
                            nameNe: 'सामान्य डुङ्गा',
                            type: 'General Boat',
                        },
                        {
                            id: 96,
                            name: 'Electrical Boat',
                            nameNe: 'विद्युतीय डुङ्गा',
                            type: 'Electrical Boat',
                        },
                        {
                            id: 97,
                            name: 'Other',
                            nameNe: 'अन्‍य',
                            type: 'Other',
                        },

                    ],
                },
                {
                    id: 26,
                    name: 'Airway',
                    nameNe: 'हवाई सुबिधा',
                    resourceType: 'airway',
                    level: 1,
                    attribute: 'type',
                    subCategory: [
                        {
                            id: 98,
                            name: 'National',
                            nameNe: 'राष्ट्रिय हवाई सुबिधा',
                            type: 'National',
                        },
                        {
                            id: 99,
                            name: 'International',
                            nameNe: 'अन्तर्राष्ट्रिय हवाई सुबिधा',
                            type: 'International',
                        },


                    ],
                },
                {
                    id: 28,
                    name: 'Fire Fighting Apparatus',
                    nameNe: 'अग्नी नियनत्रण उपकरण',
                    resourceType: 'firefightingapparatus',
                    attribute: 'typeOfApparatus',
                    level: 1,
                    subCategory: [
                        {
                            id: 86,
                            name: 'Fire Engine',
                            nameNe: 'दमकल',
                            type: 'Fire Engine',
                        },
                        {
                            id: 87,
                            name: 'Fire Bike',
                            nameNe: 'फायर बाइक',
                            type: 'Fire Bike',
                        },
                        {
                            id: 88,
                            name: 'Other',
                            nameNe: 'अन्य',
                            type: 'Other',
                        },


                    ],
                },
                {
                    id: 27,
                    name: 'Helipad',
                    nameNe: 'हेलिप्याड',
                    resourceType: 'helipad',
                    attribute: '',
                    level: 1,
                    subCategory: [],
                },
                // {
                //     id: 23,
                //     name: 'Fire Engine',
                //     resourceType: 'fireengine',
                //     attribute: 'type',
                //     level: 1,
                //     subCategory: [
                //         {
                //             id: 86,
                //             name: 'Fire Engine',
                //             type: 'Fire Engine',
                //         },
                //         {
                //             id: 87,
                //             name: 'Fire Bike',
                //             type: 'Fire Bike',
                //         },
                //         {
                //             id: 88,
                //             name: 'Other',
                //             type: 'Other',
                //         },


                //     ],
                // },
                // {

                //     name: 'Open Space',

                //     typeName: 'Open Space',
                //     level: 2,

                //     Category: [
                //         {
                //             id: 18,
                //             name: 'Humanitarian Open Space',
                //             resourceType: 'openspace',
                //             attribute: '',
                //             subCategory: [],
                //         },
                //         {
                //             id: 19,
                //             name: 'Community Space',
                //             resourceType: 'communityspace',
                //             attribute: '',
                //             subCategory: [],
                //         },


                //     ],
                // },
                {
                    id: 20,
                    name: 'Humanitarian Open Space',
                    nameNe: 'मानवीय खुल्ला स्थान',
                    resourceType: 'openspace',
                    attribute: '',
                    level: 1,
                    subCategory: [],
                },
                {
                    id: 21,
                    name: 'Community Space',
                    nameNe: 'सामुदायिक खुल्ला स्थान',
                    resourceType: 'communityspace',
                    attribute: '',
                    level: 1,
                    subCategory: [],
                },
                {
                    id: 22,
                    name: 'Evacuation Centre',
                    nameNe: 'आपतकालीन सेल्टर',
                    resourceType: 'evacuationcentre',
                    attribute: '',
                    level: 1,
                    subCategory: [],
                },
                {
                    id: 29,
                    name: 'Godam',
                    nameNe: 'गोदाम',
                    resourceType: 'warehouse',
                    attribute: '',
                    level: 1,
                    subCategory: [],
                },
            ],

        };

        const { faramValues: { region },faramValues } = filters;
        const { inventoryItems } = filterss;
        resourceGetRequest.setDefaultParams(
            {
                setResourceList: this.setResourceList,
                setIndividualResourceList: this.setIndividualResourceList,
                getRegionDetails: this.getRegionDetails,
                region,
                inventoryItems,
                ErrorData: this.handleErrorData,
                // filterClickCheckCondition: isFilterClicked,
            },
        );
        this.props.requests.warehouseSubCategoryGet.setDefaultParams({
            getWarehouseData: this.getWarehouseSubCategory,
        });
    }


    public componentDidMount() {
        const {
            palikaRedirect,
            setPalikaRedirect,
            handleCarActive,
            filters,
            setFilters,
            user,
            wards,
        } = this.props;
        handleCarActive(true);

        this.setState({
            palikaRedirectState: palikaRedirect.showForm,
        });

        // setPalikaRedirect({ showForm: false });
        const { filters: faramValues } = this.props;
        this.setState({ faramValues });
        const isLoggedIn = checkPermission(user, 'change_resource', 'resources');
        this.setState({
            isLoggedInUser: isLoggedIn,
        });
        const temp = {};
        wards.map((ward: PageType.Ward) => {
            temp[ward.id] = ward.title;
            return null;
        });
        this.setState({ wardsRef: temp });
    }

    public componentDidUpdate(prevProps: { filters: { faramValues: { region: any } } }, prevState: { PreserveresourceCollection: any }, snapshot: any) {
        const { faramValues: { region } } = this.props.filters;
        const { inventoryItems } = this.props.filterss;
        const { carKeys } = this.props;
        const { isFilterClicked, FilterClickedStatus } = this.context;
        const { PreserveresourceCollection, resourceCollection, selectedCategoryName,
            selectCategoryForinitialFilter, selectedSubCategorynameList, selectedSubCategoryName, checked } = this.state;
        if ((prevProps.filters.faramValues.region !== this.props.filters.faramValues.region)) {
            this.setState({ disableCheckbox: true });
            if (carKeys.length === 0) {
                this.setState({ disableCheckbox: false });
                this.setState({
                    resourceCollection: {
                        education: [],
                        health: [],
                        finance: [],
                        governance: [],
                        hotelandrestaurant: [],
                        cultural: [],
                        industry: [],
                        communication: [],
                        openspace: [],
                        communityspace: [],
                        firefightingapparatus: [],
                        fireengine: [],
                        helipad: [],
                        bridge: [],
                        roadway: [],
                        waterway: [],
                        airway: [],
                        electricity: [],
                        sanitation: [],
                        watersupply: [],
                        evacuationcentre: [],
                        warehouse: [],


                    },
                });
            }
            if (carKeys.length) {
                const tempResourceCollection = PreserveresourceCollection;
                let tempResourcelistKey = Object.keys(tempResourceCollection);
                tempResourcelistKey = tempResourcelistKey.filter(item => !carKeys.includes(item));

                tempResourcelistKey.map((item, index) => (
                    tempResourceCollection[item] = []

                ));

                // this.setState({
                //     // resourceCollection: {
                //     //     ...this.state.resourceCollection,

                //     //     education: [],
                //     // },

                //     PreserveresourceCollection: tempResourceCollection,

                // });
                this.setState(() => ({
                    PreserveresourceCollection: tempResourceCollection,
                  }));
                this.props.requests.resourceGetRequest.do(
                    {
                        region,
                        inventoryItems,
                        resourceType: carKeys,
                        filterClickCheckCondition: isFilterClicked,
                        handleErrorData: this.handleErrorData,
                    },
                );
            }
        }
        if ((prevProps.filterss.inventoryItems !== this.props.filterss.inventoryItems)) {
            if (carKeys.length) {
                const tempResourceCollection = PreserveresourceCollection;
                let tempResourcelistKey = Object.keys(tempResourceCollection);
                tempResourcelistKey = tempResourcelistKey.filter(item => !carKeys.includes(item));

                tempResourcelistKey.map((item, index) => (
                    tempResourceCollection[item] = []

                ));
                this.setState(() => ({
                    PreserveresourceCollection: tempResourceCollection,
                }));


                this.props.requests.resourceGetRequest.do(
                    {
                        region,
                        inventoryItems,
                        resourceType: carKeys,
                        filterClickCheckCondition: isFilterClicked,
                        handleErrorData: this.handleErrorData,
                    },
                );
            }
        }
        if (prevState.PreserveresourceCollection !== this.state.PreserveresourceCollection) {
            if (isFilterClicked) {
                this.setState({
                    resourceCollection: PreserveresourceCollection,

                });
            } else if (selectedSubCategoryName) {
                const resourceColln = resourceCollection || PreserveresourceCollection;
                const filtering = PreserveresourceCollection[selectedSubCategoryName].filter((d: { [x: string]: any }) => selectedSubCategorynameList.includes(d[selectCategoryForinitialFilter[0].attribute]));
                const resourceCollectionUpdate = { ...resourceCollection };


                resourceCollectionUpdate[selectedSubCategoryName] = filtering || [];

                const finalCollection = { ...resourceColln, [selectedSubCategoryName]: filtering };


                if (checked === 'Checked') {
                    const finalFiltering = PreserveresourceCollection[selectedSubCategoryName];

                    const filteredFinalCollection = { ...finalCollection, [selectedSubCategoryName]: finalFiltering };

                    this.setState({
                        resourceCollection: filteredFinalCollection,
                    });
                } else {
                    this.setState({
                        resourceCollection: finalCollection,
                    });
                }
            } else {
                this.setState({
                    resourceCollection: PreserveresourceCollection,
                });
            }
        }

        const reportWindowSize = () => {
            const addResBtnElement = document.getElementById('addResourceButton');
            if (addResBtnElement) {
                const left = addResBtnElement.offsetLeft;
                const top = addResBtnElement.offsetTop;
                positionModal.top = top;
                positionModal.left = left;
            }
        };
        reportWindowSize();
        window.addEventListener('resize', reportWindowSize);
    }

    public componentWillUnmount() {
        const { handleCarActive, handleActiveLayerIndication } = this.props;
        handleCarActive(false);
        handleActiveLayerIndication(initialActiveLayersIndication);
    }

    public handleErrorData = () => {
        this.setState({ ErrorData: 'Error in Network Connection' });
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
            return { province: provinces.find((p: { id: any }) => p.id === geoarea).id };
        }

        if (adminLevel === 2) {
            return { district: districts.find((p: { id: any }) => p.id === geoarea).id };
        }

        if (adminLevel === 3) {
            return { municipality: municipalities.find((p: { id: any }) => p.id === geoarea).id };
        }
        return '';
    }

    private getWarehouseSubCategory=(data: any) => {
        const { capacity_resource }=this.state;
        const finalData=data.map((i: { id: any; title: any }) => ({
            id: i.id+500,
            originalId: i.id,
            name: i.title,
            nameNe: i.title,
            type: i.title,
        }));
        const updatedCapacityResource = capacity_resource.map((item: { id: number }) => (item.id === 29 ? { ...item, subCategory: finalData } : item));

        this.setState({
            warehouseSubCategory: finalData,
            capacity_resource: updatedCapacityResource,
        });
    }

    private DeletedResourceApiRecall = () => {
        const { isFilterClicked } = this.context;
        const { carKeys, requests: { resourceGetRequest }, filters: { faramValues: { region } } } = this.props;
        const { inventoryItems } = this.props.filterss;
        resourceGetRequest.do({
            resourceType: carKeys,
            region,
            inventoryItems,
            filterClickCheckCondition: isFilterClicked,
            handleErrorData: this.handleErrorData,
        });
    }

    private handleToggleClick = (key: toggleValues, value: boolean, typeName: undefined, filteredSubCategoriesLvl2ResourceType: any[] | undefined, lvl2UncheckCondition: boolean | undefined) => {
        const { activeLayersIndication, resourceCollection, categoryLevel, selectedCategoryName, subCategoryCheckboxChecked } = this.state;
        const temp = filteredSubCategoriesLvl2ResourceType || key ? { ...activeLayersIndication } : { ...initialActiveLayersIndication };
        const { setCarKeys, carKeys } = this.props;
        const { inventoryItems } = this.props.filterss;
        const { isFilterClicked, FilterClickedStatus } = this.context;
        temp[key] = value;
        if (key) {
            temp[key] = typeName ? true : value;
        }
        if (filteredSubCategoriesLvl2ResourceType) {
            const data = filteredSubCategoriesLvl2ResourceType.map((item: string | number) => (
                temp[item] = lvl2UncheckCondition
            ));
        }
        const trueKeys = Object.keys(temp).filter(id => temp[id]);
        this.setState({ activeLayersIndication: temp });
        const { handleActiveLayerIndication } = this.props;
        handleActiveLayerIndication(temp);
        const checkingResourceCollection = filteredSubCategoriesLvl2ResourceType && filteredSubCategoriesLvl2ResourceType.map(((item: string | number) => (
            !!resourceCollection[item].length
        ))).filter((item: boolean) => item === true);
        const filterCarKeys = carKeys.find((d: string) => d === key);
        if (filterCarKeys) {
            const data = carKeys.filter((d: string) => d !== key);
            setCarKeys(data);
        } else {
            setCarKeys([...carKeys, key]);
        }
        if (typeName && checkingResourceCollection && (checkingResourceCollection.length !== filteredSubCategoriesLvl2ResourceType.length)) {
            const newArr = [];
            filteredSubCategoriesLvl2ResourceType.map((item: any) => newArr.push(item));
            // newArr.push(filteredSubCategoriesLvl2ResourceType);

            if (carKeys.length === 1) {
                newArr.push(carKeys[0]);
            } else {
                newArr.push(...carKeys);
            }
            setCarKeys(newArr);
            this.setState({ disableCheckbox: true });
            if (newArr.length === 0) {
                this.setState({ disableCheckbox: false });
            }
            if (newArr.length) {
                this.props.requests.resourceGetRequest.do({
                    resourceType: newArr,
                    region: this.props.filters.faramValues.region,
                    inventoryItems,
                    filterClickCheckCondition: isFilterClicked,
                    handleErrorData: this.handleErrorData,
                });
            }
        } else if (temp[key] && resourceCollection[key].length === 0) {
            const newArr = [];
            newArr.push(key);
            if (carKeys.length === 1) {
                newArr.push(carKeys[0]);
            } else {
                newArr.push(...carKeys);
            }
            setCarKeys(newArr);
            this.setState({ disableCheckbox: true });
            if (newArr.length === 0) {
                this.setState({ disableCheckbox: false });
            }
            if (newArr.length) {
                this.props.requests.resourceGetRequest.do({
                    resourceType: newArr,
                    region: this.props.filters.faramValues.region,
                    inventoryItems,
                    filterClickCheckCondition: isFilterClicked,
                    handleErrorData: this.handleErrorData,
                });
            }
        } else return null;
        return null;
    }

    private getUserParams = memoize(getParams);

    private setResourceList = (resourceList: PageType.Resource[]) => {
        this.setState({ disableCheckbox: false });
        this.setState({ resourceList });
    }

    private setIndividualResourceList = (key: toggleValues, resourceList: PageType.Resource[], resourceType: any[], Result: any[]) => {
        const { resourceCollection, subCategoryCheckboxChecked, reserveListForOtherFilter,capacity_resource,
            selectCategoryForinitialFilter, selectedSubCategoryName, categoryLevel, lvl2catName, filteredSubCategoriesLvl2ResourceType, PreserveresourceCollection, lvl2TypeName } = this.state;
        // const temp = { ...resourceCollection };
        const { carKeys } = this.props;
        const { FilterClickedStatus, isFilterClicked } = this.context;
        this.setState({ disableCheckbox: false });
        if (isFilterClicked) {
            const temp = { ...PreserveresourceCollection };
            carKeys.map((i: string | number) => (
                temp[i] = Result.filter((d: { resourceType: any }) => d.resourceType === i)
            ));
            this.setState({
                PreserveresourceCollection: temp,
            });
            FilterClickedStatus(false);
            const mainCat = carKeys.map((i: string) => (capacity_resource
                .filter((d: { resourceType: string }) => d.resourceType === i)
                .map((name: { name: any }) => name.name)));
            const subCat = carKeys.map((i: string) => (capacity_resource
                .filter((d: { resourceType: string }) => d.resourceType === i)
                .map((itm: { subCategory: any[] }) => itm.subCategory.map((subCate: { id: any }) => subCate.id))));
            const finalCategoryList = [];

            for (let i = 0; i < mainCat.length; i++) {
                const data = mainCat[i];
                finalCategoryList.push(...data);
            }
            const finalSubCategoryList = [];
            for (let i = 0; i < subCat.length; i++) {
                const data = subCat[i][0];
                finalSubCategoryList.push(...data);
            }
            this.setState({
                mainCategoryCheckboxChecked: finalCategoryList,
                subCategoryCheckboxChecked: finalSubCategoryList,
            });
        } else {
            const temp = { ...PreserveresourceCollection };
            if (lvl2TypeName) {
                const resourceLists = resourceType.map((item: string | number) => (

                    temp[item] = Result.filter((data: { resourceType: any }) => data.resourceType === item)
                ));
            } else {
                // temp[key] = resourceList;
                resourceType.map((item: string | number) => (

                    temp[item] = Result.filter((data: { resourceType: any }) => data.resourceType === item)));
            }


            const subCatList = categoryLevel === 2
                ? lvl2TypeName ? capacity_resource.filter((item: { name: any }) => item.name === lvl2catName)
                    .map((data: { Category: any }) => data.Category)[0].filter((item: { resourceType: any }) => filteredSubCategoriesLvl2ResourceType.includes(item.resourceType)).map((r: { subCategory: any }) => r.subCategory)
                    : capacity_resource.filter((item: { name: any }) => item.name === lvl2catName)
                        .map((data: { Category: any }) => data.Category)[0].filter((item: { resourceType: any }) => item.resourceType === selectedSubCategoryName)[0].subCategory.map((data: { type: any }) => data.type)
                : capacity_resource.filter((item: { resourceType: any }) => item.resourceType === selectedSubCategoryName)[0].subCategory.map((data: { type: any }) => data.type);
            let RawsubCatName = lvl2TypeName ? [] : subCatList;

            if (lvl2TypeName) {
                for (let i = 0; i < subCatList.length; i++) {
                    RawsubCatName = [...RawsubCatName, ...subCatList[i]];
                }
            }
            const subCatName = lvl2TypeName ? RawsubCatName.map((i: { type: any }) => i.type) : subCatList;

            const filteredOtherSubCat = !lvl2TypeName && temp[selectedSubCategoryName].filter((item: { [x: string]: any }) => !subCatName.includes(item[selectCategoryForinitialFilter[0].attribute]));

            const finalFilteredOtherSubCat = !lvl2TypeName && temp[selectedSubCategoryName].map((data: { [x: string]: any }) => {
                const filteredSubCatOther = filteredOtherSubCat.filter((itm: { [x: string]: any }) => itm[selectCategoryForinitialFilter[0].attribute] === data[selectCategoryForinitialFilter[0].attribute]);
                return (
                    { ...data, [selectCategoryForinitialFilter[0].attribute]: filteredSubCatOther.length ? 'Other' : data[selectCategoryForinitialFilter[0].attribute] }
                );
            });
            const final = lvl2TypeName ? { ...temp } : { ...temp, [selectedSubCategoryName]: finalFilteredOtherSubCat };
            const keying = Object.keys(reserveListForOtherFilter);
            if (keying.length === 0) {
                this.setState({
                    reserveListForOtherFilter: final,
                    PreserveresourceCollection: final,
                });
            } else if (lvl2TypeName) {
                this.setState({ PreserveresourceCollection: final });
            } else {
                this.setState({
                    reserveListForOtherFilter: { ...reserveListForOtherFilter, [selectedSubCategoryName]: final[selectedSubCategoryName] },
                    PreserveresourceCollection: { ...reserveListForOtherFilter, [selectedSubCategoryName]: final[selectedSubCategoryName] },
                });
            }
        }
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
            hotelandrestaurant: [],
            cultural: [],
            industry: [],
            communication: [],
            openspace: [],
            communityspace: [],
            firefightingapparatus: [],
            fireengine: [],
            helipad: [],
            bridge: [],
            roadway: [],
            waterway: [],
            airway: [],
            electricity: [],
            sanitation: [],
            watersupply: [],
            evacuationcentre: [],
            warehouse: [],
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

    private resourceAdd = () => {
        const { setAddResource } = this.context;
        editResources = false;
        setAddResource(true);
        this.setState({
            checked: 'Empty',
            indeterminantConditionArray: [],
            mainCategoryCheckboxChecked: [],
            subCategoryCheckboxChecked: [],
            activeLayerKey: undefined,
            faramValues: undefined,
            activeLayersIndication: {
                education: false,
                health: false,
                finance: false,
                governance: false,
                hotelandrestaurant: false,
                cultural: false,
                industry: false,
                communication: false,
                openspace: false,
                communityspace: false,
                firefightingapparatus: false,
                fireengine: false,
                helipad: false,
                bridge: false,
                roadway: false,
                waterway: false,
                airway: false,
                electricity: false,
                sanitation: false,
                watersupply: false,
                evacuationcentre: false,
                warehouse: false,
            },
        });
        const { handleActiveLayerIndication } = this.props;
        handleActiveLayerIndication(initialActiveLayersIndication);
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

        const newSingleResource = produce(singleResource, (safeSingleResource: { [x: string]: PageType.Resource }) => {
            const index = singleResource.findIndex((r: { id: number }) => r.id === resourceId);
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

    private getWardTitle = (wardId: number) => {
        const { wardsRef } = this.state;
        return wardsRef[wardId];
    }

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

        if (map && map.getLayer('wms-openspace-layer')) {
            map.removeLayer('wms-openspace-layer');
        }
        if (map && map.getSource('wms-openspace-source')) {
            map.removeSource('wms-openspace-source');
        }
    }

    private handleLayerClick = (layerKey: ResourceTypeKeys) => {
        const { isFilterClicked, FilterClickedStatus } = this.context;
        const { carKeys } = this.props;
        this.setState({
            activeLayerKey: layerKey,
            showResourceForm: false,
            showInventoryModal: false,
        });
        this.setState({ disableCheckbox: true });
        if (carKeys.length === 0) {
            this.setState({ disableCheckbox: false });
        }
        if (carKeys.length) {
            this.props.requests.resourceGetRequest.do({
                resourceType: layerKey,
                filterClickCheckCondition: isFilterClicked,
                handleErrorData: this.handleErrorData,
            });
        }
    }

    private handleLayerUnselect = () => {
        const { map } = this.context;
        const nepalBounds = [
            80.05858661752784, 26.347836996368667,
            88.20166918432409, 30.44702867091792,
        ];
        // map.fitBounds(nepalBounds);
        // this.setState({ activeLayerKey: undefined });
        this.setState({
            checked: 'Empty',
            indeterminantConditionArray: [],
            mainCategoryCheckboxChecked: [],
            subCategoryCheckboxChecked: [],
            activeLayerKey: undefined,
            activeLayersIndication: {
                education: false,
                health: false,
                finance: false,
                governance: false,
                hotelandrestaurant: false,
                cultural: false,
                industry: false,
                communication: false,
                openspace: false,
                communityspace: false,
                firefightingapparatus: false,
                fireengine: false,
                helipad: false,
                bridge: false,
                roadway: false,
                waterway: false,
                airway: false,
                electricity: false,
                sanitation: false,
                watersupply: false,
                evacuationcentre: false,
                warehouse: false,
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
        const { setAddResource } = this.context;
        editResources = true;
        this.setState({
            showResourceForm: true,
            resourceLngLat: undefined,
            checked: 'Empty',
            indeterminantConditionArray: [],
            mainCategoryCheckboxChecked: [],
            subCategoryCheckboxChecked: [],
            activeLayerKey: undefined,
            activeLayersIndication: {
                education: false,
                health: false,
                finance: false,
                governance: false,
                hotelandrestaurant: false,
                cultural: false,
                industry: false,
                communication: false,
                openspace: false,
                communityspace: false,
                firefightingapparatus: false,
                fireengine: false,
                helipad: false,
                bridge: false,
                roadway: false,
                waterway: false,
                airway: false,
                electricity: false,
                sanitation: false,
                watersupply: false,
                evacuationcentre: false,
                warehouse: false,
            },
        });
        setAddResource(true);
    }

    private handleShowInventoryClick = () => {
        const { resourceInfo: { resourceType }, showInventoryModal } = this.state;
        if (resourceType === 'communityspace') {
            this.handleShowCommunitypaceDetails();
        } else if (resourceType === 'openspace') {
            this.handleShowOpenspaceDetailsClick();
        } else {
            this.setState({
                showInventoryModal: true,
                resourceLngLat: undefined,
            });
        }
    }

    private handleEditResourceFormCloseButtonClick = () => {
        this.setState({
            showResourceForm: false,
            palikaRedirectState: false,
        });

        const {
            palikaRedirect,
            setPalikaRedirect,

        } = this.props;
        // const { redirectTo } = palikaRedirect;
        // if (palikaRedirect.showForm) {
        //     setPalikaRedirect({
        //         showForm: false,
        //         redirectTo,
        //     });
        //     ReachRouter.navigate('/drrm-report/',
        //         { state: { showForm: true }, replace: true });
        // }
    }

    private handleInventoryModalClose = () => {
        const {
            setPalikaRedirect,
        } = this.props;

        this.setState({
            showInventoryModal: false,
        });
        // setPalikaRedirect({ showForm: false });
    }

    private handleSearchModalClose = () => {
        this.setState({
            showSearchModal: false,
        });
    }

    private handleIconClick = (key: string) => {
        this.setState({
            activeModal: key,
        });
    };

    private handleShowOpenspaceDetailsClick = (openspaceDeleted?: boolean) => {
        const { resourceInfo: { resourceType }, showInventoryModal } = this.state;
        if (resourceType === 'openspace') {
            this.setState(prevState => ({
                singleOpenspaceDetailsModal: !prevState.singleOpenspaceDetailsModal,
            }));
        } else {
            this.setState({
                showInventoryModal: !showInventoryModal,
                resourceLngLat: undefined,
            });
        }

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
        const { resourceInfo: { resourceType }, showInventoryModal } = this.state;

        if (resourceType === 'communityspace') {
            this.setState(prevState => ({
                CommunitySpaceDetailsModal: !prevState.CommunitySpaceDetailsModal,
            }));
        } else {
            this.setState({
                showInventoryModal: !showInventoryModal,
                resourceLngLat: undefined,
            });
        }


        if (communityspaceDeleted) {
            this.setState({
                resourceLngLat: undefined,
                resourceInfo: undefined,

            });
        }
    };

    private routeToOpenspace = (point: { coordinates: any }) => {
        if (window.navigator.geolocation) {
            // Geolocation available
            const { coordinates } = point;
            window.navigator.geolocation.getCurrentPosition((position) => {
                const directionsUrl = `https://www.google.com/maps/dir/'${position.coords.latitude},${position.coords.longitude}'/${coordinates[1]},${coordinates[0]}`;

                window.open(directionsUrl, '_blank');
            });
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
                ward: this.getWardTitle(ward),
                resourceType,
                point,
            },
        });
    };

    private handleSubCategory = (selectedResource: string, showSubCat: boolean, boolean: boolean | undefined) => {
        const { showSubCategory, resourceCategory, mainCategoryCheckboxChecked } = this.state;


        if (boolean !== undefined) {
            this.setState({
                showSubCategory: boolean,
            });
        } else {
            this.setState({
                showSubCategory: !showSubCategory,


            });
        }
        if (boolean !== undefined) {
            if (mainCategoryCheckboxChecked.find((item: any) => item === selectedResource)) {
                this.setState({
                    resourceCategory: mainCategoryCheckboxChecked.filter((item: any) => item !== selectedResource),

                });
            }
            if (mainCategoryCheckboxChecked.length === 0) {
                this.setState({
                    resourceCategory: [...mainCategoryCheckboxChecked, selectedResource],
                });
            } else if (!mainCategoryCheckboxChecked.find((item: any) => item === selectedResource)) {
                this.setState({
                    resourceCategory: [...mainCategoryCheckboxChecked, selectedResource],
                });
            } else {
                return null;
            }
        } else {
            if (resourceCategory.find((item: any) => item === selectedResource)) {
                this.setState({
                    resourceCategory: resourceCategory.filter((item: any) => item !== selectedResource),

                });
            }
            if (resourceCategory.length === 0) {
                this.setState({
                    resourceCategory: [...resourceCategory, selectedResource],
                });
            } else if (!resourceCategory.find((item: any) => item === selectedResource)) {
                this.setState({
                    resourceCategory: [...resourceCategory, selectedResource],
                });
            } else {
                return null;
            }
        }


        return null;
    }

    private handleMainCategoryCheckBox = (checkedCategory: string, resourceType: string, level: number, lvl2catName: string, typeName: string | undefined, showVisualization: undefined) => {
        const { mainCategoryCheckboxChecked, subCategoryCheckboxChecked, resourceCollection, categoryLevel, indeterminantConditionArray, PreserveresourceCollection,capacity_resource } = this.state;


        this.handleTooltipClose();
        this.setState({
            categoryLevel: level,
            lvl2catName,
        });

        this.setState({
            lvl2TypeName: typeName,
        });

        // this.handleSubCategory(checkedCategory);
        if (mainCategoryCheckboxChecked.find((item: any) => item === checkedCategory)) {
            if (showVisualization === undefined) {
                this.handleSubCategory(checkedCategory, true, false);
            }

            // const filteredSubCategories = capacityResource.filter(item => item.name === checkedCategory)
            //     .map(data => data.subCategory)[0].map(finalData => finalData.id);

            const filteredSubCategories = level === 2
                ? capacity_resource.filter((item: { name: string }) => item.name === lvl2catName)
                    .map((data: { Category: any }) => data.Category)[0].map((finalData: { id: any }) => finalData.id)
                : capacity_resource.filter((item: { name: string }) => item.name === checkedCategory)
                    .map((data: { subCategory: any }) => data.subCategory)[0].map((finalData: { id: any }) => finalData.id);
            const removedSubCategoryInUncheck = subCategoryCheckboxChecked.filter((item: any) => !filteredSubCategories.includes(item));

            const test = typeName && capacity_resource.filter((item: { name: string }) => item.name === lvl2catName).map((data: { Category: any }) => data.Category)[0].map((i: { name: any }) => i.name);

            const finalCategoryCheckBoxCheckedLvl2 = typeName ? mainCategoryCheckboxChecked.filter((item: any) => !test.includes(item)) : mainCategoryCheckboxChecked;
            const filteredSubCategoriesLvl2ResourceType = typeName && capacity_resource.filter((item: { name: string }) => item.name === lvl2catName).map((data: { Category: any }) => data.Category)[0].map((i: { resourceType: any }) => i.resourceType);


            // testing
            const fullCategoryNameList = level === 2 && capacity_resource.filter((item: { name: string }) => item.name === lvl2catName).map((data: { Category: any }) => data.Category)[0].map((i: { name: any }) => i.name);

            const mainCheckBoxChecked = mainCategoryCheckboxChecked.find((item: any) => item === checkedCategory)
                ? mainCategoryCheckboxChecked.filter((item: any) => item !== checkedCategory)
                : [...mainCategoryCheckboxChecked, checkedCategory]; // [...new Set([...indeterminantConditionArray, checkedCategory])]


            const comparisonFullCategoryData = fullCategoryNameList && mainCheckBoxChecked.filter((item: any) => fullCategoryNameList.includes(item));

            if (fullCategoryNameList && (fullCategoryNameList.length !== comparisonFullCategoryData.length)) {
                this.setState({
                    mainCategoryCheckboxChecked: finalCategoryCheckBoxCheckedLvl2.filter((item: any) => item !== checkedCategory).filter((data: any) => data !== lvl2catName),
                    subCategoryCheckboxChecked: removedSubCategoryInUncheck,

                    selectedCategoryName: checkedCategory,
                    indeterminantConditionArray: comparisonFullCategoryData.length ? [...indeterminantConditionArray, lvl2catName] : indeterminantConditionArray.filter((data: any) => data !== lvl2catName),
                });
            } else {
                this.setState({
                    mainCategoryCheckboxChecked: finalCategoryCheckBoxCheckedLvl2.filter((item: any) => item !== checkedCategory),
                    subCategoryCheckboxChecked: removedSubCategoryInUncheck,

                    selectedCategoryName: checkedCategory,
                    indeterminantConditionArray: indeterminantConditionArray.filter((item: any) => item !== lvl2catName),

                });
            }


            if (mainCategoryCheckboxChecked.find((data: any) => data === checkedCategory)) {
                this.setState({
                    checked: CHECKBOX_STATES.Empty,
                });
                this.setState({
                    filteredSubCategoriesLvl2ResourceType,
                });
                this.handleToggleClick(resourceType, false, typeName, filteredSubCategoriesLvl2ResourceType, false);
            } else {
                this.setState({
                    checked: CHECKBOX_STATES.Checked,
                });
                this.handleToggleClick(resourceType, true);
            }
        }

        if (mainCategoryCheckboxChecked.length === 0) {
            if (showVisualization === undefined) {
                this.handleSubCategory(checkedCategory, true, true);
            }

            const filteredSubCategories = level === 2
                ? capacity_resource.filter((item: { name: string }) => item.name === lvl2catName)
                    .map((data: { Category: any }) => data.Category)[0].map((finalData: { id: any }) => finalData.id)
                : capacity_resource.filter((item: { name: string }) => item.name === checkedCategory)
                    .map((data: { subCategory: any }) => data.subCategory)[0].map((finalData: { id: any }) => finalData.id);


            const selectedCategory = level === 2 ? typeName
                ? capacity_resource.filter((item: { name: string }) => item.name === lvl2catName)
                    .map((data: { Category: any }) => data.Category)[0]
                : capacity_resource.filter((item: { name: string }) => item.name === lvl2catName)
                    .map((data: { Category: any }) => data.Category)[0].filter((item: { name: any }) => item.name === checkedCategory) : capacity_resource.filter((item: { name: string }) => item.name === checkedCategory);


            this.setState({

                selectedSubCategoryName: resourceType,
                selectCategoryForinitialFilter: selectedCategory,
            });
            const test = typeName && capacity_resource.filter((item: { name: string }) => item.name === lvl2catName).map((data: { Category: any }) => data.Category)[0].map((i: { name: any }) => i.name);

            const fullCategoryNameList = level === 2 && capacity_resource.filter((item: { name: string }) => item.name === lvl2catName).map((data: { Category: any }) => data.Category)[0].map((i: { name: any }) => i.name);
            const mainCheckBoxChecked = [...mainCategoryCheckboxChecked, checkedCategory];
            const comparisonFullCategoryData = fullCategoryNameList && mainCheckBoxChecked.filter(item => fullCategoryNameList.includes(item));


            // testing logic
            const datas = mainCheckBoxChecked.filter(item => item !== lvl2catName);


            if (test) {
                this.setState({
                    mainCategoryCheckboxChecked: [...mainCategoryCheckboxChecked, ...test, checkedCategory],
                });
            } else if (fullCategoryNameList && (fullCategoryNameList.length !== comparisonFullCategoryData.length)) {
                this.setState({ mainCategoryCheckboxChecked: datas, indeterminantConditionArray: [...indeterminantConditionArray, lvl2catName] });
            } else {
                this.setState({
                    mainCategoryCheckboxChecked: [...mainCategoryCheckboxChecked, checkedCategory, lvl2catName],
                });
            }
            this.setState({

                subCategoryCheckboxChecked: [...subCategoryCheckboxChecked, ...filteredSubCategories],

                selectedCategoryName: checkedCategory,
                // indeterminantConditionArray: indeterminantConditionArray.filter(item => item !== checkedCategory),

            });


            if (mainCategoryCheckboxChecked.find((data: any) => data === checkedCategory)) {
                this.setState({
                    checked: CHECKBOX_STATES.Empty,
                });
                this.handleToggleClick(resourceType, false);
            } else {
                const filteredSubCategoriesLvl2ResourceType = typeName && capacity_resource.filter((item: { name: string }) => item.name === lvl2catName).map((data: { Category: any }) => data.Category)[0].map((i: { resourceType: any }) => i.resourceType);

                if (filteredSubCategoriesLvl2ResourceType) {
                    filteredSubCategoriesLvl2ResourceType.map((item: string | number) => (
                        this.setState({
                            resourceCollection: { ...resourceCollection, [item]: PreserveresourceCollection[item] },
                        })
                    ));
                    this.setState({
                        checked: CHECKBOX_STATES.Checked,

                    });
                } else {
                    this.setState({
                        checked: CHECKBOX_STATES.Checked,
                        resourceCollection: { ...resourceCollection, [resourceType]: PreserveresourceCollection[resourceType] },
                    });
                }
                this.setState({
                    filteredSubCategoriesLvl2ResourceType,
                });
                this.handleToggleClick(resourceType, true, typeName, filteredSubCategoriesLvl2ResourceType, true);
            }
        } else if (!mainCategoryCheckboxChecked.find((item: any) => item === checkedCategory)) {
            if (showVisualization === undefined) {
                this.handleSubCategory(checkedCategory, true, true);
            }

            const filteredSubCategories = level === 2
                ? capacity_resource.filter((item: { name: string }) => item.name === lvl2catName)
                    .map((data: { Category: any }) => data.Category)[0].map((finalData: { id: any }) => finalData.id)
                : capacity_resource.filter((item: { name: string }) => item.name === checkedCategory)
                    .map((data: { subCategory: any }) => data.subCategory)[0].map((finalData: { id: any }) => finalData.id);

            const selectedCategory = level === 2 ? typeName
                ? capacity_resource.filter((item: { name: string }) => item.name === lvl2catName)
                    .map((data: { Category: any }) => data.Category)[0]
                : capacity_resource.filter((item: { name: string }) => item.name === lvl2catName)
                    .map((data: { Category: any }) => data.Category)[0].filter((item: { name: any }) => item.name === checkedCategory) : capacity_resource.filter((item: { name: string }) => item.name === checkedCategory);

            this.setState({

                selectedSubCategoryName: resourceType,
                selectCategoryForinitialFilter: selectedCategory,
            });

            const test = typeName && capacity_resource.filter((item: { name: string }) => item.name === lvl2catName).map((data: { Category: any }) => data.Category)[0].map((i: { name: any }) => i.name);
            const fullCategoryNameList = level === 2 && capacity_resource.filter((item: { name: string }) => item.name === lvl2catName).map((data: { Category: any }) => data.Category)[0].map((i: { name: any }) => i.name);
            const mainCheckBoxChecked = [...mainCategoryCheckboxChecked, checkedCategory];
            const comparisonFullCategoryData = fullCategoryNameList && mainCheckBoxChecked.filter(item => fullCategoryNameList.includes(item));


            // testing logic
            const datas = mainCheckBoxChecked.filter(item => item !== lvl2catName);


            if (test) {
                this.setState({
                    mainCategoryCheckboxChecked: [...mainCategoryCheckboxChecked, ...test, checkedCategory],
                });
            } else if (fullCategoryNameList && (fullCategoryNameList.length !== comparisonFullCategoryData.length)) {
                this.setState({ mainCategoryCheckboxChecked: datas, indeterminantConditionArray: [...indeterminantConditionArray, lvl2catName] });
            } else {
                this.setState({
                    mainCategoryCheckboxChecked: [...mainCategoryCheckboxChecked, checkedCategory, lvl2catName],
                });
            }
            this.setState({

                subCategoryCheckboxChecked: [...subCategoryCheckboxChecked, ...filteredSubCategories],

                selectedCategoryName: checkedCategory,
                // indeterminantConditionArray: indeterminantConditionArray.filter(item => item !== checkedCategory),

            });


            if (mainCategoryCheckboxChecked.find((data: any) => data === checkedCategory)) {
                this.setState({
                    checked: CHECKBOX_STATES.Empty,
                });
                this.handleToggleClick(resourceType, false);
            } else {
                const filteredSubCategoriesLvl2ResourceType = typeName && capacity_resource.filter((item: { name: string }) => item.name === lvl2catName).map((data: { Category: any }) => data.Category)[0].map((i: { resourceType: any }) => i.resourceType);

                if (filteredSubCategoriesLvl2ResourceType) {
                    filteredSubCategoriesLvl2ResourceType.map((item: string | number) => (
                        this.setState({
                            resourceCollection: { ...resourceCollection, [item]: PreserveresourceCollection[item] },
                        })
                    ));
                    this.setState({
                        checked: CHECKBOX_STATES.Checked,

                    });
                } else {
                    this.setState({
                        checked: CHECKBOX_STATES.Checked,
                        resourceCollection: { ...resourceCollection, [resourceType]: PreserveresourceCollection[resourceType] },
                    });
                }
                this.setState({
                    filteredSubCategoriesLvl2ResourceType,
                });
                this.handleToggleClick(resourceType, true, typeName, filteredSubCategoriesLvl2ResourceType, true);
            }
        } else {
            return null;
        }
        return null;
    }


    private handleSubCategoryCheckbox = (id: number, checkedCategory: string, resourceType: string) => {
        const { mainCategoryCheckboxChecked, subCategoryCheckboxChecked,
            indeterminantConditionArray, selectedCategoryName,
            enableCategoryCheckbox, filterSubCategory, activeLayersIndication, resourceCollection, PreserveresourceCollection,capacity_resource } = this.state;
        const { handleActiveLayerIndication } = this.props;
        this.setState({
            categoryLevel: 1,

        });
        handleActiveLayerIndication({ ...activeLayersIndication, [resourceType]: true });

        const filteredSubCategory = capacity_resource.filter((item: { name: string }) => item.name === checkedCategory)
            .map((data: { subCategory: any }) => data.subCategory)[0].map((finalData: { id: any }) => finalData.id);
        this.setState({
            filterSubCategory: filteredSubCategory,
        });
        this.handleTooltipClose();


        if (subCategoryCheckboxChecked.find((item: any) => item === id)) {
            const filteredSubCategories = capacity_resource.filter((item: { name: string }) => item.name === checkedCategory)
                .map((data: { subCategory: any }) => data.subCategory)[0].map((finalData: { id: any }) => finalData.id);

            const removedSubCategoryInUncheck = subCategoryCheckboxChecked.filter((item: any) => item !== id);
            const removedSubCategoryInUncheckSameGroup = filteredSubCategories.filter((itm: any) => removedSubCategoryInUncheck.includes(itm));

            const selectedCategory = capacity_resource.filter((item: { name: string }) => item.name === checkedCategory);
            const selectedSubCategorynameList = selectedCategory.map((data: { subCategory: any }) => data.subCategory)[0].filter((ide: { id: any }) => removedSubCategoryInUncheck.includes(ide.id)).map((d: { name: any }) => d.name);


if (resourceType==='warehouse') {
    const filtering = PreserveresourceCollection[resourceType].filter((d: { categories: any[] }) => d.categories.some((category: any) => selectedSubCategorynameList.includes(category)));


    const resourceCollectionUpdate = { ...resourceCollection };
    resourceCollectionUpdate[resourceType] = filtering;

    this.setState({
        resourceCollection: resourceCollectionUpdate,
    });
} else {
    const filtering = PreserveresourceCollection[resourceType].filter((d: { [x: string]: string }) => selectedSubCategorynameList.includes(d[selectedCategory[0].attribute]));

    const resourceCollectionUpdate = { ...resourceCollection };
    resourceCollectionUpdate[resourceType] = filtering;

    this.setState({
        resourceCollection: resourceCollectionUpdate,
    });
}


            // resourceCollection[resourceType] = filtering;


            const remainingCheckedSubCategory = removedSubCategoryInUncheck.filter((item: number) => filteredSubCategories.includes(item));


            const data = resourceCollection[resourceType].filter((item: { type: any }) => removedSubCategoryInUncheck.includes(item.type));

            if (removedSubCategoryInUncheck.length === 0) {
                this.setState({
                    checked: CHECKBOX_STATES.Empty,
                });
                this.handleToggleClick(resourceType, false);
            } else if (removedSubCategoryInUncheckSameGroup.length > 0 && (removedSubCategoryInUncheckSameGroup.length !== filteredSubCategories.length)) {
                this.setState({
                    checked: CHECKBOX_STATES.Indeterminate,
                });
                this.handleToggleClick(resourceType, true);
            } else {
                this.setState({
                    checked: CHECKBOX_STATES.Checked,
                });
                this.handleToggleClick(resourceType, true);
            }

            if (filteredSubCategories.length !== removedSubCategoryInUncheckSameGroup.length) {
                this.setState({
                    mainCategoryCheckboxChecked: mainCategoryCheckboxChecked.filter((item: any) => item !== checkedCategory),
                    // checked: CHECKBOX_STATES.Indeterminate,
                    selectedCategoryName: checkedCategory,
                    subCategoryCheckboxChecked: removedSubCategoryInUncheck,
                    indeterminantConditionArray: [...new Set([...indeterminantConditionArray, checkedCategory])],


                });
            }
            if ((filteredSubCategories.length === removedSubCategoryInUncheckSameGroup.length) || (remainingCheckedSubCategory.length === 0)) {
                this.setState({
                    indeterminantConditionArray: indeterminantConditionArray.filter((item: any) => item !== checkedCategory),
                });
                this.handleToggleClick(resourceType, false);
            }
            // if (indeterminantConditionArray.find(item => item === checkedCategory)) {
            //     this.setState({
            //         subCategoryCheckboxChecked: removedSubCategoryInUncheck,
            //         selectedCategoryName: checkedCategory,
            //         indeterminantConditionArray: indeterminantConditionArray.filter(item => item !== checkedCategory),
            //     });
            // }
            this.setState({
                subCategoryCheckboxChecked: removedSubCategoryInUncheck,
                selectedCategoryName: checkedCategory,
            });
        }
        if (subCategoryCheckboxChecked.length === 0) {
            // resourceTypeName = resourceType;
            const filteredSubCategories = capacity_resource.filter((item: { name: string }) => item.name === checkedCategory)
                .map((data: { subCategory: any }) => data.subCategory)[0].map((finalData: { id: any }) => finalData.id);

            // eslint-disable-next-line prefer-const
            let addSubCategoryInUncheck = [...subCategoryCheckboxChecked, id];
            const filteredAddedSubCategoryInUncheck = addSubCategoryInUncheck.filter(item => filteredSubCategories.includes(item));

            addSubCategoryInUncheck = filteredAddedSubCategoryInUncheck;

            const selectedCategory = capacity_resource.filter((item: { name: string }) => item.name === checkedCategory);
            const selectedSubCategorynameList = selectedCategory.map((data: { subCategory: any }) => data.subCategory)[0].filter((ide: { id: any }) => addSubCategoryInUncheck.includes(ide.id)).map((d: { name: any }) => d.name);

            this.setState({
                selectCategoryForinitialFilter: selectedCategory,
                selectedSubCategorynameList,
                selectedSubCategoryName: resourceType,
            });


            if (addSubCategoryInUncheck.length === 0) {
                this.setState({
                    checked: CHECKBOX_STATES.Empty,
                });
                this.handleToggleClick(resourceType, false);
            } else if (addSubCategoryInUncheck.length > 0 && (addSubCategoryInUncheck.length !== filteredSubCategories.length)) {
                this.setState({
                    checked: CHECKBOX_STATES.Indeterminate,
                });
                if (PreserveresourceCollection[resourceType].length === 0) {
                    this.handleToggleClick(resourceType, true);
                } else {
                    this.setState({
                        activeLayersIndication: { ...activeLayersIndication, [resourceType]: true },
                    });
                }
            } else {
                this.setState({
                    checked: CHECKBOX_STATES.Checked,
                });
                this.handleToggleClick(resourceType, true);
            }
            if (resourceType==='warehouse') {
                const filtering = PreserveresourceCollection[resourceType].filter((d: { categories: any[] }) => d.categories.some((category: any) => selectedSubCategorynameList.includes(category)));
                const resourceCollectionUpdate = { ...resourceCollection };
                resourceCollectionUpdate[resourceType] = filtering;

                this.setState({
                    resourceCollection: resourceCollectionUpdate,
                });
            } else {
                const filtering = PreserveresourceCollection[resourceType].filter((d: { [x: string]: string }) => selectedSubCategorynameList.includes(d[selectedCategory[0].attribute]));

                const resourceCollectionUpdate = { ...resourceCollection };
                resourceCollectionUpdate[resourceType] = filtering;

                this.setState({
                    resourceCollection: resourceCollectionUpdate,
                });
                // resourceCollection[resourceType] = filtering;
            }


            this.setState({
                subCategoryCheckboxChecked: [...subCategoryCheckboxChecked, id],
                // checked: CHECKBOX_STATES.Indeterminate,
                selectedCategoryName: checkedCategory,
                indeterminantConditionArray: [...indeterminantConditionArray, checkedCategory],
            });
        } else if (!subCategoryCheckboxChecked.find((item: any) => item === id)) {
            const filteredSubCategories = capacity_resource.filter((item: { name: string }) => item.name === checkedCategory)
                .map((data: { subCategory: any }) => data.subCategory)[0].map((finalData: { id: any }) => finalData.id);


            // eslint-disable-next-line prefer-const
            let addSubCategoryInUncheck = [...subCategoryCheckboxChecked, id];
            const filteredAddedSubCategoryInUncheck = addSubCategoryInUncheck.filter(item => filteredSubCategories.includes(item));

            addSubCategoryInUncheck = filteredAddedSubCategoryInUncheck;

            // if (!addSubCategoryInUncheck.find(item => item === id)) {
            //     addSubCategoryInUncheck.push(id);
            // }
            const selectedCategory = capacity_resource.filter((item: { name: string }) => item.name === checkedCategory);
            const selectedSubCategorynameList = selectedCategory.map((data: { subCategory: any }) => data.subCategory)[0].filter((ide: { id: any }) => addSubCategoryInUncheck.includes(ide.id)).map((d: { name: any }) => d.name);
            if (resourceType==='warehouse') {
                const filtering = PreserveresourceCollection[resourceType].filter((d: { categories: any[] }) => d.categories.some((category: any) => selectedSubCategorynameList.includes(category)));
                const resourceCollectionUpdate = { ...resourceCollection };
                resourceCollectionUpdate[resourceType] = filtering;

                this.setState({
                    resourceCollection: resourceCollectionUpdate,
                });
            } else {
                const filtering = PreserveresourceCollection[resourceType].filter((d: { [x: string]: string }) => selectedSubCategorynameList.includes(d[selectedCategory[0].attribute]));


                const resourceCollectionUpdate = { ...resourceCollection };
                resourceCollectionUpdate[resourceType] = filtering;
                this.setState({
                    resourceCollection: resourceCollectionUpdate,
                });
            }


            this.setState({
                selectedSubCategorynameList,
                selectedSubCategoryName: resourceType,
                selectCategoryForinitialFilter: selectedCategory,
            });
            // resourceCollection[resourceType] = filtering;


            if (addSubCategoryInUncheck.length === 0) {
                this.setState({
                    checked: CHECKBOX_STATES.Empty,
                });
                this.handleToggleClick(resourceType, false);
            } else if (addSubCategoryInUncheck.length > 0 && (addSubCategoryInUncheck.length !== filteredSubCategories.length)) {
                this.setState({
                    checked: CHECKBOX_STATES.Indeterminate,
                });
                if (PreserveresourceCollection[resourceType].length === 0) {
                    this.handleToggleClick(resourceType, true);
                } else {
                    this.setState({
                        activeLayersIndication: { ...activeLayersIndication, [resourceType]: true },
                    });
                }
            } else {
                this.setState({
                    checked: CHECKBOX_STATES.Checked,
                });
                this.handleToggleClick(resourceType, false);
            }
            if (filteredSubCategories.length === addSubCategoryInUncheck.length) {
                this.setState({
                    mainCategoryCheckboxChecked: [...mainCategoryCheckboxChecked, checkedCategory],
                    // checked: CHECKBOX_STATES.Checked,

                    selectedCategoryName: checkedCategory,
                    indeterminantConditionArray: indeterminantConditionArray.filter((item: any) => item !== checkedCategory),


                });
                this.handleToggleClick(resourceType, true);
            } else {
                this.setState({
                    indeterminantConditionArray: [...new Set([...indeterminantConditionArray, checkedCategory])],
                });
            }
            this.setState({
                subCategoryCheckboxChecked: [...subCategoryCheckboxChecked, id],
                selectedCategoryName: checkedCategory,


            });
        } else {
            return null;
        }
        return null;
    }

    private handleChange = () => {
        const { checked } = this.state;
        let updatedChecked;

        if (checked === CHECKBOX_STATES.Checked) {
            updatedChecked = CHECKBOX_STATES.Empty;
        } else if (checked === CHECKBOX_STATES.Empty) {
            updatedChecked = CHECKBOX_STATES.Indeterminate;
        } else if (checked === CHECKBOX_STATES.Indeterminate) {
            updatedChecked = CHECKBOX_STATES.Checked;
        }
        this.setState({
            checked: updatedChecked,
        });
    };


    private getIndexArr = (array: any[]) => {
        const { capacity_resource } = this.state;
        const indeterminateArray =capacity_resource.map((item: { name: any }) => item.name);
        const data = array.map((item: string, i: any) => indeterminateArray.indexOf(item));
        return data;
    }

    private getCheckedIndexArr = () => {
        const { mainCategoryCheckboxChecked,capacity_resource } = this.state;
        const indeterminateArray =capacity_resource.map((item: { name: any }) => item.name);
        const data = mainCategoryCheckboxChecked.length && mainCategoryCheckboxChecked.map((item: string, i: any) => indeterminateArray.indexOf(item));

        return data || [];
    }

    private resourceProfileImage = (level: number, name: string) => {
        const ResourceCategory = capacity_resource.filter((i: { name: string }) => i.name === name)[0];

        const ResourceCategoryLevel2 = capacity_resource.filter((i: { name: string }) => i.name === name)[0].Category;

        if (level === 1) {
            const selectedResourceProfileImage = sidepanelLogo.filter(i => i.name === ResourceCategory.resourceType)[0].image;

            return {
                selectedResourceProfileImage,
            };
        }
        if (level === 2) {
            const selectedResourceProfileImage = sidepanelLogo.filter(item => (ResourceCategoryLevel2.map((data: { resourceType: string }) => {
                const finalData = item.name === data.resourceType;
                return (finalData);
            })));
        }

        return null;
    }

    private updateResourceOnDataAddition = (resourceType: any) => {
        const { resourceCollection, PreserveresourceCollection } = this.state;
        const updatedResourcesCollection = { ...resourceCollection, [resourceType]: [] };

        this.setState({
            resourceCollection: updatedResourcesCollection,
            PreserveresourceCollection: updatedResourcesCollection,
        });
    }

    private handleVisualization = (boolean: boolean, checkedCategory: string, resourceType: string, level: number, lvl2catName: string, typeName: any) => {
        const { region, wards } = this.props;
        const { resourceCollection } = this.state;
        this.setState({ openVisualization: boolean });
        this.handleMainCategoryCheckBox(checkedCategory, resourceType, level, lvl2catName, typeName, boolean);

        ResourceType = resourceType;
    }

    private handleClearDataAfterAddition = (resourcetype: any) => {
        const { resourceCollection, PreserveresourceCollection } = this.state;
        this.setState({
            resourceCollection: { ...resourceCollection, [resourcetype]: [] },
        });
        this.setState({
            PreserveresourceCollection: { ...PreserveresourceCollection, [resourcetype]: [] },
        });
    }

    private verifyCheckboxChecked = (category: any) => {
        const { mainCategoryCheckboxChecked } = this.state;
        const value = !!mainCategoryCheckboxChecked.find((i: any) => i === category);
        return value;
    }

    private handleSearchResource = (resourceType: string, id: number, name: string) => {
        const { showSearchModal, PreserveresourceCollection, showTooltip, selectedCategoryId } = this.state;
        const data = PreserveresourceCollection[resourceType].filter((i: { resourceType: any }) => i.resourceType === resourceType);
        const isCheckboxChecked = this.verifyCheckboxChecked(name);
        if ((data.length && isCheckboxChecked)) {
            this.setState({
                showSearchModal: !showSearchModal,
                filteredSearchResource: data,

            });
        } else {
            this.setState({
                showSearchModal: false,
                showTooltip: true,
                selectedCategoryId: id,
            });
        }
    }

    public render() {
        const {
            className,
            requests,
            resourceTypeList,
            droneImagePending,
            requests: { openspaceDeleteRequest },
            authState: { authenticated },
            region,
            user,
            carKeys,
            palikaRedirect,
            language: { language },
            searchedResourceCoordinateData,
            filters,
            filterss,
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
            activeModal,
            singleOpenspaceDetailsModal,
            CommunitySpaceDetailsModal,
            isLoggedInUser,
            wardsRef,
            showSubCategory,
            mainCheckbox,
            subMainCheckbox,
            resourceCategory,
            mainCategoryCheckboxChecked,
            subCategoryCheckboxChecked,
            enableCategoryCheckbox,
            selectedCategoryName,
            checked,
            filterSubCategory,
            indeterminantConditionArray,
            PreserveresourceCollection,
            faramValues,
            palikaRedirectState,
            openVisualization,
            selectedSubCategoryName,
            lvl2TypeName,
            categoryLevel,
            lvl2catName,
            disableCheckbox,
            ErrorData,
            showSearchModal,
            selectedResource,
            filteredSearchResource,
            showTooltip,
            selectedCategoryId,
            warehouseSubCategory,
            capacity_resource,
        } = this.state;

        const { addResource, isFilterClicked } = this.context;
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
        const hotelandrestaurantGeoJson = this.getGeojson(resourceCollection.hotelandrestaurant);
        const culturalGeoJson = this.getGeojson(resourceCollection.cultural);
        const industryGeoJson = this.getGeojson(resourceCollection.industry);
        const communicationGeoJson = this.getGeojson(resourceCollection.communication);
        const openspaceGeoJson = this.getGeojson(resourceCollection.openspace);
        const communityspaceGeoJson = this.getGeojson(
            resourceCollection.communityspace,
        );
        const firefightingapparatus = this.getGeojson(resourceCollection.firefightingapparatus);
        const fireengineGeoJson = this.getGeojson(resourceCollection.fireengine);
        const helipadGeoJson = this.getGeojson(resourceCollection.helipad);
        const bridgeGeoJson = this.getGeojson(resourceCollection.bridge);
        const airwayGeoJson = this.getGeojson(resourceCollection.airway);
        const roadwayGeoJson = this.getGeojson(resourceCollection.roadway);
        const waterwayGeoJson = this.getGeojson(resourceCollection.waterway);
        const electricityGeoJson = this.getGeojson(resourceCollection.electricity);
        const sanitationGeoJson = this.getGeojson(resourceCollection.sanitation);
        const waterSupplyGeoJson = this.getGeojson(resourceCollection.watersupply);
        const evacuationcentreGeoJson = this.getGeojson(resourceCollection.evacuationcentre);
        const warehouseGeojson = this.getGeojson(resourceCollection.warehouse);
        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 10,
        };
        const filteredCheckedSubCategory = filterSubCategory.filter((item: any) => subCategoryCheckboxChecked.includes(item));
        const showIndeterminateButton = !!(filteredCheckedSubCategory.length && (filterSubCategory !== filteredCheckedSubCategory));
        const filterPermissionGranted = checkSameRegionPermission(user, region);

        return (
            <>
                <Loading pending={pending} />
                {openVisualization ? (
                    <DataVisualisation
                        resourceCollection={resourceCollection}
                        closeVisualization={this.handleVisualization}
                        checkedCategory={selectedCategoryName}
                        resourceType={ResourceType}
                        level={categoryLevel}
                        lvl2catName={lvl2catName}
                        typeName={lvl2TypeName}
                        selectedCategoryName={selectedCategoryName}
                        pendingAPICall={pending}
                        ErrorData={ErrorData}


                    />
                ) : ''}
                <div
                    className={_cs(styles.capacityAndResources, className)}
                    id="capacityAndResources"
                >
                    {addResource ? (
                        <div className={styles.addResourceForm} style={{ margin: '10px' }}>
                            <AddResourceForm
                                onAddSuccess={this.handleResourceAdd}
                                onEditSuccess={this.handleResourceEdit}
                                resourceId={resourceDetails && editResources ? resourceDetails.id : undefined}
                                resourceDetails={editResources && resourceDetails}
                                // onEditSuccess={this.handleResourceEdit}
                                closeModal={this.handleEditResourceFormCloseButtonClick}
                                updateResourceOnDataAddition={this.updateResourceOnDataAddition}
                                handleClearDataAfterAddition={this.handleClearDataAfterAddition}


                            />
                        </div>
                    )
                        : (
                            <>
                                <Translation>
                                    {
                                        t => (
                                            <header className={styles.header}>

                                                <div className={styles.actions}>
                                                    {filterPermissionGranted
                                                        ? (
                                                            <Cloak hiddenIf={(p: { add_resource: any }) => !p.add_resource}>


                                                                <AccentModalButton
                                                                    iconName="add"
                                                                    title={t('Add New Resource')}
                                                                    transparent
                                                                    onClick={this.resourceAdd}


                                                                >
                                                                    {t('Add Resource')}
                                                                </AccentModalButton>
                                                            </Cloak>
                                                        )
                                                        : ''}
                                                    <DangerButton
                                                        // disabled={!activeLayerKey}
                                                        disabled={!Object.values(activeLayersIndication).some(Boolean)
                                                            && !activeLayerKey}
                                                        onClick={this.handleLayerUnselect}
                                                        className={styles.clearButton}
                                                        transparent
                                                    >
                                                        {t('Clear')}
                                                    </DangerButton>

                                                </div>
                                            </header>
                                        )
                                    }
                                </Translation>

                                {capacity_resource.map((item: { name: {} | null | undefined; resourceType: string; level: number; typeName: string | undefined; Category: { id: React.Key | null | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | Iterable<ReactI18NextChild> | null | undefined; resourceType: any }[]; subCategory: any[]; nameNe: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | Iterable<ReactI18NextChild> | null | undefined; id: number }, idx: any) => (
                                    <Translation>
                                        {
                                            t => (
                                                <div key={item.name}>
                                                    <div
                                                        className={resourceCategory.find((res: string) => res === item.name)
                                                            ? styles.categorySelected : styles.categories}
                                                    >
                                                        <div style={{ marginTop: '5px' }}>
                                                            <Checkbox
                                                                label="Value"
                                                                value={checked}
                                                                onChange={() => this.handleMainCategoryCheckBox(item.name, item.resourceType, item.level, item.name, item.typeName)}
                                                                checkedCategory={!!mainCategoryCheckboxChecked.find((data: string) => data === item.name)}
                                                                showIndeterminateButton={showIndeterminateButton}
                                                                index={this.getIndexArr(indeterminantConditionArray)}
                                                                checkedMainCategoryIndex={this.getCheckedIndexArr()}
                                                                ownIndex={idx}
                                                                disableCheckbox={disableCheckbox}

                                                            />

                                                            {/* <input type="checkbox" checked={!!mainCategoryCheckboxChecked.find(data => data === item.name)} onClick={() => this.handleMainCategoryCheckBox(item.name)} /> */}
                                                        </div>
                                                        <div
                                                            role="button"
                                                            tabIndex={0}
                                                            // eslint-disable-next-line max-len
                                                            onClick={(item.Category || item.subCategory.length)
                                                                ? () => this.handleSubCategory(item.name, showSubCategory)
                                                                // : () => this.handleMainCategoryCheckBox(item.name, item.resourceType, item.level, item.name, item.typeName)
                                                                : ''
                                                            }
                                                            onKeyDown={undefined}
                                                            className={styles.individualCategories}
                                                        >

                                                            <div style={{ display: 'flex', alignItems: 'center' }}>


                                                                <ScalableVectorGraphics
                                                                    className={styles.inputIcon}
                                                                    // className={(test.length && test.find(d => d === item.name)) ? styles.selectedInputIcon : styles.unselectedInputIcon}


                                                                    src={sidepanelLogo.filter(i => i.name === item.name)[0].image}
                                                                />
                                                                <h3 style={{ fontSize: '16px' }}>
                                                                    {language === 'en' ? item.name : item.nameNe}
                                                                </h3>
                                                            </div>


                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                marginRight: (item.Category || item.subCategory.length) ? '0px' : '26px',
                                                            }}
                                                            >
                                                                {item.level === 1 ? (
                                                                    <>
                                                                        <div style={{ position: 'relative' }}>
                                                                            <button
                                                                                type="button"
                                                                                style={{
                                                                                    cursor: 'pointer',
                                                                                    backgroundColor: resourceCategory.find((res: string) => res === item.name)
                                                                                        ? '#ddf2fd' : 'white',
                                                                                    border: 'none',
                                                                                }}
                                                                                onClick={() => this.handleSearchResource(item.resourceType, item.id, item.name)}
                                                                                title={language === 'en'
                                                                                    ? `Search ${item.name}'s Resource`
                                                                                    : `${item.nameNe}को स्रोत खोज्नुहोस्`}
                                                                            >
                                                                                <ScalableVectorGraphics
                                                                                    className={styles.icon}
                                                                                    src={search}
                                                                                />
                                                                            </button>
                                                                            {selectedCategoryId === item.id
                                                                                ? (
                                                                                    <Tooltip
                                                                                        show={showTooltip}
                                                                                        onClickOutside={() => this.setState({ showTooltip: false })}
                                                                                        message={t('Please select resource list to search')}
                                                                                    />
                                                                                ) : ''
                                                                            }

                                                                        </div>
                                                                        {
                                                                             (
                                                                                    <button
                                                                                        type="button"
                                                                                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                                                                        onClick={item.resourceType === 'warehouse'?'':() => this.handleVisualization(true, item.name, item.resourceType,
                                                                                            item.level, item.name, item.typeName)}
                                                                                    >

                                                                                        <ScalableVectorGraphics
                                                                                            className={styles.visualizationIcon}


                                                                                            src={visualization}
                                                                                        />

                                                                                    </button>
                                                                                )}
                                                                    </>
                                                                ) : ''}
                                                                {(item.Category || item.subCategory.length) ? resourceCategory.find((res: string) => res === item.name)
                                                                    ? (
                                                                        <Icon
                                                                            name="dropdown"
                                                                            className={styles.inputIconDropdown}
                                                                        />
                                                                    ) : (
                                                                        <Icon
                                                                            name="dropRight"
                                                                            className={styles.inputIconDropdown}
                                                                        />
                                                                    ) : ''}
                                                            </div>

                                                        </div>

                                                    </div>
                                                    {resourceCategory.find((elem: string) => elem === item.name)
                                                        ? item.level === 2
                                                            ? (
                                                                item.Category.map((data: { id: React.Key | null | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | Iterable<ReactI18NextChild> | null | undefined; resourceType: any }) => (
                                                                    <ul key={data.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                        <div
                                                                            style={{ display: 'flex', alignItems: 'center' }}
                                                                            role="button"
                                                                            tabIndex={0}
                                                                            // eslint-disable-next-line max-len
                                                                            onClick={() => this.handleSubCategory(data.name, showSubCategory)}
                                                                            onKeyDown={undefined}

                                                                        >
                                                                            <input type="checkbox" name="name" style={{ height: '1rem', width: '1rem', marginRight: '10px', cursor: 'pointer' }} checked={!!mainCategoryCheckboxChecked.find((datas: any) => datas === data.name)} onChange={disableCheckbox ? '' : () => this.handleMainCategoryCheckBox(data.name, data.resourceType, 2, item.name, '')} />
                                                                            <label htmlFor="name" style={{ cursor: 'pointer', fontSize: '14px' }} onClick={disableCheckbox ? '' : () => this.handleMainCategoryCheckBox(data.name, data.resourceType, 2, item.name)}>
                                                                                {' '}
                                                                                <h4>{data.name}</h4>
                                                                            </label>

                                                                        </div>
                                                                        <button type="button" style={{ border: 'none', marginRight: '35px', fontSize: '16px', background: 'none', cursor: 'pointer' }} onClick={() => this.handleVisualization(true, data.name, data.resourceType, 2, item.name, item.typeName)}>
                                                                            <Icon
                                                                                name="table"
                                                                                className={styles.inputIcon}
                                                                            />

                                                                        </button>
                                                                    </ul>
                                                                )))

                                                                :item.subCategory.map((data: { id: React.Key | null | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | Iterable<ReactI18NextChild> | null | undefined; nameNe: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | Iterable<ReactI18NextChild> | null | undefined }) => (
                                                                    <ul key={data.id}>
                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <input type="checkbox" name="name" style={{ height: '1rem', width: '1rem', marginRight: '10px', cursor: 'pointer' }} checked={!!subCategoryCheckboxChecked.find((i: number) => i === data.id)} onChange={disableCheckbox ? '' : () => this.handleSubCategoryCheckbox(data.id, item.name, item.resourceType)} />
                                                                            <label htmlFor="name" style={{ cursor: 'pointer', fontSize: '14px' }} onClick={disableCheckbox ? '' : () => this.handleSubCategoryCheckbox(data.id, item.name, item.resourceType)}>
                                                                                {' '}
                                                                                <h4>{language === 'en' ? data.name : data.nameNe}</h4>
                                                                            </label>

                                                                        </div>

                                                                    </ul>
                                                                ))


                                                        : ''}

                                                </div>
                                            )
                                        }
                                    </Translation>
                                ))}

                            </>
                        )
                    }


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
                                    {resourceLngLat && resourceInfo && (
                                        <MapTooltip
                                            coordinates={resourceLngLat}
                                            tooltipOptions={tooltipOptions}
                                            onHide={this.handleTooltipClose}
                                        >
                                            <ResourceTooltip
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                wardsRef={wardsRef}
                                                filterPermissionGranted={filterPermissionGranted}

                                            />
                                        </MapTooltip>
                                    )}
                                </MapSource>
                            )}


                            {/* Water Supply */}
                            {activeLayersIndication.watersupply && (
                                <MapSource
                                    sourceKey="resource-symbol-watersupply"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={waterSupplyGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-watersupply"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.watersupply,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-watersupply"
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
                                        layerKey="resource-symbol-background-watersupply"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.watersupply,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-watersupply"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'watersupply',
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
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                wardsRef={wardsRef}
                                                filterPermissionGranted={filterPermissionGranted}
                                            />
                                        </MapTooltip>
                                    )}
                                </MapSource>
                            )}
                            {/* Sanitation */}
                            {activeLayersIndication.sanitation && (
                                <MapSource
                                    sourceKey="resource-symbol-sanitation"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={sanitationGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-sanitation"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.sanitation,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-sanitation"
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
                                        layerKey="resource-symbol-background-sanitation"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.sanitation,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-sanitation"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'sanitation',
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
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                wardsRef={wardsRef}
                                                filterPermissionGranted={filterPermissionGranted}
                                            />
                                        </MapTooltip>
                                    )}
                                </MapSource>
                            )}

                            {/* Bridge */}
                            {activeLayersIndication.bridge && (
                                <MapSource
                                    sourceKey="resource-symbol-bridge"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={bridgeGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-bridge"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.bridge,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-bridge"
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
                                        layerKey="resource-symbol-background-bridge"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.bridge,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-bridge"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'bridge',
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
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                wardsRef={wardsRef}
                                                filterPermissionGranted={filterPermissionGranted}
                                            />
                                        </MapTooltip>
                                    )}
                                </MapSource>
                            )}
                            {/* Electricity */}
                            {activeLayersIndication.electricity && (
                                <MapSource
                                    sourceKey="resource-symbol-electricity"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={electricityGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-electricity"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.electricity,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-electricity"
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
                                        layerKey="resource-symbol-background-electricity"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.electricity,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-electricity"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'electricity',
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
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                wardsRef={wardsRef}
                                                filterPermissionGranted={filterPermissionGranted}
                                            />
                                        </MapTooltip>
                                    )}
                                </MapSource>
                            )}

                            {/* Airway */}
                            {activeLayersIndication.airway && (
                                <MapSource
                                    sourceKey="resource-symbol-airway"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={airwayGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-airway"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.airway,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-airway"
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
                                        layerKey="resource-symbol-background-airway"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.airway,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-airway"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'airway',
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
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                wardsRef={wardsRef}
                                                filterPermissionGranted={filterPermissionGranted}
                                            />
                                        </MapTooltip>
                                    )}
                                </MapSource>
                            )}

                            {/* Roadway */}
                            {activeLayersIndication.roadway && (
                                <MapSource
                                    sourceKey="resource-symbol-roadway"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={roadwayGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-roadway"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.roadway,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-roadway"
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
                                        layerKey="resource-symbol-background-roadway"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.roadway,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-roadway"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'roadway',
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
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                wardsRef={wardsRef}
                                                filterPermissionGranted={filterPermissionGranted}
                                            />
                                        </MapTooltip>
                                    )}
                                </MapSource>
                            )}

                            {/* Waterway */}
                            {activeLayersIndication.waterway && (
                                <MapSource
                                    sourceKey="resource-symbol-waterway"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={waterwayGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-waterway"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.waterway,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-waterway"
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
                                        layerKey="resource-symbol-background-waterway"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.waterway,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-waterway"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'waterway',
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
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                wardsRef={wardsRef}
                                                filterPermissionGranted={filterPermissionGranted}
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
                                    {resourceLngLat && resourceInfo && (
                                        <MapTooltip
                                            coordinates={resourceLngLat}
                                            tooltipOptions={tooltipOptions}
                                            onHide={this.handleTooltipClose}
                                        >
                                            <ResourceTooltip
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                wardsRef={wardsRef}
                                                filterPermissionGranted={filterPermissionGranted}
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
                                    {resourceLngLat && resourceInfo && (
                                        <MapTooltip
                                            coordinates={resourceLngLat}
                                            tooltipOptions={tooltipOptions}
                                            onHide={this.handleTooltipClose}
                                        >
                                            <ResourceTooltip
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                wardsRef={wardsRef}
                                                filterPermissionGranted={filterPermissionGranted}

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
                                    {resourceLngLat && resourceInfo && (
                                        <MapTooltip
                                            coordinates={resourceLngLat}
                                            tooltipOptions={tooltipOptions}
                                            onHide={this.handleTooltipClose}
                                        >
                                            <ResourceTooltip
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                wardsRef={wardsRef}
                                                filterPermissionGranted={filterPermissionGranted}

                                            />
                                        </MapTooltip>
                                    )}
                                </MapSource>
                            )}
                            {/* hotelandrestaurant */}
                            {activeLayersIndication.hotelandrestaurant && (
                                <MapSource
                                    sourceKey="resource-symbol-hotelandrestaurant"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={hotelandrestaurantGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-hotelandrestaurant"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.hotelandrestaurant,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-hotelandrestaurant"
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
                                        layerKey="resource-symbol-background-hotelandrestaurant"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.hotelandrestaurant,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-hotelandrestaurant"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'hotelandrestaurant',
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
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                wardsRef={wardsRef}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                filterPermissionGranted={filterPermissionGranted}
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
                                    {resourceLngLat && resourceInfo && (
                                        <MapTooltip
                                            coordinates={resourceLngLat}
                                            tooltipOptions={tooltipOptions}
                                            onHide={this.handleTooltipClose}
                                        >
                                            <ResourceTooltip
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                wardsRef={wardsRef}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                filterPermissionGranted={filterPermissionGranted}
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
                                    {resourceLngLat && resourceInfo && (
                                        <MapTooltip
                                            coordinates={resourceLngLat}
                                            tooltipOptions={tooltipOptions}
                                            onHide={this.handleTooltipClose}
                                        >
                                            <ResourceTooltip
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                wardsRef={wardsRef}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                filterPermissionGranted={filterPermissionGranted}
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
                                    {resourceLngLat && resourceInfo && (
                                        <MapTooltip
                                            coordinates={resourceLngLat}
                                            tooltipOptions={tooltipOptions}
                                            onHide={this.handleTooltipClose}
                                        >
                                            <ResourceTooltip
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                wardsRef={wardsRef}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                filterPermissionGranted={filterPermissionGranted}
                                            />
                                        </MapTooltip>
                                    )}
                                </MapSource>
                            )}
                            {/** evacuationcentreGeoJson */}
                            {activeLayersIndication.evacuationcentre && (
                                <>
                                    <MapSource
                                        sourceKey="resource-symbol-evacuationcentre"
                                        sourceOptions={{
                                            type: 'geojson',
                                            cluster: true,
                                            clusterMaxZoom: 10,
                                        }}
                                        geoJson={evacuationcentreGeoJson}
                                    >
                                        <MapLayer
                                            layerKey="cluster-evacuationcentre"
                                            onClick={this.handleClusterClick}
                                            layerOptions={{
                                                type: 'circle',
                                                paint:
                                                    mapStyles.resourceCluster
                                                        .evacuationcentre,
                                                filter: ['has', 'point_count'],
                                            }}
                                        />
                                        <MapLayer
                                            layerKey="cluster-count-evacuationcentre"
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
                                            layerKey="resource-symbol-background-evacuationcentre"
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
                                                        .evacuationcentre,
                                            }}
                                        />
                                        <MapLayer
                                            layerKey="-resourece-symbol-icon-evacuationcentre"
                                            layerOptions={{
                                                type: 'symbol',
                                                filter: [
                                                    '!',
                                                    ['has', 'point_count'],
                                                ],
                                                layout: {
                                                    'icon-image': 'evacuationcentre',
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
                                                    // FIXME: hide tooltip edit if there is no permission
                                                    language={language}
                                                    isLoggedInUser={isLoggedInUser}
                                                    {...resourceInfo}
                                                    {...resourceDetails}
                                                    onEditClick={this.handleEditClick}
                                                    wardsRef={wardsRef}
                                                    onShowInventoryClick={this.handleShowInventoryClick}
                                                    filterPermissionGranted={filterPermissionGranted}
                                                />
                                            </MapTooltip>
                                        )}
                                    </MapSource>

                                </>
                            )}


                            {/** wareHouseGeoJson */}
                            {activeLayersIndication.warehouse && (
                                <>
                                    <MapSource
                                        sourceKey="resource-symbol-warehouse"
                                        sourceOptions={{
                                            type: 'geojson',
                                            cluster: true,
                                            clusterMaxZoom: 10,
                                        }}
                                        geoJson={warehouseGeojson}
                                    >
                                        <MapLayer
                                            layerKey="cluster-warehouse"
                                            onClick={this.handleClusterClick}
                                            layerOptions={{
                                                type: 'circle',
                                                paint:
                                                    mapStyles.resourceCluster
                                                        .warehouse,
                                                filter: ['has', 'point_count'],
                                            }}
                                        />
                                        <MapLayer
                                            layerKey="cluster-count-warehouse"
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
                                            layerKey="resource-symbol-background-warehouse"
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
                                                        .warehouse,
                                            }}
                                        />
                                        <MapLayer
                                            layerKey="-resourece-symbol-icon-warehouse"
                                            layerOptions={{
                                                type: 'symbol',
                                                filter: [
                                                    '!',
                                                    ['has', 'point_count'],
                                                ],
                                                layout: {
                                                    'icon-image': 'evacuationcentre',
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
                                                    // FIXME: hide tooltip edit if there is no permission
                                                    language={language}
                                                    isLoggedInUser={isLoggedInUser}
                                                    {...resourceInfo}
                                                    {...resourceDetails}
                                                    onEditClick={this.handleEditClick}
                                                    wardsRef={wardsRef}
                                                    onShowInventoryClick={this.handleShowInventoryClick}
                                                    filterPermissionGranted={filterPermissionGranted}
                                                />
                                            </MapTooltip>
                                        )}
                                    </MapSource>

                                </>
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
                                                    language={language}
                                                    isLoggedInUser={isLoggedInUser}
                                                    {...resourceInfo}
                                                    {...resourceDetails}
                                                    onEditClick={
                                                        this.handleEditClick
                                                    }
                                                    onShowInventoryClick={
                                                        () => this.handleShowCommunitypaceDetails()
                                                    }
                                                    authenticated={authenticated}
                                                    wardsRef={wardsRef}
                                                    filterPermissionGranted={filterPermissionGranted}

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
                                                    language={language}
                                                    isLoggedInUser={isLoggedInUser}
                                                    {...resourceInfo}
                                                    {...resourceDetails}
                                                    onEditClick={
                                                        this.handleEditClick
                                                    }
                                                    onShowInventoryClick={
                                                        () => this.handleShowOpenspaceDetailsClick()
                                                    }
                                                    authenticated={authenticated}
                                                    wardsRef={wardsRef}
                                                    filterPermissionGranted={filterPermissionGranted}

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
                            {/* fire fighting apparatus */}
                            {activeLayersIndication.firefightingapparatus && (
                                <MapSource
                                    sourceKey="resource-symbol-firefightingapparatus"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={firefightingapparatus}
                                >
                                    <MapLayer
                                        layerKey="cluster-fireEngine"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.fireengine,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-fireEngine"
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
                                        layerKey="resource-symbol-background-fireEngine"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.fireengine,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-fireEngine"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'fireEngine',
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
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                wardsRef={wardsRef}
                                                filterPermissionGranted={filterPermissionGranted}

                                            />
                                        </MapTooltip>
                                    )}
                                </MapSource>
                            )}


                            {/* Fire engine */}
                            {activeLayersIndication.fireengine && (
                                <MapSource
                                    sourceKey="resource-symbol-fireEngine"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={fireengineGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-fireEngine"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.fireengine,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-fireEngine"
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
                                        layerKey="resource-symbol-background-fireEngine"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.fireengine,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-fireEngine"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'fireEngine',
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
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                wardsRef={wardsRef}
                                                filterPermissionGranted={filterPermissionGranted}

                                            />
                                        </MapTooltip>
                                    )}
                                </MapSource>
                            )}
                            {/* Helipad */}
                            {activeLayersIndication.helipad && (
                                <MapSource
                                    sourceKey="resource-symbol-helipad"
                                    sourceOptions={{
                                        type: 'geojson',
                                        cluster: true,
                                        clusterMaxZoom: 10,
                                    }}
                                    geoJson={helipadGeoJson}
                                >
                                    <MapLayer
                                        layerKey="cluster-helipad"
                                        onClick={this.handleClusterClick}
                                        layerOptions={{
                                            type: 'circle',
                                            paint: mapStyles.resourceCluster.helipad,
                                            filter: ['has', 'point_count'],
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="cluster-count-helipad"
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
                                        layerKey="resource-symbol-background-helipad"
                                        onClick={this.handleResourceClick}
                                        onMouserEnter={this.handleResourceMouseEnter}
                                        layerOptions={{
                                            type: 'circle',
                                            filter: ['!', ['has', 'point_count']],
                                            paint: mapStyles.resourcePoint.helipad,
                                        }}
                                    />
                                    <MapLayer
                                        layerKey="-resourece-symbol-icon-helipad"
                                        layerOptions={{
                                            type: 'symbol',
                                            filter: ['!', ['has', 'point_count']],
                                            layout: {
                                                'icon-image': 'helipad',
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
                                                // FIXME: hide tooltip edit if there is no permission
                                                language={language}
                                                isLoggedInUser={isLoggedInUser}
                                                {...resourceInfo}
                                                {...resourceDetails}
                                                onEditClick={this.handleEditClick}
                                                onShowInventoryClick={this.handleShowInventoryClick}
                                                wardsRef={wardsRef}
                                                filterPermissionGranted={filterPermissionGranted}

                                            />
                                        </MapTooltip>
                                    )}
                                </MapSource>
                            )}
                            {/* new structure ends */}
                        </>
                    )}
                </div>
                {
                    showInventoryModal
                    && isDefined(resourceDetails)
                    && isDefined(resourceDetails.id)
                    && (
                        <InventoriesModal
                            resourceId={resourceDetails.id}
                            closeModal={this.handleInventoryModalClose}
                            filterPermissionGranted={filterPermissionGranted}
                            resourceList={resourceList}
                        />
                    )
                }
                {
                    showSearchModal
                    && (
                        <SearchModal
                            closeModal={this.handleSearchModalClose}
                            resourceList={filteredSearchResource}
                            language={language}
                            searchedResourceCoordinateData={searchedResourceCoordinateData}
                        />
                    )


                }
                {
                    activeModal === 'showOpenSpaceInfoModal' ? (
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
                    ) : null
                }
                {
                    singleOpenspaceDetailsModal && (
                        <SingleOpenspaceDetails
                            {...resourceDetails}
                            closeModal={this.handleShowOpenspaceDetailsClick}
                            openspaceDeleteRequest={openspaceDeleteRequest}
                            onEdit={this.handleEditClick}
                            routeToOpenspace={this.routeToOpenspace}
                            type={resourceDetails && resourceDetails.resourceType}
                            DeletedResourceApiRecall={this.DeletedResourceApiRecall}
                        />
                    )
                }
                {
                    CommunitySpaceDetailsModal && (
                        <CommunityOpenspaceDetails
                            {...resourceDetails}
                            closeModal={this.handleShowCommunitypaceDetails}
                            onEdit={this.handleEditClick}
                            routeToOpenspace={this.routeToOpenspace}
                            openspaceDeleteRequest={openspaceDeleteRequest}
                            DeletedResourceApiRecall={this.DeletedResourceApiRecall}
                        />
                    )
                }
            </>
        );
    }
}
CapacityAndResources.contextType = RiskInfoLayerContext;

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createRequestClient(requestOptions),
)(CapacityAndResources);
