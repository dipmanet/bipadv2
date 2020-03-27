import React from 'react';
import Faram, {
    requiredCondition,
} from '@togglecorp/faram';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import NonFieldErrors from '#rsci/NonFieldErrors';
import LoadingAnimation from '#rscv/LoadingAnimation';
import Modal from '#rscv/Modal';
import { Training as ContactTraining } from '#store/atom/page/types';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import ModalFooter from '#rscv/Modal/Footer';
import NumberInput from '#rsci/NumberInput';
import SelectInput from '#rsci/SelectInput';
import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import DangerButton from '#rsca/Button/DangerButton';

import {
    trainingKeySelector,
    trainingLabelSelector,
    trainingValueList,
} from '../../../utils';

import styles from './styles.scss';

interface FaramValues {
}

interface FaramErrors {
}

interface OwnProps {
    className?: string;
    contactId: number;
    onAddSuccess: (contactTraining: ContactTraining) => void;
    closeModal?: () => void;
}

interface Params {
    body: object;
    setFaramErrors?: (error: object) => void;
}

type Props = NewProps<OwnProps, Params>;

interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
}

const requests: { [key: string]: ClientAttributes<OwnProps, Params>} = {
    addTrainingRequest: {
        url: '/contact-training/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ props, response }) => {
            const {
                onAddSuccess,
                closeModal,
            } = props;
            const trainingResponse = response as ContactTraining;

            if (onAddSuccess) {
                onAddSuccess(trainingResponse);
            }
            if (closeModal) {
                closeModal();
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

class AddTraining extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            faramValues: {
                verified: false,
            },
            faramErrors: {},
            pristine: true,
        };
    }

    private static schema = {
        fields: {
            title: [requiredCondition],
            durationDays: [requiredCondition],
        },
    }

    private handleFaramChange = (faramValues: FaramValues, faramErrors: FaramErrors) => {
        this.setState({
            faramValues,
            faramErrors,
            pristine: false,
        });
    }

    private handleFaramValidationFailure = (faramErrors: FaramErrors) => {
        this.setState({
            faramErrors,
        });
    }

    private handleFaramValidationSuccess = (faramValues: FaramValues) => {
        const {
            requests: { addTrainingRequest },
            contactId,
        } = this.props;

        addTrainingRequest.do({
            body: {
                ...faramValues,
                contact: contactId,
            },
            setFaramErrors: this.handleFaramValidationFailure,
        });
    }

    public render() {
        const {
            className,
            closeModal,
            requests: {
                addTrainingRequest: {
                    pending,
                },
            },
        } = this.props;

        const {
            pristine,
            faramValues,
            faramErrors,
        } = this.state;

        return (
            <Modal className={className}>
                <ModalHeader
                    title="Add Training"
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            onClick={closeModal}
                            title="Close Modal"
                        />
                    )}
                />
                <Faram
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={AddTraining.schema}
                    value={faramValues}
                    error={faramErrors}
                >
                    <ModalBody className={styles.modalBody}>
                        {pending && <LoadingAnimation />}
                        <NonFieldErrors faramElement />
                        <SelectInput
                            faramElementName="title"
                            options={trainingValueList}
                            keySelector={trainingKeySelector}
                            labelSelector={trainingLabelSelector}
                            label="Title"
                            autoFocus
                        />
                        <NumberInput
                            faramElementName="durationDays"
                            label="Duration in Days"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <DangerButton
                            onClick={closeModal}
                        >
                            Cancel
                        </DangerButton>
                        <PrimaryButton
                            type="submit"
                            disabled={pristine}
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

export default createRequestClient(requests)(AddTraining);
