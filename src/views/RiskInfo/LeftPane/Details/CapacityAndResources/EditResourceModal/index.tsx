import React from 'react';

import Faram from '@togglecorp/faram';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    ResourceType,
} from '#types';
import {
    Resource,
} from '#store/atom/page/types';

import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import DangerButton from '#rsca/Button/DangerButton';
import LoadingAnimation from '#rscv/LoadingAnimation';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import ModalFooter from '#rscv/Modal/Footer';

import FinanceForm, { financeSchema } from './FinanceForm';
import HealthForm, { healthSchema } from './HealthForm';
import GovernanceForm, { governanceSchema } from './GovernanceForm';

import styles from './styles.scss';

interface OwnProps {
    resourceDetails: Resource;
    className?: string;
    closeModal?: () => void;
    resourceId: number | undefined;
    resourceType: ResourceType | undefined;
}

interface Params {
    body?: object;
    onSuccess: () => void;
    onFailure: (faramErrors: object) => void;
}

interface FaramValues {
}

interface FaramErrors {
}

interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
}

type Props = NewProps<OwnProps, Params>;

const requestOptions: { [key: string]: ClientAttributes<OwnProps, Params>} = {
    editResourcePutRequest: {
        url: ({ props: { resourceId } }) => `/resource/${resourceId}/`,
        method: methods.PUT,
        body: ({ params: { body } = { body: {} } }) => body,
        onMount: false,
        onSuccess: ({ params: { onSuccess } = { onSuccess: undefined } }) => {
            if (onSuccess) {
                onSuccess();
            }
        },
        onFailure: ({ error, params: { onFailure } = { onFailure: undefined } }) => {
            if (onFailure) {
                onFailure((error as { faramErrors: object }).faramErrors);
            }
        },
    },
};

class EditResourceModal extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const { resourceDetails } = this.props;
        this.state = {
            faramValues: resourceDetails,
            faramErrors: {},
            pristine: true,
        };
    }

    private getForm = (resourceType: ResourceType | undefined) => {
        if (resourceType === 'finance') {
            return <FinanceForm />;
        }
        if (resourceType === 'health') {
            return <HealthForm />;
        }
        if (resourceType === 'governance') {
            return <GovernanceForm />;
        }

        return null;
    }

    private getSchema = (resourceType: ResourceType | undefined) => {
        if (resourceType === 'finance') {
            return financeSchema;
        }
        if (resourceType === 'health') {
            return healthSchema;
        }
        if (resourceType === 'governance') {
            return governanceSchema;
        }

        return {};
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
            requests: {
                editResourcePutRequest,
            },
            closeModal,
        } = this.props;

        editResourcePutRequest.do({
            body: {
                ...faramValues,
            },
            onSuccess: () => {
                if (closeModal) {
                    closeModal();
                }
            },
            onFailure: (faramErrors: object) => {
                this.setState({ faramErrors });
            },
        });
    }

    public render() {
        const {
            resourceId,
            resourceType,
            className,
            closeModal,
            requests: {
                editResourcePutRequest: {
                    pending,
                },
            },
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
        } = this.state;

        const form = this.getForm(resourceType);
        const schema = this.getSchema(resourceType);

        return (
            <Modal className={className}>
                <ModalHeader
                    title="Edit Resource"
                    rightComponent={(
                        <Button
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
                    schema={schema}
                    value={faramValues}
                    error={faramErrors}
                >
                    <ModalBody className={styles.modalBody}>
                        {pending && <LoadingAnimation />}
                    </ModalBody>
                    { form }
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
                            Submit
                        </PrimaryButton>
                    </ModalFooter>
                </Faram>
            </Modal>
        );
    }
}

export default createRequestClient(requestOptions)(EditResourceModal);
