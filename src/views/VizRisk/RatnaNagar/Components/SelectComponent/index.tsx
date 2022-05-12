import React from 'react';
import styles from './styles.scss';

const SelectComponent = () => {
    const selectOptions = ['Family Size', 'Family Planning'];
    return (
        <div className={styles.selectComponent}>
            <select className={styles.mainSelect} name="" id="">
                {
                    selectOptions.map(item => (
                        <>
                            <option
                                className={styles.mainOptions}
                                key={item}
                                value={item}
                            >
                                {item}

                            </option>
                        </>
                    ))
                }
            </select>
        </div>
    );
};
export default SelectComponent;
