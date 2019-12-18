import React from 'react';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';
import Option from './Option';

import styles from './styles.scss';

interface Props<Item, Key> {
    className?: string;
    title?: React.ReactNode;
    options: Item[];
    contentClassName?: string;
    keySelector: (item: Item) => Key;
    labelSelector: (item: Item) => string;
    value: Key | undefined;
    onChange: (key: Key) => void;
}

// eslint-disable-next-line max-len
class RadioInput<Item = object, Key = string | number> extends React.PureComponent<Props<Item, Key>> {
    private getOptionRendererParams = (key: Key, option: Item) => {
        const {
            value,
            labelSelector,
        } = this.props;

        return ({
            optionKey: key,
            label: labelSelector(option),
            onClick: this.handleOptionClick,
            isActive: key === value,
        });
    }

    private handleOptionClick = (optionKey: Key) => {
        const {
            onChange,
            value,
        } = this.props;

        if (value !== optionKey) {
            onChange(optionKey);
        }
    }

    public render() {
        const {
            className,
            contentClassName,
            options,
            keySelector,
            title,
        } = this.props;

        return (
            <div className={_cs(styles.radioInput, className)}>
                { title }
                <ListView
                    className={contentClassName}
                    data={options}
                    keySelector={keySelector}
                    renderer={Option}
                    rendererParams={this.getOptionRendererParams}
                />
            </div>
        );
    }
}

export default RadioInput;
