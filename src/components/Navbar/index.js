import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { reverseRoute } from '#rsu/common';
import Button from '#rsca/Button';
import ListView from '#rscv/List/ListView';

import {
    pathNames,
    iconNames,
} from '#constants';
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
    },
    {
        title: 'Risk Information',
        link: 'riskInfo',
    },
    {
        title: 'Capacity & Resources',
        link: 'capacityAndResources',
    },
    {
        title: 'Incidents',
        link: 'incidents',
    },
    {
        title: 'Loss & Damage',
        link: 'lossAndDamage',
    },
    {
        title: 'DRR Profile Mapping',
        link: 'drrProfileMapping',
    },
    {
        title: 'Policy & Publications',
        link: 'policyAndPublication',
    },
    {
        title: 'About Us',
        link: 'aboutUs',
    },
];

const MenuItem = ({
    className,
    title,
    link,
}) => (
    <Link
        className={_cs(className, styles.menuItem)}
        to={reverseRoute(pathNames[link], {})}
    >
        {title}
    </Link>
);

export default class Navbar extends React.PureComponent {
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
    });

    render() {
        const { className: classNameFromProps } = this.props;
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
                    <header>
                        <div className={styles.logo}>
                            <div className={styles.left} />
                            <div className={styles.right}>
                                Bipad
                            </div>
                        </div>
                        <Button
                            className={styles.menuCloseButton}
                            iconName={iconNames.close}
                            onClick={this.handleMenuClose}
                            transparent
                            smallHorizontalPadding
                            smallVerticalPadding
                        />
                    </header>
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
                <Button
                    className={styles.menuButton}
                    iconName={iconNames.menu}
                    onClick={this.handleMenuOpen}
                    transparent
                    smallHorizontalPadding
                    smallVerticalPadding
                />
            </nav>
        );
    }
}
