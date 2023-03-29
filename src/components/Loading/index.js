import React from 'react';
import { Translation } from 'react-i18next';
import PropTypes from 'prop-types';

import Spinner from '#rsu/../v2/View/Spinner';
import styles from './styles.scss';



const Loading = ({ pending, text }) => {
    if (!pending) {
        return null;
    }

    return (
        <div className={styles.loading}>
            <Spinner
                size="large"
                className={styles.spinner}
            />
            <Translation>
                {
                    t => (
                        <div className={styles.text}>
                            {t(text)}
                        </div>
                    )
                }

            </Translation>

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
