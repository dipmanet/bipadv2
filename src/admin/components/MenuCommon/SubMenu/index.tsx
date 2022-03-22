import React from 'react';
import styles from './styles.module.scss';

interface Props {
    getSubMenuItem: (e: string) => void;
}
type SubMenuItems = 'Data Table' | 'Add New Data' | 'Bulk Upload';

const SubMenuList = [
    {
        title: 'Data Table',
        permission: ['editor', 'validator', 'user', 'superuser'],
    },
    {
        title: 'Add New Data',
        permission: ['editor', 'user', 'superuser'],
    },
    {
        title: 'Bulk Upload',
        permission: ['editor', 'validator', 'user', 'superuser'],
    },
];

const SubMenu = (props: Props) => {
    const { getSubMenuItem } = props;
    const handleSubMenuItemClick = (submenuItem: SubMenuItems) => {
        getSubMenuItem(submenuItem);
    };


    return (
        <div className={styles.subMenuContainer}>
            {
                <div className={styles.submenuItemContainer}>
                    {
                        SubMenuList.map(subMenuItem => (
                            <div
                                role="presentation"
                                onClick={() => handleSubMenuItemClick(subMenuItem.title)}
                                className={styles.menuItem}
                                key={subMenuItem.title}
                            >
                                {subMenuItem.title}
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    );
};

export default SubMenu;
