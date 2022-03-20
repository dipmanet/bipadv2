import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import MenuCommon from '../../components/MenuCommon';
import styles from './styles.module.scss';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Page from '#components/Page';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
import { adminMenuSelector } from '#selectors';
import { SetAdminMenuAction } from '#actionCreators';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    adminMenu: adminMenuSelector(state),
});
const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setAdminMenu: params => dispatch(SetAdminMenuAction(params)),
});

const requests: { [key: string]: ClientAttributes<ComponentProps, Params> } = {
    getMenu: {
        url: '/adminportal-menu/',
        method: methods.GET,
        onMount: false,
        onSuccess: ({ response, props: { setAdminMenu } }) => {
            setAdminMenu(response.results);
        },
    },
};

const Landing = (props) => {
    const { requests: { getMenu } } = props;
    useEffect(() => {
        getMenu.do();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Page hideMap hideFilter />
            <Navbar />
            <div className={styles.container}>
                <div className={styles.title}>
                Welcome to Government of Nepal&apos;s Integrated Disaster
                Information Management System.
                </div>
                <div className={styles.subtitle}>
                Select your prefered sector to input, monitor, and analyze information
                from all three tiers of the Government.
                </div>
            </div>
            <MenuCommon currentPage="Health Infrastructure" layout="landing" />
            <Footer />
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator()(
        createRequestClient(requests)(
            Landing,
        ),
    ),
);
