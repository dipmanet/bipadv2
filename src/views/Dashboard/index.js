import React from 'react';
import styles from './styles.scss';

// eslint-disable-next-line react/prefer-stateless-function
export default class Dashboard extends React.PureComponent {
    render() {
        return (
            <div className={styles.dashboard}>
                Dashboard
            </div>
        );
    }
}
