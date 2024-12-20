/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable arrow-body-style */
import React from 'react';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Tabs } from '@material-ui/core';
import ScrollTabs from '#rscv/ScrollTabs';
import MultiViewContainer from '#rscv/MultiViewContainer';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import {
    createRequestClient,
    ClientAttributes,
    methods,
    createConnectedRequestCoordinator,
} from '#request';
import { AppState } from '#store/types';
import { authStateSelector } from '#selectors';
import { AuthState } from '#store/atom/auth/types';

import defaultImage from '#resources/images/openspace-images/default_image.png';
import GenericTable from './GenericTable';
import EiaComponent from './EIA';
import SubHeader from './SubHeader';
import Media from './Media';
import Info from './Info';
import styles from './styles.scss';

interface State {
    currentView: string;
    suggestedUses: unknown;
    deleteModal: boolean;
}

interface Props {
    id: number;
    closeModal: (openspaceDeleted?: boolean) => void;
    className: any;
    requests: any;
    title: string;
    address: any;
    onEdit: () => void;
    type: any;
    routeToOpenspace: any;
    openspaceDeleteRequest: any;
    authState: any;
}

interface Params {
    openspaceId?: number;
}

interface PropsFromState {
    authState: AuthState;
}

type ReduxProps = PropsFromState;

interface Tabs {
    info: string;
    media: string;
    generic: string;
    eia: string;
}

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    coverPictureRequest: {
        url: ({ params }) => {
            if (!params || !params.openspaceId) {
                return '';
            }
            return `/openspace-detail/?open_space=${params.openspaceId}`;
        },
        method: methods.GET,
        onMount: false,
    },
};

interface Views {
    info: {};
    media: {};
    generic: {};
    eia: {};
}

class SingleOpenspaceDetails extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            currentView: 'info',
            deleteModal: false,
            suggestedUses: [],
        };

        const {
            requests: { coverPictureRequest },
            id: openspaceId,
        } = this.props;
        coverPictureRequest.do({
            openspaceId,
        });

        this.tabs = {
            info: 'INFO',
            media: 'MEDIA',
            generic: 'GENERIC TABLE',
            eia: 'ENVIRONMENT CHECKLIST',
        };

        // const rendererParams = () => ({ className: styles.view, details: this.props });

        this.views = {
            info: {
                component: Info,
                rendererParams: () => {
                    return {
                        openspaceId: this.props.id,
                        allData: this.props,
                    };
                },
            },
            media: {
                component: Media,
                rendererParams: () => {
                    return {
                        openspaceId: this.props.id,
                    };
                },
            },
            generic: {
                component: GenericTable,
                rendererParams: () => {
                    return {
                        allData: this.props,
                    };
                },
            },
            eia: {
                component: EiaComponent,
                rendererParams: () => {
                    return {
                        openspaceId: this.props.id,
                    };
                },
            },
        };
    }

    private tabs: Tabs;

    private views: Views;

    private handleTabClick = (newTab: string) => {
        this.setState({ currentView: newTab });
    };

    private handleDeleteModal = () => {
        this.setState((prevState) => ({
            deleteModal: !prevState.deleteModal,
        }));
    };

    private confirmDelete = () => {
        const { openspaceDeleteRequest, id, DeletedResourceApiRecall } = this.props;
        openspaceDeleteRequest.do({
            id,
            closeModal: this.props.closeModal,
            DeletedResourceApiRecall,
        });
    };

    public render() {
        const {
            className,
            closeModal,
            title,
            address,
            type,
            routeToOpenspace,
            requests,
            authState: { authenticated },
        } = this.props;
        const { currentView, deleteModal } = this.state;
        const { handleDeleteModal, confirmDelete } = this;
        let imageUrl = '';


        const {
            coverPictureRequest: { response },
        } = requests;

        if (response && response.count > 0) {
            imageUrl = response.results[0].image;
        }
        return (
            <>
                <Modal className={_cs(styles.loginModal, className)}>
                    <ModalHeader
                        className={styles.header}
                        rightComponent={
                            <DangerButton
                                transparent
                                iconName="close"
                                onClick={closeModal}
                                title="Close Modal"
                            />
                        }
                    />
                    <SubHeader
                        {...this.props}
                        routeToOpenspace={routeToOpenspace}
                        handleDeleteModal={handleDeleteModal}
                        title={title}
                        location={address}
                        onEdit={this.props.onEdit}
                        authenticated={authenticated}
                        closeModal={closeModal}
                    />
                    <img
                        src={imageUrl || defaultImage}
                        style={{
                            width: '100%',
                            height: '25vh',
                            padding: '0 10px',
                            objectFit: 'cover',
                        }}
                        alt="cover"
                    />
                    {/* <div style={{ padding: '0 10px',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover' }}
                    >
                        <LazyLoadImage
                            alt="cover"
                            src={imageUrl}
                            // effect="blur"
                            width="100%"
                            height="200"
                            delayTime="50"
                        />
                    </div> */}

                    <ModalBody className={styles.content}>
                        {type !== 'communityspace' && (
                            <ScrollTabs
                                className={styles.tabs}
                                tabs={this.tabs}
                                active={currentView}
                                onClick={this.handleTabClick}
                            />
                        )}

                        <MultiViewContainer
                            views={this.views}
                            active={currentView}
                        />
                    </ModalBody>
                </Modal>
                {deleteModal && (
                    <Modal>
                        <ModalHeader
                            title="Delete Openspace"
                            className={styles.header}
                            rightComponent={
                                <DangerButton
                                    transparent
                                    iconName="close"
                                    onClick={handleDeleteModal}
                                    title="Close Modal"
                                />
                            }
                        />
                        <ModalBody className={styles.content}>
                            <p>
                                Are you sure to delete the openspace? It cannot
                                be undone.
                            </p>
                        </ModalBody>
                        <ModalFooter className={styles.footer}>
                            <DangerButton onClick={handleDeleteModal}>
                                Close
                            </DangerButton>
                            <PrimaryButton onClick={confirmDelete}>
                                Confirm
                            </PrimaryButton>
                        </ModalFooter>
                    </Modal>
                )}
            </>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    authState: authStateSelector(state),
});

export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requestOptions)(SingleOpenspaceDetails),
    ),
);
