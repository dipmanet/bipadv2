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
    setCountryListAction,
} from '#actionCreators';

import {
    countryListSelector,
    peopleLossStatusListSelector,
    genderListSelector,
} from '#selectors';

import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';

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
    countryList: PageType.Country[];
    peopleLossStatusList: PageType.Status[];
    genderList: PageType.Gender[];
}

interface PropsFromDispatch {
    setCountryList: typeof setCountryListAction;
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
    countryList: countryListSelector(state),
    peopleLossStatusList: peopleLossStatusListSelector(state),
    genderList: genderListSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setCountryList: params => dispatch(setCountryListAction(params)),
});

const keySelector = (d: PageType.Field) => d.id;
const labelSelector = (d: PageType.Field) => d.title;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    countryGetRequest: {
        url: '/country/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, props: { setCountryList } }) => {
            interface Response { results: PageType.Country[] }
            const { results: countryList = [] } = response as Response;
            setCountryList({ countryList });
        },
    },
    addPeopleLossRequest: {
        url: '/loss-people/',
        method: methods.POST,
        body: ({ params: { body } = { body: { } } }) => body,
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

class AddPeopleLoss extends React.PureComponent<Props, State> {
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
            count: [requiredCondition],
            name: [],
            age: [],
            gender: [],
            belowPoverty: [],
            verified: [],
            verificationMessage: [],
            nationality: [],
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
        const { requests: { addPeopleLossRequest }, onUpdate } = this.props;

        addPeopleLossRequest.do({
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
            genderList,
            countryList,
            peopleLossStatusList,
            className,
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
                schema={AddPeopleLoss.schema}
                value={faramValues}
                error={faramErrors}
            >
                <SelectInput
                    faramElementName="status"
                    label="Status"
                    options={peopleLossStatusList}
                    keySelector={labelSelector}
                    labelSelector={labelSelector}
                />
                <TextInput
                    faramElementName="name"
                    label="Name"
                />
                <NumberInput
                    faramElementName="age"
                    label="Age"
                />
                <SelectInput
                    faramElementName="gender"
                    label="Gender"
                    options={genderList}
                    keySelector={labelSelector}
                    labelSelector={labelSelector}
                />
                <Checkbox
                    faramElementName="belowPoverty"
                    label="Below Poverty"
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
                <SelectInput
                    faramElementName="nationality"
                    label="Nationality"
                    options={countryList}
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
)(AddPeopleLoss);
