import React from 'react';
import { compose } from 'redux';
import { _cs } from '@togglecorp/fujs';
import Faram, {
    requiredCondition,
} from '@togglecorp/faram';

import { Translation } from 'react-i18next';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import LoadingAnimation from '#rscv/LoadingAnimation';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import NumberInput from '#rsci/NumberInput';
import TextArea from '#rsci/TextArea';
import NonFieldErrors from '#rsci/NonFieldErrors';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import styles from './styles.scss';

interface Tabs {
    general: string;
    loss: string;
    peopleLoss: string;
    familyLoss: string;
    livestockLoss: string;
}
interface Views {
    general: {};
    loss: {};
    peopleLoss: {};
    familyLoss: {};
    livestockLoss: {};
}
interface Params {
    body?: object;
    onLossGet?: (loss: object) => void;
}

interface OwnProps {
    closeModal?: () => void;
    onUpdate?: () => void;
    className?: string;
    lossServerId?: number;
    incidentServerId?: number;
    onLossChange?: (loss: object, incident?: object) => void;
    onIncidentChange?: (incident: object) => void;
}

interface FaramValues {
    description?: string;
    estimatedLoss?: number;
}

interface FaramErrors {
}

interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
}

type ReduxProps = OwnProps;
type Props = NewProps<ReduxProps, Params>;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    lossGetRequest: {
        url: ({ props: { lossServerId } }) => `/loss/${lossServerId}/`,
        method: methods.GET,
        onMount: ({ props: { lossServerId } }) => !!lossServerId,
        onSuccess: ({ response, params: { onLossGet } }) => {
            onLossGet(response);
        },
    },
    lossEditRequest: {
        url: ({ props: { lossServerId } }) => (lossServerId ? `/loss/${lossServerId}/` : '/loss/'),
        method: ({ props: { lossServerId } }) => (lossServerId ? methods.PATCH : methods.POST),
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ props, response }) => {
            const {
                onLossChange,
                requests: {
                    incidentPatchRequest,
                },
                lossServerId,
            } = props;

            if (!lossServerId) {
                incidentPatchRequest.do({
                    loss: response,
                    body: {
                        loss: response.id,
                    },
                });
            }
        },
    },
    incidentPatchRequest: {
        url: ({ props: { incidentServerId } }) => `/incident/${incidentServerId}/`,
        method: methods.PATCH,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({
            props,
            params: { loss },
            response: incidentResponse,
        }) => {
            const {
                onLossChange,
            } = props;

            onLossChange(loss, incidentResponse);
        },
    },
};

class AddLoss extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const {
            requests: {
                lossGetRequest,
            },
        } = this.props;

        lossGetRequest.setDefaultParams({
            onLossGet: this.handleLossGet,
        });

        this.state = {
            faramValues: {},
            faramErrors: {},
            pristine: true,
        };
    }

    private static schema = {
        fields: {
            description: [requiredCondition],
            estimatedLoss: [],
        },
    };

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
            pristine: true,
        });
    }

    private handleFaramValidationSuccess = (faramValues: FaramValues) => {
        const {
            requests: {
                lossEditRequest,
            },
            incidentServerId,
        } = this.props;

        lossEditRequest.do({
            body: {
                incident: incidentServerId,
                ...faramValues,
            },
        });

        this.setState({ pristine: true });
    }

    private handleLossGet = (loss: FaramValues) => {
        this.setState({
            faramValues: {
                estimatedLoss: loss.estimatedLoss,
                description: loss.description,
            },
        });
    }

    public render() {
        const {
            className,
            requests: {
                lossEditRequest: {
                    pending: lossEditPending,
                },
                lossGetRequest: {
                    pending: lossGetPending,
                },
                incidentPatchRequest: {
                    pending: incidentPending,
                },
            },
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
        } = this.state;

        const pending = lossEditPending || lossGetPending;

        return (
            <Translation>
                {
                    t => (
                        <Faram
                            className={_cs(className, styles.lossForm)}
                            onChange={this.handleFaramChange}
                            onValidationFailure={this.handleFaramValidationFailure}
                            onValidationSuccess={this.handleFaramValidationSuccess}
                            schema={AddLoss.schema}
                            value={faramValues}
                            error={faramErrors}
                        >
                            {pending && <LoadingAnimation />}
                            <ModalBody className={styles.body}>
                                <NonFieldErrors faramElement />
                                <TextArea
                                    faramElementName="description"
                                    label={t('Description')}
                                    autoFocus
                                />
                                <NumberInput
                                    faramElementName="estimatedLoss"
                                    label={t('Estimated loss')}
                                />
                            </ModalBody>
                            <ModalFooter className={styles.footer}>
                                <PrimaryButton
                                    type="submit"
                                    pending={lossEditPending || incidentPending}
                                    disabled={pristine}
                                >
                                    {t('Save')}
                                </PrimaryButton>
                            </ModalFooter>
                        </Faram>
                    )
                }
            </Translation>

        );
    }
}

export default compose(createRequestClient(requests))(AddLoss);
