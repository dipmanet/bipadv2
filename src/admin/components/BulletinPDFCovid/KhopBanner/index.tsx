import React from 'react';
import styles from './styles.scss';

const KhopBanner = (props) => {
    const { value, title, percentage } = props;
    return (
        <div className={styles.khopContainer}>
            <div>
                <h2>{value}</h2>
                {percentage
                    ? (
                        <p className={styles.small}>
                            {`पहिलो मात्रा को ${percentage} %`}
                            {' '}
                        </p>
                    ) : (<p>{' '}</p>)
                }
            </div>
            <p>{title}</p>
        </div>
    );
};

export default KhopBanner;
