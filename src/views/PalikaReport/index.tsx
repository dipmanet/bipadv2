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
    console.log(props);
    const [showReportModal, setShowReportModal] = useState(true);
    const [showId, setShwoID] = useState(false);
    const [tabSelected, setTabSelected] = useState(1);
    const handleCloseModal = () => setShowReportModal(false);

    const tabs = [
        {
            key: 1,
            content: 'tab1',
        },
        {
            key: 2,
            content: 'tab2',
        },
        {
            key: 3,
            content: 'tab3',
        },
        {
            key: 4,
            content: 'tab4',
        },
    ];
    const handleTabClick = (tab: number) => setTabSelected(tab);

    return (
        <>
            <Page hideMap hideFilter />
            <div className={styles.maincontainer}>
                <div className={styles.leftContainer}>
                   left
                    <button
                        type="button"
                        onClick={console.log('clickec')}
                    >
                        <Icon
                            name="info"
                        />
                    </button>
                </div>
                <div className={styles.rightContainer}>
                   right
                </div>

            </div>
            {showReportModal
            && (
                <Modal closeOnOutsideClick className={styles.modalContainer}>
                    <ModalHeader
                        title=" "
                        className={styles.modalHeader}
                        rightComponent={(
                            <>
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
                        <ReportModal keyTab={tabSelected} />
                    </ModalBody>
                </Modal>
            )}

        </>
    );
};
export default PalikaReport;
