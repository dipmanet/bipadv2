import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

interface Props {
    className?: string;
    title: string;
    description?: string;
    attributeKey: string;
    onClick: (key: string) => void;
}

interface State {
}

class Attribute extends React.Component<Props, State> {
    private handleClick = () => {
        const {
            onClick,
            attributeKey,
        } = this.props;

        onClick(attributeKey);
    }

    public render() {
        const {
            className,
            title,
            description,
        } = this.props;

        return (
            <div
                className={_cs(className, styles.attribute)}
                onClick={this.handleClick}
                role="presentation"
            >
                <h4 className={styles.title}>
                    {title}
                </h4>
                <div className={styles.description}>
                    {description}
                </div>
            </div>
        );
    }
}

export default Attribute;
