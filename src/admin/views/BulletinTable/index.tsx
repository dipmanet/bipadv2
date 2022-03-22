/* eslint-disable max-len */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import BulletinForm from 'src/admin/components/BulletinForm';
import MenuCommon from 'src/admin/components/MenuCommon';
import Navbar from 'src/admin/components/Navbar';
import Footer from 'src/admin/components/Footer';
import BulletinTable from 'src/admin/components/BulletinTable';
import Loader from 'react-loader';
import styles from './styles.scss';
import Page from '#components/Page';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    userSelector,
} from '#selectors';

interface Props {

}

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    user: userSelector(state),
});

const requests: { [key: string]: ClientAttributes<ComponentProps, Params> } = {
    bulletinTableReq: {
        url: '/bipad-bulletin/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params: { setTableData, setPending } }) => {
            setTableData(response.results);
            setPending(false);
        },
    },
};


const Bulletin = (props: Props) => {
    const { user, requests: { bulletinTableReq }, uri } = props;
    const [tableData, setTableData] = useState([]);
    const [pending, setPending] = useState(true);
    bulletinTableReq.setDefaultParams({
        setTableData,
        setPending,

    });
    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            <MenuCommon
                currentPage="Health Infrastructure"
                layout="common"
                subLevel={'bulletin'}
                uri={uri}
            />
            <div className={styles.container}>
                <h1 className={styles.heading}> Bulletin Data Table</h1>

                {
                    pending
                        ? <Loader />
                        : (
                            <div className={styles.tableContainer}>
                                <BulletinTable bulletinTableData={tableData} />
                            </div>
                        )
                }
            </div>
            <Footer />
        </>
    );
};

export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Bulletin,
        ),
    ),
);
