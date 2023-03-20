/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Page from '#components/Page';

import {
    palikaLanguageSelector,
    userSelector,
    carKeysSelector,
    palikaRedirectSelector,
    generalDataSelector,
} from '#selectors';
import { AppState } from '#store/types';
import TabContent from '#views/PalikaReport/Constants/TabContent';
import ReportModal from './MunicipalityReport';


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
    | 'Budget Activity'
    | 'Programme and Policies'
    | 'Organisation'
    | 'Inventories'
    | 'Resources'
    | 'Contacts'
    | 'Budget'
    | 'Relief'
    | 'Simulation'
    | 'Preview';

const { tabs } = TabContent;

const MainModal: React.FC<Props> = (props: Props) => {
    const {
        getTabSelected,
        showErr,
        palikaRedirect: { redirectTo },
        setShowTabs,
        handleShowErr,
        selectedTab,
    } = props;

    const [tabSelected, setTabSelected] = useState(redirectTo);
    useEffect(() => {
        if (redirectTo === -2) {
            setTabSelected(0);
        } else {
            setTabSelected(selectedTab);
        }
    }, [redirectTo, selectedTab]);

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
                updateTab={handleNextClick}
                tabsLength={tabs.length}
                handlePrevClick={handlePrevClick}
                handleNextClick={handleNextClick}
                showErr={showErr}
                handleShowErr={handleShowErr}
                setShowTabs={setShowTabs}
            />
        </>
    );
};


export default connect(mapStateToProps)(
    MainModal,
);
