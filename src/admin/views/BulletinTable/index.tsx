/* eslint-disable max-len */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import BulletinForm from 'src/admin/components/BulletinForm';
import MenuCommon from 'src/admin/components/MenuCommon';
import Navbar from 'src/admin/components/Navbar';
import Footer from 'src/admin/components/Footer';
import BulletinTable from 'src/admin/components/BulletinTable';
import Loader from 'react-loader';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
import styles from './styles.scss';

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
            ordering: '-sitrep',
        }),
        onSuccess: ({ response, params: { setTableData, setCount, setPending } }) => {
            setTableData(response.results);
            setCount(response.count);
            setPending(false);
        },
    },
    bulletinDelete: {
        url: ({ params }) => `/bipad-bulletin/${params.id}`,
        method: methods.DELETE,
        onMount: false,
        onSuccess: ({ params: { setDeleteMessage, fetchBulletins } }) => {
            fetchBulletins(0);
            setDeleteMessage(true);
        },
    },
};


const Bulletin = (props: Props) => {
    const { user, requests: { bulletinTableReq, bulletinDelete }, bulletinEditData, uri } = props;
    const [tableData, setTableData] = useState([]);
    const [pending, setPending] = useState(true);
    const [back, setBack] = useState(false);
    const [totalRows, setCount] = useState(0);
    const [deleteMessage, setDeleteMessage] = useState(false);
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
        fetchBulletins(0);
    };

    const handleBulletinDelete = (id: number) => {
        bulletinDelete.do({ id, setDeleteMessage, fetchBulletins });
    };

    const handleClose = () => {
        setDeleteMessage(false);
    };

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
                                    handleBulletinDelete={handleBulletinDelete}
                                />
                            </div>
                        )
                }
            </div>
            <Modal
                open={deleteMessage}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={styles.box}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Bulletin has been deleted successfully
                    </Typography>
                    <button
                        onClick={handleClose}
                        type="button"
                        className={styles.nextBtn}
                    >
                        Ok
                    </button>
                </Box>
            </Modal>
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
