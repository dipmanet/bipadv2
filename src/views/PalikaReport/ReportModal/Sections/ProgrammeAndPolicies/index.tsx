/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import styles from './styles.scss';

interface Props{

}

const ProgramPolicies = (props: Props) => {
    const { updateTab } = props;

    const [pointOne, setpointOne] = useState('');
    const [pointTwo, setpointTwo] = useState('');
    const [pointThree, setpointThree] = useState('');

    const handlePointOne = (data) => {
        setpointOne(data.target.value);
    };
    const handlePointTwo = (data) => {
        setpointTwo(data.target.value);
    };
    const handlePointThree = (data) => {
        setpointThree(data.target.value);
    };


    const handleDataSave = () => {
        updateTab();
    };

    return (
        <>
            <h2>Annual Program and Policy</h2>
            <p>Disaster related policy points of current fiscal year</p>
            <div className={styles.inputContainer}>
                <label className={styles.label}>
                                 Point 1
                    <input
                        type="text"
                        className={styles.inputElement}
                        onChange={handlePointOne}
                        placeholder={'Kindly specify Point 1'}
                        value={pointOne}
                    />

                </label>
            </div>
            <div className={styles.inputContainer}>
                <label className={styles.label}>
                                 Point 2
                    <input
                        type="text"
                        className={styles.inputElement}
                        onChange={handlePointTwo}
                        placeholder={'Kindly specify Point 2'}
                        value={pointTwo}
                    />

                </label>
            </div>
            <div className={styles.inputContainer}>
                <label className={styles.label}>
                                 Point 3
                    <input
                        type="text"
                        className={styles.inputElement}
                        onChange={handlePointThree}
                        placeholder={'Kindly specify Point 3'}
                        value={pointThree}
                    />

                </label>
            </div>
            <button
                type="button"
                onClick={handleDataSave}
                className={styles.savebtn}
            >
                            Save and Proceed
            </button>

        </>
    );
};

export default ProgramPolicies;
