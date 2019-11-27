import React from 'react';
import { Link } from '@reach/router';
import { _cs } from '@togglecorp/fujs';

import Icon from '#rscg/Icon';

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
            titleClassName,
        } = this.props;

        return (
            <Link
                to={link}
                getProps={this.getProps}
            >
                <Icon
                    className={styles.icon}
                    name={iconName}
                    title={title}
                />
                {/*
                <div className={_cs(titleClassName, styles.title)}>
                    {title}
                </div>
                  */}
            </Link>
        );
    }
}
