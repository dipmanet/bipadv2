import React from 'react';

import {
    _cs,
} from '@togglecorp/fujs';

import styles from './styles.scss';

interface Props {
    dataCount: number;
}

const Header = (props: Props) => {
    const {
        dataCount,
    } = props;
    return (
        <header className={styles.header}>
            <div className={styles.tabs}>
                <div
                    className={_cs(styles.tab, styles.active)}
                >
                    <div className={styles.value}>
                        { dataCount }
                    </div>
                    <div className={styles.title}>
                        <div className={styles.text}>
                            Total Events
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
