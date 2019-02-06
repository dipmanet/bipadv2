import React from 'react';
import ReactSVG from 'react-svg';

import _ts from '#ts';
import { pathNames } from '#constants';

import styles from './styles.scss';

// eslint-disable-next-line react/prefer-stateless-function
export default class FourHundredFour extends React.PureComponent {
    render() {
        return (
            <div className={styles.fourHundredFour}>
                <h1 className={styles.heading}>
                    {_ts('fourHundredFour', 'errorFourHundredFour')}
                </h1>
                <p className={styles.message}>
                    <strong>{_ts('fourHundredFour', 'message1')}</strong>
                    <br />
                    {_ts('fourHundredFour', 'message2')}
                </p>
            </div>
        );
    }
}
