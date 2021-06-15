import { _cs } from '@togglecorp/fujs';
import React, { useState } from 'react';
import styles from './styles.scss';

const HexagonBtn = (props) => {
    console.log(props);
    return (
        <div className={styles.hex}>
            <div className={_cs('inner', 'hex')}>
                <div className={_cs('inner2', 'hex')} />
            </div>
        </div>
    );
};

export default HexagonBtn;
