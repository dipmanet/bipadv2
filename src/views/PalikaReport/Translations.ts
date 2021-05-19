interface Section {
    np: string;
    en: string;
}
interface LanguageEntry {
    [key: string]: Section;
}
const languageTranslations: LanguageEntry = {
    breadcrumb1: {
        np: 'प्रतिवेदनहरु',
        en: 'DRRM Reports',
    },
    breadcrumb2: {
        np: 'प्रतिवेदन बनाउनुहोस्',
        en: 'Add a Report',
    },
    sidebarTitle: {
        np: 'प्रतिवेदन बनाउनुहोस्',
        en: 'Create a Report',
    },
    validationErrSidebar: {
        np: 'कृपया सामान्य सेक्सनबाट मान्य वित्तीय वर्ष प्रविष्ट गर्नुहोस्',
        en: 'Please Enter Valid Fiscal Year from General Section',
    },
    CreateReportInformationButtom: {
        np: 'विपद् पोर्टलको यो मोड्युलले सबै तहका सरकारले प्रत्येक आर्थिक वर्षमा विपद् जोखिम न्यूनीकरण तथा व्यवस्थापनका क्षेत्रमा गरेका गतिविधिहरुको प्रतिवेदन प्रकाशन गर्दछ ।',
        en: 'This module in the BIPAD portal will generate a Disaster Risk Reduction and Management (DRRM) Report for each fiscal year for all tiers of the government.',
    },
    welcomeNoteparagraph1: {
        np: 'यहाँहरु लाई विपद् पोर्टलको विपद् सम्बन्धित प्रतिवेदन मोड्युलमा स्वागत छ ।',
        en: 'Welcome to the DRRM Report Module of the BIPAD Portal',
    },
    welcomeNoteparagraph2: {
        np: 'विपद् पोर्टलको यो मोड्युलले सबै तहका सरकारले प्रत्येक आर्थिक वर्षमा विपद् जोखिम न्यूनीकरण तथा व्यवस्थापनका क्षेत्रमा गरेका गतिविधिहरुको प्रतिवेदन प्रकाशन गर्दछ ।',
        en: 'This module in the BIPAD portal will generate a Disaster Risk Reduction and Management (DRRM) Report for each fiscal year for all tiers of the government.',
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
    DashBoardNoDataMessage: {
        np: 'डाटा उपलब्ध छैन',
        en: 'Data Unavailable',
    },
    dashBoardHeading: {
        np: 'बिपद जोखिम न्यूनीकरण र व्यवस्थापन रिपोर्ट',
        en: 'Disaster Risk Reduction and Management Report',
    },
    dashBoardMainTitle: {
        np: 'शीर्षक',
        en: 'Title',
    },
    dashboardTableSummaryReportDownload: {
        np: 'सारांश रिपोर्ट',
        en: 'Summary Report',
    },
    dashboardTableFullReportDownload: {
        np: 'पूरा रिपोर्ट',
        en: 'Full Report',
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
    PleaseSelect: {
        np: 'कृपया चयन गर्नुहोस्',
        en: 'Please Select',
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
    Mayor: {
        en: 'Mayor',
        np: 'मेयर',
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
    Update: {
        np: 'सम्पादन गर्नुहोस्',
        en: 'Update',
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
    // programmes and policies
    PapTitlePart1: {
        en: 'Annual Policy and Programme for FY',
        np: 'आर्थिक वर्ष',
    },
    PapTitlePart2: {
        en: '',
        np: 'को वार्षिक नीति तथा कार्यक्रमहरू',
    },
    DRRprogrammeslisted: {
        en: 'DRR programmes listed in the annual policy and programme',
        np: 'विपद् जोखिम न्यूनीकरण सम्बन्धि वार्षिक नीति तथा कार्यक्रममा सूचीबद्ध कार्यक्रमहरू',
    },
    PaPAddbtn: {
        en: '+ Add Annual Policy and Programme',
        np: '+ वार्षिक नीति तथा कार्यक्रम थप्नुहोस्',
    },
    Drrrelatedpoints: {
        en: 'Please enter the DRR related points in this fiscal years Annual Policy and Programme of the municipality',
        np: 'कृपया आफ्नो  पालिकाको  यस आर्थिक वर्षको वार्षिक नीति र कार्यक्रममा विपद् जोखिम न्यूनीकरण सम्बन्धित कार्यक्रमहरू उल्लेख गर्नुहोस् l',
    },
    points: {
        en: 'Points',
        np: 'कार्यक्रमहरू',
    },

    // incidents and relief
    distribution: {
        en: 'Population benefited from the relief distribution ',
        np: 'राहत वितरणबाट लाभान्वित जनसंख्या ',
    },
    Male: {
        en: 'Male ',
        np: 'पुरुष',
    },
    Female: {
        en: 'Female ',
        np: 'महिला',
    },
    Minorities: {
        en: 'Minorities',
        np: 'अल्पसंख्यकहरू',
    },
    Dalit: {
        en: 'Dalit ',
        np: 'दलित',
    },
    Madhesis: {
        en: 'Madhesis',
        np: 'मधेशी',
    },
    Disabilities: {
        en: 'Person with Disabilities ',
        np: 'अशक्त मानिस',
    },
    ContactGovernmentContact: {
        en: 'Governmental Contacts',
        np: 'सरकारी सम्पर्कहरू',
    },
    ContactNonGovernmentalContact: {
        en: 'Non-Governmental Contacts',
        np: 'गैर सरकारी सम्पर्कहरू',
    },
    ContactsSerialNumber: {
        np: 'क्रम संख्या',
        en: 'SN',
    },
    ContactsName: {
        np: 'नाम',
        en: 'Name',
    },
    ContactTypeOfOrganization: {
        np: 'संस्थाको प्रकार',
        en: 'Type of Organization',
    },
    ContactPosition: {
        np: 'स्थिति',
        en: 'Position',
    },
    ContactNameOfOrganization: {
        np: 'संस्थाको नाम',
        en: 'Name of Organization',
    },
    ContactTrainingTitle: {
        np: 'प्रशिक्षित शीर्षक',
        en: 'Training Title',
    },
    ContactTrainingDuration: {
        np: 'प्रशिक्षण अवधि(दिन)',
        en: 'Training Duration(Days)',
    },
    ContactContactNumber: {
        np: 'सम्पर्क नम्बर',
        en: 'Contact Number',
    },
    ContactContactEmail: {
        np: 'ईमेल',
        en: 'Email',
    },
    ContactAction: {
        np: 'कार्य',
        en: 'Action',
    },
    ContactEditTooltip: {
        np: 'सम्पर्क सम्पादन गर्नुहोस्',
        en: 'Edit Contact Data',
    },
    ContactAddButton: {
        np: 'सम्पर्क थप्नुहोस्',
        en: 'Add Contact',
    },
    ContactFocusHazard: {
        np: 'केन्द्रित जोखिम',
        en: 'Focused Hazard',
    },
    ContactTrainingActivities: {
        np: 'तालिममा समावेश गतिविधिहरू',
        en: 'Activities included in the training',
    },
    ContactTrainingDateFrom: {
        np: 'प्रशिक्षण मिति (बाट)',
        en: 'Training Date (from)',
    },
    ContactTrainingDateTo: {
        np: 'प्रशिक्षण मिति (सम्म)',
        en: 'Training Date (to)',
    },
    ContactNoDataMessage: {
        np: 'डाटा उपलब्ध छैन',
        en: 'Data Unavailable',
    },
    ContactUpdateButton: {
        np: 'अद्यावधिक',
        en: 'UPDATE',
    },
    ContactUpdateButtonTooltip: {
        np: 'सम्पर्क अद्यावधिक गर्नुहोस्',
        en: 'Update Contact',
    },
    ContactErrorHeading: {
        np: 'कृपया निम्न त्रुटिहरू ठीक गर्नुहोस्',
        en: 'Please fix the following errors',
    },
    TrainingRelatedContact: {
        np: 'विपद् जोखिम न्यूनीकरण सम्बन्धित प्रशिक्षण',
        en: 'DRR Related Training',
    },
    TrainingRelatedNoofTrainedPeople: {
        np: 'प्रशिक्षित व्यक्तिको संख्या',
        en: 'No. of trained people',
    },
    TrainingRelatedActivities: {
        np: 'प्रशिक्षण गतिविधिहरू',
        en: 'Training Activities',
    },
    TrainingRelatedActivitiesList: {
        np: 'प्रशिक्षण गतिविधिहरूको सूची',
        en: 'List of training activities',
    },
    SimulationHeading: {
        np: 'अनुकरण',
        en: 'Simulations',
    },
    SimulationSerialNumber: {
        np: 'क्रम संख्या',
        en: 'SN',
    },
    SimulationExercise: {
        np: 'अनुकरण अभ्यासको नाम',
        en: 'Name of Simulation excerise',
    },
    SimulationDate: {
        np: 'मिति',
        en: 'Date',
    },
    SimulationDescription: {
        np: 'वर्णन',
        en: 'Description',
    },
    SimulationPriorityArea: {
        np: 'प्राथमिकता क्षेत्र',
        en: 'Priority Area',
    },
    SimulationPriorityAction: {
        np: 'प्राथमिकता कार्य',
        en: 'Priority Action',
    },
    SimulationPriorityActivity: {
        np: 'प्राथमिकता गतिविधि',
        en: 'Priority Acitivity',
    },
    SimulationOrganizer: {
        np: 'आयोजक',
        en: 'Organizer',
    },
    SimulationParticipants: {
        np: 'सहभागीहरूको संख्या',
        en: 'Number of Participants',
    },
    SimulationHazards: {
        np: 'केन्द्रित प्रकोप',
        en: 'Focused Hazard',
    },
    SimulationAction: {
        np: 'कार्य',
        en: 'Action',
    },
    SimulationEditTooltip: {
        np: 'अनुकरण सम्पादन गर्नुहोस्',
        en: 'Edit Simulation Data',
    },
    SimulationUpdateButton: {
        np: 'अद्यावधिक',
        en: 'UPDATE',
    },
    SimulationAddButton: {
        np: 'नयाँ अनुकरण थप्नुहोस्',
        en: 'Add New Simulation',
    },
    SimulationUpdateButtonTooltip: {
        np: 'अनुकरण अद्यावधिक गर्नुहोस्',
        en: 'Update Simulation',
    },
    NumberOfSimulationConducted: {
        np: 'आयोजित अनुकरणको संख्या',
        en: 'No of Simulation Conducted',
    },
    NumberOfPeopleTrained: {
        np: 'प्रशिक्षित व्यक्तिहरूको संख्या',
        en: 'No of people trained',
    },
    // Budget Activities
    PriorityArea: {
        en: 'Priority Area',
        np: 'प्राथमिकता प्राप्त क्षेत्र ',
    },
    PriorityAction: {
        en: 'Priority Action',
        np: 'प्राथमिकता प्राप्त कार्य ',
    },
    PriorityActivity: {
        en: 'Priority Activity',
        np: 'प्राथमिकता प्राप्त क्रियाकलाप ',
    },
    AreaofImp: {
        en: 'Area of implementation',
        np: 'कार्यान्वयनको क्षेत्र',
    },
    Fundingtype: {
        en: 'Funding type',
        np: 'बजेटको प्रकार',
    },
    Sourceof: {
        en: 'Source of fund',
        np: 'बजेटको स्रोत',
    },
    SelectSourceof: {
        en: 'Source of fund',
        np: 'बजेटको स्रोत चयन गर्नुहोस्',
    },
    Budgetcode: {
        en: 'Budget code (if available)',
        np: 'बजेट कोड',
    },
    OrganizationNm: {
        en: 'Organization Name',
        np: 'संस्थाको नाम',
    },
    Projectstart: {
        en: 'Project start date',
        np: 'परियोजना सुरू मिति',
    },
    ProjectCompletion: {
        en: 'Project Completion date',
        np: 'परियोजना पूरा हुने मिति',
    },
    Status: {
        en: 'Status',
        np: 'परियोजनाको स्थिति',
    },
    AllocatedProject: {
        en: 'Allocated Project budget',
        np: 'परियोजना बजेट विनियोजित',
    },
    Actualexpenditure: {
        en: 'Actual expenditure',
        np: 'वास्तविक खर्च',
    },
    Remarks: {
        en: 'Remarks',
        np: 'कुनै टिप्पणीभए जानकारी दिनुहोस्',
    },
    FederalGovernment: {
        en: 'Federal Government',
        np: 'संघीय सरकार',
    },
    ProvincialGovernment: {
        en: 'Provincial Government',
        np: 'प्रदेशीय सरकार',
    },
    District: {
        en: 'District',
        np: 'जिल्ला',
    },
    Municipalgovernment: {
        en: 'Municipal government',
        np: 'मनाहानगरपालिका/नगरपालिका/गाउँपालिका',
    },
    INGO: {
        en: 'I/NGO',
        np: 'अन्तर्राष्ट्रिय/राष्ट्रिय गैर-सरकारी संगठन',
    },
    PrivateSector: {
        en: 'Private Sector',
        np: 'निजी क्षेत्र',
    },
    Academia: {
        en: 'Academia',
        np: 'शैक्षिक संस्था',
    },
    Others: {
        np: 'अन्य',
        en: 'Others',
    },
    started: {
        en: 'Started',
        np: 'सुरु भएको',
    },
    ongoing: {
        en: 'Ongoing',
        np: 'चलिरहेको',
    },
    completed: {
        en: 'Completed',
        np: 'पूरा भयोको',
    },
    NameofActivity: {
        en: 'Name of Activity',
        np: 'गतिविधि को नाम',
    },
    SelectFundingType: {
        en: 'Select Funding Type',
        np: 'बजेटको प्रकार चयन गर्नुहोस्',
    },
    BudgetActivity: {
        en: 'Budget Activity',
        np: 'बजेट गतिविधि',
    },
    TotalActivities: {
        en: 'Total number of activities',
        np: 'गतिविधिहरूको कुल संख्या',
    },
    DRRRelatedAct: {
        en: 'DRR related activities',
        np: 'विपद् जोखिम न्यूनीकरण संग सम्बन्धित गतिविधिहरू',
    },
    OtherDRRRelatedAct: {
        en: 'Other DRR related funding',
        np: 'अन्य विपद् जोखिम न्यूनीकरण संग सम्बन्धित बजेट',
    },

    // Generated report

    MonitoringAct: {
        en: 'Monitoring the activities based on the Priority Areas',
        np: 'प्राथमिकता क्षेत्रहरूमा आधारित गतिविधिहरू उल्लेख गर्दै',
    },
    DisasterRiskStrategic: {
        en: 'Disaster Risk Reduction National Strategic Plan of Action 2018-2030',
        np: 'विपद् जोखिम न्यूनीकरण राष्ट्रिय रणनीतिक कार्ययोजना २०१८-२०३०',
    },
    Organizationsworking: {
        en: 'Organizations workingon DRRM in Rajapur',
        np: 'विपद् जोखिम न्यूनीकरण र व्यवस्थापनमा राजापुर नगरपालिकामा कम गर्ने संस्थाहरु ',
    },
    Hazardwiseimpact: {
        en: 'Hazardwise impact (top 5)',
        np: 'घटनागत  प्रभाव (शीर्ष पाँच)',
    },
    Wardwiseimpact: {
        en: 'Wardwise impact (top5)',
        np: 'वडागत प्रभाव (शिर्ष पाँच)',
    },
    Genderwiseimpact: {
        en: 'Genderwise impact death',
        np: 'लिङ्गको आधारमा मृत्यु',
    },
    NOftrainedPeople: {
        en: 'No. of trained people',
        np: 'प्रशिक्षित व्यक्तिको संख्या',
    },
    Trainingactivities: {
        en: 'Training activities',
        np: 'प्रशिक्षण गतिविधिहरु',
    },
    ListofTrActs: {
        en: 'List of training activiities',
        np: 'प्रशिक्षण गतिविधिहरूको सूची',
    },
    NoofSimConducted: {
        en: 'No of simulation conducted',
        np: 'सिमुलेशन गतिविधिहरू',
    },
    DisasterIncidentSummary: {
        en: 'Disaster Incident Summary',
        np: 'विपद् घटना सारांश',
    },
    Contctus: {
        en: 'CONTACT US',
        np: 'हामीलाई सम्पर्क गर्नुहोस',
    },
    Phone: {
        en: 'Phone:',
        np: 'सम्पर्क',
    },
    Website: {
        en: 'Website',
        np: 'वेबसाइट',
    },

    PA1: {
        en: 'Understanding Disaster Risk',
        np: 'वपद् जोखिम बारे बुझाई',
    },
    PA2: {
        en: 'Strengthening Disaster Risk Governance at Federal, Provincial andLocalLevels',
        np: 'संघ, प्रदेश र स्थानीय तहमा विपद् जोखिम शासकीय पद्धतिको सुदृढीकरण',
    },
    PA3: {
        en: 'Promoting Comprehensive Risk-Informed Private and Public Investments in Disaster Risk Reduction for Resilience',
        np: 'विपद् जोखिम न्यूनीकरणका लागि उत्थानशीलता वृद्धि गर्न बृहत्तर जोखिम जानकारीमा आधारित निजी तथा सार्वजनिक लगानी प्रवर्धन',
    },
    PA4: {
        en: 'Enhancing Disaster Preparedness for Effective Response and to "Build Back Better" in Recovery, Rehabilitation and Reconstruction',
        np: 'प्रभावकारी प्रतिकार्य र पूनर्लाभ, पुनस्र्थापना तथा पुर्ननिर्माणमा “अझ राम्रो र बलियो निर्माण” का लागि विपद् पूर्वतयारीको सुदृढीकरण',
    },
    Area1: {
        en: 'Area 1',
        np: 'प्राथमिकता प्राप्त क्षेत्र १',
    },
    Area2: {
        en: 'Area 2',
        np: 'प्राथमिकता प्राप्त क्षेत्र २',
    },
    Area3: {
        en: 'Area 3',
        np: 'प्राथमिकता प्राप्त क्षेत्र ३',
    },
    Area4: {
        en: 'Area 4',
        np: 'प्राथमिकता प्राप्त क्षेत्र ४',
    },
    SelectPA: {
        en: 'Select Priority Area',
        np: 'प्राथमिकता प्राप्त क्षेत्र चयन गर्नुहोस्',
    },
    selectPAct: {
        en: 'Select Priority Action',
        np: 'प्राथमिकता प्राप्त कार्य चयन गर्नुहोस्',
    },
    selectPActivity: {
        en: 'Select Priority Activity',
        np: 'प्राथमिकता प्राप्त क्रियाकलाप चयन गर्नुहोस्',
    },
    AddnewAct: {
        en: '+ Add new activity',
        np: '+ नयाँ गतिविधि थप्नुहोस्',
    },
    BaTitlePart1: {
        np: 'आर्थिक वर्ष',
        en: 'Budget Activities for Fiscal Year',
    },
    BaTitlePart2: {
        np: 'को बजेट गतिविधि',
        en: '',
    },
    EnterBudget: {
        np: 'कृपया बजेट सेक्सनमा डाटा प्रविष्ट गर्नुहोस्',
        en: 'Please enter data in Budget section',
    },
    IncidentReliefHeading: {
        np: 'घटना र राहतहरु',
        en: 'Incidents and Reliefs',
    },
    IncidentHeading: {
        np: 'घटनाहरु',
        en: 'Incidents',
    },
    Incident: {
        np: 'घटना',
        en: 'Incident',
    },
    IncidentSerialNumber: {
        np: 'क्रम संख्या',
        en: 'SN',
    },
    IncidentTitle: {
        np: 'शीर्षक',
        en: 'Title',
    },
    IncidentHazard: {
        np: 'प्रकोप',
        en: 'Hazard',
    },
    IncidentOn: {
        np: 'घटना भएको',
        en: 'Incident On',
    },
    IncidentReportedOn: {
        np: 'रिपोर्ट गरिएको',
        en: 'Reported on ',
    },
    IncidentTotalDeath: {
        np: 'कुल मृत्यु संख्या ',
        en: 'Total Death',
    },
    IncidentTotalInjured: {
        np: 'कुल घाइते संख्या',
        en: 'Total Injured',
    },
    IncidentTotalMissing: {
        np: 'कुल हराइरहेको संख्या',
        en: 'Total Missing',
    },
    IncidentFamilyAffected: {
        np: 'प्रभावित परिवार संख्या',
        en: 'Family Affected',
    },
    IncidentInfrastructureAffected: {
        np: 'प्रभावित पूर्वाधार संख्या',
        en: 'Infrastructure Affected',
    },
    IncidentInfrastructureDestroyed: {
        np: 'नष्टभएको पूर्वाधार संख्या',
        en: 'Infrastructure Destroyed',
    },
    IncidentLiveStockLoss: {
        np: 'पशुधन हानि',
        en: 'Livestock Loss',
    },
    IncidentAction: {
        np: 'कार्य',
        en: 'Action',
    },
    IncidentAddReliefTooltip: {
        np: 'राहत थप्नुहोस्',
        en: 'Add Relief',
    },
    Relief: {
        np: 'राहत',
        en: 'Relief',
    },
    ReliefHeading: {
        np: 'कृपया माथिको घटनाको लागि राहत थप्नुहोस्',
        en: 'Please add relief detail for the above incident',
    },
    ReliefBeneficiary: {
        np: 'लाभान्वित परिवारको संख्या(संख्या उल्लेख गर्नुहोस्)',
        en: 'Number of benificiaries family(specify the number) ',
    },
    ReliefBeneficiaryName: {
        np: 'लाभार्थीहरूको नाम सूची गर्नुहोस्(अनिवार्य छैन)',
        en: 'List down the name of beneficiaries(not mandatory) ',
    },
    ReliefDistributionDate: {
        np: 'राहत वितरणको मिति',
        en: 'Date of relief distribution',
    },
    ReliefAmount: {
        np: 'राहत रकम (अनुमानित)',
        en: 'Relief amount (estimated)',
    },
    ReliefBenefitedPeopleHeading: {
        np: 'राहत वितरणबाट लाभान्वित जनसंख्या ',
        en: 'Population benefited from the relief distribution ',
    },
    ReliefBenefitedPeopleMale: {
        np: 'पुरुष',
        en: 'Male  ',
    },
    ReliefBenefitedPeopleFemale: {
        np: 'महिला',
        en: 'Female ',
    },
    ReliefBenefitedPeopleMinorities: {
        np: 'अल्पसंख्यकहरू',
        en: 'Minorities ',
    },
    ReliefBenefitedPeopleDalit: {
        np: 'दलित',
        en: 'Dalit ',
    },
    ReliefBenefitedPeopleMadhesi: {
        np: 'मधेशी',
        en: 'Madhesis',
    },
    ReliefBenefitedPeopleJanajati: {
        np: 'जनजाती',
        en: 'Janajati',
    },
    ReliefBenefitedPeopleDisable: {
        np: 'अशक्त मानिस',
        en: 'Person with Disabilities',
    },
    ReliefDataSaveButton: {
        np: 'पेश गर्नुहोस्',
        en: 'SAVE',
    },
    ReliefDataBackButton: {
        np: 'फिर्ता जानुहोस्',
        en: 'BACK',
    },
    ReliefDataUpdateButton: {
        np: 'अद्यावधिक गर्नुहोस्',
        en: 'UPDATE',
    },

    FY: {
        en: 'FY:',
        np: 'आव:',
    },
    EducationalInstitutions: {
        en: 'Educational Institutions',
        np: 'शैक्षिक संस्था',
    },

    Banks: {
        en: 'Banks',
        np: 'बैंकहरू',
    },
    Hospitals: {
        en: 'Hospitals',
        np: 'अस्पतालहरू',
    },
    CulturalSites: {
        en: 'Cultural Sites',
        np: 'सांस्कृतिक साइटहरू',
    },
    HotelsorRestaurants: {
        en: 'Hotels or Restaurants',
        np: 'होटल वा रेस्टुरेन्ट',
    },
    GovernmentBuildings: {
        en: 'Government Buildings',
        np: 'सरकारी भवनहरू',
    },
    Industries: {
        en: 'Industries',
        np: 'उद्योगहरू',
    },
    EstimatedLoss: {
        np: 'अनुमानित घाटा (रु)',
        en: 'Estimated Loss (Rs)',
    },
    Death: {
        en: 'Death',
        np: 'मृत्यु',
    },
    Missing: {
        np: 'हराइरहेको',
        en: 'Missing',
    },
    Injured: {
        np: 'घाइते',
        en: 'Injured',
    },
    LiveStockLossDestroyed: {
        np: 'पशुधन हानि',
        en: 'Livestock Destroyed',
    },
    HouseDamaged: {
        en: 'House Damaged',
        np: 'घर बिग्रिएको',
    },
    Fully: {
        en: 'Fully',
        np: 'पूर्ण रूपमा',
    },
    Partial: {
        en: 'Partially',
        np: 'आंशिक रूपमा',
    },
    ReliefAmt: {
        np: 'राहत रकम',
        en: 'Relief amount',
    },
    ReliefBen: {
        np: 'लाभान्वित परिवारको संख्या',
        en: 'Number of benificiaries family',
    },
    ContactUs: {
        en: 'Contact Us',
        np: 'हामीलाई सम्पर्क गर्नुहोस',
    },
    ContactMessageGenerated: {
        en: 'This report has been generated in the BIPAD Portal (https://bipadportal.gov.np/). ',
        np: 'यो रिपोर्ट BIPAD पोर्टल मा उत्पन्न गरिएको छ (https://bipadportal.gov.np/)',
    },
    ContactNote: {
        en: 'Note: Please refer to the Annexes for details on each section',
        np: 'नोट: कृपया प्रत्येक सेक्सनमा विवरणहरूको लागि एनेक्सिसलाई सन्दर्भ गर्नुहोस्',
    },
    MayorNameUnavailable: {
        en: 'Name Unavailable',
        np: 'नाम उपलब्ध छैन',
    },
    MayorEmailUnavailable: {
        en: 'Mayor Email Unavailable',
        np: 'मेयरको ईमेल उपलब्ध छैन',
    },
    MayorPhoneUnavailable: {
        en: ' Phone No Unavailable',
        np: ' फोन नम्बर उपलब्ध छैन',
    },
    CaoNameUnavailable: {
        en: 'Name Unavailable',
        np: ' नाम उपलब्ध छैन',
    },
    CaoEmailUnavailable: {
        en: 'Email Unavailable',
        np: ' ईमेल उपलब्ध छैन',
    },
    CaoPhoneUnavailable: {
        en: 'Phone No Unavailable',
        np: ' फोन नम्बर उपलब्ध छैन',
    },
    FocalPersonNameUnavailable: {
        en: ' Name Unavailable',
        np: 'नाम उपलब्ध छैन',
    },
    FocalPersonEmailUnavailable: {
        en: ' Email Unavailable',
        np: ' ईमेल उपलब्ध छैन',
    },
    FocalPersonPhoneUnavailable: {
        en: ' Phone No Unavailable',
        np: ' फोन नम्बर उपलब्ध छैन',
    },
    OrgsWorkingIn: {
        en: 'Organizations working on DRRM activities in',
        np: 'DRRM गतिविधिहरु मा काम गर्दै गरेका संगठनहरू',
    },
    MunicipalitySingle: {
        en: 'Municipality',
        np: 'नगरपालिका',
    },
    SubmitFull: {
        en: 'सबमिट गर्नुहोस् र पूर्ण रिपोर्ट डाउनलोड गर्नुहोस्',
        np: 'Submit and Download Full Report',
    },
    SubmitPart: {
        en: 'सबमिट गर्नुहोस् र सारांश रिपोर्ट डाउनलोड गर्नुहोस्',
        np: 'Submit and Download Summary Report',
    },
    LDMC: {
        en: 'Local Disaster Management Committee',
        np: 'स्थानीय विपद् व्यवस्थापन समिति',
    },
    AnnexA: {
        en: 'Annex A',
        np: 'अनुसूची क',
    },
    AnnexC: {
        en: 'Annex C',
        np: 'अनुसूची ग',
    },
    AnnexB: {
        en: 'Annex B',
        np: 'अनुसूची ख',
    },
    AnnexD: {
        en: 'Annex D',
        np: 'अनुसूची घ',
    },
    AnnexE: {
        en: 'Annex E',
        np: 'अनुसूची ङ',
    },
    AnnexF: {
        en: 'Annex F',
        np: 'अनुसूची च',
    },
    AnnexG: {
        en: 'Annex G',
        np: 'अनुसूची छ',
    },
    AnnexH: {
        en: 'Annex H',
        np: 'अनुसूची ज',
    },
    AnnexI: {
        en: 'Annex I',
        np: 'अनुसूची झ',
    },
    AnnexJ: {
        en: 'Annex J',
        np: 'अनुसूची ञ',
    },
    AnnexK: {
        en: 'Annex K',
        np: 'अनुसूची ट',
    },
    AnnexL: {
        en: 'Annex L',
        np: 'अनुसूची ठ',
    },


};

export default languageTranslations;
