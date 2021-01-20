import React, { useState } from 'react';
import Icon from '#rscg/Icon';

import DangerButton from '#rsca/Button/DangerButton';

import PrimaryButton from '#rsca/Button/PrimaryButton';

import {
    setAuthAction,
    setUserDetailAction,
} from '#actionCreators';

import {
    NewProps,
} from '#request';
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
    pending?: boolean;
    handleCancel: (loginPage: string) => void;
    handleAgree: (detailsPage: string) => void;
}

interface PropsFromDispatch {
    setAuth: typeof setAuthAction;
    setUserDetail: typeof setUserDetailAction;
}

type ReduxProps = OwnProps & PropsFromDispatch;

type Props = NewProps<ReduxProps, Params>;

const ChangePassword = (props: Props) => {
    const [newPassword, setNewPassword] = useState('');
    const [newConfirm, setNewConfirm] = useState('');
    const [regexError, setRegexError] = useState(false);
    const [matchError, setMatchError] = useState(false);

    const { pending,
        closeModal,
        handleCancel,
        handleAgree,
        submitNewPassword } = props;

    const handleCancelBtn = () => handleCancel('loginPage');

    const handleAgreeBtn = () => {
        const passwordPattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
        const test = passwordPattern.test(newPassword);
        if (test) {
            setRegexError(false);
        } else {
            setRegexError(true);
        }
        if (newPassword === newConfirm) {
            setMatchError(false);
            if (test) {
                setRegexError(false);
                submitNewPassword(newPassword);
            } else {
                setRegexError(true);
            }
        } else {
            setMatchError(true);
        }
    };

    const handlePasswordChange = (password: string) => {
        setNewPassword(password.target.value);
    };


    const handleConfirmPasswordChange = (confirmedPassword: string) => {
        setNewConfirm(confirmedPassword.target.value);
    };

    return (
        <div className={styles.mainPwdReqContainer}>
            <div className={styles.passwordConfirmForm}>
                <h2>Please choose a new password</h2>
                <div className={styles.inputContainer}>
                    <input
                        type="password"
                        className={styles.inputElement}
                        placeholder="New Password"
                        onChange={handlePasswordChange}
                        // value={newPassword}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <input
                        type="password"
                        className={styles.inputElement}
                        placeholder="Confirm New Password"
                        onChange={handleConfirmPasswordChange}
                        // value={newConfirm}
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
            </div>

            <div className={styles.cancelAgreeBtns}>
                <PrimaryButton
                    type="button"
                    pending={pending}
                    className={styles.agreeBtn}
                    onClick={() => handleAgreeBtn()}
                >
                                Submit
                </PrimaryButton>
            </div>
        </div>
    );
};

export default ChangePassword;
