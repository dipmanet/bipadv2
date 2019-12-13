import React from 'react';

import { _cs } from '@togglecorp/fujs';
import ListView from '#rscv/List/ListView';
import Button from '#rsca/Button';
import Icon from '#rscg/Icon';


import { LayerWithGroup } from '#store/atom/page/types';

import Group from '../Group';
import styles from './styles.scss';

interface GroupElement {
    id: number;
    title: string;
    description: string;
    layers: LayerWithGroup[];
}
interface Props {
    earthquakeGroups: GroupElement[];
    className: string;
}

interface State {
    isExpanded: boolean;
}

const rendererParams = (_: number, group: GroupElement) => {
    const { id, title, description, layers } = group;
    return ({ id, title, description, layers, className: styles.group });
};

const groupKeySelector = (group: GroupElement) => group.id;

export default class extends React.PureComponent<Props, State> {
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
            earthquakeGroups,
            className,
        } = this.props;

        const {
            isExpanded,
        } = this.state;

        return (
            <div
                className={_cs(className, styles.earthquake)}
            >
                <Button
                    className={styles.button}
                    transparent
                    onClick={this.handleExpandButtonClick}
                >
                    <div className={styles.title}>Earthquake</div>
                    <Icon
                        className={styles.icon}
                        name={isExpanded ? 'chevronUp' : 'chevronDown'}
                    />
                </Button>
                { isExpanded && (
                    <ListView
                        data={earthquakeGroups}
                        keySelector={groupKeySelector}
                        renderer={Group}
                        rendererParams={rendererParams}
                    />
                )}
            </div>
        );
    }
}
