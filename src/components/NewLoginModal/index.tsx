import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import Faram, {
    requiredCondition,
    lengthGreaterThanCondition,
} from '@togglecorp/faram';
import { parseAsync } from '@babel/core';
import Icon from '#rscg/Icon';
import PasswordReq from './PasswordReq';
import DangerButton from '#rsca/Button/DangerButton';
import DetailsPage from './DetailsPage';
import DetailsFirstPage from './DetailsFirstPage';
import ThankYouPage from './ThankYouPage';
import ChangePassword from './ChangePassword';
import ForgotPassword from './ForgotPassword';
import UserFeedback from './UserFeedback';

import Modal from '#rscv/Modal';
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
import DetailsSecondPage from './DetailsSecondPage';
// import style from '#mapStyles/rasterStyle';

interface FaramValues {
    username?: string;
    password?: string;
}


interface State {
    faramErrors: object;
    faramValues: FaramValues;
    pageAction: string;
    fullName: string;
    designation: string;
    intCode: string;
    phone: number;
    email: string;
    municipalityId: number;
    districtId: number;
    provinceId: number;
    signupregion: SignupRegion;
    institution: string;
    serverErrorMsg: string;
}

interface SignupRegion {
    provinceId?: number;
    districtId?: number;
    municipalityId?: number;
    wardId?: number;
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
    storeUserName?: (value: string) => void;
    newpassword?: string;
    token?: string;
    handleResponseErrorMessage?: (value: string) => void;
    newPassword?: string;
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
        onSuccess: ({ response, props, params }) => {
            const {
                setAuth,
                setUserDetail,
            } = props;
            const { profile: { otpMode } } = response;
            if (params.newPassword) {
                params.storeUserName(response.username);
            }

            if (otpMode) {
                params.handlePending(false);
                params.updatePage('changePassword');
            } else {
                const authState = getAuthState();
                setAuth(authState);
                setUserDetail(response as User);

                if (props.closeModal) {
                    props.closeModal();
                }

                window.location.reload();
            }
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
                params.handlePending(false);
                console.warn('failure', error);
                params.setFaramErrors({
                    $internal: ['Incorrect Username or Password'],
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setFaramErrors) {
                params.handlePending(false);
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
    },
    signUpRequest: {
        url: '/password-request/',
        method: methods.POST,
        body: ({ params }) => {
            if (!params) {
                return {};
            }
            return {
                fullName: params.fullName,
                position: params.position,
                phoneNumber: params.phoneNumber,
                officialEmail: params.officialEmail,
                officialLetter: params.officialLetter,
                province: params.province,
                district: params.district,
                municipality: params.municipality,
            };
        },
        onSuccess: ({ response, props, params }) => {
            params.handleThankYouPage('thankyouPage');
            params.handlePending(false);
        },
        onFailure: ({ error, params }) => {
            params.handlePending(false);
            if (Object.keys(error).length > 0) {
                const errorDesc = error[Object.keys(error)[0]];
                params.handleResponseErrorMessage(errorDesc[Object.keys(errorDesc)[0]][0]);
            } else {
                params.handleResponseErrorMessage('Some problem occured, please try again.');
            }
        },
        onFatal: ({ params }) => {
            params.handlePending(false);
            console.log('No reply, server error');
            alert('Some problem occured, please contact IT support.');

            window.location.reload();
        },
        extras: { hasFile: true },
    },
    forgotPassword: {
        url: '/auth/forgot-password/',
        method: methods.POST,
        body: ({ params }) => {
            if (!params) {
                return {};
            }
            return {
                email: params.emailForgot,
            };
        },
        onSuccess: ({ props, params }) => {
            // if (props.closeModal) {
            //     props.closeModal();
            // }
            params.handlePending(false);
            params.handleUserFeedback('Success! Please check your email for password change link');
        },
        onFailure: ({ error, params }) => {
            if (params) {
                params.handlePending(false);
                if (Object.keys(error).length > 0) {
                    const errorDesc = error[Object.keys(error)[0]];
                    params.handleResponseErrorMessage(errorDesc[Object.keys(errorDesc)[0]][0]);
                } else {
                    params.handleResponseErrorMessage('Some problem occured, please try again.');
                }
            }
        },
        onFatal: ({ params }) => {
            params.handlePending(false);
            alert('Some problem occured, please contact IT support.');
            window.location.reload();
        },
    },
    newPasswordSetRequest: {
        url: '/auth/change-password/',
        method: methods.POST,
        body: ({ params }) => {
            if (!params) {
                return {};
            }
            if (params.token) {
                return {
                    password: params.newpassword,
                    token: params.token,
                };
            }
            return {
                password: params.newpassword,
                token: '',
            };
        },
        onSuccess: ({ params }) => {
            params.handlePending(false);
            params.handlePwdChangeSucces(params.username, params.newpassword);
            // params.handleLoginAgain(params.username, params.newpassword);
        },
        onFailure: ({ error, params }) => {
            params.handlePending(false);
            if (Object.keys(error).length > 0) {
                const errorDesc = error[Object.keys(error)[0]];
                params.handleResponseErrorMessage(errorDesc[Object.keys(errorDesc)[0]][0]);
            } else {
                params.handleResponseErrorMessage('Some problem occured, please try again.');
            }
        },
        onFatal: ({ params }) => {
            params.handlePending(false);
            alert('Some problem occured, please contact IT support.');
            window.location.reload();
        },
    },

};

class Login extends React.PureComponent<Props, State> {
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

    public constructor(props: Props) {
        super(props);

        this.state = {
            faramErrors: {},
            faramValues: {},
            pageAction: 'loginPage',
            fullName: '',
            designation: '',
            phone: undefined,
            email: '',
            municipalityId: null,
            districtId: null,
            provinceId: null,
            file: undefined,
            pending: false,
            userEmail: '',
            userName: '',
            serverErrorMsg: '',
            loginAgain: false,
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
        const {
            requests: {
                loginRequest,
            },
        } = this.props;
        this.handlePending(true);
        this.setState({ serverErrorMsg: '' });

        loginRequest.do({
            password: faramValues.password,
            username: faramValues.username,
            setFaramErrors: this.handleFaramValidationFailure,
            updatePage: this.updatePage,
            handlePending: this.handlePending,
            storeUserName: this.storeUser,
            newPassword: true,
        });
    };

    private storeUser = (value: string) => {
        this.setState({ userName: value });
    };

    private updatePage = (pageAction: string) => {
        this.setState({ pageAction });
    };

    private handleFullName = (fullName: string) => {
        this.setState({ fullName });
    };

    private handleDesignation = (designation: string) => {
        this.setState({ designation });
    };

    private handlePhone = (phone: number) => {
        this.setState({ phone });
    };

    private handleEmail = (value: string) => {
        this.setState({ email: value });
    };

    private signupRegion = (value: SignupRegion) => {
        this.setState({ municipalityId: value.municipalityId,
            districtId: value.districtId,
            provinceId: value.provinceId });
    };

    private uploadedLetter = (file: File) => {
        this.setState({ file });
    };

    private handleThankYouPage = (value: string) => {
        this.setState({ pageAction: value });
    };

    private handlePending = (pending: boolean) => {
        this.setState({ pending });
    };

    private handleUserEmail = (userEmail: string) => {
        this.setState(userEmail);
    };

    private handleForgotPassword = () => {
        this.setState({ pageAction: 'forgotPasswordPage' });
    };

    private handleLoginAgain = (username: string, password: string) => {
        const {
            requests: {
                loginRequest,
            },
        } = this.props;
        loginRequest.do({
            password,
            username,
            // newPassword: false,
        });
    };

    private handlePwdChangeSucces = (username: string, password: string) => {
        this.updatePage('userFeedback');
        if (this.state.loginAgain) {
            this.handleLoginAgain(username, password);
        }
    };

    private handlechangePasswordUserConfirm = (value: boolean) => {
        this.setState({ loginAgain: value });
    };

    private submit = () => {
        this.setState({ pending: true });
        const {
            fullName,
            designation,
            phone,
            email,
            municipalityId,
            districtId,
            provinceId,
            file,
            userEmail,
        } = this.state;
        const { requests: { signUpRequest } } = this.props;
        signUpRequest.do({
            fullName,
            position: designation,
            phoneNumber: phone,
            officialEmail: email,
            officialLetter: file,
            province: provinceId,
            district: districtId,
            municipality: municipalityId,
            handlePending: this.handlePending,
            handleThankYouPage: this.handleThankYouPage,
            handleResponseErrorMessage: this.handleResponseErrorMessage,
        });
    }

    private submitNewPassword = (newpassword: string) => {
        this.handlePending(true);
        this.setState({ serverErrorMsg: '' });

        const { requests: { newPasswordSetRequest } } = this.props;
        newPasswordSetRequest.do({
            handlePending: this.handlePending,
            newpassword,
            username: this.state.userName,
            handleLoginAgain: this.handleLoginAgain,
            handleResponseErrorMessage: this.handleResponseErrorMessage,
            handlePwdChangeSucces: this.handlePwdChangeSucces,
        });
    };

    private submitForgot = (emailForgot: string) => {
        this.handlePending(true);
        this.setState({ serverErrorMsg: '' });
        const { requests: { forgotPassword } } = this.props;
        forgotPassword.do({
            handlePending: this.handlePending,
            emailForgot,
            handleResponseErrorMessage: this.handleResponseErrorMessage,
            handleUserFeedback: this.handleUserFeedback,
        });
    };

    private handleResponseErrorMessage = (serverErrorMsg: string) => {
        this.setState({ serverErrorMsg });
    };

    private handleUserFeedback = (feedback: string) => {
        this.setState({ feedback });
        this.updatePage('userFeedback');
    };

    private handlePasswordChangeSuccess = () => {
        this.setState({ feedback: 'Password has been changed successfully! ' });
    };

    public render() {
        const {
            faramErrors,
            faramValues,
            pageAction,
            pending,
            phone,
            fullName,
            designation,
            email,
            municipalityId,
            districtId,
            provinceId,
            serverErrorMsg,
            feedback,
        } = this.state;
        const {
            className,
            closeModal,
            requests: {
                loginRequest: {
                    pending: pendingProp,
                },
            },
        } = this.props;

        let displayElement;
        if (pageAction === 'loginPage') {
            displayElement = (
                <Faram
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={Login.schema}
                    value={faramValues}
                    error={faramErrors}
                    disabled={pending}
                >
                    <div className={styles.mainLoginContainer}>
                        <div className={styles.signIn}>
                            <div className={styles.signinTitles}>
                                <h1>Welcome to BIPAD Portal</h1>
                                <p>
                                    An integrated and comprehensive DIMS platform to support
                                    disaster risk management through informed decision making.
                                </p>
                                <hr />
                            </div>

                            <div className={styles.formElements}>
                                <div className={styles.newLoginForm}>
                                    <div className={styles.inputContainer}>
                                        <Icon
                                            name="user"
                                            className={styles.inputIcon}
                                        />
                                        <TextInput
                                            className={styles.newinput}
                                            faramElementName="username"
                                            label="Username"
                                            placeholder="Username"
                                            autoFocus
                                            showLabel={false}

                                        />
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <Icon
                                            name="lock"
                                            className={styles.inputIcon}
                                        />
                                        <TextInput
                                            className={styles.newinput}
                                            faramElementName="password"
                                            label="Password"
                                            placeholder="Password"
                                            type="password"
                                            showLabel={false}

                                        />
                                    </div>
                                    <NonFieldErrors faramElement className={styles.errorField} />
                                    <button
                                        type="button"
                                        onClick={this.handleForgotPassword}
                                        className={styles.forgotPasswordRequestBtn}
                                    >
                                    Forgot Password
                                    </button>
                                    <hr className={styles.horzLine} />
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
                                <div className={styles.externalLink}>
                                    Other logins:
                                    <a
                                        className={styles.extlink}
                                        href={`${process.env.REACT_APP_PROJECT_SERVER_URL}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <div className={styles.linktexts}>
                                            <Icon
                                                className={styles.icon}
                                                name="externalLink"
                                            />
                                         MDSA
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className={styles.pwdRequestContainer}>
                            <div className={styles.closeBtn}>
                                <DangerButton className={styles.dangerbtn} onClick={closeModal}>
                                    <Icon
                                        name="times"
                                        className={styles.settingsBtn}
                                    />
                                </DangerButton>
                            </div>
                            <div className={styles.pwdRequest}>
                                <h1>Do not have an account?</h1>
                                <p>Click to request BIPAD login credential</p>
                                <DangerButton
                                    type="button"
                                    className={styles.pwdResetBtn}
                                    onClick={() => this.updatePage('tncPage')}
                                >
                                    PASSWORD REQUEST
                                </DangerButton>
                            </div>
                            <div className={styles.feedbackandtechsupport}>
                                <span>TECH SUPPORT</span>
                                <span>FEEDBACK </span>
                            </div>
                        </div>
                    </div>
                </Faram>
            );
        }
        if (pageAction === 'tncPage') {
            displayElement = (
                <PasswordReq
                    handleCancel={this.updatePage}
                    handleAgree={this.updatePage}
                    closeModal={closeModal}
                    pending={pending}
                />
            );
        }
        if (pageAction === 'detailsPage') {
            displayElement = (
                <DetailsPage
                    updatePage={this.updatePage}
                    closeModal={closeModal}
                    pending={pending}
                    handleFullName={this.handleFullName}
                    handleDesignation={this.handleDesignation}
                    handleIntCode={this.handleIntCode}
                    handlePhone={this.handlePhone}
                    handleEmail={this.handleEmail}
                    phoneprop={phone}
                    nameprop={fullName}
                    designationprop={designation}
                    emailprop={email}

                />
            );
        }
        if (pageAction === 'detailsFirstPage') {
            displayElement = (
                <DetailsFirstPage
                    updatePage={this.updatePage}
                    closeModal={closeModal}
                    signupRegion={this.signupRegion}
                    pending={pending}
                    municipality={municipalityId}
                    district={districtId}
                    province={provinceId}
                />
            );
        }
        if (pageAction === 'detailsSecondPage') {
            displayElement = (
                <DetailsSecondPage
                    updatePage={this.updatePage}
                    closeModal={closeModal}
                    pending={pending}
                    submit={this.submit}
                    uploadedLetter={this.uploadedLetter}
                    serverErrorMsg={serverErrorMsg}
                />
            );
        }
        if (pageAction === 'thankyouPage') {
            displayElement = (
                <ThankYouPage
                    closeModal={closeModal}
                    pending={pending}
                    updatePage={this.updatePage}
                />
            );
        }
        if (pageAction === 'changePassword') {
            displayElement = (
                <ChangePassword
                    closeModal={closeModal}
                    pending={pending}
                    updatePage={this.updatePage}
                    submitNewPassword={this.submitNewPassword}
                    serverErrorMsg={serverErrorMsg}
                />
            );
        }
        if (pageAction === 'forgotPasswordPage') {
            displayElement = (
                <ForgotPassword
                    closeModal={closeModal}
                    pending={pending}
                    updatePage={this.updatePage}
                    submitForgot={this.submitForgot}
                    serverErrorMsg={serverErrorMsg}
                />
            );
        }

        if (pageAction === 'userFeedback') {
            displayElement = (
                <UserFeedback
                    closeModal={closeModal}
                    feedback={feedback}
                    handlechangePasswordUserConfirm={this.handlechangePasswordUserConfirm}
                />
            );
        }

        return (
            <Modal
                className={_cs(styles.newloginModal, className)}
            >
                {displayElement}
            </Modal>
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
