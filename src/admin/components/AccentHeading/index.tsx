import React from 'react';
import styles from './styles.module.scss';

interface Props{
    content: string;
}

const AccentHeading = (props) => {
    const { content } = props;

    return (
        <div className={styles.headingContainer}>
            <p className={styles.content}>
                {content}
            </p>
        </div>
    );
};

export default AccentHeading;
