import React from 'react';
import Faram from '@togglecorp/faram';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import NonFieldErrors from '#rsci/NonFieldErrors';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import DangerButton from '#rsca/Button/DangerButton';
import LoadingAnimation from '#rscv/LoadingAnimation';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import { ResourceTypeKeys } from '#types';
import {
    Resource,
} from '#store/atom/page/types';
import FinanceForm, { financeSchema } from './FinanceForm';
import HealthForm, { healthSchema } from './HealthForm';
import GovernanceForm, { governanceSchema } from './GovernanceForm';

import styles from './styles.scss';

interface OwnProps {
    resourceDetails: Resource;
    className?: string;
    onCloseButtonClick?: () => void;
    resourceId: number | undefined;
    resourceType: ResourceTypeKeys | undefined;
}

interface Params {
    body?: object;
    setFaramErrors?: (error: object) => void;
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
        onSuccess: ({ props }) => {
            if (props.onCloseButtonClick) {
                props.onCloseButtonClick();
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

    private getForm = (resourceType: ResourceTypeKeys | undefined) => {
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

    private getSchema = (resourceType: ResourceTypeKeys | undefined) => {
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
        } = this.props;

        editResourcePutRequest.do({
            body: {
                ...faramValues,
            },
            setFaramErrors: this.handleFaramValidationFailure,
        });
    }

    public render() {
        const {
            resourceType,
            onCloseButtonClick,
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
            <Modal className={styles.editResourceForm}>
                <ModalHeader
                    className={styles.header}
                    title="Edit Resource"
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            onClick={onCloseButtonClick}
                            title="Close Modal"
                        />
                    )}
                />
                <Faram
                    className={styles.faram}
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={schema}
                    value={faramValues}
                    error={faramErrors}
                >
                    <ModalBody
                        className={styles.body}
                    >
                        {pending && <LoadingAnimation />}
                        <div>
                            <NonFieldErrors faramElement />
                            { form }
                        </div>
                    </ModalBody>
                    <ModalFooter
                        className={styles.footer}
                    >
                        <DangerButton onClick={onCloseButtonClick}>
                            Close
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

export default createRequestClient(requestOptions)(EditResourceModal);
