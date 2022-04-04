/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormControl, InputLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { connect } from 'react-redux';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import Loader from 'react-loader';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import Card from './Card';
import styles from './style.module.scss';

import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { SetNotificationPageAction } from '#actionCreators';
import { notificationPageSelector, userSelector } from '#selectors';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    notificationPage: notificationPageSelector(state),
    userDataMain: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setNotificationPage: params => dispatch(SetNotificationPageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    getNotification: {
        url: '/notification/',
        method: methods.GET,
        onMount: false,
        query: () => ({
            format: 'json',
            ordering: '-last_modified_date',
        }),
        onSuccess: ({ response, props, params }) => {
            props.setNotificationPage({
                notificationData: response.results,
            });
        },
    },

};

const baseUrl = process.env.REACT_APP_API_SERVER_URL;

const NotificationPage = (props) => {
    const [filterType, setFilterType] = useState('All');
    const [showDetail, setShowDetail] = useState(false);
    const [notiKey, setNotiKey] = useState(null);
    const [detailItem, setDetailItem] = useState({});

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    const {
        notificationPage: {
            showNotification,
            notificationData,
            notificationError,
            notificationsPending,
        },
        setNotificationPage,
    } = props;

    useEffect(() => {
        props.requests.getNotification.do();
        setNotificationPage({ showNotification: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleclose = () => {
        setNotificationPage({ showNotification: false });
        props.requests.getNotification.do();
    };

    const handleMoreBtn = (obj) => {
        // do put request
        // dispatch(setNotificationRead(key));
        // const updatedData = notificationData.filter(item=>item.id === obj.id)[0];
        axios.patch(`${baseUrl}/notification/${obj.id}/`, { isNew: false });
        setDetailItem(obj);
        setNotificationPage({ showNotification: false });
        setShowDetail(true);
        props.requests.getNotification.do();
    };

    const closeDetail = () => {
        setShowDetail(false);
        props.requests.getNotification.do();
        setNotificationPage({ showNotification: true });
    };
    const handleNotClose = () => {
        setShowDetail(true);
    };

    const handleDownload = () => {
        const input = document.getElementById('divToPrint');
        html2canvas(input)
            .then((canvas) => {
                const imgWidth = 208;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                const imgData = canvas.toDataURL('img/png');
                const pdf = new JsPDF('p', 'mm', 'a4');
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                // pdf.output('dataurlnewwindow');
                pdf.save('ErrorLog.pdf');
            });
    };

    return (
        <>
            <Modal
                open={showNotification}
                onClose={handleNotClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                hideBackdrop
            >
                <Box className={styles.box}>
                    <div className={styles.notificationsSideBar}>
                        <div className={styles.btnContainer}>
                            <IconButton
                                role="button"
                                onClick={handleclose}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
                        {
                            notificationsPending
                                ? (
                                    <Loader options={{
                                        position: 'fixed',
                                        top: '48%',
                                        right: 0,
                                        bottom: 0,
                                        left: '48%',
                                        color: 'white',
                                        zIndex: 9999,
                                    }}
                                    />
                                ) : (
                                    <>
                                        <div className={styles.topRow}>
                                            <h1 className={styles.title}>Notifications</h1>
                                            <div className={styles.select}>
                                                <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                                                    {/* <InputLabel id="authorityInput">Filter by</InputLabel> */}
                                                    <select
                                                        id="authority"
                                                        value={filterType}
                                                        onChange={handleFilterChange}
                                                        style={{ border: '1px solid #d5d5d5', borderRadius: '3px', padding: '4px 8px' }}
                                                    >
                                                        <option value={'Unread'}>Unread</option>
                                                        <option value={'Read'}>Read</option>
                                                        <option value={'All'}>All</option>
                                                    </select>
                                                </FormControl>
                                            </div>
                                        </div>
                                        <div className={styles.notiBody}>
                                            {
                                                notificationData.length > 0 ? [...notificationData
                                                    .filter((item) => {
                                                        if (filterType === 'All') {
                                                            return true;
                                                        }
                                                        if (filterType === 'Read') {
                                                            return item.isNew === false;
                                                        }
                                                        if (filterType === 'Unread') {
                                                            return item.isNew === true;
                                                        }
                                                        return null;
                                                    }),
                                                ]
                                                    .map(item => (
                                                        <Card
                                                            key={item.id}
                                                            newNotification={item.isNew}
                                                            title={item.title}
                                                            shortdescription={item.shortDescription}
                                                            longdescription={item.longDescription}
                                                            type={item.type}
                                                            handleMoreBtn={handleMoreBtn}
                                                            itemobj={item}
                                                        />
                                                    ))
                                                    : <h1>No Notifications</h1>
                                            }
                                        </div>
                                    </>
                                )
                        }

                    </div>

                </Box>
            </Modal>
            <Modal
                open={showDetail}
                onClose={handleNotClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={styles.detailbox}>
                    <div className={styles.detailItemBox}>
                        <div className={styles.btnContainer}>
                            <button
                                type="button"
                                onClick={handleDownload}
                            >
                                <DownloadIcon />
                            </button>
                            <button
                                type="button"
                                onClick={closeDetail}
                            >
                                <CloseIcon />
                            </button>


                        </div>
                        {
                            Object.keys(detailItem).length > 0
                                ? (
                                    <div id="divToPrint" className={styles.pdfContainer}>
                                        <div className={styles.titleRow}>
                                            <h1>
                                                {detailItem.title}
                                            </h1>

                                        </div>
                                        <div dangerouslySetInnerHTML={{ __html: detailItem.longDescription }} />
                                    </div>
                                )
                                : <h1>No Data</h1>
                        }

                    </div>

                </Box>
            </Modal>


        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            NotificationPage,
        ),
    ),
);
