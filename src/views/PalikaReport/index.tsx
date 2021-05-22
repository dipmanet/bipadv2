/* eslint-disable max-len */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import Sidebar from './LeftPane';
import Page from '#components/Page';
import styles from './styles.scss';
import RightPane from './RightPane';
import Modal from '#rscv/Modal';
import Translations from './Translations';
import Gt from './utils';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import { provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    userSelector,
    palikaRedirectSelector,
    palikaLanguageSelector } from '#selectors';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';

import { setPalikaLanguageAction, setPalikaRedirectAction } from '#actionCreators';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';

import PalikaReportTable from './RightPane/Dashboard/PalikaReportTable';
import TopBar from './RightPane/TopBar';

interface Props {

}
const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    user: userSelector(state),
    palikaRedirect: palikaRedirectSelector(state),
    palikaLanguage: palikaLanguageSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setPalikaRedirect: params => dispatch(setPalikaRedirectAction(params)),
    setPalikaLanguage: params => dispatch(setPalikaLanguageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    PalikaReportGetRequest: {
        url: ({ params }) => `${params.url}`,
        query: ({ params }) => {
            if (params && params.submitQuery) {
                return {
                    province: params.submitQuery.province,
                    district: params.submitQuery.district,
                    municipality: params.submitQuery.municipality,
                    limit: params.page,
                    offset: params.offset,

                };
            }
            // eslint-disable-next-line @typescript-eslint/camelcase
            return { limit: params.page,
                offset: params.offset,

                municipality: params.municipality,
                expand: params.expand };
        },
        method: methods.GET,
        onMount: true,

        onSuccess: ({ response, params }) => {
            let drrmReportList = [];
            const drrmReportsResponse = response;
            drrmReportList = drrmReportsResponse.results;
            if (params && params.annualBudget) {
                params.annualBudget(drrmReportList);
            }
            if (params && params.paginationParameters) {
                params.paginationParameters(response);
            }
        },
    },
    FiscalYearFetch: {
        url: '/nepali-fiscal-year/',
        method: methods.GET,
        onMount: true,

        onSuccess: ({ response, params }) => {
            let drrmReportList = [];
            const drrmReportsResponse = response;
            drrmReportList = drrmReportsResponse.results;
            params.fiscalYear(drrmReportList);
        },
    },

};
let finalArr = [];

