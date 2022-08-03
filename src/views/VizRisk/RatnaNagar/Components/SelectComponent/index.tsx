import React, { useContext } from 'react';
import { MainPageDataContext } from '../../context';
import styles from './styles.scss';

const SelectComponent = (props) => {
    const { selectFieldValues, selctFieldCurrentValue, setSelctFieldCurrentValue } = props;
    const {
        setSelectFieldValue,
    } = useContext(MainPageDataContext);
    return (
        <div className={styles.selectComponent}>
            <select
                className={styles.mainSelect}
                value={selctFieldCurrentValue}
                onChange={(e) => {
                    setSelctFieldCurrentValue(e.target.value);
                    setSelectFieldValue(e.target.value);
                }}
            >
                <option value="Select" defaultValue={'Select'} disabled>Select</option>
                {
                    selectFieldValues.sort().map(item => (
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
