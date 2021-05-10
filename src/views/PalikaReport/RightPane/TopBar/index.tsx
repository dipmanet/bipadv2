/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
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

    const handleLangButton = () => {
        if (language === 'np') {
            setPalikaLanguage({ language: 'en' });
        } else {
            setPalikaLanguage({ language: 'np' });
        }
    };

    return (
        <div className={styles.toBarContainer}>
            <button
                type="button"
                onClick={handleLangButton}
                className={styles.langBtn}
            >
                <span className={styles.langText}>
                    {language === 'en'
                        ? 'US-ENGLISH'
                        : 'नेपाली'
                    }
                </span>
                <Icon
                    name="language"
                    className={styles.langIcon}
                />
            </button>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    TopBar,
);
