import React, { useEffect, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import Faram from '@togglecorp/faram';
import ReactPaginate from 'react-paginate';
import Sidebar from './components/Sidebar';
import Page from '#components/Page';
import styles from './styles.scss';

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
// const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
//     alertsRequest: {
//         url: '/alert/',
//         method: methods.GET,
//         query: ({ props: { filters } }) => ({
//             ...transformFilters(filters, { start: 'started_on__gt', end: 'started_on__lt' }),
//             expand: ['event'],
//             ordering: '-started_on',
//         }),
//         onSuccess: ({ response, props: { setAlertList }, params }) => {
//             interface Response { results: PageTypes.Alert[] }
//             const { results: alertList = [] } = response as Response;
//             setAlertList({ alertList });
//             if (params && params.triggerAlertRequest) {
//                 params.triggerAlertRequest(60 * 1000);
//             }
//         },
//         onFailure: ({ params }) => {
//             if (params && params.triggerAlertRequest) {
//                 params.triggerAlertRequest(60 * 1000);
//             }
//         },
//         onFatal: ({ params }) => {
//             if (params && params.triggerAlertRequest) {
//                 params.triggerAlertRequest(60 * 1000);
//             }
//         },
//         onMount: true,
//         onPropsChanged: {
//             filters: ({
//                 props: { filters },
//                 prevProps: { filters: prevFilters },
//             }) => {
//                 const shouldRequest = filters !== prevFilters;
//                 return shouldRequest;
//             },
//         },
//         extras: {
//             schemaName: 'alertResponse',
//         },
//     },


// };
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
    // incidentsGetRequest: {
    //     url: '/incident/',
    //     method: methods.GET,
    //     query: () => {
    //         const today = new Date();
    //         const oneWeekAgo = new Date(new Date().setDate(today.getDate() - 7));
    //         return {
    //             fields: ['id', 'title'],
    //             // eslint-disable-next-line @typescript-eslint/camelcase
    //             incident_on__lt: today.toISOString(),
    //             // eslint-disable-next-line @typescript-eslint/camelcase
    //             incident_on__gt: oneWeekAgo.toISOString(),
    //         };
    //     },
    //     onSuccess: ({ params, response }) => {
    //         if (params && params.onSuccess) {
    //             const incidentsResponse = response as MultiResponse<PageType.Incident>;
    //             const { onSuccess } = params;
    //             onSuccess(incidentsResponse.results);
    //         }
    //     },
    //     onMount: true,
    // },
};


const PalikaReport: React.FC<Props> = (props: Props) => {
    const [showReportModal, setShowReportModal] = useState(true);
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
    const [paginationParameters, setPaginationParameters] = useState();
    const [clearFilter, setClearFilter] = useState(false);
    const [url, setUrl] = useState('/annual-budget/');
    const [paginationQueryLimit, setPaginationQueryLimit] = useState(2);
    const [offset, setOffset] = useState(0);
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

    console.log('This is pagination>>>', paginationParameters);
    console.log('This offset>>>', offset);

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
        console.log('What selected>>>', selectedPage);
        setOffset(selectedPage * 2);
        console.log('What offset>>>', offset);
    };

    useEffect(() => {
        PalikaReportGetRequest.do({
            offset,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);


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
                        >
                         + ADD
                            {' '}

                        </button>

                    </div>
                    <div className={styles.rightContainerTables}>
                        <PalikaReportTable tableData={finalArr} />
                        <div>
                            {/* <button
                                type="submit"
                                className={styles.addButn}
                            >
                         XLS
                                {' '}

                            </button> */}
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
