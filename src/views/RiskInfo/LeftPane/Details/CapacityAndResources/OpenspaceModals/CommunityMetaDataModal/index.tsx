import React from 'react';
import { _cs } from '@togglecorp/fujs';
import NonFieldErrors from '#rsci/NonFieldErrors';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import SelectInput from '#rsci/SelectInput';
import TextArea from '#rsci/TextArea';
import NumberInput from '#rsci/NumberInput';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import * as PageType from '#store/atom/page/types';
import styles from './styles.scss';
import MultiViewContainer from '#rscv/MultiViewContainer';
import MetaData from './MetaData';
import Details from './Details';
import FixedTabs from '#rscv/FixedTabs';
import ScrollTabs from '#rscv/ScrollTabs';

interface Params {
    body: object;
    onSuccess?: () => void;
    setFaramErrors?: (error: object) => void;
}

interface State {
    pristine: boolean;
    activeView: string | undefined;
}

class OpenspaceMetadataModal extends React.PureComponent<any, State> {
    public constructor(props: any) {
        super(props);

        this.state = {
            pristine: true,
            activeView: 'details',
        };
    }

    private tabs = {
        details: 'Details',
        metadata: 'Metadata',
    };

    private views = {
        details: {
            component: Details,
        },
        metadata: {
            component: MetaData,
        },
    };

    private handleTabClick = (activeView) => {
        this.setState({ activeView });
    };

    public render() {
        const { className, closeModal, value } = this.props;

        const { activeView } = this.state;

        return (
            <Modal
                className={_cs(styles.metaDAtaModal)}
                // onClose={closeModal}
                closeOnEscape
            >
                <ModalHeader
                    title={'Layer Details'}
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
                    <ScrollTabs
                        className={styles.tabs}
                        tabs={this.tabs}
                        active={activeView}
                        onClick={this.handleTabClick}
                    />
                    <MultiViewContainer
                        views={this.views}
                        active={activeView}
                    />
                </ModalBody>
            </Modal>
        );
    }
}

export default OpenspaceMetadataModal;
