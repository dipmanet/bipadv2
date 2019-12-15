import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Button from '#rsca/Button';
import ListSelection from '#rsci/ListSelection';
import Icon from '#rscg/Icon';
import Checkbox from '#rsci/Checkbox';

import { LayerWithGroup } from '#store/atom/page/types';

import styles from './styles.scss';

interface Props {
    id: number;
    title: string;
    description: string;
    layers: LayerWithGroup[];
    className: string;
}

interface State {
    isExpanded: boolean;
    isLayerVisible: boolean;
    selectedLayers: number[];
}

const labelSelector = (d: LayerWithGroup) => d.title;
const keySelector = (d: LayerWithGroup) => d.id;

export default class Group extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            isExpanded: false,
            selectedLayers: [],
            isLayerVisible: true,
        };
    }

    private handleLayerVisibility = (isLayerVisible: boolean) => {
        this.setState({ isLayerVisible });
    }

    private handleLayerSelection = (layers: number[]) => {
        this.setState({ selectedLayers: layers });
    }

    private handleExpandButtonClick = () => {
        this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));
    }

    public render() {
        const {
            title,
            description,
            layers,
            className,
        } = this.props;

        const {
            selectedLayers,
            isLayerVisible,
            isExpanded,
        } = this.state;

        return (
            <div className={_cs(className, styles.group)}>
                <div className={styles.heading}>
                    <Checkbox
                        value={isLayerVisible}
                        onChange={this.handleLayerVisibility}
                    />
                    <Button
                        className={styles.button}
                        transparent
                        onClick={this.handleExpandButtonClick}
                    >
                        <div
                            className={styles.title}
                        >
                            {title}
                        </div>
                        <Icon
                            className={styles.icon}
                            name={isExpanded ? 'chevronUp' : 'chevronDown'}
                        />
                    </Button>
                </div>
                { isExpanded && (
                    <div
                        className={styles.bottom}
                    >
                        <div className={styles.description}>
                            {description}
                        </div>
                        <ListSelection
                            className={styles.layers}
                            options={layers}
                            labelSelector={labelSelector}
                            keySelector={keySelector}
                            onChange={this.handleLayerSelection}
                            value={selectedLayers}
                        />
                    </div>
                )}
            </div>
        );
    }
}
