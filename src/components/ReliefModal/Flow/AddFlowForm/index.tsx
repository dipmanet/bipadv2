import React from 'react';
import Redux, {
    compose,
} from 'redux';
import { connect } from 'react-redux';
import Faram, { requiredCondition } from '@togglecorp/faram';

import { Translation } from 'react-i18next';
import TextInput from '#rsci/TextInput';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import DateInput from '#rsci/DateInput';
import SelectInput from '#rsci/SelectInput';
import NumberInput from '#rsci/NumberInput';
import LoadingAnimation from '#rscv/LoadingAnimation';
import NonFieldErrors from '#rsci/NonFieldErrors';
import Button from '#rsca/Button';
import modalize from '#rscg/Modalize';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    AppState,
    EventElement,
    Flow,
    Organization,
} from '#types';

import {
    Field,
    Event,
} from '#store/atom/page/types';

import {
    eventListSelector,
    languageSelector,
} from '#selectors';

import {
    setEventListAction,
} from '#actionCreators';
import { MultiResponse } from '#store/atom/response/types';
import AddOrganizationModal from '#components/AddOrganizationModal';
import styles from './styles.scss';

const ModalButton = modalize(Button);

interface FaramValues {
}
interface FaramErrors {
}

interface OwnProps {
    closeModal?: () => void;
    onUpdate?: () => void;
    value?: Flow;
}

interface PropsFromAppState {
    eventList: EventElement[];
}

interface PropsFromDispatch {
    setEventList: typeof setEventListAction;
}

interface State {
    faramValues: FaramValues;
    faramErrors: object;
    pristine: boolean;
    organizationList?: Organization[];
}

interface Params {
    body?: object;
    setFaramErrors?: (error: object) => void;
    setOrganizations?: (organizationList: Organization[]) => void;
}

interface FlowType {
    id: string;
    label: string;
}

interface FiscalYearType {
    id: number;
    title: string;
}

const typeList: FlowType[] = [
    {
        id: 'inflow',
        label: 'inflow',
    },
    {
        id: 'initial balance',
        label: 'initial balance',
    },
];

type PropsWithRedux = OwnProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<PropsWithRedux, Params>;

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    eventList: eventListSelector(state),
    language: languageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setEventList: params => dispatch(setEventListAction(params)),
});

const typeKeySelector = (f: FlowType) => f.id;
const typeLabelSelector = (f: FlowType) => f.label;
const eventKeySelector = (d: Field) => d.id;
const eventLabelSelector = (d: Field) => d.title;
const fiscalYearKeySelector = (f: FlowType) => f.id;
const fiscalYearLabelSelector = (f: FlowType) => f.title;
const organizationKeySelector = (o: Organization) => o.id;
const organizationLabelSelector = (o: Organization) => o.title;