const PalikaReport: React.FC<Props> = (props: Props) => {
    const [showModal, setshowModal] = useState(true);

    const [showReportModal, setShowReportModal] = useState(true);
    const [newRegionValues, setNewRegionValues] = useState(undefined);
    const [filtered, setFiltered] = useState(false);
    const [paginationParameters, setPaginationParameters] = useState();
    const [clearFilter, setClearFilter] = useState(false);
    const [url, setUrl] = useState('/disaster-profile/');
    const [showTabs, setShowTabs] = useState(false);
    const [submenuId, setSubmenuId] = useState(1);
    const [subMenuTitle, setSubMenuTitle] = useState('Disaster Risk Reduction and Management Report');
    const [tableHeader, setTableHeader] = useState([]);
    const [fiscalYear, setFiscalYear] = useState(null);
    const [resetFilterProps, setResetFilterProps] = useState(false);
    const [disableFilterButton, setDisableFilterButton] = useState(true);
    const [fetchedData, setFetechedData] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [isSort, setIsSort] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [showReportEdit, setShowReportEdit] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [showErr, setShowErr] = useState(false);
    const [loader, setLoader] = useState(true);
    const handleFetchedData = (response) => {
        setFetechedData(response);
        setLoader(false);
    };
    const handlePaginationParameters = (response) => {
        setPaginationParameters(response);
    };

    const {
        provinces,
        districts,
        municipalities,
        user,
        setPalikaRedirect,
        palikaRedirect,
        palikaLanguage,
        setPalikaLanguage,
        // filters: { region },

    } = props;
    const {
        language,
    } = palikaLanguage;

    let municipalityName = '';


    if (user && !user.isSuperuser && user.profile && user.profile.municipality) {
        const {
            profile: {
                municipality,

            },
        } = user;

        municipalityName = municipalities.find(item => item.id === municipality);
    }

    const handleFormRegion = (Values) => {
        setNewRegionValues(Values);
        setDisableFilterButton(false);
    };
    const handleFiscalYear = (fiscal) => {
        setFiscalYear(fiscal);
    };
    const { requests: { PalikaReportGetRequest, FiscalYearFetch } } = props;

    PalikaReportGetRequest.setDefaultParams({
        annualBudget: handleFetchedData,
        paginationParameters: handlePaginationParameters,
        url,
        expand: 'updated_by',

    });
    FiscalYearFetch.setDefaultParams({
        fiscalYear: handleFiscalYear,
    });

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


    const handleSubmit = () => {
        if (filtered && newRegionValues !== undefined) {
            setResetFilterProps(true);
            setDateTo('');
            setDateFrom('');
            PalikaReportGetRequest.do({

                submitQuery: getRegionDetails(),

            });
            setClearFilter(true);

            setNewRegionValues({
                adminLevel: undefined,
                geoarea: undefined,
            });
            setDisableFilterButton(true);
        } else {
            PalikaReportGetRequest.do({

                submitQuery: getRegionDetails(newRegionValues),
                dateFrom,
                dateTo,
            });
            setClearFilter(false);
        }
        setFiltered(!filtered);
    };


    useEffect(() => {
        setResetFilterProps(false);
    }, [clearFilter]);


    const handleAddbuttonClick = (ReportModal, showTabs, showReportEdit) => {
        setShowReportModal(ReportModal);
        setShowTabs(showTabs);
        setShowReportEdit(showReportEdit);
    };
    const hideWelcomePage = () => {
        setShowTabs(true);
        setShowReportModal(false);
    };
    const generateUrl = (data) => {
        setUrl(data);
        PalikaReportGetRequest.do({

            url: data,
        });
    };
    const getSubmenuId = (data) => {
        setSubmenuId(data);
        setCurrentPageNumber(1);
        if (user) {
            const {
                profile: {
                    municipality,

                },
            } = user;

            if (data === 2) {
                PalikaReportGetRequest.do({

                    municipality,
                });
            } else {
                PalikaReportGetRequest.do({

                    municipality: null,
                });
            }
        }
    };

    const getMenuId = (menu) => {
    };
    const getSubmenuTitle = (title) => {
        setSubMenuTitle(title);
    };
    useEffect(() => {
        // Example POST method implementation:
        function postData(link = `http://bipaddev.yilab.org.np/api/v1${url}`) {
            // Default options are marked with *
            fetch(link, {
                method: 'OPTIONS',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
            })
                .then((res) => {
                    const headerData = res.json();
                    headerData.then(resp => setTableHeader(resp.actions.GET));
                })
                .catch((err) => {
                });
        }

        postData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    // Finding Header for table data
    const finalTableHeader = Object.keys(tableHeader).map(item => tableHeader[item].label);

    const TableHeaderForTable = finalTableHeader.filter(item => item !== 'ID' && item !== 'Created on'
     && item !== 'Modified on' && item !== 'Remarks'
    && item !== 'Created by'
     && item !== 'Updated by');

    const TableHeaderForMatchingData = Object.keys(tableHeader).filter(item => item !== 'id' && item !== 'createdOn'
    && item !== 'modifiedOn' && item !== 'createdBy' && item !== 'updatedBy' && item !== 'remarks');
    const handleCheckFilterDisableButtonForProvince = (province) => {
        if (!province && !dateFrom) {
            setDisableFilterButton(true);
            PalikaReportGetRequest.do({
                submitQuery: getRegionDetails(),
            });
            setFiltered(false);
        }
        if (province) {
            setDisableFilterButton(false);
            setFiltered(false);
        }
    };
    const handleCheckFilterDisableButtonForDistrict = (district) => {
        if (district) {
            setDisableFilterButton(false);
            setFiltered(false);
        }
    };
    const handleCheckFilterDisableButtonForMunicipality = (municipality) => {
        if (municipality) {
            setDisableFilterButton(false);
            setFiltered(false);
        }
    };

    useEffect(() => {
        if (dateFrom || newRegionValues) {
            setDisableFilterButton(false);
        } else {
            setDisableFilterButton(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateFrom]);

    const handleSortTitle = (isSort) => {
        setFetechedData([]);
        setIsSort(isSort);
        if (!isSort) {
            const data = fetchedData.sort(function (a, b) {
                return a.municipality - b.municipality;
            });
            setFetechedData(data);
            setSortBy(sortBy);
        } else {
            const data = fetchedData.sort(function (a, b) {
                return b.municipality - a.municipality;
            });
            setFetechedData(data);
            setSortBy(sortBy);
        }
    };
    const handleSortProvince = (isSort) => {
        setFetechedData([]);
        setIsSort(isSort);
        if (!isSort) {
            const data = fetchedData.sort(function (a, b) {
                return a.province - b.province;
            });
            setFetechedData(data);
            setSortBy(sortBy);
        } else {
            const data = fetchedData.sort(function (a, b) {
                return b.province - a.province;
            });
            setFetechedData(data);
            setSortBy(sortBy);
        }
    };
    const handleSortDistrict = (isSort) => {
        setFetechedData([]);
        setIsSort(isSort);
        if (!isSort) {
            const data = fetchedData.sort(function (a, b) {
                return a.district - b.district;
            });
            setFetechedData(data);
            setSortBy(sortBy);
        } else {
            const data = fetchedData.sort(function (a, b) {
                return b.district - a.district;
            });
            setFetechedData(data);
            setSortBy(sortBy);
        }
    };
    const handleSortMunicipality = (isSort) => {
        setFetechedData([]);
        setIsSort(isSort);
        if (!isSort) {
            const data = fetchedData.sort(function (a, b) {
                return a.municipality - b.municipality;
            });
            setFetechedData(data);
            setSortBy(sortBy);
        } else {
            const data = fetchedData.sort(function (a, b) {
                return b.municipality - a.municipality;
            });
            setFetechedData(data);
            setSortBy(sortBy);
        }
    };
    const handleSortFiscalYear = (isSort) => {
        setFetechedData([]);
        setIsSort(isSort);
        if (!isSort) {
            const data = fetchedData.sort(function (a, b) {
                return a.fiscalYear - b.fiscalYear;
            });
            setFetechedData(data);
            setSortBy(sortBy);
        } else {
            const data = fetchedData.sort(function (a, b) {
                return b.fiscalYear - a.fiscalYear;
            });
            setFetechedData(data);
            setSortBy(sortBy);
        }
    };
    const handleSortCreatedOn = (isSort) => {
        setFetechedData([]);
        setIsSort(isSort);
        if (!isSort) {
            const data = fetchedData.sort(function (a, b) {
                return new Date(a.createdOn) - new Date(b.createdOn);
            });
            setFetechedData(data);
            setSortBy(sortBy);
        } else {
            const data = fetchedData.sort(function (a, b) {
                return new Date(b.createdOn) - new Date(a.createdOn);
            });
            setFetechedData(data);
            setSortBy(sortBy);
        }
    };
    const handleSortModifiedOn = (isSort) => {
        setFetechedData([]);
        setIsSort(isSort);
        if (!isSort) {
            const data = fetchedData.sort(function (a, b) {
                return new Date(a.modifiedOn) - new Date(b.modifiedOn);
            });
            setFetechedData(data);
            setSortBy(sortBy);
        } else {
            const data = fetchedData.sort(function (a, b) {
                return new Date(b.modifiedOn) - new Date(a.modifiedOn);
            });
            setFetechedData(data);
            setSortBy(sortBy);
        }
    };

    const handleMyPalikaSelect = () => {
        setShowReportEdit(false);
    };
    const handleTabSelect = (tab: number) => {
        setSelectedTab(tab);
        setPalikaRedirect({ redirectTo: tab });
    };

    const handleMenuClick = (menuId: number) => {
        setSelectedTab(menuId);
        setPalikaRedirect({ redirectTo: menuId });
    };

    const handleShowErr = (data) => {
        setShowErr(data);
    };

    useEffect(() => {
        if (palikaRedirect.redirectTo > -1) {
            setshowModal(false);
            setShowReportEdit(true);
            setSelectedTab(palikaRedirect.redirectTo);
        }
    }, [palikaRedirect.redirectTo]);


    useEffect(() => {
        if (fetchedData && fiscalYear) {
            const finalfetchedData = fetchedData.map((item, i) => {
                const provinceDetails = provinces.find(data => data.id === item.province);
                const districtDetails = districts.find(data => data.id === item.district);

                const fiscalYears = fiscalYear.find(data => data.id === item.fiscalYear);


                const municipalityDetails = municipalities
                    .find(data => data.id === item.municipality);
                const createdDate = `${(new Date(item.createdOn)).getFullYear()
                }-${(new Date(item.createdOn)).getMonth() + 1
                }-${new Date(item.createdOn).getDate()}`;
                const modifiedDate = `${(new Date(item.modifiedOn)).getFullYear()
                }-${(new Date(item.modifiedOn)).getMonth() + 1
                }-${new Date(item.modifiedOn).getDate()}`;
                if (municipalityDetails) {
                    return { municipality: municipalityDetails.title_en,
                        municipalityNp: municipalityDetails.title_ne,
                        province: provinceDetails.title_en,
                        provinceNp: provinceDetails.title_ne,
                        district: districtDetails.title_en,
                        districtNp: districtDetails.title_ne,
                        fiscalYear: item.fiscalYear && fiscalYears.titleEn,
                        fiscalYearNp: item.fiscalYear && fiscalYears.titleNp,
                        createdDate: item.createdOn && createdDate,
                        modifiedDate: item.modifiedOn && modifiedDate,
                        item };
                }
                if (!provinceDetails) {
                    return {
                        item,
                    };
                }

                return null;
            });

            finalArr = [...new Set(finalfetchedData)];
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSort, submenuId, fetchedData, fiscalYear, language]);


    const closeModal = () => {
        setshowModal(false);
    };
    const handleLangButton = () => {
        if (language === 'en') {
            setPalikaLanguage({ language: 'np' });
        } else {
            setPalikaLanguage({ language: 'en' });
        }
    };
    return (
        <>
            <Page hideMap hideFilter />
            {
                showModal
                    && (
                        <Modal>
                            <div className={styles.firstPageContainer}>
                                <div className={styles.languageButton}>
                                    <button
                                        onClick={handleLangButton}
                                        className={language === 'en' ? _cs(styles.engButton, styles.selectedLanguage) : styles.engButton}
                                        type="button"


                                    >
                      EN
                                    </button>
                                    <button
                                        onClick={handleLangButton}
                                        className={language === 'np' ? _cs(styles.nepButton, styles.selectedLanguage) : styles.nepButton}

                                        type="button"
                                    >
                      ने
                                    </button>
                                </div>
                                <div className={styles.title}>
                                    <Gt section={Translations.welcomeNoteparagraph1} />
                                </div>
                                <p className={styles.description}>
                                    <Gt section={Translations.welcomeNoteparagraph2} />
                                </p>
                                <p className={styles.description}>
                                    <Gt section={Translations.welcomeNoteparagraph3} />
                                </p>
                                <p className={styles.description}>
                                    <Gt section={Translations.welcomeNoteparagraph4} />
                                </p>

                                <p className={_cs(styles.description, styles.lastLine)}>
                                    <Gt section={Translations.welcomeNoteparagraph5} />
                                </p>

                                <div className={styles.btnContainer}>
                                    <PrimaryButton
                                        type="button"
                                        className={styles.agreeBtn}
                                        onClick={closeModal}
                                    >
                                        <Gt section={Translations.proceedButton} />
                                    </PrimaryButton>
                                </div>

                            </div>
                        </Modal>
                    )


            }
            <div className={styles.reportContainer}>
                <div className={styles.leftContainer}>
                    <div className={styles.heading}>
                        <div className={styles.bipad}>
                        BIPAD

                        </div>
                        <div className={styles.report}>
                        DRRM Report
                        </div>

                    </div>
                    <div className={styles.sidebar}>
                        <Sidebar
                            urlData={generateUrl}
                            getsubmenuId={getSubmenuId}
                            getmenuId={getMenuId}
                            getsubmenuTitle={getSubmenuTitle}
                            municipalityName={municipalityName}
                            showReportEdit={showReportEdit}
                            selectedTab={selectedTab}
                            handleMenuClick={handleMenuClick}
                            handleMyPalikaSelect={handleMyPalikaSelect}
                            showErr={showErr}
                            handleShowErr={handleShowErr}
                            handleAddButton={handleAddbuttonClick}
                        />

                    </div>


                </div>
                <div className={styles.rightContainer}>
                    <>
                        <TopBar />
                        <div className={styles.mainData}>
                            {
                                showReportEdit
                                && (
                                    <div className={styles.reportEditingSection}>
                                        <RightPane
                                            showTabs={showTabs}
                                            setShowTabs={handleAddbuttonClick}
                                            showReportModal={showReportModal}
                                            hideWelcomePage={hideWelcomePage}
                                            setShowReportModal={setShowReportModal}
                                            getTabSelected={handleTabSelect}
                                            selectedTab={selectedTab}
                                            handleShowErr={handleShowErr}
                                            showErr={showErr}
                                        />

                                    </div>
                                )
                            }

                            {
                                !showReportEdit
                                && (
                                    <>
                                        <div className={styles.rightContainerHeading}>
                                            {submenuId === 2 ? <h1>{subMenuTitle}</h1> : (
                                                <h1>
                                                    <Gt section={Translations.dashBoardHeading} />
                                                </h1>
                                            )
                                            }

                                        </div>
                                        {submenuId === 1
                         && (
                             <div className={styles.rightContainerFilters}>
                                 <div className={styles.inputContainer}>
                                     <StepwiseRegionSelectInput
                                         className={
                                             _cs(styles.activeView, styles.stepwiseRegionSelectInput)}
                                         faramElementName="region"
                                         wardsHidden
                                         onChange={handleFormRegion}
                                         checkProvince={handleCheckFilterDisableButtonForProvince}
                                         checkDistrict={handleCheckFilterDisableButtonForDistrict}
                                         checkMun={handleCheckFilterDisableButtonForMunicipality}
                                         reset={resetFilterProps}
                                         provinceInputClassName={styles.snprovinceinput}
                                         districtInputClassName={styles.sndistinput}
                                         municipalityInputClassName={styles.snmuniinput}
                                     />
                                 </div>


                                 {!showReportEdit && submenuId === 1 && filtered ? (
                                     <button
                                         type="submit"
                                         className={styles.submitBut}
                                         onClick={handleSubmit}
                                     >
                                         <Gt section={Translations.dashboardReset} />

                                     </button>
                                 )
                                     : !showReportEdit && submenuId === 1 && (
                                         <button
                                             type="submit"
                                             onClick={handleSubmit}
                                             className={
                                                 disableFilterButton
                                                     ? styles.submitButDisabled : styles.submitBut}
                                             disabled={disableFilterButton}
                                         >
                                             <Gt section={Translations.dashboardFilter} />
                                         </button>
                                     )

                                 }


                             </div>
                         )}
                                        {loader
                                            ? (
                                                <>
                                                    {' '}
                                                    <Loader
                                                        top="50%"
                                                        left="60%"
                                                    />
                                                    <p className={styles.loaderInfo}>Loading...Please Wait</p>
                                                </>
                                            ) : (
                                                <div className={styles.rightContainerTables}>

                                                    <PalikaReportTable
                                                        tableData={finalArr}
                                                        paginationData={paginationParameters}
                                                        tableHeader={TableHeaderForTable}
                                                        tableHeaderDataMatch={TableHeaderForMatchingData}
                                                        submenuId={submenuId}
                                                        sortTitle={handleSortTitle}
                                                        sortProvince={handleSortProvince}
                                                        sortDistrict={handleSortDistrict}
                                                        sortMunicipality={handleSortMunicipality}
                                                        sortFiscalYear={handleSortFiscalYear}
                                                        sortCreatedOn={handleSortCreatedOn}
                                                        sortModifiedOn={handleSortModifiedOn}
                                                        currentPage={currentPageNumber}
                                                        setShowTabs={handleAddbuttonClick}
                                                    />
                                                </div>
                                            )}
                                    </>
                                )
                            }
                        </div>
                    </>
                </div>
            </div>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            PalikaReport,
        ),
    ),
);
