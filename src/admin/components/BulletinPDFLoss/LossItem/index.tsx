import { getNumbers } from '@togglecorp/fujs';
import React from 'react';
import styles from './styles.scss';

interface Props {

}

const getFormttedNumbers = (n) => {
    if (Number(n) > 10000000) {
        return ((Number(n) / 10000000).toLocaleString());
    } if (Number(n) > 100000) {
        return ((Number(n) / 100000).toLocaleString());
    } if (Number(n) > 1000) {
        return ((Number(n) / 1000).toLocaleString());
    }
    return n;
};

const getUnit = (n) => {
    if (Number(n) > 10000000) {
        return ('करोड');
    } if (Number(n) > 100000) {
        return ('लाख');
    } if (Number(n) > 1000) {
        return ('हजार');
    }
    return '';
};

const LossItem = (props: Props) => {
    const { lossIcon, lossTitle, loss } = props;
    return (
        <div className={styles.itemContainer}>
            <img src={lossIcon} alt="loss" />
            <hr className={styles.horLine} />
            <ul>
                <li>{lossTitle}</li>
                <li className={styles.large}>
                    {
                        getFormttedNumbers(loss)
                    }
                    <span style={{ fontSize: '12px' }}>{getUnit(loss)}</span>

                </li>
            </ul>
        </div>
    );
};

export default LossItem;
