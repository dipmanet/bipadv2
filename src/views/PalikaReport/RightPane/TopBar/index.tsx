/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.scss';

import {
    setPalikaLanguageAction,
} from '#actionCreators';
import {
    palikaLanguageSelector,
} from '#selectors';
import Icon from '#rscg/Icon';


interface Props{

}

const mapStateToProps = state => ({
    palikaLanguage: palikaLanguageSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setPalikaLanguage: params => dispatch(setPalikaLanguageAction(params)),
});

const languageObj = {
    np: 'Nepali',
    en: 'US-English',
};

const TopBar = (props: Props) => {
    const {
        palikaLanguage,
        setPalikaLanguage,
    } = props;

    const {
        language,
    } = palikaLanguage;
    console.log('lanuagd: ', language);
    const handleLangButton = () => {
        if (language === 'en') {
            setPalikaLanguage({ language: 'np' });
        } else {
            setPalikaLanguage({ language: 'en' });
        }
    };

    return (
        <div className={styles.toBarContainer}>
            {/* <button
                type="button"
                onClick={handleLangButton}
                className={styles.langBtn}
            >
                <span className={styles.langText}>
                    {language === 'en'
                        ? 'नेपाली'
                        : 'US-ENGLISH'
                    }
                </span>
                <Icon
                    name="language"
                    className={styles.langIcon}
                />
            </button> */}
            <div className={styles.languageButton}>
                <button
                    onClick={handleLangButton}
                    className={language === 'en' ? _cs(styles.engButton, styles.selectedLanguage) : styles.engButton}
                    type="button"


                >
                      EN
                </button>
                <button
                    onClick={handleLangButton}
                    className={language === 'np' ? _cs(styles.nepButton, styles.selectedLanguage) : styles.nepButton}

                    type="button"
                >
                      ने
                </button>
            </div>

        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    TopBar,
);
