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
}

interface PropsFromDispatch {
    setAuth: typeof setAuthAction;
    setUserDetail: typeof setUserDetailAction;
}

type ReduxProps = OwnProps & PropsFromDispatch;

type Props = NewProps<ReduxProps, Params>;

const DetailsSecondPage = (props: Props) => {
    const [errMsg, setErrMsg] = useState(false);
    const { pending,
        closeModal,
        updatePage,
        institution,
        submit } = props;

    const handleCancelBtn = () => updatePage('loginPage');

    const handleInstitutionChange = event => institution(event.target.value);
    const handleSubmit = () => submit(true);

    return (
        <div className={styles.mainPageDetailsContainer}>
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

            <div className={styles.detailsFormContainer}>
                <div className={styles.closeBtn}>
                    <DangerButton className={styles.dangerbtn} onClick={closeModal}>
                        <Icon
                            name="times"
                            className={styles.closeIcon}
                        />
                    </DangerButton>
                </div>
                <div className={styles.formContainer}>
                    <h2>Please provide the following details</h2>
                    <div className={styles.newSignupForm}>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                className={styles.inputElement}
                                placeholder="Enter your institution"
                                onChange={handleInstitutionChange}
                                required
                            />
                        </div>
                        <p className={styles.moreInfo}>
                            The official email will be registered in the
                            system and will be used as the
                            primary email for any official correspondence
                        </p>
                    </div>
                </div>
                <div className={styles.cancelAgreeBtns}>
                    {errMsg
                        && (
                            <span className={styles.errMsg}>
                           Something went wrong!!
                            </span>
                        )}
                    <PrimaryButton
                        type="button"
                        pending={pending}
                        className={styles.agreeBtn}
                        onClick={handleSubmit}
                    >
                        Submit
                    </PrimaryButton>

                </div>


            </div>
        </div>
    );
};

export default DetailsSecondPage;
