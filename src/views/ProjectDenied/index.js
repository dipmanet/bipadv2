import React from 'react';
import ReactSVG from 'react-svg';

import _ts from '#ts';

import styles from './styles.scss';

// eslint-disable-next-line react/prefer-stateless-function
export default class ProjectDenied extends React.PureComponent {
    render() {
        return (
            <div className={styles.projectDenied}>
                <h1 className={styles.heading}>
                    {_ts('projectDenied', 'errorThreeHundredThree')}
                </h1>
                <p className={styles.message}>
                    <strong>{_ts('projectDenied', 'message1')}</strong>
                    <br />
                    {_ts('projectDenied', 'message2')}
                </p>
            </div>
        );
    }
}
