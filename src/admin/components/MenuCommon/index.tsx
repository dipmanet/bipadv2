import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import styles from './styles.module.scss';
import { userSelector, adminMenuSelector } from '#selectors';
import { SetAdminMenuAction } from '#actionCreators';

interface Props {
    currentPage?: MenuItem;
    layout: string;
    subLevel: string;
}
interface MenuItem {
    'id': string;
    'children': null | MenuItem;
    'title': string;
    'titleNp': string;
    'slug': string;
    'isEnabled': boolean;
    'lft': number;
    'rght': number;
    'treeId': number;
    'level': number;
    'parent': number;
    'isPublic': boolean;

}

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    user: userSelector(state),
    adminMenu: adminMenuSelector(state),
});
const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setAdminMenu: params => dispatch(SetAdminMenuAction(params)),
});

const MenuCommon = (props: Props) => {
    const { layout, adminMenu, uri } = props;
    const [Menu, setMenu] = useState<MenuItem[] | undefined>([]);
    const [active, setActive] = useState<number | undefined>(undefined);
    const currentPageSlug = useRef(null);

    const handleMenuItemClick = (menuItem: MenuItem) => {
        if (menuItem.children) {
            navigate(`/admin/${menuItem.slug}/${menuItem.children[0].slug}`);
        } else if (menuItem.parent && adminMenu) {
            const parentSlug = adminMenu.filter(mI => mI.id === menuItem.parent)[0].slug;
            navigate(`/admin/${parentSlug}/${menuItem.slug}`);
        } else {
            navigate(`/admin/${menuItem.slug}`);
        }
    };

    useEffect(() => {
        if (uri === '/admin') {
            setMenu(adminMenu);
        } else {
            let menuSlug;
            if (uri === '/admin/admin') {
                menuSlug = '/admin';
            } else {
                menuSlug = uri.split('/admin')[1];
            }
            if (menuSlug) {
                const parentSlug = menuSlug.split('/')[1];
                if (parentSlug.length > 2) {
                    currentPageSlug.current = menuSlug.split('/')[menuSlug.split('/')
                        .length - 1];
                } else {
                    currentPageSlug.current = menuSlug.split('/')[1];
                }
                const childMenu = adminMenu.filter(item => item.slug === parentSlug)[0];
                if (childMenu) {
                    const childM = adminMenu.filter(item => item.slug === parentSlug)[0].children;
                    if (childM) {
                        // eslint-disable-next-line max-len
                        const activeIndex = childM.map(cM => cM.slug)
                            .indexOf(currentPageSlug.current);
                        setActive(activeIndex);
                        setMenu(childM);
                    } else {
                        setActive(0);
                        setMenu([childMenu]);
                    }
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     if (AllMenu) {
    //         const location = window.location.href;
    //         console.log('location', location);
    //         const menuSlug = location.split(`${process.env.REACT_APP_DOMAIN}`)[1]
    // .split('/admin')[1];
    //         if (menuSlug) {
    //             const parentSlug = menuSlug.split('/')[1];
    //             console.log('location parennt', parentSlug);
    //             if (parentSlug.length > 2) {
    //                 currentPageSlug.current = menuSlug.split('/')[menuSlug.split('/')
    // .length - 1];
    //                 console.log('location current', currentPageSlug.current);
    //             } else {
    //                 currentPageSlug.current = menuSlug.split('/')[1];
    //                 console.log('location current', currentPageSlug.current);
    //             }
    //             const childMenu = AllMenu.filter(item => item.slug === parentSlug)[0];
    //             console.log('location child', childMenu);
    //             if (childMenu) {
    //                 const childM = AllMenu.filter(item => item.slug === parentSlug)[0].children;
    //                 if (childM) {
    //                     // eslint-disable-next-line max-len
    //                     const activeIndex = childM.map(cM => cM.slug)
    // .indexOf(currentPageSlug.current);
    //                     setActive(activeIndex);
    //                     setMenu(childM);
    //                 } else {
    //                     setActive(0);
    //                     setMenu([childMenu]);
    //                 }
    //             }
    //         } else {
    //             setMenu(AllMenu);
    //         }
    //     }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [Menu]);

    return (
        <div className={styles.menuCommonContainer} style={layout === 'landing' ? { background: '#fff' } : { background: '#3e3e3e' }}>
            {
                Menu && Menu.filter(item => item.isEnabled && item.isPublic)
                    .map((menuItem: MenuItem, i: number) => (
                        <div
                            key={menuItem.id}
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

                            >
                                {menuItem.title}

                            </div>
                        </div>
                    ))
            }
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    MenuCommon,
);
