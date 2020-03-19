import React from 'react';
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

import ResourceProfile from './ResourceProfile';
import Disasters from './Disasters';
import Demographics from './Demographics';
import styles from './styles.scss';

interface ComponentProps {
    className?: string;
}

interface Params {
}

type Props = NewProps<ComponentProps, Params>;

const requestOptions: { [key: string]: ClientAttributes<ComponentProps, Params> } = {
    incidentProfileGetRequest: {
        url: '/incident-profile/',
        method: methods.GET,
        onMount: true,
    },
    resourceProfileGetRequest: {
        url: '/resource-profile/',
        method: methods.GET,
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
const tabList: Tab[] = [
    { key: 'resources', label: 'Resources' },
    { key: 'disasters', label: 'Losses' },
    { key: 'demographics', label: 'Demographics' },
];

const keySelector = (d: Tab) => d.key;
const labelSelector = (d: Tab) => d.label;

class DisasterProfile extends React.PureComponent<Props> {
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

        const { activeView } = this.state;
        const pending = isAnyRequestPending(requests);

        return (
            <>
                <Loading pending={pending} />
                <div className={_cs(styles.profileSummary, className)}>
                    <SegmentInput
                        className={styles.summarySelection}
                        options={tabList}
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

export default createConnectedRequestCoordinator<ComponentProps>()(
    createRequestClient(requestOptions)(
        DisasterProfile,
    ),
);
