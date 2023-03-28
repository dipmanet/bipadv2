/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import { Translation } from 'react-i18next';
import Icon from '#rscg/Icon';
import HumanDeath from '#resources/icons/damage-and-loss/Human death.svg';
import EstimatedLoss from '#resources/icons/damage-and-loss/Estimated loss.svg';
import InfrastructureDestroyed from '#resources/icons/damage-and-loss/Infrastructure destroyed.svg';
import InjuredPerson from '#resources/icons/damage-and-loss/Injured person.svg';
import LiveStockDestroyed from '#resources/icons/damage-and-loss/Livestock destroyed.svg';
import MissingPerson from '#resources/icons/damage-and-loss/Missing person.svg';
import styles from './styles.scss';
import { DropDownOption, DropDownProps } from './types';
import { languageSelector } from '#selectors';

const Icons = [
    { id: 1, name: 'Incidents', icon: '' },
    { id: 2, name: 'People death', icon: HumanDeath },
    { id: 3, name: 'Estimated loss (NPR)', icon: EstimatedLoss },
    { id: 4, name: 'Infrastructure destroyed', icon: InfrastructureDestroyed },
    { id: 5, name: 'Livestock destroyed', icon: LiveStockDestroyed },
    { id: 6, name: 'Injured people', icon: InjuredPerson },
    { id: 7, name: 'Missing people', icon: MissingPerson },
];


const mapStateToProps = state => ({
    language: languageSelector(state),
});


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
        clearValues,
        inputSearch,
        language: { language } } = props;


    const [selectName, setSelectName] = useState(dropdownOption[0].label);
    const [dropDownValues, setDropdownValues] = useState([]);

    // eslint-disable-next-line max-len
    const [dropDownPlaceHolder, setdropDownPlaceHolder] = useState<string | undefined | null>(placeholder);
    // eslint-disable-next-line no-unused-expressions
    useEffect(() => {
        if (selectOption && setSelectOption) {
            setSelectOption(dropdownOption[0].label, dropdownOption[0].key);
        }
        setDropdownValues(dropdownOption);
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
        setShowOption(false);
    };


    const searchHandler = (e) => {
        const val = e.target.value;
        const str = val.toString();
        const filteredDropdown = dropdownOption.filter(x => x.label.split(' ')[0].toLowerCase().includes(str));
        setShowOption(true);
        setDropdownValues(filteredDropdown);
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
                    && (

                        <Translation>
                            {
                                t => (
                                    <p
                                        className={styles.labelText}
                                        style={!icon ? { width: '98%' } : {}}
                                    >
                                        {t(label)}
                                    </p>
                                )
                            }
                        </Translation>
                    )
                }
                <div
                    className={styles.mainDiv}
                    style={!icon ? { width: '98%' } : {}}
                >
                    <div
                        className={styles.selectDiv}
                        style={dropDownPlaceHolder
                            ? { opacity: 0.5 }
                            : {}
                        }
                    >
                        {icon
                            && (
                                Icons.filter(item => item.name === selectName)[0].name === 'Incidents'
                                    ? (
                                        <Icon
                                            className={styles.icon}
                                            name="warning"
                                        />
                                    ) : (
                                        <span
                                            style={{ padding: '6px 12px' }}
                                        >
                                            <img
                                                style={{ width: '20px', height: '20px' }}
                                                src={Icons.filter(item => item.name === selectName)[0].icon}
                                                alt={Icons.filter(item => item.name === selectName)[0].name}
                                            />
                                        </span>
                                    ))}
                        <div
                            className={styles.selectField}
                        >
                            <Translation>
                                {
                                    t => (
                                        <p
                                            className={styles.selectItem}
                                        >
                                            {
                                                t(dropDownPlaceHolder) || t(selectName)
                                            }

                                        </p>
                                    )
                                }
                            </Translation>


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
                            {
                                inputSearch
                                && (
                                    <input
                                        type="text"
                                        onChange={searchHandler}
                                        id="search"
                                        className={styles.searchBox}
                                        placeholder={language === 'en' ? 'Enter a location' : 'स्थान छनोट गर्नुहोस्'}
                                    />
                                )
                            }
                            <div className={styles.dropDown}>
                                {dropDownValues.map((item, index) => (
                                    <div
                                        className={styles.optionField}
                                        onClick={() => onOptionClick(item, index)}
                                        key={item.label}
                                    >
                                        {
                                            icon
                                            && (
                                                index === 0
                                                    ? (
                                                        <Icon
                                                            className={styles.icon}
                                                            name="warning"
                                                        />
                                                    )
                                                    : (
                                                        <span
                                                            style={{ padding: '6px 12px' }}
                                                        >
                                                            <img
                                                                style={{ width: '20px', height: '20px' }}
                                                                src={Icons[index].icon}
                                                                alt={Icons[index].name}
                                                            />
                                                        </span>

                                                    )
                                            )
                                        }
                                        <Translation>
                                            {
                                                t => (
                                                    <p className={styles.optionName}>
                                                        {
                                                            t(item.label)
                                                        }

                                                    </p>
                                                )
                                            }
                                        </Translation>

                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
            </div>
        </>

    );
};

export default connect(mapStateToProps)(Dropdown);
