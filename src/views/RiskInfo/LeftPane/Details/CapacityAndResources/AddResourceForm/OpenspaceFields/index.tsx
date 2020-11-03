import React from 'react';
import { isNotDefined, isDefined } from '@togglecorp/fujs';
import {
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
import * as PageType from '#store/atom/page/types';
import styles from './styles.scss';
import MultiViewContainer from '#rscv/MultiViewContainer';
import BasicInfo from './AddOpenspaceTabs/BasicInfo';
import SuggestedUses from './AddOpenspaceTabs/SuggestedUses';
import OnSiteAmenities from './AddOpenspaceTabs/OnSiteAmenities';
import EnvironmentChecklist from './AddOpenspaceTabs/EnvironmentChecklist';
import Media from './AddOpenspaceTabs/Media';
import ScrollTabs from '#rscv/ScrollTabs';
import Details from './AddOpenspaceTabs/Details';


const keySelector = (d: any) => d.id;

interface Tabs {
    basicInfo: string;
    details: string;
    suggestedUses: string;
    onSiteAmenties: string;
    environmentChecklist: string;
    media: string;
}
interface State {
    currentView: string;
    openspaceId: number | undefined;
    openspacePostError: boolean;
}

interface Props {
    resourceId: number | undefined;

    closeModal: () => void;
}
interface FaramErrors { }

interface ReduxProps { }

interface Params { }

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
        onFailure: ({ params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
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
            if (onSuccess) {
                onSuccess(response as PageType.Resource);
            }
        },
        onFailure: ({ params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
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

class OpenspaceFields extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            openspaceId: undefined,
            currentView: 'basicInfo',
            openspacePostError: false,
        };
    }


    public componentDidMount() {
        const { resourceId } = this.props;
        if (resourceId) {
            this.setState({
                openspaceId: resourceId,
                openspacePostError: false,
            });
        }
    }

    private tabs = {
        basicInfo: 'Basic Info',
        details: 'Details',
        suggestedUses: 'Suggested Uses',
        onSiteAmenties: 'Amenities',
        environmentChecklist: 'EIA Checklist',
        media: 'Media',
    };

    private views = {
        basicInfo: {
            component: BasicInfo,
            rendererParams: () => ({
                className: styles.views,
                resourceId: this.props.resourceId,
                openspacePostError: this.state.openspacePostError,
                handleTabClick: this.procceedTabClick,
                postBasicInfo: this.postBasicInfo,
                keySelector,
            }),
        },
        details: {
            component: Details,
            rendererParams: () => ({
                className: styles.views,
                handleTabClick: this.procceedTabClick,
                resourceId: this.props.resourceId,
                openspaceId: this.state.openspaceId,
                keySelector,
            }),
        },
        suggestedUses: {
            component: SuggestedUses,
            rendererParams: () => ({
                className: styles.views,
                handleTabClick: this.procceedTabClick,
                resourceId: this.props.resourceId,
                openspaceId: this.state.openspaceId,
                keySelector,
            }),
        },
        onSiteAmenties: {
            component: OnSiteAmenities,
            rendererParams: () => ({
                className: styles.views,
                // handleChange: this.handleChange,
                handleTabClick: this.procceedTabClick,
                resourceId: this.props.resourceId,
                openspaceId: this.state.openspaceId,
                keySelector,
            }),
        },
        environmentChecklist: {
            component: EnvironmentChecklist,
            rendererParams: () => ({
                className: styles.views,
                // handleChange: this.handleChange,
                handleTabClick: this.procceedTabClick,
                resourceId: this.props.resourceId,
                openspaceId: this.state.openspaceId,
                keySelector,
            }),
        },
        media: {
            component: Media,
            rendererParams: () => ({
                className: styles.views,
                // handleChange: this.handleChange,
                handleTabClick: this.procceedTabClick,
                resourceId: this.props.resourceId,
                openspaceId: this.state.openspaceId,
                keySelector,
            }),
        },
    };

    private handleTabClick = (tab: string) => {
        const { resourceId } = this.props;
        if (isDefined(resourceId)) {
            this.setState({ currentView: tab });
        }
    }

    private procceedTabClick = (tabToProceed: string) => {
        if (tabToProceed === 'closeModal') {
            this.props.closeModal();
        } else {
            this.setState({ currentView: tabToProceed });
        }
    };


    private handleFaramValidationFailure = () => {
        this.setState({
            openspacePostError: true,
        });
    }

    private postBasicInfo = () => {
        this.setState({ openspacePostError: false });
        const { faramValues, resourceId } = this.props;
        const { location, resourceType, ...others } = faramValues;
        let values = others;
        // let formdata = new FormData();
        if (location) {
            const point = location.geoJson.features[0].geometry;
            // const { ward } = location.region;
            const ward = 1;

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

    private handleOpenspacePostSuccess = (resource: PageType.Resource) => {
        const { onAddSuccess } = this.props;
        if (onAddSuccess) {
            onAddSuccess(resource);
        }

        this.setState({
            openspaceId: resource.id,
        }, () => {
            this.setState({ currentView: 'details' });
        });
    }
    // private getSchema = memoize((openspaceTab?: OpenspaceTabs) => {
    //     if (openspaceTab) {
    //         return schemaMap[openspaceTab];
    //     }
    //     return defaultSchema;
    // });


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


export default createRequestClient(requests)(OpenspaceFields);
