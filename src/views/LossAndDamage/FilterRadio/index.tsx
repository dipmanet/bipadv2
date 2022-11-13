/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import styles from './styles.scss';

interface FilterRadioProps {
    regionRadio: {
        name: string;
        id: number;
    };
    setRegionRadio: (value: string, id: number) => void;
    regionFilter: {
        adminLevel: number;
        geoarea: number;
    };
}

const FilterRadio = (props: FilterRadioProps) => {
    const { regionRadio, setRegionRadio, regionFilter } = props;

    useEffect(() => {
        if (Object.keys(regionFilter).length > 1) {
            switch (regionFilter.adminLevel) {
                case 1:
                    setRegionRadio('district', 2);
                    break;
                case 2:
                    setRegionRadio('municipality', 3);
                    break;
                case 3:
                    setRegionRadio('ward', 4);
                    break;
                default: setRegionRadio('province', 1);
            }
        }
    }, [regionFilter]);

    const filter = [
        { id: 1, name: 'province' },
        { id: 2, name: 'district' },
        { id: 3, name: 'municipality' },
        { id: 4, name: 'ward' },
    ];
    return (
        <div className={styles.container}>
            {filter.map(item => (
                <div key={item.id} className={styles.wrapper}>
                    <input
                        className={item.id === 4 ? styles.visibilty : styles.radioInput}
                        type="radio"
                        value={item.name}
                        onChange={e => setRegionRadio(e.target.value, item.id)}
                        checked={regionRadio.name === item.name}
                    />
                    <label className={item.id === 4 ? styles.visibilty : styles.radioItems}>
                        {item.name}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default FilterRadio;
