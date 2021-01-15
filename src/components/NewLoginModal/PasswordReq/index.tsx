import React, { useState } from 'react';
import Icon from '#rscg/Icon';


import DangerButton from '#rsca/Button/DangerButton';

import PrimaryButton from '#rsca/Button/PrimaryButton';
import Checkbox from '#rsci/Checkbox';

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
}

interface PropsFromDispatch {
    setAuth: typeof setAuthAction;
    setUserDetail: typeof setUserDetailAction;
}

type ReduxProps = OwnProps & PropsFromDispatch;

type Props = NewProps<ReduxProps, Params>;

const PasswordReq = (props: Props) => {
    console.log(props);
    const [loginpage, setloginpage] = useState(false);
    const [chkBox, setChkBox] = useState(false);
    const [errMsg, setErrMsg] = useState(false);
    const [checkedTnc, setCheckedTnc] = useState(false);
    const { pending,
        closeModal,
        handleCancel } = props;

    const handleCancelBtn = () => handleCancel(true);

    const handleChkBox = (event) => {
        setCheckedTnc(event.target.checked);
        setErrMsg(false);
    };

    const handleAgreeBtn = () => {
        console.log('handling btn');
        if (checkedTnc) {
            console.log('checked');
            setErrMsg(false);

            // go to next page
        } else {
            setErrMsg(true);
        }
    };

    return (
        <div className={styles.mainPwdReqContainer}>
            <div className={styles.welcomeBack}>
                <h1>Welcome Back</h1>
                <p>
                        To keep connected with us please login with your personal info
                </p>
                <div className={styles.loginBtn}>
                    <PrimaryButton
                        type="button"
                        className={styles.newsignIn}
                        onClick={handleCancelBtn}
                    >
                        Sign in
                    </PrimaryButton>
                </div>

            </div>

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
                    <p className={styles.description}>
                        BIPAD portal is a Government owned integrated and
                        comprehensive Disaster Information Management System.
                        It aims to bring together all credible digital and spatial
                        data into a single platform to strengthen the preparedness,
                        mitigation, and response activities of all related
                        stakeholders working in this sector. This one stop platform
                        has been developed with the concept of creating a
                        national portal embedded with independent platforms for
                        national, provincial, and municipal government with a
                        bottom-up approach of disaster data partnership.

                    </p>
                    <p className={styles.description}>
                        Authorized government body from each province, district,
                        and municipality will receive a single login credential. You
                        can request for the username and password once.
                    </p>
                    <div className={styles.iAgreeCheckBox}>
                        <input type="checkbox" onClick={handleChkBox} className={styles.tncCheckbox} />
                        <span className={styles.chkboxLbl}>
                            I hereby confirm that I am a government employee
                            requesting for the login credential for the first time
                        </span>
                    </div>

                </div>
                <div className={styles.cancelAgreeBtns}>
                    {errMsg
                        && (
                            <span className={styles.errMsg}>
                            Please agree to the terms and
                            conditions before continuing
                            </span>
                        )}
                    <div>
                        <PrimaryButton
                            type="button"
                            pending={pending}
                            className={styles.cancelBtn}
                            onClick={handleCancelBtn}
                        >
                        Back
                        </PrimaryButton>

                        <PrimaryButton
                            type="button"
                            pending={pending}
                            className={styles.agreeBtn}
                            onClick={handleAgreeBtn}
                        >
                        I Agree
                        </PrimaryButton>
                    </div>

                </div>


            </div>
        </div>
    );
};

export default PasswordReq;
