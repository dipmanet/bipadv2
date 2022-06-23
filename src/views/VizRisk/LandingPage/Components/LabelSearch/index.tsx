import React, { useState } from 'react';
import Return from '#resources/icons/Return.svg';
import { vzRiskMunicipalData, vzRiskProvinceData } from '../../VzRiskData';
import searchVizRisk from '../../../../../resources/icons/SearchVizRisk.svg';
import styles from './styles.scss';

const placeholder = 'Search by Province, Municipality';

const LabelSearch = (props) => {
    const { setSearchBbox } = props;
    const availableData = [...vzRiskProvinceData, ...vzRiskMunicipalData];
    const [inputValue, setInputValue] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const handleChange = (e: any) => {
        setInputValue(e.target.value);
        const val = e.target.value;
        const filterDataOnChange = availableData.filter(data => data.name.toLowerCase()
            .includes(val.toLowerCase())
            || data.visriskType.toLowerCase().includes(val.toLowerCase()));

        setFilteredData(filterDataOnChange);
    };

    console.log('filteredData', inputValue);


    return (
        <div className={styles.inputContainer}>
            <div>
                <input
                    type="search"
                    className={styles.textInput}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={e => handleChange(e)}
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
                                filteredData.map(data => (
                                    <button
                                        key={data.id}
                                        className={styles.nameBtn}
                                        type="submit"
                                        onClick={() => setSearchBbox(data.bbox)}
                                    >
                                        <p className={styles.vizriskNames}>
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
                onClick={() => setSearchBbox([[79.161987, 25.923467], [89.626465, 30.789037]])}
            >
                Reset map
            </button>

        </div>
    );
};

export default LabelSearch;
