import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

const propTypes = {
    progress: PropTypes.number,
};

const defaultProps = {
    progress: 0,
};


export default class Seekbar extends React.PureComponent {
    render() {
        const {
            className,
            progress: progressFromProps,
        } = this.props;

        const progress = Math.min(100, Math.max(0, progressFromProps));

        return (
            <div className={_cs(className, styles.seekbar)}>
                <div
                    style={{
                        width: `${progress}%`,
                    }}
                    className={styles.progress}
                />
            </div>
        );
    }
}
