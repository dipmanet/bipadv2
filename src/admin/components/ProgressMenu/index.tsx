import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import { Menu } from './utils';
import Icon from '#rscg/Icon';
import LanguageToggle from '#components/LanguageToggle';
import { languageSelector } from '#selectors';

interface MenuItems {
    name: string;
    icon: string;
    permission: string[];
}

interface Props {
    progress: number;
    getActiveMenu: (e: number) => void;
    activeMenu: number;
    menuKey: string;
}
interface OurState{
    resourceID: number;
    loadingInv: boolean;
    inventoryErr: Record<string, unknown>;
    inventoryData: {unit: string | number};
    inventoryItem: Record<string, unknown>;
    invItemSuccess: boolean;
    invItemError: Record<string, unknown>;
    health: {resourceID: number;inventoryData: []};
}

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    language: languageSelector(state),
});


const ProgressMenu = (props: Props): JSX.Element => {
    const { progress, activeMenu: active, menuKey, language: { language } } = props;
    const [MenuItems, setMenuItems] = useState(Menu[menuKey]);


    return (
        <div className={styles.progressMenuContainer}>
            <LanguageToggle />
            {
                MenuItems.map((menuItem: MenuItems, i: number) => (
                    <div
                        role="presentation"
                        key={menuItem.name}
                        className={
                            active === menuItem.position
                                ? styles.menuItemActive
                                : styles.menuItem
                        }
                    >
                        <div className={styles.sub}>
                            <img
                                src={menuItem.icon}
                                className={styles.mainIcon}
                                alt="icon"
                            />
                            {language === 'np' ? menuItem.name : menuItem.name_en}
                        </div>
                        <Icon
                            name={'circle'}
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
