import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Router, Link } from '@reach/router';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import ListView from '#rscv/List/ListView';
import { routeSettings, iconNames } from '#constants';

import { setMapStyleAction } from '#actionCreators';
import { mapStylesSelector } from '#selectors';

import styles from './styles.scss';

const pages = routeSettings.filter(setting => !!setting.navbar);

const Title = ({ name, title }) => (
    <div>
        {title}
    </div>
);

const titles = routeSettings.map(props => (
    <Title
        key={props.name}
        {...props}
    />
));

const MenuItem = ({
    className,
    title,
    link,
    iconName,
    // routeKey,
    disabled,
}) => {
    if (disabled) {
        return (
            <div
                className={
                    _cs(
                        className,
                        styles.menuItem,
                        // routeKey === link && styles.selected,
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
        );
    }

    const getProps = ({ isCurrent }) => ({
        className: _cs(
            className,
            styles.menuItem,
            isCurrent && styles.selected,
            disabled && styles.disabled,
        ),
    });

    return (
        <Link
            to={link}
            getProps={getProps}
        >
            <div
                className={_cs(iconName, styles.icon)}
                title={title}
            />
            <div className={styles.menuTitle}>
                {title}
            </div>
        </Link>
    );
};

MenuItem.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    iconName: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
};

const layerKeySelector = d => d.name;

MenuItem.defaultProps = {
    className: '',
    disabled: false,
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

    static menuKeySelector = d => d.name;

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
        link: data.path,
        iconName: data.iconName,
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
                            type="button"
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
                            <Router>
                                {titles}
                            </Router>
                        </div>
                    </div>
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
    mapStyles: mapStylesSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setMapStyle: params => dispatch(setMapStyleAction(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
