import React, { useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import Page from '#components/Page';
import styles from './styles.scss';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import Icon from '#rscg/Icon';
import ReportModal from './ReportModal';

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
    const handleAddbuttonClick = () => {
        setShowReportModal(true);
        setShowTabs(true);
    };
    return (
        <>
            <Page hideMap hideFilter />
            <button
                type="button"
                onClick={handleAddbuttonClick}
            >
                Add data
            </button>
            {showReportModal
            && (
                <Modal closeOnOutsideClick className={styles.modalContainer}>
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

                                <DangerButton
                                    transparent
                                    iconName="close"
                                    onClick={handleCloseModal}
                                    title="Close Modal"
                                />
                            </>
                        )}
                    />
                    <ModalBody className={styles.modalBody}>
                        <ReportModal
                            keyTab={tabSelected}
                            showTabs={showTabs}
                            hideWelcomePage={hideWelcomePage}
                        />
                    </ModalBody>
                </Modal>
            )}

        </>
    );
};
export default PalikaReport;
