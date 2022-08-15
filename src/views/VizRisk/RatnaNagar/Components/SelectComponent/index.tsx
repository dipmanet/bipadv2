// import React, { useContext } from 'react';
// import { MainPageDataContext } from '../../context';
// import styles from './styles.scss';

// const SelectComponent = (props) => {
//     const { selectFieldValues, selctFieldCurrentValue, setSelctFieldCurrentValue } = props;
//     const {
//         setSelectFieldValue,
//     } = useContext(MainPageDataContext);
//     return (
//         <div className={styles.selectComponent}>
//             <select
//                 className={styles.mainSelect}
//                 value={selctFieldCurrentValue}
//                 onChange={(e) => {
//                     setSelctFieldCurrentValue(e.target.value);
//                     setSelectFieldValue(e.target.value);
//                 }}
//             >
//                 <option value="Select" defaultValue={'Select'} disabled>Select</option>
//                 {
//                     selectFieldValues.map(item => (
//                         <option
//                             className={styles.mainOptions}
//                             key={`select-${item}`}
//                             value={item}
//                         >
//                             {item}

//                         </option>
//                     ))
//                 }
//             </select>
//         </div>
//     );
// };
// export default SelectComponent;
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useEffect, useRef, useState } from 'react';
import Icon from '#rscg/Icon';
import styles from './styles.scss';
import { MainPageDataContext } from '../../context';

const SelectComponent = (props) => {
    const [showOption, setShowOption] = useState(false);
    const optionShowRef = useRef(null);
    const {
        setSelectFieldValue,
    } = useContext(MainPageDataContext);
    const { selectFieldValues, selctFieldCurrentValue, setSelctFieldCurrentValue } = props;
    // eslint-disable-next-line no-unused-expressions
    // useEffect(() => {
    //     if (selectOption.name === '' || selectOption.key === '') {
    //         setSelectOption(lossMetrics[0].label, lossMetrics[0].key);
    //     }
    // }, []);

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

    const onOptionClick = (itemVal: string) => {
        setSelctFieldCurrentValue(itemVal);
        setSelectFieldValue(itemVal);
    };

    return (
        <>

            <div
                className={styles.selectContainer}
                ref={optionShowRef}
            >
                <div className={styles.mainDiv}>
                    <div className={styles.selectDiv}>
                        <div
                            className={styles.selectField}
                            onClick={onSelectClick}
                        >
                            <p className={styles.selectItem}>
                                {
                                    selctFieldCurrentValue
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
                            {selectFieldValues.map(item => (
                                <div
                                    className={styles.optionField}
                                    onClick={() => onOptionClick(item)}
                                    key={item}
                                >
                                    <p className={styles.optionName}>{item}</p>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div>
        </>

    );
};

export default SelectComponent;
