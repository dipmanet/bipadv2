interface Section {
    np: string;
    en: string;
}
interface LanguageEntry {
    [key: string]: Section;
}
const languageTranslations: LanguageEntry = {
    dashBoardMainTitle: {
        np: 'प्रकोप जोखिम न्यूनीकरण र व्यवस्थापन रिपोर्ट',
        en: 'Disaster Risk Reduction and Management Report',
    },
};

export default languageTranslations;
