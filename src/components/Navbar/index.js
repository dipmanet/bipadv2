import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { reverseRoute } from '@togglecorp/fujs';
import Button from '#rsca/Button';
import ListView from '#rscv/List/ListView';

import {
    pathNames,
    iconNames,
} from '#constants';

import { routePathKeySelector } from '#redux';

import _cs from '#cs';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

const pages = [
    {
        title: 'Dashboard',
        link: 'dashboard',
        iconName: iconNames.dashboard,
        disabled: false,
    },
    {
        title: 'Incidents',
        link: 'incidents',
        iconName: iconNames.incidents,
        disabled: false,
    },
    {
        title: 'Risk Information',
        link: 'riskInfo',
        iconName: iconNames.riskMap,
        disabled: false,
    },
    {
        title: 'Loss & Damage',
        link: 'lossAndDamage',
        iconName: iconNames.lossAndDamange,
        disabled: true,
    },
    {
        title: 'Real Time',
        link: 'realtime',
        iconName: iconNames.realtime,
        disabled: true,
    },
    {
        title: 'Profile Mapping',
        link: 'drrProfileMapping',
        iconName: iconNames.drrProfileMapping,
        disabled: true,
    },
    {
        title: 'About Us',
        link: 'aboutUs',
        iconName: iconNames.aboutUs,
        disabled: true,
    },
];

const MenuItem = ({
    className,
    title,
    link,
    iconName,
    routeKey,
    disabled,
}) => (
    !disabled ? (
        <Link
            className={
                _cs(
                    className,
                    styles.menuItem,
                    routeKey === link && styles.selected,
                    disabled && styles.disabled,
                )
            }
            to={reverseRoute(pathNames[link], {})}
        >
            <div
                className={_cs(iconName, styles.icon)}
                title={title}
            />
            <div className={styles.menuTitle}>
                {title}
            </div>
        </Link>
    ) : (
        <div
            className={
                _cs(
                    className,
                    styles.menuItem,
                    routeKey === link && styles.selected,
                    disabled && styles.disabled,
                )
            }
        >
            <span
                className={_cs(iconName, styles.icon)}
                title={title}
            />
            <div className={styles.menuTitle}>
                {title}
            </div>
        </div>
    )
);

MenuItem.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    link: PropTypes.string,
    iconName: PropTypes.string,
    routeKey: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
};

MenuItem.defaultProps = {
    className: '',
    title: '',
    link: '',
    iconName: '',
    routeKey: '',
};

const mapStateToProps = state => ({
    routeKey: routePathKeySelector(state),
});

class Navbar extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    static menuKeySelector = d => d.link;

    constructor(props) {
        super(props);

        this.state = { menuShown: false };
    }

    handleMenuOpen = () => {
        this.setState({ menuShown: true });
    }

    handleMenuClose = () => {
        this.setState({ menuShown: false });
    }

    menuRendererParams = (key, data) => ({
        title: data.title,
        link: data.link,
        iconName: data.iconName,
        routeKey: this.props.routeKey,
        disabled: data.disabled,
    });

    render() {
        const {
            className: classNameFromProps,
        } = this.props;

        const { menuShown } = this.state;

        const className = _cs(
            classNameFromProps,
            styles.navbar,
        );

        return (
            <nav className={className}>
                <div
                    className={
                        _cs(
                            styles.menu,
                            menuShown && styles.shown,
                        )
                    }
                >
                    {/*
                    <header>
                        <Button
                            className={styles.menuCloseButton}
                            iconName={iconNames.close}
                            onClick={this.handleMenuClose}
                            transparent
                            smallHorizontalPadding
                            smallVerticalPadding
                        />
                    </header>
                    */}
                    <ListView
                        data={pages}
                        keySelector={Navbar.menuKeySelector}
                        renderer={MenuItem}
                        rendererParams={this.menuRendererParams}
                        className={styles.menuItems}
                    />
                </div>
                <div className={styles.logo}>
                    <div className={styles.left} />
                    <div className={styles.right}>
                        Bipad
                    </div>
                </div>
                {/*
                <Button
                    className={styles.menuButton}
                    iconName={iconNames.menu}
                    onClick={this.handleMenuOpen}
                    transparent
                    smallHorizontalPadding
                    smallVerticalPadding
                />
                */}
            </nav>
        );
    }
}

export default connect(mapStateToProps)(Navbar);
