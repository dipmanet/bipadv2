import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Faram, {
    requiredCondition,
} from '@togglecorp/faram';

import {
    createRequestClient,
    ClientAttributes,
    NewProps,
    methods,
} from '#request';

import { MultiResponse } from '#store/atom/response/types';
import {
    Resource,
    Status,
    Field,
    InfrastructureType,
} from '#store/atom/page/types';

import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';
import NumberInput from '#rsci/NumberInput';
import Checkbox from '#rsci/Checkbox';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import styles from './styles.scss';

interface FaramValues {
    serviceDisrupted?: number;
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

interface InfrastructureUnit extends Field {}

interface Params {
    body?: object;
    onSuccess?: () => void;
    setResources?: (resourceList: Resource[]) => void;
    setInfrastructureUnits?: (infrastructureUnitList: InfrastructureUnit[]) => void;
    setInfrastructureTypes?: (infrastructureTypeList: InfrastructureType[]) => void;
    onFailure?: (faramErrors: object) => void;
}

interface State {
    infrastructureTypeList: InfrastructureType[];
    infrastructureUnitList: InfrastructureUnit[];
    resourceList: Resource[];
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
}

interface ServiceDisruptedOption extends Field {
    value: boolean;
}

const serviceDisruptedOptions: ServiceDisruptedOption[] = [
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

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const keySelector = (d: Field) => d.id;
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
    infrastructureTypeGetRequest: {
        url: '/infrastructure-type/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({
            response,
            params: { setInfrastructureTypes } = { setInfrastructureTypes: undefined },
        }) => {
            const { results } = response as MultiResponse<InfrastructureType>;
            if (setInfrastructureTypes) {
                setInfrastructureTypes(results);
            }
        },
    },
    infrastructureUnitGetRequest: {
        url: '/infrastructure-unit/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({
            response,
            params: { setInfrastructureUnits } = { setInfrastructureUnits: undefined },
        }) => {
            const { results } = response as MultiResponse<InfrastructureUnit>;
            if (setInfrastructureUnits) {
                setInfrastructureUnits(results);
            }
        },
    },
    addInfrastructureLossRequest: {
        url: '/loss-infrastructure/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        /*
        onSuccess: ({ response }) => {
            console.warn('response', response);
        },
        */
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
            infrastructureTypeList: [],
            infrastructureUnitList: [],
            resourceList: [],
            faramValues: {},
            faramErrors: {},
            pristine: true,
        };

        const {
            requests: {
                resourceRequest,
                infrastructureTypeGetRequest,
                infrastructureUnitGetRequest,
            },
        } = this.props;

        infrastructureTypeGetRequest.setDefaultParams({
            setInfrastructureTypes: (infrastructureTypeList: InfrastructureType[]) => {
                this.setState({
                    infrastructureTypeList,
                });
            },
        });

        infrastructureUnitGetRequest.setDefaultParams({
            setInfrastructureUnits: (infrastructureUnitList: InfrastructureUnit[]) => {
                this.setState({
                    infrastructureUnitList,
                });
            },
        });

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
            title: [],
            status: [requiredCondition],
            type: [requiredCondition],
            resource: [],
            equipmentValue: [],
            infrastructureValue: [],
            beneficiaryOwner: [],
            serviceDisrupted: [],
            count: [requiredCondition],
            economicLoss: [],
            verified: [],
            verificationMessage: [],
            unit: [],
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
        // console.warn('handleFaramValidationSuccess', faramValues);
        const {
            requests: {
                addInfrastructureLossRequest,
            },
            onUpdate,
        } = this.props;

        const {
            serviceDisrupted: id,
        } = faramValues;

        const selected = serviceDisruptedOptions.find(v => v.id === id);

        const serviceDisrupted = selected ? selected.value : null;

        addInfrastructureLossRequest.do({
            body: { ...faramValues, serviceDisrupted },
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
            infrastructureTypeList,
            infrastructureUnitList,
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
                <SelectInput
                    faramElementName="type"
                    label="Type"
                    options={infrastructureTypeList}
                    keySelector={keySelector}
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
                <SelectInput
                    faramElementName="serviceDisrupted"
                    label="Service Disrupted"
                    options={serviceDisruptedOptions}
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
                <SelectInput
                    faramElementName="unit"
                    label="Unit"
                    options={infrastructureUnitList}
                    keySelector={keySelector}
                    labelSelector={labelSelector}
                />
                <div>
                    <PrimaryButton
                        type="submit"
                        disabled={pristine}
                    >
                        Save
                    </PrimaryButton>
                </div>
            </Faram>
        );
    }
}

export default createRequestClient(requests)(AddInfrastructureLoss);
