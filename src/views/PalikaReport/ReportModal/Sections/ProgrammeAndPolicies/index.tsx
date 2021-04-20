/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import styles from './styles.scss';

import {
    setProgramAndPolicyDataAction,
} from '#actionCreators';
import {
    programAndPolicySelector,
} from '#selectors';

const mapStateToProps = state => ({
    programAndPolicyData: programAndPolicySelector(state),
});

const mapDispatchToProps = dispatch => ({
    setProgramData: params => dispatch(setProgramAndPolicyDataAction(params)),
});


interface Props{

}

const ProgramPolicies = (props: Props) => {
    const {
        programAndPolicyData,
        setProgramData,
        updateTab,
    } = props;

    const [inputList, setInputList] = useState([{ firstName: '', lastName: '' }]);

    useEffect(() => {
        if (!('pointOne' in programAndPolicyData)) {
            setInputList(programAndPolicyData);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleNext = () => {
        updateTab();
    };
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
        setProgramData(inputList);
    };

    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setInputList([...inputList, { firstName: '', lastName: '' }]);
    };

    return (
        <div className={styles.pApContainer}>
            <h2>Annual Program and Policy</h2>
            <p>DRR programmes listed in the annual policy and programme</p>
            {inputList.map((x, i) => (

                <>
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>
                            <input
                                name="firstName"
                                placeholder="Enter Policy Point"
                                value={x.firstName}
                                onChange={e => handleInputChange(e, i)}
                            />
                        </label>
                    </div>


                    <div className="btn-box">
                        {inputList.length !== 1 && (
                            <button
                                type="button"
                                className="mr10"
                                onClick={() => handleRemoveClick(i)}
                            >
                                Remove Policy Point
                            </button>
                        )}
                        {inputList.length - 1 === i && (
                            <button
                                type="button"
                                onClick={handleAddClick}
                            >
                            Add Policy Point
                            </button>
                        )}
                    </div>
                </>
            ))}
            <div className={styles.btns}>
                <button
                    type="button"
                    onClick={handleNext}
                    className={styles.savebtn}
                >
                    Next
                </button>
            </div>

        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProgramPolicies);
