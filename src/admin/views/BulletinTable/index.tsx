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
import Icon from '#rscg/Icon';

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
        query: ({ params }) => ({
            offset: params.offset,
            limit: 100,
            count: true,
            ordering: '-modified_on',
        }),
        onSuccess: ({ response, params: { setTableData, setCount, setPending } }) => {
            setTableData(response.results);
            setCount(response.count);
            setPending(false);
        },
    },
};


const Bulletin = (props: Props) => {
    const { user, requests: { bulletinTableReq }, bulletinEditData } = props;
    const [tableData, setTableData] = useState([]);
    const [pending, setPending] = useState(true);
    const [back, setBack] = useState(false);
    const [totalRows, setCount] = useState(0);
    bulletinTableReq.setDefaultParams({
        setTableData,
        setPending,
        setCount,
    });

    const fetchBulletins = (offset) => {
        bulletinTableReq.do({ offset });
    };

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
                            title="Back to table page"
                        >
                            <Icon
                                name="chevronLeft"
                                className={styles.backIcon}
                            />
                        </button>
                    </div>
                )
                }

                {
                    pending
                        ? <Loader />
                        : (
                            <div className={styles.tableContainer}>
                                <BulletinTable
                                    setBack={setBack}
                                    back={back}
                                    bulletinTableData={tableData}
                                    fetchBulletins={fetchBulletins}
                                    totalRows={totalRows}
                                />
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
