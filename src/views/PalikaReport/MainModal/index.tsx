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
|'Incident'
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
    const { profile: {
        municipality,
        district,
        province,
    } } = user;
    const handleReportData = (response) => {
        setReportData(response);
    };

    const [tabSelected, setTabSelected] = useState(0);
    const [tableHeader, setTableHeader] = useState([]);
    const handleCloseModal = () => setShowReportModal(false);


    const [mayor, setmayor] = useState('');
    const [cao, setcao] = useState('');
    const [focalPerson, setfocalPerson] = useState('');

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
        },
        {
            key: 5,
            content: 'Inventories',
        },
        {
            key: 6,
            content: 'Resources',
        },
        {
            key: 7,
            content: 'Contacts',
        },
        {
            key: 8,
            content: 'Relief',
        },
        {
            key: 9,
            content: 'Incident',
        },
        {
            key: 10,
            content: 'Simulation',
            url: '/simulation/',
        },
        {
            key: 11,
            content: 'Loss & Damage',
        },
        {
            key: 12,
            content: 'Preview',
        },
    ];

    useEffect(() => {
        const getURL = (tabValue: number) => {
            if (tabs[tabValue].url) {
                return tabs[tabValue].url;
            }
            return null;
        };

        props.requests.PalikaReportGetRequest.do({
            municipality,
            url: getURL(0),
            reportData: handleReportData,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (reportData) {
            reportData.map((item) => {
                if (item.isDrrFocalPerson) {
                    setfocalPerson(item.name);
                }
                if (item.position && item.position.includes('Mayor')) {
                    const details = `Name: ${item.name}\n,Email:${item.email},Tel:${item.mobileNumber} `;
                    setmayor(details);
                }
                if (item.position && item.position.includes('Chairperson')) {
                    const details = `Name:${item.name}\n,Email:${item.email},Tel:${item.mobileNumber} `;
                    setmayor(details);
                }
                if (item.position && item.position.includes('Chief Administrative Officer')) {
                    setcao(item.name);
                }

                return null;
            });
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportData]);

    console.log(reportData);

    useEffect(() => {
        const getURL = (tabValue: number) => {
            if (tabs[tabValue].url) {
                return tabs[tabValue].url;
            }
            return null;
        };

        if (getURL(tabSelected) !== null) {
            props.requests.PalikaReportGetRequest.do({
                municipality,
                url: getURL(tabSelected),
                reportData: handleReportData,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabSelected]);

    const handleTabClick = (tab: number) => {
        setTabSelected(tab);
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
        if (tabSelected > 5) {
            return (500);
        }
        return 0;
    };

    const getModalClass = () => {
        if (showTabs) {
            if (tabSelected === 11) {
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

                {showReportModal
            && (
                <Modal
                    closeOnOutsideClick
                    className={getModalClass()}
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
                                                 onClick={() => handleTabClick(tab.key)}
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
                        <ReportModal
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
                        />
                        {showTabs && (
                            <div className={styles.btnContainer}>
                                <div className={styles.nextPrevBtns}>
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

                                </div>


                                { tabSelected < Object.keys(tabs).length - 1
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
                                }

                            </div>
                        )}

                    </ModalBody>
                </Modal>
            )}
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
