import React from 'react';
import Page from '#components/Page';
import styles from './styles.scss';

const PalikaReport = props => (
    <>
        <Page hideMap hideFilter />

        <div className={styles.container}>
            <div>
                <p>Hello</p>
            </div>
            <div>
                <p>Whats up</p>
            </div>
        </div>

        {/* <PalikaReportModal /> */}
    </>
);
export default PalikaReport;
