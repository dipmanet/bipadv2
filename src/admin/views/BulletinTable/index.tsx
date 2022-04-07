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
    bulletinEditDataSelector,
    userSelector,
} from '#selectors';

interface Props {

}

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    user: userSelector(state),
    bulletinEditData: bulletinEditDataSelector(state),
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
    const { user, requests: { bulletinTableReq }, bulletinEditData } = props;
    const [tableData, setTableData] = useState([]);
    const [pending, setPending] = useState(true);
    const [back, setBack] = useState(false);
    bulletinTableReq.setDefaultParams({
        setTableData,
        setPending,

    });

    const handleBack = () => {
        setBack(true);
    };

    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            <MenuCommon
                currentPage="Health Infrastructure"
                layout="common"
                subLevel={'bulletin'}
            />
            <div className={styles.container}>
                {
                    bulletinEditData && Object.keys(bulletinEditData).length === 0
                && <h1 className={styles.heading}> Bulletin Data Table</h1>
                }
                {
                    bulletinEditData && Object.keys(bulletinEditData).length > 0
                && (
                    <div className={styles.btnContainer}>

                        <button
                            type="button"
                            onClick={handleBack}
                            className={styles.backBtn}
                        >
                        Back
                        </button>
                    </div>
                )
                }

                {
                    pending
                        ? <Loader />
                        : (
                            <div className={styles.tableContainer}>
                                <BulletinTable setBack={setBack} back={back} bulletinTableData={tableData} />
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
