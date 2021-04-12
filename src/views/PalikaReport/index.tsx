import React, { useEffect, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import Sidebar from './components/Sidebar';
import Page from '#components/Page';
import styles from './styles.scss';
import MainModal from './MainModal';
import { provincesSelector, districtsSelector, municipalitiesSelector,
    wardsSelector } from '#selectors';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import PalikaReportTable from './components/palikaReportTable';
import AddFormModal from './components/addFormModal';


interface Props {

}
const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
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

};


const PalikaReport: React.FC<Props> = (props: Props) => {
    const [showReportModal, setShowReportModal] = useState(true);
    const [newRegionValues, setNewRegionValues] = useState({
        adminLevel: 0,
        geoarea: 0,
    });
    const [filtered, setFiltered] = useState(false);
    const [AnnualBudget, setAnnualBudget] = useState(null);
    const [paginationParameters, setPaginationParameters] = useState();
    const [clearFilter, setClearFilter] = useState(false);
    const [url, setUrl] = useState('/annual-budget-activity/');
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(2);
    const [offset, setOffset] = useState(0);
    const [showTabs, setShowTabs] = useState(false);
    const [menuId, setMenuId] = useState();
    const [submenuId, setSubmenuId] = useState();
    const [subMenuTitle, setSubMenuTitle] = useState('All Reports');
    const [tableHeader, setTableHeader] = useState([]);


    const handleAnnualBudget = (response) => {
        setAnnualBudget(response);
    };
    const handlePaginationParameters = (response) => {
        setPaginationParameters(response);
    };


    const handleCloseModal = () => setShowReportModal(false);
    const {
        provinces,
        districts,
        municipalities,
        // filters: { region },
    } = props;

    const handleFormRegion = (Values) => {
        setNewRegionValues(Values);
        setFiltered(false);
    };
    const { requests: { PalikaReportGetRequest, PalikaReportTableHeaderRequest } } = props;

    PalikaReportGetRequest.setDefaultParams({
        annualBudget: handleAnnualBudget,
        paginationParameters: handlePaginationParameters,
        url,
        page: paginationQueryLimit,

    });


    let finalArr = [];
    if (AnnualBudget) {
        const finalAnnualBudget = AnnualBudget.map((item, i) => {
            const provinceDetails = provinces[i];
            const districtDetails = districts[i];
            const municipalityDetails = municipalities[i];
            if (municipalityDetails) {
                return { municipalityName: municipalityDetails.title,
                    provinceName: provinceDetails.title,
                    districtName: districtDetails.title,
                    item };
            }
            return null;
        });
        finalArr = [...new Set(finalAnnualBudget)];
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
        if (filtered) {
            PalikaReportGetRequest.do({

                submitQuery: getRegionDetails(),
            });
            setClearFilter(true);
            setNewRegionValues({
                adminLevel: 0,
                geoarea: 0,
            });
        } else {
            PalikaReportGetRequest.do({

                submitQuery: getRegionDetails(newRegionValues),
            });
        }

        setFiltered(true);
    };

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
        console.log('SubMenu Id', subMenuid);
        setSubmenuId(subMenuid);
    };

    const getMenuId = (menu) => {
        console.log('Menu Id', menu);
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
                    console.log(err);
                });
        }

        postData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    // Finding Header for table data
    const finalTableHeader = Object.keys(tableHeader).map(item => tableHeader[item].label);
    const TableHeaderForTable = finalTableHeader.filter(item => item !== 'ID' && item !== 'Created on'
     && item !== 'Modified on' && item !== 'Remarks' && item !== 'Created by'
     && item !== 'Updated by');
    console.log('Annual Budget>>>', AnnualBudget);
    console.log('header>>>', TableHeaderForTable);
    return (
        <>
            <Page hideMap hideFilter />

            <MainModal
                showTabs={showTabs}
                setShowTabs={handleAddbuttonClick}
                showReportModal={showReportModal}
                hideWelcomePage={hideWelcomePage}
                setShowReportModal={setShowReportModal}
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
                        <StepwiseRegionSelectInput
                            className={
                                _cs(styles.activeView, styles.stepwiseRegionSelectInput)}
                            faramElementName="region"
                            wardsHidden
                            onChange={handleFormRegion}
                            // value={{ adminLevel: 1, geoarea: 6 }}
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
                                    className={styles.submitBut}

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
                        />
                        <div>
                            {paginationParameters && paginationParameters.count !== 0
                            && (
                                <ReactPaginate
                                    previousLabel={'prev'}
                                    nextLabel={'next'}
                                    breakLabel={'...'}
                                    breakClassName={'break-me'}
                                    onPageChange={handlePageClick}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    pageCount={Math.ceil(paginationParameters.count / 2)}
                                    containerClassName={styles.pagination}
                                    subContainerClassName={_cs(styles.pagination)}
                                    activeClassName={styles.active}
                                />
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
