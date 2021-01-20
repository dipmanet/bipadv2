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
    const [errMsg, setErrMsg] = useState(false);
    const [checkedTnc, setCheckedTnc] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const { pending,
        closeModal,
        handleCancel,
        handleAgree } = props;

    const handleCancelBtn = () => handleCancel('loginPage');

    const handleChkBox = (e) => {
        if (e.target.checked) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
        setCheckedTnc(e.target.checked);
        setErrMsg(false);
    };

    const handleAgreeBtn = () => {
        if (checkedTnc) {
            setErrMsg(false);
            handleAgree('detailsPage');
        } else {
            setErrMsg(true);
        }
    };

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
                <div className={styles.termsandconditions}>
                    Password Request section
                </div>
            </div>

            <div className={styles.welcomeBack}>
                <h1>Welcome Back</h1>
                <p>
                        To login to BIPAD Portal,
                        please use your credentials.
                </p>
                <div className={styles.loginBtn}>
                    <PrimaryButton
                        type="button"
                        className={styles.newsignIn}
                        onClick={handleCancelBtn}
                        disabled
                    >
                        Sign in
                    </PrimaryButton>
                </div>
            </div>

        </div>
    );
};

export default ForgotPassword;
