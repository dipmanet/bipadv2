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

interface FaramValues {
    belowPoverty?: number;
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
        onSuccess: ({ response }) => {
            console.warn('response', response);
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
            onUpdate,
        } = this.props;

        const {
            belowPoverty: id,
        } = faramValues;

        const selected = belowPovertyOptions
            .find(v => v.id === id);

        const belowPoverty = selected ? selected.value : null;

        addFamilyLossRequest.do({
            body: { ...faramValues, belowPoverty },
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
            faramValues,
            faramErrors,
            pristine,
        } = this.state;

        return (
            <Faram
                onChange={this.handleFaramChange}
                onValidationFailure={this.handleFaramValidationFailure}
                onValidationSuccess={this.handleFaramValidationSuccess}
                schema={AddFamilyLoss.schema}
                value={faramValues}
                error={faramErrors}
            >
                <TextInput
                    faramElementName="ownerName"
                    label="Owner Name"
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

export default createRequestClient(requests)(AddFamilyLoss);
