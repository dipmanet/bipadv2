/* eslint-disable react/no-unused-state */
/* eslint-disable indent */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-tabs */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
import React from 'react';
import Redux, { compose } from 'redux';
import { connect } from 'react-redux';
import { _cs, isDefined } from '@togglecorp/fujs';
import Faram from '@togglecorp/faram';
import memoize from 'memoize-one';
import { Translation } from 'react-i18next';
import { BSToAD } from 'bikram-sambat-js';
import PageContext from '#components/PageContext';

import Button from '#rsca/Button';
import ScrollTabs from '#rscv/ScrollTabs';
import MultiViewContainer from '#rscv/MultiViewContainer';
import Icon from '#rscg/Icon';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    setDataArchiveRiverFilterAction,
    setFiltersAction,
    setProjectsProfileFiltersAction,
} from '#actionCreators';
import {
    filtersSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    carKeysSelector,
    userSelector,
    projectsProfileFiltersSelector,
    riverFiltersSelector,
    riverStationsSelector,
    rainFiltersSelector,
    rainStationsSelector,
    realTimeFiltersSelector,
    languageSelector,
} from '#selectors';
import { AppState } from '#store/types';
import { FiltersElement, RiverFiltersElement } from '#types';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';
import HazardSelectionInput from '#components/HazardSelectionInput';
import PastDateRangeInput from '#components/PastDateRangeInput';
import { getAuthState } from '#utils/session';
import { colorScheme } from '#constants';
import RainBasinSelector from '#views/DataArchive/Filters/Rain/Basin/index';
import RainStationSelector from '#views/DataArchive/Filters/Rain/Station/index';
import RiverBasinSelector from '#views/DataArchive/Filters/River/Basin/index';
import RiverStationSelector from '#views/DataArchive/Filters/River/Station/index';
import { convertDateAccToLanguage } from '#utils/common';
import InventoryItemFilter from '#components/InventoryItemFilter';
import styles from './styles.scss';

interface ComponentProps {
    className?: string;
    extraContent?: React.ReactNode;
    extraContentContainerClassName?: string;
    hideLocationFilter?: boolean;
    hideDataRangeFilter?: boolean;
    hideHazardFilter?: boolean;
}

interface PropsFromAppState {
    filters: RiverFiltersElement;
}

interface PropsFromDispatch {
    setFilters: typeof setFiltersAction;
}

interface State {
    allStationsRain: [];
    allStationsRiver: [];
    activeView: TabKey | undefined;
    faramValues: RiverFiltersElement;
    filteredRainStation: [] | undefined | {};
    filteredRiverStation: [] | undefined | {};
}

type Props = ComponentProps & PropsFromAppState & PropsFromDispatch;

const mapStateToProps = (state: AppState) => ({
    filters: filtersSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    carKeys: carKeysSelector(state),
    user: userSelector(state),
    projectFilters: projectsProfileFiltersSelector(state),
    riverFilters: riverFiltersSelector(state),
    riverStations: riverStationsSelector(state),
    rainFilters: rainFiltersSelector(state),
    rainStations: rainStationsSelector(state),
    realTimeFilters: realTimeFiltersSelector(state),

    language: languageSelector(state),
});


const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setFilters: params => dispatch(setFiltersAction(params)),
    setProjectFilters: params => dispatch(setProjectsProfileFiltersAction(params)),
    setDataArchiveRiverFilter: params => dispatch(
        setDataArchiveRiverFilterAction(params),
    ),
});

type TabKey = 'location' | 'hazard' | 'dataRange' | 'rainBasin' | 'riverBasin' | 'others'|'inventoryItems';


const FilterIcon = ({
    isActive,
    className,
    isFiltered,
    ...otherProps
}: {
    isFiltered: boolean;
    isActive?: boolean;
    className?: string;
}) => (
    <Icon
        className={_cs(
            className,
            isActive && styles.active,
            isFiltered && styles.filtered,
            styles.filterIcon,
        )}
        {...otherProps}
    />
);

const filterSchema = {
    fields: {
        dataDateRange: [],
        hazard: [],
        region: [],
        rainBasin: {},
        rainStation: {},
        riverBasin: {},
        riverStation: {},
        inventoryItems: [],
    },
};

