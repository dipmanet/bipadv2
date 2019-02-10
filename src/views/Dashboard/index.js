import React from 'react';
import Map from '#components/ProjectsMap';

import styles from './styles.scss';


// eslint-disable-next-line react/prefer-stateless-function
export default class Dashboard extends React.PureComponent {
    render() {
        return (
            <div className={styles.dashboard}>
                <Map className={styles.map} />
            </div>
        );
    }
}
