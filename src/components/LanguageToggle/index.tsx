import React from 'react';
import Redux from 'redux';

import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import * as PageTypes from '#store/atom/page/types';

import {
    languageSelector,
} from '#selectors';


import {
    setLanguageAction,
} from '#actionCreators';

import { AppState } from '#types';
import styles from './styles.scss';

interface ComponentProps {
}

interface PropsFromAppState {
    language: PageTypes.Language;
}

type Props = ComponentProps & PropsFromAppState & PropsFromDispatch;

interface PropsFromDispatch {
    setLanguage: typeof setLanguageAction;
}

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    language: languageSelector(state),
});
const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setLanguage: params => dispatch(setLanguageAction(params)),
});

const LanguageToggle = (props: Props) => {
    const { language: { language }, setLanguage, className } = props;

    const handleLangButton = (val: string) => {
        setLanguage({ language: val });
    };

    return (
        <div className={_cs(styles.languageButton, className)}>
            <button
                onClick={() => handleLangButton('en')}
                className={language === 'en' ? _cs(styles.engButton, styles.selectedLanguage) : styles.engButton}
                type="button"
            >
                EN
            </button>
            <button
                onClick={() => handleLangButton('np')}
                className={language === 'np' ? _cs(styles.nepButton, styles.selectedLanguage) : styles.nepButton}
                type="button"
            >
                ने
            </button>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageToggle);
