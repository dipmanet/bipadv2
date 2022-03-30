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
    filtersSelector,
    languageSelector,
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

    public state = {
        activeView: 'resources',
        // activeView: 'demographics',
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
        } = this.props;
        const { setProfile } = this.context;

        if (setProfile) {
            setProfile((prevProfile: Profile) => {
                if (prevProfile.mainModule !== 'Summary') {
                    return { ...prevProfile, mainModule: 'Summary' };
                }
                return prevProfile;
            });
        }
        const { activeView } = this.state;
        const pending = isAnyRequestPending(requests);
        const { language: { language } } = this.props;
        return (
            <>
                <Loading pending={pending} />
                <div className={_cs(styles.profileSummary, className)}>
                    <SegmentInput
                        className={styles.summarySelection}
                        options={tabList(language)}
                        value={activeView}
                        onChange={this.handleTabClick}
                        keySelector={keySelector}
                        labelSelector={labelSelector}
                        showLabel={false}
                        showHintAndError={false}
                    />
                    <MultiViewContainer
                        views={this.views}
                        active={activeView}
                    />
                </div>
            </>
        );
    }
}

export default compose(
    connect(mapStateToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requestOptions),
)(DisasterProfile);
