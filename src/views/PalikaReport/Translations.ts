interface Section {
    np: string;
    en: string;
}
interface LanguageEntry {
    [key: string]: Section;
}
const languageTranslations: LanguageEntry = {
    dashBoardHeading: {
        np: 'बिपद जोखिम न्यूनीकरण र व्यवस्थापन रिपोर्ट',
        en: 'Disaster Risk Reduction and Management Report',
    },
    dashBoardMainTitle: {
        np: 'शीर्षक',
        en: 'Title',
    },
    dashboardTblHeaderSN: {
        np: 'क्रम संख्या',
        en: 'SN',
    },
    dashboardTblHeaderTitle: {
        np: 'रिपोर्ट शीर्षक',
        en: 'Title',
    },
    dashboardTblHeaderFiscalYear: {
        np: 'आर्थिक वर्ष',
        en: 'Fiscal Year',
    },
    dashboardTblHeaderProvince: {
        np: 'प्रदेश',
        en: 'Province',
    },
    dashboardTblHeaderDistrict: {
        np: 'जिल्ला',
        en: 'District',
    },
    dashboardTblHeaderMunicipality: {
        np: 'मनाहानगरपालिका/नगरपालिका/गाउँपालिका',
        en: 'Municipality',
    },
    dashboardTblHeaderPublishedOn: {
        np: 'प्रतिवेदन प्रकाशित मिति',
        en: 'Published On',
    },
    dashboardTblHeaderLastModified: {
        np: 'अन्तिम संशोधित मिति',
        en: 'Last Modified',
    },
    dashboardTblHeaderLastPublishedBy: {
        np: 'प्रतिवेदन प्रकाशित गर्ने संस्था',
        en: 'Published By',
    },
    dashboardTblHeaderLastAction: {
        np: 'डाउनलोड गर्नुहोस्',
        en: 'Action',
    },
    dashboardSidebarAllTitle: {
        np: 'ड्यासबोर्ड',
        en: 'DashBoard',
    },
    dashboardSidebarMunTitle: {
        np: 'नगरपालिकाको प्रतिवेदनहरु',
        en: 'Municipality Reports',
    },
    dashboardTblBtnDownload: {
        np: 'डाउनलोड',
        en: 'Download',
    },
    dashboardFilter: {
        np: 'फिल्टर',
        en: 'Filter',
    },
    dashboardReset: {
        np: 'रिसेट',
        en: 'Reset',
    },
    // General section
    GeneralInformation: {
        en: 'General Information',
        np: 'सामान्य जानकारी',
    },

    MunicipalDRR: {
        en: 'Municipal DRR Leadership',
        np: 'नगरपालिकाको विपद् जोखिम न्यूनीकरण नेतृत्व ',
    },

    Fiscalyear: {
        en: 'Fiscal year',
        np: 'आर्थिक वर्ष',
    },

    Keycontacts: {
        en: 'Key contacts',
        np: 'प्रमुख सम्पर्क व्यक्तिहरु',
    },

    MayororChairperson: {
        en: 'Mayor or Chairperson',
        np: 'मेयर वा अध्यक्ष',
    },

    ChiefAdminstrative: {
        en: 'Chief Adminstrative Officer',
        np: 'मुख्य प्रशासनिक अधिकारी',
    },

    DRRfocal: {
        en: 'DRR focal person',
        np: 'विपद् जोखिम न्यूनीकरणको फोकल व्यक्ति',
    },

    Name: {
        en: 'Name',
        np: 'नाम',
    },

    Email: {
        en: 'Email',
        np: 'ईमेल',
    },

    PhoneNumber: {
        en: 'Phone Number',
        np: 'फोन नम्बर',
    },

    LocalDisaster: {
        en: 'Local Disaster Mangement Committee',
        np: 'स्थानीय विपद् व्यवस्थापन समिति ',
    },
    FormationDateTitle: {
        en: 'Local Disaster Mangement Committee Formation Date',
        np: 'स्थानीय विपद व्यवस्थापन समितिको गठन मिति',
    },

    Committeemembers: {
        en: 'Committee members list',
        np: 'समिति सदस्यहरूको सूची',
    },

    Numberofmembers: {
        en: 'Number of members in Local Disaster Management Committee',
        np: 'स्थानीय विपद् व्यवस्थापन समिति सदस्य संख्या',
    },

    Title: {
        en: 'Title',
        np: 'शीर्षक',
    },

    TitleMunicipality: {
        en: 'Municipality: Disaster Risk Reduction and Management Report FY 077/078',
        np: 'नगरपालिका: आर्थिक वर्ष ७७/७८ को विपद् जोखिम न्यूनीकरण र व्यवस्थापन रिपोर्ट ',
    },

    GeneralSubtitleFirst: {
        en: 'DRRM report will be generated for each fiscal year.',
        np: 'विपद् जोखिम न्यूनीकरण र व्यवस्थापन प्रतिवेदन प्रत्येक आर्थिक वर्षको आधारमा प्रकाशित हुन्छ l',
    },

    GeneralSelectFiscalYear: {
        en: 'Please select fiscal year',
        np: 'कृपया आर्थिक वर्ष चयन गर्नुहोस्',
    },
    GeneralSelectorPlaceholder: {
        en: 'Select Fiscal Year',
        np: 'आर्थिक वर्ष चयन गर्नुहोस्',
    },
    GeneralPosition: {
        en: 'Position',
        np: 'काम भूमिका',
    },
    AddEdit: {
        en: 'Add/Edit Details',
        np: 'विवरणहरू थप्नुहोस् वा सम्पादन गर्नुहोस्',
    },
    GeneralPleaseClick: {
        np: 'विवरण अपडेट गर्न कृपया बटनमा क्लिक गर्नुहोस्',
        en: 'Please click on the add/edit button to update the details',
    },
    SaveContinue: {
        np: 'सुरक्षित  र जारी राख्नुहोस्',
        en: 'Save and Continue',
    },
    AddMember: {
        np: 'सदस्य थप्नुहोस्',
        en: 'Add Member',
    },

};

export default languageTranslations;
