import React from 'react';
import Button from '#rsca/Button';
import RadioInput from '#rsci/RadioInput';
import Icon from '#rscg/Icon';

import { LayerWithGroup } from '#store/atom/page/types';

interface Props {
    id: number;
    title: string;
    description: string;
    layers: LayerWithGroup[];
}

interface State {
    isExpanded: boolean;
}

export default class FloodGroup extends React.PureComponent<Props, State> {
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
            title,
            description,
            layers,
        } = this.props;
        const {
            isExpanded,
        } = this.state;

        return (
            <div>
                <div>{title}</div>
                <Button
                    transparent
                    onClick={this.handleExpandButtonClick}
                >
                    <Icon
                        name={isExpanded ? 'chevronUp' : 'chevronDown'}
                    />
                </Button>
                { isExpanded && (
                    <div>
                        <div>{description}</div>
                        <RadioInput
                            options={layers}
                            labelSelector={(d: LayerWithGroup) => d.title}
                            keySelector={(d: LayerWithGroup) => d.id}
                        />
                    </div>
                )}
            </div>
        );
    }
}
