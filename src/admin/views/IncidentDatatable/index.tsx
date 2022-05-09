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
import Navbar from 'src/admin/components/Navbar';
import MenuCommon from 'src/admin/components/MenuCommon';
import Footer from 'src/admin/components/Footer';
import IncidentTable from 'src/admin/components/IncidentTable';
import styles from './styles.module.scss';
import Page from '#components/Page';
// import { getHealthTable, setInventoryItem } from '../../Redux/actions';


import { SetHealthInfrastructurePageAction } from '#actionCreators';
import {
	healthInfrastructurePageSelector,
	userSelector,
} from '#selectors';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
	healthInfrastructurePage: healthInfrastructurePageSelector(state),
	userDataMain: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setHealthInfrastructurePage: params => dispatch(SetHealthInfrastructurePageAction(params)),
});

const HealthDataTable = props => (
	<>
		<Page hideFilter hideMap />
		<Navbar />
		<MenuCommon layout="common" currentPage={'Incident'} uri={props.uri} />
		<div className={styles.dataContainer}>
			{
				(
					<>
						<h2 className={styles.mainHeading}>Incident Data Table</h2>
						<div className={styles.rowTitle2}>
							<FontAwesomeIcon
								icon={faInfoCircle}
								className={styles.infoIcon}
							/>
							<p>
								The table below gives the list of incidents. The table is downloadable
								and the data can be edited as well.
							</p>
						</div>
						<div className={styles.tableMenuContainer}>
							<div className={styles.mainContent}>

								<div className={styles.formDataContainer}>
									<IncidentTable />
								</div>

							</div>
						</div>
					</>
				)}

		</div>
		<Footer />
	</>
);

// export default HealthDataTable;
export default connect(mapStateToProps, mapDispatchToProps)(
	HealthDataTable,
);
