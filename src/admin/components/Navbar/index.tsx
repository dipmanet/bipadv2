import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import NotificationIcon from '@mui/icons-material/Notifications';
import NotificationPage from 'src/admin/views/NotificationPage';
import ProfileIcon from '../../resources/profile.svg';
import styles from './styles.module.scss';

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
            // params.setLoading(false);
        },
    },

};

const Navbar = (props) => {
    const {
        notificationPage: {
            notificationData,
            showNotification,
        },
        setNotificationPage,
        userDataMain,
    } = props;

    useEffect(() => {
        props.requests.getNotification.do();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNotification = () => {
        if (showNotification) {
            console.log('notification', showNotification);
            setNotificationPage({ showNotification: false });
            // dispatch(setNotificationPane(false));
        } else {
            setNotificationPage({ showNotification: true });
            // dispatch(setNotificationPane(true));
        }
    };
    return (
        <>
            <NotificationPage />
            <div className={styles.mainNavBar}>
                <div className={styles.navLeftSide}>
                    <div className={styles.navLogo}>
                        <div className={styles.colorBar} />
                        <div className={styles.bipdLogoName}>BIPAD Portal</div>
                        <div className={styles.shortInfo}>
                            <p>Building Information</p>
                            <p>Platform Against Disasters</p>
                        </div>
                    </div>
                </div>
                <div className={styles.navRightSide}>
                    <div className={styles.profileSvg}>
                        <div className={styles.notification}>
                            {
                                notificationData.filter(item => item.isNew === true).length > 0
                            && (
                                <div className={styles.dot}>
                                    {
                                        notificationData.filter(item => item.isNew === true).length
                                    }
                                </div>
                            )}
                            <IconButton
                                onClick={handleNotification}
                            >
                                <NotificationIcon className={styles.bell} />
                            </IconButton>
                        </div>
                    </div>
                    <div className={styles.profileSvg} style={{ background: '#A3301C' }}>
                        <img style={{ height: '18.2px', width: '18.2px' }} src={ProfileIcon} alt="" />
                    </div>
                    <div className={styles.loggedInUserName}>{userDataMain.username}</div>
                    {/* <div className={styles.logoutIcon} onClick={handleLogOut}>
                    <img src={LogoutIcon} className={styles.logout} alt="" />
                    <div className={styles.toolTip}>
                        <span className={styles.toolTipText}>Log Out</span>
                    </div>
                </div> */}
                </div>
            </div>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Navbar,
        ),
    ),
);
