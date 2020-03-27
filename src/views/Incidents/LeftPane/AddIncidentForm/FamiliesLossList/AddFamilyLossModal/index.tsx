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

import {
    Status,
    Field,
} from '#store/atom/page/types';

import Cloak from '#components/Cloak';
import Button from '#rsca/Button';
import LoadingAnimation from '#rscv/LoadingAnimation';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import ModalFooter from '#rscv/Modal/Footer';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';
import NumberInput from '#rsci/NumberInput';
import Checkbox from '#rsci/Checkbox';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import DangerButton from '#rsca/Button/DangerButton';

import styles from './styles.scss';

interface FaramValues {
    belowPoverty?: number;
}

interface FaramErrors {
}

interface OwnProps {
    className?: string;
    closeModal: () => void;
    onAddSuccess: (familyLoss: object) => void;
    lossServerId: number;
}

interface PropsFromState {
}

interface PropsFromDispatch {
}

interface Params {
    body?: object;
    onFailure?: (faramErrors: object) => void;
}

interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const keySelector = (d: BelowPovertyOption) => d.id;
const labelSelector = (d: Field) => d.title;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    addFamilyLossRequest: {
        url: '/loss-family/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ response, props }) => {
            const {
                onAddSuccess,
                closeModal,
            } = props;

            if (onAddSuccess) {
                onAddSuccess(response);
            }
            closeModal();
        },
        onFailure: ({ error, params: { onFailure } = { onFailure: undefined } }) => {
            if (onFailure) {
                onFailure((error as { faramErrors: object }).faramErrors);
            }
        },
    },
};

const familyLossStatus: Status [] = [
    {
        id: 1,
        title: 'affected',
    },
    {
        id: 2,
        title: 'relocated',
    },
    {
        id: 3,
        title: 'evacuated',
    },
];

interface BelowPovertyOption {
    id: number;
    title: string;
    value: boolean;
}

const belowPovertyOptions: BelowPovertyOption[] = [
    {
        id: 1,
        title: 'Yes',
        value: true,
    },
    {
        id: 2,
        title: 'No',
        value: false,
    },
];

class AddFamilyLoss extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            faramValues: {},
            faramErrors: {},
            pristine: true,
        };
    }

    private static schema = {
        fields: {
            ownerName: [],
            status: [requiredCondition],
            belowPoverty: [],
            phoneNumber: [],
            count: [],
            verified: [],
            verificationMessage: [],
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
            requests: {
                addFamilyLossRequest,
            },
            lossServerId,
        } = this.props;

        const {
            belowPoverty: id,
        } = faramValues;

        const selected = belowPovertyOptions
            .find(v => v.id === id);

        const belowPoverty = selected ? selected.value : null;

        addFamilyLossRequest.do({
            body: {
                ...faramValues,
                belowPoverty,
                loss: lossServerId,
            },
            onFailure: (faramErrors: object) => {
                this.setState({ faramErrors });
            },
        });
    }

    public render() {
        const {
            className,
            closeModal,
            requests: {
                addFamilyLossRequest: {
                    pending,
                },
            },
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
        } = this.state;

        return (
            <Modal className={className}>
                <ModalHeader
                    title="Add Family Loss"
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
                    schema={AddFamilyLoss.schema}
                    value={faramValues}
                    error={faramErrors}
                >
                    <ModalBody className={styles.modalBody}>
                        {pending && <LoadingAnimation />}
                        <TextInput
                            faramElementName="ownerName"
                            label="Owner Name"
                            autoFocus
                        />
                        <SelectInput
                            faramElementName="status"
                            label="Status"
                            options={familyLossStatus}
                            keySelector={labelSelector}
                            labelSelector={labelSelector}
                        />
                        <SelectInput
                            faramElementName="belowPoverty"
                            label="Below Poverty"
                            options={belowPovertyOptions}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                        />
                        <TextInput
                            faramElementName="phoneNumber"
                            label="Phone Number"
                        />
                        <NumberInput
                            faramElementName="count"
                            label="Count"
                        />
                        <Cloak hiddenIf={p => !p.verify_family}>
                            <>
                                <Checkbox
                                    faramElementName="verified"
                                    label="Verified"
                                />
                                <TextInput
                                    faramElementName="verificationMessage"
                                    label="Verification Message"
                                />
                            </>
                        </Cloak>
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

export default createRequestClient(requests)(AddFamilyLoss);
