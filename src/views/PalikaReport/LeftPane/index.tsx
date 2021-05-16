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
    content: TabContent;
    url?: string;
}[] = [
    {
        key: 0,
        content: 'General',
        url: '/municipality-contact/',
    },
    {
        key: 1,
        content: 'Budget',
        url: '/annual-budget/',
    },
    {
        key: 2,
        content: 'Budget Activity',
        url: '/annual-budget-activity/',
    },
    {
        key: 3,
        content: 'Programme and Policies',
        url: '/annual-policy-program/',
    },
    {
        key: 4,
        content: 'Organisation',
        url: '/resource/',
    },
    {
        key: 5,
        content: 'Inventories',
        url: '',
    },
    {
        key: 6,
        content: 'Resources',
        url: '',
    },
    {
        key: 7,
        content: 'Contacts',
        url: '',
    },
    {
        key: 8,
        content: 'Incident and Relief',
        url: '',
    },
    {
        key: 9,
        content: 'Simulation',
        url: '/simulation/',
    },
    {
        key: 10,
        content: 'Create Report',
        url: '',
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
    console.log('This user>>>', user);
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
    console.log('This is what>>>', selectedSubMenuId);
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
        console.log(province);
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
    console.log('drrm region:', drrmRegion);
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
                        My Palika Report &gt;

                    </button>
                    <button
                        className={_cs(styles.breadcrumb, styles.rightCrumb)}
                        type="button"
                        onClick={handleMyPalikaClickReport}
                    >
                        Add a report

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
 + Add New Report
        {' '}

    </button>
)
                            }
                            {user && user.isSuperuser
&& (
    <>

        <div className={styles.inputContainer}>
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
 + Add New Report
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
Create a Report
                            {' '}
                            <Icon
                                name="info"
                                className={styles.infoIcon}
                                title=" DRR fund of the municipality is part of the total
                                                            municipal budget of this fiscal year which is specifically
                                                            separated for DRRM related
                                                             activities"
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
                                                    {item.content}
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
                                                drrmProgress === item.key
                                                    ? styles.createReport
                                                    : styles.createReportDisabled
                                            }
                                            onClick={() => handleMenuItemClick(item.key)}
                                            type="button"
                                            disabled={drrmProgress < item.key}
                                        >

                                            {item.content}

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
                                            Please Enter Valid Fiscal Year from General Section
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
