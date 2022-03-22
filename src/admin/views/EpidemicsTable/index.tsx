import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import EpidemicTable from 'src/admin/components/EpidemicsTable';
import Navbar from 'src/admin/components/Navbar';
import MenuCommon from 'src/admin/components/MenuCommon';
import Footer from 'src/admin/components/Footer';
import styles from './styles.module.scss';
import Ideaicon from '../../resources/ideaicon.svg';
import Page from '#components/Page';
import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { SetEpidemicsPageAction } from '#actionCreators';
import { epidemicsPageSelector } from '#selectors';


const mapStateToProps = (state: AppState): PropsFromAppState => ({
    epidemmicsPage: epidemicsPageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setEpidemicsPage: params => dispatch(SetEpidemicsPageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    incidents: {
        url: '/incident/',
        method: methods.GET,
        onMount: false,
        query: params => ({
            format: 'json',
            hazard: 9,
            offset: params.offset,
            limit: 100,
            count: true,
            expand: ['loss.peoples', 'wards', 'wards.municipality', 'wards.municipality.district', 'wards.municipality.district.province'],
            ordering: '-id',
        }),
        onSuccess: ({ response, props }) => {
            props.setEpidemicsPage({
                incidentData: response.results,
                incidentCount: response.count,
            });
        },
    },
};

const EpidemmicDataTable = (props) => {
    const { epidemmicsPage: { incidentData, incidentCount }, uri } = props;


    useEffect(() => {
        props.requests.incidents.do({ offset: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            <MenuCommon layout="common" currentPage={'Epidemics'} uri={uri} />
            <div className={styles.dataContainer}>
                {
                    (

                        <div className={styles.tableMenuContainer}>
                            <div className={styles.mainContent}>
                                <div className={styles.formDataContainer}>
                                    <h2 className={styles.mainHeading}>
                                        Epidemic Data Table
                                    </h2>
                                    <div className={styles.shortGeneralInfo}>
                                        <img className={styles.ideaIcon} src={Ideaicon} alt="" />
                                        <p className={styles.ideaPara}>
                                            The table below gives the details of epidemic
                                            cases reported by the institution with
                                            disaggregated data by gender and disability. The
                                            table is downloadable and data can be edited as well.
                                        </p>
                                    </div>
                                    { incidentData.length > 0 && <EpidemicTable />}
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            <Footer />
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            EpidemmicDataTable,
        ),
    ),
);
