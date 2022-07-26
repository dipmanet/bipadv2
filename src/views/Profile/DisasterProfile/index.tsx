/* eslint-disable max-len */
/* eslint-disable lines-between-class-members */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import MultiViewContainer from '#rscv/MultiViewContainer';
import SegmentInput from '#rsci/SegmentInput';

import Loading from '#components/Loading';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import {
    getResponse,
    isAnyRequestPending,
    getPending,
} from '#utils/request';
import {
    transformRegionToFilter,
} from '#utils/transformations';
import {
    languageSelector,
    filtersSelector, municipalitiesSelector, regionNameSelector, regionSelector,
} from '#selectors';
import { AppState } from '#store/types';
import { FiltersElement } from '#types';

import { TitleContext, Profile } from '#components/TitleContext';

import ResourceProfile from './ResourceProfile';
import Disasters from './Disasters';
import Demographics from './Demographics';
import styles from './styles.scss';

interface ComponentProps {
    className?: string;
}

interface Params {
}
type ReduxProps = ComponentProps & PropsFromAppState;
type Props = NewProps<ReduxProps, Params>;

const transformFilters = ({
    region,
}: FiltersElement) => ({
    ...transformRegionToFilter(region),
});

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    incidentProfileGetRequest: {
        url: '/incident-profile/',
        method: methods.GET,
        query: ({ props: { filters } }) => ({
            ...transformFilters(filters),
        }),
        onPropsChanged: {
            filters: ({
                props: { filters: { region } },
                prevProps: { filters: {
                    region: prevRegion,
                } },
            }) => region !== prevRegion,
        },
        onMount: true,
    },
    resourceProfileGetRequest: {
        url: '/resource-profile/',
        method: methods.GET,
        query: ({ props: { filters } }) => ({
            ...transformFilters(filters),
        }),
        onPropsChanged: {
            filters: ({
                props: { filters: { region } },
                prevProps: { filters: {
                    region: prevRegion,
                } },
            }) => region !== prevRegion,
        },
        onMount: true,
    },
    demographicsGetRequest: {
        url: '/demographic/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ params, response }) => {
            if (params && params.onSuccess) {
                const demographyData = response as MultiResponse<PageType.Incident>;
                const { onSuccess } = params;
                onSuccess(demographyData.results);
            }
        },

    },
    lgProfileGetHouseHoldInfo: {
        url: ({ params }) => `/profile-household/?municipality=${params.municipality}&expand=disability_stat`,
        method: methods.GET,
        onMount: true,
        onSuccess: ({ params, response }) => {
            if (params && params.onSuccess) {
                const lgProfileData = response as MultiResponse<PageType.Incident>;
                const { onSuccess } = params;
                onSuccess(lgProfileData.results);
            }
        },

    },
    lgProfileGetWardLevelData: {
        url: ({ params }) => `/profile-household/?municipality=${params.municipality}&summary=true&summary_type=agg_lgprofile&aggregate_type=municipality`,
        method: methods.GET,
        onMount: true,
        onSuccess: ({ params, response }) => {
            if (params && params.onSuccess) {
                const lgProfileWardLevelData = response as MultiResponse<PageType.Incident>;
                const { onSuccess } = params;
                onSuccess(lgProfileWardLevelData.results.sort((a, b) => a.ward - b.ward));
            }
        },

    },
    lgProfileGetRequest: {
        url: ({ params }) => `/profile-household/?summary=${params.summary}&summary_type=${params.summaryType}&province=${params.province}&district=${params.district}&municipality=${params.municipality}`,
        method: methods.GET,
        onMount: true,
        onSuccess: ({ params, response }) => {
            if (params && params.onSuccess) {
                const lgProfileData = response as MultiResponse<PageType.Incident>;
                const { onSuccess } = params;
                onSuccess(lgProfileData.results);
            }
        },

    },
};

interface Tab {
    key: string;
    label: string;
}

interface PropsFromAppState {
    filters: FiltersElement;
}


const keySelector = (d: Tab) => d.key;
const labelSelector = (d: Tab) => d.label;

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    filters: filtersSelector(state),
    language: languageSelector(state),
    region: regionSelector(state),
    regionName: regionNameSelector(state),
});


const tabList = language => (
    [
        { key: 'resources', label: language === 'en' ? 'Resources' : 'स्रोतहरू' },
        { key: 'disasters', label: language === 'en' ? 'Losses' : 'घाटा' },
        { key: 'demographics', label: language === 'en' ? 'Demographics' : 'जनसांख्यिकी' },
    ]
);


class DisasterProfile extends React.PureComponent<Props> {
    public static contextType = TitleContext;

