import React from 'react';
import Page from '#components/Page';
import styles from './styles.scss';

import PalikaReportModal from '#components/PalikaReportModal';

const PalikaReport = (props) => {
    const { closeModal } = props;


    return (
        <>
            <Page hideMap hideFilter />
            <p>Hello</p>
            <PalikaReportModal />
        </>
    );
};
export default PalikaReport;
