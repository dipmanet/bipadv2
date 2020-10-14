import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import styles from './styles.scss';
import OpenSpaces from './CommunitySpaces';
import MultiViewContainer from '#rscv/MultiViewContainer';

interface State {
    currentView: string;
    tableData: any;
    allOpenspaces: unknown;
}

interface Props {
    closeModal: any;
    handelListClick: any;
}

class AllOpenspacesModal extends React.PureComponent<Props, State> {
    public constructor(props: any) {
        super(props);
        this.state = {
            currentView: 'OpenSpaces',
            allOpenspaces: [],
            tableData: '',
        };
    }

    private views = {
        OpenSpaces: {
            component: OpenSpaces,
            rendererParams: () => ({
                handelListClick: this.props.handelListClick,
                closeModal: this.props.closeModal,
            }),
        },
    };

    public render() {
        const { closeModal } = this.props;
        const { currentView } = this.state;

        return (
            <Modal
                className={_cs(styles.spacesListModal)}
                // onClose={closeModal}
                closeOnEscape
            >
                <ModalHeader
                    title="Community Spaces"
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            onClick={closeModal}
                            title="Close Modal"
                        />
                    )}
                />
                <ModalBody>
                    <MultiViewContainer
                        views={this.views}
                        active={currentView}
                    />
                </ModalBody>
            </Modal>
        );
    }
}

export default AllOpenspacesModal;
