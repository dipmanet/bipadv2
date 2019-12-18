import React from 'react';

import { _cs } from '@togglecorp/fujs';
import ListView from '#rscv/List/ListView';
import Button from '#rsca/Button';
import Icon from '#rscg/Icon';


import { LayerWithGroup } from '#store/atom/page/types';
import ExpandableView from '#components/ExpandableView';

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
    public render() {
        const {
            earthquakeGroups,
            className,
        } = this.props;

        return (
            <ExpandableView
                className={_cs(className, styles.earthquake)}
                headerContent="Earthquake"
                expandableContent={(
                    <ListView
                        className={styles.earthquakeGroup}
                        data={earthquakeGroups}
                        keySelector={groupKeySelector}
                        renderer={Group}
                        rendererParams={rendererParams}
                    />
                )}
            />
        );
    }
}
