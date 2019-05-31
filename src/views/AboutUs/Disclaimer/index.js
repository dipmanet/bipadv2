import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

export default class Disclaimer extends React.PureComponent {
    render() {
        const { className } = this.props;

        return (
            <div className={_cs(styles.disclaimer, className)}>
                <header className={styles.header}>
                    <h2 className={styles.heading}>
                        Disclaimer
                    </h2>
                </header>
                <div className={styles.content}>
                    <p>
                        The data/information used in the system are under
                        the process of verification.
                    </p>
                </div>
            </div>
        );
    }
}
