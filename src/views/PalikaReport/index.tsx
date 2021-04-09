import React, { useState } from 'react';
import Page from '#components/Page';
import MainModal from './MainModal';

interface Props {
}

const PalikaReport: React.FC<Props> = (props: Props) => {
    const [showReportModal, setShowReportModal] = useState(true);
    const [tabSelected, setTabSelected] = useState(0);
    const [showTabs, setShowTabs] = useState(false);

    const handleAddbuttonClick = () => {
        setShowReportModal(true);
        setShowTabs(true);
    };

    return (
        <>
            <Page hideMap hideFilter />
            <div>
                <button
                    type="button"
                    onClick={handleAddbuttonClick}
                >
                Add data
                </button>

            </div>
            {
                showReportModal && <MainModal />
            }

        </>
    );
};
export default PalikaReport;
