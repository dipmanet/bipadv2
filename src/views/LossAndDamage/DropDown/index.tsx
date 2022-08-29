/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from 'react';
import Icon from '#rscg/Icon';
import styles from './styles.scss';
import { lossMetrics } from '#utils/domain';
import DataCount from '../DataCount';

const Dropdown = (props) => {
    const [showOption, setShowOption] = useState(false);
    const optionShowRef = useRef(null);
    const { data, setVAlueOnClick, setSelectOption, selectOption } = props;
    // eslint-disable-next-line no-unused-expressions
    useEffect(() => {
        if (selectOption.name === '' || selectOption.key === '') {
            setSelectOption(lossMetrics[0].label, lossMetrics[0].key);
        }
    }, []);

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

    const onOptionClick = (key: string, name: string, index: number) => {
        setSelectOption(name, key);
        setShowOption(false);
        setVAlueOnClick({ value: key, index });
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
                                    selectOption.name
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
                            {lossMetrics.map((item, index) => (
                                <div
                                    className={styles.optionField}
                                    onClick={() => onOptionClick(item.key, item.label, index)}
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
            <DataCount data={data} value={selectOption} />
        </>

    );
};

export default Dropdown;
