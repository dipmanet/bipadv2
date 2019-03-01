import React from 'react';
import PropTypes from 'prop-types';

import Message from '#rscv/Message';

import styles from './styles.scss';

const propTypes = {
    errorText: PropTypes.string.isRequired,
};

export default class ErrorMessage extends React.PureComponent {
    static propTypes = propTypes;

    render() {
        const {
            errorText,
        } = this.props;

        return (
            <Message className={styles.messageContainer}>
                { errorText }
            </Message>
        );
    }
}
