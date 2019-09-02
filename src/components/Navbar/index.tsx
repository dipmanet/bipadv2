import React from 'react';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';

import { routeSettings, iconNames } from '#constants';

import Logo from './Logo';
import MenuItem from './MenuItem';

import styles from './styles.scss';

const adminEndpoint = process.env.REACT_APP_ADMIN_LOGIN_URL || 'https://bipad.nepware.com/admin';

const pages = routeSettings.filter(setting => !!setting.navbar) as Menu[];

interface Props {
    className?: string;
}

interface State {
}

interface Menu {
    title: string;
    name: string;
    path: string;
    iconName: string;
    disabled: boolean;
}

const menuKeySelector = (d: {name: string}) => d.name;

export default class Navbar extends React.PureComponent<Props, State> {
    private handleUserClick = () => {
        console.warn('I am loggin in');
    }

    private handleMenuClose = () => {
        this.setState({ menuShown: false });
    }

    private menuRendererParams = (_: string, data: Menu) => ({
        title: data.title,
        link: data.path,
        iconName: data.iconName,
        disabled: data.disabled,
    });

    public render() {
        const {
            className,
        } = this.props;

        return (
            <React.Fragment>
                <nav className={_cs(styles.navbar, className)}>
                    <Logo />
                    <ListView
                        data={pages}
                        keySelector={menuKeySelector}
                        renderer={MenuItem}
                        rendererParams={this.menuRendererParams}
                        className={styles.middle}
                    />
                    <div className={styles.right}>
                        <a
                            className={styles.adminLink}
                            href={adminEndpoint}
                            type="button"
                            title="login"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className={iconNames.login} />
                        </a>
                    </div>
                </nav>
            </React.Fragment>
        );
    }
}
