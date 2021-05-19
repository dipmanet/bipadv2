/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import styles from './styles.scss';

import budgetLogo from '#resources/palikaicons/budget.svg';
import budgetActivityLogo from '#resources/palikaicons/budgetactivity.svg';
import generalLogo from '#resources/palikaicons/general.svg';
import contactsLogo from '#resources/palikaicons/contacts.svg';
import programAndPolicyLogo from '#resources/palikaicons/program.svg';
import organisationLogo from '#resources/palikaicons/organisation.svg';
import inventoriesLogo from '#resources/palikaicons/inventories.svg';
import carLogo from '#resources/palikaicons/resource.svg';
import incidentLogo from '#resources/palikaicons/incident.svg';
import simulationLogo from '#resources/palikaicons/simulation.svg';
import dashboardLogo from '#resources/palikaicons/dashboard.svg';
import myreport from '#resources/palikaicons/drrmreport.svg';
import Gt from '../utils';

import {
    userSelector,
    palikaRedirectSelector,
    generalDataSelector,
    palikaLanguageSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    drrmRegionSelector,
    drrmProgresSelector,
} from '#selectors';
import {
    setGeneralDataAction,
    setBudgetDataAction,
    setBudgetIdAction,
    setDrrmRegionAction,
} from '#actionCreators';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Icon from '#rscg/Icon';
import Translations from '../Translations';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';

const mapStateToProps = (state, props) => ({
    user: userSelector(state),
    palikaRedirect: palikaRedirectSelector(state),
    generalData: generalDataSelector(state),
    palikaLanguage: palikaLanguageSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    drrmRegion: drrmRegionSelector(state),
    drrmProgress: drrmProgresSelector(state),
    drrmLanguage: palikaLanguageSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setGeneralDatapp: params => dispatch(setGeneralDataAction(params)),
    setBudgetDatapp: params => dispatch(setBudgetDataAction(params)),
    setBudgetId: params => dispatch(setBudgetIdAction(params)),
    setDrrmRegion: params => dispatch(setDrrmRegionAction(params)),
});

const icons = [
    generalLogo,
    budgetLogo,
    budgetActivityLogo,
    programAndPolicyLogo,
    organisationLogo,
    inventoriesLogo,
    carLogo,
    contactsLogo,
    incidentLogo,
    simulationLogo,
];

const allRepIcons = [
    dashboardLogo,
    myreport,
];
const menuItems: {
    key: number;
    content: string;
    contentNp: string;
    url?: string;
}[] = [
    {
        key: 0,
        content: 'General',
        contentNp: 'सामान्य',
    },
    {
        key: 1,
        content: 'Budget',
        contentNp: 'बजेट',
    },
    {
        key: 2,
        content: 'Budget Activity',
        contentNp: 'बजेट गतिविधि',
    },
    {
        key: 3,
        content: 'Programme and Policies',
        contentNp: 'नीति तथा कार्यक्रमहरू',
    },
    {
        key: 4,
        content: 'Organisation',
        contentNp: 'संस्था',
    },
    {
        key: 5,
        content: 'Inventories',
        contentNp: 'सूची',
    },
    {
        key: 6,
        content: 'Resources',
        contentNp: 'स्रोतहरू',
    },
    {
        key: 7,
        content: 'Contacts',
        contentNp: 'सम्पर्क',
    },
    {
        key: 8,
        content: 'Incident and Relief',
        contentNp: 'घटना तथा राहत',
    },
    {
        key: 9,
        content: 'Simulation',
        contentNp: 'अनुकरण',
    },
    {
        key: 10,
        content: 'Create Report',
        contentNp: 'प्रतिवेदन बनाउनुहोस्',
    },
];


