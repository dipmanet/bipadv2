import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import styles from './styles.module.scss';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
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

const requests: { [key: string]: ClientAttributes<ComponentProps, Params> } = {
    getMenu: {
        url: '/adminportal-menu/',
        method: methods.GET,
        onMount: false,
        onSuccess: ({ response, params: { setMenu, setAllMenu }, props: { setAdminMenu } }) => {
            setAdminMenu(response.results);
            setMenu(response.results);
            setAllMenu(response.results);
        },
    },
};

const MenuCommon = (props: Props) => {
    const { layout, requests: { getMenu }, setAdminMenu, adminMenu } = props;
    const [Menu, setMenu] = useState<MenuItem[] | undefined>([]);
    const [AllMenu, setAllMenu] = useState<[] | undefined>([]);
    const [active, setActive] = useState<number | undefined>(undefined);
    const currentPageSlug = useRef(null);
    getMenu.setDefaultParams({ setMenu, setAllMenu });

    const handleMenuItemClick = (menuItem: MenuItem) => {
        if (menuItem.children) {
            navigate(`/admin/${menuItem.slug}/${menuItem.children[0].slug}`);
        } else if (menuItem.parent && AllMenu) {
            const parentSlug = AllMenu.filter(mI => mI.id === menuItem.parent)[0].slug;
            navigate(`/admin/${parentSlug}/${menuItem.slug}`);
        } else {
            navigate(`/admin/${menuItem.slug}`);
        }
    };

    useEffect(() => {
        setAdminMenu(adminMenu);
        setMenu(adminMenu);
        setAllMenu(adminMenu);
        // if (adminMenu.length === 0) {
        //     console.log('getting menu...');
        //     getMenu.do();
        //     setAdminMenu();
        // } else {
        //     setAllMenu(adminMenu);
        //     setMenu(adminMenu);
        // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (AllMenu) {
            const location = window.location.href;
            const menuSlug = location.split(`${process.env.REACT_APP_DOMAIN}`)[1].split('/admin')[1];
            if (menuSlug) {
                const parentSlug = menuSlug.split('/')[1];

                if (parentSlug.length > 2) {
                    currentPageSlug.current = menuSlug.split('/')[menuSlug.split('/').length - 1];
                } else {
                    currentPageSlug.current = menuSlug.split('/')[1];
                }
                const childMenu = AllMenu.filter(item => item.slug === parentSlug)[0];
                console.log('test', childMenu);
                if (childMenu) {
                    const childM = AllMenu.filter(item => item.slug === parentSlug)[0].children;
                    console.log('childM', childM);
                    if (childM) {
                        // eslint-disable-next-line max-len
                        const activeIndex = childM.map(cM => cM.slug).indexOf(currentPageSlug.current);
                        setActive(activeIndex);
                        setMenu(childM);
                    } else {
                        setActive(0);
                        setMenu([childMenu]);
                    }
                }
            } else {
                setMenu(AllMenu);
            }
        }
    }, [AllMenu]);

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
    createConnectedRequestCoordinator()(
        createRequestClient(requests)(
            MenuCommon,
        ),
    ),
);
