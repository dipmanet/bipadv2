import React from 'react';
import styles from './styles.scss';

const placeholder = 'Search by Province, Municipality, Hazard';

const LabelSearch = () => (
    <div className={styles.inputContainer}>
        <input type="text" className={styles.textInput} placeholder={placeholder} />
        <img className={styles.search} src="/src/resources/icons/Search.svg" alt="Search" />
    </div>
);

export default LabelSearch;
