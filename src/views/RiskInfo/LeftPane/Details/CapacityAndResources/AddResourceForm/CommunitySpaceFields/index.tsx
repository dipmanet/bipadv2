import React from 'react';
import { isNotDefined } from '@togglecorp/fujs';
import {
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';

import * as PageType from '#store/atom/page/types';


import styles from '../styles.scss';
import MultiViewContainer from '#rscv/MultiViewContainer';
import BasicInfo from './CommunitySpaceTabs/BasicInfo';
import ScrollTabs from '#rscv/ScrollTabs';
import Details from './CommunitySpaceTabs/Details';


const keySelector = (d: any) => d.id;

interface State {
    currentView: string;
    openspaceId: number | undefined;
    openspacePostError: boolean;
}

interface FaramErrors { }
interface ReduxProps { }
interface Params {
    body: {};
    OnSuccess: () => void;
}

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    addResourcePostRequest: {
        url: '/resource/',
        method: methods.POST,
        query: { meta: true },
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({
            params: { onSuccess } = { onSuccess: undefined },
            response,
        }) => {
            if (onSuccess) {
                onSuccess(response as PageType.Resource);
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
        onFatal: ({ params }) => {
            if (params && params.setFaramErrors) {
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
    },
    editResourcePostRequest: {
        url: ({ params: { resourceId } }) => `/resource/${resourceId}/`,
        method: methods.PUT,
        query: { meta: true },
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({
            params: { onSuccess } = { onSuccess: undefined },
            response,
        }) => {
            console.log('sucess', response);

            if (onSuccess) {
                onSuccess(response as PageType.Resource);
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
        onFatal: ({ params }) => {
            if (params && params.setFaramErrors) {
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
    },
};

class CommunitySpaceFields extends React.PureComponent<any, State> {
    public constructor(props: any) {
        super(props);
        this.state = {
            openspaceId: undefined,
            currentView: 'basicInfo',
            openspacePostError: false,
        };
    }

    public componentDidMount() {
        const { resourceId } = this.props;
        // if (resourceId) {
        this.setState({
            openspaceId: resourceId,
            openspacePostError: false,
        });
        // }
    }

    private tabs = {
        basicInfo: 'Basic Info',
        details: 'Details',
    };

    private views = {
        basicInfo: {
            component: BasicInfo,
            rendererParams: () => ({
                className: styles.views,
                resourceId: this.props.resourceId,
                // handleTabClick: this.handleTabClick,
                postBasicInfo: this.postBasicInfo,
                openspacePostError: this.state.openspacePostError,
                keySelector,
            }),
        },
        details: {
            component: Details,
            rendererParams: () => ({
                className: styles.views,
                handleTabClick: this.handleTabClick,
                resourceId: this.props.resourceId,
                openspaceId: this.state.openspaceId,
                closeModal: this.props.closeModal,
                keySelector,
            }),
        },
    };

    private handleTabClick = (tab: string) => {
        if (tab === 'closeModal') {
            this.props.closeModal();
        } else {
            this.setState({ currentView: tab });
        }
    };


    private postBasicInfo = () => {
        const { faramValues, resourceId } = this.props;
        const { location, resourceType, ...others } = faramValues;
        let values = others;
        if (location) {
            const point = location.geoJson.features[0].geometry;
            const { ward } = location.region;
            // const ward = 2;

            values = {
                ...values,
                resourceType,
                point,
                ward,
            };
        }
        const {
            requests: { addResourcePostRequest, editResourcePostRequest },
        } = this.props;
        if (isNotDefined(resourceId)) {
            addResourcePostRequest.do({
                body: values,
                onSuccess: this.handleOpenspacePostSuccess,
                setFaramErrors: this.handleFaramValidationFailure,
            });
        } else {
            editResourcePostRequest.do({
                resourceId,
                body: values,
                onSuccess: this.handleOpenspacePostSuccess,
                setFaramErrors: this.handleFaramValidationFailure,
            });
        }
    }


    private handleFaramValidationFailure = () => {
        this.setState({
            openspacePostError: true,
        });
    }

    private handleOpenspacePostSuccess = (resource: PageType.Resource) => {
        const { onAddSuccess } = this.props;

        if (onAddSuccess) {
            onAddSuccess(resource);
        }
        this.setState({
            openspaceId: resource.id,
        }, () => {
            this.handleTabClick('details');
        });
    }


    public render() {
        const { currentView } = this.state;
        return (
            <>
                <ScrollTabs
                    className={styles.tabs}
                    tabs={this.tabs}
                    active={currentView}
                    onClick={this.handleTabClick}
                />
                <MultiViewContainer
                    views={this.views}
                    active={currentView}
                />
            </>
        );
    }
}


export default createRequestClient(requests)(CommunitySpaceFields);
