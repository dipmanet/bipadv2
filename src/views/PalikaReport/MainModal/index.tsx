import React, { useState } from 'react';
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
    setCarKeysAction,
} from '#actionCreators';

import {
    carKeysSelector,
} from '#selectors';
import Icon from '#rscg/Icon';

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setCarKeys: params => dispatch(setCarKeysAction(params)),
});

const mapStateToProps = (state: AppState): PropsFromState => ({
    carKeys: carKeysSelector(state),
});

interface Props {
    setShowTabs: (arg0: boolean) => void;
    showTabs: boolean;
    showReportModal: boolean;
    hideWelcomePage: () => void;
    setShowReportModal: (arg0: boolean) => void;
    setCarKeys: number;
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
|'Preview';


const MainModal: React.FC<Props> = (props: Props) => {
    const {
        showTabs,
        showReportModal,
        hideWelcomePage,
        setShowReportModal,
    } = props;

    const [tabSelected, setTabSelected] = useState(0);
    const handleCloseModal = () => setShowReportModal(false);

    const tabs: {
        key: number;
        content: TabContent;
    }[] = [
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
        {
            key: 11,
            content: 'Preview',
        },
    ];
    const handleTabClick = (tab: number) => setTabSelected(tab);
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

    return (
        <>
            <Page hideMap hideFilter />
            <div className={showReportModal ? styles.containerFaded : styles.mainContainer}>

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
                        />
                        {showTabs && (
                            <div className={styles.btnContainer}>
                                { tabSelected < Object.keys(tabs).length - 1
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
    connect(mapStateToProps, mapDispatchToProps),
)(MainModal);
