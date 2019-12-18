import React from 'react';

import { _cs } from '@togglecorp/fujs';
import ListView from '#rscv/List/ListView';

import { LayerWithGroup } from '#store/atom/page/types';
import ExpandableView from '#components/ExpandableView';

import LandslideGroup from './LandslideGroup';
import styles from './styles.scss';

interface GroupElement {
    id: number;
    title: string;
    description: string;
    layers: LayerWithGroup[];
}

interface Props {
    landslideGroups: GroupElement[];
    className: string;
}

interface State {
    isExpanded: boolean;
}

const rendererParams = (_: number, group: GroupElement) => {
    const { id, title, description, layers } = group;
    return ({ id, title, description, layers });
};

const groupKeySelector = (group: GroupElement) => group.id;

export default class Landslide extends React.PureComponent<Props, State> {
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
            landslideGroups,
            className,
        } = this.props;

        const {
            isExpanded,
        } = this.state;

        return (
            <ExpandableView
                className={_cs(className, styles.landslide)}
                headerContent="Landslide"
                expandableContent={(
                    <ListView
                        className={styles.landslideGroupList}
                        data={landslideGroups}
                        keySelector={groupKeySelector}
                        renderer={LandslideGroup}
                        rendererParams={rendererParams}
                    />
                )}
            />
        );
    }
}
