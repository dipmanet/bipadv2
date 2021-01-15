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

const DetailsPage = (props: Props) => {
    const [errMsg, setErrMsg] = useState(false);
    const [checkedTnc, setCheckedTnc] = useState(false);
    const { pending,
        closeModal,
        updatePage } = props;

    const handleDetails = () => updatePage('tncPage');
    const handleAgreeBtn = () => console.log('handling agree btn press');
    const handleCancelBtn = () => updatePage('loginPage');

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
                    <h2>Provide the following details</h2>
                    <div className={styles.newSignupForm}>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                className={styles.inputElement}
                                placeholder="Full Name"
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                className={styles.inputElement}
                                placeholder="Desingation (eg. designer)"
                            />
                        </div>
                        <div className={styles.multinputContainer}>
                            <div className={styles.smallElements}>
                                <input
                                    type="text"
                                    className={styles.smallElement}
                                    placeholder="+977"
                                />
                            </div>

                            <div className={styles.biggerElements}>
                                <input
                                    type="text"
                                    className={styles.biggerElement}
                                    placeholder="Phone No."
                                />
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                className={styles.inputElement}
                                placeholder="Email"
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
                        className={styles.cancelBtn}
                        onClick={handleDetails}
                    >
                        Back
                    </PrimaryButton>

                    <PrimaryButton
                        type="button"
                        pending={pending}
                        className={styles.agreeBtn}
                        onClick={handleAgreeBtn}
                    >
                        Next
                    </PrimaryButton>

                </div>


            </div>
        </div>
    );
};

export default DetailsPage;
