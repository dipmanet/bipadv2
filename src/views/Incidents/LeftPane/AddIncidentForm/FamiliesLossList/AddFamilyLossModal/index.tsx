import React from 'react';

import Faram, {
    requiredCondition,
} from '@togglecorp/faram';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
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

import NonFieldErrors from '#rsci/NonFieldErrors';
import Cloak from '#components/Cloak';
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

import { languageSelector } from '#selectors';
import styles from './styles.scss';

const mapStateToProps = state => ({
    language: languageSelector(state),
});

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
    setFaramErrors?: (error: object) => void;
}

interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const keySelector = (d: BelowPovertyOption) => d.id;
const labelSelector = (d: Field, language) => (language === 'en' ? d.title : d.titleNe);

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

const familyLossStatus: Status [] = [
    {
        id: 1,
        title: 'affected',
        titleNe: 'प्रभावित भएको',
    },
    {
        id: 2,
        title: 'relocated',
        titleNe: 'स्थानान्तरण गरिएको',
    },
    {
        id: 3,
        title: 'evacuated',
        titleNe: 'खाली गरिएको',
    },
];

interface BelowPovertyOption {
    id: number;
    title: string;
    titleNe: string;
    value: boolean;
}

const belowPovertyOptions: BelowPovertyOption[] = [
    {
        id: 1,
        title: 'Yes',
        titleNe: 'छ',
        value: true,
    },
    {
        id: 2,
        title: 'No',
        titleNe: 'छैन',
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
            setFaramErrors: this.handleFaramValidationFailure,
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
            language: { language },
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
        } = this.state;

        return (
            <Translation>
                {
                    t => (
                        <Modal className={className}>
                            <ModalHeader
                                title={t('Add Family Loss')}
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
                                    <NonFieldErrors faramElement />
                                    <TextInput
                                        faramElementName="ownerName"
                                        label={t('Owner Name')}
                                        autoFocus
                                    />
                                    <SelectInput
                                        placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                                        faramElementName="status"
                                        label={t('Status')}
                                        options={familyLossStatus}
                                        keySelector={labelSelector}
                                        labelSelector={d => labelSelector(d, language)}
                                    />
                                    <SelectInput
                                        placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                                        faramElementName="belowPoverty"
                                        label={t('Below Poverty')}
                                        options={belowPovertyOptions}
                                        keySelector={keySelector}
                                        labelSelector={labelSelector}
                                    />
                                    <TextInput
                                        faramElementName="phoneNumber"
                                        label={t('Phone Number')}
                                    />
                                    <NumberInput
                                        faramElementName="count"
                                        label={t('Count')}
                                    />
                                    <Cloak hiddenIf={p => !p.verify_family}>
                                        <>
                                            <Checkbox
                                                faramElementName="verified"
                                                label={t('Verified')}
                                            />
                                            <TextInput
                                                faramElementName="verificationMessage"
                                                label={t('Verification Message')}
                                            />
                                        </>
                                    </Cloak>
                                </ModalBody>
                                <ModalFooter>
                                    <DangerButton onClick={closeModal}>
                                        {t('Cancel')}
                                    </DangerButton>
                                    <PrimaryButton
                                        type="submit"
                                        disabled={pristine}
                                        pending={pending}
                                    >
                                        {t('Save')}
                                    </PrimaryButton>
                                </ModalFooter>
                            </Faram>
                        </Modal>
                    )
                }
            </Translation>

        );
    }
}

export default connect(mapStateToProps)(createRequestClient(requests)(AddFamilyLoss));
