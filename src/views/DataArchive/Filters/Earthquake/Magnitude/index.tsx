import React, { useState } from 'react';
import { FaramInputElement } from '@togglecorp/faram';
import Checkbox from '#rsci/Checkbox';

import styles from './styles.scss';

interface Props {
    onChange: Function;
}

interface Options {
    range: string;
    label: string;
    tooltip: string;
    selected: boolean;
}
const initialOptions: Options[] = [
    { range: '4', label: '4 - 4.9 ML', tooltip: '4 - 4.9 ML', selected: false },
    { range: '5', label: '5 - 5.9 ML', tooltip: '5 - 5.9 ML', selected: false },
    { range: '6', label: '6 - 6.9 ML', tooltip: '6 - 6.9 ML', selected: false },
    { range: '7', label: '7 - 7.9 ML', tooltip: '7 - 7.9 ML', selected: false },
    { range: '8', label: '8 ML and above', tooltip: '8 ML and above', selected: false },
];

const extractTrues = (items: Options[]) => {
    const trueValues: string[] = [];
    items.forEach((item) => {
        const { range, selected } = item;
        if (selected) {
            trueValues.push(range);
        }
    });
    return trueValues;
};

const MagnitudeSelector = (props: Props) => {
    const { onChange: onChangeFromProps } = props;
    const [options, setOptions] = useState<Options[]>(initialOptions);
    const onChange = (index: number, checked: boolean) => {
        const temp = [...options];
        temp[index].selected = checked;
        setOptions(temp);
        onChangeFromProps(extractTrues(temp));
    };
    return (
        <div className={styles.magnitudeSelector}>
            <div className={styles.selection}>
                { options.map((option, index) => {
                    const { label, tooltip, selected } = option;
                    return (
                        <Checkbox
                            key={label}
                            label={label}
                            tooltip={tooltip}
                            onChange={(checked: boolean) => onChange(index, checked)}
                            value={selected}
                        />
                    );
                }) }
            </div>
        </div>
    );
};

export default FaramInputElement(MagnitudeSelector);
