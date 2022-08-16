import React from 'react';
import styles from './styles.scss';

interface Props {
    optionValues: string[];
    optionTitle?: string;
    onOptionClick: (item: string) => void;

}
const SelectOptions = (props: Props) => {
    const { optionTitle, optionValues, onOptionClick } = props;
    return (
        <div
            className={styles.optionDiv}
        >
            {
                !!optionTitle
                && (
                    <h3 style={{
                        margin: '10px 5px',
                        color: 'white',
                        fontSize: 16,
                        textDecoration: 'underline',
                    }}
                    >
                        {optionTitle}
                    </h3>
                )
            }
            {optionValues.map(item => (
                <button
                    type="submit"
                    className={styles.optionField}
                    onClick={() => onOptionClick(item)}
                    key={item}
                >
                    <p className={styles.optionName}>{item}</p>
                </button>
            ))}
        </div>
    );
};

export default SelectOptions;
