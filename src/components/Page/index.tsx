import PropTypes from 'prop-types';
import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

interface Props {
    className?: string;

    leftContent?: React.ReactElement;
    rightContent?: React.ReactElement;
    mainContent?: React.ReactElement;

    leftContentClassName?: string;
    rightContentClassName?: string;
    mainContentClassName?: string;
}

interface State {
}

export default class Page extends React.PureComponent<Props, State> {
    public render() {
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
                { leftContent && (
                    <aside className={_cs(styles.leftContent, leftContentClassName)}>
                        { leftContent }
                    </aside>
                ) }
                { mainContent && (
                    <main className={_cs(styles.mainContent, mainContentClassName)}>
                        { mainContent }
                    </main>
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
