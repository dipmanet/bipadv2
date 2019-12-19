import React from 'react';
import Slider from 'react-input-slider';
import Switch from 'react-input-switch';

import { _cs } from '@togglecorp/fujs';

import { LayerWithGroup } from '#store/atom/page/types';
import { OpacityElement } from '#types';
import MapLayerLegend from '#components/MapLayerLegend';
import RiskDescription from '#components/RiskDescription';
import OpacityInput from '#components/OpacityInput';
import { getRasterLegendURL } from '#utils/domain';

import styles from './styles.scss';

interface Props {
    layerKey: number;
    label: string;
    tooltip: string;
    value: boolean;
    disabled: boolean;
    readOnly: boolean;
    checkboxType: string;
    onChange: (key: number, val: boolean) => void;
    onOpacityChange: (key: OpacityElement['key'], value: OpacityElement['value']) => void;
    layer: LayerWithGroup | undefined;
    className?: string;
}

export default class LandslideItem extends React.PureComponent<Props> {
    private handleSwitchChange = (switchValue: boolean) => {
        const {
            layerKey,
            onChange,
        } = this.props;

        onChange(layerKey, switchValue);
    }

    public render() {
        const {
            label,
            tooltip,
            value,
            disabled,
            layerKey,
            layer,
            className,
            onOpacityChange,
        } = this.props;


        return (
            <div className={_cs(styles.landslideItem, className, value && styles.active)}>
                <header className={styles.header}>
                    <Switch
                        className={styles.switch}
                        value={value}
                        onChange={this.handleSwitchChange}
                        on
                        off={false}
                    />
                    <div className={styles.label}>
                        { label }
                    </div>
                </header>
                {(value && !disabled && layer) && (
                    <div className={styles.content}>
                        <RiskDescription text={layer.description} />
                        <OpacityInput
                            onChange={onOpacityChange}
                            inputKey={layerKey}
                        />
                        <MapLayerLegend
                            legendSrc={getRasterLegendURL(layer)}
                            layerTitle={layer.title}
                        />
                    </div>
                )}
            </div>
        );
    }
}
