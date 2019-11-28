import React from 'react';
import Redux, {
    compose,
} from 'redux';

import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import Faram, {
    requiredCondition,
} from '@togglecorp/faram';

import FixedTabs from '#rscv/FixedTabs';
import MultiViewContainer from '#rscv/MultiViewContainer';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import TimeInput from '#rsci/TimeInput';
import SelectInput from '#rsci/SelectInput';
import TextArea from '#rsci/TextArea';
import Checkbox from '#rsci/Checkbox';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import LocationInput from '#components/LocationInput';

import {
    setLossListAction,
} from '#actionCreators';

import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    eventListSelector,
    sourceListSelector,
    hazardTypeListSelector,
    lossListSelector,
} from '#selectors';

import styles from './styles.scss';

interface Tabs {
}

interface Views {
}

interface OwnProps {
    closeModal?: () => void;
    onUpdate?: () => void;
    className?: string;
}

interface PropsFromState {
}

interface PropsFromDispatch {
}

interface State {
    currentView: string;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

class AddLossModal extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.tabs = {
        };

        this.views = {
        };

        this.state = {
            currentView: '',
        };
    }

    private tabs: Tabs;

    private views: Views;

    public render() {
        const {
            className,
            closeModal,
        } = this.props;

        const {
            currentView,
        } = this.state;

        return (
            <Modal
                className={_cs(styles.addLossModal, className)}
                onClose={closeModal}
                closeOnEscape
            >
                <ModalHeader title="Add Loss" />
                <ModalBody>
                    <FixedTabs
                        className={styles.tabs}
                        tabs={this.tabs}
                        onClick={this.handleTabClick}
                        active={currentView}
                    />
                    <MultiViewContainer
                        views={this.views}
                        active={currentView}
                    />
                </ModalBody>
                <ModalFooter>
                    <DangerButton onClick={closeModal}>
                        Close
                    </DangerButton>
                </ModalFooter>
            </Modal>
        );
    }
}
