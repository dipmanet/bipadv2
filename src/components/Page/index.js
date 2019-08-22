import PropTypes from 'prop-types';
import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    leftContent: PropTypes.node,
    rightContent: PropTypes.node,
    mainContent: PropTypes.node,
};

const defaultProps = {
    className: '',
    leftContent: undefined,
    rightContent: undefined,
    mainContent: undefined,
};

export default class Page extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    render() {
        const {
            className,
            leftContent,
            leftContentClassName,
            rightContent,
            rightContentClassName,
            mainContent,
            mainContentClassName,
        } = this.props;

        return (
            <React.Fragment>
                { mainContent && (
                    <main className={_cs(styles.mainContent, mainContentClassName)}>
                        { mainContent }
                    </main>
                ) }
                { leftContent && (
                    <aside className={_cs(styles.leftContent, leftContentClassName)}>
                        { leftContent }
                    </aside>
                ) }
                { rightContent && (
                    <aside className={_cs(styles.rightContent, rightContentClassName)}>
                        { rightContent }
                    </aside>
                ) }
            </React.Fragment>
        );
    }
}
