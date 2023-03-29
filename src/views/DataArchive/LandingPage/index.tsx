/* eslint-disable max-len */
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { connect } from 'react-redux';
import Loading from '#components/Loading';
import {
    userSelector,
} from '#selectors';
import { AppState } from '#types';
import styles from './styles.scss';

import icons from './icons';
import Option from '../Option';
import { checkPermission } from '../utils';
// added
import { User } from '../../../store/atom/auth/types';


interface View {
    id: string;
    title: string;
    alt: string;
    icon: string;
    // count: number | string;
}

interface Props {
    // added
    user: User;
    handleOptionClick: Function;
}

// const getCount = (countObj: {
//     [key in string]: { count: number };
// }, element: string): (number | string) => (countObj[element] ? countObj[element].count : 'N/A');

const mapStateToProps = (state: AppState) => ({
    user: userSelector(state),
});


const LandingPage = (props: Props) => {
    // const [counts, setCounts] = useState({});

    // const getDataCount = async () => {
    //     const endPoint = '/archive-meta/';
    //     const URL = `${process.env.REACT_APP_API_SERVER_URL}${endPoint}`;
    //     const response = await fetch(URL);
    //     response.json()
    //         .then(res => setCounts(res))
    //         .catch(err => console.warn('Cannot get counts !!!', err));
    // };

    const { handleOptionClick, user } = props;
    const {
        RainIcon,
        RiverIcon,
        EarthquakeIcon,
        PollutionIcon,
    } = icons;

    // useEffect(() => {
    //     getDataCount();
    // }, []);
    // const [views, setTest] = useState();

    // const checkPermission = (codeName, app) => {
    //     let permission = false;
    //     if (!user) {
    //         permission = false;
    //     } else if (user.isSuperuser) {
    //         permission = true;
    //     }
    //     if (user && user.groups) {
    //         user.groups.forEach((group) => {
    //             if (group.permissions) {
    //                 group.permissions.forEach((p) => {
    //                     if (p.codename === codeName && p.app === app) {
    //                         permission = true;
    //                     }
    //                 });
    //             } else {
    //                 permission = false;
    //             }
    //         });
    //     }
    //     if (user && user.userPermissions) {
    //         user.userPermissions.forEach((a) => {
    //             if (a.codename === codeName && a.app === app) {
    //                 permission = true;
    //             }
    //         });
    //     } else {
    //         permission = false;
    //     }
    //     return permission;
    // };

    // const rainPermisssion = checkPermission(user, 'view_rain', 'realtime');
    // const riverPermission = checkPermission(user, 'view_river', 'realtime');

    const views = [
        { id: 'earthquake', title: 'Earthquake', alt: 'earthquake', icon: EarthquakeIcon },
        { id: 'pollution', title: 'Pollution', alt: 'pollution', icon: PollutionIcon },
    ];

    if (user) {
        views.push({ id: 'rain', title: 'Rain', alt: 'rain', icon: RainIcon }, { id: 'river', title: 'River', alt: 'river', icon: RiverIcon });
    }

    // if (rainPermisssion) {
    //     views.push({ id: 'rain', title: 'Rain', alt: 'rain', icon: RainIcon });
    // }
    // if (riverPermission) {
    //     views.push({ id: 'river', title: 'River', alt: 'river', icon: RiverIcon });
    // }

    // const views: View[] = [
    //     { id: 'rain', title: 'Rain', alt: 'rain', icon: RainIcon },
    //     { id: 'river', title: 'River', alt: 'river', icon: RiverIcon },
    //     { id: 'earthquake', title: 'Earthquake', alt: 'earthquake', icon: EarthquakeIcon },
    //     { id: 'pollution', title: 'Pollution', alt: 'pollution', icon: PollutionIcon },
    // ];
    // const pending = Object.keys(counts).length === 0;
    return (
        <div className={styles.initialPage}>
            {/* <Loading pending={pending} /> */}
            <div className={styles.optionContainer}>
                <div className={styles.mainTitle}>
                Data Archive
                </div>
                <div className={styles.options}>
                    {views.map((view) => {
                        const { id, title, alt, icon } = view;
                        return (
                            <Option
                                key={id}
                                handleOptionClick={handleOptionClick}
                                title={title}
                                alt={alt}
                                icon={icon}
                                // count={count}
                                // pending={pending}
                            />
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default connect(mapStateToProps)(LandingPage);
