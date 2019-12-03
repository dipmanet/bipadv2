import React from 'react';
import { _cs } from '@togglecorp/fujs';

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

import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';
import NumberInput from '#rsci/NumberInput';
import Checkbox from '#rsci/Checkbox';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import styles from './styles.scss';
import { MultiResponse } from '#store/atom/response/types';

interface FaramValues {
}

interface FaramErrors {
}

interface OwnProps {
    className?: string;
    onUpdate?: () => void;
}

interface PropsFromState {
}

interface PropsFromDispatch {
}

interface Params {
    body?: object;
    onSuccess?: () => void;
    onFailure?: (faramErrors: object) => void;
    setLivestockTypes?: (livestockTypes: LivestockType[]) => void;
}

interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
    livestockTypes: LivestockType[];
}

interface LivestockType extends Field{
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const labelSelector = (d: Field) => d.title;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    addLivestockLossRequest: {
        url: '/loss-livestock/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ response }) => {
            console.warn('response', response);
        },
        onFailure: ({ error, params: { onFailure } = { onFailure: undefined } }) => {
            if (onFailure) {
                onFailure((error as { faramErrors: object }).faramErrors);
            }
        },
    },
    livestockTypeGetRequest: {
        url: '/livestock-type/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({
            response,
            params: { setLivestockTypes } = { setLivestockType: undefined },
        }) => {
            const { results } = response as MultiResponse<LivestockType>;
            if (setLivestockTypes) {
                setLivestockTypes(results);
            }
        },
    },
};
const livestockLossStatus: Status [] = [
    {
        id: 1,
        title: 'destroyed',
    },
    {
        id: 1,
        title: 'affected',
    },
];

class AddLivestockLoss extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            livestockTypes: [],
            faramValues: {},
            faramErrors: {},
            pristine: true,
        };

        const {
            requests: {
                livestockTypeGetRequest,
            },
        } = this.props;

        livestockTypeGetRequest.setDefaultParams({
            setLivestockTypes: (livestockTypes: LivestockType[]) => {
                this.setState({
                    livestockTypes,
                });
            },
        });
    }

    private static schema = {
        fields: {
            title: [],
            type: [],
            status: [requiredCondition],
            count: [requiredCondition],
            economicLoss: [],
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
                addLivestockLossRequest,
            },
            onUpdate,
        } = this.props;

        addLivestockLossRequest.do({
            body: faramValues,
            onSuccess: () => {
                if (onUpdate) {
                    onUpdate();
                }
            },
            onFailure: (faramErrors: object) => {
                this.setState({ faramErrors });
            },
        });
    }

    public render() {
        const {
            className,
        } = this.props;

        const {
            livestockTypes,
            faramValues,
            faramErrors,
            pristine,
        } = this.state;

        return (
            <Faram
                onChange={this.handleFaramChange}
                onValidationFailure={this.handleFaramValidationFailure}
                onValidationSuccess={this.handleFaramValidationSuccess}
                schema={AddLivestockLoss.schema}
                value={faramValues}
                error={faramErrors}
            >
                <TextInput
                    faramElementName="title"
                    label="Title"
                />
                <SelectInput
                    faramElementName="type"
                    label="Type"
                    options={livestockTypes}
                    keySelector={labelSelector}
                    labelSelector={labelSelector}
                />
                <SelectInput
                    faramElementName="status"
                    label="Status"
                    options={livestockLossStatus}
                    keySelector={labelSelector}
                    labelSelector={labelSelector}
                />
                <NumberInput
                    faramElementName="count"
                    label="Count"
                />
                <NumberInput
                    faramElementName="economicLoss"
                    label="Economic Loss"
                />
                <Checkbox
                    faramElementName="verified"
                    label="Verified"
                />
                <TextInput
                    faramElementName="verificationMessage"
                    label="Verification Message"
                />
                <div>
                    <PrimaryButton
                        type="submit"
                        disabled={pristine}
                    >
                        Submit
                    </PrimaryButton>
                </div>
            </Faram>
        );
    }
}

export default createRequestClient(requests)(AddLivestockLoss);
