/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from 'react';
import Icon from '#rscg/Icon';
import styles from './styles.scss';
import { lossMetrics } from '#utils/domain';
import DataCount from '../DataCount';

const Dropdown = (data) => {
    const [optionValue, setOptionValue] = useState({ name: '', key: '' });
    const [showOption, setShowOption] = useState(false);
    const optionShowRef = useRef(null);
    // eslint-disable-next-line no-unused-expressions
    useEffect(() => {
        if (optionValue.name === '' || optionValue.key === '') {
            setOptionValue({ name: lossMetrics[0].label, key: lossMetrics[0].key });
        }
    }, [optionValue]);

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

    const onOptionClick = (key: string, name: string) => {
        setOptionValue({ name, key });
        setShowOption(false);
    };

    return (
        <>

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
                            <p className={styles.selectItem}>
                                {
                                    optionValue.name
                                }

                            </p>
                            <div className={styles.selectIcon} />
                        </div>
                    </div>
                </div>
                {
                    showOption && (
                        <div
                            className={styles.optionDiv}
                        >
                            {lossMetrics.map(item => (
                                <div
                                    className={styles.optionField}
                                    onClick={() => onOptionClick(item.key, item.label)}
                                    key={item.key}
                                >
                                    <Icon
                                        className={styles.icon}
                                        name="warning"
                                    />
                                    <p className={styles.optionName}>{item.label}</p>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div>
            <DataCount data={data} value={optionValue} />
        </>

    );
};

export default Dropdown;