    public constructor(props: Props) {
        super(props);
        this.state = {
            activeView: 'resources',
            demographyData: [],
            // activeView: 'demographics',
            lgProfileData: [],
            pendingLgProfileData: true,
            houseHoldData: [],
            lgProfileWardLevelData: [],

        };
        const {
            requests: {
                demographicsGetRequest,
                lgProfileGetRequest,
                lgProfileGetHouseHoldInfo,
                lgProfileGetWardLevelData,

            },
            region: { adminLevel, geoarea },
        } = this.props;
        demographicsGetRequest.setDefaultParams({
            onSuccess: this.demographicData,
        });
        if (adminLevel === 3) {
            lgProfileGetHouseHoldInfo.setDefaultParams({
                onSuccess: this.houseHoldData,
                municipality: geoarea,
            });
            lgProfileGetWardLevelData.setDefaultParams({
                municipality: geoarea,
                onSuccess: this.wardLevelData,
            });
        }
        lgProfileGetRequest.setDefaultParams({
            onSuccess: this.lgProfileData,
            summary: true,
            summaryType: 'agg_lgprofile',
            province: adminLevel && adminLevel === 1 ? geoarea : '',
            district: adminLevel && adminLevel === 2 ? geoarea : '',
            municipality: adminLevel && adminLevel === 3 ? geoarea : '',

        });
    }
    public componentDidUpdate(prevProps) {
        const { region: { adminLevel, geoarea }, region,
            requests: {

                lgProfileGetRequest,
                lgProfileGetHouseHoldInfo,

            } } = this.props;
        if (prevProps.region !== region) {
            if (adminLevel === 3) {
                lgProfileGetHouseHoldInfo.do({
                    onSuccess: this.houseHoldData,
                    municipality: geoarea,
                });
            }
            lgProfileGetRequest.do({
                onSuccess: this.lgProfileData,
                summary: true,
                summaryType: 'agg_lgprofile',
                province: adminLevel && adminLevel === 1 ? geoarea : '',
                district: adminLevel && adminLevel === 2 ? geoarea : '',
                municipality: adminLevel && adminLevel === 3 ? geoarea : '',

            });
        }
    }

    private wardLevelData = (data) => {
        this.setState({
            lgProfileWardLevelData: data,
        });
    }
    private houseHoldData = (data) => {
        this.setState({
            houseHoldData: data,
        });
    }
    private lgProfileData = (data) => {
        this.setState({
            lgProfileData: data,
            pendingLgProfileData: false,
        });
    }
    private demographicData = (data) => {
        this.setState({ demographyData: data });
    }
    private views = {
        resources: {
            component: ResourceProfile,
            rendererParams: () => {
                const { requests } = this.props;
                const resourceSummary = getResponse(requests, 'resourceProfileGetRequest');

                return {
                    onResourceAdd: this.handleResourceAdd,
                    data: resourceSummary.data,
                    className: styles.view,
                };
            },
        },
        disasters: {
            component: Disasters,
            rendererParams: () => {
                const { requests } = this.props;
                const incidentSummary = getResponse(requests, 'incidentProfileGetRequest');

                return {
                    data: incidentSummary.data,
                    className: styles.view,
                };
            },
        },
        demographics: {
            component: Demographics,
            rendererParams: () => {
                const { requests } = this.props;
                const pending = getPending(requests, 'demographicsGetRequest');
                const demographics = getResponse(requests, 'demographicsGetRequest');

                return {
                    pending,
                    data: demographics.results,
                    className: styles.view,
                };
            },
        },
    }

    private handleTabClick = (activeView: string) => {
        this.setState({ activeView });
    }

    private handleResourceAdd = () => {
        const { requests: { resourceProfileGetRequest } } = this.props;
        resourceProfileGetRequest.do();
    }

    public render() {
        const {
            className,
            requests,
            closedVisualization,
            handleCloseVisualizationOnModalCloseClick,
            checkPendingCondition,
            region,
            regionName,
        } = this.props;
        const { setProfile } = this.context;
        const { lgProfileData, pendingLgProfileData } = this.state;

        if (setProfile) {
            setProfile((prevProfile: Profile) => {
                if (prevProfile.mainModule !== 'Summary') {
                    return { ...prevProfile, mainModule: 'Summary' };
                }
                return prevProfile;
            });
        }
        const { activeView, demographyData, houseHoldData, lgProfileWardLevelData } = this.state;


        const pending = isAnyRequestPending(requests);
        checkPendingCondition(pending);

        return (
            <>

                {pending ? <Loading pending={pending} />
                    : (
                        <>
                            {' '}
                            <Demographics
                                pending={pending}
                                data={demographyData}
                                className={styles.view}
                                closedVisualization={closedVisualization}
                                handleCloseVisualizationOnModalCloseClick={handleCloseVisualizationOnModalCloseClick}
                                checkPendingCondition={checkPendingCondition}
                                lgProfileData={lgProfileData}
                                LGProfilehouseHoldData={houseHoldData}
                                lgProfileWardLevelData={lgProfileWardLevelData}
                            />
                        </>
                    )

                }


            </>
        );
    }
}

export default compose(
    connect(mapStateToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requestOptions),
)(DisasterProfile);
