import React from 'react';
import styles from './styles.scss';

interface Props {

}

const LossItem = (props: Props) => {
    console.log('props');
    const { lossIcon, lossTitle, loss } = props;
    return (
        <div className={styles.itemContainer}>
            <img src={lossIcon} alt="loss" />
            <hr className={styles.horLine} />
            <ul>
                <li>{lossTitle}</li>
                <li className={styles.large}>{loss}</li>
            </ul>
        </div>
    );
};

export default LossItem;
