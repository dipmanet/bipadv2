import React from 'react';
import { _cs } from '@togglecorp/fujs';

import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';

import styles from './styles.scss';

type AttributeKey = 'hazard' | 'exposure' | 'vulnerability' | 'risk' | 'capacity-and-resources' | 'climate-change';

interface Props {
    className?: string;
    title: string;
    description?: string;
    color?: string;
    attributeKey: AttributeKey;
    onClick: (key: AttributeKey) => void;
    icon: string;
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
            color,
            icon,
        } = this.props;

        return (
            <div
                className={_cs(className, styles.attribute)}
                onClick={this.handleClick}
                role="presentation"
                title={description}
                style={{
                    color,
                }}
            >
                <div className={styles.left}>
                    <ScalableVectorGraphics
                        className={styles.icon}
                        src={icon}
                    />
                </div>
                <div className={styles.right}>
                    <h4 className={styles.title}>
                        {title}
                    </h4>
                    <div className={styles.description}>
                        {description}
                    </div>
                </div>
            </div>
        );
    }
}

export default Attribute;
