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

import {
    routePathKeySelector,
    mapStylesSelector,
    setMapStyleAction,
} from '#redux';

import _cs from '#cs';

import styles from './styles.scss';

const layerKeySelector = d => d.name;

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

const propTypes = {
    className: PropTypes.string,
    mapStyles: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    setMapStyle: PropTypes.func.isRequired,
};

const defaultProps = {
    className: '',
    mapStyles: [],
};

class Navbar extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    static menuKeySelector = d => d.link;

    constructor(props) {
        super(props);

        this.state = { menuShown: false };
    }

    handleMenuClick = () => {
        this.setState({ menuShown: !this.state.menuShown });
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

    handleStyleSelection = (data) => {
        const { setMapStyle } = this.props;
        const { style } = data;
        setMapStyle(style);
    }

    renderLayer = (key, data) => {
        const {
            color,
            name,
        } = data;

        return (
            <Button
                key={key}
                className={styles.mapLayerButton}
                onClick={() => this.handleStyleSelection(data)}
                transparent
            >
                <div
                    className={styles.preview}
                    style={{ backgroundColor: color }}
                />
                <div className={styles.label}>
                    { name }
                </div>
            </Button>
        );
    }

    render() {
        const {
            className: classNameFromProps,
            mapStyles,
        } = this.props;

        const { menuShown } = this.state;

        const className = _cs(
            classNameFromProps,
            styles.navbar,
        );

        return (
            <React.Fragment>
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
                        <button
                            className={styles.layerSwitchButton}
                            onClick={this.handleMenuClick}
                            type="submit"
                        >
                            <span className={iconNames.layers} />
                        </button>
                    </div>
                    <div className={styles.navbarLeftContainer}>
                        <div className={styles.logo}>
                            <div className={styles.left} />
                            <div className={styles.right}>
                                Bipad
                            </div>
                            <div className={styles.currentPage}>
                                {this.props.routeKey}
                            </div>
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
                {menuShown &&
                    <div className={styles.layerSwitchBox} >
                        <div className={styles.header}>
                            <h4>
                                Map Layers
                            </h4>
                            <Button
                                onClick={this.handleMenuClick}
                                iconName={iconNames.close}
                                transparent
                            />
                        </div>
                        <ListView
                            className={styles.layerSwitch}
                            data={mapStyles}
                            keySelector={layerKeySelector}
                            modifier={this.renderLayer}
                            emptyComponent={null}
                        />
                    </div>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    routeKey: routePathKeySelector(state),
    mapStyles: mapStylesSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setMapStyle: params => dispatch(setMapStyleAction(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
