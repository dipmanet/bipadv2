import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './styles.module.scss';
// import { covidDataGetIndividualId } from '../../../Redux/covidActions/covidActions';

interface Props {
    getSubMenuItem: (e: string) => void;
}
type SubMenuItems = 'Data Table' | 'Add New Data' | 'Bulk Upload';
// const SubMenuList = ['Data Table', 'Add New Data', 'Bulk Upload'];

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
    // const { userDataMain } = useSelector((state:RootState) => state.user);
    const handleSubMenuItemClick = (submenuItem: SubMenuItems) => {
        getSubMenuItem(submenuItem);
    };


    return (
        <div className={styles.subMenuContainer}>
            {
                <div className={styles.submenuItemContainer}>
                    {
                        SubMenuList.map((subMenuItem: SubMenuItems) => (
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
