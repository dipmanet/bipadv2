import React, { useEffect, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import Faram from '@togglecorp/faram';
import ReactPaginate from 'react-paginate';
import Sidebar from './components/Sidebar';
import Page from '#components/Page';
import styles from './styles.scss';
import MainModal from './MainModal';
import { provincesSelector, districtsSelector, municipalitiesSelector,
    wardsSelector } from '#selectors';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';
import { setShowMunicipalityAction } from '#actionCreators';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import update from '#rsu/immutable-update';
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
<<<<<<< HEAD
    const [tabSelected, setTabSelected] = useState(0);
    const [showTabs, setShowTabs] = useState(false);

    const handleAddbuttonClick = () => {
        setShowReportModal(true);
        setShowTabs(true);
    };

    return (
        <>
            <Page hideMap hideFilter />
            <div>
                <button
                    type="button"
                    onClick={handleAddbuttonClick}
                >
                Add data
                </button>

            </div>
            {
                showReportModal && <MainModal />
            }
=======
    // used to close the model
    const [newRegionValues, setNewRegionValues] = useState({
        adminLevel: 0,
        geoarea: 0,
    });
    // used to store adminlevel and geoarea value selected from filter
    const [filtered, setFiltered] = useState(false);
    // used to check the condition of filter button
    const [AnnualBudget, setAnnualBudget] = useState(null);
    // used to store annual budget data from query
    const [paginationParameters, setPaginationParameters] = useState();// used for pagination of table
    const [clearFilter, setClearFilter] = useState(false);// used for pagination of table
    const [url, setUrl] = useState('/annual-budget/');
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(2);// used for pagination of table
    const [offset, setOffset] = useState(0);// used for pagination of table
    const [showReportModal, setShowReportModal] = useState(true);
    const [showTabs, setShowTabs] = useState(false);
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
    const { requests: { PalikaReportGetRequest } } = props;

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
    return (
        <>
            <Page hideMap hideFilter />
            <div className={styles.reportContainer}>
                <div className={styles.leftContainer}>
                    <div className={styles.heading}>
                        <div className={styles.bipad}>
                        BIPAD
                        </div>

                    </div>
                    <div className={styles.sidebar}>
                        <Sidebar />

                    </div>


                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.rightContainerHeading}>
                        <h1>ALL REPORTS</h1>
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
                        <PalikaReportTable tableData={finalArr} />
                        <div>
                            {paginationParameters
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

                </div>

            </div>

            {}
>>>>>>> 5d73538e6f4a44b19322f5e5f8dda2473340d1c0

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
