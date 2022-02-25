/* eslint-disable max-len */
/* eslint-disable no-tabs */

import React from 'react';
import styles from './styles.scss';


function RootLeftpane({ title }: any) {
    return (
        <>
            <div className={styles.vrSideBar}>
                <div className={styles.leftTopBar} />
                <div className={styles.mainIntroHtmlFromAPI}>
                    <h1 style={{ color: 'white' }}>{title}</h1>

                    <h3>
                        <h3>Home</h3>
                    </h3>
                </div>
            </div>

        </>
    );
}

export default RootLeftpane;
