import React from 'react';

import { _cs } from '@togglecorp/fujs';
import ListView from '#rscv/List/ListView';

import { LayerWithGroup } from '#store/atom/page/types';
import ExpandableView from '#components/ExpandableView';

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

        return (
            <ExpandableView
                className={_cs(className, styles.flood)}
                headerContentClassName={styles.title}
                headerContent="Flood"
                expandableContent={(
                    <ListView
                        className={styles.floodGroupList}
                        data={floodGroups}
                        keySelector={floodGroupKeySelector}
                        renderer={Group}
                        rendererParams={getFloodGroupRendererParams}
                    />
                )}
            />
        );
    }
}
