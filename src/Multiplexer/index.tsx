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

import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';
import MapOrder from '#re-map/MapOrder';
import { getLayerName } from '#re-map/utils';

import { setStyleProperty } from '#rsu/styles';
import Responsive from '#rscg/Responsive';
import DangerButton from '#rsca/Button/DangerButton';

import { AppState } from '#store/types';

import {
    District,
    Province,
    Municipality,
    Region,
} from '#store/atom/page/types';

import Loading from '#components/Loading';
import Navbar from '#components/Navbar';
import PageContext from '#components/PageContext';
import LayerSwitch from '#components/LayerSwitch';
import MapDownloadButton from '#components/MapDownloadButton';
import { routeSettings } from '#constants';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import AppBrand from '#components/AppBrand';
import Filters from '#components/Filters';

import {
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
    filtersSelectorDP,
} from '#selectors';
import {
    setInitialPopupHiddenAction,
    setRegionAction,
    setFiltersActionDP,
} from '#actionCreators';

import authRoute from '#components/authRoute';
import errorBound from '../errorBound';
import helmetify from '../helmetify';

import styles from './styles.scss';

function reloadPage() {
    window.location.reload(false);
}

const ErrorInPage = () => (
    <div className={styles.errorInPage}>
        Some problem occured.
        <DangerButton
            transparent
            onClick={reloadPage}
        >
            Reload
        </DangerButton>
    </div>
);

