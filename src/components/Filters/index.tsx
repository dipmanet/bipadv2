/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable @typescript-eslint/indent */
import React from 'react';
import Redux, { compose } from 'redux';
import { connect } from 'react-redux';
import { _cs, isDefined } from '@togglecorp/fujs';
import Faram from '@togglecorp/faram';
import memoize from 'memoize-one';
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

});


const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setFilters: params => dispatch(setFiltersAction(params)),
    setProjectFilters: params => dispatch(setProjectsProfileFiltersAction(params)),
    setDataArchiveRiverFilter: params => dispatch(
        setDataArchiveRiverFilterAction(params),
    ),
});

type TabKey = 'location' | 'hazard' | 'dataRange' | 'rainBasin' | 'riverBasin' | 'others';

const iconNames: {
    [key in TabKey]: string;
} = {
    location: 'distance',
    rainBasin: 'rainicon',
    riverBasin: 'rivericon',
    hazard: 'warning',
    dataRange: 'dataRange',
    others: 'filter',
};

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
    };

    const filter = filters[tabKeyToFilterMap[key]];
    console.log('filter is', filter);


    if (Array.isArray(filter)) {
        return filter.length !== 0;
    }

    const filterKeys = filter && Object.keys(filter);
    return filterKeys && filterKeys.length !== 0 && filterKeys.every(k => !!filter[k]);
};

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
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

    public state = {
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
        },
        filteredRainStation: [],
        filteredRiverStation: [],
        subdomainLoc: {},
        locRecv: false,
        disableSubmitButton: false,
    };

    public componentDidMount() {
        const {
            filters: faramValues,
            municipalities,
            districts,
            provinces,
        } = this.props;

        this.setState({ faramValues });
    }

    public UNSAFE_componentWillReceiveProps(nextProps) {
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
        }
        if (rainStations.length > 120) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ allStationsRain: rainStations });
        }
        if (riverStations.length > 120) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ allStationsRiver: riverStations });
        }
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
            const { province } = district;
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

    private getFilterTabRendererParams = (key: TabKey, title: string) => ({
        name: iconNames[key],
        title,
        className: styles.icon,
        // isFiltered: getIsFiltered(key, this.props.filters),
        isFiltered: getIsFiltered(key, this.state.faramValues),
    })

    // private hasSubdomain  = (subDomain: string) => {

    // }

    private handleResetFiltersButtonClick = () => {
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
            setDataArchiveRiverFilter({
                dataArchiveRiverFilters: this.state.faramValues,
            });
        }
    }

    private handleCloseCurrentFilterButtonClick = () => {
        this.setState({ activeView: undefined });
    }

    private handleStationData = (mainVal: any, type: string) => {
        /**
       * Handling realtime river filter data
       */
        if (type === 'river') {
            if (mainVal && Object.keys(mainVal.riverBasin).length > 0) {
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
            if (mainVal && Object.keys(mainVal.rainBasin).length > 0) {
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
        console.log('subitVal', faramValues);
        FilterClickedStatus(true);
        if (!disableSubmitButton) {
            if (activeView === 'riverBasin') {
                setDataArchiveRiverFilter({
                    dataArchiveRiverFilters: {
                        point: faramValues.riverStation.point,
                        municipality: faramValues.riverStation.municipality,
                        basin: faramValues.riverBasin,
                        active: 'river',
                    },
                });
            }

            if (activeView === 'rainBasin') {
                setDataArchiveRiverFilter({
                    dataArchiveRiverFilters: {
                        point: faramValues.rainStation.point,
                        municipality: faramValues.rainStation.municipality,
                        basin: faramValues.rainBasin,
                        active: 'rain',
                    },
                });
            }
            this.setState({ disableSubmitButton: true });
            setFilters({ filters: faramValues });
        }
    }

    private getTabs = memoize(
        (
            extraContent: React.ReactNode,
            hideLocationFilter,
            hideHazardFilter,
            hideDataRangeFilter,
        ): { [key in TabKey]?: string; } => {
            const { activeRouteDetails } = this.props;
            console.log('activeRouteDetails', activeRouteDetails);

            const tabs = {
                location: 'Location',
                hazard: 'Hazard',
                dataRange: 'Data range',
                rainBasin: 'Rain Basin',
                riverBasin: 'River Basin',
                others: 'Project',
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
            if (activeRouteDetails && activeRouteDetails.path !== '/realtime/') {
                delete tabs.rainBasin;
            }
            if (activeRouteDetails && activeRouteDetails.path !== '/realtime/') {
                delete tabs.riverBasin;
            }

            return tabs;
        },
    )

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
        } = this.props;


        const { faramValues: fv, disableSubmitButton } = this.state;
        const tabs = this.getTabs(
            extraContent,
            hideLocationFilter,
            hideHazardFilter,
            hideDataRangeFilter,
        );

        console.log('disableSubmitButton', disableSubmitButton);


        // if (user && Object.keys(user.profile).length > 0) {
        //     if (user.profile.municipality > 0) {
        //         const newFaramValues = {
        //             dataDateRange: {
        //                 rangeInDays: 7,
        //                 startDate: undefined,
        //                 endDate: undefined,
        //             },
        //             hazard: [],
        //             region: { adminLevel: 3,
        //                 municipality: user.profile.municipality },

        //         };

        //         this.setState({ faramValues: newFaramValues });

        //     }
        // }
        const { activeView } = this.state;


        const validActiveView = isDefined(activeView) && tabs[activeView]
            ? activeView
            : undefined;


        return (
            <div className={_cs(styles.filters, className)}>
                <header className={styles.header}>
                    <h3 className={styles.heading}>
                        Filters
                    </h3>

                    <Button
                        className={styles.resetFiltersButton}
                        title="Reset filters"
                        onClick={this.handleResetFiltersButtonClick}
                        iconName="refresh"
                        transparent
                        disabled={!validActiveView}
                    />

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
                        // value={faramValues}
                        value={fv}
                        className={styles.filterViewContainer}
                    >
                        {validActiveView && (
                            <header className={styles.header}>
                                <h3 className={styles.heading}>
                                    {tabs[validActiveView]}
                                </h3>
                                <Button
                                    className={styles.closeButton}
                                    transparent
                                    iconName="chevronUp"
                                    onClick={this.handleCloseCurrentFilterButtonClick}
                                />
                            </header>
                        )}
                        <MultiViewContainer
                            views={this.views}
                            active={validActiveView}
                        />
                        {/* <RiverFilters /> */}
                    </Faram>
                    {validActiveView && activeView !== 'others' && (
                        <div
                            onClick={this.handleSubmitClick}
                            className={styles.submitButton}
                            role="presentation"
                        >
                            Submit
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createRequestClient(requestOptions),
)(Filters);
