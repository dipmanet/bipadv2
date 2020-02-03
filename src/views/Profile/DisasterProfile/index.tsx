import React from 'react';
import { _cs } from '@togglecorp/fujs';

import FixedTabs from '#rscv/FixedTabs';
import MultiViewContainer from '#rscv/MultiViewContainer';
import Message from '#rscv/Message';

import Page from '#components/Page';
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
} from '#utils/request';

import ResourceProfile from './ResourceProfile';
import Disasters from './Disasters';
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
};


class DisasterProfile extends React.PureComponent<Props> {
    public state = {
        activeView: 'resources',
    }

    private tabs = {
        resources: 'Resources',
        disasters: 'Disasters',
        demographics: 'Demographics',
    }

    private views = {
        resources: {
            component: ResourceProfile,
            rendererParams: () => {
                const { requests } = this.props;
                const resourceSummary = getResponse(requests, 'resourceProfileGetRequest');

                return {
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
            component: () => (
                <div className={styles.view}>
                    <Message>
                        Data not available
                    </Message>
                </div>
            ),
        },
    }

    private handleTabClick = (activeView) => {
        this.setState({ activeView });
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
                <Page
                    className={_cs(styles.disasterProfile, className)}
                    leftContentClassName={styles.leftContainer}
                    leftContent={(
                        <>
                            <FixedTabs
                                className={styles.tabs}
                                tabs={this.tabs}
                                active={activeView}
                                onClick={this.handleTabClick}
                            />
                            <MultiViewContainer
                                views={this.views}
                                active={activeView}
                            />
                        </>
                    )}
                />
            </>
        );
    }
}

export default createConnectedRequestCoordinator<ComponentProps>()(
    createRequestClient(requestOptions)(
        DisasterProfile,
    ),
);
