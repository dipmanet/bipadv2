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

const ForgotPassword = (props: Props) => {
    const [forgotEmail, setForgotEmail] = useState('');
    const [disabled, setDisabled] = useState(true);
    const { pending,
        closeModal,
        handleCancel,
        handleAgree,
        submitForgot } = props;

    const handleCancelBtn = () => handleCancel('loginPage');

    const handleForgotEmailChange = (e) => {
        setForgotEmail(e.target.value);
    };

    const handleAgreeBtn = () => submitForgot(forgotEmail);

    return (
        <div className={styles.mainPwdReqContainer}>

            <div className={styles.pwdRequestContainer}>
                <div className={styles.closeBtn}>
                    <DangerButton className={styles.dangerbtn} onClick={closeModal}>
                        <Icon
                            name="times"
                            className={styles.closeIcon}
                        />
                    </DangerButton>
                </div>

                <h1>Please enter your official email registered with BIPAD </h1>
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        className={styles.inputElement}
                        placeholder="Official Email"
                        onChange={handleForgotEmailChange}
                    // value={nameprop || ''}
                    />
                </div>
                <div className={styles.loginBtn}>
                    <PrimaryButton
                        type="button"
                        pending={pending}
                        className={styles.agreeBtn}
                        onClick={handleAgreeBtn}
                    >
                        Submit
                    </PrimaryButton>
                </div>
                <div className={styles.infoForgot}>
                    <p>
                        <Icon
                            name="info"
                            className={styles.infoIcon}
                        />
                    After submission please check the official email for the password
                    request link
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
