import React, { useEffect, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import Page from '#components/Page';
import styles from './styles.scss';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import Icon from '#rscg/Icon';
import DropdownButton from './components/dropdownButton';
import { showProvinceSelector, showDistrictSelector, showMunicipalitySelector,
    showWardSelector, selectedProvinceIdSelector, selectedDistrictIdSelector,
    selectedMunicipalityIdSelector, provincesSelector, districtsSelector, municipalitiesSelector,
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
        url: '/annual-budget/',
        query: ({ params, props }) => {
            if (params && params.submitQuery) {
                return {
                    province: params.submitQuery.province,
                    district: params.submitQuery.district,
                    municipality: params.submitQuery.municipality,
                };
            }
            return undefined;
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
    const [newRegionValues, setNewRegionValues] = useState(null);
    // used to store adminlevel and geoarea value selected from filter
    const [filtered, setFiltered] = useState(false);
    // used to check the condition of filter button
    const [AnnualBudget, setAnnualBudget] = useState(null);
    // used to store annual budget data from query


    const handleAnnualBudget = (response) => {
        setAnnualBudget(response);
    };
    const handleCloseModal = () => setShowReportModal(false);

    const handleFormRegion = (Values) => {
        setNewRegionValues(Values);
        setFiltered(false);
        console.log('This is value>>>', Values);
    };
    const { requests: { PalikaReportGetRequest } } = props;

    PalikaReportGetRequest.setDefaultParams({
        annualBudget: handleAnnualBudget,
    });

    console.log('This is budget>>>', AnnualBudget);
    const getRegionDetails = ({ adminLevel, geoarea } = {}) => {
        const {
            provinces,
            districts,
            municipalities,
            // filters: { region },
        } = props;

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
    console.log('Why>>>', newRegionValues);
    const handleSubmit = () => {
        if (filtered) {
            PalikaReportGetRequest.do({

                submitQuery: getRegionDetails(),
            });
        } else {
            PalikaReportGetRequest.do({

                submitQuery: getRegionDetails(newRegionValues),
            });
        }

        setFiltered(true);
    };
    return (
        <>
            <Page hideMap hideFilter />
            <div className={styles.reportContainer}>
                <div className={styles.leftContainer}>
                    <div className={styles.heading}>BIPAD</div>
                    <div className={styles.butn}>
                        <Icon name="play" />
                        <button type="button">
Palika Reports
                            {' '}

                        </button>
                        <div className={styles.dropdowncontent}>
                            <a href="https://www.w3schools.com/howto/howto_css_dropdown.asp">Link 1</a>
                            <a href="https://www.w3schools.com/howto/howto_css_dropdown.asp">Link 2</a>
                            <a href="https://www.w3schools.com/howto/howto_css_dropdown.asp">Link 3</a>
                        </div>
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
                            value={{ adminLevel: 0, geoarea: 0 }}
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


                    </div>
                    <div className={styles.rightContainerTables}>
                        <Table striped bordered hover size="sm" responsive>
                            <thead>
                                <tr>
                                    <th>S.N</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Username</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                            </tbody>
                        </Table>
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
