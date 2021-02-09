import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import Faram, {
    requiredCondition,
    lengthGreaterThanCondition,
} from '@togglecorp/faram';

import DangerButton from '#rsca/Button/DangerButton';
import Icon from '#rscg/Icon';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
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
    setFaramErrors?: (error: object) => void;
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
        onSuccess: ({ response, props }) => {
            const {
                setAuth,
                setUserDetail,
            } = props;

            const authState = getAuthState();
            setAuth(authState);
            setUserDetail(response as User);

            if (props.closeModal) {
                props.closeModal();
            }

            window.location.reload();
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
                console.warn('failure', error);
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
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
        const {
            requests: {
                loginRequest,
            },
        } = this.props;

        loginRequest.do({
            username: faramValues.username,
            password: faramValues.password,
            setFaramErrors: this.handleFaramValidationFailure,
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
            className,
            closeModal,
            requests: {
                loginRequest: {
                    pending,
                },
            },
        } = this.props;

        return (
            <Modal
                className={_cs(styles.loginModal, className)}
                // onClose={closeModal}
            >
                <Faram
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={Login.schema}
                    value={faramValues}
                    error={faramErrors}
                    disabled={pending}
                >
                    <ModalHeader
                        className={styles.header}
                        title="Login"
                        rightComponent={(
                            <DangerButton
                                transparent
                                iconName="close"
                                onClick={closeModal}
                                title="Close Modal"
                            />
                        )}
                    />
                    <ModalBody className={styles.body}>
                        <NonFieldErrors faramElement />
                        <TextInput
                            className={styles.input}
                            faramElementName="username"
                            label="Username"
                            placeholder="Username"
                            autoFocus
                        />
                        <TextInput
                            className={styles.input}
                            faramElementName="password"
                            label="Password"
                            placeholder="Password"
                            type="password"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <DangerButton onClick={closeModal}>
                            Close
                        </DangerButton>
                        <PrimaryButton
                            type="submit"
                            pending={pending}
                        >
                            Login
                        </PrimaryButton>
                    </ModalFooter>
                </Faram>
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
