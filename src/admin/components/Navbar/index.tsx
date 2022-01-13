import React from 'react';

import styles from './styles.module.scss';

const index = () => (
    <>
        <div className={styles.mainNavBar}>
            <div className={styles.navLeftSide}>
                <div className={styles.navLogo}>
                    <div className={styles.colorBar} />
                    <div className={styles.bipdLogoName}>BIPAD Portal</div>
                    <div className={styles.shortInfo}>
                        <p>Building Information</p>
                        <p>Platform Against Disasters</p>
                    </div>
                </div>
            </div>
        </div>
    </>
);
export default index;
