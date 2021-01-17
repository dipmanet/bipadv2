import React, { useState, useRef } from 'react';
import { _cs, isDefined } from '@togglecorp/fujs';
import Icon from '#rscg/Icon';
import FileUploader from '../FileUploader';

import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';
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

const DetailsFirstPage = (props: Props) => {
    const [errMsg, setErrMsg] = useState(true);
    const [showErr, setShowErr] = useState(false);
    const { pending,
        closeModal,
        updatePage,
        signupRegion } = props;

    const handleDetails = () => updatePage('detailsPage');
    const handleAgreeBtn = () => {
        if (!errMsg) {
            updatePage('detailsSecondPage');
        } else {
            setShowErr(true);
        }
    };
    const handleCancelBtn = () => updatePage('loginPage');
    const handleFormRegion = (newValue, newRegionValues) => {
        signupRegion(newRegionValues);
        console.log(newRegionValues);
        if (newRegionValues) {
            setErrMsg(false);
        } else {
            setErrMsg(true);
        }
    };

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
                    <h2>You are representing: </h2>
                    <div className={styles.newSignupForm}>
                        <div className={styles.inputContainer}>
                            <StepwiseRegionSelectInput
                                className={
                                    _cs(styles.activeView, styles.stepwiseRegionSelectInput)}
                                faramElementName="region"
                                wardsHidden
                                onChange={handleFormRegion}
                                initialLoc={{ municipality: undefined,
                                    district: undefined,
                                    province: undefined }}
                                provinceInputClassName={styles.snprovinceinput}
                                districtInputClassName={styles.sndistinput}
                                municipalityInputClassName={styles.snmuniinput}
                            />
                        </div>
                        {errMsg && showErr ? <span className={styles.errMsg}>Please select at least one field</span> : ''}
                    </div>
                </div>
                <div className={styles.cancelAgreeBtns}>
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

export default DetailsFirstPage;
