import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { AttributeKey } from '#types';

import styles from './styles.scss';

interface Props {
    className?: string;
    title: string;
    description?: string;
    attributeKey: AttributeKey;
    onClick: (key: AttributeKey) => void;
    icon: string;
    titleShown: boolean;
    isActive: boolean;
    color?: string;
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
            icon,
            titleShown,
            isActive,
            color,
        } = this.props;

        const style = {
            color,
        };

        return (
            <div
                className={_cs(
                    className,
                    styles.attribute,
                    isActive && styles.active,
                    !titleShown && styles.iconOnly,
                )}
                onClick={this.handleClick}
                role="presentation"
                title={description}
                style={style}
            >
                <div className={styles.left}>
                    <h4 className={styles.icon}>
                        {icon}
                    </h4>
                </div>
                { titleShown && (
                    <div className={styles.right}>
                        <h4 className={styles.title}>
                            {title}
                        </h4>
                        <div className={styles.description}>
                            { description }
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Attribute;