const Sidebar = (props) => {
    const [selectedSubmenu, setSelectedSubmenu] = useState([]);
    const [selectedMenuId, setSelectedMenuId] = useState(1);
    const [isSubmenuClicked, setIsSubmenuClicked] = useState(true);
    const [isIndicatorClicked, setIsIndicatorClicked] = useState(true);
    const [selectedSubMenuId, setSelectedSubMenuId] = useState(1);
    const [initialRender, setInitialRender] = useState(true);
    const [showErr, setShowErr] = useState(false);
    const [menuSlug, setMenuSlug] = useState('');
    const [subMenuSlug, setSubMenuSlug] = useState('');
    const [newRegionValues, setNewRegionValues] = useState(undefined);
    const [disableFilterButton, setDisableFilterButton] = useState(true);
    // eslint-disable-next-line react/prop-types
    // eslint-disable-next-line @typescript-eslint/camelcase
    const {
        municipalityName,
        municipalityName: { title_en, title_np },
        showReportEdit,
        handleMenuClick,
        selectedTab,
        generalData,
        handleAddButton,
        palikaLanguage,
        provinces,
        districts,
        municipalities,
        user,
        setGeneralDatapp,
        drrmRegion,
        setDrrmRegion,
        drrmProgress,
        drrmLanguage,

    } = props;
    useEffect(() => {
        setShowErr(props.showErr);
    }, [props.showErr]);
    const handleMenuItemClick = (menuItem: number) => {
        if (generalData && generalData.fiscalYear) {
            handleMenuClick(menuItem);
            setShowErr(false);
            props.handleShowErr(false);
        } else {
            props.handleShowErr(true);
            setShowErr(true);
        }
    };

    const Data1 = [{
        id: 1,
        title: 'Palika Reports',
        slug: 'palika-reports',
        components: [
            { id: 1,
                title: <Gt section={Translations.dashboardSidebarAllTitle} />,
                url: '/disaster-profile/',
                slug: 'all-reports' },
        // eslint-disable-next-line @typescript-eslint/camelcase
            { id: 2,
            // eslint-disable-next-line @typescript-eslint/camelcase
                title: <Gt section={Translations.dashboardSidebarMunTitle} />,
                url: '/disaster-profile/',
                slug: 'my-reports' }],
    },
    ];

    const Data2 = [{
        id: 1,
        title: <Gt section={Translations.dashboardSidebarMunTitle} />,
        slug: 'palika-reports',
        components: [{ id: 1,
            title: <Gt section={Translations.dashboardSidebarAllTitle} />,
            url: '/disaster-profile/',
            slug: 'all-reports' },
        // eslint-disable-next-line @typescript-eslint/camelcase
        ],
    },
    ];

    const Data = municipalityName ? Data1 : Data2;
    const handleMyPalikaClick = () => {
        props.handleMyPalikaSelect(true);
    };
    const handleMyPalikaClickReport = () => {
        props.handleMyPalikaSelect(false);
    };
    const handleSelectMenu = (index, id, name) => {
        setSelectedSubmenu(Data[index].components);
        setIsSubmenuClicked(true);
        setSelectedMenuId(id);
        setInitialRender(false);
        props.getmenuId(id);
        // props.getsubmenuId(null);
    };
    const handleSelectSubmenu = (id, url, title, slug, menumainSlug) => {
        setSelectedSubMenuId(id);
        setIsIndicatorClicked(true);
        props.urlData(url);
        props.getsubmenuId(id);
        props.getsubmenuTitle(title);
        setMenuSlug(menumainSlug);
        setSubMenuSlug(slug);
        // ReachRouter.navigate(`/palika-report/#/${menuSlug}/${slug}/`);
    };

    useEffect(() => {
        if (selectedSubMenuId) {
            props.getsubmenuId(selectedSubMenuId);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSubMenuId]);

    // if (menuSlug) {
    //     const Test = Data.filter(item => item.slug === menuSlug);
    //     const finalTest = Test.components.filter(item => item.slug === subMenuSlug);
    // }

    useEffect(() => {
        const InitialRender = () => {
            if (!initialRender) {
                setIsIndicatorClicked(false);

                // setSelectedSubMenuId(1);

                // const linkUrl = selectedSubmenu.filter(item => item.id
                //     === selectedSubMenuId).map(item => item.url);
                // props.urlData(linkUrl[0]);
            }
        };
        InitialRender();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMenuId]);
    const handleAdd = () => {
        handleAddButton(true, true, true);
    };
    const handleFormRegion = (Values) => {
        setNewRegionValues(Values);
        setDisableFilterButton(false);
    };
    const getRegionDetails = ({ adminLevel, geoarea } = {}) => {
        if (adminLevel === 1) {
            return {
                province: provinces.find(p => p.id === geoarea).id,
                district: undefined,
                municipality: undefined,
            };
        }

        if (adminLevel === 2) {
            const districtObj = districts.find(d => d.id === geoarea);
            const district = districtObj.id;
            const { province } = district;
            return {
                province,
                district,
                municipality: undefined,
            };
        }

        if (adminLevel === 3) {
            const municipalityObj = municipalities.find(m => m.id === geoarea);
            const municipality = municipalityObj.id;
            const { district } = municipalityObj;
            const { province } = districts.find(d => d.id === district);
            return {
                province,
                district,
                municipality,
            };
        }
        return '';
    };

    const handleCheckFilterDisableButtonForProvince = (province) => {
        setDrrmRegion({
            ...drrmRegion,
            province,
        });
    };
    const handleCheckFilterDisableButtonForDistrict = (district) => {
        setDrrmRegion({
            ...drrmRegion,
            district,
        });
    };
    const handleCheckFilterDisableButtonForMunicipality = (municipality) => {
        setDrrmRegion({
            ...drrmRegion,
            municipality,
        });
    };

    return (
        <div>

            {showReportEdit

            && (
                <div className={styles.breadcrumbRow}>
                    <button
                        className={styles.breadcrumb}
                        type="button"
                        onClick={handleMyPalikaClick}
                    >
                        <Gt section={Translations.breadcrumb1} />

                         &gt;

                    </button>
                    <button
                        className={_cs(styles.breadcrumb, styles.rightCrumb)}
                        type="button"
                        onClick={handleMyPalikaClickReport}
                    >
                        <Gt section={Translations.breadcrumb2} />


                    </button>
                </div>
            )
            }


            {
                !showReportEdit
                && (
                    <div className={styles.reportSidebarMainContainer}>
                        <ul className={styles.menuList}>
                            {Data.map((item, i) => (
                                <li>
                                    <button
                                        className={styles.menu}
                                        type="button"
                                        key={item.id}
                                        onClick={() => handleSelectMenu(i, item.id)}
                                    >
                                        {isSubmenuClicked && selectedMenuId === item.id
                                            ? item.components.map((data, index) => (
                                                <button
                                                    type="button"
                                                    className={
                                                        isIndicatorClicked
                                                             && selectedSubMenuId === data.id
                                                            ? styles.selected
                                                            : styles.notSelected}

                                                    onClick={() => handleSelectSubmenu(data.id,
                                                        data.url, data.title, data.slug, item.slug)}
                                                >
                                                    <span className={styles.iconandMenu}>

                                                        <ScalableVectorGraphics
                                                            className={styles.bulletPoint}
                                                            src={allRepIcons[data.id - 1]}
                                                            alt="Bullet Point"
                                                        />
                                                        {
                                                            data.id === 2 && palikaLanguage.language === 'en'
                                                                ? title_en
                                                                : ''
                                                        }
                                                        {
                                                            data.id === 2 && palikaLanguage.language === 'np'
                                                                ? title_np
                                                                : ''
                                                        }
                                                        {' '}
                                                        {data.title}
                                                    </span>
                                                </button>
                                            ))
                                            : ''
                                        }


                                    </button>
                                </li>
                            ))}

                        </ul>
                        <div className={styles.addButnDiv}>
                            {selectedSubMenuId === 2
&& (
    <button
        type="submit"
        className={styles.addButn}
        onClick={handleAdd}
    >
        <Gt section={Translations.dashboardReportGenerateButton} />
        {' '}

    </button>
)
                            }
                            {user && user.isSuperuser
&& (
    <>

        <div className={styles.inputContainer}>
            <h5><Gt section={Translations.dashboardSidebarSelectMunicipalityHeader} /></h5>
            <StepwiseRegionSelectInput

                className={
                    styles.stepwiseRegionSelectInput}
                faramElementName="region"
                wardsHidden
                onChange={handleFormRegion}
                checkProvince={handleCheckFilterDisableButtonForProvince}
                checkDistrict={handleCheckFilterDisableButtonForDistrict}
                checkMun={handleCheckFilterDisableButtonForMunicipality}
                // reset={resetFilterProps}
                provinceInputClassName={styles.snprovinceinput}
                districtInputClassName={styles.sndistinput}
                municipalityInputClassName={styles.snmuniinput}
            />


        </div>
        <div className={styles.butnDiv}>
            <button
                type="submit"
                className={styles.addButn}
                onClick={handleAdd}
                disabled={!drrmRegion.municipality}
            >
                <Gt section={Translations.dashboardReportGenerateButton} />
                {' '}

            </button>
        </div>


    </>
)
                            }
                        </div>
                    </div>
                )
            }

            {
                showReportEdit
                && (
                    <div className={styles.reportSidebarMainContainer}>
                        <h2>
                            <Gt section={Translations.sidebarTitle} />

                            {' '}
                            <Icon
                                name="info"
                                className={styles.infoIcon}
                                title="This module in the BIPAD portal will generate
                                Disaster Risk Reduction and Management Report
                                for each fiscal year for all three tiers of the governments.


                                DRRM Act, 2074 and its regulation, 2076 mandates the
                                Local Disaster Management Committee, Disaster Management
                                Committee, Provincial Disaster Management Executive Committee,
                                and NDRRMA to prepare an Annual DRRM Report that includes
                                information on the activities conducted by the respective
                                committees each fiscal year. To aid this mandate, the
                                reporting module will include general information of
                                the chosen location, organizations working on disaster
                                management, DRR policy-related work, the budget allocated
                                and activities for DRRM, and available inventories, and
                                other DRR related information.
                                The report will also monitor and track activities
                                based on the priorities set by the DRR National Strategic Action Plan 2018-2030.
                                "


                            />

                        </h2>
                        <ul className={styles.menuList}>
                            {menuItems.map((item) => {
                                if (item.key < menuItems.length - 1) {
                                    return (
                                        <li>
                                            <button
                                                key={item.key}
                                                className={selectedTab === item.key ? styles.selected : styles.notSelected}
                                                onClick={() => handleMenuItemClick(item.key)}
                                                type="button"
                                                disabled={drrmProgress < item.key}
                                            >
                                                <span className={styles.iconandMenu}>

                                                    <ScalableVectorGraphics
                                                        className={styles.bulletPoint}
                                                        src={icons[item.key]}
                                                        alt="Bullet Point"
                                                    />
                                                    {
                                                        drrmLanguage.language === 'en'
                                                            ? item.content
                                                            : item.contentNp
                                                    }
                                                </span>
                                                <span>
                                                    {
                                                        drrmProgress >= item.key

                                                            ? (
                                                                <Icon
                                                                    name="check"
                                                                    className={styles.progressDone}
                                                                />
                                                            )
                                                            : (
                                                                <Icon
                                                                    name="circle"
                                                                    className={drrmProgress + 1 === item.key
                                                                        ? styles.progressOngoing
                                                                        : styles.progressNotDone}
                                                                />
                                                            )
                                                    }


                                                </span>


                                            </button>
                                        </li>
                                    );
                                }
                                return (
                                    <li>
                                        <button
                                            key={item.key}
                                            className={
                                                drrmProgress === 9
                                                    ? styles.createReportDisabled
                                                    : styles.createReport
                                            }
                                            onClick={() => handleMenuItemClick(item.key)}
                                            type="button"
                                            disabled={drrmProgress === item.key}
                                        >

                                            {
                                                drrmLanguage.language === 'en'
                                                    ? item.content
                                                    : item.contentNp
                                            }

                                            {/* <Icon
                                                name="info"
                                                // className={styles.infoIcon}
                                                title=" DRR fund of the municipality is part of the total
                                                            municipal budget of this fiscal year which is specifically
                                                            separated for DRRM related
                                                             activities"
                                            /> */}

                                        </button>
                                    </li>

                                );
                            })}
                            {
                                showErr
                                    && (
                                        <span className={styles.error}>
                                            <Gt section={Translations.validationErrSidebar} />
                                        </span>
                                    )}
                        </ul>
                    </div>
                )
            }
        </div>

    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    Sidebar,
);
