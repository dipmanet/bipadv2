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

import { MultiResponse } from '#store/atom/response/types';
import {
    Resource,
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
    setResources?: (resourceList: Resource[]) => void;
    onFailure?: (faramErrors: object) => void;
}

interface State {
    resourceList: Resource[];
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const labelSelector = (d: Field) => d.title;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    resourceRequest: {
        url: '/resource/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params: { setResources } = { setResources: undefined } }) => {
            const { results } = response as MultiResponse<Resource>;
            if (setResources) {
                setResources(results);
            }
        },
    },
    addInfrastructureLossRequest: {
        url: '/loss-infrastructure/',
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

const infrastructureLossStatusList: Status [] = [
    {
        id: 1,
        title: 'destroyed',
    },
    {
        id: 1,
        title: 'affected',
    },
];


class AddInfrastructureLoss extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            resourceList: [],
            faramValues: {},
            faramErrors: {},
            pristine: true,
        };

        const {
            requests: {
                resourceRequest,
            },
        } = this.props;

        resourceRequest.setDefaultParams({
            setResources: (resourceList: Resource[]) => {
                this.setState({
                    resourceList,
                });
            },
        });
    }

    private static schema = {
        fields: {
            status: [requiredCondition],
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
                addInfrastructureLossRequest,
            },
            onUpdate,
        } = this.props;

        addInfrastructureLossRequest.do({
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
            resourceList,
            pristine,
            faramValues,
            faramErrors,
        } = this.state;

        return (
            <Faram
                onChange={this.handleFaramChange}
                onValidationFailure={this.handleFaramValidationFailure}
                onValidationSuccess={this.handleFaramValidationSuccess}
                schema={AddInfrastructureLoss.schema}
                value={faramValues}
                error={faramErrors}
            >
                <TextInput
                    faramElementName="title"
                    label="Title"
                />
                <SelectInput
                    faramElementName="status"
                    label="Status"
                    options={infrastructureLossStatusList}
                    keySelector={labelSelector}
                    labelSelector={labelSelector}
                />
                <SelectInput
                    faramElementName="resource"
                    label="Resource"
                    options={resourceList}
                    keySelector={labelSelector}
                    labelSelector={labelSelector}
                />
                <NumberInput
                    faramElementName="equipmentValue"
                    label="Equipment Value"
                />
                <NumberInput
                    faramElementName="infrastructureValue"
                    label="Infrastructure Value"
                />
                <TextInput
                    faramElementName="beneficiaryOwner"
                    label="Beneficiary Owner"
                />
                <NumberInput
                    faramElementName="beneficiaryCount"
                    label="Beneficiary Count"
                />
                <Checkbox
                    faramElementName="serviceDisrupted"
                    label="Service Disrupted"
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
                <SelectInput
                    faramElementName="unit"
                    label="Unit"
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

export default createRequestClient(requests)(AddInfrastructureLoss);
