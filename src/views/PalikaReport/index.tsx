/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { reverseRoute, _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import Sidebar from './components/Sidebar';
import Page from '#components/Page';
import styles from './styles.scss';
import MainModal from './MainModal';
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
                };
            }


            return { limit: params.page, offset: params.offset };
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


const PalikaReport: React.FC<Props> = (props: Props) => {
    const [showReportModal, setShowReportModal] = useState(true);
    const [newRegionValues, setNewRegionValues] = useState(undefined);
    const [filtered, setFiltered] = useState(false);
    const [AnnualBudget, setAnnualBudget] = useState([]);
    const [paginationParameters, setPaginationParameters] = useState();
    const [clearFilter, setClearFilter] = useState(false);
    const [url, setUrl] = useState('/disaster-profile/');
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(5);
    const [offset, setOffset] = useState(0);
    const [showTabs, setShowTabs] = useState(false);
    const [menuId, setMenuId] = useState();
    const [submenuId, setSubmenuId] = useState();
    const [subMenuTitle, setSubMenuTitle] = useState('All Reports');
    const [tableHeader, setTableHeader] = useState([]);
    const [fiscalYear, setFiscalYear] = useState(null);
    const [isFilterButnDisable, setIsFilterButnDisable] = useState(true);
    const [resetFilterProps, setResetFilterProps] = useState(false);
    const [disableFilterButton, setDisableFilterButton] = useState(true);
    const [fetchedData, setFetechedData] = useState([]);

    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);
    const [municipality, setMunicipality] = useState(null);


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
    if (user && user.profile && !user.profile.municipality) {
        const {
            profile: {
                municipality: municipalityfromProp,
                district: districtfromProp,
                province: provincefromProp,
            },
        } = user;

        setMunicipality(municipalityfromProp);
        setProvince(provincefromProp);
        setDistrict(districtfromProp);
    }
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

    });
    FiscalYearFetch.setDefaultParams({
        fiscalYear: handleFiscalYear,
    });


    let finalArr = [];
    if (fetchedData) {
        const finalfetchedData = fetchedData.map((item, i) => {
            const provinceDetails = provinces.find(data => data.id === item.province);
            const districtDetails = districts.find(data => data.id === item.district);

            const fiscalYears = fiscalYear.find(data => data.id === item.fiscalYear);


            const municipalityDetails = municipalities.find(data => data.id === item.municipality);
            if (municipalityDetails) {
                return { municipality: municipalityDetails.title,
                    province: provinceDetails.title,
                    district: districtDetails.title,
                    fiscalYear: item.fiscalYear && fiscalYears.titleEn,
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
            });
            setClearFilter(false);
        }
        setFiltered(!filtered);
    };


    useEffect(() => {
        setResetFilterProps(false);
    }, [clearFilter]);


    const handlePageClick = (e) => {
        const selectedPage = e.selected;

        setOffset(selectedPage * 2);
    };

    useEffect(() => {
        PalikaReportGetRequest.do({
            offset,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);

    const handleAddbuttonClick = () => {
        setShowReportModal(true);
        setShowTabs(true);
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

    const getSubmenuId = (subMenuid) => {
        setSubmenuId(subMenuid);
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
        if (!province) {
            setDisableFilterButton(true);
            PalikaReportGetRequest.do({
                submitQuery: getRegionDetails(),
            });
            setFiltered(false);
        } else if (province) {
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
        console.log('is working');
        return null;
    };
    console.log('is it success>>>', url);
    return (
        <>
            <Page hideMap hideFilter />

            <MainModal
                showTabs={showTabs}
                setShowTabs={handleAddbuttonClick}
                showReportModal={showReportModal}
                hideWelcomePage={hideWelcomePage}
                setShowReportModal={setShowReportModal}
                province={province}
                district={district}
                municipality={municipality}
            />


            {/* {(menuId === 2 || menuId === 3) && submenuId !== null && showTabs
             && <AddFormModal />} */}


            <div className={styles.reportContainer}>
                <div className={styles.leftContainer}>
                    <div className={styles.heading}>
                        <div className={styles.bipad}>
                        BIPAD
                        </div>

                    </div>
                    <div className={styles.sidebar}>
                        <Sidebar
                            urlData={generateUrl}
                            getsubmenuId={getSubmenuId}
                            getmenuId={getMenuId}
                            getsubmenuTitle={getSubmenuTitle}
                        />

                    </div>


                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.rightContainerHeading}>
                        <h1>{subMenuTitle}</h1>
                    </div>
                    <div className={styles.rightContainerFilters}>
                        {/* <FilterModal /> */}
                        <StepwiseRegionSelectInput
                            className={
                                _cs(styles.activeView, styles.stepwiseRegionSelectInput)}
                            faramElementName="region"
                            wardsHidden
                            onChange={handleFormRegion}
                            checkFilterButtonProvince={handleCheckFilterDisableButtonForProvince}
                            checkFilterButtonDistrict={handleCheckFilterDisableButtonForDistrict}
                            checkFilterButtonMun={handleCheckFilterDisableButtonForMunicipality}
                            reset={resetFilterProps}

                            // initialLoc={{ municipality,
                            //     district,
                            //     province }}
                            provinceInputClassName={styles.snprovinceinput}
                            districtInputClassName={styles.sndistinput}
                            municipalityInputClassName={styles.snmuniinput}
                        />
                        {filtered ? (
                            <button
                                type="submit"
                                className={styles.submitBut}
                                onClick={handleSubmit}
                            >
                            Reset
                            </button>
                        )
                            : (
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
                        <button
                            type="submit"
                            className={styles.addButn}
                            onClick={handleAddbuttonClick}
                        >
                         + ADD
                            {' '}

                        </button>

                    </div>
                    <div className={styles.rightContainerTables}>
                        <PalikaReportTable
                            tableData={finalArr}
                            paginationData={paginationParameters}
                            tableHeader={TableHeaderForTable}
                            tableHeaderDataMatch={TableHeaderForMatchingData}

                        />
                        <div className={styles.paginationDownload}>
                            {paginationParameters && paginationParameters.count !== 0
                            && (
                                <ReactHTMLTableToExcel
                                    id="test-table-xls-button"
                                    className={styles.downloadTableXlsButton}
                                    table="table-to-xls"
                                    filename="tablexls"
                                    sheet="tablexls"
                                    buttonText="DOWNLOAD XLS"
                                />
                            )}
                            {paginationParameters && paginationParameters.count !== 0
                            && (
                                <div className={styles.paginationRight}>
                                    <ReactPaginate
                                        previousLabel={'prev'}
                                        nextLabel={'next'}
                                        breakLabel={'...'}
                                        breakClassName={'break-me'}
                                        onPageChange={handlePageClick}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        pageCount={Math.ceil(paginationParameters.count
                                         / paginationQueryLimit)}
                                        containerClassName={styles.pagination}
                                        subContainerClassName={_cs(styles.pagination)}
                                        activeClassName={styles.active}
                                    />
                                </div>
                            )}
                        </div>

                    </div>
                    {/* <AddFormModal
                        data={showReportModal}

                    /> */}

                </div>

            </div>

            {}

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