const RetryableErrorInPage = ({ error, retry }: LoadOptions) => (
    <div className={styles.retryableErrorInPage}>
        Some problem occured.
        <DangerButton
            onClick={retry}
            transparent
        >
            Reload
        </DangerButton>
    </div>
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
        <Loading
            text="Loading Page"
            pending
        />
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

interface LayerDetail {
    id: string;
    title: string;
}

interface State {
    leftPaneContent?: React.ElementType;
    leftPaneClassName?: string;
    hideMap?: boolean;
    activeRouteDetails: {};
    activeLayers: LayerDetail[];
}

interface BoundingClientRect {
    width: number;
}

interface OwnProps {
    pending: boolean;
    hasError: boolean;
    mapStyle: string;
    boundingClientRect?: BoundingClientRect;
}

interface PropsFromState {
    districts: District[];
    provinces: Province[];
    municipalities: Municipality[];
    filters: {
        faramValues: {
            region: Region;
        };
        faramErrors: {};
    };
}

interface PropsFromDispatch {
    setInitialPopupHidden: typeof setInitialPopupHiddenAction;
    setRegion: typeof setRegionAction;
    setFilters: typeof setFiltersActionDP;
}

interface Coords {
    coords: {
        latitude: number;
        longitude: number;
    };
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

const mapStateToProps = (state: AppState): PropsFromState => ({
    filters: filtersSelectorDP(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    provinces: provincesSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setInitialPopupHidden: params => dispatch(setInitialPopupHiddenAction(params)),
    setRegion: params => dispatch(setRegionAction(params)),
    setFilters: params => dispatch(setFiltersActionDP(params)),
});

const getMatchingRegion = (
    subdomain: string | undefined,
    provinces: Province[],
    districts: District[],
    municipalities: Municipality[],
): Region => {
    if (!subdomain) {
        return {};
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

    return {};
};

const layerNameMap = {
    raster: 'raster-layer',
    choropleth: 'choropleth-layer',
};


class Multiplexer extends React.PureComponent<Props, State> {
    private mapboxCtrlSizeSet = false;

    public constructor(props: Props) {
        super(props);

        this.state = {
            leftPaneContent: undefined,
            leftPaneClassName: undefined,
            activeRouteDetails: {},
            activeLayers: [],
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
        } = this.props;

        if (!pending) {
            this.setFilterFromUrl(provinces, districts, municipalities, filters, setFilters);
        }
    }

    public componentWillReceiveProps(nextProps: Props) {
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
        } = nextProps;

        // NOTE: this means data has been loaded
        if (oldPending !== newPending && !newPending) {
            this.setFilterFromUrl(provinces, districts, municipalities, filters, setFilters);
        }
    }

    public componentDidUpdate() {
        const { boundingClientRect } = this.props;

        this.setLeftPanelWidth(boundingClientRect);

        if (!this.mapboxCtrlSizeSet) {
            const mapboxCtrlTopLeft = document.getElementsByClassName('mapboxgl-ctrl-top-left')[0];

            if (mapboxCtrlTopLeft) {
                const bcr = mapboxCtrlTopLeft.getBoundingClientRect();
                if (bcr.width || bcr.height) {
                    setStyleProperty('widthMapboxControlLeftTop', `${bcr.width}px`);
                    setStyleProperty('heightMapboxControlLeftTop', `${bcr.height}px`);

                    this.mapboxCtrlSizeSet = true;
                }
            }
        }
    }

    private setFilterFromUrl = (
        provinces: Province[],
        districts: District[],
        municipalities: Municipality[],
        filters: PropsFromState['filters'],
        setFilters: PropsFromDispatch['setFilters'],
    ) => {
        const { faramValues } = filters;
        const { hostname } = window.location;

        const index = hostname.search(`.${domain}`);
        const subDomain = index !== -1
            ? hostname.substring(0, index)
            : undefined;

        const region = getMatchingRegion(subDomain, provinces, districts, municipalities);

        const {
            geoarea: currentGeoarea,
            adminLevel: currentAdminLevel,
        } = region || {};

        const {
            geoarea: oldGeoarea,
            adminLevel: oldAdminLevel,
        } = faramValues.region || {};

        if (currentGeoarea && currentAdminLevel && (
            currentGeoarea !== oldGeoarea || oldAdminLevel !== currentAdminLevel
        )) {
            setFilters({
                faramValues: {
                    ...faramValues,
                    region,
                },
                faramErrors: {},
                pristine: true,
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
                <Loading
                    text="Loading Resources"
                    pending
                />
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
        setStyleProperty('widthLeftPanel', `${bound(32 + width * 0.28, 240, 520)}px`);
    })

    private setLeftPaneComponent = (content: React.ElementType, leftPaneClassName?: string) => {
        this.setState({
            leftPaneContent: content,
            leftPaneClassName,
        });
    }

    private setActiveRouteDetails = (activeRouteDetails) => {
        this.setState({ activeRouteDetails });
    }

    private hideMap = () => {
        this.setState({ hideMap: true });
    }

    private showMap = () => {
        this.setState({ hideMap: false });
    }

    private addLayer = (layer) => {
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

    private removeLayer = (layerId) => {
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

    private setLayers = (activeLayers) => {
        this.setState({ activeLayers });
    }

    private addLayers = (layerList) => {
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

    private removeLayers = (layerIdList) => {
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

    private getLayerOrder = memoize((activeLayers) => {
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
        const layers = activeLayers.map(d => getLayerName(d.layername, layerNameMap[d.type]));
        return [
            ...layers,
            ...otherLayers,
        ];
    })

    private getRegionName = (selectedRegion, provinces, districts, municipalities) => {
        if (!selectedRegion || !selectedRegion.adminLevel) {
            return 'National';
        }

        const adminLevels = {
            1: provinces,
            2: districts,
            3: municipalities,
        };

        const regionList = adminLevels[selectedRegion.adminLevel];
        const currentRegion = regionList.find(d => d.id === selectedRegion.geoarea);

        if (currentRegion) {
            return currentRegion.title;
        }

        return 'Unknown';
    }

    public render() {
        const {
            mapStyle,
            filters,
            provinces,
            districts,
            municipalities,
        } = this.props;

        const {
            leftPaneContent,
            leftPaneClassName,
            hideMap,
            activeRouteDetails,
            activeLayers,
        } = this.state;

        const pageProps = {
            setLeftPaneComponent: this.setLeftPaneComponent,
            setActiveRouteDetails: this.setActiveRouteDetails,
            activeRouteDetails,
            hideMap: this.hideMap,
            showMap: this.showMap,
        };

        const riskInfoLayerProps = {
            addLayer: this.addLayer,
            removeLayer: this.removeLayer,
            addLayers: this.addLayers,
            removeLayers: this.removeLayers,
            setLayers: this.setLayers,
            activeLayers,
        };

        const regionName = this.getRegionName(
            filters.faramValues.region,
            provinces,
            districts,
            municipalities,
        );

        const orderedLayers = this.getLayerOrder(activeLayers);

        return (
            <PageContext.Provider value={pageProps}>
                <div className={styles.multiplexer}>
                    <div className={_cs(styles.content, 'bipad-main-content')}>
                        <Filters
                            className={styles.filters}
                        />
                        <RiskInfoLayerContext.Provider value={riskInfoLayerProps}>
                            <Map
                                mapStyle={mapStyle}
                                mapOptions={{
                                    logoPosition: 'top-left',
                                    minZoom: 5,
                                }}
                                // debug

                                scaleControlShown
                                scaleControlPosition="bottom-right"

                                navControlShown
                                navControlPosition="bottom-right"
                            >
                                { !hideMap && false && (
                                    <div
                                        className={_cs(
                                            styles.mapActions,
                                            leftPaneContent && styles.withLeftPane,
                                        )}
                                    >
                                        <MapDownloadButton
                                            transparent
                                            title="Download current map"
                                            iconName="download"
                                        />
                                        <LayerSwitch />
                                    </div>
                                )}
                                { leftPaneContent && (
                                    <aside className={styles.left}>
                                        <AppBrand
                                            className={styles.brand}
                                            regionName={regionName}
                                        />
                                        <div
                                            className={_cs(
                                                styles.leftPaneContainer,
                                                leftPaneClassName,
                                            )}
                                        >
                                            { leftPaneContent }
                                        </div>
                                    </aside>
                                )}
                                <MapContainer
                                    className={_cs(
                                        styles.map,
                                        hideMap && styles.hidden,
                                    )}
                                />
                                {this.renderRoutes()}
                                <MapOrder ordering={orderedLayers} />
                            </Map>
                        </RiskInfoLayerContext.Provider>
                    </div>
                    <Navbar className={styles.navbar} />
                </div>
            </PageContext.Provider>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Responsive(Multiplexer));
