/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable arrow-parens */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/indent */
import React, { useEffect } from "react";

import { connect } from "react-redux";
import IconButton from "@mui/material/IconButton";
import NotificationIcon from "@mui/icons-material/Notifications";
import NotificationPage from "src/admin/views/NotificationPage";
import { Link } from "@reach/router";

import { createConnectedRequestCoordinator } from "#request";
import { SetNotificationPageAction } from "#actionCreators";
import { notificationPageSelector, userSelector } from "#selectors";
import styles from "./styles.module.scss";
import ProfileIcon from "../../resources/profile.svg";

const mapStateToProps = (state: AppState): PropsFromAppState => ({
  notificationPage: notificationPageSelector(state),
  userDataMain: userSelector(state),
});
const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
  setNotificationPage: (params: any) =>
    dispatch(SetNotificationPageAction(params)),
});
const Navbar = (props: {
  notificationPage: { notificationData: any; showNotification: any };
  setNotificationPage: any;
  userDataMain: any;
}) => {
  const {
    notificationPage: { notificationData, showNotification },
    setNotificationPage,
    userDataMain,
  } = props;

  const handleNotification = () => {
    if (showNotification) {
      setNotificationPage({ showNotification: false });
    } else {
      setNotificationPage({ showNotification: true });
    }
  };
  return (
    <>
      <NotificationPage />
      <div className={styles.mainNavBar}>
        <div className={styles.navLeftSide}>
          <div className={styles.navLogo}>
            <div className={styles.colorBar} />
            <Link to="/admin">
              <div className={styles.bipdLogoName}>Bipad Admin Portal</div>
            </Link>
            <div className={styles.shortInfo}>
              <p>Building Information</p>
              <p>Platform Against Disasters</p>
            </div>
          </div>
        </div>
        <div className={styles.navRightSide}>
          <div className={styles.profileSvg}>
            <div className={styles.notification}>
              {notificationData.filter(
                (item: { isNew: boolean }) => item.isNew === true
              ).length > 0 && (
                <div className={styles.dot}>
                  {
                    notificationData.filter(
                      (item: { isNew: boolean }) => item.isNew === true
                    ).length
                  }
                </div>
              )}
              <IconButton onClick={handleNotification}>
                <NotificationIcon className={styles.bell} />
              </IconButton>
            </div>
          </div>
          <div className={styles.profileSvg} style={{ background: "#A3301C" }}>
            <img
              style={{ height: "18.2px", width: "18.2px" }}
              src={ProfileIcon}
              alt=""
            />
          </div>
          <div className={styles.loggedInUserName}>{userDataMain.username}</div>
        </div>
      </div>
    </>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(createConnectedRequestCoordinator<ReduxProps>()(Navbar));
