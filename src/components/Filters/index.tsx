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

import { setFiltersAction } from '#actionCreators';
import {
    filtersSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    carKeysSelector,
} from '#selectors';
import { AppState } from '#store/types';
import { FiltersElement } from '#types';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';
import HazardSelectionInput from '#components/HazardSelectionInput';
import PastDateRangeInput from '#components/PastDateRangeInput';

import styles from './styles.scss';
import { colorScheme } from '#constants';

interface ComponentProps {
    className?: string;
    extraContent?: React.ReactNode;
    extraContentContainerClassName?: string;
    hideLocationFilter?: boolean;
    hideDataRangeFilter?: boolean;
    hideHazardFilter?: boolean;
}

interface PropsFromAppState {
    filters: FiltersElement;
}

interface PropsFromDispatch {
    setFilters: typeof setFiltersAction;
}

interface State {
    activeView: TabKey | undefined;
    faramValues: FiltersElement;
}

type Props = ComponentProps & PropsFromAppState & PropsFromDispatch;

const mapStateToProps = (state: AppState) => ({
    filters: filtersSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    carKeys: carKeysSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setFilters: params => dispatch(setFiltersAction(params)),
});

type TabKey = 'location' | 'hazard' | 'dataRange' | 'others';

const iconNames: {
    [key in TabKey]: string;
} = {
    location: 'distance',
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
    },
};

const getIsFiltered = (key: TabKey | undefined, filters: FiltersElement) => {
    if (!key || key === 'others') {
        return false;
    }

    const tabKeyToFilterMap: {
        [key in Exclude<TabKey, 'others'>]: keyof FiltersElement;
    } = {
        hazard: 'hazard',
        location: 'region',
        dataRange: 'dataDateRange',
    };

    const filter = filters[tabKeyToFilterMap[key]];

    if (Array.isArray(filter)) {
        return filter.length !== 0;
    }

    const filterKeys = Object.keys(filter);
    return filterKeys.length !== 0 && filterKeys.every(k => !!filter[k]);
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
            console.log('car region', params.region.region);
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
        faramValues: {
            dataDateRange: {
                rangeInDays: 7,
                startDate: undefined,
                endDate: undefined,
            },
            hazard: [],
            region: {},
        },
    };

    public componentDidMount() {
        const { filters: faramValues } = this.props;
        this.setState({ faramValues });
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
        others: {
            component: () => (
                this.props.extraContent ? (
                    <div className={_cs(
                        styles.activeView,
                        this.props.extraContentContainerClassName,
                    )}
                    >
                        { this.props.extraContent }
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

    private handleResetFiltersButtonClick = () => {
        this.setState({ activeView: undefined,
            faramValues: {
                dataDateRange: {
                    rangeInDays: 7,
                    startDate: undefined,
                    endDate: undefined,
                },
                hazard: [],
                region: {},
            } });


        const { setFilters } = this.props;
        const { faramValues } = this.state;
        if (faramValues) {
            setFilters({ filters: faramValues });
        }
    }

    private handleCloseCurrentFilterButtonClick = () => {
        this.setState({ activeView: undefined });
    }

    private handleFaramChange = (faramValues: FiltersElement) => {
        this.setState({ faramValues });
    }

    private handleSubmitClick = () => {
        const { setFilters, carKeys } = this.props;
        const { faramValues } = this.state;
        const { filters: propFilters } = this.props;
        const { region } = propFilters;
        if (faramValues) {
            setFilters({ filters: faramValues });
        } else {
            setFilters({ filters: propFilters });
        }
        console.log('filter state value', faramValues.region);
        console.log('filter prop value', this.props);

        const { activeRouteDetails, carKeysDetails } = this.context;
        if (Object.keys(activeRouteDetails).length !== 0) {
            const { name: activePage } = activeRouteDetails;
            if (activePage === 'riskInfo') {
                this.props.requests.resourceGetRequest.do({
                    resourceType: carKeys,
                    getRegionDetails: this.getRegionDetails,
                    region: this.state.faramValues,
                });
            }
        }
    }

    private getTabs = memoize(
        (
            extraContent: React.ReactNode,
            hideLocationFilter,
            hideHazardFilter,
            hideDataRangeFilter,
        ): {
            [key in TabKey]?: string;
        } => {
            const tabs = {
                location: 'Location',
                hazard: 'Hazard',
                dataRange: 'Data range',
                others: 'Others',
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
        } = this.props;

        const { faramValues: fv } = this.state;

        const tabs = this.getTabs(
            extraContent,
            hideLocationFilter,
            hideHazardFilter,
            hideDataRangeFilter,
        );

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
                                    { tabs[validActiveView] }
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
                    </Faram>
                    {validActiveView && (
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
