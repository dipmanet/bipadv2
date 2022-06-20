import React from 'react';
import styles from './styles.scss';

const SelectComponent = (props) => {
    const { selectFieldValues, selctFieldCurrentValue, setSelctFieldCurrentValue } = props;

    return (
        <div className={styles.theme}>
            <select
                className={styles.mainSelect}
                value={selctFieldCurrentValue}
                onChange={e => setSelctFieldCurrentValue(e.target.value)}
            >
                {
                    selectFieldValues.map(item => (
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
