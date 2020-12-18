import React from 'react';
import { connect } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { _cs } from '@togglecorp/fujs';
import { Tabs } from '@material-ui/core';
import styles from './styles.scss';
import Info from './Info';
import MultiViewContainer from '#rscv/MultiViewContainer';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import SubHeader from './SubHeader';
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

interface State {
    currentView: string;
    suggestedUses: unknown;
    deleteModal: boolean;
}

interface Props {
    id: number;
    closeModal: () => void;
    className: any;
    requests: any;
    title: string;
    catchmentArea: string;
    onEdit: () => void;
    openspaceDeleteRequest: (point: {}) => void;
    type: any;
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

interface Views {
    info: {};
    media: {};
    generic: {};
    eia: {};
}

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    coverPictureRequest: {
        url: ({ params }) => {
            if (!params || !params.openspaceId) {
                return '';
            }
            return `/communityspace-detail/?community_space=${params.openspaceId}`;
        },
        method: methods.GET,
        onMount: false,
    },
};

class CommunityOpenspaceDetails extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            currentView: 'info',
            suggestedUses: [],
            deleteModal: false,
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
        };

        // const rendererParams = () => ({ className: styles.view, details: this.props });

        this.views = {
            info: {
                component: Info,
                rendererParams: () => ({
                    openspaceId: this.props.id,
                    className: styles.view,
                    allData: this.props,
                }),
            },
        };
    }

    private tabs: Tabs;

    private views: Views;

    private handleTabClick = (newTab: string) => {
        this.setState({ currentView: newTab });
    };

    private handleDeleteModal = () => {
        this.setState(prevState => ({
            deleteModal: !prevState.deleteModal,
        }));
    };

    private confirmDelete = () => {
        const { openspaceDeleteRequest, id } = this.props;
        openspaceDeleteRequest.do({
            id,
            closeModal: this.props.closeModal,
        });
    };

    public render() {
        const {
            className,
            closeModal,
            title,
            catchmentArea,
            type,
            routeToOpenspace,
            requests,
            authState: { authenticated },
        } = this.props;
        const { currentView, deleteModal } = this.state;
        const { handleDeleteModal, confirmDelete } = this;
        let imageUrl = '';

        const {
            coverPictureRequest: { response, pending },
        } = requests;

        if (response && response.count > 0) {
            imageUrl = response.results[0].image;
        }

        return (
            <>
                <Modal className={_cs(styles.loginModal, className)}>
                    <ModalHeader
                        className={styles.header}
                        rightComponent={(
                            <DangerButton
                                transparent
                                iconName="close"
                                onClick={closeModal}
                                title="Close Modal"
                            />
                        )}
                    />
                    <SubHeader
                        {...this.props}
                        title={title}
                        location={catchmentArea}
                        onEdit={this.props.onEdit}
                        routeToOpenspace={routeToOpenspace}
                        handleDeleteModal={handleDeleteModal}
                        authenticated={authenticated}
                    />
                    <img
                        src={imageUrl || defaultImage}
                        style={{
                            width: '100%',
                            height: '35vh',
                            padding: '0 10px',
                            objectFit: 'cover',
                        }}
                        alt="cover"
                    />
                    {/* <LazyLoadImage
                        alt="cover"
                        height="225"
                        src={imageUrl}
                        width="100%"
                        effect="blur"
                    /> */}
                    <ModalBody className={styles.content}>
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
                            rightComponent={(
                                <DangerButton
                                    transparent
                                    iconName="close"
                                    onClick={handleDeleteModal}
                                    title="Close Modal"
                                />
                            )}
                        />
                        <ModalBody className={styles.content}>
                            <p>
                                Are you sure to delete the community space? It
                                cannot be undone.
                            </p>
                        </ModalBody>
                        <ModalFooter className={styles.footer}>
                            <DangerButton onClick={handleDeleteModal}>
                                Close
                            </DangerButton>
                            <PrimaryButton onClick={confirmDelete}>
                                Save
                            </PrimaryButton>
                        </ModalFooter>
                    </Modal>
                )}
            </>
        );
    }
}

// export default createRequestClient(requestOptions)(CommunityOpenspaceDetails);


const mapStateToProps = (state: AppState) => ({
    authState: authStateSelector(state),
});

export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requestOptions)(CommunityOpenspaceDetails),
    ),
);
