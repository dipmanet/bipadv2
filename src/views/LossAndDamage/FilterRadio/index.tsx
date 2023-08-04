/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
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
    language?: string;
}

const FilterRadio = (props: FilterRadioProps) => {
    const { regionRadio, setRegionRadio, regionFilter, language, federalLevel } = props;

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
        { id: 1, name: 'province', nameNe: 'प्रदेश' },
        { id: 2, name: 'district', nameNe: 'जिल्‍ला' },
        { id: 3, name: 'municipality', nameNe: 'नगरपालिका' },
        { id: 4, name: 'ward', nameNe: 'वार्ड' },
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
                        disabled={federalLevel === 3 && (item.id === 1 || item.id === 2 || item.id === 3) ? true
                            : federalLevel === 2 && (item.id === 1 || item.id === 2) ? true
                                : !!(federalLevel === 1 && (item.id === 1))}
                    />
                    <label className={item.id === 4 ? styles.visibilty : styles.radioItems}>
                        {language === 'en' ? item.name : item.nameNe}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default FilterRadio;
