import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';
import React from 'react';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    // NOTE: PropTypes.object below because TextOutput sometimes gets <DateOutput> as value
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
};

const defaultProps = {
    className: '',
    value: undefined,
};

export default class TextOutput extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    render() {
        const {
            className: classNameFromProps,
            label,
            value,
        } = this.props;

        if (!value) {
            return null;
        }

        return (
            <div className={_cs(classNameFromProps, styles.textOutput)}>
                <div className={styles.label}>
                    { label }
                </div>
                <div className={styles.title}>
                    { value }
                </div>
            </div>
        );
    }
}
