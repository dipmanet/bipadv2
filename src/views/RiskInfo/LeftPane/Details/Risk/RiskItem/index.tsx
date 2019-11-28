import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Checkbox from '#rsci/Checkbox';
import Button from '#rsca/Button';

import { RiskElement } from '#types';

import styles from './styles.scss';
import Icon from '#rscg/Icon';
import { number, string } from 'prop-types';


interface Props {
    title: string;
    description: string;
    className?: string;
}

interface State {
    isExpanded: boolean;
}

interface iconElement {
    key: number;
    name: string;
    description: string;
}


const iconList: iconElement[] = [
    {
        key: 1,
        name: 'eye',
        description: 'Display Metadata',
    },
    {
        key: 2,
        name: ''
    }
];
class RiskItem extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            isExpanded: false,
        };
    }

    private handleExpandButtonClick = () => {
        const { isExpanded } = this.state;

        this.setState({ isExpanded: !isExpanded });
    }

    public render() {
        const {
            className,
            title,
            description,
        } = this.props;

        const { isExpanded } = this.state;

        return (
            <div
                className={_cs(className, styles.riskItem)}
            >
                <div className={styles.top}>
                    <div className={styles.left}>
                        <Checkbox
                            className={styles.check}
                        />
                    </div>
                    <div className={styles.right}>
                        <Button
                            className={styles.expandButton}
                            transparent
                            onClick={this.handleExpandButtonClick}
                        >
                            <div className={styles.title}>
                                { title }
                            </div>
                            <Icon
                                className={styles.icon}
                                name={isExpanded ? 'chevronUp' : 'chevronDown'}
                            />
                        </Button>
                    </div>
                </div>
                { isExpanded && (
                    <div className={styles.bottom}>
                        <div className={styles.description}>
                            {description}
                        </div>
                        <div className={styles.iconMenu}>
                            <Icon
                                name={'eye'}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default RiskItem;
