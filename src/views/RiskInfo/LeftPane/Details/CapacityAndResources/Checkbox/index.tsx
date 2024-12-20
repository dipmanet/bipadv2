/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef, useEffect } from 'react';

const Checkbox = ({ label, value, onChange, checkedCategory, checkedMainCategoryIndex,
    showIndeterminateButton, index, ownIndex, disableCheckbox, handleCheckboxCondition }) => {
    const checkboxRef = useRef();
    const CHECKBOX_STATES = {
        Checked: 'Checked',
        Indeterminate: 'Indeterminate',
        Empty: 'Empty',
    };


    useEffect(() => {
        if (checkedMainCategoryIndex.includes(ownIndex)) {
            checkboxRef.current.checked = true;
            checkboxRef.current.indeterminate = false;
        } else if (index.includes(ownIndex)) {
            checkboxRef.current.checked = false;
            checkboxRef.current.indeterminate = true;
        } else {
            checkboxRef.current.checked = false;
            checkboxRef.current.indeterminate = false;
        }
    }, [CHECKBOX_STATES.Checked, CHECKBOX_STATES.Empty,
        CHECKBOX_STATES.Indeterminate, checkedCategory,
        checkedMainCategoryIndex, index, ownIndex,
        showIndeterminateButton, value]);

    return (

        <input ref={checkboxRef} type="checkbox" style={{ height: '1rem', width: '1rem' }} onChange={onChange} disabled={disableCheckbox} />

    );
};

export default Checkbox;
