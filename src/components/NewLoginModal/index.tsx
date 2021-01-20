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
                console.warn('failure', error);
                params.setFaramErrors({
                    $internal: ['Incorrect Username or Password'],
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setFaramErrors) {
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
            console.log(response, props);
            params.handleThankYouPage('thankyouPage');
            params.handlePending(false);
        },
        onFailure: ({ error, params }) => {
            console.log(error);
            if (params && params.setFaramErrors) {
                // TODO: handle error
                console.warn('failure', error);
                params.setFaramErrors({
                    $internal: ['Incorrect Username or Password'],
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setFaramErrors) {
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
        extras: { hasFile: true },
    },
    forgotPasswordRequest: {
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
            console.log(response, props);
            params.handleThankYouPage('thankyouPage');
            params.handlePending(false);
        },
        onFailure: ({ error, params }) => {
            console.log(error);
            if (params && params.setFaramErrors) {
                // TODO: handle error
                console.warn('failure', error);
                params.setFaramErrors({
                    $internal: ['Incorrect Username or Password'],
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setFaramErrors) {
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
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
        onSuccess: ({ response, props, params }) => {
            if (props.closeModal) {
                props.closeModal();
            }
            params.handlePending(false);
            window.location.reload();
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
                console.warn('failure', error);
                params.setFaramErrors({
                    $internal: ['Some problem occured'],
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setFaramErrors) {
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
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
            municipalityId: undefined,
            districtId: undefined,
            provinceId: undefined,
            file: undefined,
            pending: false,
            userEmail: '',

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
        loginRequest.do({
            password: faramValues.password,
            username: faramValues.username,
            setFaramErrors: this.handleFaramValidationFailure,
            updatePage: this.updatePage,
            handlePending: this.handlePending,
        });
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
    }

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
        });
    }

    private submitNewPassword = (newpassword: string) => {
        const { requests: { newPasswordSetRequest } } = this.props;
        newPasswordSetRequest.do({
            handlePending: this.handlePending,
            newpassword,
        });
    };

    private submitForgot = (emailForgot: string) => {
        this.handlePending(true);
        const { requests: { forgotPassword } } = this.props;
        forgotPassword.do({
            handlePending: this.handlePending,
            emailForgot,
        });
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