const getIsFiltered = (key: TabKey | undefined, filters: RiverFiltersElement) => {
    if (!key || key === 'others') {
        return false;
    }

    const tabKeyToFilterMap: {
        [key in Exclude<TabKey, 'others'>]: keyof RiverFiltersElement;
    } = {
        hazard: 'hazard',
        location: 'region',
        dataRange: 'dataDateRange',
        rainBasin: 'rainBasin',
        rainStation: 'rainStation',
        riverBasin: 'riverBasin',
        riverStation: 'riverStation',
        inventoryItems: 'inventoryItems',
    };

    const filter = filters[tabKeyToFilterMap[key]];

    if (Array.isArray(filter)) {
        return filter.length !== 0;
    }

    const filterKeys = filter && Object.keys(filter);
    return filterKeys && filterKeys.length !== 0 && filterKeys.every(k => !!filter[k]);
};

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    inventoryItemGetRequest: {
        url: '/inventory-item/',
        method: methods.GET,
        onMount: true,
        query: () => ({

            limit: -1,
            count: true,

        }),
        onSuccess: ({ params, response }) => {
            const resources = response as MultiResponse<PageType.Resource>;
            params.inventoryItemsListSelect(resources.results);
        },
    },
    resourceGetRequest: {
        url: '/resource/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => {
            // transformFilters(filters);

            if (!params || !params.resourceType) {
                return undefined;
            }
            const carRegion = params.getRegionDetails(params.region.region);
            const destParamName = 'resource_type';

            const outputFilters = {
                [`${destParamName}`]: params.resource_type,
                [`${destParamName}`]: 'health',
            };

            return {
                // eslint-disable-next-line @typescript-eslint/camelcase
                // resource_type: {params.resource_type ? params.resource_type : ''},
                ...outputFilters,
                limit: -1,
                ...carRegion,
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

class Filters extends React.PureComponent<Props, State> {
    public static contextType = PageContext;

    public constructor(props: Props) {
        super(props);
        this.state = {
        activeView: undefined,
        allStationsRain: [],
        allStationsRiver: [],
        faramValues: {
            dataDateRange: {
                rangeInDays: 7,
                startDate: undefined,
                endDate: undefined,
            },
            hazard: [],
            region: {},
            rainBasin: {},
            rainStation: {},
            riverBasin: {},
            riverStation: {},
            inventoryItems: [],
        },
        filteredRainStation: [],
        filteredRiverStation: [],
        subdomainLoc: {},
        locRecv: false,
        disableSubmitButton: false,
        invertoryItemList: [],
    };
    const {
        requests: {
            inventoryItemGetRequest,
        },

    } = this.props;

    inventoryItemGetRequest.setDefaultParams({
        inventoryItemsListSelect: this.inventoryItemsListSelect,
    });
}

    public componentDidMount() {
        const {
            filters: faramValues,

        } = this.props;

        this.setState({ faramValues });
    }

    public UNSAFE_componentWillReceiveProps() {
        const {
            filters: faramValues,
            municipalities,
            districts,
            provinces,
        } = this.props;

        const {
            locRecv,
        } = this.state;

        this.setState({ faramValues });

        if (
            (Object.keys(municipalities).length > 0
                || Object.keys(districts).length > 0
                || Object.keys(provinces).length > 0) && !locRecv
        ) {
            const subDomain = window.location.href.split('//')[1].split('.')[0];
            const municipalityMatch = municipalities.filter(
                item => item.code === subDomain,
            );
            const districtMatch = districts.filter(
                item => item.code === subDomain,
            );
            const provinceMatch = provinces.filter(
                item => item.code === subDomain,
            );

            if (municipalityMatch[0]) {
                const subd = { adminLevel: 3, geoarea: municipalityMatch[0].id };
                this.setState({ subdomainLoc: subd, locRecv: true });
            } else if (districtMatch[0]) {
                const subd = { adminLevel: 2, geoarea: districtMatch[0].id };
                this.setState({ subdomainLoc: subd, locRecv: true });
            } else if (provinceMatch[0]) {
                const subd = { adminLevel: 1, geoarea: provinceMatch[0].id };
                this.setState({ subdomainLoc: subd, locRecv: true });
            }
        }
    }

    public componentDidUpdate(prevProps, prevState) {
        const { filters, rainStations, riverStations } = this.props;
        const { faramValues } = this.state;

        if (prevProps.filters !== filters) {
            this.setState({ faramValues: filters });
            delete this.getTabs();
        }
        if (rainStations.length > 120) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ allStationsRain: rainStations });
        }
        if (riverStations.length > 120) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ allStationsRiver: riverStations });
        }
        // if (filters.realtimeSources && filters.realtimeSources.length > 0) {
        //     delete this.getTabs();
        // }
    }

    public getRegionDetails = ({ adminLevel, geoarea } = {}) => {
        const {
            provinces,
            districts,
            municipalities,
            // filters: { region },
        } = this.props;

        // if (Object.keys(region).length === 0) {
        //     return '';
        // }
        if (adminLevel === 1) {
            return {
                province: provinces.find(p => p.id === geoarea).id,
                district: undefined,
                municipality: undefined,
            };
        }

        if (adminLevel === 2) {
            const districtObj = districts.find(d => d.id === geoarea);
            const district = districtObj.id;
            const { province } = districtObj;
            return {
                province,
                district,
                municipality: undefined,
            };
        }

        if (adminLevel === 3) {
            const municipalityObj = municipalities.find(m => m.id === geoarea);
            const municipality = municipalityObj.id;
            const { district } = municipalityObj;
            const { province } = districts.find(d => d.id === district);
            return {
                province,
                district,
                municipality,
            };
        }
        return '';
    }


    private views = {
        location: {
            component: () => {
                const regionLength = Object.keys(this.props.filters.region).length;
                const { filters: { region } } = this.props;
                const parsedRegion = this.getRegionDetails(region);
                return (
                    <StepwiseRegionSelectInput
                        className={_cs(styles.activeView, styles.stepwiseRegionSelectInput)}
                        faramElementName="region"
                        wardsHidden
                        initialLoc={regionLength === 0 ? undefined : parsedRegion}
                    />
                );
            },
        },
        hazard: {
            component: () => (
                <HazardSelectionInput
                    className={styles.activeView}
                    faramElementName="hazard"
                // autoFocus
                />
            ),
        },
        inventoryItems: {
            component: () => (
                <InventoryItemFilter
                        faramElementName="riverBasin"
                        basins={this.props.riverFilters.basin}
                        invertoryItemList={this.state.invertoryItemList}
                        language={this.props.language.language}
                        filters={this.props.filters}
                        onChange={this.handleInventoryItemChange}
                        filterList={this.props.filters.inventoryItems}

                />
            ),
        },
        dataRange: {
            component: () => (
                <div className={styles.activeView}>
                    <PastDateRangeInput
                        faramElementName="dataDateRange"
                    // autoFocus
                    />
                </div>
            ),
        },
        rainBasin: {
            component: () => (
                <div className={styles.activeView}>
                    <RainBasinSelector
                        faramElementName="rainBasin"
                        basins={this.props.rainFilters.basin}
                    />
                    <RainStationSelector
                        faramElementName="rainStation"
                        stations={this.state.filteredRainStation.length > 0
                            ? this.state.filteredRainStation : this.state.allStationsRain}

                    />
                </div>
            ),
        },
        riverBasin: {
            component: () => (
                <div className={styles.activeView}>
                    <RiverBasinSelector
                        faramElementName="riverBasin"
                        basins={this.props.riverFilters.basin}

                    />
                    <RiverStationSelector
                        faramElementName="riverStation"
                        stations={this.state.filteredRiverStation.length > 0
                            ? this.state.filteredRiverStation : this.state.allStationsRiver}
                    />

                </div>
            ),
        },
        others: {
            component: () => (
                this.props.extraContent ? (
                    <div className={_cs(
                        styles.activeView,
                        this.props.extraContentContainerClassName,
                    )}
                    >
                        {this.props.extraContent}
                    </div>
                ) : null
            ),
        },
    }

    private handleTabClick = (activeView: TabKey) => {
        this.setState({ activeView });
    }

