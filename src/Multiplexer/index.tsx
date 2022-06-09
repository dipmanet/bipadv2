/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import Loadable from 'react-loadable';
import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { Router } from '@reach/router';
import {
    _cs,
    bound,
} from '@togglecorp/fujs';
import memoize from 'memoize-one';
import i18n from 'i18next';
import { initReactI18next, Translation } from 'react-i18next';

import { bbox, point, buffer } from '@turf/turf';
import mapboxgl from 'mapbox-gl';
import { enTranslation, npTranslation } from '#constants/translations';
import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';
import MapOrder from '#re-map/MapOrder';
import { getLayerName } from '#re-map/utils';
import Icon from '#rscg/Icon';
import { setStyleProperty } from '#rsu/styles';
import Responsive from '#rscg/Responsive';
import DangerButton from '#rsca/Button/DangerButton';
import { AppState } from '#store/types';
import {
    RouteDetailElement,
    RegionAdminLevel,
    RegionValueElement,
    Layer,
    FiltersElement,
    Language,
} from '#types';


import {
    District,
    Province,
    Municipality,
    // HazardType,
} from '#store/atom/page/types';
import { User } from '#store/atom/auth/types';

// import SVGMapIcon from '#components/SVGMapIcon';
import Loading from '#components/Loading';
import Navbar from '#components/Navbar';
import PageContext from '#components/PageContext';
import TitleContextProvider from '#components/TitleContext';
import LayerSwitch from '#components/LayerSwitch';
import LayerToggle from '#components/LayerToggle';
import MapDownloadButton from '#components/MapDownloadButton';
import { routeSettings } from '#constants';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import AppBrand from '#components/AppBrand';
import Filters from '#components/Filters';

import {
    userSelector,
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
    filtersSelector,
    languageSelector,
    // hazardTypeListSelector,
} from '#selectors';
import {
    setInitialPopupHiddenAction,
    setRegionAction,
    setFiltersAction,
    setLanguageAction,
} from '#actionCreators';

import authRoute from '#components/authRoute';
import { getFeatureInfo } from '#utils/domain';
import LanguageToggle from '#components/LanguageToggle';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
import ZoomToolBar from '#components/ZoomToolBar';
import errorBound from '../errorBound';
import helmetify from '../helmetify';
import styles from './styles.scss';

import DownloadButtonOption from './DownloadButtonOption';


function reloadPage() {
    window.location.reload(false);
}

const ErrorInPage = () => (
    <Translation>
        {
            t => (
                <div className={styles.errorInPage}>
                    {t('Some problem occurred.')}
                    <DangerButton
                        transparent
                        onClick={reloadPage}
                    >
                        {t('Reload')}
                    </DangerButton>
                </div>
            )
        }
    </Translation>
);

const RetryableErrorInPage = ({ error, retry }: LoadOptions) => (
    <Translation>
        {
            t => (
                <div className={styles.retryableErrorInPage}>
                    {t('Some problem occurred.')}
                    <DangerButton
                        onClick={retry}
                        transparent
                    >
                        {t('Reload')}
                    </DangerButton>
                </div>
            )

        }
    </Translation>

);


interface LoadOptions {
    error: string;
    retry: () => void;
}

const LoadingPage = ({ error, retry }: LoadOptions) => {
    if (error) {
        // NOTE: show error while loading page
        console.error(error);
        return (
            <RetryableErrorInPage
                error={error}
                retry={retry}
            />
        );
    }
    return (
        <Translation>
            {
                t => (
                    <Loading
                        text={t('Loading Page')}
                        pending
                    />
                )
            }
        </Translation>

    );
};


const routes = routeSettings.map(({ load, ...settings }) => {
    const Com = authRoute<typeof settings>()(
        helmetify(
            Loadable({
                loader: load,
                loading: LoadingPage,
            }),
        ),
    );

    const Component = errorBound<typeof settings>(ErrorInPage)(Com);
    return (
        <Component
            key={settings.name}
            {...settings}
        />
    );
});

// MULTIPLEXER

const domain = process.env.REACT_APP_DOMAIN;

interface State {
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    mainContent?: React.ReactNode;
    filterContent?: React.ReactNode;
    leftContentContainerClassName?: string;
    rightContentContainerClassName?: string;
    mainContentContainerClassName?: string;
    filterContentContainerClassName?: string;
    leftContainerHidden?: boolean;
    hideMap?: boolean;
    hideFilter?: boolean;
    hideLocationFilter?: boolean;
    hideHazardFilter?: boolean;
    hideDataRangeFilter?: boolean;
    activeRouteDetails: RouteDetailElement | undefined;
    activeLayers: Layer[];
    mapDownloadPending: boolean;
    checkLatLngState: boolean;
    longitude: string | number;
    lattitude: string | number;
    rectangleBoundingBox: [any, any];
    drawRefState: boolean;
    geoLocationStatus: boolean;
    currentMarkers: [];
    markerStatus: boolean;
    checkFullScreenStatus: boolean;
    currentBounds: mapboxgl.LngLatBounds;

}

interface BoundingClientRect {
    width: number;
}

interface OwnProps {
    pending: boolean;
    hasError: boolean;
    mapStyle: string;
    boundingClientRect?: BoundingClientRect;
    language: Language;
}

