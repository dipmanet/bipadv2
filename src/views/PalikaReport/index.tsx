/* eslint-disable max-len */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { reverseRoute, _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Label } from 'semantic-ui-react';
import Sidebar from './components/Sidebar';
import Page from '#components/Page';
import styles from './styles.scss';
import MainModal from './MainModal';
import DateInput from '#rsci/DateInput';
import DropdownMenu from '#rsca/DropdownMenu';
import Modal from '#rscv/Modal';

import PrimaryButton from '#rsca/Button/PrimaryButton';
import DangerButton from '#rsca/Button/DangerButton';
import Icon from '#rscg/Icon';


import { provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    userSelector } from '#selectors';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import PalikaReportTable from './components/palikaReportTable';
import FilterModal from '#components/_Filters/FilterModal';
import DashboardFilter from '#components/_Filters';

interface Props {

}
const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    user: userSelector(state),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    PalikaReportGetRequest: {
        url: ({ params }) => `${params.url}`,
        query: ({ params, props }) => {
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
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;
            if (params && params.annualBudget) {
                params.annualBudget(citizenReportList);
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
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;
            params.fiscalYear(citizenReportList);
        },
    },

};
let finalArr = [];

const PalikaReport: React.FC<Props> = (props: Props) => {
    const [showModal, setshowModal] = useState(true);

    const [showReportModal, setShowReportModal] = useState(true);
    const [newRegionValues, setNewRegionValues] = useState(undefined);
    const [filtered, setFiltered] = useState(false);
    const [AnnualBudget, setAnnualBudget] = useState([]);
    const [paginationParameters, setPaginationParameters] = useState();
    const [clearFilter, setClearFilter] = useState(false);
    const [url, setUrl] = useState('/disaster-profile/');
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(6);
    const [offset, setOffset] = useState(0);
    const [showTabs, setShowTabs] = useState(false);
    const [menuId, setMenuId] = useState(1);
    const [submenuId, setSubmenuId] = useState(1);
    const [subMenuTitle, setSubMenuTitle] = useState('Disaster Risk Reduction and Management Report');
    const [tableHeader, setTableHeader] = useState([]);
    const [fiscalYear, setFiscalYear] = useState(null);
    const [isFilterButnDisable, setIsFilterButnDisable] = useState(true);
    const [resetFilterProps, setResetFilterProps] = useState(false);
    const [disableFilterButton, setDisableFilterButton] = useState(true);
    const [fetchedData, setFetechedData] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);
    const [municipality, setMunicipality] = useState(null);
    const [isSort, setIsSort] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [showReportEdit, setShowReportEdit] = useState(false);
    const [loggedInMunicipality, setLoggedInMunicipality] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [showErr, setShowErr] = useState(false);

    const handleFetchedData = (response) => {
        setFetechedData(response);
    };
    const handlePaginationParameters = (response) => {
        setPaginationParameters(response);
    };

    const handleCloseModal = () => setShowReportModal(false);
    const {
        provinces,
        districts,
        municipalities,
        user,
        // filters: { region },
    } = props;


    let municipalityName = '';


    if (user && user.profile && user.profile.municipality) {
        const {
            profile: {
                municipality,

            },
        } = user;

        municipalityName = municipalities.find(item => item.id === municipality);
    }
    //  else if (user && user.profile && !user.profile.municipality && user.profile.district) {
    //     const {
    //         profile: {
    //             district,

    //         },
    //     } = user;
    //     loginUserDetails = districts.find(item => item.id === district);
    // }

    const handleFormRegion = (Values) => {
        setNewRegionValues(Values);
        // setFiltered(false);
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
        page: paginationQueryLimit,
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


    const handlePageClick = (e) => {
        const selectedPage = e.selected + 1;
        setOffset((selectedPage - 1) * paginationQueryLimit);
        setCurrentPageNumber(selectedPage);
    };


    const handleAddbuttonClick = () => {
        setShowReportModal(true);
        setShowTabs(true);
        setShowReportEdit(true);
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
        setMenuId(menu);
    };
    const getSubmenuTitle = (title) => {
        setSubMenuTitle(title);
    };
    useEffect(() => {
        // Example POST method implementation:
        function postData(link = `http://bipaddev.yilab.org.np/api/v1${url}`) {
            // Default options are marked with *
            fetch(link, {
                method: 'OPTIONS', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer',
                // no-referrer, *no-referrer-when-downgrade, origin,
                // origin-when-cross-origin, same-origin, strict-origin,
                // strict-origin-when-cross-origin, unsafe-url
            // body: JSON.stringify(data), // body data type must match "Content-Type" header
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

    // if (AnnualBudget.length) {
    //     const test = Object.keys(AnnualBudget[0])
    //         .filter(item => item !== 'id' && item !== 'createdOn'
    //     && item !== 'modifiedOn' && item !== 'createdBy'
    // && item !== 'updatedBy'
    //     && item !== 'Updated by');
    // }

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
    const fetchUrlFromProps = (urlData) => {
        if (urlData) {
            setUrl(urlData);
        }
        return null;
    };

    const changeDateFrom = (dateFrom) => {
        setDateFrom(dateFrom);
        setDisableFilterButton(false);
    };
    useEffect(() => {
        if (dateFrom || newRegionValues) {
            setDisableFilterButton(false);
        } else {
            setDisableFilterButton(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateFrom]);

    const changeDateTo = (dateTo) => {
        setDateTo(dateTo);
    };

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
    };

    const handleMenuClick = (menuId: number) => {
        setSelectedTab(menuId);
    };

    const handleShowErr = (data) => {
        console.log('in main report palika: ', data);
        setShowErr(data);
    };

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
                    return { municipality: municipalityDetails.title,
                        province: provinceDetails.title,
                        district: districtDetails.title,
                        fiscalYear: item.fiscalYear && fiscalYears.titleEn,
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
    }, [isSort, submenuId, fetchedData]);


    const closeModal = () => {
        setshowModal(false);
    };

    return (
        <>
            <Page hideMap hideFilter />


            {
                showModal
                    && (
                        <Modal>
                            {/* <div className={styles.closeBtn}>
                                <DangerButton className={styles.dangerbtn} onClick={closeModal}>
                                    <Icon
                                        name="times"
                                        className={styles.settingsBtn}
                                    />
                                </DangerButton>
                            </div> */}
                            <div className={styles.firstPageContainer}>
                                <div className={styles.title}>
                                Welcome to the DRRM Report Module of the BIPAD Portal
                                </div>
                                <p className={styles.description}>
                                This module in the BIPAD portal will generate Disaster Risk Reduction and Management Report for each fiscal year for all three tiers of the governments.
                                </p>
                                <p className={styles.description}>
                                DRRM Act, 2074 and its regulation, 2076 mandates the government to generate reporting on DRRM. To aid this mandate, the reporting module will include general information of the chosen location, organizations working on disaster management, DRR policy related work, budget allocated for DRRM, and available capacity and resources and other DRR related information.
                                </p>
                                <p className={styles.description}>
                                The report will also monitor and track activities
                                based on the priorities set by the DRR National
                                Strategic Action Plan 2018-2030.
                                </p>

                                <p className={_cs(styles.description, styles.lastLine)}>
                                Click proceed to generate the report for your region.

                                </p>

                                <div className={styles.btnContainer}>
                                    <PrimaryButton
                                        type="button"
                                        className={styles.agreeBtn}
                                        onClick={closeModal}
                                    >
                                    PROCEED
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
                        />

                    </div>


                </div>
                <div className={styles.rightContainer}>
                    <>

                        {
                            showReportEdit
                                && (
                                    <div className={styles.reportEditingSection}>
                                        <MainModal
                                            showTabs={showTabs}
                                            setShowTabs={handleAddbuttonClick}
                                            showReportModal={showReportModal}
                                            hideWelcomePage={hideWelcomePage}
                                            setShowReportModal={setShowReportModal}
                                            province={province}
                                            district={district}
                                            municipality={municipality}
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
                                            {submenuId === 2 ? <h1>{subMenuTitle}</h1> : <h1>Disaster Risk Reduction and Management Report</h1>}

                                        </div>

                                        <div className={styles.rightContainerFilters}>
                                            {submenuId === 1
                         && (
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
                         )}

                                            {!showReportEdit && submenuId === 1 && filtered ? (
                                                <button
                                                    type="submit"
                                                    className={styles.submitBut}
                                                    onClick={handleSubmit}
                                                >
                                    Reset
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
                                    Filter
                                                    </button>
                                                )

                                            }
                                            {!showReportEdit && municipalityName && submenuId === 2
                        && (
                            <button
                                type="submit"
                                className={styles.addButn}
                                onClick={handleAddbuttonClick}
                            >
                         + ADD
                                {' '}

                            </button>
                        )}

                                        </div>

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
                                                pageSize={paginationQueryLimit}
                                            />

                                        </div>
                                    </>
                                )
                        }

                    </>
                </div>
            </div>
        </>
    );
};

export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            PalikaReport,
        ),
    ),
);
