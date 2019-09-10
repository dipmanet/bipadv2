import React, { useMemo, useCallback } from 'react';
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
    disabled: boolean;
    inputName: string;
    label: string;
    onClick?: (key: K) => void;
    optionKey: K;
    readOnly: boolean;
}

function RadioOption<K extends OptionKey>(props: Props<K>) {
    const {
        checked,
        className: classNameFromProps,
        disabled,
        inputName,
        label,
        onClick,
        optionKey,
        readOnly,
    } = props;

    const inputId = useMemo(
        () => randomString(),
        [],
    );

    const handleClick = useCallback(
        () => {
            if (onClick) {
                onClick(optionKey);
            }
        },
        [onClick, optionKey],
    );

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
            htmlFor={inputId}
            className={className}
        >
            <input
                className={_cs(styles.input, 'input')}
                defaultChecked={checked}
                id={inputId}
                type="radio"
                disabled={disabled || readOnly}
                onClick={handleClick}
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

export default RadioOption;