private inventoryItemsListSelect=(data) => {
    this.setState({
        invertoryItemList: data,
    });
}
    // private iconNames = {
    //     location: 'distance',
    //     rainBasin: this.state.activeView === 'rainBasin' ? 'rainiconactive' : 'rainicon',
    //     riverBasin: 'rivericon',
    //     hazard: 'warning',
    //     dataRange: 'dataRange',
    //     others: 'filter',
    // };


    private getFilterTabRendererParams = (key: TabKey, title: string) => {
        const iconNames = {
            location: 'distance',
            rainBasin: this.state.activeView === 'rainBasin' ? 'rainiconactive' : 'rainicon',
            riverBasin: this.state.activeView === 'riverBasin' ? 'rivericonactive' : 'rivericon',
            hazard: 'warning',
            dataRange: 'dataRange',
            others: 'filter',
            inventoryItems: 'filter',
        };
        return ({
            name: iconNames[key],
            title,
            className: styles.icon,
            // isFiltered: getIsFiltered(key, this.props.filters),
            isFiltered: getIsFiltered(key, this.state.faramValues),
        });
    }

    // private hasSubdomain  = (subDomain: string) => {

    // }

    private handleResetFiltersButtonClick = () => {
        const path = window.location.pathname.split('/')[1];
        const authState = getAuthState();
        const { setFilters, user, filters, setProjectFilters,
            FilterClickedStatus, setDataArchiveRiverFilter } = this.props;
        const { subdomainLoc, faramValues } = this.state;
        FilterClickedStatus(true);
        setProjectFilters({
            faramValues: {},
        });
        this.setState({ disableSubmitButton: false });
        if (authState.authenticated) {
            if (user.profile.municipality) {
                const region = { adminLevel: 3, geoarea: user.profile.municipality };
                const tempF = {
                    dataDateRange: {
                        rangeInDays: 7,
                        startDate: undefined,
                        endDate: undefined,
                    },
                    hazard: [],
                    region,
                };

                setFilters({ filters: tempF });
                this.setState({ faramValues: tempF, activeView: undefined });
            } else if (user.profile.district) {
                const region = { adminLevel: 2, geoarea: user.profile.disctict };
                const tempF = {
                    dataDateRange: {
                        rangeInDays: 7,
                        startDate: undefined,
                        endDate: undefined,
                    },
                    hazard: [],
                    region,
                };

                setFilters({ filters: tempF });
                this.setState({ faramValues: tempF, activeView: undefined });
            } else if (user.profile.province) {
                const region = { adminLevel: 1, geoarea: user.profile.province };
                const tempF = {
                    dataDateRange: {
                        rangeInDays: 7,
                        startDate: undefined,
                        endDate: undefined,
                    },
                    hazard: [],
                    region,
                };

                setFilters({ filters: tempF });
                this.setState({ faramValues: tempF, activeView: undefined });
            } else if (path === 'damage-and-loss') {
                this.setState({
                    activeView: undefined,
                    faramValues: {
                        dataDateRange: {
                            rangeInDays: 183,
                            startDate: undefined,
                            endDate: undefined,
                        },
                        hazard: [],
                        region: {},
                    },
                });
                setFilters({ filters: this.state.faramValues });
            } else {
                const region = {};
                const tempF = {
                    dataDateRange: {
                        rangeInDays: 7,
                        startDate: undefined,
                        endDate: undefined,
                    },
                    hazard: [],
                    region,
                };
                this.setState({
                    activeView: undefined,
                    faramValues: tempF,
                });

                setFilters({ filters: tempF });
            }
        } else if (Object.keys(subdomainLoc).length > 0) {
            const tempF = {
                dataDateRange: {
                    rangeInDays: 7,
                    startDate: undefined,
                    endDate: undefined,
                },
                hazard: [],
                region: subdomainLoc,
            };
            setFilters({ filters: tempF });
            this.setState({ faramValues: tempF, activeView: undefined });
        } else if (path === 'damage-and-loss') {
            this.setState({
                activeView: undefined,
                faramValues: {
                    dataDateRange: {
                        rangeInDays: 183,
                        startDate: undefined,
                        endDate: undefined,
                    },
                    hazard: [],
                    region: {},
                },
            });
            setFilters({ filters: this.state.faramValues });
        } else {
            this.setState({
                activeView: undefined,
                faramValues: {
                    dataDateRange: {
                        rangeInDays: 7,
                        startDate: undefined,
                        endDate: undefined,
                    },
                    hazard: [],
                    region: {},
                },
            });

            setFilters({ filters: this.state.faramValues });
        }
        setDataArchiveRiverFilter({
            dataArchiveRiverFilters: {
                station: {},
                basin: undefined,
                municipality: undefined,
                active: undefined,
                dataDateRange: {
                    rangeInDays: 7,
                    startDate: undefined,
                    endDate: undefined,
                },
            },
        });
    }

    private handleCloseCurrentFilterButtonClick = () => {
        this.setState({ activeView: undefined });
    }

    private handleStationData = (mainVal: any, type: string) => {
        /**
       * Handling realtime river filter data
       */
        if (type === 'river') {
            if (mainVal && mainVal.riverBasin && Object.keys(mainVal.riverBasin).length > 0) {
                this.setState((prevState: State) => {
                    if (prevState.faramValues.riverBasin !== mainVal.riverBasin) {
                        return {
                            faramValues: {
                                dataDateRange: {},
                                hazard: [],
                                region: {},
                                rainBasin: '',
                                rainStation: '',
                                riverBasin: mainVal.riverBasin,
                                riverStation: '',
                            },
                        };
                    }
                    return ({ mainVal });
                });
                if (mainVal.riverBasin.title !== undefined) {
                    const filteredStation = this.state.allStationsRiver
                        .filter((r: { basin: string }) => r.basin === mainVal.riverBasin.title);
                    this.setState({ filteredRiverStation: filteredStation });
                    return;
                }
                const filteredStation = this.state.allStationsRiver;
                this.setState({ filteredRiverStation: filteredStation });
            }
        }
        /**
    * Handling realtime rain filter data
    */
        if (type === 'rain') {
            if (mainVal && mainVal.rainBasin && Object.keys(mainVal.rainBasin).length > 0) {
                this.setState((prevState: State) => {
                    if (prevState.faramValues.rainBasin !== mainVal.rainBasin) {
                        return {
                            faramValues: {
                                dataDateRange: {},
                                hazard: [],
                                region: {},
                                rainBasin: mainVal.rainBasin,
                                rainStation: '',
                                riverBasin: '',
                                riverStation: '',
                            },
                        };
                    }
                    return ({ mainVal });
                });
                if (mainVal.rainBasin.title !== undefined) {
                    const filteredStation = this.state.allStationsRain
                        .filter((r: { basin: string }) => r.basin === mainVal.rainBasin.title);
                    this.setState({ filteredRainStation: filteredStation });
                    return;
                }
                const filteredStation = this.state.allStationsRiver;
                this.setState({ filteredRainStation: filteredStation });
            }
        }
    }