const requestOptions: { [key: string]: ClientAttributes<PropsWithRedux, Params> } = {
    fiscalYearsGetRequest: {
        url: '/fiscal-year/',
        method: methods.GET,
        onMount: true,
    },
    organizationGetRequest: {
        url: '/organization/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params }) => {
            const organizations = response as MultiResponse<Organization>;
            const organizationList = organizations.results;
            if (params && params.setOrganizations) {
                params.setOrganizations(organizationList);
            }
        },
    },
    eventTypesGetRequest: {
        url: '/event/',
        method: methods.GET,
        onSuccess: ({ response, props: { setEventList } }) => {
            interface Response { results: Event[] }
            const { results: eventList = [] } = response as Response;
            setEventList({ eventList });
        },
        onMount: true,
    },
    reliefFlowAddRequest: {
        url: ({ props }) => (
            props.value
                ? `/relief-flow/${props.value.id}/`
                : '/relief-flow/'
        ),
        method: ({ props }) => (
            props.value
                ? methods.PATCH
                : methods.POST
        ),
        body: ({ params }) => params && params.body,
        onSuccess: ({ props }) => {
            if (props.onUpdate) {
                props.onUpdate();
            }
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

class AddFlowForm extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const {
            value,
            requests: {
                organizationGetRequest,
            },
        } = this.props;

        organizationGetRequest.setDefaultParams({
            setOrganizations: this.setOrganizations,
        });

        this.state = {
            faramValues: value as FaramValues,
            faramErrors: {},
            pristine: true,
            organizationList: undefined,
        };

        this.schema = {
            fields: {
                description: [],
                receiverOrganization: [requiredCondition],
                providerOrganization: [],
                amount: [requiredCondition],
                type: [requiredCondition],
                fiscalYear: [requiredCondition],
                event: [],
                date: [],
            },
        };
    }

    private schema: object;

    private handleFaramChange = (faramValues: FaramValues, faramErrors: FaramErrors) => {
        this.setState({
            faramValues,
            faramErrors,
            pristine: false,
        });
    }

    private setOrganizations = (organizationList: Organization[]) => {
        this.setState({ organizationList });
    }

    private handleOrganizationAdd = (organization: Organization) => {
        const {
            organizationList = [],
            faramValues,
        } = this.state;

        const newOrganizationList = [
            organization,
            ...organizationList,
        ];

        const newFaramValues = {
            ...faramValues,
            organization: organization.id,
        };

        this.setState({
            organizationList: newOrganizationList,
            faramValues: newFaramValues,
            pristine: false,
        });
    }

    private handleFaramValidationFailure = (faramErrors: FaramErrors) => {
        this.setState({
            faramErrors,
        });
    }

    private handleFaramValidationSuccess = (_: unknown, faramValues: FaramValues) => {
        const { requests: { reliefFlowAddRequest } } = this.props;
        reliefFlowAddRequest.do({
            body: faramValues,
            setFaramErrors: this.handleFaramValidationFailure,
        });
    }

    public render() {
        const {
            closeModal,
            eventList,
            requests: {
                reliefFlowAddRequest: {
                    pending: addReliefPending,
                },
                eventTypesGetRequest: {
                    pending: eventTypesGetPending,
                },
                organizationGetRequest: {
                    response,
                    pending: organizationsGetPending,
                },
                fiscalYearsGetRequest: {
                    response: fiscalYearsResponse,
                    pending: fiscalYearsGetPending,
                },
            },
            language: { language },
        } = this.props;

        const {
            organizationList,
            faramValues,
            faramErrors,
            pristine,
        } = this.state;

        let fiscalYearOptions: FiscalYearType[] = [];
        if (!fiscalYearsGetPending && fiscalYearsResponse) {
            const years = fiscalYearsResponse as MultiResponse<FiscalYearType>;
            fiscalYearOptions = years.results;
        }

        const pending = addReliefPending || eventTypesGetPending
            || organizationsGetPending || fiscalYearsGetPending;

        return (
            <Modal>
                {pending && <LoadingAnimation />}
                <Translation>
                    {
                        t => (
                            <Faram
                                onChange={this.handleFaramChange}
                                onValidationFailure={this.handleFaramValidationFailure}
                                onValidationSuccess={this.handleFaramValidationSuccess}
                                schema={this.schema}
                                value={faramValues}
                                error={faramErrors}
                                disabled={pending}
                            >
                                <ModalHeader
                                    title={t('Add Flow')}
                                    rightComponent={(
                                        <DangerButton
                                            transparent
                                            iconName="close"
                                            onClick={closeModal}
                                            title={t('Close Modal')}
                                        />
                                    )}
                                />
                                <ModalBody>
                                    <NonFieldErrors faramElement />
                                    <TextInput
                                        autoFocus
                                        faramElementName="description"
                                        label={t('Description')}
                                    />
                                    <div className={styles.organizationContainer}>
                                        <SelectInput
                                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                                            className={styles.input}
                                            faramElementName="receiverOrganization"
                                            label={t('Receiver Organization')}
                                            options={organizationList}
                                            keySelector={organizationKeySelector}
                                            labelSelector={organizationLabelSelector}
                                            autoFocus
                                        />
                                        <ModalButton
                                            className={styles.button}
                                            modal={(
                                                <AddOrganizationModal
                                                    onOrganizationAdd={this.handleOrganizationAdd}
                                                />
                                            )}
                                            iconName="add"
                                            transparent
                                        />
                                    </div>
                                    <div className={styles.organizationContainer}>
                                        <SelectInput
                                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                                            className={styles.input}
                                            faramElementName="providerOrganization"
                                            label={t('Provider Organization')}
                                            options={organizationList}
                                            keySelector={organizationKeySelector}
                                            labelSelector={organizationLabelSelector}
                                        />
                                        <ModalButton
                                            className={styles.button}
                                            modal={(
                                                <AddOrganizationModal
                                                    onOrganizationAdd={this.handleOrganizationAdd}
                                                />
                                            )}
                                            iconName="add"
                                            transparent
                                        />
                                    </div>
                                    <NumberInput
                                        faramElementName="amount"
                                        label={t('Amount')}
                                    />
                                    <SelectInput
                                        placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                                        faramElementName="type"
                                        label={t('Type')}
                                        options={typeList}
                                        keySelector={typeKeySelector}
                                        labelSelector={typeLabelSelector}
                                    />
                                    <SelectInput
                                        placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                                        faramElementName="event"
                                        label={t('Event')}
                                        options={eventList}
                                        keySelector={eventKeySelector}
                                        labelSelector={eventLabelSelector}
                                    />
                                    <SelectInput
                                        placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                                        faramElementName="fiscalYear"
                                        label={t('Fiscal Year')}
                                        options={fiscalYearOptions}
                                        keySelector={fiscalYearKeySelector}
                                        labelSelector={fiscalYearLabelSelector}
                                    />
                                    <DateInput
                                        faramElementName="date"
                                        label={t('Date')}
                                        language={language}
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <DangerButton onClick={closeModal}>
                                        {t('Close')}
                                    </DangerButton>
                                    <PrimaryButton
                                        type="submit"
                                        pending={addReliefPending}
                                        disabled={pristine || pending}
                                    >
                                        {t('Save')}
                                    </PrimaryButton>
                                </ModalFooter>
                            </Faram>
                        )
                    }
                </Translation>

            </Modal>
        );
    }
}


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createRequestClient(requestOptions),
)(AddFlowForm);
