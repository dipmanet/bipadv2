import React, { useEffect, useState } from 'react';
// import { FontAwesomeIcon } from '@fontawesome/react-fontawesome';
// import { faAngleDown } from '@fontawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { navigate } from '@reach/router';
// import { Navigate, useNavigate } from 'react-router';
import styles from './styles.module.scss';
import SubMenu from './SubMenu';
import { slugRef, Menus, ref } from './menu';

interface Props {
    currentPage: MenuItems;
    layout: string;
}
type SubMenuItems = 'Data Table' | 'Add New Data' | 'Bulk Upload';
type MenuItems = 'Health Infrastructure' | 'COVID-19' | 'Epidemics' | 'Data Overview' | 'Admin';


const MenuCommon = (props: Props) => {
    const { currentPage, layout } = props;
    const [Menu, setMenu] = useState<MenuItems | undefined>(undefined);
    const [active, setActive] = useState<number | undefined>(undefined);
    const [activeSubMenu, setActiveSubMenu] = useState<number | undefined>(undefined);
    const [showSub, setShowSub] = useState<boolean>(false);
    // const navigate = useNavigate();
    // const { userDataMain } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        // if (userDataMain && userDataMain.isSuperuser) {
        //     setMenu(Menus.superuser);
        // } else if (userDataMain && userDataMain.profile && userDataMain.profile.role) {
        //     setMenu(Menus[userDataMain.profile.role]);
        // } else {
        setMenu(Menus.editor);
        // }
    }, []);


    const handleMenuItemClick = (menuItem: MenuItems) => {
        if (menuItem === 'Data Overview' || menuItem === 'Admin') {
            navigate(`/admin/${ref[menuItem]}`);
        }
        setActive(Menu.indexOf(menuItem));
        setActiveSubMenu(Menu.indexOf(menuItem));
        setShowSub(!showSub);
    };


    useEffect(() => {
        if (Menu) {
            const location = window.location.href;
            const currentSlug = location.split('admin/')[1];
            setActive(Menu.indexOf(slugRef[currentSlug]));
        }
    });


    const handleClickOutside = (e) => {
        if (e.target.className !== 'styles_menuItem__3ZyaX') {
            setShowSub(false);
        }
    };

    const getSubMenuItem = (submenuItem: SubMenuItems, menuItem: MenuItems) => {
        setShowSub(false);

        setActive(Menu.indexOf(menuItem));
        navigate(`/admin/${ref[menuItem]}-${ref[submenuItem]}`);
        // handle sub menu click
    };

    return (
        <div className={styles.menuCommonContainer} style={layout === 'landing' ? { background: '#fff' } : { background: '#3e3e3e' }}>
            {
                Menu && Menu.map((menuItem: MenuItems, i: number) => (
                    <div
                        key={menuItem}
                        className={
                            i === active
                                ? styles.activeMenu
                                : styles.menuItemContainer
                        }
                    >
                        <div
                            role="presentation"
                            onClick={() => handleMenuItemClick(menuItem)}
                            className={styles.menuItem}
                            key={menuItem}

                        >
                            {menuItem}
                            {/* {
                                i < 3
                                && (
                                    <FontAwesomeIcon
                                        icon={faAngleDown}
                                        className={styles.icon}
                                    />
                                )
                            } */}
                        </div>
                        {
                            activeSubMenu === i
                            && showSub
                            && i < 3
                            && (
                                <SubMenu getSubMenuItem={
                                    (e: SubMenuItems) => getSubMenuItem(e, menuItem)
                                }
                                />
                            )
                        }
                    </div>
                ))
            }
        </div>
    );
};

export default MenuCommon;
