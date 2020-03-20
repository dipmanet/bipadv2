import React from 'react';
import { isDefined } from '@togglecorp/fujs';
import Faram, {
    FaramInputElement,
    requiredCondition,
    emailCondition,
} from '@togglecorp/faram';

import Modal from '#rscv/Modal';
import LoadingAnimation from '#rscv/LoadingAnimation';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import TextInput from '#rsci/TextInput';
import NumberInput from '#rsci/NumberInput';
import SelectInput from '#rsci/SelectInput';
import Checkbox from '#rsci/Checkbox';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import DangerButton from '#rsca/Button/DangerButton';
import FullStepwiseRegionSelectInput from '#components/FullStepwiseRegionSelectInput';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import { MultiResponse } from '#store/atom/response/types';
import {
    Contact,
    Organization,
} from '#store/atom/page/types';

import {
    committeeValueList,
    committeeKeySelector,
    committeeLabelSelector,
} from '../utils';

import styles from './styles.scss';

const StepwiseRegionSelectInput = FaramInputElement(FullStepwiseRegionSelectInput);

interface OwnProps {
    contactId?: Contact['id'];
    details: Contact;
    onEditSuccess: (contactId: Contact['id'], contact: Contact) => void;
    closeModal?: () => void;
}

// TODO: Write appropriate types
interface FaramValues {
}

interface FaramErrors {
}

interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
    organizationList?: Organization[];
}

interface Params {
    body?: FaramValues;
    setPristine: (pristine: boolean) => void;
    setOrganizationList?: (organizationList: Organization[]) => void;
}

type Props = NewProps<OwnProps, Params>;

const requests: { [key: string]: ClientAttributes<OwnProps, Params> } = {
    municipalityContactEditRequest: {
        url: ({ props }) => `/municipality-contact/${props.contactId}/`,
        method: methods.PATCH,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props, params }) => {
            const editedContact = response as Contact;
            const {
                contactId,
                onEditSuccess,
            } = props;
            if (onEditSuccess && contactId) {
                onEditSuccess(contactId, editedContact);
            }
            if (params && params.setPristine) {
                params.setPristine(true);
            }
        },
        query: {
            expand: ['trainings', 'organization'],
        },
    },
    contactTrainingRequest: {
        url: '/contact-training/',
        query: ({ props }) => ({
            contact: props.contactId,
        }),
        method: methods.GET,
        onMount: ({ props }) => !!props.contactId,
        onSuccess: ({ response }) => {
            // console.warn('here', response);
        },
    },
    organizationGetRequest: {
        url: '/organization/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params }) => {
            const organizationList = response as MultiResponse<Organization>;

            if (params && params.setOrganizationList) {
                params.setOrganizationList(organizationList.results);
            }
        },
    },
};

const organizationKeySelector = (o: Organization) => o.id;
const organizationLabelSelector = (o: Organization) => o.title;

class ContactForm extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const {
            contactId,
            details,
            requests: {
                organizationGetRequest,
            },
        } = this.props;

        const {
            province,
            district,
            municipality,
            ward,
            isDrrFocalPerson,
            organization,
            ...otherValues
        } = details;

        organizationGetRequest.setDefaultParams({ setOrganizationList: this.setOrganizationList });

        this.state = {
            faramValues: {
                ...otherValues,
                isDrrFocalPerson: !!isDrrFocalPerson,
                organization: organization ? organization.id : undefined,
                stepwiseRegion: {
                    province,
                    district,
                    ward,
                    municipality,
                },
            },
            faramErrors: {},
            pristine: true,
        };
    }

    private static schema = {
        fields: {
            name: [requiredCondition],
            position: [requiredCondition],
            email: [emailCondition],
            workNumber: [],
            mobileNumber: [],
            isDrrFocalPerson: [],
            committee: [requiredCondition],
            organization: [],
            stepwiseRegion: [],
        },
    }

    private setPristine = (pristine: boolean) => {
        this.setState({ pristine });
    }

    private setOrganizationList = (organizationList: Organization[]) => {
        this.setState({ organizationList });
    }

    private handleFaramValidationFailure = (faramErrors: object) => {
        this.setState({
            faramErrors,
            pristine: true,
        });
    }

    private handleFaramChange = (faramValues: FaramValues, faramErrors: FaramErrors) => {
        this.setState({
            faramValues,
            faramErrors,
            pristine: false,
        });
    }

    private handleFaramValidationSuccess = (faramValues: FaramValues) => {
        const {
            requests: {
                municipalityContactEditRequest,
            },
        } = this.props;

        const {
            stepwiseRegion,
            ...others
        } = faramValues;

        const newBody = {
            province: stepwiseRegion.province,
            ward: stepwiseRegion.ward,
            municipality: stepwiseRegion.municipality,
            district: stepwiseRegion.district,
            ...others,
        };

        municipalityContactEditRequest.do({
            body: newBody,
            setPristine: this.setPristine,
        });
    }

    public render() {
        const {
            contactId,
            closeModal,
            requests: {
                organizationGetRequest: { pending: organizationPending },
                municipalityContactEditRequest: { pending: contactEditPending },
            },
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
            organizationList,
        } = this.state;

        return (
            <Modal className={styles.contactFormModal}>
                <ModalHeader
                    title={isDefined(contactId) ? 'Edit Contact' : 'Add Contact'}
                />
                <ModalBody className={styles.modalBody}>
                    {organizationPending && <LoadingAnimation />}
                    <Faram
                        className={styles.form}
                        onChange={this.handleFaramChange}
                        onValidationFailure={this.handleFaramValidationFailure}
                        onValidationSuccess={this.handleFaramValidationSuccess}
                        schema={ContactForm.schema}
                        value={faramValues}
                        error={faramErrors}
                        disabled={organizationPending}
                    >
                        <TextInput
                            faramElementName="name"
                            label="Name"
                            placeholder="Hari"
                        />
                        <TextInput
                            faramElementName="position"
                            label="Position"
                            placeholder="Officer"
                        />
                        <TextInput
                            faramElementName="email"
                            label="Email"
                            placeholder="ram@neoc.gov.np"
                        />
                        <NumberInput
                            faramElementName="workNumber"
                            label="Work Number"
                        />
                        <NumberInput
                            faramElementName="mobileNumber"
                            label="Mobile Number"
                        />
                        <Checkbox
                            faramElementName="isDrrFocalPerson"
                            label="Is DRR Focal Person"
                        />
                        <SelectInput
                            faramElementName="organization"
                            label="Organization"
                            options={organizationList}
                            keySelector={organizationKeySelector}
                            labelSelector={organizationLabelSelector}
                        />
                        <SelectInput
                            faramElementName="committee"
                            label="Committee"
                            options={committeeValueList}
                            keySelector={committeeKeySelector}
                            labelSelector={committeeLabelSelector}
                        />
                        <StepwiseRegionSelectInput
                            faramElementName="stepwiseRegion"
                        />
                        <div className={styles.actionButtons}>
                            <DangerButton
                                className={styles.button}
                                onClick={closeModal}
                            >
                                Cancel
                            </DangerButton>
                            <PrimaryButton
                                disabled={pristine}
                                className={styles.button}
                                pending={contactEditPending}
                                type="submit"
                            >
                                {isDefined(contactId) ? 'Edit' : 'Add'}
                            </PrimaryButton>
                        </div>
                    </Faram>
                </ModalBody>
            </Modal>
        );
    }
}

export default createRequestClient(requests)(ContactForm);
