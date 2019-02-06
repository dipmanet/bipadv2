import React from 'react';
import ReactSVG from 'react-svg';

import _ts from '#ts';
import { pathNames } from '#constants';

import styles from './styles.scss';

// eslint-disable-next-line react/prefer-stateless-function
export default class FourHundredThree extends React.PureComponent {
    render() {
        return (
            <div className={styles.fourHundredThree}>
                <h1 className={styles.heading}>
                    {_ts('fourHundredThree', 'errorThreeHundredThree')}
                </h1>
                <p className={styles.message}>
                    <strong>{_ts('fourHundredThree', 'message1')}</strong>
                    <br />
                    {_ts('fourHundredThree', 'message2')}
                </p>
            </div>
        );
    }
}
