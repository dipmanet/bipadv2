import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs, isFalsy } from '@togglecorp/fujs';
import Faram, {
    requiredCondition,
    lengthGreaterThanCondition,
} from '@togglecorp/faram';

import FocusTrap from 'react-focus-trap';
import Page from '#components/Page';
import Haze from '#rscv/Haze';
import Portal from '#rscv/Portal';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import NonFieldErrors from '#rsci/NonFieldErrors';
import TextInput from '#rsci/TextInput';
import Icon from '#rscg/Icon';

import { User } from '#store/atom/auth/types';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    setAuthAction,
    setUserDetailAction,
} from '#actionCreators';

import { getAuthState } from '#utils/session';


import styles from './styles.scss';
import Alert from '#rscv/Modal/Alert';

interface FaramValues {
    username?: string;
    password?: string;
}

interface State {
    password: string;
    token: string;
}

interface Params {
    username?: string;
    password?: string;
    setFaramErrors?: (error: object) => void;
    fullName?: string;
    position?: string;
    phoneNumber?: number;
    officialEmail?: string;
    officialLetter?: File;
    province?: number;
    district?: number;
    municipality?: number;
    file?: File;
    pending?: boolean;
    handlePending?: (value: boolean) => void;
    userEmail?: string;
    updatePage?: (value: string) => void;
    newpassword: string;
}

interface OwnProps {
    className?: string;
    closeModal?: () => void;
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
    newPasswordSetRequest: {
        url: '/auth/change-password/',
        method: methods.POST,
        body: ({ params }) => {
            if (!params) {
                return {};
            }
            return {
                password: params.password,
                token: params.token,
            };
        },
        onSuccess: () => {
            const query = window.location.href;
            const href = query.split('/set')[0];
            window.location.href = href;
        },
        onFailure: ({ error, params }) => {
            params.handlePending(false);

            alert('There was a problem, please try again or contact support. ');
            const query = window.location.href;
            const href = query.split('/set')[0];
            window.location.href = href;
        },
    },
    onFatal: ({ params }) => {
        if (params) {
            params.handlePending(false);
            alert('There was a problem, please try again or contact support. ');
            const query = window.location.href;
            const href = query.split('/set')[0];
            window.location.href = href;
        }
    },
};

class SetNewPassword extends React.PureComponent {
    private static schema = {
        fields: {
            password: [
                requiredCondition,
                lengthGreaterThanCondition(7),
            ],
            newpassword: [
                requiredCondition,
                lengthGreaterThanCondition(7),
            ],
        },
    };

    public constructor(props: Props) {
        super(props);

        this.state = {
            faramErrors: {},
            faramValues: {},
            token: '',
            pending: false,
            matchError: false,
            regexError: false,
            serverErrorMsg: '',

        };
    }

    public componentDidMount() {
        const query = window.location.href;
        const token = query.split('=')[1];
        this.setState({ token });
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

    private handlePending = (pending: boolean) => {
        this.setState({ pending });
    };

    private handleFaramValidationSuccess = (faramValues: FaramValues) => {
        const {
            requests: {
                newPasswordSetRequest,
            },
        } = this.props;
        const {
            token,
            faramValues: { password, newpassword },
        } = this.state;
        const passwordPattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
        const test = passwordPattern.test(password);
        if (password === newpassword) {
            this.setState({ matchError: false });
            if (test) {
                this.setState({ regexError: false });
                this.handlePending(true);
                newPasswordSetRequest.do({
                    password: faramValues.password,
                    token,
                    setFaramErrors: this.handleFaramValidationFailure,
                    handlePending: this.handlePending,

                });
            } else {
                this.setState({ regexError: true });
            }
        } else {
            this.setState({ matchError: true });
        }
    };

    public render() {
        const {
            faramErrors,
            faramValues,
            pending,
            matchError,
            regexError,
            serverErrorMsg,

        } = this.state;
        return (
            <Page
                leftContent={null}
                mainContentClassName={styles.fourHundredThree}
                mainContent={(
                    <>
                        <Portal>
                            <FocusTrap>
                                <Haze>
                                    <Faram
                                        onChange={this.handleFaramChange}
                                        onValidationFailure={this.handleFaramValidationFailure}
                                        onValidationSuccess={this.handleFaramValidationSuccess}
                                        schema={SetNewPassword.schema}
                                        value={faramValues}
                                        error={faramErrors}
                                        disabled={pending}
                                    >
                                        <div className={styles.formElements}>
                                            <h1>Please choose a new password</h1>
                                            <div className={styles.newLoginForm}>
                                                <div className={styles.inputContainer}>
                                                    <Icon
                                                        name="lock"
                                                        className={styles.inputIcon}
                                                    />
                                                    <TextInput
                                                        className={styles.newinput}
                                                        faramElementName="password"
                                                        label="Username"
                                                        placeholder="New Password"
                                                        autoFocus
                                                        showLabel={false}
                                                        type="password"

                                                    />

                                                </div>
                                                <div className={styles.inputContainer}>
                                                    <Icon
                                                        name="lock"
                                                        className={styles.inputIcon}
                                                    />
                                                    <TextInput
                                                        className={styles.newinput}
                                                        faramElementName="newpassword"
                                                        label="Password"
                                                        placeholder="Confirm New Password"
                                                        type="password"
                                                        showLabel={false}

                                                    />

                                                </div>
                                                {regexError ? (
                                                    <ul className={styles.matchError}>
                                                    Please make sure you include
                                                    atleast one of the following:
                                                        <li>
                                                            Minimum 8 characters
                                                        </li>
                                                        <li>
                                                            Atleast one of: !@#$%^&*
                                                        </li>
                                                        <li>
                                                            Atleast one Capital Letter [A-Z]
                                                        </li>
                                                        <li>
                                                            Atleast one number [0-9]
                                                        </li>

                                                    </ul>

                                                ) : ''
                                                }
                                                {matchError ? (
                                                    <p className={styles.matchError}>
                                                    Passwords do not match
                                                    </p>
                                                ) : ''}
                                                {serverErrorMsg
                                                    ? (
                                                        <span className={styles.matchErr}>
                                                            {serverErrorMsg}
                                                        </span>
                                                    ) : ''
                                                }
                                                <NonFieldErrors
                                                    faramElement
                                                    className={styles.errorField}
                                                />

                                            </div>
                                            <div className={styles.loginBtn}>
                                                <PrimaryButton
                                                    type="submit"
                                                    pending={pending}
                                                    className={styles.newsignIn}
                                                >
                                        Login
                                                </PrimaryButton>
                                            </div>
                                        </div>
                                    </Faram>
                                </Haze>
                            </FocusTrap>
                        </Portal>
                    </>
                )}
                hideMap
                hideFilter
            />
        );
    }
}

export default connect(undefined, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requestOptions)(
            SetNewPassword,
        ),
    ),
);
