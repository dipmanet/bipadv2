/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import LanguageToggle from '#components/LanguageToggle';
import { languageSelector } from '#selectors';

import Icon from '#rscg/Icon';
import { Menu } from './utils';
// import { useSelector } from 'react-redux';
import styles from './styles.module.scss';
import InstituteLogo from '../../resources/institute.svg';
import DisasterManLogo from '../../resources/disaster-management.svg';
import ContactLogo from '../../resources/contact.svg';
import InventoryLogo from '../../resources/inventory.svg';
import LocationLogo from '../../resources/location.svg';
import PictureLogo from '../../resources/picture.svg';
import VerificationLogo from '../../resources/verification.svg';
// import { RootState } from '../../Redux/store';


interface MenuItems {
    name: string;
    icon: string;
    permission: string[];
}

interface Props {
    progress: number;
    getActiveMenu: (e: number) => void;
    activeMenu: number;
}
interface OurState {
    resourceID: number;
    loadingInv: boolean;
    inventoryErr: Record<string, unknown>;
    inventoryData: { unit: string | number };
    inventoryItem: Record<string, unknown>;
    invItemSuccess: boolean;
    invItemError: Record<string, unknown>;
    health: { resourceID: number; inventoryData: [] };
}

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    language: languageSelector(state),
});


const validatorMenu = [
    {
        name: 'Institution Details',
        icon: InstituteLogo,
        permission: ['superuser', 'editor', 'validator', 'user'],
    },
    {
        name: 'Disaster Management',
        icon: DisasterManLogo,
        permission: ['superuser', 'editor', 'validator', 'user'],
    },
    {
        name: 'Contact',
        icon: ContactLogo,
        permission: ['superuser', 'editor', 'validator', 'user'],
    },
    {
        name: 'Location',
        icon: LocationLogo,
        permission: ['superuser', 'editor', 'validator', 'user'],
    },
    {
        name: 'Picture',
        icon: PictureLogo,
        permission: ['superuser', 'editor', 'validator', 'user'],
    },
    {
        name: 'Inventories',
        icon: InventoryLogo,
        permission: ['superuser', 'editor', 'validator', 'user'],
    },

];

const getMenu = () => {
    const location = window.location.href;
    const menuSlug = location.split(`${process.env.REACT_APP_DOMAIN}`)[1].split('/admin')[1];
    if (menuSlug.includes('health')) {
        return (Menu.healthProgressMenu);
    }
    return (Menu.bulletinProgressMenu);
};

const ProgressMenu = (props: Props): JSX.Element => {
    const { progress, activeMenu: active, menuKey, language: { language } } = props;
    // const { resourceID, healthFormEditData } = useSelector((state: OurState) => state.health);
    // const { userDataMain } = useSelector((state: RootState) => state.user);


    const [MenuItems, setMenuItems] = useState(getMenu());

    // useEffect(() => {
    //     if (userDataMain.isSuperuser) {
    //         setMenuItems(MenuItemsAll);
    //     } else if (userDataMain.profile && userDataMain.profile.role) {
    //         if (userDataMain.profile.role === 'validator') {
    //             if (resourceID) {
    //                 setMenuItems(MenuItemsAll);
    //             } else {
    //                 // setMenuItems(MenuItemsAll.filter(mI => mI.permission.includes(userDataMain.profile.role)));
    //                 setMenuItems(validatorMenu);
    //             }
    //         } else {
    //             setMenuItems(MenuItemsAll.filter(mI => mI.permission.includes(userDataMain.profile.role)));
    //         }
    //     } else {
    //         setMenuItems(MenuItemsAll);
    //     }
    // }, [resourceID, userDataMain.isSuperuser, userDataMain.profile]);


    return (
        <div className={styles.progressMenuContainer}>
            {/* <LanguageToggle /> */}
            {
                MenuItems.map((menuItem: MenuItems, i: number) => (
                    <div
                        role="presentation"
                        key={menuItem.name}
                        className={
                            active === menuItem.name
                                ? styles.menuItemActive
                                : styles.menuItem
                        }
                    >
                        <div className={styles.sub}>
                            <img
                                src={menuItem.icon}
                                className={styles.mainIcon}
                                alt=""
                            />
                            {language === 'np'
                                ? menuItem.name
                                : menuItem.name_en
                            }
                        </div>
                        <Icon
                            name="circle"
                            className={progress <= i
                                ? styles.circleIconOn
                                : styles.circleIconOff
                            }
                        />

                    </div>
                ))
            }
        </div>
    );
};

export default connect(mapStateToProps)(ProgressMenu);
