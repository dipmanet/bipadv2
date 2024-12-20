import React, { useState, useEffect } from 'react';
import { _cs, isDefined } from '@togglecorp/fujs';
import { Translation } from 'react-i18next';
import Icon from '#rscg/Icon';

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
        signupRegion,
        municipality,
        district,
        province } = props;

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
    };

    useEffect(() => {
        if (municipality || province || district) {
            setErrMsg(false);
        } else {
            setErrMsg(true);
        }
    }, [district, municipality, province]);

    return (
        <Translation>
            {
                t => (
                    <div className={styles.mainPageDetailsContainer}>
                        <div className={styles.welcomeBack}>
                            <h1>{t('Welcome Back')}</h1>
                            <p>
                                {t('To login to BIPAD Portal, please use your credentials.')}
                            </p>
                            <div className={styles.loginBtn}>
                                <PrimaryButton
                                    type="button"
                                    className={styles.newsignIn}
                                    onClick={handleCancelBtn}
                                >
                                    {t('Sign in')}
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
                                <h2>
                                    {t('You are representing:')}
                                </h2>
                                <div className={styles.newSignupForm}>
                                    <div className={styles.inputContainer}>
                                        <StepwiseRegionSelectInput
                                            className={_cs(styles.activeView,
                                                styles.stepwiseRegionSelectInput)}
                                            faramElementName="region"
                                            wardsHidden
                                            onChange={handleFormRegion}
                                            initialLoc={{
                                                municipality,
                                                district,
                                                province,
                                            }}
                                            provinceInputClassName={styles.snprovinceinput}
                                            districtInputClassName={styles.sndistinput}
                                            municipalityInputClassName={styles.snmuniinput}
                                        />
                                    </div>
                                    {errMsg && showErr ? (
                                        <span className={styles.errMsg}>
                                            {t('Please select at least one field')}
                                        </span>
                                    ) : ''}
                                </div>
                            </div>
                            <div className={styles.cancelAgreeBtns}>
                                <PrimaryButton
                                    type="button"
                                    className={styles.cancelBtn}
                                    onClick={handleDetails}
                                >
                                    {t('Back')}
                                </PrimaryButton>

                                <PrimaryButton
                                    type="button"
                                    className={styles.agreeBtn}
                                    onClick={handleAgreeBtn}
                                >
                                    {t('Next')}
                                </PrimaryButton>

                            </div>


                        </div>
                    </div>
                )
            }
        </Translation>

    );
};

export default DetailsFirstPage;
