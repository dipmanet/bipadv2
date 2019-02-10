import PropTypes from 'prop-types';
import React from 'react';

import Button from '#rsca/Button';

import { iconNames } from '#constants';
import _cs from '#cs';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

export default class Navbar extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    render() {
        const {
            className: classNameFromProps,
        } = this.props;

        const className = _cs(
            classNameFromProps,
            styles.navbar,
        );

        return (
            <nav className={className}>
                <div className={styles.logo}>
                    <div className={styles.left} />
                    <div className={styles.right}>
                        Bipad
                    </div>
                </div>
                <Button
                    className={styles.menuButton}
                    iconName={iconNames.menu}
                    transparent
                    smallHorizontalPadding
                    smallVerticalPadding
                />
            </nav>
        );
    }
}
