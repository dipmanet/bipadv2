import React from 'react';
import Redux, {
    compose,
} from 'redux';
import { connect } from 'react-redux';
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
    setAgricultureLossTypeListAction,
} from '#actionCreators';

import {
    agricultureLossStatusListSelector,
    agricultureLossTypeListSelector,
} from '#selectors';

import { AppState } from '#store/types';
import {
    Status,
    AgricultureLossType,
    Field,
} from '#store/atom/page/types';

import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';
import NumberInput from '#rsci/NumberInput';
import Checkbox from '#rsci/Checkbox';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import Cloak from '#components/Cloak';

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
    agricultureLossStatusList: Status[];
    agricultureLossTypeList: AgricultureLossType[];
}

interface PropsFromDispatch {
    setAgricultureLossTypeList: typeof setAgricultureLossTypeListAction;
}
interface Params {
    body: object;
    onSuccess: () => void;
    onFailure: (faramErrors: object) => void;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
}

const mapStateToProps = (state: AppState): PropsFromState => ({
    agricultureLossStatusList: agricultureLossStatusListSelector(state),
    agricultureLossTypeList: agricultureLossTypeListSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setAgricultureLossTypeList: params => dispatch(setAgricultureLossTypeListAction(params)),
});

const keySelector = (d: Field) => d.id;
const labelSelector = (d: Field) => d.title;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    // TODO: change this when actual api is available
    agricultureLossTypeGet: {
        url: '/agriculture-type/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, props: { setAgricultureLossTypeList } }) => {
            interface Response { results: AgricultureLossType[] }
            const { results: agricultureLossTypeList = [] } = response as Response;
            setAgricultureLossTypeList({ agricultureLossTypeList });
        },
    },
    addAgricultureLossRequest: {
        url: '/loss-agriculture/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ params, response }) => {
            console.warn('response', response);
        },
        onFailure: ({ error, params: { onFailure } = { onFailure: undefined } }) => {
            if (onFailure) {
                onFailure((error as { faramErrors: object }).faramErrors);
            }
        },
    },
};

class AddAgricultureLoss extends React.PureComponent<Props, State> {
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
            status: [requiredCondition],
            beneficiaryOwner: [],
            beneficiaryCount: [],
            economicLoss: [],
            verified: [],
            verificationMessage: [],
            type: [requiredCondition],
            quantity: [requiredCondition],
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
                addAgricultureLossRequest,
            },
            onUpdate,
        } = this.props;

        addAgricultureLossRequest.do({
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
            agricultureLossStatusList,
            agricultureLossTypeList,
        } = this.props;

        const {
            pristine,
            faramValues,
            faramErrors,
        } = this.state;

        return (
            <Faram
                onChange={this.handleFaramChange}
                onValidationFailure={this.handleFaramValidationFailure}
                onValidationSuccess={this.handleFaramValidationSuccess}
                schema={AddAgricultureLoss.schema}
                value={faramValues}
                error={faramErrors}
            >
                <SelectInput
                    faramElementName="status"
                    label="Status"
                    options={agricultureLossStatusList}
                    keySelector={labelSelector}
                    labelSelector={labelSelector}
                />
                <TextInput
                    faramElementName="beneficiaryOwner"
                    label="Beneficiary Owner"
                />
                <NumberInput
                    faramElementName="beneficiaryCount"
                    label="Beneficiary Count"
                />
                <NumberInput
                    faramElementName="quantity"
                    label="Quantity"
                />
                <NumberInput
                    faramElementName="economicLoss"
                    label="Economic Loss"
                />
                <Cloak hiddenIf={p => !p.verify_agriculture}>
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
                <SelectInput
                    faramElementName="type"
                    label="Type"
                    options={agricultureLossTypeList}
                    keySelector={keySelector}
                    labelSelector={labelSelector}
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

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createRequestClient(requests),
)(AddAgricultureLoss);
