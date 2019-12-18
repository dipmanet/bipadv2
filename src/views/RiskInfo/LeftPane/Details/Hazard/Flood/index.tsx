import React from 'react';

import { _cs } from '@togglecorp/fujs';
import Button from '#rsca/Button';
import Icon from '#rscg/Icon';
import ListView from '#rscv/List/ListView';

import { LayerWithGroup } from '#store/atom/page/types';

import Group from '../Group';
import styles from './styles.scss';

interface FloodGroupElement {
    id: number;
    title: string;
    description: string;
    layers: LayerWithGroup[];
}

interface Props {
    floodGroups: FloodGroupElement[];
    className: string;
}

interface State {
    isExpanded: boolean;
}

const getFloodGroupRendererParams = (_: number, floodGroup: FloodGroupElement) => {
    const { id, title, description, layers } = floodGroup;
    return ({ id, title, description, layers });
};

const floodGroupKeySelector = (floodGroup: FloodGroupElement) => floodGroup.id;

export default class Flood extends React.PureComponent<Props, State> {
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
            floodGroups,
            className,
        } = this.props;

        const { isExpanded } = this.state;
        return (
            <div
                className={_cs(className, styles.flood)}
            >
                <Button
                    className={styles.button}
                    transparent
                    onClick={this.handleExpandButtonClick}
                >
                    <div className={styles.title}>
                        Flood
                    </div>

                    <Icon
                        className={styles.icon}
                        name={isExpanded ? 'chevronUp' : 'chevronDown'}
                    />
                </Button>
                { isExpanded && (
                    <ListView
                        className={styles.floodGroupList}
                        data={floodGroups}
                        keySelector={floodGroupKeySelector}
                        renderer={Group}
                        rendererParams={getFloodGroupRendererParams}
                    />
                )}
            </div>
        );
    }
}
