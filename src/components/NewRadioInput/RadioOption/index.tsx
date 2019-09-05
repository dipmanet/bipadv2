import React from 'react';
import {
    _cs,
    randomString,
} from '@togglecorp/fujs';

import Icon from '#rscg/Icon';

import { OptionKey } from '#rsu/../v2/types';

import styles from './styles.scss';

interface Props<K extends OptionKey> {
    checked: boolean;
    className?: string;
    label: string;
    disabled: boolean;
    readOnly: boolean;
    optionKey: K;
    onClick: (optionKey: K) => void;
    inputName: string;
}

// eslint-disable-next-line max-len
export default class RadioOption<K extends OptionKey> extends React.PureComponent<Props<K>> {
    private inputId: string = randomString();

    private handleClick = () => {
        const {
            optionKey,
            onClick,
        } = this.props;

        onClick(optionKey);
    }

    public render() {
        const {
            className: classNameFromProps,
            checked,
            label,
            disabled,
            readOnly,
            inputName,
        } = this.props;

        const className = _cs(
            styles.radioOption,
            'radio-option',
            classNameFromProps,
            disabled && styles.disabled,
            readOnly && styles.readOnly,
            checked && styles.checked,
            checked && 'radio-option-checked',
        );

        return (
            <label
                htmlFor={this.inputId}
                className={className}
            >
                <input
                    className={_cs(styles.input, 'input')}
                    defaultChecked={checked}
                    id={this.inputId}
                    type="radio"
                    disabled={disabled || readOnly}
                    onClick={this.handleClick}
                    name={inputName}
                />
                <Icon
                    className={styles.icon}
                    name={checked ? 'radioOn' : 'radioOff'}
                />
                <div className={_cs(styles.label, 'label')}>
                    { label }
                </div>
            </label>
        );
    }
}
