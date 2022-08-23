import React from 'react';
import { isNotDefined } from '@togglecorp/fujs';
import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
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

import { languageSelector } from '#selectors';

const mapStateToProps = state => ({
    language: languageSelector(state),
});
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
                const errorKey = Object.keys(error.response).find(i => i === 'ward');

                if (errorKey) {
                    const errorList = error.response;
                    errorList.location = errorList.ward;
                    delete errorList.ward;

                    params.setFaramErrors(errorList);
                } else {
                    params.setFaramErrors({
                        $internal: ['Some problem occurred'],


                        // location: [(error.response.ward)[0]],
                    });
                }
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
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                const errorKey = Object.keys(error.response).find(i => i === 'ward');

                if (errorKey) {
                    const errorList = error.response;
                    errorList.location = errorList.ward;
                    delete errorList.ward;

                    params.setFaramErrors(errorList);
                } else {
                    params.setFaramErrors({
                        $internal: ['Some problem occurred'],


                        // location: [(error.response.ward)[0]],
                    });
                }
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

    private tabs = language => ({
        basicInfo: language === 'en' ? 'Basic Info' : 'आधारभूत जानकारी',
        details: language === 'en' ? 'Details' : 'विवरणहरू',
    });

    private views = {
        basicInfo: {
            component: BasicInfo,
            rendererParams: () => ({
                className: styles.views,
                setAdministrativeParameters: this.setAdministrativeParameters,
                resourceId: this.props.resourceId,
                // handleTabClick: this.handleTabClick,
                postBasicInfo: this.postBasicInfo,
                openspacePostError: this.state.openspacePostError,
                keySelector,
                faramValueSetNull: this.props.faramValueSetNull,
                LoadingSuccessHalt: this.props.LoadingSuccessHalt,
                faramValues: this.props.faramValues,
                optionsClassName: this.props.optionsClassName,
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
                faramValueSetNull: this.props.faramValueSetNull,
                LoadingSuccessHalt: this.props.LoadingSuccessHalt,
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

    private setAdministrativeParameters = (name, value) => {
        this.setState({
            [name]: value,
        });
    }


    private postBasicInfo = () => {
        const { faramValues, resourceId } = this.props;
        const { location, resourceType, ...others } = faramValues;
        const {
            province, district, municipality,
        } = this.state;
        let values = { resourceType, ...others };
        if (location) {
            const point = location.geoJson.features[0].geometry;
            const { ward } = location.region;
            // const ward = 1;

            values = {
                ...values,
                resourceType,
                point,
                ward,
                province,
                district,
                municipality,
            };
        }

        const {
            requests: { addResourcePostRequest, editResourcePostRequest }, LoadingSuccessHalt,
        } = this.props;
        LoadingSuccessHalt(true);
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


    private handleFaramValidationFailure = (faramErrors) => {
        const { LoadingSuccessHalt, handleFaramValidationFailure } = this.props;

        this.setState({
            openspacePostError: true,
        });
        LoadingSuccessHalt(false);
        handleFaramValidationFailure(faramErrors);
    }

    private handleOpenspacePostSuccess = (resource: PageType.Resource) => {
        const { onAddSuccess, LoadingSuccessHalt, handleClearDataAfterAddition } = this.props;
        LoadingSuccessHalt(false);

        handleClearDataAfterAddition(resource.resourceType);
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
        const { faramValueSetNull, LoadingSuccessHalt, faramValues,
            language: { language } } = this.props;
        return (
            <>
                <ScrollTabs
                    className={styles.tabs}
                    tabs={this.tabs(language)}
                    active={currentView}
                    onClick={this.handleTabClick}
                    faramValueSetNull={faramValueSetNull}
                    LoadingSuccessHalt={LoadingSuccessHalt}
                    faramValues={faramValues}
                />
                <MultiViewContainer
                    views={this.views}
                    active={currentView}
                    faramValueSetNull={faramValueSetNull}
                    LoadingSuccessHalt={LoadingSuccessHalt}
                />
            </>
        );
    }
}


export default connect(mapStateToProps)(createRequestClient(requests)(CommunitySpaceFields));
