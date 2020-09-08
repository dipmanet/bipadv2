import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';

import styles from './styles.scss';

interface Props {
    name: string;
    color: string;
    style: string;
    onClick?: (style: string) => void;
    className?: string;
    isActive: boolean;
    title: string;
    description: string;
    icon: string;
}

export default class LayerButton extends React.PureComponent<Props> {
    private handleClick = () => {
        const {
            onClick,
            style,
        } = this.props;

        if (onClick) {
            onClick(style);
        }
    }

    public render() {
        const {
            name,
            color,
            className,
            isActive,
            title,
            description,
            icon,
        } = this.props;

        return (
            <Button
                onClick={this.handleClick}
                className={_cs(
                    styles.layerButton,
                    className,
                    isActive && styles.active,
                )}
                transparent
                title={`${description}`}
            >
                {/* <div
                    className={styles.colorPreview}
                    style={{ backgroundColor: color }}
                />
                <div className={styles.title}>
                    { title }
                </div> */}
                <div className={styles.content}>
                    <img src={icon} alt="LayerSpecificIcon" />
                    <div className={styles.description}>
                        <b>{title}</b>
                        {''}
                          :
                        {' '}
                        {description}
                    </div>
                </div>
            </Button>
        );
    }
}
