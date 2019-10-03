import React from 'react';
import { Link } from '@reach/router';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

interface Props {
    className?: string;
    title: string;
    link: string;
    iconName?: string;
    disabled?: boolean;
}

interface State {
}

export default class MenuItem extends React.PureComponent<Props, State> {
    private getProps = ({ isCurrent }: { isCurrent: boolean }) => {
        const {
            className,
            disabled,
        } = this.props;

        return {
            className: _cs(
                className,
                styles.menuItem,
                isCurrent && styles.active,
                disabled && styles.disabled,
            ),
        };
    }

    public render() {
        const {
            title,
            link,
            iconName,
        } = this.props;

        return (
            <Link
                to={link}
                getProps={this.getProps}
            >
                <div
                    className={_cs(iconName, styles.icon)}
                    title={title}
                />
                <div className={styles.title}>
                    {title}
                </div>
            </Link>
        );
    }
}
