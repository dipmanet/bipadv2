import React from 'react';
import PropTypes from 'prop-types';

import Spinner from '#rscv/Spinner';

import styles from './styles.scss';

const Loading = ({ pending, text }) => {
    if (!pending) {
        return null;
    }

    return (
        <div className={styles.loading}>
            <Spinner className={styles.spinner} />
            {text}
        </div>
    );
};

Loading.propTypes = {
    pending: PropTypes.bool,
    text: PropTypes.string,
};

Loading.defaultProps = {
    pending: false,
    text: 'Loading data',
};

export default Loading;
