/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import Icon from '#rscg/Icon';
import styles from './styles.scss';
import { DropDownOption, DropDownProps } from './types';


const Dropdown = (props: DropDownProps) => {
    const [showOption, setShowOption] = useState(false);
    const optionShowRef = useRef<HTMLDivElement | null>(null);
    const { dropDownClickHandler,
        setSelectOption,
        icon,
        dropdownOption,
        selectOption,
        placeholder,
        label,
        className,
        elementName,
        deleteicon,
        clearValues } = props;

    const [selectName, setSelectName] = useState(dropdownOption[0].label);
    // eslint-disable-next-line max-len
    const [dropDownPlaceHolder, setdropDownPlaceHolder] = useState<string | undefined | null>(placeholder);
    // eslint-disable-next-line no-unused-expressions
    useEffect(() => {
        if (selectOption && setSelectOption) {
            setSelectOption(dropdownOption[0].label, dropdownOption[0].key);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const onOptionClick = (item: DropDownOption, index: number) => {
        dropDownClickHandler(item, index, elementName);
        if (dropDownPlaceHolder) {
            setdropDownPlaceHolder(null);
        }
        setSelectName(item.label);
        setShowOption(false);
    };

    const clearButtonHandler = () => {
        clearValues(elementName);
        setdropDownPlaceHolder(placeholder);
        setSelectName('');
    };

    return (
        <>
            <div
                className={className
                    ? _cs(styles.selectContainer, className)
                    : styles.selectContainer}
                ref={optionShowRef}
            >
                {label
                    && <p className={styles.labelText} style={!icon ? { width: '98%' } : {}}>{label}</p>
                }
                <div className={styles.mainDiv} style={!icon ? { width: '98%' } : {}}>
                    <div
                        className={styles.selectDiv}
                        style={dropDownPlaceHolder
                            ? { opacity: 0.5 }
                            : {}
                        }
                    >
                        {icon
                            && (
                                <Icon
                                    className={styles.icon}
                                    name="warning"
                                />
                            )}
                        <div
                            className={styles.selectField}
                        >
                            <p className={styles.selectItem}>
                                {
                                    dropDownPlaceHolder || selectName
                                }

                            </p>
                            {
                                deleteicon
                                && (

                                    <span
                                        className={styles.crossIcon}
                                        onClick={clearButtonHandler}
                                    >
                                        <Icon
                                            name="times"
                                        />
                                    </span>
                                )
                            }

                            <div
                                className={styles.selectIcon}
                                onClick={onSelectClick}
                            />
                        </div>
                    </div>
                </div>
                {
                    showOption && (
                        <div
                            className={styles.optionDiv}
                        >
                            {dropdownOption.map((item, index) => (
                                <div
                                    className={styles.optionField}
                                    onClick={() => onOptionClick(item, index)}
                                    key={item.label}
                                >
                                    {
                                        icon
                                        && (
                                            <Icon
                                                className={styles.icon}
                                                name="warning"
                                            />
                                        )
                                    }
                                    <p className={styles.optionName}>{item.label}</p>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div>
        </>

    );
};

export default Dropdown;
