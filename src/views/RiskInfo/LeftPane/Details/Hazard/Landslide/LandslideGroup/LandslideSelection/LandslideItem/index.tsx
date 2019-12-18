import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Checkbox from '#rsci/Checkbox';
import TextInput from '#rsci/TextInput';
import { LayerWithGroup } from '#store/atom/page/types';
import { OpacityElement } from '#types';

interface Props {
    id: number;
    label: string;
    tooltip: string;
    value: boolean;
    disabled: boolean;
    readOnly: boolean;
    checkboxType: string;
    onChange: (val: boolean) => void;
    handleOpacityChange: (opacity: OpacityElement) => void;
    layer: LayerWithGroup | undefined;
}

interface State {
}

export default class LandslideItem extends React.PureComponent<Props, State> {
    private handleOpacityInput = (value: number) => {
        const { id, handleOpacityChange } = this.props;

        handleOpacityChange({
            key: id,
            value: +value,
        });
    }

    public render() {
        const {
            label,
            tooltip,
            value,
            disabled,
            readOnly,
            checkboxType,
            onChange,
            layer,
        } = this.props;


        return (
            <div>
                <Checkbox
                    label={label}
                    tooltip={tooltip}
                    value={value}
                    disabled={disabled}
                    readOnly={readOnly}
                    checkboxType={checkboxType}
                    onChange={onChange}
                />
                <div>
                    {(value && !disabled && layer) && (
                        <div>
                            <div>
                                {layer.description}
                            </div>
                            <TextInput
                                type="number"
                                min="0.1"
                                max="1"
                                onChange={this.handleOpacityInput}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
