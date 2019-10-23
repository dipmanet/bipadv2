import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import Faram, {
    requiredCondition,
    lengthGreaterThanCondition,
} from '@togglecorp/faram';

import PrimaryButton from '#rsca/Button/PrimaryButton';
import NonFieldErrors from '#rsci/NonFieldErrors';
import TextInput from '#rsci/TextInput';

import { User } from '#store/atom/auth/types';

import {
    setAuthAction,
    setUserDetailAction,
} from '#actionCreators';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import { getAuthState } from '#utils/session';

import styles from './styles.scss';

interface FaramValues {
    username?: string;
    password?: string;
}

interface State {
    faramErrors: object;
    faramValues: FaramValues;
}

interface Params {
    username?: string;
    password?: string;
}

interface OwnProps {
}

interface PropsFromDispatch {
    setAuth: typeof setAuthAction;
    setUserDetail: typeof setUserDetailAction;
}

type ReduxProps = OwnProps & PropsFromDispatch;

type Props = NewProps<ReduxProps, Params>;

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setAuth: params => dispatch(setAuthAction(params)),
    setUserDetail: params => dispatch(setUserDetailAction(params)),
});

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    loginRequest: {
        url: '/auth/login/',
        method: methods.POST,
        body: ({ params }) => {
            if (!params) {
                return {};
            }
            return {
                username: params.username,
                password: params.password,
            };
        },
        onSuccess: ({ response, props }) => {
            const {
                setAuth,
                setUserDetail,
            } = props;

            const authState = getAuthState();
            setAuth(authState);

            setUserDetail(response as User);
        },
        onFailure: ({ error }) => {
            // TODO: handle error
            console.warn('failure', error);
        },
        onFatal: () => {
            console.warn('fatal');
        },
    },
};

class Login extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            faramErrors: {},
            faramValues: {},
        };
    }

    private handleFaramChange = (faramValues: FaramValues, faramErrors: object) => {
        this.setState({
            faramValues,
            faramErrors,
        });
    };

    private handleFaramValidationFailure = (faramErrors: object) => {
        this.setState({ faramErrors });
    };

    private handleFaramValidationSuccess = (faramValues: FaramValues) => {
        console.warn(faramValues);
        const {
            requests: {
                loginRequest,
            },
        } = this.props;

        loginRequest.do({
            username: faramValues.username,
            password: faramValues.password,
        });
    };

    private static schema = {
        fields: {
            username: [
                requiredCondition,
            ],
            password: [
                requiredCondition,
                lengthGreaterThanCondition(4),
            ],
        },
    };

    public render() {
        const {
            faramErrors,
            faramValues,
        } = this.state;
        const {
            requests: {
                loginRequest: {
                    pending,
                },
            },
        } = this.props;

        return (
            <div className={styles.form}>
                <h2> Login </h2>
                <Faram
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={Login.schema}
                    value={faramValues}
                    error={faramErrors}
                    disabled={pending}
                >
                    <NonFieldErrors faramElement />
                    <TextInput
                        faramElementName="username"
                        label="Username"
                        placeholder="shyam"
                        autoFocus
                    />
                    <TextInput
                        faramElementName="password"
                        label="Password"
                        placeholder="********"
                        type="password"
                    />
                    <div>
                        <PrimaryButton
                            type="submit"
                            pending={pending}
                        >
                            Login
                        </PrimaryButton>
                    </div>
                </Faram>
            </div>
        );
    }
}

export default connect(undefined, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requestOptions)(
            Login,
        ),
    ),
);
