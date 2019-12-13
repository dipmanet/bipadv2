import React from 'react';

import ListView from '#rscv/List/ListView';
import Button from '#rsca/Button';
import Icon from '#rscg/Icon';


import { LayerWithGroup } from '#store/atom/page/types';

import Group from '../Group';

interface GroupElement {
    id: number;
    title: string;
    description: string;
    layers: LayerWithGroup[];
}
interface Props {
    earthquakeGroups: GroupElement[];
}

interface State {
    isExpanded: boolean;
}

const rendererParams = (_: number, group: GroupElement) => {
    const { id, title, description, layers } = group;
    return ({ id, title, description, layers });
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
        } = this.props;

        const {
            isExpanded,
        } = this.state;

        return (
            <div>
                <Button
                    transparent
                    onClick={this.handleExpandButtonClick}
                >
                    Earthquake
                    <Icon
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
