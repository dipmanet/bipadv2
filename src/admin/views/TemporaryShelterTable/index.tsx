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
import React, { useState, useEffect } from 'react';
import Loader from 'react-loader';
import { useSelector, useDispatch, connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import HealthTable from 'src/admin/components/HealthTable';
import ProgressMenu from 'src/admin/components/ProgressMenu';
import Footer from 'src/admin/components/Footer';
import IncidentTable from 'src/admin/components/IncidentTable';
// import { getHealthTable, setInventoryItem } from '../../Redux/actions';


import { SetHealthInfrastructurePageAction } from '#actionCreators';
import {
    healthInfrastructurePageSelector,
    userSelector,
} from '#selectors';
import TemporaryShelterTableData from 'src/admin/components/TemporaryShelterTableData';
import styles from './styles.module.scss';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    healthInfrastructurePage: healthInfrastructurePageSelector(state),
    userDataMain: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setHealthInfrastructurePage: params => dispatch(SetHealthInfrastructurePageAction(params)),
});

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
export default connect(mapStateToProps, mapDispatchToProps)(
    TemporaryShelterTable,
);
