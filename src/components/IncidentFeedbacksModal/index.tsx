import React from 'react';
import { _cs, Obj } from '@togglecorp/fujs';
import { connect } from 'react-redux';

import FormattedDate from '#rscv/FormattedDate';
import Button from '#rsca/Button';
import ListView from '#rscv/List/ListView';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import LoadingAnimation from '#rscv/LoadingAnimation';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import ModalHeader from '#rscv/Modal/Header';
import modalize from '#rscg/Modalize';
import AccentButton from '#rsca/Button/AccentButton';

import IncidentFeedbackAckFormModal from '#components/IncidentFeedbackAckFormModal';

import * as PageType from '#store/atom/page/types';
import { AppState } from '#store/types';
import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import {
    hazardTypesSelector,
} from '#selectors';

import alertIcon from '#resources/icons/Alert.svg';

import { MultiResponse } from '#store/atom/response/types';

import styles from './styles.scss';

const ModalAccentButton = modalize(AccentButton);

interface IncidentFeedback {
    name: string;
    email: string;
    mobileNumber?: string | number;
    comment: string;
    acknowledged: boolean;
    acknowledgedMessage?: string;
    incident: number;

    id: number;
    createdOn: string;
}

interface IncidentFeedbackItemProps {
    className?: string;
    data: IncidentFeedback;
}

const IncidentFeedbackItem = (props: IncidentFeedbackItemProps) => {
    const {
        className,
        data: {
            id,

            name,
            email,
            mobileNumber,
            comment,
            createdOn,
            acknowledged,
            // ward,
        },
    } = props;

    return (
        <div className={_cs(className, styles.incidentFeedback)}>
            <div className={styles.name}>
                {name}
            </div>
            <div className={styles.email}>
                {email}
            </div>
            <div className={styles.mobileNumber}>
                {mobileNumber}
            </div>
            <div className={styles.comment}>
                {comment}
            </div>
            <FormattedDate
                className={styles.createdOn}
                value={createdOn}
                mode="yyyy-MM-dd"
            />
            {acknowledged && (
                <div className={styles.acknowledged}>
                    Acknowledged
                </div>
            )}
            {!acknowledged && (
                <ModalAccentButton
                    className={styles.button}
                    transparent
                    modal={(
                        <IncidentFeedbackAckFormModal
                            // incidentId={incidentId}
                            feedbackId={id}
                        />
                    )}
                >
                    Acknowledge
                </ModalAccentButton>
            )}
        </div>
    );
};

const keySelector = (c: IncidentFeedback) => c.id;

interface OwnProps {
    className?: string;
    closeModal?: () => void;
    incidentId: number;
}

interface State {
}

interface Params {
}

type Props = NewProps<OwnProps, Params>;

const requests: { [key: string]: ClientAttributes<OwnProps, Params>} = {
    incidentFeedbacksGet: {
        url: '/incident-feedback/',
        query: ({ props }) => ({
            incident: props.incidentId,
        }),
        method: methods.GET,
        onMount: true,
    },
};

class IncidentFeedbacksModal extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private rendererParams = (key: number, data: IncidentFeedback) => ({
        data,
    })

    public render() {
        const {
            className,
            closeModal,
            requests: {
                incidentFeedbacksGet: {
                    pending,
                    response,
                },
            },
        } = this.props;

        let incidentFeedbackList: IncidentFeedback[] = [];
        if (!pending && response) {
            const incidentFeedbackResponse = response as MultiResponse<IncidentFeedback>;
            incidentFeedbackList = incidentFeedbackResponse.results;
        }

        return (
            <Modal className={_cs(styles.incidentFeebacksModal, className)}>
                <ModalHeader
                    title="Incident Feedbacks"
                    rightComponent={(
                        <Button
                            iconName="close"
                            onClick={closeModal}
                            title="Close modal"
                            transparent
                        />
                    )}
                />
                <ModalBody className={styles.modalBody}>
                    <ListView
                        className={styles.incidentFeedbackList}
                        data={incidentFeedbackList}
                        keySelector={keySelector}
                        renderer={IncidentFeedbackItem}
                        rendererParams={this.rendererParams}
                        pending={pending}
                    />
                </ModalBody>
            </Modal>
        );
    }
}

export default createRequestClient(requests)(
    IncidentFeedbacksModal,
);