private handleInventoryItemChange=(dataList) => {
    this.setState(prevState => ({
        ...prevState,
        faramValues: {
            ...prevState.faramValues,
            inventoryItems: dataList,
        },
        disableSubmitButton: false,
    }));
    this.setState({ disableSubmitButton: false });
}

    private handleFaramChange = (faramValues: RiverFiltersElement) => {
        this.setState({ faramValues });
        this.setState({ disableSubmitButton: false });
        this.handleStationData(faramValues, 'river');
        this.handleStationData(faramValues, 'rain');
    }

    private handleSubmitClick = () => {
        const { setFilters,
            carKeys,
            FilterClickedStatus,
            setDataArchiveRiverFilter } = this.props;

        const { faramValues, disableSubmitButton, activeView } = this.state;
        /**
     * Setting the current filter value to use it in map section
     */
        FilterClickedStatus(true);
        if (!disableSubmitButton) {
            if (activeView === 'riverBasin') {
                setDataArchiveRiverFilter({
                    dataArchiveRiverFilters: {
                        point: faramValues.riverStation && faramValues.riverStation.point,
                        municipality: faramValues.riverStation
                            && faramValues.riverStation.municipality,
                        basin: faramValues.riverBasin,
                        active: 'river',
                    },
                });
            }

            if (activeView === 'rainBasin') {
                setDataArchiveRiverFilter({
                    dataArchiveRiverFilters: {
                        point: faramValues.rainStation && faramValues.rainStation.point,
                        municipality: faramValues.rainStation
                            && faramValues.rainStation.municipality,
                        basin: faramValues.rainBasin,
                        active: 'rain',
                    },
                });
            }
            this.setState({ disableSubmitButton: true });

            setFilters({ filters: faramValues });
        }

        // if (faramValues) {
        //     setFilters({ filters: faramValues });
        // }
        // else {
        //     setFilters({ filters: propFilters });
        // }

        const { activeRouteDetails } = this.context;

        /** This API is already called in capacity and resource module */

        // if (Object.keys(activeRouteDetails).length !== 0) {
        //     const { name: activePage } = activeRouteDetails;
        //     if (activePage === 'riskInfo') {
        //         this.props.requests.resourceGetRequest.do({
        //             resourceType: carKeys,
        //             getRegionDetails: this.getRegionDetails,
        //             region: this.state.faramValues,
        //         });
        //     }
        // }
    }


    private checkRealTimeFilter = (filterValue: number) => {
        const { realTimeFilters } = this.props;
        if (realTimeFilters.faramValues && realTimeFilters.faramValues.realtimeSources
            && realTimeFilters.faramValues.realtimeSources.length > 0) {
            const data = realTimeFilters.faramValues.realtimeSources;

            if (data.includes(filterValue)) {
                return true;
            }
        }
        return false;
    }

    private getTabs =
        (
            extraContent: React.ReactNode,
            hideLocationFilter,
            hideHazardFilter,
            hideDataRangeFilter,
            language,
        ): { [key in TabKey]?: string; } => {
            const { activeRouteDetails } = this.props;
            const tabs = {
                rainBasin: 'Rain Basin',
                riverBasin: 'River Basin',
                location: language === 'en' ? 'Location' : 'स्थान',
                hazard: language === 'en' ? 'Hazard' : 'प्रकोप',
                dataRange: language === 'en' ? 'Data range' : 'डाटाको समय',
                others: language === 'en' ? 'Project' : 'परियोजना',
                inventoryItems: language === 'en' ? 'Stockpile Items' : 'भण्डार वस्तुहरू',
            };

            if (!extraContent) {
                delete tabs.others;
            }

            if (hideLocationFilter) {
                delete tabs.location;
            }

            if (hideHazardFilter) {
                delete tabs.hazard;
            }

            if (hideDataRangeFilter) {
                delete tabs.dataRange;
            }
            if ((activeRouteDetails && activeRouteDetails.path !== '/risk-info/')) {
                delete tabs.inventoryItems;
            }
            if ((activeRouteDetails && activeRouteDetails.path !== '/realtime/')
                || !this.checkRealTimeFilter(3)) {
                delete tabs.rainBasin;
            }
            if ((activeRouteDetails && activeRouteDetails.path !== '/realtime/')
                || !this.checkRealTimeFilter(2)) {
                delete tabs.riverBasin;
            }

            return tabs;
        }


    public render() {
        const {
            className,
            filters: faramValues,
            extraContent,
            hideDataRangeFilter,
            hideHazardFilter,
            hideLocationFilter,
            user,
            projectFilters,

            language: { language },
        } = this.props;


        const { faramValues: fv, disableSubmitButton, invertoryItemList } = this.state;
        const tabs = this.getTabs(
            extraContent,
            hideLocationFilter,
            hideHazardFilter,
            hideDataRangeFilter,
            language,
        );

        const { activeView } = this.state;


        const validActiveView = isDefined(activeView) && tabs[activeView]
            ? activeView
            : undefined;


        return (
            <div className={_cs(styles.filters, className)} id="component-filter">
                <header className={styles.header}>
                    <h3 className={styles.heading}>
                        <Translation>
                            {
                                t => <span>{t('Filters')}</span>
                            }
                        </Translation>
                    </h3>
                    <Translation>
                        {
                            t => (
                                <Button
                                    className={styles.resetFiltersButton}
                                    title={t('Reset filters')}
                                    onClick={this.handleResetFiltersButtonClick}
                                    iconName="refresh"
                                    transparent
                                    disabled={!validActiveView}
                                />
                            )
                        }
                    </Translation>

                </header>
                <div className={styles.content}>

                    <ScrollTabs
                        tabs={tabs}
                        active={validActiveView}
                        onClick={this.handleTabClick}
                        renderer={FilterIcon}
                        rendererParams={this.getFilterTabRendererParams}
                        className={styles.tabs}
                    />

                    <Faram
                        schema={filterSchema}
                        onChange={this.handleFaramChange}

                        value={fv}
                        className={styles.filterViewContainer}
                    >
                        {validActiveView && (
                            <header className={styles.header}>
                                <Translation>
                                    {
                                        t => (
                                            <h3 className={styles.heading}>
                                                {t(`${tabs[validActiveView]}`)}
                                            </h3>
                                        )}
                                </Translation>
                                <Button
                                    className={styles.closeButton}
                                    transparent
                                    iconName="chevronUp"
                                    onClick={this.handleCloseCurrentFilterButtonClick}
                                />
                            </header>
                        )
                        }
                        <MultiViewContainer
                            views={this.views}
                            active={validActiveView}
                        />

                    </Faram>
                    {validActiveView && activeView !== 'others' && (
                        <div
                            onClick={this.handleSubmitClick}
                            className={styles.submitButton}
                            role="presentation"
                        >
                            <Translation>
                                {
                                    t => <span>{t('Submit')}</span>
                                }
                            </Translation>
                        </div>
                    )
                    }
                </div>
            </div>
        );
    }
}
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createRequestClient(requestOptions),
)(Filters);
