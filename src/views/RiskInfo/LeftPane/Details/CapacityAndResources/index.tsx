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
} from '#selectors';

import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';
import DangerButton from '#rsca/Button/DangerButton';
import AccentButton from '#rsca/Button/AccentButton';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import ListView from '#rsu/../v2/View/ListView';
import { checkSameRegionPermission, checkPermission } from '#utils/common';
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
import '#resources/openspace-resources/humanitarian-fonts.css';
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
import DataVisualisation from './DataVisualisation';

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
    | 'evacuationcentre';

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


};

const ResourceTooltip = (props: ResourceTooltipProps) => {
    const { onEditClick,
        onShowInventoryClick,
        isLoggedInUser,
        wardsRef,
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
                label: 'ward',
                value: wardsRef[r.value],
            };
        }

        if (r.label === 'lastModifiedDate') {
            return {
                label: 'lastModifiedDate',
                value: `${r.value.split('T')[0]}`,
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
        }
    }

    const resourceKeySelector = (d: typeof filtered) => d.label;


    return (
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
                            title="Edit"
                            onClick={onEditClick}
                            transparent
                            className={styles.editButton}
                        >
                            Edit data
                        </AccentButton>
                    ) : ''}


                <AccentButton
                    title={
                        resourceDetails.resourceType === 'openspace'
                            || resourceDetails.resourceType === 'communityspace'
                            ? 'View Details'
                            : 'Inventories'
                    }
                    onClick={onShowInventoryClick}
                    transparent
                    className={styles.editButton}
                >
                    {resourceDetails.resourceType === 'openspace'
                        || resourceDetails.resourceType === 'communityspace'
                        ? 'View Details'
                        : 'Inventories'}
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

    };
}

