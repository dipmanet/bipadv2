/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as ReachRouter from '@reach/router';
import Page from '#components/Page';
import styles from './styles.scss';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ReportModal from '../ReportModal';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import LoadingAnimation from '#rscv/LoadingAnimation';

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
                    limit: -1,
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
    } = props;

    const [reportData, setReportData] = useState([]);
    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);
    const [municipality, setMunicipality] = useState(null);
    const [pending, setPending] = useState(false);

    const [localMembers, setLocalMembers] = useState([]);
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
            url: '/resource/',
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
        if (reportData && user && user.profile.municipality) {
            const localM = reportData
                .filter(item => item.committee === 'LDMC' && item.municipality === user.profile.municipality);
            setLocalMembers(localM);

            reportData.filter(item => item.municipality === municipality).map((item) => {
                if (item.isDrrFocalPerson) {
                    setfocalPerson(item.name);
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
                    setcao(item.name);
                }
                return null;
            });
        }
    }, [municipality, reportData, user]);

    console.log(reportData);

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
        }
    };
    const handlePrevClick = () => {
        if (tabSelected > 0) {
            setTabSelected(tabSelected - 1);
        }
    };


    const handleDataAdd = () => {
        const { setCarKeys } = props;
        ReachRouter.navigate('/risk-info/#/capacity-and-resources', { state: { showForm: true }, replace: true });
        setCarKeys(1);
    };

    const getTranslateVal = () => {
        // const rect = document.getElementById('palikaModal').getBoundingClientRect();
        // console.log(rect);
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
            <div className={showReportModal ? styles.containerFaded : styles.mainContainer}>

                {
                    showReportModal
                        && (
                            <Modal
                                closeOnOutsideClick
                                className={getModalClass()}
                                id={'palikaModal'}
                            >

                                <ModalHeader
                                    title=" "
                                    className={showTabs ? styles.modalHeader : styles.modalHeaderFirstPage}
                                    rightComponent={(
                                        <>
                                            {showTabs
                                         && (
                                             <div className={styles.tabsMain}>
                                                 <div
                                                     className={styles.tabsTitle}
                                                 >
                                                     { tabs.map(tab => (
                                                         <button
                                                             type="button"
                                                             className={styles.tabsTexts}
                                                             style={{
                                                                 backgroundColor: tabSelected === tab.key
                                                                     ? '#fff'
                                                                     : '#e1e1e1',
                                                                 transform: `translateX(-${getTranslateVal()}px)`,
                                                             }}
                                                             onClick={() => handleTabClick(tab.key, tab.url)}
                                                             key={tab.key}
                                                         >
                                                             {tab.content}
                                                         </button>
                                                     ))}
                                                 </div>
                                                 <div className={styles.closeBtnContainer}>
                                                     <PrimaryButton
                                                         type="button"
                                                         className={styles.closeBtn}
                                                         onClick={handleCloseModal}
                                                     >
                                                         <Icon
                                                             name="times"
                                                             className={styles.closeIcon}
                                                         />
                                                     </PrimaryButton>
                                                 </div>
                                             </div>

                                         )
                                            }
                                        </>
                                    )}
                                />
                                <ModalBody className={styles.modalBody}>
                                    {pending && <LoadingAnimation />}
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
                                    />
                                    {showTabs && (
                                        <div className={styles.btnContainer}>
                                            {/* <div className={styles.nextPrevBtns}>
                                                {
                                                    tabSelected < Object.keys(tabs).length - 1
                                                    && (
                                                        <>
                                                            <PrimaryButton
                                                                type="button"
                                                                className={tabSelected > 0
                                                                    ? styles.agreeBtn
                                                                    : styles.disabledBtn
                                                                }
                                                                onClick={handlePrevClick}
                                                            >
                                                        Prev

                                                            </PrimaryButton>
                                                            <PrimaryButton
                                                                type="button"
                                                                className={tabSelected < tabs.length - 1
                                                                    ? styles.agreeBtn
                                                                    : styles.disabledBtn
                                                                }
                                                                onClick={handleNextClick}
                                                            >
                                                        Next

                                                            </PrimaryButton>
                                                        </>
                                                    )
                                                }

                                            </div> */}


                                            {/* { tabSelected < Object.keys(tabs).length - 1
                                            && tabSelected !== 0
                                               && (
                                                   <PrimaryButton
                                                       type="button"
                                                       className={styles.agreeBtn}
                                                       onClick={handleDataAdd}
                                                   >
                                                       {`Add ${tabs[tabSelected].content} Data`}

                                                   </PrimaryButton>
                                               )
                                            } */}

                                        </div>
                                    )}

                                </ModalBody>
                            </Modal>
                        )

                }
            </div>


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
