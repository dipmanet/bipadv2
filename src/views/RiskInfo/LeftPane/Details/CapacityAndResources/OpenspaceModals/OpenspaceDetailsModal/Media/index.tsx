/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import ReactPanZoom from 'react-image-pan-zoom-rotate';

import { cross } from 'react-icons-kit/icomoon/cross';
import { Icon } from 'react-icons-kit';
import { createRequestClient, ClientAttributes, methods } from '#request';
import styles from './styles.scss';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';

interface Props {
    openspaceId: any;
    requests: any;
}
interface Params {
    openspaceId: number;
}

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    mediaGetRequest: {
        url: ({ params }) => {
            if (!params || !params.openspaceId) {
                return '';
            }
            return `/open-media/?open_space=${params.openspaceId}`;
        },
        method: methods.GET,
        onMount: false,
    },
};

interface State {
    zoomModal: boolean;
    imageModal: string;
}
class MediaComponent extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            zoomModal: false,
            imageModal: '',
        };
        const {
            requests: { mediaGetRequest },
            openspaceId,
        } = this.props;
        mediaGetRequest.do({
            openspaceId,
        });
    }

    public handelZoomModal = (image: string) => {
        this.setState({
            zoomModal: true,
            imageModal: image,
        });
    };

    public render() {
        const {
            props: { requests },
            state: { zoomModal, imageModal },
        } = this;
        const {
            mediaGetRequest: { pending, response },
        } = requests;

        const data = response && response.results && response.results;
        const dataPresent = !!(response && response.count > 0);

        return (
            <>
                <div>
                    {dataPresent && (
                        <div className={styles.container}>
                            {response
                                && data
                                && data.map(
                                    // eslint-disable-next-line arrow-body-style
                                    (item: { image: string | undefined }) => {
                                        return (
                                            <div
                                                className={styles.imageWrapper}
                                                onClick={() => {
                                                    this.handelZoomModal(
                                                        item.image,
                                                    );
                                                }}
                                                onKeyDown={() => {
                                                    this.handelZoomModal(
                                                        item.image,
                                                    );
                                                }}
                                            >
                                                <img
                                                    src={item.image}
                                                    alt="cat"
                                                    style={{
                                                        width: '100%',
                                                        height: '25vh',
                                                    }}
                                                />
                                            </div>
                                        );
                                    },
                                )}
                        </div>
                    )}
                    {!pending && !dataPresent && <div>No file presnet.</div>}
                </div>
                {zoomModal && (
                    <Modal>
                        <div className={styles.modalClose}>
                            {' '}
                            <Icon
                                size={15}
                                icon={cross}
                                onClick={() => this.setState({ zoomModal: false })}
                            />
                        </div>

                        <ModalBody className={styles.content}>
                            <div className="photo_viewer">
                                {' '}
                                <ReactPanZoom image={imageModal} />
                            </div>
                        </ModalBody>
                    </Modal>
                )}
            </>
        );
    }
}

export default createRequestClient(requestOptions)(MediaComponent);
