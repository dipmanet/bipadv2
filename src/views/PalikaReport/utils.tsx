import { connect } from 'react-redux';
import {
    palikaLanguageSelector,
} from '#selectors';

const mapStateToProps = state => ({
    palikaLanguage: palikaLanguageSelector(state),
});


const Gt = (props) => {
    const {
        palikaLanguage,
        section,
    } = props;

    const {
        language,
    } = palikaLanguage;

    if (language === 'en') {
        return section.en;
    }
    return section.np;
};

export default connect(mapStateToProps, undefined)(
    Gt,
);
