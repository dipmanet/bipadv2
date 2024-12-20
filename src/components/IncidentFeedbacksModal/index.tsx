import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import Icon from '#rscg/Icon';
import FormattedDate from '#rscv/FormattedDate';
import DangerButton from '#rsca/Button/DangerButton';
import ListView from '#rscv/List/ListView';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import modalize from '#rscg/Modalize';
import AccentButton from '#rsca/Button/AccentButton';

import IncidentFeedbackAckFormModal from '#components/IncidentFeedbackAckFormModal';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

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

const DetailItem = ({
    className,
    iconName,
    value,
}: {
    className?: string;
    iconName: string;
    value: React.ReactNode;
}) => (
    <div className={_cs(className, styles.detailItem)}>
        <Icon
            className={styles.icon}
            name={iconName}
        />
        <div className={styles.value}>
            {value}
        </div>
    </div>
);

interface IncidentFeedbackItemProps {
    className?: string;
    data: IncidentFeedback;
    onSuccess: (data: IncidentFeedback) => void;
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
        onSuccess,
    } = props;

    return (
        <div className={_cs(className, styles.incidentFeedback)}>
            <div className={styles.iconContainer}>
                <Icon
                    className={styles.icon}
                    name="chatBox"
                />
            </div>
            <div className={styles.detailContainer}>
                <div className={styles.comment}>
                    {comment}
                </div>
                <div className={styles.details}>
                    <DetailItem
                        iconName="calendar"
                        value={(
                            <FormattedDate
                                className={styles.createdOn}
                                value={createdOn}
                                mode="yyyy-MM-dd"
                            />
                        )}
                    />
                    <DetailItem
                        iconName="user"
                        value={name}
                    />
                    <DetailItem
                        iconName="email"
                        value={email}
                    />
                    <DetailItem
                        iconName="telephone"
                        value={mobileNumber}
                    />
                </div>
                {acknowledged && (
                    <div className={styles.acknowledgementStatus}>
                        Acknowledged
                    </div>
                )}
                {!acknowledged && (
                    <ModalAccentButton
                        className={styles.acknowledgeButton}
                        transparent
                        iconName="check"
                        modal={(
                            <IncidentFeedbackAckFormModal
                                onSuccess={onSuccess}
                                // incidentId={incidentId}
                                feedbackId={id}
                            />
                        )}
                    >
                        Acknowledge
                    </ModalAccentButton>
                )}
            </div>
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
    incidentFeedbacks: IncidentFeedback[];
}

interface Params {
    setIncidentFeedbacks: (incidentFeedback: IncidentFeedback[]) => void;
}

type Props = NewProps<OwnProps, Params>;

const requestOptions: { [key: string]: ClientAttributes<OwnProps, Params> } = {
    incidentFeedbacksGet: {
        url: '/incident-feedback/',
        query: ({ props }) => ({
            incident: props.incidentId,
        }),
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params }) => {
            const feedbackResponse = response as MultiResponse<IncidentFeedback>;
            if (params && params.setIncidentFeedbacks) {
                params.setIncidentFeedbacks(feedbackResponse.results);
            }
        },
    },
};

class IncidentFeedbacksModal extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            incidentFeedbacks: [],
        };

        const { requests } = this.props;
        requests.incidentFeedbacksGet.setDefaultParams({
            setIncidentFeedbacks: (incidentFeedbacks: IncidentFeedback[]) => {
                this.setState({ incidentFeedbacks });
            },
        });
    }

    private rendererParams = (key: number, data: IncidentFeedback) => ({
        className: styles.incidentFeedbackItem,
        data,
        onSuccess: this.handleSuccess,
    })

    private handleSuccess = (data: IncidentFeedback) => {
        const { incidentFeedbacks } = this.state;
        const newFeedbacks = [...incidentFeedbacks];
        const index = incidentFeedbacks.findIndex(i => i.id === data.id);
        if (index === -1) {
            console.error('Cannot replace item which is not in the list');
            return;
        }

        newFeedbacks.splice(index, 1, data);
        this.setState({
            incidentFeedbacks: newFeedbacks,
        });
    }

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
        const {
            incidentFeedbacks,
        } = this.state;

        return (
            <Translation>
                {
                    t => (
                        <Modal className={_cs(styles.incidentFeebacksModal, className)}>
                            <ModalHeader
                                title={t('Incident Feedbacks')}
                                rightComponent={(
                                    <DangerButton
                                        transparent
                                        iconName="close"
                                        onClick={closeModal}
                                        title="Close Modal"
                                    />
                                )}
                            />
                            <ModalBody className={styles.modalBody}>
                                <ListView
                                    className={styles.incidentFeedbackList}
                                    data={incidentFeedbacks}
                                    keySelector={keySelector}
                                    renderer={IncidentFeedbackItem}
                                    rendererParams={this.rendererParams}
                                    pending={pending}
                                />
                            </ModalBody>
                        </Modal>

                    )
                }
            </Translation>
        );
    }
}

export default createRequestClient(requestOptions)(
    IncidentFeedbacksModal,
);
