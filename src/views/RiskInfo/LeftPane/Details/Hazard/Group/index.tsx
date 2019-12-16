import React from 'react';
import Button from '#rsca/Button';
import RadioInput from '#rsci/RadioInput';
import Icon from '#rscg/Icon';

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
    selectedLayer: number | undefined;
}

const labelSelector = (d: LayerWithGroup) => d.title;
const keySelector = (d: LayerWithGroup) => d.id;

export default class Group extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            isExpanded: false,
            selectedLayer: undefined,
        };
    }

    private handleExpandButtonClick = () => {
        this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));
    }

    private onChange = (layerId: number) => {
        this.setState({ selectedLayer: layerId });
    }

    public render() {
        const {
            title,
            description,
            layers,
            className,
        } = this.props;
        const {
            isExpanded,
            selectedLayer,
        } = this.state;

        return (
            <div className={styles.group}>

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
                { isExpanded && (
                    <div
                        className={styles.bottom}
                    >
                        <div className={styles.description}>
                            {description}
                        </div>
                        <RadioInput
                            className={styles.layers}
                            options={layers}
                            labelSelector={labelSelector}
                            keySelector={keySelector}
                            onChange={this.onChange}
                            value={selectedLayer}
                        />
                    </div>
                )}
            </div>
        );
    }
}
