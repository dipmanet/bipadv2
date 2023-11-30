import Navbar from 'src/admin/components/Navbar';
import Page from '#components/Page';
import MenuCommon from 'src/admin/components/MenuCommon';
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable css-modules/no-undef-class */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import TemporaryShelterTableData from 'src/admin/components/TemporaryShelterTableData';
import styles from './styles.module.scss';


const TemporaryShelterTable = props => (
    <>
        <Page hideFilter hideMap />
        <Navbar />
        <MenuCommon layout="common" currentPage={'Incident'} uri={props.uri} />
        <div className={styles.dataContainer}>
            {
                (
                    <>
                        <h2 className={styles.mainHeading}>अस्थायी आवास सम्झौता फारम तथ्याङ्क तालिका</h2>
                        <div className={styles.rowTitle2}>
                            <FontAwesomeIcon
                                icon={faInfoCircle}
                                className={styles.infoIcon}
                            />
                            <p>
                                तलको तालिकाले अस्थायी आवास सम्बन्धी तथ्याङ्कको विस्तृत विवरणहरू सुचीमा देखाउछ।
                            </p>
                        </div>
                        <div className={styles.tableMenuContainer}>
                            <div className={styles.mainContent}>

                                <div className={styles.formDataContainer}>
                                    <TemporaryShelterTableData />
                                </div>

                            </div>
                        </div>
                    </>
                )}

        </div>
    </>

);


// export default TemporaryShelterTable;

// export default IncidentDatatable;
export default connect()(
    TemporaryShelterTable,
);
