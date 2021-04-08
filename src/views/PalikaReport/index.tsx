import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as ReachRouter from '@reach/router';
import Page from '#components/Page';
import styles from './styles.scss';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ReportModal from './ReportModal';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import {
    setCarKeysAction,
} from '#actionCreators';

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setCarKeys: params => dispatch(setCarKeysAction(params)),
});


interface Props {
}

const PalikaReport: React.FC<Props> = (props: Props) => {
    const [showReportModal, setShowReportModal] = useState(true);
    const [tabSelected, setTabSelected] = useState(1);
    const [showTabs, setShowTabs] = useState(false);
    const handleCloseModal = () => setShowReportModal(false);
    const hideWelcomePage = () => {
        setShowTabs(true);
        setShowReportModal(false);
    };
    const tabs = [
        {
            key: 0,
            content: 'General',
        },
        {
            key: 1,
            content: 'Budget',
        },
        {
            key: 2,
            content: 'Budget Activity',
        },
        {
            key: 3,
            content: 'Programme and Policies',
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
            content: 'Loss & Damage',
        },
    ];
    const handleTabClick = (tab: number) => setTabSelected(tab);
    const handleNextClick = () => {
        if (tabSelected < tabs.length) {
            setTabSelected(tabSelected + 1);
        }
    };
    const handlePrevClick = () => {
        if (tabSelected > 0) {
            setTabSelected(tabSelected - 1);
        }
    };

    const handleAddbuttonClick = () => {
        setShowReportModal(true);
        setShowTabs(true);
    };
    const handleDataAdd = () => {
        ReachRouter.navigate('/risk-info/#/capacity-and-resources', { state: { showForm: true }, replace: true });
    };


    return (
        <>
            <Page hideMap hideFilter />
            <div className={showReportModal ? styles.containerFaded : styles.mainContainer}>
                <button
                    type="button"
                    onClick={handleAddbuttonClick}
                >
                Add data
                </button>
                {showReportModal
            && (
                <Modal
                    closeOnOutsideClick
                    className={
                        showTabs
                            ? styles.tabsContainer
                            : styles.modalContainer
                    }
                >
                    <ModalHeader
                        title=" "
                        className={showTabs ? styles.modalHeader : styles.modalHeaderFirstPage}
                        rightComponent={(
                            <>
                                {showTabs
                             && (
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
                                                 paddingRight: tabSelected === tab.key
                                                     ? '50%'
                                                     : '25%',
                                                 paddingLeft: tabSelected === tab.key
                                                     ? '50%'
                                                     : '25%',
                                             }}
                                             onClick={() => handleTabClick(tab.key)}
                                             key={tab.key}
                                         >
                                             {tab.content}
                                         </button>
                                     ))}
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
                        />
                        {showTabs && (
                            <div className={styles.btnContainer}>
                                <PrimaryButton
                                    type="button"
                                    className={styles.agreeBtn}
                                    onClick={handleCloseModal}
                                >
                                Close
                                </PrimaryButton>
                                <PrimaryButton
                                    type="button"
                                    className={styles.agreeBtn}
                                    onClick={handleDataAdd}
                                >
                                        Add Budget Data

                                </PrimaryButton>
                                {tabSelected > 0
                                && (
                                    <PrimaryButton
                                        type="button"
                                        className={styles.agreeBtn}
                                        onClick={handlePrevClick}
                                    >
                                        Prev

                                    </PrimaryButton>
                                )
                                }
                                {tabSelected < tabs.length
                                && (
                                    <PrimaryButton
                                        type="button"
                                        className={styles.agreeBtn}
                                        onClick={handleNextClick}
                                    >
                                        Next

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
export default compose(
    connect(undefined, mapDispatchToProps),
)(PalikaReport);
