import { connect } from 'react-redux';
import {
    palikaLanguageSelector,
} from '#selectors';
import { AppState } from '#store/types';

const mapStateToProps = (state: AppState) => ({
    palikaLanguage: palikaLanguageSelector(state),
});

interface PalikaLanguage{
    language: 'en' | 'np';
}

interface Section {
    np: string;
    en: string;
}

interface Props {
    section: Section;
    palikaLanguage: PalikaLanguage;
}

const Gt = (props: Props) => {
    const {
        palikaLanguage: { language },
        section,
    } = props;

    if (language === 'en') {
        if (section && section.en) {
            return section.en;
        }
        return '';
    }
    if (section && section.np) {
        return section.np;
    }
    return '';
};

export default connect(mapStateToProps, undefined)(
    Gt,
);
