import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';

import styles from './styles.scss';

interface Props {
    name: string;
    color: string;
    className?: string;
}

export default class LayerButton extends React.PureComponent<Props> {
    public render() {
        const {
            name,
            color,
            className,
        } = this.props;

        return (
            <Button
                className={_cs(styles.layerButton, className)}
                transparent
            >
                <div
                    className={styles.colorPreview}
                    style={{ backgroundColor: color }}
                />
                <div className={styles.title}>
                    { name }
                </div>
            </Button>
        );
    }
}
