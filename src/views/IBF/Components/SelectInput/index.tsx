/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import IbfDownArrow from '#resources/icons/IbfDownArrow.svg';
import style from './style.scss';
import { optionArray } from '../HouseForm/utils';

interface Props {
    label: string;
    name: string;
    value: string;
    options: string[];
    placeholder: string;
    onChangeHandler: (eventValue: EventType) => void;
}

interface EventType {
    target: {
        name: string;
        value: any;
    };
}

const SelectInput = (
    {
        label,
        name,
        value,
        options,
        placeholder,
        onChangeHandler,
    }: Props,
) => {
    const [optionValue, setOptionValue] = useState('');
    const [openOption, setOpenOption] = useState(false);

    const dropDownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!(optionValue === '')) {
            const eventValue: EventType = {
                target: {
                    name,
                    value: optionValue,
                },
            };
            onChangeHandler(eventValue);
        }
    }, [optionValue]);


    useEffect(() => {
        const handleClickOutside = (event): void => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setOpenOption(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className={style.selectContainer}>
            <h3>{label}</h3>
            <div ref={dropDownRef} className={style.selectSubContainer}>
                <button
                    className={style.select}
                    type="button"
                    onClick={() => setOpenOption(prevOpenOptionValue => !prevOpenOptionValue)}
                >
                    <span>
                        {value || placeholder}
                    </span>
                    <img src={IbfDownArrow} alt="Down Arrow" />
                </button>
                {openOption && (
                    <ul>
                        {
                            options.length > 0 && options.map(option => (
                                <button
                                    className={style.optionButton}
                                    type="button"
                                    onClick={() => {
                                        setOptionValue(option);
                                        setOpenOption(false);
                                    }}
                                >
                                    <li className={style.option}>{option}</li>
                                </button>
                            ))
                        }
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SelectInput;
