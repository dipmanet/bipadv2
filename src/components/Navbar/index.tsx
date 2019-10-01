import React from 'react';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';

import { routeSettings, iconNames } from '#constants';
import { authStateSelector } from '#selectors';
import { AppState } from '#store/types';
import { AuthState } from '#store/atom/auth/types';

import Logo from './Logo';
import MenuItem from './MenuItem';

import styles from './styles.scss';

const adminEndpoint = process.env.REACT_APP_ADMIN_LOGIN_URL || 'http://bipad-admin.localhost.com/admin';

const pages = routeSettings.filter(setting => !!setting.navbar) as Menu[];

interface Menu {
    title: string;
    name: string;
    path: string;
    iconName: string;
    disabled: boolean;
}

interface OwnProps {
    className?: string;
}

interface PropsFromState {
    authState: AuthState;
}

type Props = OwnProps & PropsFromState;

interface State {
}

const menuKeySelector = (d: {name: string}) => d.name;

const mapStateToProps = (state: AppState) => ({
    authState: authStateSelector(state),
});

class Navbar extends React.PureComponent<Props, State> {
    private menuRendererParams = (_: string, data: Menu) => ({
        title: data.title,
        link: data.path,
        iconName: data.iconName,
        disabled: data.disabled,
    });

    public render() {
        const {
            className,
            authState,
        } = this.props;

        const { authenticated } = authState;

        const linkContent = (
            <span
                className={authenticated ? iconNames.user : iconNames.login}
                title={authenticated ? 'Go to admin panel' : 'Login'}
            />
        );


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
                            {linkContent}
                        </a>
                    </div>
                </nav>
            </React.Fragment>
        );
    }
}

// check for map styles

export default connect(mapStateToProps)(
    Navbar,
);
