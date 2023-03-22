import React from 'react';
import styles from './styles.scss';

interface Props {
    municipalityName: string;
    factorScore: number;
    scoreStatus: string;
    color?: string;
}

const Factors = (props: Props) => {
    const { municipalityName, factorScore, scoreStatus, color } = props;

    return (
        <div className={styles.factorContainer}>
            <h2 className={styles.content}>{municipalityName}</h2>
            <div className={styles.score} style={{ backgroundColor: color }}>
                <div className={styles.mainScore}>{factorScore}</div>
                <p className={styles.status}>
                    {scoreStatus}
                    {' '}
                    on Average
                </p>
            </div>
        </div>
    );
};

export default Factors;
