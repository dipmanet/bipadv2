import React, { useState } from 'react';
import { FaramInputElement } from '@togglecorp/faram';
import Checkbox from '#rsci/Checkbox';

import styles from './styles.scss';

interface Props {}

interface Options {
    label: string;
    tooltip: string;
    selected: boolean;
}
const initialOptions: Options[] = [
    { label: '4 - 4.9 ML', tooltip: '4 - 4.9 ML', selected: false },
    { label: '5 - 5.9 ML', tooltip: '5 - 5.9 ML', selected: false },
    { label: '6 - 6.9 ML', tooltip: '6 - 6.9 ML', selected: false },
    { label: '7 - 7.9 ML', tooltip: '7 - 7.9 ML', selected: false },
    { label: '8 ML and above', tooltip: '8 ML and above', selected: false },
];
const MagnitudeSelector = (props: Props) => {
    const [options, setOptions] = useState<Options[]>(initialOptions);
    const onChange = (index: number, checked: boolean) => {
        const temp = [...options];
        temp[index].selected = checked;
        setOptions(temp);
        console.log('checked: ', checked);
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
