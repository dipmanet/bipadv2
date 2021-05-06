/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as ReachRouter from '@reach/router';
import Page from '#components/Page';
import styles from './styles.scss';

import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import ReportModal from '../ReportModal';
import LoadingAnimation from '#rscv/LoadingAnimation';
import DangerButton from '#rsca/Button/DangerButton';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';

import {
    userSelector,

    carKeysSelector,
} from '#selectors';

import {
    setCarKeysAction,
} from '#actionCreators';


import Icon from '#rscg/Icon';


const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setCarKeys: params => dispatch(setCarKeysAction(params)),
});

const mapStateToProps = (state: AppState): PropsFromState => ({
    carKeys: carKeysSelector(state),
    user: userSelector(state),
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
        showReportModal,
        hideWelcomePage,
        setShowReportModal,
        user,
        getTabSelected,
        showErr,
    } = props;

    const [reportData, setReportData] = useState([]);
    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);
    const [municipality, setMunicipality] = useState(null);
    const [pending, setPending] = useState(false);

    const [localMembers, setLocalMembers] = useState([]);
    if (user && user.profile && !user.profile.municipality && !user.profile.isSuperuser) {
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
    const handleReportData = (response) => {
        setReportData(response);
    };

    const [tabSelected, setTabSelected] = useState(0);
    const [tabUrlSelected, setTabUrlSelected] = useState('');
    const [tableHeader, setTableHeader] = useState([]);
    const handleCloseModal = () => setShowReportModal(false);


    const [mayor, setmayor] = useState('');
    const [cao, setcao] = useState('');
    const [focalPerson, setfocalPerson] = useState('');

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
        if (reportData && user && user.profile.municipality && !user.profile.isSuperuser) {
            const localM = reportData
                .filter(item => item.committee === 'LDMC' && item.municipality === user.profile.municipality);
            setLocalMembers(localM);

            reportData.filter(item => item.municipality === user.profile.municipality).map((item) => {
                if (item.isDrrFocalPerson) {
                    const details = `${item.name},${item.email},${item.mobileNumber} `;
                    setfocalPerson(details);
                }
                if (item.position && item.position.includes('Mayor')) {
                    const details = `${item.name},${item.email},${item.mobileNumber} `;
                    setmayor(details);
                }
                if (item.position && item.position.includes('Chairperson')) {
                    const details = `${item.name},${item.email},${item.mobileNumber} `;
                    setmayor(details);
                }
                if (item.position && item.position.includes('Chief Administrative Officer')) {
                    const details = `${item.name},${item.email},${item.mobileNumber} `;
                    setcao(details);
                }
                return null;
            });
        }
    }, [municipality, reportData, user]);


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

    const handleTabClick = (tab: number, url: string) => {
        setTabSelected(tab);
        setTabUrlSelected(url);
    };
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


    const handleDataAdd = () => {
        const { setCarKeys } = props;
        ReachRouter.navigate('/risk-info/#/capacity-and-resources', { state: { showForm: true }, replace: true });
        setCarKeys(1);
    };

    const getTranslateVal = () => {
        // const rect = document.getElementById('palikaModal').getBoundingClientRect();
        if (tabSelected > 5) {
            return (500);
        }
        return 0;
    };

    const getModalClass = () => {
        if (showTabs) {
            if (tabSelected === tabs.length - 1) {
                return styles.previewTab;
            }
            return styles.tabsContainer;
        }
        return styles.modalContainer;
    };


    return (
        <>
            <Page hideMap hideFilter />
            {

            }
            <ReportModal
                keyTabUrl={tabUrlSelected}
                keyTab={tabSelected}
                showTabs={showTabs}
                hideWelcomePage={hideWelcomePage}
                reportData={reportData}
                tableHeader={tableHeader}
                province={province}
                district={district}
                municipality={municipality}
                mayor={mayor}
                cao={cao}
                focalPerson={focalPerson}
                localMembers={localMembers}
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
