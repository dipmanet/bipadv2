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
    handleOpacityChange: (opacity: OpacityElement) => void;
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
            handleOpacityChange,
        } = this.props;

        const selected = value.indexOf(key) >= 0;
        const layer = options.find(l => keySelector(l) === key);

        return {
            id: keySelector(itemData),
            label: labelSelector(itemData),
            tooltip: tooltipSelector(itemData),
            value: selected,
            onChange: (val: boolean) => this.handleItemChange(key, val),
            checkboxType: 'check',
            disabled,
            readOnly,
            handleOpacityChange,
            layer,
        };
    }

    public render() {
        const {
            options,
            keySelector,
        } = this.props;

        return (
            <div className={styles.item}>
                <ListView
                    data={options}
                    renderer={LandslideItem}
                    keySelector={keySelector}
                    rendererParams={this.rendererParams}
                />
            </div>
        );
    }
}
