import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const Loading = ({ pending }) => (
    <React.Fragment>
        {
            pending &&
            <div className={styles.loading}>Fetching data</div>
        }
    </React.Fragment>
);

Loading.propTypes = {
    pending: PropTypes.bool,
};

Loading.defaultProps = {
    pending: false,
};

export default Loading;
