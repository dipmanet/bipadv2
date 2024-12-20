import React from 'react';
import Icon from '#rscg/Icon';

import styles from './styles.scss';

interface Props {
    message: string;
}
const ErrorMessage = (props: Props) => {
    const { message } = props;
    return (
        <div className={styles.errorMessage}>
            <Icon
                className={styles.infoIcon}
                name="info"
            />
            {message}
        </div>
    );
};

export default ErrorMessage;
