import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Checkbox from '#rsci/Checkbox';
import Button from '#rsca/Button';
import ListView from '#rscv/List/ListView';

import { RiskElement } from '#types';

import DropdownMenu from '#rsca/DropdownMenu';
import styles from './styles.scss';
import Icon from '#rscg/Icon';


interface Props {
    title: string;
    description: string;
    className?: string;
}

interface State {
    isExpanded: boolean;
}

interface IconElement {
    key: number;
    name: string;
    description: string;
}


const iconList: IconElement[] = [
    {
        key: 1,
        name: 'eye',
        description: 'Display Metadata',
    },
    {
        key: 2,
        name: 'download',
        description: 'Download the data',
    },
    {
        key: 3,
        name: 'table',
        description: 'View in attribute table',
    },
    {
        key: 4,
        name: 'share',
        description: 'Share this view',
    },
    {
        key: 5,
        name: 'contrast',
        description: 'Transparency/ Opacity',
    },
];

const iconListKeySelector = (d: IconElement) => d.key;

const iconListRenderer = (item: IconElement) => (
    <div>
        <Icon name={item.name} />
    </div>
);

const iconListRendererParams = (_: number, item: IconElement) => ({
    key: item.key,
    name: item.name,
    description: item.description,
});

class RiskItem extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            isExpanded: false,
        };
    }

    private handleExpandButtonClick = () => {
        this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));
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
                                {title}
                            </div>
                            <Icon
                                className={styles.icon}
                                name={isExpanded ? 'chevronUp' : 'chevronDown'}
                            />
                        </Button>
                    </div>
                </div>
                {isExpanded && (
                    <div className={styles.bottom}>
                        <div className={styles.description}>
                            {description}
                        </div>
                        <div className={styles.iconMenu}>
                            <ListView
                                data={iconList}
                                className={styles.iconList}
                                keySelector={iconListKeySelector}
                                renderer={iconListRenderer}
                                rendererParams={iconListRendererParams}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default RiskItem;
