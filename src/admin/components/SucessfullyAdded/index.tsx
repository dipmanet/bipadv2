import React, { useRef, useState } from 'react';
import styles from './styles.module.scss';

export default function index(props) {
    const { handleOK } = props;
    return (
        <>
            {
                <div className={styles.successFullyAdded}>
                    <p className={styles.successfulAdd}>SucessFully Added</p>
                    <button className={styles.okHandler} type="submit" onClick={handleOK}>OK</button>
                </div>

            }

        </>
    );
}
