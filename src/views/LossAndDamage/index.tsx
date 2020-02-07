import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import MultiViewContainer from '#rscv/MultiViewContainer';
import FixedTabs from '#rscv/FixedTabs';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import Loading from '#components/Loading';
import Page from '#components/Page';

import {
    getResponse,
    getResults,
    getPending,
} from '#utils/request';

import Overview from './Overview';
import Timeline from './Timeline';
import Comparative from './Comparative';

import styles from './styles.scss';

interface ComponentProps {
}

interface Params {
}

type Props = NewProps<ComponentProps, Params>;

const requestOptions: { [key: string]: ClientAttributes<ComponentProps, Params> } = {
    incidentsGetRequest: {
        url: '/incident/',
        method: methods.GET,
        query: {
            expand: ['loss.peoples', 'wards'],
            limit: 1000,
            ordering: '-incident_on',
        },
        onMount: true,
        // extras: { schemaName: 'incidentWithPeopleResponse' },
    },
};

type TabKey = 'overview' | 'timeline' | 'comparative';

const tabs: {
    [key in TabKey]: string;
} = {
    overview: 'Overview',
    timeline: 'Timeline',
    comparative: 'Comparative',
};

class LossAndDamage extends React.PureComponent<Props> {
    private views: {
        [key in TabKey]: {
            component: React.ReactNode;
            rendererParams?: () => {};
        };
    } = {
        overview: {
            component: () => <div>Overview</div>,
        },
        timeline: {
            component: () => <div>Timeline</div>,
        },
        comparative: {
            component: () => <div>Comparative</div>,
        },
    };

    public render() {
        const { requests } = this.props;
        // const incidentList = getResults(requests, 'incidentsGetRequest');
        const pending = getPending(requests, 'incidentsGetRequest');

        return (
            <>
                { pending && <Loading /> }
                <Page
                    leftContent={(
                        <>
                            <FixedTabs
                                tabs={tabs}
                                useHash
                            />
                            <MultiViewContainer
                                views={this.views}
                                useHash
                            />
                        </>
                    )}
                />
            </>
        );
    }
}

export default compose(
    connect(null, null),
    createConnectedRequestCoordinator<ComponentProps>(),
    createRequestClient(requestOptions),
)(LossAndDamage);
