import React from 'react';
import { _cs } from '@togglecorp/fujs';
import ListView from '#rscv/List/ListView';
import { LayerWithGroup } from '#store/atom/page/types';
import { OpacityElement } from '#types';

import LandslideItem from './LandslideItem';

import styles from './styles.scss';

interface Props {
    keySelector: (layer: LayerWithGroup) => number;
    labelSelector: (layer: LayerWithGroup) => string;
    tooltipSelector: (layer: LayerWithGroup) => string;
    disabled?: boolean;
    readOnly?: boolean;
    className: string;
    options: LayerWithGroup[];
    value: number[];
    onChange: (layers: number[]) => void;
    onOpacityChange: (opacity: OpacityElement) => void;
}

interface State {}

export default class LandslideSelection extends React.PureComponent<Props, State> {
    private handleItemChange = (key: number, isSelected: boolean) => {
        const { value, onChange } = this.props;

        const newValue = [...value];

        if (!isSelected) {
            const index = newValue.indexOf(key);
            newValue.splice(index, 1);
        } else {
            newValue.push(key);
        }

        onChange(newValue);
    }

    private rendererParams = (key: number, itemData: LayerWithGroup) => {
        const {
            keySelector,
            labelSelector,
            tooltipSelector,
            value,
            disabled,
            readOnly,
            options,
            onOpacityChange,
        } = this.props;

        const selected = value.indexOf(key) >= 0;
        const layer = options.find(l => keySelector(l) === key);

        return {
            layerKey: keySelector(itemData),
            label: labelSelector(itemData),
            tooltip: tooltipSelector(itemData),
            value: selected,
            onChange: this.handleItemChange,
            checkboxType: 'check',
            disabled,
            readOnly,
            onOpacityChange,
            layer,
        };
    }

    public render() {
        const {
            options,
            keySelector,
            className,
        } = this.props;

        return (
            <ListView
                className={_cs(className, styles.landslideSelection)}
                data={options}
                renderer={LandslideItem}
                keySelector={keySelector}
                rendererParams={this.rendererParams}
            />
        );
    }
}
