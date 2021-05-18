interface Section {
    np: string;
    en: string;
}
interface LanguageEntry {
    [key: string]: Section;
}
const languageTranslations: LanguageEntry = {
    welcomeNoteparagraph1: {
        np: 'यहाँहरु लाई विपद् पोर्टलको विपद् सम्बन्धित प्रतिवेदन मोड्युलमा स्वागत छ ।',
        en: 'Welcome to the DRRM Report Module of the BIPAD Portal',
    },
    welcomeNoteparagraph2: {
        np: 'विपद् पोर्टलको यो मोड्युलले सबै तहका सरकारले प्रत्येक आर्थिक वर्षमा विपद् जोखिम न्यूनीकरण तथा व्यवस्थापनका क्षेत्रमा गरेका गतिविधिहरुको प्रतिवेदन प्रकाशन गर्दछ ।',
        en: 'Welcome to the DRRM Report Module of the BIPAD Portal',
    },
    welcomeNoteparagraph3: {
        np: 'विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन ऐन २०७४ र सोको नियमावली २०७६ को नियम १६ को व्यवस्था बमोजिम स्थानिय विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन समिति, जिल्ला विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन समिति, प्रदेश विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन समिति, र राष्ट्रिय विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन प्राधिकरणले प्रत्येक आर्थिक बर्षमा विपद् जोखिम न्यूनीकरण तथा व्यवस्थापनका क्षेत्रमा गरेका गतिविधिहरुको वार्षिक प्रतिवेदन तयार गरी आर्थिक वर्ष समाप्त भएपछि पेश गर्नु पदर्छ । विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन ऐन २०७४ र सोको नियमावली २०७६ को नियम १६ को प्राबधानलाई सहयोग गर्न प्रतिवेदन मोड्युलमा छनौट गरिएको भौगोलिक स्थान वा क्षेत्रको सामान्य जानकारी, सो स्थानमा विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन क्षेत्रमा कार्यरत संघ—संस्था, विपद् सम्बन्धित ऐन, नीति, निर्देशन, कार्यविधि, विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन गर्न तय गरिएका वार्षिक योजना, विनियोजित बजेट तथा विपद् सम्बन्धित विभिन्न जानकारी समाबेश गरिएको छ ।',
        en: 'DRRM Act, 2074 and its regulation, 2076 mandates the Local Disaster Management Committee, District Disaster Management Committee, Provincial Disaster Management Executive Committee, and NDRRMA to prepare an Annual DRRM Report that includes information on the activities conducted by the respective committees each fiscal year. To aid this mandate, the reporting module will include general information of the chosen location, organizations working on disaster management, DRR policy-related work, the budget allocated and activities for DRRM, and available inventories, and other DRR related information.',
    },
    welcomeNoteparagraph4: {
        np: 'यो रिपोर्टले विपद् जोखिम न्यूनीकरण राष्ट्रिय रणनीतिक कार्य योजना २०१८—२०३० द्वारा निर्धारित प्राथमिकता प्राप्त गतिविधिहरूको अनुगमन र ट्र्याक पनि गर्नेछ।',
        en: 'The report will also monitor and track activities based on the priorities set by the DRR National Strategic Action Plan 2018-2030.',
    },
    welcomeNoteparagraph5: {
        np: 'तपाईंको क्षेत्रको लागि रिपोर्ट प्रकाशन गर्न यहाँ क्लिक गर्नुहोस्।',
        en: 'Click proceed to generate the report for your region.',
    },
    proceedButton: {
        np: 'अगाडि बढ्नुहोस्',
        en: 'PROCEED',
    },
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
        np: 'महानगरपालिका/नगरपालिका/गाउँपालिका',
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
        np: 'कार्य',
        en: 'Action',
    },
    dashboardSidebarSelectMunicipalityHeader: {
        np: 'कृपया रिपोर्ट उत्पन्न गर्न मनाहानगरपालिका/नगरपालिका/गाउँपालिका चयन गर्नुहोस्',
        en: 'Please select a municipality to generate report.',
    },
    dashboardReportGenerateButton: {
        np: '+ नयाँ रिपोर्ट थप्नुहोस्',
        en: '+ Add New Report',
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
    dashboardTableDownloadTooltip: {
        np: 'डाउनलोड रिपोर्ट',
        en: 'Download Report',
    },
    dashboardTableEditTooltip: {
        np: 'रिपोर्ट सम्पादन गर्नुहोस्',
        en: 'Edit Report',
    },
    dashboardFilter: {
        np: 'फिल्टर',
        en: 'Filter',
    },
    dashboardFilterProvinceLabel: {
        np: 'प्रदेश',
        en: 'Province',
    },
    dashboardFilterProvincePlaceholder: {
        np: 'प्रदेश छान्नुहोस्',
        en: 'Select Province',
    },
    dashboardFilterDistrictLabel: {
        np: 'जिल्ला ',
        en: 'District',
    },
    dashboardFilterDistrictPlaceholder: {
        np: 'जिल्ला  छान्नुहोस्',
        en: 'Select District',
    },
    dashboardFilterMunicipalityLabel: {
        np: 'महानगरपालिका/नगरपालिका/गाउँपालिका',
        en: 'Municipality',
    },
    dashboardFilterMunicipalityPlaceholder: {
        np: 'पालिका छान्नुहोस्',
        en: 'Select Municipality',
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
        en: 'Please select fiscal year from General Section',
        np: 'कृपया सामान्य सेक्सनबाट मान्य आर्थिक वर्ष प्रविष्ट गर्नुहोस्',
    },
    GeneralSelectorPlaceholder: {
        en: 'Select Fiscal Year',
        np: 'आर्थिक वर्ष चयन गर्नुहोस्',
    },
    GeneralPosition: {
        en: 'Position',
        np: 'पद',
    },
    AddEdit: {
        en: 'Add/Edit Details',
        np: 'विवरणहरू थप्नुहोस् वा सम्पादन गर्नुहोस्',
    },
    GeneralPleaseClick: {
        np: 'विवरण अपडेट गर्न कृपया थप्नुहोस् / सम्पादन गर्नुहोस् बटनमा क्लिक गर्नुहोस्',
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
    OrganizationHeading: {
        np: 'विपद् जोखिम न्यूनीकरण सम्बन्धित संस्था',
        en: 'DRR related Organizations',
    },
    OrganizationSerialNumber: {
        np: 'क्रम संख्या',
        en: 'SN',
    },
    OrganizationName: {
        np: 'नाम ',
        en: 'Name',
    },
    OrganizationType: {
        np: 'प्रकार',
        en: 'Type',
    },
    OrganizationMaleEmployee: {
        np: 'पुरुष कर्मचारीहरूको संख्या',
        en: 'Number of Male employees',
    },
    OrganizationFemaleEmployee: {
        np: 'महिला कर्मचारीहरूको संख्या',
        en: 'Number of female employees',
    },
    OrganizationAction: {
        np: 'कार्य',
        en: 'Action',
    },
    OrganizationNoDataMessage: {
        np: 'डाटा उपलब्ध छैन',
        en: 'Data Unavailable',
    },
    OrganizationDataAddButton: {
        np: 'संस्थाको डाटा थप्नुहोस्',
        en: 'Add Organization Data',
    },
    OrganizationEditTooltip: {
        np: 'संस्थाको डाटा सम्पादन गर्नुहोस्',
        en: 'Edit Organization Data',
    },
    InventoryHeading: {
        np: 'सूची',
        en: 'Inventories',
    },
    InventorySerialNumber: {
        np: 'क्रम संख्या',
        en: 'SN',
    },
    InventoryResourceName: {
        np: 'स्रोतको नाम',
        en: 'Name of Resource',
    },
    InventoryResourceQuantity: {
        np: 'मात्रा',
        en: 'Quantity',
    },
    InventoryResourceUnit: {
        np: 'एकाइ',
        en: 'Unit',
    },
    InventoryResourceCategory: {
        np: 'श्रेणी',
        en: 'Category',
    },
    InventoryResourceOwnerOrganization: {
        np: 'सम्बंदित संस्था',
        en: 'Owner Organization Name',
    },
    InventoryResourceOwnerOrganizationType: {
        np: 'संस्थाको प्रकार',
        en: 'Type of Organization',
    },
    InventoryResourceAddedDate: {
        np: 'थपिएको मिति',
        en: 'Added date',
    },
    InventoryResourceUpdatedDate: {
        np: 'अद्यावधिक मिति',
        en: 'Updated date',
    },
    InventoryAction: {
        np: 'कार्य',
        en: 'Action',
    },
    InventoryNoDataMessage: {
        np: 'डाटा उपलब्ध छैन',
        en: 'Data Unavailable',
    },
    InventoryEditTooltip: {
        np: 'सूचीको डाटा सम्पादन गर्नुहोस्',
        en: 'Edit Inventory Data',
    },

    // Annual Budget
    TotalMunBudget: {
        en: 'Total municipal budget',
        np: 'नगरपालिकाको कुल बजेट',
    },
    DRRFundMun: {
        en: 'DRR fund of municipality',
        np: 'नगरपालिकाको विपद् कोष',
    },
    OtherDrrFund: {
        en: 'Other DRR related funding',
        np: 'अन्य विपद् सम्बन्धित बजेट',
    },
    BudgetDescription: {
        en: 'Total municipal budget is the total budget allocated by the municipality for the execution of various activities for this fiscal year',
        np: 'कुल बजेट भन्नाले यस आर्थिक वर्षको लागि विभिन्न गतिविधिहरू कार्यान्वयन गर्न नगरपालिकाबाट विनियोजन गरिएको कुल बजेट',
    },
    DRRMunFundDescriptio: {
        en: 'DRR fund of the municipality is part of the total municipal budget of this fiscal year which is specifically separated for DRRM related activities',
        np: 'नगरपालिकाको विपद कोष भनेको  यस आर्थिक वर्षको कुल बजेटको हिस्सा हो जुन विशेष रूपमा विपद  सम्बन्धित गतिविधिहरूको लागि छुट्याइएको छ',
    },
    OtherDrrRelatedFund: {
        en: 'Other DRR related funding is the funding received by the municipality from various sources like I/NGOS, the federal government, provincial government, private sectors, etc. for this fiscal year',
        np: 'अन्य विपद् सम्बन्धित बजेट भनेको यस आर्थिक वर्षको लागि दात्री निकाय , संघीय सरकार,प्रादेशिक  सरकार, निजी क्षेत्र आदि जस्ता विभिन्न स्रोतबाट नगरपालिकाले प्राप्त गरेको रकम हो।',
    },
    BudgetEditBtn: {
        en: 'Edit Budget',
        np: 'बजेट सम्पादन गर्नुहोस्',
    },
    BudgetAddBtn: {
        en: 'Add Budget',
        np: 'बजेट थप्नुहोस्',
    },
    BudgetTitlePart1: {
        en: 'Budget for Fiscal Year ',
        np: 'आर्थिक वर्ष',
    },
    BudgetTitlePart2: {
        en: '',
        np: 'को बजेट',
    },
    // Budget Preview
    OfMunBudget: {
        en: 'of Municipal Budget',
        np: 'नगरपालिकाको कुल बजेट को',
    },
    Budget: {
        en: 'Budget',
        np: 'बजेट',
    },
    Rupees: {
        en: 'Rs.',
        np: 'रु',
    },
    ResourcesHeading: {
        en: 'Critical Infrastructures',
        np: 'भौतिक पूर्वाधारहरू',
    },
    ResourcesSerialNumber: {
        np: 'क्रम संख्या',
        en: 'SN',
    },
    ResourcesName: {
        np: 'स्रोतको नाम',
        en: 'Resource Name',
    },
    ResourcesType: {
        np: 'स्रोतको प्रकार',
        en: 'Resource Type',
    },
    ResourcesOperatorType: {
        np: 'अपरेटरको प्रकार',
        en: 'Operator Type',
    },
    ResourcesNumberOfMaleEmployee: {
        np: 'पुरुष कर्मचारी संख्या',
        en: 'Number of Male Employee',
    },
    ResourcesNumberOfFemaleEmployee: {
        np: 'महिला कर्मचारी संख्या',
        en: 'Number of Female Employee',
    },
    ResourcesNumberOfTotalEmployee: {
        np: 'कुल कर्मचारी संख्या',
        en: 'Total Employee',
    },
    ResourcesAction: {
        np: 'कार्य',
        en: 'Action',
    },
    ResourcesAddButton: {
        np: 'स्रोतहरू थप्नुहोस्',
        en: 'Add Resources',
    },
    ResourcesNoDataMessage: {
        np: 'डाटा उपलब्ध छैन',
        en: 'Data Unavailable',
    },
    ResourcesEditTooltip: {
        np: 'स्रोतको डाटा सम्पादन गर्नुहोस्',
        en: 'Edit Resource Data',
    },


};

export default languageTranslations;
