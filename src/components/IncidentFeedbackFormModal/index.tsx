import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Faram, { emailCondition, requiredCondition } from '@togglecorp/faram';

import DangerButton from '#rsca/Button/DangerButton';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import NonFieldErrors from '#rsci/NonFieldErrors';
import TextInput from '#rsci/TextInput';
import TextArea from '#rsci/TextArea';
import ReCaptcha from '#rsci/ReCaptcha';

import {
    BasicElement,
} from '#types';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import styles from './styles.scss';

interface ComponentProps {
    className?: string;
    closeModal?: () => void;
    incidentId: number;
}

interface FaramValues {
    name?: string;
    email?: string;
    mobileNumber?: string;
    comment?: string;
    recaptcha?: number;
}

interface State {
    faramValues: FaramValues;
    faramErrors: object;
}

interface Params {
    body?: object;
    setFaramErrors?: (error: object) => void;
}

type Props = NewProps<ComponentProps, Params>;

const schema = {
    fields: {
        name: [requiredCondition],
        email: [requiredCondition, emailCondition],
        mobileNumber: [requiredCondition],
        comment: [requiredCondition],
        recaptcha: [requiredCondition],
    },
};

const requestOptions: { [key: string]: ClientAttributes<ComponentProps, Params> } = {
    incidentFeedbackPostRequest: {
        url: '/incident-feedback/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            if (props.closeModal) {
                props.closeModal();
            }
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
                console.warn('failure', error);
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

class IncidentFeedbackFormModal extends React.PureComponent<Props, State> {
    public state = {
        faramValues: {},
        faramErrors: {},
    };

    private handleFaramValidationFailure = (faramErrors: object) => {
        this.setState({ faramErrors });
    }

    private handleFaramChange = (faramValues: FaramValues, faramErrors: object) => {
        this.setState({ faramValues, faramErrors });
    }

    private handleFaramValidationSuccess = (faramValues: FaramValues) => {
        const {
            requests: {
                incidentFeedbackPostRequest,
            },
            incidentId,
        } = this.props;

        const body = {
            ...faramValues,
            incident: incidentId,
            acknowledged: false,
            acknowledgedMessage: null,
        };

        incidentFeedbackPostRequest.do({
            body,
            setFaramErrors: this.handleFaramValidationFailure,
        });
    }

    public render() {
        const {
            className,
            closeModal,
            requests: {
                incidentFeedbackPostRequest: {
                    pending,
                },
            },
        } = this.props;

        const {
            faramValues,
            faramErrors,
        } = this.state;

        return (
            <Modal
                className={_cs(styles.addIncidentFeedbackFormModal, className)}
                // onClose={closeModal}
            >
                <Faram
                    className={styles.form}
                    schema={schema}
                    onChange={this.handleFaramChange}
                    value={faramValues}
                    error={faramErrors}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    onValidationFailure={this.handleFaramValidationFailure}
                    disabled={pending}
                >
                    <ModalHeader
                        className={styles.header}
                        title="Leave Feedback"
                        rightComponent={(
                            <DangerButton
                                transparent
                                iconName="close"
                                onClick={closeModal}
                                title="Close Modal"
                            />
                        )}
                    />
                    <ModalBody className={styles.body}>
                        <NonFieldErrors faramElement />
                        <TextInput
                            className={styles.input}
                            faramElementName="name"
                            label="Name"
                            autoFocus
                        />
                        <TextInput
                            className={styles.input}
                            faramElementName="email"
                            label="Email"
                        />
                        <TextInput
                            className={styles.input}
                            faramElementName="mobileNumber"
                            label="Mobile number"
                        />
                        <TextArea
                            className={styles.input}
                            faramElementName="comment"
                            label="Comment"
                        />
                        <ReCaptcha
                            faramElementName="recaptcha"
                            siteKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <PrimaryButton
                            type="submit"
                            pending={pending}
                        >
                            Save
                        </PrimaryButton>
                    </ModalFooter>
                </Faram>
            </Modal>
        );
    }
}

export default createConnectedRequestCoordinator<ComponentProps>()(
    createRequestClient(requestOptions)(
        IncidentFeedbackFormModal,
    ),
);
