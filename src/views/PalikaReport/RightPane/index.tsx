/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Page from '#components/Page';

import ReportModal from './MunicipalityReport';
import {
    palikaLanguageSelector,
    userSelector,
    carKeysSelector,
    palikaRedirectSelector,
    generalDataSelector,
} from '#selectors';


import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';


const mapStateToProps = (state: AppState): PropsFromState => ({
    carKeys: carKeysSelector(state),
    user: userSelector(state),
    palikaLanguage: palikaLanguageSelector(state),
    palikaRedirect: palikaRedirectSelector(state),
    generalData: generalDataSelector(state),
});

interface Props {
    setShowTabs: (arg0: boolean) => void;
    showTabs: boolean;
    showReportModal: boolean;
    hideWelcomePage: () => void;
    setShowReportModal: (arg0: boolean) => void;
    setCarKeys: number;
    requests: Request;
    reportdata: [];
}

type TabContent =
'General'
|'Budget Activity'
|'Programme and Policies'
|'Organisation'
|'Inventories'
|'Resources'
|'Contacts'
|'Budget'
|'Relief'
|'Incident and Relief'
|'Loss & Damage'
|'Simulation'
|'Preparedness'
|'Research'
|'Simulation'
|'Preview';

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    PalikaReportGetRequest: {
        url: ({ params }) => `${params.url}`,
        query: ({ params, props }) => {
            if (params) {
                params.handlePending(true);
                return {
                    // province: params.province,
                    // district: params.district,
                    municipality: params.municipality,
                };
            }
            return { limit: params.page, offset: params.offset };
        },
        method: methods.GET,
        onMount: false,

        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;

            if (params && params.reportData) {
                params.reportData(citizenReportList);
                if (params.handlePending) {
                    params.handlePending(false);
                }
            }
        },
    },
    FiscalYearFetch: {
        url: '/nepali-fiscal-year/',
        method: methods.GET,
        onMount: false,

        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;
            params.fiscalYear(citizenReportList);
        },
    },

};

const MainModal: React.FC<Props> = (props: Props) => {
    const {
        showTabs,
        user,
        getTabSelected,
        showErr,
        palikaRedirect: { redirectTo },
        generalData,
    } = props;


    const [reportData, setReportData] = useState([]);
    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);
    const [municipality, setMunicipality] = useState(null);
    const [pending, setPending] = useState(false);


    // if (user && user.profile && !user.profile.municipality && !user.profile.isSuperuser) {
    //     const {
    //         profile: {
    //             municipality: municipalityfromProp,
    //             district: districtfromProp,
    //             province: provincefromProp,
    //         },
    //     } = user;
    //     setMunicipality(municipalityfromProp);
    //     setProvince(provincefromProp);
    //     setDistrict(districtfromProp);
    // }
    // if (user && user.profile && !user.profile.municipality && !user.isSuperuser) {
    //     // const {
    //     //     profile: {
    //     //         municipality: municipalityfromProp,
    //     //         district: districtfromProp,
    //     //         province: provincefromProp,
    //     //     },
    //     // } = user;

    //     setMunicipality(58007);
    //     setProvince(5);
    //     setDistrict(65);
    // } else {
    //     setMunicipality(58007);
    //     setProvince(5);
    //     setDistrict(65);
    // }
    const handleReportData = (response) => {
        setReportData(response);
    };


    const [tabSelected, setTabSelected] = useState(redirectTo);

    const handlePending = (val: boolean) => setPending(val);

    const tabs: {
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
            url: '',
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
            content: 'Preview',
            url: '/simulation/',
        },
    ];

    useEffect(() => {
        const getURL = (tabValue: number) => {
            if (tabs[tabValue].url) {
                return tabs[tabValue].url;
            }
            return null;
        };
        // handlePending(false);
        props.requests.PalikaReportGetRequest.do({
            municipality,
            url: getURL(0),
            reportData: handleReportData,
            handlePending,
            pending,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setTabSelected(props.selectedTab);
    }, [props.selectedTab]);

    useEffect(() => {
        const getURL = (tabValue: number) => {
            if (tabs[tabValue] && tabs[tabValue].url) {
                return tabs[tabValue].url;
            }
            return null;
        };
        if (getURL(tabSelected) !== null) {
            props.requests.PalikaReportGetRequest.do({
                municipality,
                url: getURL(tabSelected),
                reportData: handleReportData,
                handlePending,
                pending,

            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabSelected]);


    const handleNextClick = () => {
        if (tabSelected < tabs.length - 1) {
            setTabSelected(tabSelected + 1);
            getTabSelected(tabSelected + 1);
        }
    };
    const handlePrevClick = () => {
        if (tabSelected > 0) {
            setTabSelected(tabSelected - 1);
            getTabSelected(tabSelected - 1);
        }
    };

    return (
        <>
            <Page hideMap hideFilter />
            <ReportModal
                keyTab={tabSelected}
                reportData={reportData}
                province={province}
                district={district}
                municipality={municipality}
                updateTab={handleNextClick}
                tabsLength={tabs.length}
                handlePrevClick={handlePrevClick}
                handleNextClick={handleNextClick}
                showErr={showErr}
                handleShowErr={props.handleShowErr}
            />
        </>
    );
};


export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            MainModal,
        ),
    ),
);