interface WardRef {
    wardId: number;
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

interface PositionModal {
    top: string | number;
    left: string | number;
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
    palikaRedirect: palikaRedirectSelector(state),
    user: userSelector(state),
    wards: wardsSelector(state),
    region: regionSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setFilters: params => dispatch(setFiltersAction(params)),
    setPalikaRedirect: params => dispatch(setPalikaRedirectAction(params)),
    setCarKeys: params => dispatch(setCarKeysAction(params)),


});

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    resourceGetRequest: {
        url: ({ params }) => {
            const region = params.getRegionDetails(params.region);
            const resource_type = params.resourceType;

            // const region = {municipality: 5002, province: 1, district: 3};
            const regionArr = Object.keys(region);
            let a = [];
            if (regionArr) {
                a = regionArr.map(item => `${item}=${region[item]}`);
            } else {
                a = '';
            }

            const result1 = a.join('&');

            const result2 = resource_type.map(item => `resource_type=${item}`);
            return params.filterClickCheckCondition
                ? `/resource/?${result1}&${`${result2.join('&')}`}&limit=-1&meta=true`
                : `/resource/?resource_type=${resource_type[0]}&${a.length ? a[0] : ''}&limit=-1&meta=true`;
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
];
const indeterminateArray = capacityResource.map(item => item.name);

// let selectedCategory = [];

// let selectedSubCategorynameList = [];

// // eslint-disable-next-line prefer-const
// let resourceTypeName = '';
let editResources = false;
let ResourceType = '';
class CapacityAndResources extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        const {
            requests: {
                resourceGetRequest,
            },
            filters,
            palikaRedirect,
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

            },
            activeLayersIndication: { ...initialActiveLayersIndication },
            palikaRedirectState: false,
            isLoggedInUser: false,
            wardsRef: {},
        };

        const { faramValues: { region } } = filters;

        resourceGetRequest.setDefaultParams(
            {
                setResourceList: this.setResourceList,
                setIndividualResourceList: this.setIndividualResourceList,
                getRegionDetails: this.getRegionDetails,
                region,
                // filterClickCheckCondition: isFilterClicked,
            },
        );
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

    public componentDidUpdate(prevProps, prevState, snapshot) {
        const { faramValues: { region } } = this.props.filters;
        const { carKeys } = this.props;
        const { isFilterClicked, FilterClickedStatus } = this.context;
        const { PreserveresourceCollection, resourceCollection, selectedCategoryName,
            selectCategoryForinitialFilter, selectedSubCategorynameList, selectedSubCategoryName, checked } = this.state;
        if (prevProps.filters.faramValues.region !== this.props.filters.faramValues.region) {
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


                    },
                });
            }
            if (carKeys.length) {
                this.props.requests.resourceGetRequest.do(
                    {
                        region,
                        resourceType: carKeys,
                        filterClickCheckCondition: isFilterClicked,
                    },
                );
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

        if (prevState.PreserveresourceCollection !== this.state.PreserveresourceCollection) {
            if (isFilterClicked) {
                this.setState({
                    resourceCollection: PreserveresourceCollection,

                });
            } else if (selectedSubCategoryName) {
                const resourceColln = resourceCollection || PreserveresourceCollection;
                const filtering = PreserveresourceCollection[selectedSubCategoryName].filter(d => selectedSubCategorynameList.includes(d[selectCategoryForinitialFilter[0].attribute]));
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

    private DeletedResourceApiRecall = () => {
        const { isFilterClicked } = this.context;
        const { carKeys, requests: { resourceGetRequest }, filters: { faramValues: { region } } } = this.props;
        resourceGetRequest.do({
            resourceType: carKeys,
            region,
            filterClickCheckCondition: isFilterClicked,
        });
    }

    private handleToggleClick = (key: toggleValues, value: boolean, typeName, filteredSubCategoriesLvl2ResourceType, lvl2UncheckCondition) => {
        const { activeLayersIndication, resourceCollection, categoryLevel, selectedCategoryName, subCategoryCheckboxChecked } = this.state;
        const temp = filteredSubCategoriesLvl2ResourceType || key ? { ...activeLayersIndication } : { ...initialActiveLayersIndication };
        const { setCarKeys, carKeys } = this.props;
        const { isFilterClicked, FilterClickedStatus } = this.context;
        temp[key] = value;
        if (key) {
            temp[key] = typeName ? true : value;
        }
        if (filteredSubCategoriesLvl2ResourceType) {
            const data = filteredSubCategoriesLvl2ResourceType.map(item => (
                temp[item] = lvl2UncheckCondition
            ));
        }
        const trueKeys = Object.keys(temp).filter(id => temp[id]);
        this.setState({ activeLayersIndication: temp });
        const { handleActiveLayerIndication } = this.props;
        handleActiveLayerIndication(temp);
        const checkingResourceCollection = filteredSubCategoriesLvl2ResourceType && filteredSubCategoriesLvl2ResourceType.map((item => (
            !!resourceCollection[item].length
        ))).filter(item => item === true);
        const filterCarKeys = carKeys.find(d => d === key);
        if (filterCarKeys) {
            const data = carKeys.filter(d => d !== key);
            setCarKeys(data);
        } else {
            setCarKeys([...carKeys, key]);
        }
        if (typeName && checkingResourceCollection && (checkingResourceCollection.length !== filteredSubCategoriesLvl2ResourceType.length)) {
            const newArr = [];
            filteredSubCategoriesLvl2ResourceType.map(item => newArr.push(item));
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
                    filterClickCheckCondition: isFilterClicked,
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
                    filterClickCheckCondition: isFilterClicked,
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

    private setIndividualResourceList = (key: toggleValues, resourceList: PageType.Resource[], resourceType, Result) => {
        const { resourceCollection, subCategoryCheckboxChecked, reserveListForOtherFilter,
            selectCategoryForinitialFilter, selectedSubCategoryName, categoryLevel, lvl2catName, filteredSubCategoriesLvl2ResourceType, PreserveresourceCollection, lvl2TypeName } = this.state;
        // const temp = { ...resourceCollection };
        const { carKeys } = this.props;
        const { FilterClickedStatus, isFilterClicked } = this.context;
        this.setState({ disableCheckbox: false });
        if (isFilterClicked) {
            const temp = { ...PreserveresourceCollection };
            carKeys.map(i => (
                temp[i] = Result.filter(d => d.resourceType === i)
            ));
            this.setState({
                PreserveresourceCollection: temp,
            });
            FilterClickedStatus(false);
            const mainCat = carKeys.map(i => (capacityResource
                .filter(d => d.resourceType === i)
                .map(name => name.name)));
            const subCat = carKeys.map(i => (capacityResource
                .filter(d => d.resourceType === i)
                .map(itm => itm.subCategory.map(subCate => subCate.id))));
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
                const resourceLists = resourceType.map(item => (

                    temp[item] = Result.filter(data => data.resourceType === item)
                ));
            } else {
                // temp[key] = resourceList;
                resourceType.map(item => (

                    temp[item] = Result.filter(data => data.resourceType === item)));
            }


            const subCatList = categoryLevel === 2
                ? lvl2TypeName ? capacityResource.filter(item => item.name === lvl2catName)
                    .map(data => data.Category)[0].filter(item => filteredSubCategoriesLvl2ResourceType.includes(item.resourceType)).map(r => r.subCategory)
                    : capacityResource.filter(item => item.name === lvl2catName)
                        .map(data => data.Category)[0].filter(item => item.resourceType === selectedSubCategoryName)[0].subCategory.map(data => data.type)
                : capacityResource.filter(item => item.resourceType === selectedSubCategoryName)[0].subCategory.map(data => data.type);
            let RawsubCatName = lvl2TypeName ? [] : subCatList;

            if (lvl2TypeName) {
                for (let i = 0; i < subCatList.length; i++) {
                    RawsubCatName = [...RawsubCatName, ...subCatList[i]];
                }
            }
            const subCatName = lvl2TypeName ? RawsubCatName.map(i => i.type) : subCatList;

            const filteredOtherSubCat = !lvl2TypeName && temp[selectedSubCategoryName].filter(item => !subCatName.includes(item[selectCategoryForinitialFilter[0].attribute]));

            const finalFilteredOtherSubCat = !lvl2TypeName && temp[selectedSubCategoryName].map((data) => {
                const filteredSubCatOther = filteredOtherSubCat.filter(itm => itm[selectCategoryForinitialFilter[0].attribute] === data[selectCategoryForinitialFilter[0].attribute]);
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

    private routeToOpenspace = (point) => {
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

    private handleSubCategory = (selectedResource, showSubCat, boolean) => {
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
            if (mainCategoryCheckboxChecked.find(item => item === selectedResource)) {
                this.setState({
                    resourceCategory: mainCategoryCheckboxChecked.filter(item => item !== selectedResource),

                });
            }
            if (mainCategoryCheckboxChecked.length === 0) {
                this.setState({
                    resourceCategory: [...mainCategoryCheckboxChecked, selectedResource],
                });
            } else if (!mainCategoryCheckboxChecked.find(item => item === selectedResource)) {
                this.setState({
                    resourceCategory: [...mainCategoryCheckboxChecked, selectedResource],
                });
            } else {
                return null;
            }
        } else {
            if (resourceCategory.find(item => item === selectedResource)) {
                this.setState({
                    resourceCategory: resourceCategory.filter(item => item !== selectedResource),

                });
            }
            if (resourceCategory.length === 0) {
                this.setState({
                    resourceCategory: [...resourceCategory, selectedResource],
                });
            } else if (!resourceCategory.find(item => item === selectedResource)) {
                this.setState({
                    resourceCategory: [...resourceCategory, selectedResource],
                });
            } else {
                return null;
            }
        }


        return null;
    }

    private handleMainCategoryCheckBox = (checkedCategory, resourceType, level, lvl2catName, typeName, showVisualization) => {
        const { mainCategoryCheckboxChecked, subCategoryCheckboxChecked, resourceCollection, categoryLevel, indeterminantConditionArray, PreserveresourceCollection } = this.state;


        this.handleTooltipClose();
        this.setState({
            categoryLevel: level,
            lvl2catName,
        });

        this.setState({
            lvl2TypeName: typeName,
        });

        // this.handleSubCategory(checkedCategory);
        if (mainCategoryCheckboxChecked.find(item => item === checkedCategory)) {
            if (showVisualization === undefined) {
                this.handleSubCategory(checkedCategory, true, false);
            }

            // const filteredSubCategories = capacityResource.filter(item => item.name === checkedCategory)
            //     .map(data => data.subCategory)[0].map(finalData => finalData.id);

            const filteredSubCategories = level === 2
                ? capacityResource.filter(item => item.name === lvl2catName)
                    .map(data => data.Category)[0].map(finalData => finalData.id)
                : capacityResource.filter(item => item.name === checkedCategory)
                    .map(data => data.subCategory)[0].map(finalData => finalData.id);
            const removedSubCategoryInUncheck = subCategoryCheckboxChecked.filter(item => !filteredSubCategories.includes(item));

            const test = typeName && capacityResource.filter(item => item.name === lvl2catName).map(data => data.Category)[0].map(i => i.name);

            const finalCategoryCheckBoxCheckedLvl2 = typeName ? mainCategoryCheckboxChecked.filter(item => !test.includes(item)) : mainCategoryCheckboxChecked;
            const filteredSubCategoriesLvl2ResourceType = typeName && capacityResource.filter(item => item.name === lvl2catName).map(data => data.Category)[0].map(i => i.resourceType);


            // testing
            const fullCategoryNameList = level === 2 && capacityResource.filter(item => item.name === lvl2catName).map(data => data.Category)[0].map(i => i.name);

            const mainCheckBoxChecked = mainCategoryCheckboxChecked.find(item => item === checkedCategory)
                ? mainCategoryCheckboxChecked.filter(item => item !== checkedCategory)
                : [...mainCategoryCheckboxChecked, checkedCategory]; // [...new Set([...indeterminantConditionArray, checkedCategory])]


            const comparisonFullCategoryData = fullCategoryNameList && mainCheckBoxChecked.filter(item => fullCategoryNameList.includes(item));

            if (fullCategoryNameList && (fullCategoryNameList.length !== comparisonFullCategoryData.length)) {
                this.setState({
                    mainCategoryCheckboxChecked: finalCategoryCheckBoxCheckedLvl2.filter(item => item !== checkedCategory).filter(data => data !== lvl2catName),
                    subCategoryCheckboxChecked: removedSubCategoryInUncheck,

                    selectedCategoryName: checkedCategory,
                    indeterminantConditionArray: comparisonFullCategoryData.length ? [...indeterminantConditionArray, lvl2catName] : indeterminantConditionArray.filter(data => data !== lvl2catName),
                });
            } else {
                this.setState({
                    mainCategoryCheckboxChecked: finalCategoryCheckBoxCheckedLvl2.filter(item => item !== checkedCategory),
                    subCategoryCheckboxChecked: removedSubCategoryInUncheck,

                    selectedCategoryName: checkedCategory,
                    indeterminantConditionArray: indeterminantConditionArray.filter(item => item !== lvl2catName),

                });
            }


            if (mainCategoryCheckboxChecked.find(data => data === checkedCategory)) {
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
                ? capacityResource.filter(item => item.name === lvl2catName)
                    .map(data => data.Category)[0].map(finalData => finalData.id)
                : capacityResource.filter(item => item.name === checkedCategory)
                    .map(data => data.subCategory)[0].map(finalData => finalData.id);


            const selectedCategory = level === 2 ? typeName
                ? capacityResource.filter(item => item.name === lvl2catName)
                    .map(data => data.Category)[0]
                : capacityResource.filter(item => item.name === lvl2catName)
                    .map(data => data.Category)[0].filter(item => item.name === checkedCategory) : capacityResource.filter(item => item.name === checkedCategory);


            this.setState({

                selectedSubCategoryName: resourceType,
                selectCategoryForinitialFilter: selectedCategory,
            });
            const test = typeName && capacityResource.filter(item => item.name === lvl2catName).map(data => data.Category)[0].map(i => i.name);

            const fullCategoryNameList = level === 2 && capacityResource.filter(item => item.name === lvl2catName).map(data => data.Category)[0].map(i => i.name);
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


            if (mainCategoryCheckboxChecked.find(data => data === checkedCategory)) {
                this.setState({
                    checked: CHECKBOX_STATES.Empty,
                });
                this.handleToggleClick(resourceType, false);
            } else {
                const filteredSubCategoriesLvl2ResourceType = typeName && capacityResource.filter(item => item.name === lvl2catName).map(data => data.Category)[0].map(i => i.resourceType);

                if (filteredSubCategoriesLvl2ResourceType) {
                    filteredSubCategoriesLvl2ResourceType.map(item => (
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
        } else if (!mainCategoryCheckboxChecked.find(item => item === checkedCategory)) {
            if (showVisualization === undefined) {
                this.handleSubCategory(checkedCategory, true, true);
            }

            const filteredSubCategories = level === 2
                ? capacityResource.filter(item => item.name === lvl2catName)
                    .map(data => data.Category)[0].map(finalData => finalData.id)
                : capacityResource.filter(item => item.name === checkedCategory)
                    .map(data => data.subCategory)[0].map(finalData => finalData.id);

            const selectedCategory = level === 2 ? typeName
                ? capacityResource.filter(item => item.name === lvl2catName)
                    .map(data => data.Category)[0]
                : capacityResource.filter(item => item.name === lvl2catName)
                    .map(data => data.Category)[0].filter(item => item.name === checkedCategory) : capacityResource.filter(item => item.name === checkedCategory);

            this.setState({

                selectedSubCategoryName: resourceType,
                selectCategoryForinitialFilter: selectedCategory,
            });

            const test = typeName && capacityResource.filter(item => item.name === lvl2catName).map(data => data.Category)[0].map(i => i.name);
            const fullCategoryNameList = level === 2 && capacityResource.filter(item => item.name === lvl2catName).map(data => data.Category)[0].map(i => i.name);
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


            if (mainCategoryCheckboxChecked.find(data => data === checkedCategory)) {
                this.setState({
                    checked: CHECKBOX_STATES.Empty,
                });
                this.handleToggleClick(resourceType, false);
            } else {
                const filteredSubCategoriesLvl2ResourceType = typeName && capacityResource.filter(item => item.name === lvl2catName).map(data => data.Category)[0].map(i => i.resourceType);

                if (filteredSubCategoriesLvl2ResourceType) {
                    filteredSubCategoriesLvl2ResourceType.map(item => (
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


    private handleSubCategoryCheckbox = (id, checkedCategory, resourceType) => {
        const { mainCategoryCheckboxChecked, subCategoryCheckboxChecked,
            indeterminantConditionArray, selectedCategoryName,
            enableCategoryCheckbox, filterSubCategory, activeLayersIndication, resourceCollection, PreserveresourceCollection } = this.state;
        const { handleActiveLayerIndication } = this.props;
        this.setState({
            categoryLevel: 1,

        });
        handleActiveLayerIndication({ ...activeLayersIndication, [resourceType]: true });

        const filteredSubCategory = capacityResource.filter(item => item.name === checkedCategory)
            .map(data => data.subCategory)[0].map(finalData => finalData.id);
        this.setState({
            filterSubCategory: filteredSubCategory,
        });
        this.handleTooltipClose();
        if (subCategoryCheckboxChecked.find(item => item === id)) {
            const filteredSubCategories = capacityResource.filter(item => item.name === checkedCategory)
                .map(data => data.subCategory)[0].map(finalData => finalData.id);

            const removedSubCategoryInUncheck = subCategoryCheckboxChecked.filter(item => item !== id);
            const removedSubCategoryInUncheckSameGroup = filteredSubCategories.filter(itm => removedSubCategoryInUncheck.includes(itm));

            const selectedCategory = capacityResource.filter(item => item.name === checkedCategory);
            const selectedSubCategorynameList = selectedCategory.map(data => data.subCategory)[0].filter(ide => removedSubCategoryInUncheck.includes(ide.id)).map(d => d.name);


            const filtering = PreserveresourceCollection[resourceType].filter(d => selectedSubCategorynameList.includes(d[selectedCategory[0].attribute]));

            const resourceCollectionUpdate = { ...resourceCollection };
            resourceCollectionUpdate[resourceType] = filtering;

            this.setState({
                resourceCollection: resourceCollectionUpdate,
            });


            // resourceCollection[resourceType] = filtering;


            const remainingCheckedSubCategory = removedSubCategoryInUncheck.filter(item => filteredSubCategories.includes(item));


            const data = resourceCollection[resourceType].filter(item => removedSubCategoryInUncheck.includes(item.type));

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
                    mainCategoryCheckboxChecked: mainCategoryCheckboxChecked.filter(item => item !== checkedCategory),
                    // checked: CHECKBOX_STATES.Indeterminate,
                    selectedCategoryName: checkedCategory,
                    subCategoryCheckboxChecked: removedSubCategoryInUncheck,
                    indeterminantConditionArray: [...new Set([...indeterminantConditionArray, checkedCategory])],


                });
            }
            if ((filteredSubCategories.length === removedSubCategoryInUncheckSameGroup.length) || (remainingCheckedSubCategory.length === 0)) {
                this.setState({
                    indeterminantConditionArray: indeterminantConditionArray.filter(item => item !== checkedCategory),
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
            const filteredSubCategories = capacityResource.filter(item => item.name === checkedCategory)
                .map(data => data.subCategory)[0].map(finalData => finalData.id);

            // eslint-disable-next-line prefer-const
            let addSubCategoryInUncheck = [...subCategoryCheckboxChecked, id];
            const filteredAddedSubCategoryInUncheck = addSubCategoryInUncheck.filter(item => filteredSubCategories.includes(item));

            addSubCategoryInUncheck = filteredAddedSubCategoryInUncheck;

            const selectedCategory = capacityResource.filter(item => item.name === checkedCategory);
            const selectedSubCategorynameList = selectedCategory.map(data => data.subCategory)[0].filter(ide => addSubCategoryInUncheck.includes(ide.id)).map(d => d.name);

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

            const filtering = PreserveresourceCollection[resourceType].filter(d => selectedSubCategorynameList.includes(d[selectedCategory[0].attribute]));

            const resourceCollectionUpdate = { ...resourceCollection };
            resourceCollectionUpdate[resourceType] = filtering;

            this.setState({
                resourceCollection: resourceCollectionUpdate,
            });
            // resourceCollection[resourceType] = filtering;


            this.setState({
                subCategoryCheckboxChecked: [...subCategoryCheckboxChecked, id],
                // checked: CHECKBOX_STATES.Indeterminate,
                selectedCategoryName: checkedCategory,
                indeterminantConditionArray: [...indeterminantConditionArray, checkedCategory],
            });
        } else if (!subCategoryCheckboxChecked.find(item => item === id)) {
            const filteredSubCategories = capacityResource.filter(item => item.name === checkedCategory)
                .map(data => data.subCategory)[0].map(finalData => finalData.id);


            // eslint-disable-next-line prefer-const
            let addSubCategoryInUncheck = [...subCategoryCheckboxChecked, id];
            const filteredAddedSubCategoryInUncheck = addSubCategoryInUncheck.filter(item => filteredSubCategories.includes(item));

            addSubCategoryInUncheck = filteredAddedSubCategoryInUncheck;

            // if (!addSubCategoryInUncheck.find(item => item === id)) {
            //     addSubCategoryInUncheck.push(id);
            // }
            const selectedCategory = capacityResource.filter(item => item.name === checkedCategory);
            const selectedSubCategorynameList = selectedCategory.map(data => data.subCategory)[0].filter(ide => addSubCategoryInUncheck.includes(ide.id)).map(d => d.name);


            const filtering = PreserveresourceCollection[resourceType].filter(d => selectedSubCategorynameList.includes(d[selectedCategory[0].attribute]));


            const resourceCollectionUpdate = { ...resourceCollection };
            resourceCollectionUpdate[resourceType] = filtering;
            this.setState({
                resourceCollection: resourceCollectionUpdate,
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
                    indeterminantConditionArray: indeterminantConditionArray.filter(item => item !== checkedCategory),


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

    private getIndexArr = (array) => {
        const data = array.map((item, i) => indeterminateArray.indexOf(item));
        return data;
    }

    private getCheckedIndexArr = () => {
        const { mainCategoryCheckboxChecked } = this.state;
        const data = mainCategoryCheckboxChecked.length && mainCategoryCheckboxChecked.map((item, i) => indeterminateArray.indexOf(item));

        return data || [];
    }

    private resourceProfileImage = (level, name) => {
        const ResourceCategory = capacityResource.filter(i => i.name === name)[0];

        const ResourceCategoryLevel2 = capacityResource.filter(i => i.name === name)[0].Category;

        if (level === 1) {
            const selectedResourceProfileImage = sidepanelLogo.filter(i => i.name === ResourceCategory.resourceType)[0].image;

            return {
                selectedResourceProfileImage,
            };
        }
        if (level === 2) {
            const selectedResourceProfileImage = sidepanelLogo.filter(item => (ResourceCategoryLevel2.map((data) => {
                const finalData = item.name === data.resourceType;
                return (finalData);
            })));
        }

        return null;
    }

    private updateResourceOnDataAddition = (resourceType) => {
        const { resourceCollection, PreserveresourceCollection } = this.state;
        const updatedResourcesCollection = { ...resourceCollection, [resourceType]: [] };

        this.setState({
            resourceCollection: updatedResourcesCollection,
            PreserveresourceCollection: updatedResourcesCollection,
        });
    }

    private handleVisualization = (boolean, checkedCategory, resourceType, level, lvl2catName, typeName) => {
        this.setState({ openVisualization: boolean });
        this.handleMainCategoryCheckBox(checkedCategory, resourceType, level, lvl2catName, typeName, boolean);

        ResourceType = resourceType;
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
        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 10,
        };
        const filteredCheckedSubCategory = filterSubCategory.filter(item => subCategoryCheckboxChecked.includes(item));
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


                    />
                ) : ''}
                <div className={_cs(styles.capacityAndResources, className)} id="capacityAndResources">
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


                            />
                        </div>
                    )
                        : (
                            <>
                                <header className={styles.header}>

                                    <div className={styles.actions}>
                                        {filterPermissionGranted
                                            ? (
                                                <Cloak hiddenIf={p => !p.add_resource}>
                                                    {/* <DangerButton

                                                        onClick={this.handleResourceAdd}
                                                        className={styles.clearButton}
                                                        transparent
                                                    >
                                         + Add Resource
                                                    </DangerButton> */}

                                                    <AccentModalButton
                                                        iconName="add"
                                                        title="Add New Resource"
                                                        transparent
                                                        onClick={this.resourceAdd}

                                                    // modal={(
                                                    //     <AddResourceForm
                                                    //         onAddSuccess={this.handleResourceAdd}
                                                    //         onEditSuccess={this.handleResourceEdit}
                                                    //     />
                                                    // )}
                                                    >
                                                        Add Resource
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
                                        {/* <TableModalButton
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
                                        /> */}
                                    </div>
                                </header>
                                {capacityResource.map((item, idx) => (
                                    <div key={item.name}>
                                        <div
                                            className={resourceCategory.find(res => res === item.name)
                                                ? styles.categorySelected : styles.categories}
                                        >
                                            <div style={{ marginTop: '5px' }}>
                                                <Checkbox
                                                    label="Value"
                                                    value={checked}
                                                    onChange={() => this.handleMainCategoryCheckBox(item.name, item.resourceType, item.level, item.name, item.typeName)}
                                                    checkedCategory={!!mainCategoryCheckboxChecked.find(data => data === item.name)}
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
                                                onClick={(item.Category || item.subCategory.length) ? () => this.handleSubCategory(item.name, showSubCategory) : () => this.handleMainCategoryCheckBox(item.name, item.resourceType, item.level, item.name, item.typeName)}
                                                onKeyDown={undefined}
                                                className={styles.individualCategories}
                                            >

                                                <div style={{ display: 'flex', alignItems: 'center' }}>


                                                    <ScalableVectorGraphics
                                                        className={styles.inputIcon}
                                                        // className={(test.length && test.find(d => d === item.name)) ? styles.selectedInputIcon : styles.unselectedInputIcon}


                                                        src={sidepanelLogo.filter(i => i.name === item.name)[0].image}
                                                    />
                                                    <h3 style={{ fontSize: '16px' }}>{item.name}</h3>
                                                </div>


                                                <div style={{ display: 'flex', alignItems: 'center', marginRight: (item.Category || item.subCategory.length) ? '0px' : '26px' }}>
                                                    {item.level === 1 ? (
                                                        <button type="button" style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => this.handleVisualization(true, item.name, item.resourceType, item.level, item.name, item.typeName)}>
                                                            {/* <Icon
                                                                name="table"
                                                                className={styles.inputIcon}
                                                            /> */}
                                                            <ScalableVectorGraphics
                                                                className={styles.visualizationIcon}


                                                                src={visualization}
                                                            />

                                                        </button>
                                                    ) : ''}
                                                    {(item.Category || item.subCategory.length) ? resourceCategory.find(res => res === item.name)
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
                                        {resourceCategory.find(elem => elem === item.name)
                                            ? item.level === 2
                                                ? (
                                                    item.Category.map(data => (
                                                        <ul key={data.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <div
                                                                style={{ display: 'flex', alignItems: 'center' }}
                                                                role="button"
                                                                tabIndex={0}
                                                                // eslint-disable-next-line max-len
                                                                onClick={() => this.handleSubCategory(data.name, showSubCategory)}
                                                                onKeyDown={undefined}

                                                            >
                                                                <input type="checkbox" name="name" style={{ height: '1rem', width: '1rem', marginRight: '10px', cursor: 'pointer' }} checked={!!mainCategoryCheckboxChecked.find(datas => datas === data.name)} onChange={disableCheckbox ? '' : () => this.handleMainCategoryCheckBox(data.name, data.resourceType, 2, item.name, '')} />
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
                                                            {/* <Checkbox
                                                                label="Value"
                                                                value={checked}
                                                                onChange={() => this.handleMainCategoryCheckBox(data.name, data.resourceType, 2)}
                                                                checkedCategory={!!mainCategoryCheckboxChecked.find(datas => datas === item.name)}
                                                                showIndeterminateButton={showIndeterminateButton}
                                                                index={this.getIndexArr(indeterminantConditionArray)}
                                                                checkedMainCategoryIndex={this.getCheckedIndexArr()}
                                                                ownIndex={idx}
                                                            /> */}

                                                            {/* {resourceCategory.find(itm => itm === data.name)
                                                                ? data.subCategory && data.subCategory.map(finalitem => (
                                                                    <ul key={finalitem.id}>
                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <input type="checkbox" name="name" style={{ height: '1rem', width: '1rem', marginRight: '10px', cursor: 'pointer' }} checked={!!subCategoryCheckboxChecked.find(i => i === finalitem.id)} onChange={() => this.handleSubCategoryCheckbox(finalitem.id, item.name, item.resourceType)} />
                                                                            <label htmlFor="name" style={{ cursor: 'pointer' }} onClick={() => this.handleSubCategoryCheckbox(finalitem.id, item.name, item.resourceType)}>
                                                                                {' '}
                                                                                <h3>{finalitem.name}</h3>
                                                                            </label>

                                                                        </div>
                                                                    </ul>
                                                                )) : ''
                                                            } */}

                                                        </ul>
                                                    )))
                                                : (
                                                    item.subCategory.map(data => (
                                                        <ul key={data.id}>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <input type="checkbox" name="name" style={{ height: '1rem', width: '1rem', marginRight: '10px', cursor: 'pointer' }} checked={!!subCategoryCheckboxChecked.find(i => i === data.id)} onChange={disableCheckbox ? '' : () => this.handleSubCategoryCheckbox(data.id, item.name, item.resourceType)} />
                                                                <label htmlFor="name" style={{ cursor: 'pointer', fontSize: '14px' }} onClick={disableCheckbox ? '' : () => this.handleSubCategoryCheckbox(data.id, item.name, item.resourceType)}>
                                                                    {' '}
                                                                    <h4>{data.name}</h4>
                                                                </label>

                                                            </div>

                                                        </ul>
                                                    ))


                                                )
                                            : ''}

                                    </div>
                                ))}

                            </>
                        )
                    }


                    {/* <SwitchView
                        activeLayersIndication={activeLayersIndication}
                        handleToggleClick={this.handleToggleClick}
                        handleIconClick={this.handleIconClick}
                        disabled={pending}
                    />
                    /> */}

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

                {/* {
                    (palikaRedirectState && palikaRedirect.showModal === 'addResource')
                    && (
                        <AddResourceForm
                            resourceId={isDefined(palikaRedirect.organisationItem)
                                ? palikaRedirect.organisationItem.id : null
                            }
                            resourceDetails={isDefined(palikaRedirect.organisationItem)
                                ? palikaRedirect.organisationItem : null}
                            onEditSuccess={this.handleResourceEdit}
                            closeModal={this.handleEditResourceFormCloseButtonClick}
                        />
                    )

                } */}

                { }
                {/* {
                    palikaRedirect.showForm && palikaRedirect.showModal === 'inventory'
                    // && isDefined(inventoryItem)
                    // && isDefined(inventoryItem.id)
                    && (
                        <InventoriesModal
                            resourceId={palikaRedirect.inventoryItem.resource || ''}
                            closeModal={this.handleInventoryModalClose}
                        />
                    )
                } */}

                {/* {showResourceForm && resourceDetails && (
                    <AddResourceForm
                        resourceId={resourceDetails.id}
                        resourceDetails={resourceDetails}
                        onEditSuccess={this.handleResourceEdit}
                        closeModal={this.handleEditResourceFormCloseButtonClick}
                    />
                )} */}
                {
                    showInventoryModal
                    && isDefined(resourceDetails)
                    && isDefined(resourceDetails.id)
                    && (
                        <InventoriesModal
                            resourceId={resourceDetails.id}
                            closeModal={this.handleInventoryModalClose}
                            filterPermissionGranted={filterPermissionGranted}
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
