import React, { useEffect, useState } from 'react';
import bbox from '@turf/bbox';
import { vzRiskMunicipalData, vzRiskProvinceData } from '../../VzRiskData';
import searchVizRisk from '../../../../../resources/icons/SearchVizRisk.svg';
import styles from './styles.scss';

const placeholder = 'Search by Province, Municipality';

const LabelSearch = (props) => {
    const [inputValue, setInputValue] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [cursor, setCursor] = useState(0);

    const { setSearchBbox, setSelctFieldCurrentValue, vzLabel, forDisable } = props;
    const availableData = vzLabel === 'municipality' ? [...vzRiskMunicipalData] : [...vzRiskProvinceData];

    const handleChange = (e: any) => {
        setInputValue(e.target.value);
        const val = e.target.value;
        const filterDataOnChange = availableData.filter(data => data.name.toLowerCase()
            .includes(val.toLowerCase())
            || data.visriskType.toLowerCase().includes(val.toLowerCase()));

        setFilteredData(filterDataOnChange);
        setCursor(0);
    };
    const handleKeyDown = (e) => {
        if (e.keyCode === 38 && cursor > 0) {
            setCursor(prevState => prevState - 1);
        } else if (e.keyCode === 40 && cursor < filteredData.length - 1) {
            setCursor(prevState => prevState + 1);
        } else if (e.keyCode === 13 && filteredData.length >= 1) {
            setSearchBbox(filteredData[cursor].bbox);
        }
    };

    useEffect(() => {
        setInputValue('');
    }, [vzLabel]);


    return (
        <div className={styles.inputContainer}>
            <div>
                <input
                    type="search"
                    className={styles.textInput}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={e => handleChange(e)}
                    onKeyDown={handleKeyDown}
                />
                <img
                    className={styles.search}
                    src={searchVizRisk}
                    alt="Search"
                />
                {filteredData.length > 0 && inputValue !== ''
                    && (
                        <div className={styles.searchData}>
                            {
                                filteredData.map((data, index) => (
                                    <button
                                        key={data.id}
                                        className={styles.nameBtn}
                                        type="submit"
                                        onClick={() => setSearchBbox(data.bbox)}
                                    >
                                        <p className={styles.vizriskNames} style={cursor === index ? { backgroundColor: '#00000060' } : { backgroundColor: 'transparent' }}>
                                            {data.name}
                                            -
                                            {data.visriskType}
                                        </p>
                                    </button>
                                ))
                            }
                        </div>
                    )}
            </div>
            <button
                className={styles.resetBtn}
                type="submit"
                onClick={() => {
                    setSelctFieldCurrentValue('');
                    setInputValue('');
                    setSearchBbox([[79.161987, 25.923467], [89.626465, 30.789037]]);
                    forDisable(false);
                }}
            >
                Reset map
            </button>

        </div>
    );
};

export default LabelSearch;
