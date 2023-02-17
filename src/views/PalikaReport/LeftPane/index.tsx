/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';

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
import SidebarMenu from '#views/PalikaReport/Constants/MenuItems';
import * as PageTypes from '#store/atom/page/types';
import { User } from '#store/atom/auth/types';
import { AppState } from '#store/types';

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
    setDrrmProgressAction,
    setPalikaRedirectAction,
} from '#actionCreators';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Icon from '#rscg/Icon';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';
import Translations from '../Constants/Translations';
import Gt from '../utils';
import styles from './styles.scss';


const mapStateToProps = (state: AppState) => ({
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

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setGeneralDatapp: params => dispatch(setGeneralDataAction(params)),
    setBudgetDatapp: params => dispatch(setBudgetDataAction(params)),
    setBudgetId: params => dispatch(setBudgetIdAction(params)),
    setDrrmRegion: params => dispatch(setDrrmRegionAction(params)),
    setProgress: params => dispatch(setDrrmProgressAction(params)),
    setPalikaRedirect: params => dispatch(setPalikaRedirectAction(params)),
});

interface MenuItems {
    key: number;
    content: string;
    contentNp: string;
}

interface MunicipalityName {
    title_en: string;
    title_ne: string;
}

interface PropsFromDispatch {
    setGeneralDatapp: typeof setGeneralDataAction;
    setBudgetDatapp: typeof setBudgetDataAction;
    setBudgetId: typeof setBudgetIdAction;
    setDrrmRegion: typeof setDrrmRegionAction;
}


interface Props {
    municipalityName: MunicipalityName;
    showReportEdit: boolean;
    handleMenuClick: (menuItems: MenuItems[]) => void;
    selectedTab: number;
    generalData: PageTypes.GeneralData;
    handleAddButton: (a: boolean, b: boolean, c: boolean) => void;
    palikaLanguage: PageTypes.PalikaLanguage;
    provinces: PageTypes.Province[];
    districts: PageTypes.District[];
    municipalities: PageTypes.Municipality[];
    user: User;
    drrmRegion: PageTypes.DrrmRegion;
    drrmLanguage: PageTypes.PalikaLanguage;
    showErr: boolean;
    errFromProps: boolean;
    handleShowErr: (a: boolean) => void;
    handleMyPalikaSelect: (a: boolean) => void;
    getmenuId: (a: number) => void;
    urlData: (a: string) => void;
    getsubmenuId: (a: number) => void;
    getsubmenuTitle: (a: string) => void;
}

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

const {
    menuItems,
    Data1,
    Data2,
} = SidebarMenu;


const Sidebar = (props: Props) => {
    const [selectedMenuId, setSelectedMenuId] = useState(1);
    const [isSubmenuClicked, setIsSubmenuClicked] = useState(true);
    const [isIndicatorClicked, setIsIndicatorClicked] = useState(true);
    const [selectedSubMenuId, setSelectedSubMenuId] = useState(1);
    const [initialRender, setInitialRender] = useState(true);
    const [showErr, setShowErr] = useState(false);
    const {
        municipalityName,
        municipalityName: { title_en, title_ne },
        showReportEdit,
        handleMenuClick,
        selectedTab,
        generalData,
        handleAddButton,
        palikaLanguage,
        user,
        drrmRegion,
        setDrrmRegion,
        drrmProgress,
        drrmLanguage,
        subMenuId,
        setGeneralDatapp,
        showErr: errFromProps,
        handleShowErr,
        urlData,
        getsubmenuId,
        getsubmenuTitle,
        handleMyPalikaSelect,
        handlesubMenuId,
        setProgress,
        setPalikaRedirect,
    } = props;

    useEffect(() => {
        setShowErr(errFromProps);
    }, [errFromProps]);

    const handleMenuItemClick = (menuItem: MenuItems[]) => {
        if (generalData && generalData.fiscalYear) {
            handleMenuClick(menuItem);
            setShowErr(false);
            handleShowErr(false);
        } else {
            handleShowErr(true);
            setShowErr(true);
        }
    };


    const Data = municipalityName ? Data1 : Data2;
    const handleMyPalikaClick = () => {
        handleMyPalikaSelect(true);
        setSelectedSubMenuId(1);
        getsubmenuId(1);
        setProgress(-1);
        setPalikaRedirect({
            redirectTo: -2,
        });
    };

    const handleMyPalikaClickReport = () => {
        handleMyPalikaSelect(false);
    };
    const handleSelectMenu = (index, id, name) => {
        setIsSubmenuClicked(true);
        setSelectedMenuId(id);
        setInitialRender(false);
        props.getmenuId(id);
    };
    const handleSelectSubmenu = (id, url, title) => {
        setSelectedSubMenuId(id);
        setIsIndicatorClicked(true);
        urlData(url);
        getsubmenuId(id);
        getsubmenuTitle(title);
    };

    useEffect(() => {
        if (selectedSubMenuId) {
            getsubmenuId(selectedSubMenuId);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSubMenuId]);

    useEffect(() => {
        const InitialRender = () => {
            if (!initialRender) {
                setIsIndicatorClicked(false);
            }
        };
        InitialRender();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMenuId]);
    const handleAdd = () => {
        handleAddButton(true, true, true);
        setGeneralDatapp({});
    };

    const handleCheckFilterDisableButtonForProvince = (province: string) => {
        setDrrmRegion({
            ...drrmRegion,
            province,
        });
    };
    const handleCheckFilterDisableButtonForDistrict = (district: string) => {
        setDrrmRegion({
            ...drrmRegion,
            district,
        });
    };
    const handleCheckFilterDisableButtonForMunicipality = (municipality: string) => {
        setDrrmRegion({
            ...drrmRegion,
            municipality,
        });
    };

    return (
        <div>
            {showReportEdit
                && (
                    <>
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

                        <div className={styles.reportSidebarMainContainer}>
                            <h2>
                                <Gt section={Translations.sidebarTitle} />

                                {' '}
                                <Icon
                                    name="info"
                                    className={styles.infoIcon}
                                    title={drrmLanguage.language === 'np' ? Translations.CreateReportInformationButtom.np : Translations.CreateReportInformationButtom.en}
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
                                                                            ? styles.progressNotDone
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
                    </>
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
                                            ? item.components.map(data => (
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
                                                                ? title_ne
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
                                                checkProvince={handleCheckFilterDisableButtonForProvince}
                                                checkDistrict={handleCheckFilterDisableButtonForDistrict}
                                                checkMun={handleCheckFilterDisableButtonForMunicipality}
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

        </div>

    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    Sidebar,
);
