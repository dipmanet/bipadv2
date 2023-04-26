import React, { useState, useEffect } from 'react';
import { Translation } from 'react-i18next';
import Icon from '#rscg/Icon';


import DangerButton from '#rsca/Button/DangerButton';

import PrimaryButton from '#rsca/Button/PrimaryButton';
import ReCaptcha from '#rsci/ReCaptcha';

import {
    setAuthAction,
    setUserDetailAction,
} from '#actionCreators';

import {
    NewProps,
} from '#request';
import FileUploader from '../FileUploader';
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

// const domain = process.env.REACT_APP_DOMAIN;
const sampleLetterURL = '/media/password_request_document_sample.docx';

const DetailsSecondPage = (props: Props) => {
    const [fileErr, setFileErr] = useState(true);
    const [uploaderr, setUploadError] = useState(true);
    const [showErr, setShowErr] = useState(false);
    const [token, setToken] = useState('');
    const [disabled, setDisabled] = useState(true);
    const { pending,
        closeModal,
        updatePage,
        submit,
        uploadedLetter,
        serverErrorMsg } = props;

    const handleCancelBtn = () => updatePage('loginPage');
    const handleCaptchaChange = (value) => {
        if (value === '') {
            setDisabled(true);
        } else {
            setToken(value);
            setUploadError(false);
            setDisabled(false);
        }
    };
    useEffect(() => {
        if (!uploaderr && !fileErr) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [fileErr, uploaderr]);

    const handleSubmit = () => {
        if (!fileErr && !uploaderr) {
            submit(true);
        } else {
            setShowErr(true);
            setUploadError(true);
        }
    };
    const setSelectedFile = (file) => {
        setFileErr(false);
        uploadedLetter(file);
    };
    const handleDetails = () => updatePage('detailsFirstPage');

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
                                <h2>{t('Please attach the official letter')}</h2>
                                <div className={styles.newSignupForm}>
                                    {showErr && fileErr ? (
                                        <span className={styles.fileError}>
                                            {t(`Please choose a valid letter file
                                        (.jpg, .jpeg, .pdf, .doc, .docx, .png)`)}
                                        </span>
                                    ) : ''}
                                    <div className={styles.inputfileContainer}>
                                        <FileUploader
                                            onFileSelectSuccess={setSelectedFile}
                                            onFileSelectError={({ error }) => setUploadError(error)}
                                        />
                                    </div>
                                    <div className={styles.officialLetterLink}>
                                        <a href={sampleLetterURL}>{t('Download a sample letter')}</a>
                                    </div>
                                    <ReCaptcha
                                        faramElementName="recaptcha"
                                        siteKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                                        onChange={handleCaptchaChange}

                                    />
                                    {uploaderr && showErr
                                        ? (
                                            <span className={styles.captchaErr}>
                                                {t('Please select the checkbox to submit')}
                                            </span>
                                        ) : ''
                                    }
                                    {serverErrorMsg && showErr
                                        ? (
                                            <span className={styles.captchaErr}>
                                                {serverErrorMsg}
                                            </span>
                                        ) : ''
                                    }
                                    {serverErrorMsg ? (
                                        <span className={styles.captchaErr}>
                                            {serverErrorMsg}
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
                                    pending={pending}
                                    className={disabled ? styles.disabled : styles.agreeBtn}
                                    onClick={handleSubmit}
                                    disabled={disabled}
                                >
                                    {t('Submit')}
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                )
            }
        </Translation>

    );
};

export default DetailsSecondPage;
