import React from 'react';
import Faram, {
    FaramInputElement,
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
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import ModalFooter from '#rscv/Modal/Footer';
import TextInput from '#rsci/TextInput';
import NumberInput from '#rsci/NumberInput';
import TextArea from '#rsci/TextArea';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import DangerButton from '#rsca/Button/DangerButton';
import { Organization } from '#types';

import FullStepwiseRegionSelectInput, {
    RegionValuesAlt,
} from '#components/FullStepwiseRegionSelectInput';

const StepwiseRegionSelectInput = FaramInputElement(FullStepwiseRegionSelectInput);

interface FaramValues {
    title?: string;
    longName?: string;
    shortName?: string;
    description?: string;
    incidentVerificationDuration?: number;
    stepwiseRegion?: RegionValuesAlt | null;
}

interface FaramErrors {
}

interface OwnProps {
    className?: string;
    onOrganizationAdd: (organization: Organization) => void;
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
    addOrganizationRequest: {
        url: '/organization/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ props, response }) => {
            const {
                onOrganizationAdd,
                closeModal,
            } = props;
            const organizationResponse = response as Organization;

            if (onOrganizationAdd) {
                onOrganizationAdd(organizationResponse);
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

class AddOrganization extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            faramValues: {
                stepwiseRegion: {},
            },
            faramErrors: {},
            pristine: true,
        };
    }

    private static schema = {
        fields: {
            title: [requiredCondition],
            shortName: [],
            longName: [],
            incidentVerificationDuration: [requiredCondition],
            description: [],
            stepwiseRegion: [],
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
            requests: { addOrganizationRequest },
        } = this.props;

        const {
            stepwiseRegion,
            ...otherValues
        } = faramValues;

        const body = {
            ...otherValues,

            province: stepwiseRegion && stepwiseRegion.province,
            wards: [stepwiseRegion && stepwiseRegion.ward],
            municipality: stepwiseRegion && stepwiseRegion.municipality,
            district: stepwiseRegion && stepwiseRegion.district,
        };

        addOrganizationRequest.do({
            body,
            setFaramErrors: this.handleFaramValidationFailure,
        });
    }

    public render() {
        const {
            className,
            closeModal,
            requests: {
                addOrganizationRequest: {
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
                    title="Add Organization"
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
                    schema={AddOrganization.schema}
                    value={faramValues}
                    error={faramErrors}
                >
                    <ModalBody>
                        {pending && <LoadingAnimation />}
                        <NonFieldErrors faramElement />
                        <TextInput
                            faramElementName="title"
                            label="Title"
                        />
                        <TextInput
                            faramElementName="shortName"
                            label="Short Name"
                        />
                        <TextInput
                            faramElementName="longName"
                            label="Long Name"
                        />
                        <NumberInput
                            faramElementName="incidentVerificationDuration"
                            label="Incident Verification Duration"
                        />
                        <TextArea
                            faramElementName="description"
                            label="Description"
                        />
                        <StepwiseRegionSelectInput
                            faramElementName="stepwiseRegion"
                            showHintAndError
                        />
                    </ModalBody>
                    <ModalFooter>
                        <DangerButton onClick={closeModal}>
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

export default createRequestClient(requests)(AddOrganization);
