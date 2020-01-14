import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Icon from '#rscg/Icon';

import styles from './styles.scss';

interface Props {
    className?: string;
    onClick: (key: string | number) => void;
    optionKey: string | number;
    label?: React.ReactNode | string;
    isActive: boolean;
}

class Option extends React.PureComponent<Props> {
    private handleClick = () => {
        const {
            onClick,
            optionKey,
        } = this.props;

        onClick(optionKey);
    }

    public render() {
        const {
            className,
            label,
            isActive,
            iconClassName,
            labelContainerClassName,
        } = this.props;

        return (
            <div
                role="presentation"
                onClick={this.handleClick}
                className={_cs(
                    className,
                    styles.option,
                )}
            >
                <Icon
                    className={_cs(styles.icon, iconClassName)}
                    name={isActive ? 'radioOn' : 'radioOff'}
                />
                <div className={_cs(styles.label, labelContainerClassName)}>
                    { label }
                </div>
            </div>

        );
    }
}

export default Option;
