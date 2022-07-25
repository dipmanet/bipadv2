/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from 'react';
import Icon from '#rscg/Icon';
import styles from './styles.scss';


const Dropdown = (props) => {
    const [optionValue, setOptionValue] = useState('');
    const [showOption, setShowOption] = useState(false);
    const optionShowRef = useRef(null);

    const { data } = props;

    // eslint-disable-next-line no-unused-expressions
    const filteredData = Object.values(data).map(item => ({
        title: item.title,
    }));

    console.log(filteredData, 'data');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionShowRef.current && !optionShowRef.current.contains(event.target)) {
                setShowOption(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        // Bind the event listener
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSelectClick = () => {
        setShowOption(state => !state);
    };

    const onOptionClick = (value) => {
        setOptionValue(value);
        setShowOption(false);
    };

    return (

        <div
            className={styles.selectContainer}
            ref={optionShowRef}
        >
            <div className={styles.mainDiv}>
                <div className={styles.selectDiv}>
                    <Icon
                        className={styles.icon}
                        name="warning"
                    />
                    <div
                        className={styles.selectField}
                        onClick={onSelectClick}
                    >
                        <p className={styles.selectItem}>{optionValue}</p>
                        <div className={styles.selectIcon} />
                    </div>
                </div>
            </div>
            {
                showOption && (
                    <div
                        className={styles.optionDiv}
                    >
                        {filteredData && filteredData.map(item => (
                            <div
                                className={styles.optionField}
                                onClick={() => onOptionClick(item.title)}
                            >
                                <Icon
                                    className={styles.icon}
                                    name="warning"
                                />
                                <p className={styles.optionName}>{item.title}</p>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>

    );
};

export default Dropdown;
