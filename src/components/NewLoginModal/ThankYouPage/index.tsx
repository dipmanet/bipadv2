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

interface OwnProps {
    className?: string;
    closeModal?: () => void;
    updatePage: () => string;
}

interface PropsFromDispatch {
    setAuth: typeof setAuthAction;
    setUserDetail: typeof setUserDetailAction;
}

type ReduxProps = OwnProps & PropsFromDispatch;

type Props = NewProps<ReduxProps, Params>;

const DetailsSecondPage = (props: Props) => {
    const { pending,
        closeModal,
        updatePage } = props;

    const handleCancelBtn = () => updatePage('loginPage');

    return (
        <div className={styles.mainPageDetailsContainer}>
            <div className={styles.welcomeBack}>
                <h1>Welcome Back</h1>
                <p>
                     To login to BIPAD Portal, please use your credentials.
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

            <div className={styles.detailsFormContainer}>

                <h1>Thank you</h1>
                <p>
                    For requesting the login credential. Following the submission,
                    you will receive a confirmation email with a confirmation code.
                    Our technical team will review your details and provide you a username and
                    password.
                </p>
                {/* <p>
                    Please check your email for submission confirmation.
                    Our technical team will review your details and provide
                    you with a username and password.
                </p> */}
                <div className={styles.cancelAgreeBtns}>
                    <PrimaryButton
                        type="button"
                        className={styles.agreeBtn}
                        onClick={closeModal}
                    >
                        Close
                    </PrimaryButton>

                </div>


            </div>
        </div>
    );
};

export default DetailsSecondPage;
