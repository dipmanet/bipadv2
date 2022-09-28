/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import styles from './styles.scss';

const FilterRadio = (props) => {
    const { regionRadio, setRegionRadio } = props;
    const filter = [
        { id: 1, name: 'province' },
        { id: 2, name: 'district' },
        { id: 3, name: 'municipality' },
    ];
    return (
        <div className={styles.container}>
            {filter.map(item => (
                <div key={item.id} className={styles.wrapper}>
                    <input
                        className={styles.radioInput}
                        type="radio"
                        value={item.name}
                        onChange={e => setRegionRadio(e.target.value, item.id)}
                        checked={regionRadio.name && regionRadio.name === item.name}
                    />
                    <label className={styles.radioItems}>
                        {item.name}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default FilterRadio;
