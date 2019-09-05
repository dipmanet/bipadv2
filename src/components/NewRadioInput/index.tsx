import React from 'react';
import { _cs, randomString } from '@togglecorp/fujs';

import Label from '#rsci/Label';
import ListView from '#rsu/../v2/View/ListView';
import { OptionKey } from '#rsu/../v2/types';
import RadioOption from './RadioOption';

import styles from './styles.scss';

interface Props<T, K extends OptionKey> {
    className?: string;
    options: T[];
    label?: string;
    value?: K;
    onChange?: (newValue: K) => void;
    hideLabel: boolean;
    error?: string;
    disabled: boolean;
    readOnly: boolean;
    optionKeySelector: (data: T) => K;
    optionLabelSelector: (data: T) => string;
}

interface State {
}


// eslint-disable-next-line max-len
class NewRadioInput<T, K extends OptionKey = string> extends React.PureComponent<Props<T, K>, State> {
    private static defaultProps = {
        disabled: false,
        readOnly: false,
        hideLabel: false,
    };

    private inputName: string = randomString();

    private handleOptionClick = (optionKey: K) => {
        const {
            onChange,
        } = this.props;

        if (onChange) {
            onChange(optionKey);
        }
    }

    private getRendererParams = (_: K, data: T) => {
        const {
            optionKeySelector,
            optionLabelSelector,
            value,
            disabled,
            readOnly,
        } = this.props;

        const optionKey = optionKeySelector(data);

        return {
            inputName: this.inputName,
            optionKey,
            label: optionLabelSelector(data),
            onClick: this.handleOptionClick,
            disabled,
            readOnly,
            checked: optionKey === value,
        };
    }

    public render() {
        const {
            options,
            className,
            label,
            hideLabel,
            error,
            disabled,
            optionKeySelector,
        } = this.props;

        return (
            <div className={_cs(styles.newRadioInput, className)}>
                <Label
                    show={!hideLabel}
                    text={label}
                    error={error}
                    disabled={disabled}
                />
                <ListView
                    className={styles.optionList}
                    data={options}
                    renderer={RadioOption}
                    rendererParams={this.getRendererParams}
                    keySelector={optionKeySelector}
                />
            </div>
        );
    }
}

export default NewRadioInput;