interface PropsFromState {
    user?: User;
    districts: District[];
    provinces: Province[];
    municipalities: Municipality[];
    filters: FiltersElement;
    language: Language;
    // hazardList: HazardType[];
}

interface PropsFromDispatch {
    setInitialPopupHidden: typeof setInitialPopupHiddenAction;
    setRegion: typeof setRegionAction;
    setFilters: typeof setFiltersAction;
    setLanguage: typeof setLanguageAction;
}

interface Coords {
    coords: {
        latitude: number;
        longitude: number;
    };
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;


const mapStateToProps = (state: AppState): PropsFromState => ({
    language: languageSelector(state),
    user: userSelector(state),
    filters: filtersSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    provinces: provincesSelector(state),
    // hazardList: hazardTypeListSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setLanguage: params => dispatch(setLanguageAction(params)),
    setInitialPopupHidden: params => dispatch(setInitialPopupHiddenAction(params)),
    setRegion: params => dispatch(setRegionAction(params)),
    setFilters: params => dispatch(setFiltersAction(params)),
});

const getMatchingRegion = (
    subdomain: string | undefined,
    provinces: Province[],
    districts: District[],
    municipalities: Municipality[],
): RegionValueElement | undefined => {
    if (!subdomain) {
        return undefined;
    }

    const province = provinces.find(p => p.code === subdomain);
    if (province) {
        return {
            adminLevel: 1,
            geoarea: province.id,
        };
    }

    const district = districts.find(p => p.code === subdomain);
    if (district) {
        return {
            adminLevel: 2,
            geoarea: district.id,
        };
    }

    const municipality = municipalities.find(p => p.code === subdomain);
    if (municipality) {
        return {
            adminLevel: 3,
            geoarea: municipality.id,
        };
    }

    return undefined;
};


const layerNameMap = {
    raster: 'raster-layer',
    choropleth: 'choropleth-layer',
};

const getUserRegion = (user?: User): RegionValueElement => {
    if (user && user.profile) {
        const { profile: { region, province, municipality, district } } = user;
        if (region === 'province' && province) {
            return {
                adminLevel: 1,
                geoarea: province,
            };
        }
        if (region === 'district' && district) {
            return {
                adminLevel: 2,
                geoarea: district,
            };
        }
        if (region === 'municipality' && municipality) {
            return {
                adminLevel: 3,
                geoarea: municipality,
            };
        }
    }
    return {};
};
const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    FeatureGetRequest: {
        url: ({ params }) => `${params.api}`,
        method: methods.GET,
        onMount: false,

        onSuccess: ({ response, params }) => {
            params.responseData(response);
        },
    },


};
class Multiplexer extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            leftContent: undefined,
            rightContent: undefined,
            leftContentContainerClassName: undefined,
            rightContentContainerClassName: undefined,
            activeRouteDetails: undefined,
            activeLayers: [],
            leftContainerHidden: false,
            mapDownloadPending: false,
            mapDataOnClick: {},
            tooltipClicked: false,
            mapClickedResponse: {},
            tooltipLatlng: undefined,
            LoadingTooltip: false,
            landslidePolygonImagemap: [],
            landslidePolygonChoroplethMapData: [],
            climateChangeSelectedDistrict: { id: undefined, title: undefined },
            addResource: false,
            toggleLeftPaneButtonStretched: true,
            extraFilterName: '',
            isFilterClicked: false,
            longitude: '',
            lattitude: '',
            checkLatLngState: false,
            rectangleBoundingBox: [],
            drawRefState: false,
            geoLocationStatus: false,
            currentMarkers: [],
            markerStatus: false,
            checkFullScreenStatus: false,
            isTilesLoaded: false,
            toggleAnimationMapDownloadButton: false,
            elementStatus: false,
            showLanguageToolbar: false,
        };
    }


    public componentDidMount() {
        // NOTE: this means everything has loaded before mounting this page,
        // which is highly unlikely
        const {
            pending,
            provinces,
            districts,
            municipalities,
            filters,
            setFilters,
            user,
        } = this.props;

        if (!pending) {
            this.setFilterFromUrl(provinces, districts, municipalities, filters, setFilters, user);
        }
        // debug true for development
        i18n.use(initReactI18next).init({
            lng: 'en',
            debug: false,
            fallbackLng: 'en',
            resources: {
                en: enTranslation,
                np: npTranslation,
            },
        });
    }

    public UNSAFE_componentWillReceiveProps(nextProps: Props) {
        const {
            pending: oldPending,
        } = this.props;


        const {
            pending: newPending,
            provinces,
            municipalities,
            districts,
            filters,
            setFilters,
            user,
        } = nextProps;

        // NOTE: this means data has been loaded
        if (oldPending !== newPending && !newPending) {
            this.setFilterFromUrl(provinces, districts, municipalities, filters, setFilters, user);
        }
    }

    public componentDidUpdate(prevProps) {
        const { boundingClientRect, setLanguage } = this.props;
        const { showLanguageToolbar } = this.state;
        this.setLeftPanelWidth(boundingClientRect);
        const { language: { language } } = this.props;
        if (prevProps.language !== language) {
            i18n.changeLanguage(language);
        }
        if (language === 'np' && !showLanguageToolbar) {
            setLanguage({ language: 'en' });
        }

        // Km to nepali translation//
        // const x = document.getElementsByClassName('mapboxgl-ctrl mapboxgl-ctrl-scale')[0];

        // if (language === 'np' && x && x.innerHTML.includes('km')) {
        //     x.innerHTML = x.innerHTML.replaceAll('km', 'किमि');
        // } else if (language === 'en' && x && x.innerHTML.includes('किमि')) {
        //     x.innerHTML = x.innerHTML.replaceAll('किमि', 'km');
        // }
    }

    private handlemapClickedResponse = (data) => {
        this.setState({ mapClickedResponse: data });
        this.setState({ LoadingTooltip: false });
    }

    private handleTilesLoad = (boolean) => {
        this.setState({ isTilesLoaded: boolean });
    }

    private handleMapClicked = (latlngData) => {
        const { activeLayers } = this.state;

        if (activeLayers.length && !activeLayers[activeLayers.length - 1].jsonData) {
            this.setState({
                tooltipLatlng: undefined,
            });
        }
        if (latlngData && activeLayers.length) {
            const { requests: { FeatureGetRequest } } = this.props;
            const latlng = point([latlngData.lngLat.lng, latlngData.lngLat.lat]);
            let bufferScale = 5000000;
            if (this.mapContainerRef.current) {
                const zoomLevel = this.mapContainerRef.current.getZoom();
                bufferScale /= (2 ** zoomLevel);
            }
            const buffered = buffer(latlng, bufferScale, { units: 'meters' });
            const bBox = bbox(buffered);
            const api = getFeatureInfo(activeLayers[activeLayers.length - 1], bBox);
            this.setState({ LoadingTooltip: true });
            FeatureGetRequest.do({
                api,
                responseData: this.handlemapClickedResponse,
            });
        }
        return null;
    }

    private lattitudeRef = React.createRef<HTMLInputElement>();

    private mapContainerRef = React.createRef<mapboxgl.Map>();

    private geoLocationRef = React.createRef<mapboxgl.GeolocateControl>();

    private markerRef = React.createRef<mapboxgl.Marker>()

    private setFilterFromUrl = (
        provinces: Province[],
        districts: District[],
        municipalities: Municipality[],
        filters: PropsFromState['filters'],
        setFilters: PropsFromDispatch['setFilters'],
        user?: User,
    ) => {
        const { hostname } = window.location;

        const index = hostname.search(`.${domain}`);
        const subDomain = index !== -1
            ? hostname.substring(0, index)
            : undefined;

        const region = getMatchingRegion(subDomain, provinces, districts, municipalities);
        const userRegion = getUserRegion(user);

        const {
            geoarea: currentGeoarea,
            adminLevel: currentAdminLevel,
        } = region || userRegion;

        const {
            geoarea: oldGeoarea,
            adminLevel: oldAdminLevel,
        } = filters.region || userRegion;

        if (currentGeoarea && currentAdminLevel && (
            currentGeoarea !== oldGeoarea || oldAdminLevel !== currentAdminLevel
        )) {
            setFilters({
                filters: {
                    ...filters,
                    region: region || userRegion,
                },
            });
        }
    }

    private renderRoutes = () => {
        const { pending, hasError } = this.props;

        if (hasError) {
            return (
                <ErrorInPage />
            );
        }
        if (pending) {
            return (
                <Translation>
                    {
                        t => (
                            <Loading
                                text={t('Loading Resources')}
                                pending
                            />
                        )
                    }
                </Translation>

            );
        }
        return (
            <Router>
                {routes}
            </Router>
        );
    }

    private setLeftPanelWidth = memoize((boundingClientRect) => {
        const { width = 0 } = boundingClientRect;
        setStyleProperty('widthLeftPanel', `${bound(64 + width * 0.3, 360, 600)}px`);
    })

    private setLeftContent = (
        content: React.ReactNode,
        leftContentContainerClassName?: string,
    ) => {
        this.setState({
            leftContent: content,
            leftContentContainerClassName,
        });
    }

    private setRightContent = (
        content: React.ReactNode,
        rightContentContainerClassName?: string,
    ) => {
        this.setState({
            rightContent: content,
            rightContentContainerClassName,
        });
    }

    private setMainContent = (
        content: React.ReactNode,
        mainContentContainerClassName?: string,
    ) => {
        this.setState({
            mainContent: content,
            mainContentContainerClassName,
        });
    }

    private setFilterContent = (
        content: React.ReactNode,
        filterContentContainerClassName?: string,
    ) => {
        this.setState({
            filterContent: content,
            filterContentContainerClassName,
        });
    }

    private setActiveRouteDetails = (activeRouteDetails: RouteDetailElement) => {
        this.setState({ activeRouteDetails });
    }

    private handleMapDownloadStateChange = (mapDownloadPending: boolean) => {
        this.setState({ mapDownloadPending });
    }

    private hideMap = () => {
        this.setState({ hideMap: true });
    }

    private showMap = () => {
        this.setState({ hideMap: false });
    }

    private hideFilter = () => {
        this.setState({ hideFilter: true });
    }

    private showFilter = () => {
        this.setState({ hideFilter: false });
    }

    private hideLocationFilter = () => {
        this.setState({ hideLocationFilter: true });
    }

    private showLocationFilter = () => {
        this.setState({ hideLocationFilter: false });
    }

    private hideHazardFilter = () => {
        this.setState({ hideHazardFilter: true });
    }

    private showHazardFilter = () => {
        this.setState({ hideHazardFilter: false });
    }

    private hideDataRangeFilter = () => {
        this.setState({ hideDataRangeFilter: true });
    }

    private showDataRangeFilter = () => {
        this.setState({ hideDataRangeFilter: false });
    }

    private extraFilterName = (data) => {
        this.setState({ extraFilterName: data });
    }

    private FilterClickedStatus = (boolean) => {
        this.setState({ isFilterClicked: boolean });
    }

    private addLayer = (layer: Layer) => {
        this.setState(({ activeLayers }) => {
            const layerIndex = activeLayers.findIndex(d => d.id === layer.id);

            if (layerIndex === -1) {
                return ({
                    activeLayers: [
                        ...activeLayers,
                        layer,
                    ],
                });
            }

            // update layer
            const newActiveLayers = [...activeLayers];
            newActiveLayers.splice(layerIndex, 1, layer);

            return { activeLayers: newActiveLayers };
        });
    }

    private removeLayer = (layerId: Layer['id']) => {
        this.setState(({ activeLayers }) => {
            const layerIndex = activeLayers.findIndex(d => d.id === layerId);

            if (layerIndex !== -1) {
                const newActiveLayers = [...activeLayers];
                newActiveLayers.splice(layerIndex, 1);

                return { activeLayers: newActiveLayers };
            }

            return { activeLayers };
        });
    }

    private setLayers = (activeLayers: Layer[]) => {
        this.setState({ activeLayers });
    }

    private addLayers = (layerList: Layer[]) => {
        this.setState(({ activeLayers }) => {
            const newActiveLayerList = [...activeLayers];

            layerList.forEach((layer) => {
                if (newActiveLayerList.findIndex(d => d.id === layer.id) === -1) {
                    newActiveLayerList.push(layer);
                }
            });

            return { activeLayers: newActiveLayerList };
        });
    }

    private removeLayers = (layerIdList: Layer['id'][]) => {
        this.setState(({ activeLayers }) => {
            const newActiveLayerList = [...activeLayers];

            layerIdList.forEach((layerId) => {
                const layerIndex = newActiveLayerList.findIndex(d => d.id === layerId);

                if (layerIndex !== -1) {
                    newActiveLayerList.splice(layerIndex, 1);
                }
            });

            return ({ activeLayers: newActiveLayerList });
        });
    }

    private getLayerOrder = memoize((activeLayers: Layer[]) => {
        const otherLayers = [
            getLayerName('risk-infoz-outlines', 'ward-outline'),
            getLayerName('risk-infoz-outlines', 'municipality-outline'),
            getLayerName('risk-infoz-outlines', 'district-outline'),
            getLayerName('risk-infoz-outlines', 'province-outline'),
            getLayerName('risk-infoz-outlines', 'ward-label'),
            getLayerName('risk-infoz-outlines', 'municipality-label'),
            getLayerName('risk-infoz-outlines', 'district-label'),
            getLayerName('risk-infoz-outlines', 'province-label'),
        ];

        const layers = activeLayers.map(
            d => getLayerName(d.layername, layerNameMap[d.type]),
        );
        return [
            ...layers,
            ...otherLayers,
        ];
    })


    private getRegionName = (
        selectedRegion: RegionValueElement,
        provinces: Province[],
        districts: District[],
        municipalities: Municipality[],
    ) => {
        if (!selectedRegion || !selectedRegion.adminLevel) {
            return (
                <Translation>
                    {
                        t => <span>{t('National')}</span>
                    }
                </Translation>
            );
        }

        const adminLevels: {
            [key in RegionAdminLevel]: Province[] | District[] | Municipality[];
        } = {
            1: provinces,
            2: districts,
            3: municipalities,
        };

        const regionList = adminLevels[selectedRegion.adminLevel];
        const currentRegion = regionList.find(d => d.id === selectedRegion.geoarea);
        const { language: { language } } = this.props;
        if (currentRegion && language === 'en') {
            return (
                <Translation>
                    {
                        t => (
                            `${currentRegion.title} ${t(currentRegion.type)}`

                        )
                    }
                </Translation>


            );
        }

        if (currentRegion && language === 'np') {
            return (
                <Translation>
                    {
                        t => (
                            `${currentRegion.title_ne} ${t(currentRegion.type)}`

                        )
                    }
                </Translation>
            );
        }

        return 'Unknown';
    }

    private getRegionDetails = (
        selectedRegion: RegionValueElement,
        provinces: Province[],
        districts: District[],
        municipalities: Municipality[],
    ) => {
        if (!selectedRegion || !selectedRegion.adminLevel) {
            return 'National';
        }

        const adminLevels: {
            [key in RegionAdminLevel]: Province[] | District[] | Municipality[];
        } = {
            1: provinces,
            2: districts,
            3: municipalities,
        };

        const regionList = adminLevels[selectedRegion.adminLevel];
        const currentRegion = regionList.find(d => d.id === selectedRegion.geoarea);

        if (currentRegion) {
            return currentRegion;
        }

        return 'Unknown';
    }

    private handleToggleLeftContainerVisibilityButtonClick = () => {
        const { toggleLeftPaneButtonStretched } = this.state;
        this.setState(
            ({ leftContainerHidden: prevLeftContainerHidden }) => ({
                leftContainerHidden: !prevLeftContainerHidden,
            }),
        );
        this.setState({ toggleLeftPaneButtonStretched: !toggleLeftPaneButtonStretched });
    }

    private clickHandler = (data) => {
        const { activeRouteDetails } = this.context;
        this.setState({ mapDataOnClick: data });
        this.setState({ tooltipClicked: true });
        this.setState({
            tooltipLatlng: data.lngLat,
        });
    }

    private closeTooltip = (data) => {
        this.setState({ tooltipLatlng: data });
    }

    private handleLandslidePolygonImageMap = (data) => {
        this.setState({
            landslidePolygonImagemap: data,
        });
    }

    private handlelandslidePolygonChoroplethMapData = (data) => {
        this.setState({
            landslidePolygonChoroplethMapData: data,
        });
    }

    private setClimateChangeSelectedDistrict = (data) => {
        const { id, properties: { title } } = data;

        this.setState({
            climateChangeSelectedDistrict: { id, title },
        });
    }

    private setAddResource = (boolean) => {
        this.setState({
            addResource: boolean,
        });
    }

    private getRegionDetails = (
        selectedRegion: RegionValueElement,
        provinces: Province[],
        districts: District[],
        municipalities: Municipality[],
    ) => {
        if (!selectedRegion || !selectedRegion.adminLevel) {
            return 'National';
        }

        const adminLevels: {
            [key in RegionAdminLevel]: Province[] | District[] | Municipality[];
        } = {
            1: provinces,
            2: districts,
            3: municipalities,
        };

        const regionList = adminLevels[selectedRegion.adminLevel];
        const currentRegion = regionList.find(d => d.id === selectedRegion.geoarea);

        if (currentRegion) {
            return currentRegion;
        }

        return 'Unknown';
    }

    private fullScreenMap = () => {
        this.setState({ checkFullScreenStatus: true });

        if (this.mapContainerRef.current) {
            const mainapp = this.mapContainerRef.current.getContainer();

            this.setState({ currentBounds: this.mapContainerRef.current.getBounds() });

            mainapp.requestFullscreen();
        }

        const resetFunc = setTimeout(() => {
            // if (this.mapContainerRef.current) {
            //     const nepalBbox = [[80.05858661752784, 26.347836996368667],
            //         [88.20166918432409, 30.44702867091792]];

            //     const currentBbox = this.mapContainerRef.current.getBounds();
            //     console.log('current bbox is', currentBbox);

            //     let status = false;
            //     // eslint-disable-next-line no-plusplus
            //     for (let i = 0; i < nepalBbox.length; i++) {
            //         // eslint-disable-next-line no-plusplus
            //         for (let j = 0; j < nepalBbox.length; j++) {
            //             if (nepalBbox[i][j] === currentBbox[i][j]) {
            //                 status = true;
            //             }
            //         }
            //     }
            //     if (status) {
            //         return;
            //     }
            // }
            if (this.mapContainerRef.current) {
                this.mapContainerRef.current.fitBounds(this.state.currentBounds, { duration: 1000 });
            }
        }, 700); // triggered after 700ms

        return () => clearTimeout(resetFunc);
    };

    private markersArray = (marker: any) => {
        this.setState(prevState => prevState.currentMarkers.push(marker));
    };

    private goToLocation = () => {
        if (this.state.markerStatus) {
            this.setState({ markerStatus: false });
        } else {
            this.setState({ markerStatus: true });
        }

        if (this.mapContainerRef.current) {
            if (this.state.longitude && this.state.lattitude) {
                this.mapContainerRef.current.flyTo({
                    speed: 1,
                    center: {
                        lat: this.state.lattitude,
                        lng: this.state.longitude,
                    },
                    zoom: 12,
                });
            }
            const marker = new mapboxgl.Marker()
                .setLngLat([this.state.longitude, this.state.lattitude])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }) // add popups
                        .setHTML(
                            `<h3 style=padding:25px 50px;>Lattitude : ${this.state.lattitude}, Longitude : ${this.state.longitude}</h3>`,
                        ),
                )
                .addTo(this.mapContainerRef.current);

            this.markerRef.current = marker;

            this.markersArray(marker);

            if (this.state.currentMarkers !== null) {
                // eslint-disable-next-line no-plusplus
                for (let i = this.state.currentMarkers.length - 1; i >= 0; i--) {
                    this.state.currentMarkers[i].remove();
                }
            }
        }
    }


    private mapOnClick = (event: mapboxgl.EventData) => {
        if (!this.state.checkLatLngState) return;

        const coordinates = event.lngLat;

        if (this.state.currentMarkers.length > 0) {
            // eslint-disable-next-line no-plusplus
            for (let i = this.state.currentMarkers.length - 1; i >= 0; i--) {
                this.state.currentMarkers[i].remove();
            }
        }

        const marker = new mapboxgl.Marker();
        this.setState({ longitude: coordinates.lng });
        this.setState({ lattitude: coordinates.lat });
        if (this.mapContainerRef.current) {
            marker.setLngLat(coordinates).addTo(this.mapContainerRef.current);
        }

        this.markersArray(marker);
    }


    private handleToggle = () => {
        if (this.lattitudeRef.current) {
            this.lattitudeRef.current.focus();
        }

        if (!this.state.checkLatLngState && this.mapContainerRef.current) {
            this.mapContainerRef.current.on('click', event => this.mapOnClick(event));
        }

        if (this.state.checkLatLngState && this.mapContainerRef.current) {
            this.mapContainerRef.current.off('click', event => this.mapOnClick(event));

            if (this.state.currentMarkers.length > 0) {
                // eslint-disable-next-line no-plusplus
                for (let i = this.state.currentMarkers.length - 1; i >= 0; i--) {
                    this.state.currentMarkers[i].remove();
                }
            }
        }

        if (this.state.checkLatLngState) {
            this.setState({ checkLatLngState: false });
        } else {
            this.setState({ checkLatLngState: true });
        }
    };

    private drawToZoom = () => {
        if (this.state.drawRefState) {
            this.setState({ drawRefState: false });
        } else {
            this.setState({ drawRefState: true });
        }
    }


    private resetDrawState = () => {
        this.setState({ drawRefState: false });
    }

    private currentLocation = () => {
        const dotElement = document.querySelector('.mapboxgl-user-location-dot');
        if (dotElement) {
            dotElement.style.display = 'unset';
        }
        if (this.geoLocationRef.current) {
            this.geoLocationRef.current.trigger();


            if (this.state.geoLocationStatus) {
                this.setState({ geoLocationStatus: false });
            } else {
                this.setState({ geoLocationStatus: true });
            }
        }
    };

    private fullScreenOffFunc = () => {
        if (this.state.checkFullScreenStatus) {
            this.setState({ checkFullScreenStatus: false });
        }
    }

    private handleToggleAnimationMapDownloadButton = (boolean) => {
        this.setState({ toggleAnimationMapDownloadButton: boolean });
    }

    private handleModalLanguage = () => {
        console.log('working from multiplexer');

        // const RequiredRoutes = [
        //     'Situation Report', 'Relief', 'Reported incidents',
        //     'Report an incident', 'Feedback & Support', 'About Us', 'Login'];

        // if (RequiredRoutes.includes(identity)) {
        //     console.log(identity, 'included');
        // }
    }

    public render() {
        const {
            mapStyle,
            filters,
            provinces,
            districts,
            municipalities,
            language: { language },
            // hazardList,
            // hazardList,
        } = this.props;


        const {
            leftContent,
            leftContentContainerClassName,
            rightContent,
            rightContentContainerClassName,
            mainContent,
            mainContentContainerClassName,
            filterContent,
            filterContentContainerClassName,
            hideMap,
            hideFilter,
            hideLocationFilter,
            hideDataRangeFilter,
            hideHazardFilter,
            activeRouteDetails,
            activeLayers,
            leftContainerHidden,
            mapDownloadPending,
            mapDataOnClick,
            tooltipClicked,
            mapClickedResponse,
            tooltipLatlng,
            LoadingTooltip,
            landslidePolygonImagemap,
            handlelandslidePolygonChoroplethMapData,
            landslidePolygonChoroplethMapData,
            climateChangeSelectedDistrict,
            addResource,
            toggleLeftPaneButtonStretched,
            extraFilterName,
            isFilterClicked,
            longitude,
            checkLatLngState,
            rectangleBoundingBox,
            drawRefState,
            currentMarkers,
            currentBounds,
            checkFullScreenStatus,
            isTilesLoaded,
            toggleAnimationMapDownloadButton,
            showLanguageToolbar,
        } = this.state;


        const pageProps = {
            setLeftContent: this.setLeftContent,
            setRightContent: this.setRightContent,
            setFilterContent: this.setFilterContent,
            setActiveRouteDetails: this.setActiveRouteDetails,
            setMainContent: this.setMainContent,
            activeRouteDetails,
            hideMap: this.hideMap,
            showMap: this.showMap,
            showFilter: this.showFilter,
            hideFilter: this.hideFilter,
            showLocationFilter: this.showLocationFilter,
            hideLocationFilter: this.hideLocationFilter,
            showHazardFilter: this.showHazardFilter,
            hideHazardFilter: this.hideHazardFilter,
            showDataRangeFilter: this.showDataRangeFilter,
            hideDataRangeFilter: this.hideDataRangeFilter,
            extraFilterName: this.extraFilterName,

        };

        const riskInfoLayerProps = {
            addLayer: this.addLayer,
            removeLayer: this.removeLayer,
            addLayers: this.addLayers,
            removeLayers: this.removeLayers,
            setLayers: this.setLayers,
            activeLayers,
            mapDataOnClick,
            tooltipClicked,
            closeTooltip: this.closeTooltip,
            mapClickedResponse,
            tooltipLatlng,
            LoadingTooltip,
            landslidePolygonImagemap,
            handleLandslidePolygonImageMap: this.handleLandslidePolygonImageMap,
            handlelandslidePolygonChoroplethMapData: this.handlelandslidePolygonChoroplethMapData,
            landslidePolygonChoroplethMapData,
            climateChangeSelectedDistrict,
            setClimateChangeSelectedDistrict: this.setClimateChangeSelectedDistrict,

            FilterClickedStatus: this.FilterClickedStatus,
            isFilterClicked,
            addResource,
            setAddResource: this.setAddResource,

        };

        const regionName = this.getRegionName(
            filters.region,
            provinces,
            districts,
            municipalities,
        );
        const orderedLayers = this.getLayerOrder(activeLayers);
        const hideFilters = false;
        const activeRouteName = activeRouteDetails && activeRouteDetails.name;
        const detailsOfLoggedAdmin = this.getRegionDetails(
            filters.region,
            provinces,
            districts,
            municipalities,
        );


        const resetLocation = () => {
            // if (this.state.geoLocationStatus && this.geoLocationRef.current) {
            const dotElement = document.querySelector('.mapboxgl-user-location-dot');
            if (dotElement) {
                dotElement.style.display = 'none';
            }
            // }
            if (currentMarkers !== null) {
                // eslint-disable-next-line no-plusplus
                for (let i = currentMarkers.length - 1; i >= 0; i--) {
                    currentMarkers[i].remove();
                }
            }

            this.setState({ geoLocationStatus: false });
            if (this.mapContainerRef.current) {
                // centriod of nepal
                if (detailsOfLoggedAdmin
                    && !detailsOfLoggedAdmin.province && !detailsOfLoggedAdmin.district) {
                    this.mapContainerRef.current.fitBounds([
                        [80.05858661752784, 26.347836996368667],
                        [88.20166918432409, 30.44702867091792]], {
                        padding: 24,
                    });
                }
                // checking province
                if (detailsOfLoggedAdmin
                    && detailsOfLoggedAdmin.centroid) {
                    this.mapContainerRef.current.fitBounds(detailsOfLoggedAdmin.bbox, {
                        padding: 24,
                    });
                }
                // checking district
                if (detailsOfLoggedAdmin && detailsOfLoggedAdmin.province) {
                    this.mapContainerRef.current.fitBounds(detailsOfLoggedAdmin.bbox, {
                        padding: 24,
                    });
                }
                // checking municipality
                if (detailsOfLoggedAdmin && detailsOfLoggedAdmin.province
                    && detailsOfLoggedAdmin.district) {
                    this.mapContainerRef.current.fitBounds(detailsOfLoggedAdmin.bbox, {
                        padding: 24,
                    });
                }
            }

            this.setState({ checkLatLngState: false, longitude: '', lattitude: '' });
        };

        const longitudeData = (val: number) => {
            this.setState({ longitude: val });
        };

        const lattiudeData = (val: number) => {
            this.setState({ lattitude: val });
        };
        const queryStringParams = window.location.href.split('#/')[1];

        const polygonDrawAccessableRoutes = ['vulnerability'];

        const Routes = ['', 'incidents', 'damage-and-loss', 'realtime', 'risk-info'];
        const queryStringParamsTranlation = window.location.href.split('/')[3];

        if (Routes.includes(queryStringParamsTranlation)) {
            this.setState({ showLanguageToolbar: true });
        } else {
            this.setState({ showLanguageToolbar: false });
        }

        return (
            <PageContext.Provider value={pageProps}>
                <TitleContextProvider>
                    <div className={_cs(
                        styles.multiplexer,
                        leftContainerHidden && styles.leftContainerHidden,
                        mapDownloadPending && styles.downloadingMap,
                        language === 'np' && styles.languageFont,
                    )}
                    >
                        <div className={_cs(styles.content, 'bipad-main-content')}>
                            <RiskInfoLayerContext.Provider value={riskInfoLayerProps}>
                                <Map
                                    activeRouteName={activeRouteName}
                                    hideMap={hideMap}
                                    toggleLeftPaneButtonStretched={toggleLeftPaneButtonStretched}
                                    handleTilesLoad={this.handleTilesLoad}
                                    isTilesLoaded={isTilesLoaded}
                                    mapStyle={mapStyle}
                                    clickHandler={this.clickHandler}
                                    handleMapClicked={this.handleMapClicked}

                                    toggleAnimationMapDownloadButton={toggleAnimationMapDownloadButton}

                                    mapOptions={{
                                        logoPosition: 'top-left',
                                        minZoom: 5,
                                        // makes initial map center to Nepal
                                        center: {
                                            lng: 85.300140,
                                            lat: 27.700769,
                                        },
                                    }}
                                    scaleControlShown
                                    scaleControlPosition="bottom-right"
                                    navControlShown
                                    navControlPosition="bottom-right"
                                    geoLocationRef={this.geoLocationRef}
                                    rectangleBoundingBox={rectangleBoundingBox}
                                    mapContainerRefMultiplexer={this.mapContainerRef}
                                    drawRefState={drawRefState}
                                    resetDrawState={this.resetDrawState}
                                    queryStringParams={queryStringParams}
                                    polygonDrawAccessableRoutes={polygonDrawAccessableRoutes}
                                    checkFullScreenStatus={checkFullScreenStatus}
                                    currentBounds={currentBounds}
                                    fullScreenOffFunc={this.fullScreenOffFunc}
                                >
                                    {leftContent && (
                                        <aside className={_cs(
                                            activeRouteName === 'contacts' || activeRouteName === 'documents' || activeRouteName === 'projects' ? styles.halfPageLeftPane : styles.left,
                                            leftContainerHidden && styles.hidden,
                                        )}
                                        >
                                            <AppBrand
                                                className={styles.brand}
                                                regionName={regionName}
                                            />
                                            <div
                                                className={_cs(
                                                    styles.leftContentContainer,
                                                    leftContentContainerClassName,
                                                )}
                                            >
                                                {leftContent}
                                            </div>
                                        </aside>
                                    )}
                                    {leftContent && (
                                        <div
                                            role="presentation"
                                            className={activeRouteName === 'contacts' || activeRouteName === 'documents' || activeRouteName === 'projects' ? toggleLeftPaneButtonStretched
                                                ? styles.toggleLeftContainerVisibilityButtonHalfPageLeftPane
                                                : styles.toggleLeftPaneButtonCompresed
                                                : styles.toggleLeftContainerVisibilityButton}
                                            onClick={
                                                this.handleToggleLeftContainerVisibilityButtonClick
                                            }
                                        >
                                            <Icon
                                                name={leftContainerHidden ? 'chevronRight' : 'chevronLeft'}
                                            />
                                        </div>
                                    )}
                                    <main className={styles.main}>
                                        {mainContent && (
                                            <div className={_cs(
                                                styles.mainContentContainer,
                                                mainContentContainerClassName,
                                            )}
                                            >
                                                {mainContent}
                                            </div>
                                        )}
                                        <MapContainer
                                            className={_cs(
                                                styles.map,
                                                hideMap && styles.hidden,
                                            )}
                                            activeLayers={activeLayers}
                                            onPendingStateChange={
                                                this.handleMapDownloadStateChange
                                            }
                                        />
                                        {/* hazardList.map((item) => {
                                        if (!item.icon) {
                                            return null;
                                        }
                                        return (
                                            <SVGMapIcon
                                                key={item.icon}
                                                src={item.icon}
                                                name={item.icon}
                                                fillColor="#222222"
                                            />
                                        );
                                    }) */}
                                        {!hideMap && (
                                            <div className={activeRouteName === 'contacts' || activeRouteName === 'documents' || activeRouteName === 'projects'
                                                ? !toggleLeftPaneButtonStretched
                                                    ? styles.mapActionsCompressed
                                                    : styles.mapActions
                                                : styles.mapActions}
                                            >
                                                {/* <MapDownloadButton
                                                    className={styles.mapDownloadButton}
                                                    transparent
                                                    title="Download current map"
                                                    iconName="download"
                                                    onPendingStateChange={
                                                        this.handleMapDownloadStateChange
                                                    }
                                                // activeLayers={activeLayers[activeLayers.length - 1]}
                                                /> */}
                                                <DownloadButtonOption
                                                    isTilesLoaded={isTilesLoaded}
                                                    className={styles.layerSwitch}
                                                    onPendingStateChange={
                                                        this.handleMapDownloadStateChange
                                                    }
                                                    activeLayers={activeLayers[activeLayers.length - 1]}
                                                    handleToggleAnimationMapDownloadButton={this.handleToggleAnimationMapDownloadButton}

                                                />
                                                <LayerSwitch
                                                    className={styles.layerSwitch}
                                                />
                                                <LayerToggle />
                                                <ZoomToolBar
                                                    fullScreenMap={this.fullScreenMap}
                                                    resetLocation={resetLocation}
                                                    lattitudeRef={this.lattitudeRef}
                                                    longitude={this.state.longitude}
                                                    lattitude={this.state.lattitude}
                                                    setLongitude={longitudeData}
                                                    setLattitude={lattiudeData}
                                                    goToLocation={this.goToLocation}
                                                    drawToZoom={this.drawToZoom}
                                                    checkLatLngState={checkLatLngState}
                                                    handleToggle={this.handleToggle}
                                                    currentLocation={this.currentLocation}
                                                />
                                            </div>
                                        )}
                                    </main>

                                    {(rightContent || !hideFilters) && (
                                        <aside className={styles.right}>
                                            {rightContent && (
                                                <div
                                                    className={_cs(
                                                        styles.rightContentContainer,
                                                        rightContentContainerClassName,
                                                    )}
                                                >
                                                    {rightContent}
                                                </div>

                                            )}
                                            {showLanguageToolbar && <LanguageToggle />}

                                            {!hideFilter && (
                                                <Filters
                                                    className={styles.filters}
                                                    hideLocationFilter={hideLocationFilter}
                                                    hideHazardFilter={hideHazardFilter}
                                                    hideDataRangeFilter={hideDataRangeFilter}
                                                    extraContent={filterContent}
                                                    FilterClickedStatus={this.FilterClickedStatus}
                                                    extraContentContainerClassName={
                                                        filterContentContainerClassName
                                                    }
                                                />
                                            )}
                                        </aside>
                                    )}
                                    {this.renderRoutes()}
                                    <MapOrder ordering={orderedLayers} />

                                </Map>
                            </RiskInfoLayerContext.Provider>
                        </div>

                        <Navbar className={styles.navbar} />
                    </div>
                </TitleContextProvider>
            </PageContext.Provider>
        );
    }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Responsive(Multiplexer));
export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Responsive(Multiplexer),
        ),
    ),
);
