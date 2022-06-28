import React from 'react';
import styles from './styles.scss';

interface Props {
    selectFieldValue: any[];
    selctFieldCurrentValue: string;
    setSelctFieldCurrentValue: React.Dispatch<React.SetStateAction<string>>;
}

const SelectComponent = (props: Props) => {
    const { selectFieldValue, selctFieldCurrentValue, setSelctFieldCurrentValue } = props;

    return (
        <div className={styles.theme}>
            <select
                className={styles.mainSelect}
                value={selctFieldCurrentValue}
                defaultValue={'Select By Themes'}
                onChange={e => setSelctFieldCurrentValue(e.target.value)}
            >
                {
                    selectFieldValue.map(item => (
                        <option
                            className={styles.mainOptions}
                            key={`select-${item}`}
                            value={item}
                        >
                            {item}

                        </option>
                    ))
                }
            </select>
        </div>
    );
};
export default SelectComponent;
